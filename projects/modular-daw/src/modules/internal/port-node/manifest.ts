import type { ModuleManifest } from '../../../types/modules';

export const portNodeManifest: ModuleManifest = {
  type: 'port-node',
  label: 'Port',
  category: 'io',
  ports: [
    { id: 'in', label: 'In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [],
  singleton: false,
  internal: true,
};
