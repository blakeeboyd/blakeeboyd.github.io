import type { ModuleManifest } from '../../types/modules';

export const oscilloscopeManifest: ModuleManifest = {
  type: 'oscilloscope',
  label: 'Oscilloscope',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Audio In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Thru', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [],
};
