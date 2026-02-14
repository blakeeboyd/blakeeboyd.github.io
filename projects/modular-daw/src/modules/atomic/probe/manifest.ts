import type { ModuleManifest } from '../../../types/modules';

export const probeManifest: ModuleManifest = {
  type: 'atomic-probe',
  label: 'Probe',
  category: 'atomic',
  ports: [
    { id: 'in', label: 'In', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
  composition: { level: 3, isAtomic: true },
};
