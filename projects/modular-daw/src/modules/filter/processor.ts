import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

const FILTER_TYPES: BiquadFilterType[] = [
  'lowpass', 'highpass', 'bandpass', 'notch', 'allpass', 'lowshelf', 'highshelf',
];

export const filterFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const filterType = params.filterType ?? 0;
    const frequency = params.frequency ?? 1000;
    const Q = params.Q ?? 1;
    const gain = params.gain ?? 0;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const filter = ctx.createBiquadFilter();
    filter.type = FILTER_TYPES[filterType] || 'lowpass';
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    filter.gain.value = gain;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass routing
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    inputNode.connect(filter);
    filter.connect(effectGain);
    effectGain.connect(outputNode);

    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: {
        in: inputNode,
        'freq-cv': filter.frequency,
      },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'filterType':
            filter.type = FILTER_TYPES[Math.round(value)] || 'lowpass';
            break;
          case 'frequency':
            filter.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'Q':
            filter.Q.setTargetAtTime(value, t, 0.02);
            break;
          case 'gain':
            filter.gain.setTargetAtTime(value, t, 0.02);
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
        filter.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
