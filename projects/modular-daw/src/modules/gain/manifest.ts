import type { ModuleManifest } from '../../types/modules';

export const gainManifest: ModuleManifest = {
  type: 'gain',
  label: 'Gain',
  category: 'utility',
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
    {
      id: 'gain-cv',
      label: 'Gain CV',
      direction: 'input',
      signalType: 'parameter',
      channelFormat: 'mono',
    },
  ],
  parameters: [
    {
      id: 'gain',
      label: 'Gain',
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: 'dB',
      mapping: 'linear',
    },
  ],
};
