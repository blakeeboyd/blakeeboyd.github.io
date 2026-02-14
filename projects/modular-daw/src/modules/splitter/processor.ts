import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const splitterFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const splitter = ctx.createChannelSplitter(2);

    // Output gain nodes for each channel
    const leftGain = ctx.createGain();
    leftGain.gain.value = 1;
    const rightGain = ctx.createGain();
    rightGain.gain.value = 1;

    splitter.connect(leftGain, 0);
    splitter.connect(rightGain, 1);

    return {
      inputs: { in: splitter },
      outputs: { left: leftGain, right: rightGain },
      setParameter() { /* no parameters */ },
      dispose() {
        splitter.disconnect();
        leftGain.disconnect();
        rightGain.disconnect();
      },
    };
  },
};
