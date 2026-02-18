import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import { dbToLinear } from '../../audio/engine';
import { useTransportStore } from '../../store/transport-store';

/**
 * Metronome processor using the look-ahead scheduling pattern
 * (Chris Wilson's "A Tale of Two Clocks").
 *
 * Schedules short OscillatorNode bursts ahead of the current time.
 * Beat 1 gets a higher-pitched accent click (1500 Hz vs 1000 Hz).
 */
export const metronomeFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const output = ctx.createGain();
    output.gain.value = dbToLinear(params.volume ?? -12);

    const enableGate = ctx.createGain();
    enableGate.gain.value = (params.enabled ?? 1) >= 0.5 ? 1 : 0;
    enableGate.connect(output);

    let schedulerInterval: ReturnType<typeof setInterval> | null = null;
    let nextBeatTime = 0;    // AudioContext time of the next beat to schedule
    let currentBeat = 0;     // Which beat we're on (0-indexed, 0 = beat 1)
    let accentEnabled = (params.accent ?? 1) >= 0.5;
    const LOOK_AHEAD = 0.1;  // Schedule 100ms ahead
    const TICK_MS = 25;      // Check every 25ms

    function scheduleClick(time: number, isAccent: boolean) {
      const freq = isAccent && accentEnabled ? 1500 : 1000;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();

      osc.frequency.value = freq;
      osc.type = 'sine';
      osc.connect(env);
      env.connect(enableGate);

      // Sharp click: quick attack, fast exponential decay
      env.gain.setValueAtTime(1, time);
      env.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.start(time);
      osc.stop(time + 0.03);
    }

    function scheduler() {
      const bpm = useTransportStore.getState().bpm;
      const beatDuration = 60 / bpm;

      while (nextBeatTime < ctx.currentTime + LOOK_AHEAD) {
        const isAccent = currentBeat % 4 === 0;
        scheduleClick(nextBeatTime, isAccent);
        nextBeatTime += beatDuration;
        currentBeat++;
      }
    }

    function schedulePlayback(startTime: number, offset: number) {
      stopPlayback();

      const bpm = useTransportStore.getState().bpm;
      const beatDuration = 60 / bpm;

      // Calculate which beat we're on and when the next beat falls
      const beatNumber = Math.floor(offset / beatDuration);
      const nextBeatOffset = (beatNumber + 1) * beatDuration;
      const timeUntilNextBeat = nextBeatOffset - offset;

      currentBeat = beatNumber + 1;
      nextBeatTime = startTime + timeUntilNextBeat;

      // If we're very close to a beat (within 5ms), schedule it now
      if (timeUntilNextBeat < 0.005) {
        currentBeat = beatNumber;
        nextBeatTime = startTime;
      }

      schedulerInterval = setInterval(scheduler, TICK_MS);
      // Run once immediately
      scheduler();
    }

    function stopPlayback() {
      if (schedulerInterval !== null) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
      }
    }

    return {
      inputs: {},
      outputs: { out: output },

      setParameter(id, value, time) {
        if (id === 'volume') {
          output.gain.setTargetAtTime(dbToLinear(value), time, 0.02);
        } else if (id === 'enabled') {
          enableGate.gain.setTargetAtTime(value >= 0.5 ? 1 : 0, time, 0.02);
        } else if (id === 'accent') {
          accentEnabled = value >= 0.5;
        }
      },

      schedulePlayback,
      stopPlayback,

      dispose() {
        stopPlayback();
        enableGate.disconnect();
        output.disconnect();
      },
    };
  },
};
