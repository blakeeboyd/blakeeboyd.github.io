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
}
