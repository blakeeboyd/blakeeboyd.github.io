import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const spectrumAnalyzerFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const throughNode = ctx.createGain();
    throughNode.gain.value = 1;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    throughNode.connect(analyser);

    return {
      inputs: { in: throughNode },
      outputs: { out: throughNode },
      setParameter() { /* no parameters */ },
      dispose() {
        throughNode.disconnect();
        analyser.disconnect();
      },
      getAnalyserNode() {
        return analyser;
      },
    };
  },
};
