import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const expanderFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const threshold = params.threshold ?? -30;
    const ratio = params.ratio ?? 2;
    const attack = params.attack ?? 0.001;
    const release = params.release ?? 0.1;

    // Input
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Expander worklet (downward expansion below threshold)
    const expanderNode = new AudioWorkletNode(ctx, 'expander-processor', {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        threshold,
        ratio,
        attack,
        release,
      },
    });

    // Output
    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Bypass routing
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    // Signal flow: input → expanderNode(input 0) → effectGain → output
    inputNode.connect(expanderNode, 0, 0);
    expanderNode.connect(effectGain);
    effectGain.connect(outputNode);

    // Bypass: input → bypassGain → output
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    // Sidechain input (connects to expander input 1)
    const sidechainNode = ctx.createGain();
    sidechainNode.gain.value = 1;
    sidechainNode.connect(expanderNode, 0, 1);

    // Track gain reduction via message port
    let reductionDb = 0;
    expanderNode.port.onmessage = (e) => {
      if (e.data.reductionDb !== undefined) {
        reductionDb = e.data.reductionDb;
      }
    };

    return {
      inputs: {
        in: inputNode,
        sidechain: sidechainNode,
      },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        const param = expanderNode.parameters.get(id);
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
      getReductionDb() {
        return reductionDb;
      },
      dispose() {
        inputNode.disconnect();
        expanderNode.disconnect();
        sidechainNode.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
