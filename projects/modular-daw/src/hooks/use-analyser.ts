import { useMemo } from 'react';
import { getEngine } from './use-audio-engine';

/**
 * Get the AnalyserNode for a metering module.
 * Returns null if the engine isn't initialized or the processor
 * doesn't expose an analyser.
 */
export function useAnalyser(nodeId: string): AnalyserNode | null {
  return useMemo(() => {
    const engine = getEngine();
    if (!engine) return null;
    const proc = engine.getProcessor(nodeId);
    return proc?.getAnalyserNode?.() ?? null;
  }, [nodeId]);
}
