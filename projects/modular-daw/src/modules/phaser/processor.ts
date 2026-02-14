import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const phaserFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const rate = params.rate ?? 0.5;
    const depth = params.depth ?? 0.7;
    const feedback = params.feedback ?? 0.5;
    const stages = params.stages ?? 4;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Create allpass filter chain (max 8 stages)
    const allpasses: BiquadFilterNode[] = [];
    for (let i = 0; i < 8; i++) {
      const ap = ctx.createBiquadFilter();
      ap.type = 'allpass';
      ap.frequency.value = 500 + i * 300; // spread center frequencies
      ap.Q.value = 0.5;
      allpasses.push(ap);
    }

    // Chain allpasses
    for (let i = 1; i < allpasses.length; i++) {
      allpasses[i - 1].connect(allpasses[i]);
    }

    // LFO modulates allpass frequencies
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = rate;

    // LFO depth scaling: modulate each allpass frequency
    const lfoGains: GainNode[] = [];
    for (let i = 0; i < allpasses.length; i++) {
      const g = ctx.createGain();
      g.gain.value = (500 + i * 300) * depth;
      lfo.connect(g);
      g.connect(allpasses[i].frequency);
      lfoGains.push(g);
    }
    lfo.start();

    // Feedback path
    const feedbackGain = ctx.createGain();
    feedbackGain.gain.value = feedback;

    // Dry/wet mixing
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.5;
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.5;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    // Connect based on active stages
    const activeStages = Math.min(Math.max(Math.round(stages), 2), 8);

    // Input → allpass chain → wet
    inputNode.connect(allpasses[0]);
    allpasses[activeStages - 1].connect(wetGain);
    wetGain.connect(effectGain);

    // Feedback: last allpass → feedbackGain → first allpass
    allpasses[activeStages - 1].connect(feedbackGain);
    feedbackGain.connect(allpasses[0]);

    // Dry path
    inputNode.connect(dryGain);
    dryGain.connect(effectGain);

    effectGain.connect(outputNode);

    // Bypass path
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'rate':
            lfo.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'depth':
            for (let i = 0; i < lfoGains.length; i++) {
              lfoGains[i].gain.setTargetAtTime((500 + i * 300) * value, t, 0.02);
            }
            break;
          case 'feedback':
            feedbackGain.gain.setTargetAtTime(value, t, 0.02);
            break;
          case 'stages':
            // Stage changes require reconnection, which isn't smoothly automatable
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
        lfo.stop();
        lfo.disconnect();
        for (const g of lfoGains) g.disconnect();
        for (const ap of allpasses) ap.disconnect();
        inputNode.disconnect();
        dryGain.disconnect();
        wetGain.disconnect();
        feedbackGain.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
