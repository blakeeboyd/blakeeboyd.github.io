import type { ModuleManifest } from '../../types/modules';

export const phaseInvertManifest: ModuleManifest = {
  type: 'phase-invert',
  label: 'Phase Inv',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Audio In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Output', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [
    { id: 'invertL', label: 'Invert L', min: 0, max: 1, defaultValue: 1, step: 1, unit: '', mapping: 'linear' },
    { id: 'invertR', label: 'Invert R', min: 0, max: 1, defaultValue: 1, step: 1, unit: '', mapping: 'linear' },
  ],
};
