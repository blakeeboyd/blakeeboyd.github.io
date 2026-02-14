import type { ModuleManifest } from '../../types/modules';

export const correlationMeterManifest: ModuleManifest = {
  type: 'correlation-meter',
  label: 'Correlation',
  category: 'utility',
  ports: [
    { id: 'in', label: 'Stereo In', direction: 'input', signalType: 'audio', channelFormat: 'stereo' },
    { id: 'out', label: 'Thru', direction: 'output', signalType: 'audio', channelFormat: 'stereo' },
  ],
  parameters: [],
};
