import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const correlationMeterFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Split to L/R analysers
    const splitter = ctx.createChannelSplitter(2);
    const analyserL = ctx.createAnalyser();
    analyserL.fftSize = 2048;
    const analyserR = ctx.createAnalyser();
    analyserR.fftSize = 2048;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    inputNode.connect(splitter);
    splitter.connect(analyserL, 0);
    splitter.connect(analyserR, 1);
    inputNode.connect(outputNode);

    // Expose both analysers via a custom method
    const instance: ProcessorInstance & { getAnalyserNodes?: () => { left: AnalyserNode; right: AnalyserNode } } = {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter() {},
      getAnalyserNode() {
        return analyserL;
      },
      dispose() {
        inputNode.disconnect();
        splitter.disconnect();
        analyserL.disconnect();
        analyserR.disconnect();
        outputNode.disconnect();
      },
    };

    instance.getAnalyserNodes = () => ({ left: analyserL, right: analyserR });
    return instance;
  },
};
