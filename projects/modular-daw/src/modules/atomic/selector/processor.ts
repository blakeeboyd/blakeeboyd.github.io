import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

export const selectorFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = new AudioWorkletNode(ctx, 'selector-processor', {
      numberOfInputs: 3,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    const inputA = ctx.createGain();
    inputA.gain.value = 1;
    const inputB = ctx.createGain();
    inputB.gain.value = 1;
    const inputCtrl = ctx.createGain();
    inputCtrl.gain.value = 1;
    inputA.connect(node, 0, 0);
    inputB.connect(node, 0, 1);
    inputCtrl.connect(node, 0, 2);

    return {
      inputs: { a: inputA, b: inputB, ctrl: inputCtrl },
      outputs: { out: node },
      setParameter() {},
      dispose() {
        inputA.disconnect();
        inputB.disconnect();
        inputCtrl.disconnect();
        node.disconnect();
      },
    };
  },
};
