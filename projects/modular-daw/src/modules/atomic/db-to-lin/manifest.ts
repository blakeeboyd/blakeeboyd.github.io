import type { ModuleManifest } from '../../../types/modules';

export const dbToLinManifest: ModuleManifest = {
  type: 'atomic-db-to-lin',
  label: 'dB→Lin',
  category: 'atomic',
  ports: [
    { id: 'in', label: 'In', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
  composition: { level: 3, isAtomic: true },
};
