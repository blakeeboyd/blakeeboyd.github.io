import { useMemo } from 'react';
import { useGraphStore } from '../store/graph-store';
import { resolveMuteState } from '../audio/solo-mute-resolver';
import { getManifest } from '../modules/registry';

/**
 * Returns the resolved mute map for all nodes.
 * Recomputes when nodes or edges change.
 */
export function useMuteMap(): Map<string, boolean> {
  const nodes = useGraphStore(s => s.nodes);
  const edges = useGraphStore(s => s.edges);

  return useMemo(
    () => resolveMuteState(nodes, edges, getManifest),
    [nodes, edges],
  );
}

/**
 * Returns whether any node in the graph is currently soloed.
 */
export function useAnySoloed(): boolean {
  const nodes = useGraphStore(s => s.nodes);
  return useMemo(() => nodes.some(n => n.data.soloed), [nodes]);
}
