import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

function makeCurve(type: number, drive: number): Float32Array {
  const n = 1024;
  const curve = new Float32Array(n);
  const amount = drive / 100;

  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    switch (type) {
      case 0: // Soft clip (tanh)
        curve[i] = Math.tanh(x * (1 + amount * 10));
        break;
      case 1: // Hard clip
        curve[i] = Math.max(-1, Math.min(1, x * (1 + amount * 10)));
        break;
      case 2: // Foldback
        {
          let val = x * (1 + amount * 5);
          while (Math.abs(val) > 1) {
            val = val > 1 ? 2 - val : val < -1 ? -2 - val : val;
          }
          curve[i] = val;
        }
        break;
      case 3: // Tube (asymmetric)
        {
          const k = 1 + amount * 10;
          if (x >= 0) {
            curve[i] = 1 - Math.exp(-k * x);
          } else {
            curve[i] = -(1 - Math.exp(k * x)) * 0.8;
          }
        }
        break;
      default:
        curve[i] = x;
    }
  }
  return curve;
}

export const waveshaperFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const drive = params.drive ?? 50;
    const curveType = params.curveType ?? 0;
    const mix = params.mix ?? 1;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const shaper = ctx.createWaveShaper();
    shaper.curve = makeCurve(curveType, drive);
    shaper.oversample = '2x';

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

    // Wet: input → shaper → wetGain → effectGain → output
    inputNode.connect(shaper);
    shaper.connect(wetGain);
    wetGain.connect(effectGain);

    // Dry: input → dryGain → effectGain → output
    inputNode.connect(dryGain);
    dryGain.connect(effectGain);

    effectGain.connect(outputNode);

    // Bypass
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    let currentDrive = drive;
    let currentCurveType = curveType;

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'drive':
            currentDrive = value;
            shaper.curve = makeCurve(currentCurveType, currentDrive);
            break;
          case 'curveType':
            currentCurveType = Math.round(value);
            shaper.curve = makeCurve(currentCurveType, currentDrive);
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
        dryGain.disconnect();
        wetGain.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
