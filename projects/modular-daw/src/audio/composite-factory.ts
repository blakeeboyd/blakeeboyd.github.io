import { getProcessorFactory, getManifest } from '../modules/registry';
import type { ProcessorFactory, ProcessorInstance } from '../types/audio';
import type { CompositionDef } from '../types/modules';

/**
 * Creates a composite processor by recursively instantiating internal
 * sub-modules and wiring them together. The returned ProcessorInstance
 * exposes only the boundary ports defined by the composition's port mappings.
 */
export function createCompositeProcessor(
  ctx: AudioContext,
  composition: CompositionDef,
  parentParams: Record<string, number>,
): ProcessorInstance {
  const graph = composition.internalGraph!;
  const internals = new Map<string, ProcessorInstance>();

  // 1. Create all internal processors
  for (const nodeDef of graph.nodes) {
    const factory = getProcessorFactory(nodeDef.moduleType);
    const childManifest = getManifest(nodeDef.moduleType);

    // Build params: start with child defaults, then apply fixed bindings
    const params: Record<string, number> = {};
    for (const param of childManifest.parameters) {
      params[param.id] = param.defaultValue;
    }
    if (nodeDef.parameterBindings) {
      Object.assign(params, nodeDef.parameterBindings);
    }

    const instance = factory.create(ctx, params);
    internals.set(nodeDef.internalId, instance);
  }

  // 2. Apply initial parent parameter values through mappings
  for (const mapping of graph.exposedParameters) {
    const proc = internals.get(mapping.internalNodeId);
    if (proc && parentParams[mapping.externalParamId] !== undefined) {
      proc.setParameter(mapping.internalParamId, parentParams[mapping.externalParamId], ctx.currentTime);
    }
  }

  // 3. Wire internal edges (direct connect, no gates — these are permanent)
  for (const edge of graph.edges) {
    const sourceProc = internals.get(edge.fromNode);
    const targetProc = internals.get(edge.toNode);
    if (!sourceProc || !targetProc) {
      console.warn(`Composite: missing processor for edge ${edge.fromNode} → ${edge.toNode}`);
      continue;
    }

    const fromNode = sourceProc.outputs[edge.fromPort];
    const toTarget = targetProc.inputs[edge.toPort];
    if (!fromNode || !toTarget) {
      console.warn(`Composite: missing port for edge ${edge.fromNode}.${edge.fromPort} → ${edge.toNode}.${edge.toPort}`);
      continue;
    }

    if (toTarget instanceof AudioParam) {
      fromNode.connect(toTarget);
    } else {
      fromNode.connect(toTarget as AudioNode);
    }
  }

  // 4. Build exposed inputs map
  const inputs: Record<string, AudioNode | AudioParam> = {};
  for (const mapping of graph.exposedInputs) {
    const proc = internals.get(mapping.internalNodeId);
    if (proc) {
      inputs[mapping.externalPortId] = proc.inputs[mapping.internalPortId];
    }
  }

  // 5. Build exposed outputs map
  const outputs: Record<string, AudioNode> = {};
  for (const mapping of graph.exposedOutputs) {
    const proc = internals.get(mapping.internalNodeId);
    if (proc) {
      outputs[mapping.externalPortId] = proc.outputs[mapping.internalPortId];
    }
  }

  // 6. Build parameter routing
  const paramRoutes = new Map<string, { proc: ProcessorInstance; paramId: string }>();
  for (const mapping of graph.exposedParameters) {
    const proc = internals.get(mapping.internalNodeId);
    if (proc) {
      paramRoutes.set(mapping.externalParamId, { proc, paramId: mapping.internalParamId });
    }
  }

  return {
    inputs,
    outputs,
    setParameter(id, value, time) {
      const route = paramRoutes.get(id);
      if (route) {
        route.proc.setParameter(route.paramId, value, time);
      }
    },
    dispose() {
      for (const proc of internals.values()) {
        proc.dispose();
      }
    },
    getInternalProcessor(internalId) {
      return internals.get(internalId);
    },
  };
}

/**
 * A ProcessorFactory that delegates to createCompositeProcessor.
 * Use this when a module's manifest defines a composition with internalGraph.
 */
export class CompositeFactory implements ProcessorFactory {
  constructor(private composition: CompositionDef) {}

  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    return createCompositeProcessor(ctx, this.composition, params);
  }
}
