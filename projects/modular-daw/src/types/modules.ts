import type { PortDef, ParameterDef } from './graph';

/** Defines a node inside a composite module's internal graph */
export interface InternalNodeDef {
  /** Unique ID within this internal graph (e.g., 'envelope-detector') */
  internalId: string;
  /** Module type from the registry */
  moduleType: string;
  /** Default position for visual layout */
  position: { x: number; y: number };
  /** Parameter values locked by the parent composition */
  parameterBindings?: Record<string, number>;
}

/** Defines an edge inside a composite module's internal graph */
export interface InternalEdgeDef {
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}

/** Maps a parent module's external port to an internal node's port */
export interface PortMapping {
  /** Port ID on the parent module (matches PortDef.id) */
  externalPortId: string;
  /** internalId of the node whose port is exposed */
  internalNodeId: string;
  /** Port ID on the internal node */
  internalPortId: string;
}

/** Maps a parent module's parameter to an internal node's parameter */
export interface ParamMapping {
  /** Parameter ID on the parent module (matches ParameterDef.id) */
  externalParamId: string;
  /** internalId of the target node */
  internalNodeId: string;
  /** Parameter ID on the internal node */
  internalParamId: string;
}

/** Describes how a module is composed from sub-modules */
export interface CompositionDef {
  /** Hierarchy level: 0=composite, 1=functional block, 2=primitive, 3=atomic */
  level: number;
  /** Whether this module has no internal graph (is a leaf) */
  isAtomic: boolean;
  /** Internal graph definition (only for non-atomic modules) */
  internalGraph?: {
    nodes: InternalNodeDef[];
    edges: InternalEdgeDef[];
    exposedInputs: PortMapping[];
    exposedOutputs: PortMapping[];
    exposedParameters: ParamMapping[];
  };
}

/** Module manifest: static declaration of what a module type provides */
export interface ModuleManifest {
  type: string;
  label: string;
  category: 'io' | 'utility' | 'generator' | 'effect' | 'routing' | 'atomic';
  ports: PortDef[];
  parameters: ParameterDef[];
  singleton?: boolean;
  soloSafe?: boolean;
  /** Hide from the module panel (used for internal/sub-graph nodes) */
  internal?: boolean;
  /** Defines this module as a composite with internal sub-modules */
  composition?: CompositionDef;
}
