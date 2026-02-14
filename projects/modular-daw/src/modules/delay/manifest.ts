import type { ModuleManifest } from '../../types/modules';

export const delayManifest: ModuleManifest = {
  type: 'delay',
  label: 'Delay',
  category: 'effect',
  soloSafe: true,
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
    {
      id: 'time-cv',
      label: 'Time CV',
      direction: 'input',
      signalType: 'parameter',
      channelFormat: 'mono',
    },
  ],
  parameters: [
    {
      id: 'time',
      label: 'Time',
      min: 0.01,
      max: 2,
      defaultValue: 0.3,
      step: 0.01,
      unit: 's',
      mapping: 'linear',
    },
    {
      id: 'feedback',
      label: 'Feedback',
      min: 0,
      max: 0.95,
      defaultValue: 0.3,
      step: 0.01,
      unit: '',
      mapping: 'linear',
    },
    {
      id: 'mix',
      label: 'Mix',
      min: 0,
      max: 1,
      defaultValue: 0.5,
      step: 0.01,
      unit: '',
      mapping: 'linear',
    },
  ],
};
