import type { ModuleManifest } from '../../types/modules';

export const metronomeManifest: ModuleManifest = {
  type: 'metronome',
  label: 'Metronome',
  category: 'generator',
  soloSafe: true,
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
      id: 'volume',
      label: 'Volume',
      min: -70,
      max: 0,
      defaultValue: -12,
      step: 0.1,
      unit: 'dB',
      mapping: 'linear',
    },
    {
      id: 'enabled',
      label: 'Enabled',
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 1,
      mapping: 'linear',
    },
    {
      id: 'accent',
      label: 'Accent',
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 1,
      mapping: 'linear',
    },
  ],
};
