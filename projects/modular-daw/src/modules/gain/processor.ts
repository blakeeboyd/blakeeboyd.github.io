import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { dbToLinear } from '../../audio/engine';

export const gainFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const gainNode = ctx.createGain();
    gainNode.gain.value = dbToLinear(params.gain ?? 0);

    return {
      inputs: {
        in: gainNode,
        'gain-cv': gainNode.gain,
      },
      outputs: { out: gainNode },
      setParameter(id, value, time) {
        if (id === 'gain') {
          gainNode.gain.setTargetAtTime(dbToLinear(value), time, 0.02);
        }
      },
      dispose() {
        gainNode.disconnect();
      },
    };
  },
};
