import type { ModuleManifest } from '../../types/modules';

export const masterOutputManifest: ModuleManifest = {
  type: 'master-output',
  label: 'Master Output',
  category: 'io',
  singleton: true,
  ports: [
    {
      id: 'in',
      label: 'Input',
      direction: 'input',
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
