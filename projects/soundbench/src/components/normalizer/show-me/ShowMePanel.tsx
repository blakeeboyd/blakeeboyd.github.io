import type { AudioFileEntry, NormalizationType } from '@/types/normalizer';
import type { WaveformEnvelope } from '@/types/waveform';
import { WaveformCanvas } from './WaveformCanvas';
import { GainReadout } from './GainReadout';
import { LufsMeter } from './LufsMeter';

interface ShowMePanelProps {
  file: AudioFileEntry;
  envelope: WaveformEnvelope;
  normalizeType: NormalizationType;
  targetValue: number;
  normalizeEnabled: boolean;
  additionalProcessing: string[];  // e.g. ['silence trimming', 'limiting']
  onClose: () => void;
}

function isLufsType(type: NormalizationType): boolean {
  return type === 'lufs-i' || type === 'lufs-m-max' || type === 'lufs-s-max';
}

function getTypeLabel(type: NormalizationType): string {
  switch (type) {
    case 'lufs-i': return 'LUFS-I (integrated loudness)';
    case 'lufs-m-max': return 'LUFS-M max (momentary)';
    case 'lufs-s-max': return 'LUFS-S max (short-term)';
    case 'peak': return 'peak';
    case 'true-peak': return 'true peak';
    case 'rms-i': return 'RMS';
    default: return type;
  }
}

function joinParts(parts: string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}

export function ShowMePanel({
  file,
  envelope,
  normalizeType,
  targetValue,
  normalizeEnabled,
  additionalProcessing,
  onClose,
}: ShowMePanelProps) {
  const appliedGainDb = file.appliedGainDb ?? 0;
  const gainLinear = Math.pow(10, appliedGainDb / 20);
  const inputLufs = file.inputMeasurements?.lufsI;
  const outputLufs = file.outputMeasurements?.lufsI;

  return (
    <div className="norm-showme">
      <div className="norm-showme__header">
        <h3 className="norm-showme__title">
          Show Me
          <span className="norm-showme__filename">{file.name}</span>
        </h3>
        <button className="norm-showme__close" onClick={onClose}>&times;</button>
      </div>

      <div className="norm-showme__body">
        {/* What happened */}
        <div className="norm-showme__section">
          <h4 className="norm-showme__section-title">What happened</h4>
          <p className="norm-showme__text">
            {normalizeEnabled && inputLufs !== undefined && outputLufs !== undefined ? (
              <>
                This file was normalized from <strong>{inputLufs.toFixed(1)} LUFS</strong> to{' '}
                <strong>{outputLufs.toFixed(1)} LUFS</strong> using {getTypeLabel(normalizeType)} normalization
                with a target of {targetValue} {isLufsType(normalizeType) ? 'LUFS' : 'dB'}.
                Every sample was multiplied by the same number.
              </>
            ) : appliedGainDb === 0 ? (
              <>No gain change was applied to this file.</>
            ) : (
              <>
                A gain of <strong>{appliedGainDb >= 0 ? '+' : ''}{appliedGainDb.toFixed(1)} dB</strong> was
                applied to this file. Every sample was multiplied by the same number.
              </>
            )}
          </p>
        </div>

        {/* Waveform overlay */}
        <div className="norm-showme__section">
          <h4 className="norm-showme__section-title">Before &amp; After</h4>
          <WaveformCanvas
            envelope={envelope}
            gainLinear={gainLinear}
            className="norm-showme__waveform"
          />
          <p className="norm-showme__text" style={{ fontSize: '0.7rem' }}>
            Dim: original waveform. Bright: after normalization gain.
            {gainLinear > 1 && ' Red indicates samples that would exceed 0 dBFS (clipping).'}
          </p>
        </div>

        {/* Gain readout */}
        <div className="norm-showme__section">
          <h4 className="norm-showme__section-title">The math</h4>
          <GainReadout appliedGainDb={appliedGainDb} />
        </div>

        {/* LUFS meter */}
        {normalizeEnabled && isLufsType(normalizeType) && inputLufs !== undefined && outputLufs !== undefined && (
          <div className="norm-showme__section">
            <h4 className="norm-showme__section-title">Loudness position</h4>
            <LufsMeter
              inputLufs={inputLufs}
              outputLufs={outputLufs}
              targetLufs={targetValue}
              className="norm-showme__meter"
            />
            <p className="norm-showme__text" style={{ fontSize: '0.7rem' }}>
              Amber: input loudness. Purple (dashed): target. Green: output loudness.
            </p>
          </div>
        )}

        {/* Why LUFS? */}
        {normalizeEnabled && isLufsType(normalizeType) && (
          <div className="norm-showme__section">
            <h4 className="norm-showme__section-title">Why LUFS?</h4>
            <p className="norm-showme__text">
              LUFS measures <strong>perceived loudness</strong> over time, accounting for how human hearing
              works (we're more sensitive to midrange frequencies than to very low or very high ones). Peak
              normalization only looks at the loudest single sample, which says nothing about how loud the
              audio actually <em>sounds</em>. A snare drum hit can have a very high peak level but doesn't
              sound "loud" because it's a brief spike. A sustained organ chord at a lower peak level sounds
              much louder because it sustains.
            </p>
            <p className="norm-showme__text">
              This is why streaming platforms (Spotify, Apple Music, YouTube) all use LUFS to decide playback
              volume. They measure the integrated loudness of your track and adjust it to their target. If
              your track is louder than the target, they turn it down. Matching the target from the start
              means your master plays back as intended.
            </p>
          </div>
        )}

        {/* What was preserved */}
        <div className="norm-showme__section">
          <h4 className="norm-showme__section-title">What normalization preserves</h4>
          <p className="norm-showme__text">
            Normalization is the simplest mastering process: a single gain change applied uniformly to every
            sample. It preserves <strong>frequency content</strong> (no EQ), <strong>dynamic range</strong>{' '}
            (the difference between loud and quiet parts stays the same), and the <strong>stereo image</strong>{' '}
            (the spatial balance between left and right). Only the overall level changes.
          </p>
        </div>

        {/* Additional processing note */}
        {additionalProcessing.length > 0 && (
          <div className="norm-showme__note">
            The waveform above shows only the normalization gain. This file also had{' '}
            {joinParts(additionalProcessing)} applied, which further shaped the output.
          </div>
        )}
      </div>
    </div>
  );
}
