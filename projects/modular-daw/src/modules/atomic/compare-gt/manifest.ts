import type { ModuleManifest } from '../../../types/modules';

export const compareGtManifest: ModuleManifest = {
  type: 'atomic-compare-gt',
  label: 'A > B',
  category: 'atomic',
  ports: [
    { id: 'a', label: 'A', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'b', label: 'B', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
  composition: { level: 3, isAtomic: true },
};
