import type { ModuleManifest } from '../../types/modules';

export const testToneManifest: ModuleManifest = {
  type: 'test-tone',
  label: 'Test Tone',
  category: 'generator',
  ports: [
    {
      id: 'out',
      label: 'Output',
      direction: 'output',
      signalType: 'audio',
      channelFormat: 'mono',
    },
  ],
  parameters: [
    {
      id: 'frequency',
      label: 'Frequency',
      min: 20,
      max: 2000,
      defaultValue: 440,
      unit: 'Hz',
      mapping: 'log',
    },
    {
      id: 'waveform',
      label: 'Waveform',
      min: 0,
      max: 3,
      defaultValue: 0,
      step: 1,
      mapping: 'linear',
    },
  ],
};

export const WAVEFORMS: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
