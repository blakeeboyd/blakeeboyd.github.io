/** Channel format for audio signals */
export type ChannelFormat = 'mono' | 'stereo';

/** Signal type determines connection compatibility */
export type SignalType = 'audio' | 'parameter' | 'midi';

/** Port definition: declared by a module manifest */
export interface PortDef {
  id: string;
  label: string;
  direction: 'input' | 'output';
  signalType: SignalType;
  channelFormat: ChannelFormat;
}

/** Parameter definition: declared by a module manifest */
export interface ParameterDef {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  unit?: string;
  mapping: 'linear' | 'log';
}

/** A node in the graph (compatible with React Flow's Node type) */
export interface DawNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    parameters: Record<string, number>;
  };
}

/** An edge in the graph (compatible with React Flow's Edge type) */
export interface DawEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type: string;
  data: {
    signalType: SignalType;
    channelFormat: ChannelFormat;
  };
}
