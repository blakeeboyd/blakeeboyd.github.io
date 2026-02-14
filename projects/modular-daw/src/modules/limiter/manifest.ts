import type { ModuleManifest } from '../../types/modules';

export const limiterManifest: ModuleManifest = {
  type: 'limiter',
  label: 'Limiter',
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
      id: 'threshold',
      label: 'Threshold',
      min: -30,
      max: 0,
      defaultValue: -1,
      step: 0.5,
      unit: 'dB',
      mapping: 'linear',
    },
    {
      id: 'release',
      label: 'Release',
      min: 0.01,
      max: 0.5,
      defaultValue: 0.1,
      step: 0.01,
      unit: 's',
      mapping: 'log',
    },
    {
      id: 'lookahead',
      label: 'Lookahead',
      min: 0,
      max: 0.005,
      defaultValue: 0.001,
      step: 0.0001,
      unit: 's',
      mapping: 'linear',
    },
  ],
};
