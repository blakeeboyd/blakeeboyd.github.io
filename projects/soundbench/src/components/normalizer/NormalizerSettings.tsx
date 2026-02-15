import { useNormalizerStore } from '@/store/normalizer-store';
import { PresetManager } from './PresetManager';
import { NormalizeSection } from './NormalizeSection';
import { TrimPadSection } from './TrimPadSection';
import { LimiterSection } from './LimiterSection';
import { OutputSection } from './OutputSection';

export function NormalizerSettings() {
  const fileCount = useNormalizerStore(s => s.files.length);
  const normalize = useNormalizerStore(s => s.normalize);
  const trimFade = useNormalizerStore(s => s.trimFade);
  const limiter = useNormalizerStore(s => s.limiter);
  const output = useNormalizerStore(s => s.output);
  const setNormalize = useNormalizerStore(s => s.setNormalize);
  const setTrimFade = useNormalizerStore(s => s.setTrimFade);
  const setLimiter = useNormalizerStore(s => s.setLimiter);
  const setOutput = useNormalizerStore(s => s.setOutput);

  return (
    <div className="norm-settings">
      <PresetManager />
      <NormalizeSection settings={normalize} onChange={setNormalize} fileCount={fileCount} />
      <TrimPadSection settings={trimFade} onChange={setTrimFade} />
      <LimiterSection settings={limiter} onChange={setLimiter} fileCount={fileCount} />
      <OutputSection settings={output} onChange={setOutput} />
    </div>
  );
}
