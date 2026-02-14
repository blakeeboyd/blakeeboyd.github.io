import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const abCompareFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const select = params.select ?? 0;

    const inputA = ctx.createGain();
    inputA.gain.value = select === 0 ? 1 : 0;

    const inputB = ctx.createGain();
    inputB.gain.value = select === 1 ? 1 : 0;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    inputA.connect(outputNode);
    inputB.connect(outputNode);

    return {
      inputs: { a: inputA, b: inputB },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        if (id === 'select') {
          const isB = value >= 0.5;
          inputA.gain.setTargetAtTime(isB ? 0 : 1, t, 0.02);
          inputB.gain.setTargetAtTime(isB ? 1 : 0, t, 0.02);
        }
      },
      dispose() {
        inputA.disconnect();
        inputB.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
