import type { ModuleManifest } from '../../types/modules';

export const trackManifest: ModuleManifest = {
  type: 'track',
  label: 'Track',
  category: 'io',
  ports: [
    {
      id: 'out',
      label: 'Output',
      direction: 'output',
      signalType: 'audio',
      channelFormat: 'stereo',
    },
  ],
  parameters: [
    {
      id: 'volume',
      label: 'Volume',
      min: -70,
      max: 6,
      defaultValue: 0,
      step: 0.1,
      unit: 'dB',
      mapping: 'linear',
    },
  ],
};
