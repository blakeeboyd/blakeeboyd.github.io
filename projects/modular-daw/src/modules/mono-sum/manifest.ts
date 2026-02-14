import type { ModuleManifest } from '../../types/modules';

export const monoSumManifest: ModuleManifest = {
  type: 'mono-sum',
  label: 'Mono Sum',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Stereo In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Mono Out', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [],
};
