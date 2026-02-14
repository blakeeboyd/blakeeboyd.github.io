import type { ModuleManifest } from '../../types/modules';

export const envelopeDetectorManifest: ModuleManifest = {
  type: 'envelope-detector',
  label: 'Envelope Detector',
  category: 'effect',
  ports: [
    { id: 'in', label: 'Audio In', direction: 'input', signalType: 'audio', channelFormat: 'mono' },
    { id: 'out', label: 'Envelope', direction: 'output', signalType: 'audio', channelFormat: 'mono' },
  ],
  parameters: [
    { id: 'attack', label: 'Attack', min: 0.001, max: 0.1, defaultValue: 0.003, step: 0.001, unit: 's', mapping: 'log' },
    { id: 'release', label: 'Release', min: 0.01, max: 1, defaultValue: 0.25, step: 0.01, unit: 's', mapping: 'log' },
  ],
  internal: true,
  composition: {
    level: 1,
    isAtomic: false,
    // Level 2/3 decomposition deferred to a later phase.
    // For now this uses a single AudioWorklet processor.
  },
};
