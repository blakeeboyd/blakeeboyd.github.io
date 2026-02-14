import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const panFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const pan = params.pan ?? 0;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    inputNode.connect(panner);
    panner.connect(effectGain);
    effectGain.connect(outputNode);

    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        if (id === 'pan') {
          panner.pan.setTargetAtTime(value, t, 0.02);
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
        panner.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
