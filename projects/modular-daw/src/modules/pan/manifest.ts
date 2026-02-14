import type { ModuleManifest } from '../../types/modules';

export const panManifest: ModuleManifest = {
  type: 'pan',
  label: 'Pan',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Audio In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Output', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [
    { id: 'pan', label: 'Pan', min: -1, max: 1, defaultValue: 0, step: 0.01, unit: '', mapping: 'linear' },
  ],
};
