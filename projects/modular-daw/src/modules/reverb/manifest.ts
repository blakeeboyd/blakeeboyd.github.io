import type { ModuleManifest } from '../../types/modules';

export const reverbManifest: ModuleManifest = {
  type: 'reverb',
  label: 'Reverb',
  category: 'effect',
  soloSafe: true,
  ports: [
    {
      id: 'in',
      label: 'Input',
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
      id: 'decay',
      label: 'Decay',
      min: 0.1,
      max: 10,
      defaultValue: 2.0,
      step: 0.1,
      unit: 's',
      mapping: 'linear',
    },
    {
      id: 'mix',
      label: 'Mix',
      min: 0,
      max: 1,
      defaultValue: 0.3,
      step: 0.01,
      unit: '',
      mapping: 'linear',
    },
  ],
};
