import { nanoid } from 'nanoid';
import type { DawNode, DawEdge } from '../types/graph';
import type { CompositionDef } from '../types/modules';
import { getManifest } from '../modules/registry';

/**
 * Converts a manifest's CompositionDef.internalGraph into DawNode[] and DawEdge[]
 * suitable for display in ReactFlow. Also creates boundary "port-node" entries
 * for exposed inputs and outputs.
 */
export function instantiateInternalGraph(
  composition: CompositionDef,
): { nodes: DawNode[]; edges: DawEdge[] } {
  const graph = composition.internalGraph;
  if (!graph) return { nodes: [], edges: [] };

  const nodes: DawNode[] = [];
  const edges: DawEdge[] = [];

  // Map from internalId to generated node ID
  const idMap = new Map<string, string>();

  // Create port-node boundary nodes for exposed inputs (left side)
  const inputPortIds = new Map<string, string>();
  for (let i = 0; i < graph.exposedInputs.length; i++) {
    const mapping = graph.exposedInputs[i];
    const portNodeId = nanoid();
    inputPortIds.set(mapping.externalPortId, portNodeId);
    nodes.push({
      id: portNodeId,
      type: 'port-node',
      position: { x: -150, y: 150 + i * 120 },
      data: {
        label: mapping.externalPortId,
        parameters: {},
        portDirection: 'input' as string,
        portId: mapping.externalPortId,
      },
    });
  }

  // Create port-node boundary nodes for exposed outputs (right side)
  const outputPortIds = new Map<string, string>();
  for (let i = 0; i < graph.exposedOutputs.length; i++) {
    const mapping = graph.exposedOutputs[i];
    const portNodeId = nanoid();
    outputPortIds.set(mapping.externalPortId, portNodeId);
    nodes.push({
      id: portNodeId,
      type: 'port-node',
      position: { x: 1100, y: 150 + i * 120 },
      data: {
        label: mapping.externalPortId,
        parameters: {},
        portDirection: 'output' as string,
        portId: mapping.externalPortId,
      },
    });
  }

  // Create internal module nodes
  for (const nodeDef of graph.nodes) {
    const nodeId = nanoid();
    idMap.set(nodeDef.internalId, nodeId);

    const childManifest = getManifest(nodeDef.moduleType);
    const defaultParams: Record<string, number> = {};
    for (const param of childManifest.parameters) {
      defaultParams[param.id] = param.defaultValue;
    }
    // Apply parameter bindings from parent
    if (nodeDef.parameterBindings) {
      Object.assign(defaultParams, nodeDef.parameterBindings);
    }

    nodes.push({
      id: nodeId,
      type: nodeDef.moduleType,
      position: nodeDef.position,
      dragHandle: '.daw-node__header',
      data: {
        label: childManifest.label,
        parameters: defaultParams,
      },
    });
  }

  // Create internal edges
  for (const edgeDef of graph.edges) {
    const sourceId = idMap.get(edgeDef.fromNode);
    const targetId = idMap.get(edgeDef.toNode);
    if (!sourceId || !targetId) continue;

    // Look up signal type from source port
    const sourceNodeDef = graph.nodes.find(n => n.internalId === edgeDef.fromNode);
    let signalType: 'audio' | 'parameter' | 'midi' = 'audio';
    let channelFormat: 'mono' | 'stereo' = 'mono';
    if (sourceNodeDef) {
      try {
        const srcManifest = getManifest(sourceNodeDef.moduleType);
        const port = srcManifest.ports.find(p => p.id === edgeDef.fromPort);
        if (port) {
          signalType = port.signalType;
          channelFormat = port.channelFormat;
        }
      } catch { /* use defaults */ }
    }

    edges.push({
      id: nanoid(),
      source: sourceId,
      sourceHandle: edgeDef.fromPort,
      target: targetId,
      targetHandle: edgeDef.toPort,
      type: signalType,
      data: { signalType, channelFormat },
    });
  }

  // Create edges from input port nodes to their mapped internal nodes
  for (const mapping of graph.exposedInputs) {
    const portNodeId = inputPortIds.get(mapping.externalPortId);
    const targetNodeId = idMap.get(mapping.internalNodeId);
    if (!portNodeId || !targetNodeId) continue;

    edges.push({
      id: nanoid(),
      source: portNodeId,
      sourceHandle: 'out',
      target: targetNodeId,
      targetHandle: mapping.internalPortId,
      type: 'audio',
      data: { signalType: 'audio', channelFormat: 'stereo' },
    });
  }

  // Create edges from internal nodes to output port nodes
  for (const mapping of graph.exposedOutputs) {
    const sourceNodeId = idMap.get(mapping.internalNodeId);
    const portNodeId = outputPortIds.get(mapping.externalPortId);
    if (!sourceNodeId || !portNodeId) continue;

    edges.push({
      id: nanoid(),
      source: sourceNodeId,
      sourceHandle: mapping.internalPortId,
      target: portNodeId,
      targetHandle: 'in',
      type: 'audio',
      data: { signalType: 'audio', channelFormat: 'stereo' },
    });
  }

  return { nodes, edges };
}
