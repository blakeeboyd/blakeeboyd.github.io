import type { Region } from './region';

/** Factory that creates Web Audio nodes for a module instance */
export interface ProcessorFactory {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance;
}

/** A live Web Audio processor for a module instance */
export interface ProcessorInstance {
  /** Input AudioNodes keyed by port ID */
  inputs: Record<string, AudioNode | AudioParam>;
  /** Output AudioNodes keyed by port ID */
  outputs: Record<string, AudioNode>;
  /** Update a parameter value with smooth ramping */
  setParameter(id: string, value: number, time: number): void;
  /** Clean up all audio nodes */
  dispose(): void;
  /** Assign an AudioBuffer for playback (track modules only) */
  setBuffer?(buffer: AudioBuffer): void;
  /** Assign regions for region-based playback (track modules only) */
  setRegions?(regions: Region[]): void;
  /** Schedule playback from a given offset at a specific AudioContext time */
  schedulePlayback?(startTime: number, offset: number): void;
  /** Stop any in-progress playback */
  stopPlayback?(): void;
  /** Set bypass state: when true, input passes straight to output */
  setBypass?(bypassed: boolean, time: number): void;
  /** Get an AnalyserNode for visualization (metering modules) */
  getAnalyserNode?(): AnalyserNode | null;
  /** Get current gain reduction in dB (compressor modules) */
  getReductionDb?(): number;
  /** For composite processors: get an internal sub-processor by its internalId */
  getInternalProcessor?(internalId: string): ProcessorInstance | undefined;
}
