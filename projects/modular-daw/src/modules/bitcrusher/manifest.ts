import type { ModuleManifest } from '../../types/modules';

export const bitcrusherManifest: ModuleManifest = {
  type: 'bitcrusher',
  label: 'Bitcrusher',
  category: 'effect',
  ports: [
    {
      id: 'in',
      label: 'Audio In',
      direction: 'input',
      signalType: 'audio',
      channelFormat: 'stereo',
    },
    {
      id: 'out',
      label: 'Output',
      direction: 'output',
      signalType: 'audio',
      channelFormat: 'stereo',
    },
  ],
  parameters: [
    {
      id: 'bitDepth',
      label: 'Bit Depth',
      min: 1,
      max: 16,
      defaultValue: 8,
      step: 1,
      unit: 'bits',
      mapping: 'linear',
    },
    {
      id: 'sampleRateReduction',
      label: 'SR Reduction',
      min: 1,
      max: 64,
      defaultValue: 1,
      step: 1,
      unit: 'x',
      mapping: 'linear',
    },
  ],
};
