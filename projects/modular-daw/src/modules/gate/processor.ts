import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const gateFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const threshold = params.threshold ?? -40;
    const attack = params.attack ?? 0.001;
    const hold = params.hold ?? 0.05;
    const release = params.release ?? 0.1;
    const range = params.range ?? -80;

    // Input
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Gate worklet
    const gateNode = new AudioWorkletNode(ctx, 'gate-processor', {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        threshold,
        attack,
        hold,
        release,
        range,
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

    // Signal flow: input → gateNode(input 0) → effectGain → output
    inputNode.connect(gateNode, 0, 0);
    gateNode.connect(effectGain);
    effectGain.connect(outputNode);

    // Bypass: input → bypassGain → output
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    // Sidechain input (connects to gate input 1)
    const sidechainNode = ctx.createGain();
    sidechainNode.gain.value = 1;
    sidechainNode.connect(gateNode, 0, 1);

    // Gate state tracking via message port
    let gateOpen = false;
    gateNode.port.onmessage = (e) => {
      if (e.data.gateOpen !== undefined) {
        gateOpen = e.data.gateOpen;
      }
    };

    return {
      inputs: {
        in: inputNode,
        sidechain: sidechainNode,
      },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        const param = gateNode.parameters.get(id);
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
        return gateOpen ? 0 : (params.range ?? -80);
      },
      dispose() {
        inputNode.disconnect();
        gateNode.disconnect();
        sidechainNode.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
