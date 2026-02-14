import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const delayFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const time = params.time ?? 0.3;
    const feedback = params.feedback ?? 0.3;
    const mix = params.mix ?? 0.5;

    // Input splitter: feed both dry and wet paths
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Dry path
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - mix;

    // Wet path
    const delayNode = ctx.createDelay(5);
    delayNode.delayTime.value = time;

    const feedbackGain = ctx.createGain();
    feedbackGain.gain.value = feedback;

    const wetGain = ctx.createGain();
    wetGain.gain.value = mix;

    // Output summing node
    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Signal flow:
    // input → dryGain → output
    // input → delay → wetGain → output
    // delay → feedbackGain → delay (feedback loop)
    inputNode.connect(dryGain);
    dryGain.connect(outputNode);

    inputNode.connect(delayNode);
    delayNode.connect(wetGain);
    wetGain.connect(outputNode);

    // Feedback loop
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);

    // Bypass state tracking
    let savedMix = mix;
    let isBypassed = false;

    return {
      inputs: {
        in: inputNode,
        'time-cv': delayNode.delayTime,
      },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'time':
            delayNode.delayTime.setTargetAtTime(value, t, 0.02);
            break;
          case 'feedback':
            feedbackGain.gain.setTargetAtTime(value, t, 0.02);
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
        inputNode.disconnect();
        dryGain.disconnect();
        delayNode.disconnect();
        feedbackGain.disconnect();
        wetGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
