import type { ProcessorFactory, ProcessorInstance } from '../../../types/audio';

/** Port nodes are visual-only boundary markers. They pass audio through. */
export const portNodeFactory: ProcessorFactory = {
  create(ctx: AudioContext): ProcessorInstance {
    const node = ctx.createGain();
    node.gain.value = 1;

    return {
      inputs: { in: node },
      outputs: { out: node },
      setParameter() {},
      dispose() { node.disconnect(); },
    };
  },
};
