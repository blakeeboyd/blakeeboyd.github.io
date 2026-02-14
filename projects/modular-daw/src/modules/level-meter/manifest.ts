import type { ModuleManifest } from '../../types/modules';

export const levelMeterManifest: ModuleManifest = {
  type: 'level-meter',
  label: 'Level Meter',
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
  ],
  parameters: [],
};
