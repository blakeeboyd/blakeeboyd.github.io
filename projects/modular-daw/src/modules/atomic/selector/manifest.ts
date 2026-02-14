import type { ModuleManifest } from '../../../types/modules';

export const selectorManifest: ModuleManifest = {
  type: 'atomic-selector',
  label: 'Selector',
  category: 'atomic',
  ports: [
    { id: 'a', label: 'A', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'b', label: 'B', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'ctrl', label: 'Ctrl', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
  composition: { level: 3, isAtomic: true },
};
