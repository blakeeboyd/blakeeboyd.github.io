import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const loudnessMeterFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // K-weighting stage 1: high shelf boost (pre-filter)
    const kFilter1 = ctx.createBiquadFilter();
    kFilter1.type = 'highshelf';
    kFilter1.frequency.value = 1500;
    kFilter1.gain.value = 4;

    // K-weighting stage 2: high-pass (RLB weighting)
    const kFilter2 = ctx.createBiquadFilter();
    kFilter2.type = 'highpass';
    kFilter2.frequency.value = 38;
    kFilter2.Q.value = 0.5;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Measurement path: input → K-weight → analyser
    inputNode.connect(kFilter1);
    kFilter1.connect(kFilter2);
    kFilter2.connect(analyser);

    // Passthrough: input → output
    inputNode.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter() {},
      getAnalyserNode() {
        return analyser;
      },
      dispose() {
        inputNode.disconnect();
        kFilter1.disconnect();
        kFilter2.disconnect();
        analyser.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
