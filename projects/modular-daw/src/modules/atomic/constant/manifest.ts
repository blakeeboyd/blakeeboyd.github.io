import type { ModuleManifest } from '../../../types/modules';

export const constantManifest: ModuleManifest = {
  type: 'atomic-constant',
  label: 'Constant',
  category: 'atomic',
  ports: [
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [
    { id: 'value', label: 'Value', min: -1000, max: 1000, defaultValue: 0, step: 0.01, mapping: 'linear' },
  ],
  composition: { level: 3, isAtomic: true },
};
