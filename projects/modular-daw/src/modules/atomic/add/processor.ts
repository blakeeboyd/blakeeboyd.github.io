import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const addFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'add-processor', {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    const inputA = ctx.createGain();
    inputA.gain.value = 1;
    const inputB = ctx.createGain();
    inputB.gain.value = 1;
    inputA.connect(node, 0, 0);
    inputB.connect(node, 0, 1);

    return {
      inputs: { a: inputA, b: inputB },
      outputs: { out: node },
      setParameter() {},
      dispose() {
        inputA.disconnect();
        inputB.disconnect();
        node.disconnect();
      },
    };
  },
};
