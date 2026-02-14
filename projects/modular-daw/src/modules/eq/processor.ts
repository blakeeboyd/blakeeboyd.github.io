import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const eqFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    // Three-band EQ: low shelf → peaking → high shelf
    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = params.lowFreq ?? 80;
    lowFilter.gain.value = params.lowGain ?? 0;

    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = params.midFreq ?? 1000;
    midFilter.gain.value = params.midGain ?? 0;
    midFilter.Q.value = params.midQ ?? 1;

    const highFilter = ctx.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = params.highFreq ?? 8000;
    highFilter.gain.value = params.highGain ?? 0;

    // Input and output nodes for bypass routing
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Effect path: input → low → mid → high → effectGain → output
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;

    inputNode.connect(lowFilter);
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    highFilter.connect(effectGain);
    effectGain.connect(outputNode);

    // Bypass path: input → bypassGain → output
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'lowFreq':
            lowFilter.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'lowGain':
            lowFilter.gain.setTargetAtTime(value, t, 0.02);
            break;
          case 'midFreq':
            midFilter.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'midGain':
            midFilter.gain.setTargetAtTime(value, t, 0.02);
            break;
          case 'midQ':
            midFilter.Q.setTargetAtTime(value, t, 0.02);
            break;
          case 'highFreq':
            highFilter.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'highGain':
            highFilter.gain.setTargetAtTime(value, t, 0.02);
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
      dispose() {
        inputNode.disconnect();
        lowFilter.disconnect();
        midFilter.disconnect();
        highFilter.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
