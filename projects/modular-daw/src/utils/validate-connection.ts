import type { Connection } from '@xyflow/react';
import type { DawNode, DawEdge } from '../types/graph';
import { getManifest } from '../modules/registry';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate whether a proposed connection is allowed.
 * Returns { valid: true } or { valid: false, reason: "..." }.
 */
export function validateConnection(
  connection: Connection,
  nodes: DawNode[],
  edges: DawEdge[],
): ValidationResult {
  if (!connection.source || !connection.target) {
    return { valid: false, reason: 'Missing source or target' };
  }
  if (!connection.sourceHandle || !connection.targetHandle) {
    return { valid: false, reason: 'Missing port handle' };
  }

  // No self-connections
  if (connection.source === connection.target) {
    return { valid: false, reason: 'Cannot connect a module to itself' };
  }

  const sourceNode = nodes.find(n => n.id === connection.source);
  if (!sourceNode) return { valid: false, reason: 'Source node not found' };

  const targetNode = nodes.find(n => n.id === connection.target);
  if (!targetNode) return { valid: false, reason: 'Target node not found' };

  const sourceManifest = getManifest(sourceNode.type!);
  const sourcePort = sourceManifest.ports.find(p => p.id === connection.sourceHandle);
  if (!sourcePort) return { valid: false, reason: 'Source port not found' };

  const targetManifest = getManifest(targetNode.type!);
  const targetPort = targetManifest.ports.find(p => p.id === connection.targetHandle);
  if (!targetPort) return { valid: false, reason: 'Target port not found' };

  // Direction check
  if (sourcePort.direction !== 'output' || targetPort.direction !== 'input') {
    return { valid: false, reason: 'Must connect output to input' };
  }

  // Signal type compatibility
  if (sourcePort.signalType !== targetPort.signalType) {
    return {
      valid: false,
      reason: `Signal type mismatch: ${sourcePort.signalType} → ${targetPort.signalType}`,
    };
  }

  // Input port already connected (single connection limit)
  const existingConn = edges.find(
    e => e.target === connection.target && e.targetHandle === connection.targetHandle,
  );
  if (existingConn) {
    return { valid: false, reason: 'Input port already connected' };
  }

  return { valid: true };
}
