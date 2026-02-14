import type { DawNode, DawEdge } from '../types/graph';
import type { ModuleManifest } from '../types/modules';

/**
 * Resolves the effective mute state for every node in the graph.
 *
 * When no nodes are soloed, each node simply uses its own `muted` flag.
 * When one or more nodes are soloed, a BFS downstream from soloed nodes
 * determines which nodes remain audible. Everything else is effectively muted.
 * Solo-safe nodes (e.g., Master Output) always remain audible.
 * Explicitly muted nodes are always muted, even if soloed.
 *
 * Returns a Map<nodeId, isMuted>.
 */
export function resolveMuteState(
  nodes: DawNode[],
  edges: DawEdge[],
  getManifest: (type: string) => ModuleManifest,
): Map<string, boolean> {
  const result = new Map<string, boolean>();

  const soloedIds = nodes.filter(n => n.data.soloed).map(n => n.id);

  // No solo active: just use each node's own muted flag
  if (soloedIds.length === 0) {
    for (const node of nodes) {
      result.set(node.id, !!node.data.muted);
    }
    return result;
  }

  // Build adjacency list (source → targets)
  const adj = new Map<string, string[]>();
  for (const node of nodes) {
    adj.set(node.id, []);
  }
  for (const edge of edges) {
    const targets = adj.get(edge.source);
    if (targets) {
      targets.push(edge.target);
    }
  }

  // BFS downstream from all soloed nodes
  const reachable = new Set<string>(soloedIds);
  const queue = [...soloedIds];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adj.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // Mark solo-safe nodes as reachable
  for (const node of nodes) {
    try {
      const manifest = getManifest(node.type);
      if (manifest.soloSafe) {
        reachable.add(node.id);
      }
    } catch {
      // Unknown module type, skip
    }
  }

  // Resolve: muted if not reachable OR explicitly muted
  for (const node of nodes) {
    const effectivelyMuted = !reachable.has(node.id) || !!node.data.muted;
    result.set(node.id, effectivelyMuted);
  }

  return result;
}
