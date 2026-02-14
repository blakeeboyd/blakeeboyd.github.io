import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { createCompositeProcessor } from '../../audio/composite-factory';
import { compressorManifest } from './manifest';

export const compressorFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const composition = compressorManifest.composition;
    if (!composition?.internalGraph) {
      throw new Error('Compressor manifest missing composition');
    }

    // Create the composite processor from the internal graph
    const composite = createCompositeProcessor(ctx, composition, params);

    // Wrap in bypass routing (same pattern as before)
    const inputNode = ctx.createGain();
    inputNode.gain.value = 1;
    const outputNode = ctx.createGain();
    outputNode.gain.value = 1;

    // Effect path: input → composite → effectGain → output
    const effectGain = ctx.createGain();
    effectGain.gain.value = 1;

    const compositeIn = composite.inputs['in'];
    const compositeOut = composite.outputs['out'];

    if (compositeIn instanceof AudioNode) {
      inputNode.connect(compositeIn);
    }
    if (compositeOut) {
      compositeOut.connect(effectGain);
    }
    effectGain.connect(outputNode);

    // Bypass path: input → bypassGain → output
    const bypassGain = ctx.createGain();
    bypassGain.gain.value = 0;
    inputNode.connect(bypassGain);
    bypassGain.connect(outputNode);

    // Sidechain placeholder (absorbed, not routed into composite yet)
    const sidechainSink = ctx.createGain();
    sidechainSink.gain.value = 0;
    sidechainSink.connect(ctx.createGain());

    return {
      inputs: {
        in: inputNode,
        sidechain: sidechainSink,
      },
      outputs: { out: outputNode },
      setParameter(id, value, t) {
        composite.setParameter(id, value, t);
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
        effectGain.disconnect();
        bypassGain.disconnect();
        outputNode.disconnect();
        sidechainSink.disconnect();
        composite.dispose();
      },
      getInternalProcessor(internalId) {
        return composite.getInternalProcessor?.(internalId);
      },
    };
  },
};
