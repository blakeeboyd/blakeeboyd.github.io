import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { WAVEFORMS } from './manifest';

export const testToneFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const osc = ctx.createOscillator();
    const output = ctx.createGain();
    output.gain.value = 1;

    osc.frequency.value = params.frequency ?? 440;
    osc.type = WAVEFORMS[params.waveform ?? 0] ?? 'sine';
    osc.connect(output);
    osc.start();

    return {
      inputs: {},
      outputs: { out: output },
      setParameter(id, value, time) {
        if (id === 'frequency') {
          osc.frequency.setTargetAtTime(value, time, 0.02);
        } else if (id === 'waveform') {
          osc.type = WAVEFORMS[Math.round(value)] ?? 'sine';
        }
      },
      dispose() {
        osc.stop();
        osc.disconnect();
        output.disconnect();
      },
    };
  },
};
