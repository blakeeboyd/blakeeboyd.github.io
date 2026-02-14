import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const monoSumFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Merge stereo to mono at -3dB
    const merger = ctx.createChannelMerger(1);
    const attenuator = ctx.createGain();
    attenuator.gain.value = 0.707; // -3dB

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    inputNode.connect(attenuator);
    attenuator.connect(merger);
    merger.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter() {},
      dispose() {
        inputNode.disconnect();
        attenuator.disconnect();
        merger.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
