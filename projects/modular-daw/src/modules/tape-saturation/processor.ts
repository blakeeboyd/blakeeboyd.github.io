import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

function makeTanhCurve(drive: number): Float32Array {
  const n = 1024;
  const curve = new Float32Array(n);
  const amount = 1 + (drive / 100) * 10;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = Math.tanh(x * amount);
  }
  return curve;
}

export const tapeSaturationFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const drive = params.drive ?? 30;
    const tone = params.tone ?? 0;
    const mix = params.mix ?? 1;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Saturation via WaveShaperNode (tanh curve)
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeTanhCurve(drive);
    shaper.oversample = '2x';

    // Tone filter: low-shelf with variable gain
    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = 'lowshelf';
    toneFilter.frequency.value = 1000;
    toneFilter.gain.value = tone / 10; // -10 to +10 dB

    // Dry/wet
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - mix;
    const wetGain = ctx.createGain();
    wetGain.gain.value = mix;

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    // Wet path: input → shaper → tone → wetGain → effectGain → output
    inputNode.connect(shaper);
    shaper.connect(toneFilter);
    toneFilter.connect(wetGain);
    wetGain.connect(effectGain);

    // Dry path
    inputNode.connect(dryGain);
    dryGain.connect(effectGain);

    effectGain.connect(outputNode);

    // Bypass
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    let currentDrive = drive;

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'drive':
            currentDrive = value;
            shaper.curve = makeTanhCurve(currentDrive);
            break;
          case 'tone':
            toneFilter.gain.setTargetAtTime(value / 10, t, 0.02);
            break;
          case 'mix':
            dryGain.gain.setTargetAtTime(1 - value, t, 0.02);
            wetGain.gain.setTargetAtTime(value, t, 0.02);
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
        shaper.disconnect();
        toneFilter.disconnect();
        dryGain.disconnect();
        wetGain.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
