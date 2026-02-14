import { useNormalizerStore } from '@/store/normalizer-store';
import { NormalizeSection } from './NormalizeSection';
import { LimiterSection } from './LimiterSection';
import { OutputSection } from './OutputSection';

export function NormalizerSettings() {
  const normalize = useNormalizerStore(s => s.normalize);
  const limiter = useNormalizerStore(s => s.limiter);
  const output = useNormalizerStore(s => s.output);
  const setNormalize = useNormalizerStore(s => s.setNormalize);
  const setLimiter = useNormalizerStore(s => s.setLimiter);
  const setOutput = useNormalizerStore(s => s.setOutput);

  return (
    <div className="norm-settings">
      <NormalizeSection settings={normalize} onChange={setNormalize} />
      <LimiterSection settings={limiter} onChange={setLimiter} />
      <OutputSection settings={output} onChange={setOutput} />
    </div>
  );
}
