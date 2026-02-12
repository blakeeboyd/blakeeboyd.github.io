import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { dbToLinear } from '../../audio/engine';

export const masterOutputFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const gainNode = ctx.createGain();
    gainNode.gain.value = dbToLinear(params.volume ?? 0);
    gainNode.connect(ctx.destination);

    return {
      inputs: { in: gainNode },
      outputs: {},
      setParameter(id, value, time) {
        if (id === 'volume') {
          gainNode.gain.setTargetAtTime(dbToLinear(value), time, 0.02);
        }
      },
      dispose() {
        gainNode.disconnect();
      },
    };
  },
};
