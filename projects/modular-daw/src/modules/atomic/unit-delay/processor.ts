import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const unitDelayFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'unit-delay-processor', {
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
