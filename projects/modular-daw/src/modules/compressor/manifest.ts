import type { ModuleManifest } from '../../types/modules';

export const compressorManifest: ModuleManifest = {
  type: 'compressor',
  label: 'Compressor',
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
      id: 'sidechain',
      label: 'Sidechain',
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
      id: 'threshold',
      label: 'Threshold',
      min: -60,
      max: 0,
      defaultValue: -18,
      step: 0.5,
      unit: 'dB',
      mapping: 'linear',
    },
    {
      id: 'ratio',
      label: 'Ratio',
      min: 1,
      max: 20,
      defaultValue: 4,
      step: 0.5,
      unit: ':1',
      mapping: 'linear',
    },
    {
      id: 'attack',
      label: 'Attack',
      min: 0.001,
      max: 0.1,
      defaultValue: 0.003,
      step: 0.001,
      unit: 's',
      mapping: 'log',
    },
    {
      id: 'release',
      label: 'Release',
      min: 0.01,
      max: 1,
      defaultValue: 0.25,
      step: 0.01,
      unit: 's',
      mapping: 'log',
    },
    {
      id: 'makeup',
      label: 'Makeup',
      min: -6,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: 'dB',
      mapping: 'linear',
    },
  ],
  composition: {
    level: 0,
    isAtomic: false,
    internalGraph: {
      nodes: [
        // Input gain: passes audio through, output fans out to detection and audio paths
        { internalId: 'input-gain', moduleType: 'gain', position: { x: 50, y: 200 }, parameterBindings: { gain: 0 } },
        // Detection path: envelope detector measures amplitude
        { internalId: 'env-det', moduleType: 'envelope-detector', position: { x: 300, y: 350 } },
        // Gain computer: decides how much to compress based on threshold/ratio
        { internalId: 'gain-comp', moduleType: 'gain-computer', position: { x: 550, y: 350 } },
        // dB-to-linear: converts gain reduction from dB to a linear multiplier
        { internalId: 'db-to-lin', moduleType: 'atomic-db-to-lin', position: { x: 750, y: 350 } },
        // VCA: multiplies audio by the gain reduction amount
        { internalId: 'vca', moduleType: 'atomic-multiply', position: { x: 750, y: 200 } },
        // Makeup gain: compensates for level lost during compression
        { internalId: 'makeup', moduleType: 'gain', position: { x: 950, y: 200 }, parameterBindings: { gain: 0 } },
      ],
      edges: [
        // Audio path: input → VCA (input a)
        { fromNode: 'input-gain', fromPort: 'out', toNode: 'vca', toPort: 'a' },
        // Detection path: input → envelope detector → gain computer → dB-to-linear → VCA (input b)
        { fromNode: 'input-gain', fromPort: 'out', toNode: 'env-det', toPort: 'in' },
        { fromNode: 'env-det', fromPort: 'out', toNode: 'gain-comp', toPort: 'in' },
        { fromNode: 'gain-comp', fromPort: 'out', toNode: 'db-to-lin', toPort: 'in' },
        { fromNode: 'db-to-lin', fromPort: 'out', toNode: 'vca', toPort: 'b' },
        // VCA output → makeup gain
        { fromNode: 'vca', fromPort: 'out', toNode: 'makeup', toPort: 'in' },
      ],
      exposedInputs: [
        { externalPortId: 'in', internalNodeId: 'input-gain', internalPortId: 'in' },
      ],
      exposedOutputs: [
        { externalPortId: 'out', internalNodeId: 'makeup', internalPortId: 'out' },
      ],
      exposedParameters: [
        { externalParamId: 'threshold', internalNodeId: 'gain-comp', internalParamId: 'threshold' },
        { externalParamId: 'ratio', internalNodeId: 'gain-comp', internalParamId: 'ratio' },
        { externalParamId: 'attack', internalNodeId: 'env-det', internalParamId: 'attack' },
        { externalParamId: 'release', internalNodeId: 'env-det', internalParamId: 'release' },
        { externalParamId: 'makeup', internalNodeId: 'makeup', internalParamId: 'gain' },
      ],
    },
  },
};
