import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

/** Generate an impulse response buffer with exponential decay */
function generateIR(ctx: AudioContext, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * decay);
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      // Exponential decay envelope * random noise
      data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * i / length);
    }
  }

  return buffer;
}

export const reverbFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const decay = params.decay ?? 2.0;
    const mix = params.mix ?? 0.3;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - mix;

    const convolver = ctx.createConvolver();
    convolver.buffer = generateIR(ctx, decay);

    const wetGain = ctx.createGain();
    wetGain.gain.value = mix;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Signal flow:
    // input → dryGain → output
    // input → convolver → wetGain → output
    inputNode.connect(dryGain);
    dryGain.connect(outputNode);

    inputNode.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(outputNode);

    let currentDecay = decay;
    let savedMix = mix;
    let isBypassed = false;

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'decay':
            currentDecay = value;
            convolver.buffer = generateIR(ctx, currentDecay);
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
        convolver.disconnect();
        wetGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
