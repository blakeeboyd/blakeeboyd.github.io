import type { ChannelFormat } from '../types/graph';

/**
 * Creates an adapter node when source and target channel formats differ.
 * - Mono to stereo: native Web Audio upmix (no adapter needed).
 * - Stereo to mono: ChannelSplitter -> sum L+R at -3dB.
 *
 * Returns null if no adapter is needed (same format or mono->stereo).
 */
export function createChannelAdapter(
  ctx: AudioContext,
  sourceFormat: ChannelFormat,
  targetFormat: ChannelFormat,
): { input: AudioNode; output: AudioNode } | null {
  if (sourceFormat === targetFormat) return null;
  if (sourceFormat === 'mono' && targetFormat === 'stereo') return null;

  // Stereo to mono: split and sum at -3dB
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(1);
  const leftGain = ctx.createGain();
  const rightGain = ctx.createGain();

  // -3dB = ~0.707
  leftGain.gain.value = 0.707;
  rightGain.gain.value = 0.707;

  splitter.connect(leftGain, 0);
  splitter.connect(rightGain, 1);
  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 0);

  return { input: splitter, output: merger };
}
