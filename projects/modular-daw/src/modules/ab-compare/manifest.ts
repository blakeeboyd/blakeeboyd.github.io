import type { ModuleManifest } from '../../types/modules';

export const abCompareManifest: ModuleManifest = {
  type: 'ab-compare',
  label: 'A/B',
  category: 'utility',
  ports: [
    { id: 'a', label: 'Input A', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'b', label: 'Input B', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Output', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [
    { id: 'select', label: 'Select', min: 0, max: 1, defaultValue: 0, step: 1, unit: '', mapping: 'linear' },
  ],
};
