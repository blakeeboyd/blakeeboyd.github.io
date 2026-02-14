import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const envelopeDetectorFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'envelope-detector-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        attack: params.attack ?? 0.003,
        release: params.release ?? 0.25,
      },
    });

    const attackParam = node.parameters.get('attack')!;
    const releaseParam = node.parameters.get('release')!;

    return {
      inputs: { in: node },
      outputs: { out: node },
      setParameter(id, value, t) {
        switch (id) {
          case 'attack':
            attackParam.setTargetAtTime(value, t, 0.02);
            break;
          case 'release':
            releaseParam.setTargetAtTime(value, t, 0.02);
            break;
        }
      },
      dispose() { node.disconnect(); },
    };
  },
};
