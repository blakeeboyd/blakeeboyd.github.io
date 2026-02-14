import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const probeFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'probe-processor', {
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
