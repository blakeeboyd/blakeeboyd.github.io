import type { ModuleManifest } from '../../types/modules';

export const deEsserManifest: ModuleManifest = {
  type: 'de-esser',
  label: 'De-esser',
  category: 'effect',
  ports: [
    {
      id: 'in',
      label: 'Audio In',
      direction: 'input',
      signalType: 'audio',
      channelFormat: 'stereo',
    },
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
      id: 'frequency',
      label: 'Frequency',
      min: 2000,
      max: 16000,
      defaultValue: 6000,
      step: 100,
      unit: 'Hz',
      mapping: 'log',
    },
    {
      id: 'range',
      label: 'Range',
      min: 0,
      max: 12,
      defaultValue: 6,
      step: 0.5,
      unit: 'dB',
      mapping: 'linear',
    },
    {
      id: 'listen',
      label: 'Listen',
      min: 0,
      max: 1,
      defaultValue: 0,
      step: 1,
      unit: '',
      mapping: 'linear',
    },
  ],
};
