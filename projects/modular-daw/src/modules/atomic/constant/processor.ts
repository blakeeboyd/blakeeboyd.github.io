import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const constantFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'constant-processor', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: { value: params.value ?? 0 },
    });

    const valueParam = node.parameters.get('value')!;

    return {
      inputs: {},
      outputs: { out: node },
      setParameter(id, value, t) {
        if (id === 'value') {
          valueParam.setTargetAtTime(value, t, 0.02);
        }
      },
      dispose() { node.disconnect(); },
    };
  },
};
