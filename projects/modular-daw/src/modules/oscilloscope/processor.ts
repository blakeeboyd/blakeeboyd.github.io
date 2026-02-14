import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const oscilloscopeFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Passthrough with analyser tap
    inputNode.connect(analyser);
    analyser.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter() {},
      getAnalyserNode() {
        return analyser;
      },
      dispose() {
        inputNode.disconnect();
        analyser.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
