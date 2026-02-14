import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const gainComputerFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'gain-computer-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        threshold: params.threshold ?? -18,
        ratio: params.ratio ?? 4,
      },
    });

    const thresholdParam = node.parameters.get('threshold')!;
    const ratioParam = node.parameters.get('ratio')!;

    return {
      inputs: { in: node },
      outputs: { out: node },
      setParameter(id, value, t) {
        switch (id) {
          case 'threshold':
            thresholdParam.setTargetAtTime(value, t, 0.02);
            break;
          case 'ratio':
            ratioParam.setTargetAtTime(value, t, 0.02);
            break;
        }
      },
      dispose() { node.disconnect(); },
    };
  },
};
