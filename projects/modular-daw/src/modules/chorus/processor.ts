import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const chorusFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const rate = params.rate ?? 1.5;
    const depth = params.depth ?? 0.005;
    const mix = params.mix ?? 0.5;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Dry path
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - mix;

    // Wet path: modulated delay
    const delayNode = ctx.createDelay(0.1);
    delayNode.delayTime.value = 0.01; // base delay

    // LFO modulates delay time
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = rate;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = depth;

    lfo.connect(lfoGain);
    lfoGain.connect(delayNode.delayTime);
    lfo.start();

    const wetGain = ctx.createGain();
    wetGain.gain.value = mix;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Signal flow
    inputNode.connect(dryGain);
    dryGain.connect(outputNode);

    inputNode.connect(delayNode);
    delayNode.connect(wetGain);
    wetGain.connect(outputNode);

    // Bypass
    let savedMix = mix;
    let isBypassed = false;

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'rate':
            lfo.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'depth':
            lfoGain.gain.setTargetAtTime(value, t, 0.02);
            break;
          case 'mix':
            savedMix = value;
            if (!isBypassed) {
              dryGain.gain.setTargetAtTime(1 - value, t, 0.02);
              wetGain.gain.setTargetAtTime(value, t, 0.02);
            }
            break;
        }
      },
      setBypass(bypassed, t) {
        isBypassed = bypassed;
        if (bypassed) {
          dryGain.gain.setTargetAtTime(1, t, 0.02);
          wetGain.gain.setTargetAtTime(0, t, 0.02);
        } else {
          dryGain.gain.setTargetAtTime(1 - savedMix, t, 0.02);
          wetGain.gain.setTargetAtTime(savedMix, t, 0.02);
        }
      },
      dispose() {
        lfo.stop();
        lfo.disconnect();
        lfoGain.disconnect();
        inputNode.disconnect();
        dryGain.disconnect();
        delayNode.disconnect();
        wetGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
