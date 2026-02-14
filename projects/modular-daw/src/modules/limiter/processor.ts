import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const limiterFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const threshold = params.threshold ?? -1;
    const release = params.release ?? 0.1;
    const lookahead = params.lookahead ?? 0.001;

    // Input node
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Lookahead delay compensates for attack time
    const lookaheadDelay = ctx.createDelay(0.01);
    lookaheadDelay.delayTime.value = lookahead;

    // Brick-wall limiter: DynamicsCompressorNode with ratio=20, knee=0
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.ratio.value = 20;
    compressor.knee.value = 0;
    compressor.attack.value = 0.001;
    compressor.release.value = release;

    // Output
    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass routing
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    // Signal flow: input → lookaheadDelay → compressor → effectGain → output
    inputNode.connect(lookaheadDelay);
    lookaheadDelay.connect(compressor);
    compressor.connect(effectGain);
    effectGain.connect(outputNode);

    // Bypass: input → bypassGain → output
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'threshold':
            compressor.threshold.setTargetAtTime(value, t, 0.02);
            break;
          case 'release':
            compressor.release.setTargetAtTime(value, t, 0.02);
            break;
          case 'lookahead':
            lookaheadDelay.delayTime.setTargetAtTime(value, t, 0.02);
            break;
        }
      },
      setBypass(bypassed, t) {
        if (bypassed) {
          effectGain.gain.setTargetAtTime(0, t, 0.02);
          bypassGain.gain.setTargetAtTime(1, t, 0.02);
        } else {
          effectGain.gain.setTargetAtTime(1, t, 0.02);
          bypassGain.gain.setTargetAtTime(0, t, 0.02);
        }
      },
      getReductionDb() {
        return compressor.reduction;
      },
      dispose() {
        inputNode.disconnect();
        lookaheadDelay.disconnect();
        compressor.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
