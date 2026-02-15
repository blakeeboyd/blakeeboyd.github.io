/**
 * Batch gain calculations for multi-file normalization modes.
 *
 * Runs on the main thread (trivial arithmetic, needs access to all file measurements).
 */

import type {
  AudioFileMeasurements,
  NormalizationType,
  NormalizeCondition,
} from '@/types/normalizer';

interface BatchFileInfo {
  measurements: AudioFileMeasurements;
  durationSec: number;
}

function getLevelForType(measurements: AudioFileMeasurements, type: NormalizationType): number {
  switch (type) {
    case 'lufs-i': return measurements.lufsI;
    case 'lufs-m-max': return measurements.lufsMMax;
    case 'lufs-s-max': return measurements.lufsSMax;
    case 'rms-i': return measurements.rmsDb;
    case 'peak': return measurements.peakDb;
    case 'true-peak': return measurements.truePeakDb;
    default: return measurements.lufsI;
  }
}

function checkCondition(level: number, targetValue: number, condition: NormalizeCondition): boolean {
  if (condition === 'too-loud' && level <= targetValue) return false;
  if (condition === 'too-quiet' && level >= targetValue) return false;
  return true;
}

/**
 * "To loudest" mode: find the file with the highest level for the chosen metric,
 * calculate gain to bring that file to the target, and apply the same gain to all files.
 * Preserves relative loudness between tracks (album normalization).
 */
export function computeLoudestGain(
  files: BatchFileInfo[],
  normType: NormalizationType,
  targetValue: number,
  condition: NormalizeCondition,
): number | null {
  let loudestLevel = -Infinity;

  for (const file of files) {
    const level = getLevelForType(file.measurements, normType);
    if (isFinite(level) && level > loudestLevel) {
      loudestLevel = level;
    }
  }

  if (!isFinite(loudestLevel)) return null;
  if (!checkCondition(loudestLevel, targetValue, condition)) return null;

  return targetValue - loudestLevel;
}

/**
 * "Album" / combined program mode: compute the energy-weighted mean loudness
 * across all files (as if they were concatenated), then derive a single gain.
 *
 * For LUFS types, uses the ITU-R BS.1770 energy averaging formula:
 *   combinedLufs = -0.691 + 10 * log10(Σ(10^((lufs+0.691)/10) * duration) / Σ(duration))
 *
 * For peak/RMS types, uses the max across all files (same as loudest mode).
 */
export function computeAlbumGain(
  files: BatchFileInfo[],
  normType: NormalizationType,
  targetValue: number,
  condition: NormalizeCondition,
): number | null {
  const isLufsType = normType === 'lufs-i' || normType === 'lufs-m-max' || normType === 'lufs-s-max';

  if (!isLufsType) {
    // For non-LUFS types, "combined" doesn't have a meaningful definition.
    // Fall back to loudest-file behavior.
    return computeLoudestGain(files, normType, targetValue, condition);
  }

  // Energy-weighted LUFS average
  let totalEnergy = 0;
  let totalDuration = 0;

  for (const file of files) {
    const lufs = getLevelForType(file.measurements, normType);
    if (!isFinite(lufs)) continue;
    // Convert LUFS to energy: 10^((lufs + 0.691) / 10)
    const energy = Math.pow(10, (lufs + 0.691) / 10);
    totalEnergy += energy * file.durationSec;
    totalDuration += file.durationSec;
  }

  if (totalDuration === 0) return null;

  const combinedLufs = -0.691 + 10 * Math.log10(totalEnergy / totalDuration);

  if (!isFinite(combinedLufs)) return null;
  if (!checkCondition(combinedLufs, targetValue, condition)) return null;

  return targetValue - combinedLufs;
}

/**
 * Compute batch limiter reduction for "together" limiting mode.
 *
 * After normalization gains are applied, predicts each file's post-normalization peak.
 * If any file's predicted peak exceeds the ceiling, returns the additional gain reduction
 * needed to bring the worst-case peak to the ceiling. Applied uniformly to all files
 * to preserve relative loudness.
 */
export function computeBatchLimiterReduction(
  files: BatchFileInfo[],
  appliedGainDb: number,
  ceiling: number,
  useTruePeak: boolean,
): number {
  let worstPeak = -Infinity;

  for (const file of files) {
    const basePeak = useTruePeak ? file.measurements.truePeakDb : file.measurements.peakDb;
    const predictedPeak = basePeak + appliedGainDb;
    if (predictedPeak > worstPeak) {
      worstPeak = predictedPeak;
    }
  }

  if (!isFinite(worstPeak) || worstPeak <= ceiling) {
    return 0;
  }

  return ceiling - worstPeak;
}
