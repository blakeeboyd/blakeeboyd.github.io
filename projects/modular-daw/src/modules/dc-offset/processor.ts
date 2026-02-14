import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const dcOffsetFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // High-pass at 5 Hz removes DC offset
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 5;
    hpf.Q.value = 0.707;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    inputNode.connect(hpf);
    hpf.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter() {},
      dispose() {
        inputNode.disconnect();
        hpf.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
