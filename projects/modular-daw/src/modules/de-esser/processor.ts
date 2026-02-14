import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';

export const deEsserFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const frequency = params.frequency ?? 6000;
    const range = params.range ?? 6;
    const listen = params.listen ?? 0;

    // Input
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;

    // Detection path: bandpass filter for sibilance detection
    const detector = ctx.createBiquadFilter();
    detector.type = 'bandpass';
    detector.frequency.value = frequency;
    detector.Q.value = 2;

    // Main audio path: narrow notch to reduce sibilance
    const notch = ctx.createBiquadFilter();
    notch.type = 'peaking';
    notch.frequency.value = frequency;
    notch.Q.value = 2;
    notch.gain.value = 0; // Will be modulated by worklet

    // De-esser worklet: takes detector signal, outputs gain reduction
    const deEsserNode = new AudioWorkletNode(ctx, 'de-esser-processor', {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        range,
      },
    });

    // Output routing
    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Listen mode: hear just the detection band
    const listenGain = ctx.createGain();
    listenGain.gain.value = listen;
    const mainGain = ctx.createGain();
    mainGain.gain.value = 1 - listen;

    // Bypass routing
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;

    // Signal flow:
    // Detection: input → detector → deEsserNode(input 1)
    // Main: input → notch → mainGain → effectGain → output
    // Listen: input → detector → listenGain → effectGain → output
    // deEsserNode controls notch gain via message port

    inputNode.connect(detector);
    detector.connect(deEsserNode, 0, 1);

    inputNode.connect(notch);
    inputNode.connect(deEsserNode, 0, 0);
    notch.connect(mainGain);
    mainGain.connect(effectGain);

    detector.connect(listenGain);
    listenGain.connect(effectGain);

    effectGain.connect(outputNode);

    // Bypass path
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    // Track gain reduction from worklet
    let reductionDb = 0;
    deEsserNode.port.onmessage = (e) => {
      if (e.data.reductionDb !== undefined) {
        reductionDb = e.data.reductionDb;
        // Apply reduction to the notch filter
        notch.gain.setValueAtTime(-Math.abs(reductionDb), ctx.currentTime);
      }
    };

    return {
      inputs: { in: inputNode },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        switch (id) {
          case 'frequency':
            detector.frequency.setTargetAtTime(value, t, 0.02);
            notch.frequency.setTargetAtTime(value, t, 0.02);
            break;
          case 'range': {
            const param = deEsserNode.parameters.get('range');
            if (param) param.setTargetAtTime(value, t, 0.02);
            break;
          }
          case 'listen':
            listenGain.gain.setTargetAtTime(value, t, 0.02);
            mainGain.gain.setTargetAtTime(1 - value, t, 0.02);
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
      getReductionDb() {
        return reductionDb;
      },
      dispose() {
        inputNode.disconnect();
        detector.disconnect();
        notch.disconnect();
        deEsserNode.disconnect();
        mainGain.disconnect();
        listenGain.disconnect();
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
      },
    };
  },
};
