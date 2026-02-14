import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const bitcrusherFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const bitDepth = params.bitDepth ?? 8;
    const sampleRateReduction = params.sampleRateReduction ?? 1;

    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    const crusherNode = new AudioWorkletNode(ctx, 'bitcrusher-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        bitDepth,
        sampleRateReduction,
      },
    });

    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass routing
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    inputNode.connect(crusherNode);
    crusherNode.connect(effectGain);
    effectGain.connect(outputNode);

    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        const param = crusherNode.parameters.get(id);
        if (param) {
          param.setTargetAtTime(value, t, 0.02);
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
        crusherNode.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
