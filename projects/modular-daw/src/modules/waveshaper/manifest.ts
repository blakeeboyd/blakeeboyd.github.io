import type { ModuleManifest } from '../../types/modules';

export const waveshaperManifest: ModuleManifest = {
  type: 'waveshaper',
  label: 'Waveshaper',
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
      id: 'drive',
      label: 'Drive',
      min: 0,
      max: 100,
      defaultValue: 50,
      step: 1,
      unit: '%',
      mapping: 'linear',
    },
    {
      id: 'curveType',
      label: 'Curve',
      min: 0,
      max: 3,
      defaultValue: 0,
      step: 1,
      unit: '',
      mapping: 'linear',
    },
    {
      id: 'mix',
      label: 'Mix',
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 0.01,
      unit: '',
      mapping: 'linear',
    },
  ],
};
