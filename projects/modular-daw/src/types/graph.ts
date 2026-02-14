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
  dragHandle?: string;
  data: {
    label: string;
    parameters: Record<string, number>;
    /** Key into audio buffer cache (track modules only) */
    bufferRef?: string;
    /** Original file name for display */
    fileName?: string;
    /** Buffer duration in seconds */
    duration?: number;
    /** Whether this node is muted */
    muted?: boolean;
    /** Whether this node is soloed */
    soloed?: boolean;
    /** Whether this effect is bypassed (dry signal only) */
    bypassed?: boolean;
    /** Port direction for boundary port-nodes in internal graph views */
    portDirection?: string;
    /** External port ID for boundary port-nodes */
    portId?: string;
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
