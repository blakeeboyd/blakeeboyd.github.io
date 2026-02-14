import type { ModuleManifest } from '../../types/modules';

export const dcOffsetManifest: ModuleManifest = {
  type: 'dc-offset',
  label: 'DC Remove',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Audio In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Output', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [],
};
