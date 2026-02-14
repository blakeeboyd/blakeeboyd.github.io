import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const dbToLinFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'db-to-lin-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    return {
      inputs: { in: node },
      outputs: { out: node },
      setParameter() {},
      dispose() { node.disconnect(); },
    };
  },
};
