import type { ModuleManifest } from '../../types/modules';

export const chorusManifest: ModuleManifest = {
  type: 'chorus',
  label: 'Chorus',
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
      id: 'rate',
      label: 'Rate',
      min: 0.1,
      max: 10,
      defaultValue: 1.5,
      step: 0.1,
      unit: 'Hz',
      mapping: 'log',
    },
    {
      id: 'depth',
      label: 'Depth',
      min: 0,
      max: 0.02,
      defaultValue: 0.005,
      step: 0.001,
      unit: 's',
      mapping: 'linear',
    },
    {
      id: 'mix',
      label: 'Mix',
      min: 0,
      max: 1,
      defaultValue: 0.5,
      step: 0.01,
      unit: '',
      mapping: 'linear',
    },
  ],
};
