import type { ModuleManifest } from '../../types/modules';

export const gainComputerManifest: ModuleManifest = {
  type: 'gain-computer',
  label: 'Gain Computer',
  category: 'effect',
  ports: [
    { id: 'in', label: 'Level (dB)', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'GR (dB)', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [
    { id: 'threshold', label: 'Threshold', min: -60, max: 0, defaultValue: -18, step: 0.5, unit: 'dB', mapping: 'linear' },
    { id: 'ratio', label: 'Ratio', min: 1, max: 20, defaultValue: 4, step: 0.5, unit: ':1', mapping: 'linear' },
  ],
  internal: true,
  composition: {
    level: 1,
    isAtomic: false,
    // Level 2/3 decomposition deferred to a later phase.
  },
};
