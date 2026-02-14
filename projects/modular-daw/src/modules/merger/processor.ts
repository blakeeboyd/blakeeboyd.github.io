import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const mergerFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const merger = ctx.createChannelMerger(2);

    // Input gain nodes for each channel
    const leftGain = ctx.createGain();
    leftGain.gain.value = 1;
    const rightGain = ctx.createGain();
    rightGain.gain.value = 1;

    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);

    return {
      inputs: { left: leftGain, right: rightGain },
      outputs: { out: merger },
      setParameter() { /* no parameters */ },
      dispose() {
        leftGain.disconnect();
        rightGain.disconnect();
        merger.disconnect();
      },
    };
  },
};
