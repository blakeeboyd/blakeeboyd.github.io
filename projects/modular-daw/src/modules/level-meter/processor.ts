import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const levelMeterFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    // Passthrough: audio flows through unchanged
    const throughNode = ctx.createGain();
    throughNode.gain.value = 1;

    // Analyser tapped off the signal path
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
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
