import type { ModuleManifest } from '../../types/modules';

export const splitterManifest: ModuleManifest = {
  type: 'splitter',
  label: 'Splitter',
  category: 'routing',
  ports: [
    {
      id: 'in',
      label: 'Input',
      direction: 'input',
      signalType: 'audio',
      channelFormat: 'stereo',
    },
    {
      id: 'left',
      label: 'Left',
      direction: 'output',
      signalType: 'audio',
      channelFormat: 'mono',
    },
    {
      id: 'right',
      label: 'Right',
      direction: 'output',
      signalType: 'audio',
      channelFormat: 'mono',
    },
  ],
  parameters: [],
};
