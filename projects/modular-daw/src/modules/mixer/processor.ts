import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { dbToLinear } from '../../audio/engine';

export const mixerFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    // 4 input gain nodes
    const in1 = ctx.createGain();
    in1.gain.value = dbToLinear(params.gain1 ?? 0);
    const in2 = ctx.createGain();
    in2.gain.value = dbToLinear(params.gain2 ?? 0);
    const in3 = ctx.createGain();
    in3.gain.value = dbToLinear(params.gain3 ?? 0);
    const in4 = ctx.createGain();
    in4.gain.value = dbToLinear(params.gain4 ?? 0);

    // Summing node
    const sumNode = ctx.createGain();
    sumNode.gain.value = 1;

    in1.connect(sumNode);
    in2.connect(sumNode);
    in3.connect(sumNode);
    in4.connect(sumNode);

    const gainNodes: Record<string, GainNode> = {
      gain1: in1, gain2: in2, gain3: in3, gain4: in4,
    };

    return {
      inputs: { in1, in2, in3, in4 },
      outputs: { out: sumNode },
      setParameter(id, value, t) {
        const node = gainNodes[id];
        if (node) {
          node.gain.setTargetAtTime(dbToLinear(value), t, 0.02);
        }
      },
      dispose() {
        in1.disconnect();
        in2.disconnect();
        in3.disconnect();
        in4.disconnect();
        sumNode.disconnect();
      },
    };
  },
};
