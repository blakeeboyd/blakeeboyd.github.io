import type { ModuleManifest } from '../../types/modules';

export const spectrumAnalyzerManifest: ModuleManifest = {
  type: 'spectrum-analyzer',
  label: 'Analyzer',
  category: 'utility',
  ports: [
    {
      id: 'in',
      label: 'Input',
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
  parameters: [],
};
