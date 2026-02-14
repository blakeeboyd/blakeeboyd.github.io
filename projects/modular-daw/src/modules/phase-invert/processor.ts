import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const phaseInvertFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const invertL = params.invertL ?? 1;
    const invertR = params.invertR ?? 1;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Split stereo
    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);

    const leftGain = ctx.createGain();
    leftGain.gain.value = invertL ? -1 : 1;

    const rightGain = ctx.createGain();
    rightGain.gain.value = invertR ? -1 : 1;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    inputNode.connect(splitter);
    splitter.connect(leftGain, 0);
    splitter.connect(rightGain, 1);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        if (id === 'invertL') {
          leftGain.gain.setTargetAtTime(value ? -1 : 1, t, 0.02);
        } else if (id === 'invertR') {
          rightGain.gain.setTargetAtTime(value ? -1 : 1, t, 0.02);
        }
      },
      dispose() {
        inputNode.disconnect();
        splitter.disconnect();
        leftGain.disconnect();
        rightGain.disconnect();
        merger.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
