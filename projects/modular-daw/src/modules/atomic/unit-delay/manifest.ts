import type { ModuleManifest } from '../../../types/modules';

export const unitDelayManifest: ModuleManifest = {
  type: 'atomic-unit-delay',
  label: 'Unit Delay',
  category: 'atomic',
  ports: [
    { id: 'in', label: 'In', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
  composition: { level: 3, isAtomic: true },
};
