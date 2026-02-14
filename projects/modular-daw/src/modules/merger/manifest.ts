import type { ModuleManifest } from '../../types/modules';

export const mergerManifest: ModuleManifest = {
  type: 'merger',
  label: 'Merger',
  category: 'routing',
  ports: [
    {
      id: 'left',
      label: 'Left',
      direction: 'input',
      signalType: 'audio',
      channelFormat: 'mono',
    },
    {
      id: 'right',
      label: 'Right',
      direction: 'input',
      signalType: 'audio',
      channelFormat: 'mono',
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
