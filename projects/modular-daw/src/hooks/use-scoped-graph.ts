import { useCallback } from 'react';
import {
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import { useGraphStore } from '../store/graph-store';
import { useScopeStore } from '../store/scope-store';
import type { DawNode, DawEdge } from '../types/graph';

/**
 * Returns nodes, edges, and callbacks scoped to the current view.
 * At session root, delegates to graph-store.
 * Inside a composite module, delegates to scope-store's internal graph.
 */
export function useScopedGraph() {
  const isSession = useScopeStore(s => s.isSessionScope());
  const parentNodeId = useScopeStore(s => s.currentParentNodeId());
  const internalGraphs = useScopeStore(s => s.internalGraphs);

  // Session-level data
  const sessionNodes = useGraphStore(s => s.nodes);
  const sessionEdges = useGraphStore(s => s.edges);
  const sessionOnNodesChange = useGraphStore(s => s.onNodesChange);
  const sessionOnEdgesChange = useGraphStore(s => s.onEdgesChange);
  const sessionOnConnect = useGraphStore(s => s.onConnect);

  // Scope-level actions
  const updateInternalNodes = useScopeStore(s => s.updateInternalNodes);
  const updateInternalEdges = useScopeStore(s => s.updateInternalEdges);

  const internalGraph = parentNodeId ? internalGraphs[parentNodeId] : null;

  const nodes: DawNode[] = isSession
    ? sessionNodes
    : internalGraph?.nodes ?? [];

  const edges: DawEdge[] = isSession
    ? sessionEdges
    : internalGraph?.edges ?? [];

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (isSession) {
        sessionOnNodesChange(changes);
      } else if (parentNodeId) {
        updateInternalNodes(parentNodeId, changes);
      }
    },
    [isSession, parentNodeId, sessionOnNodesChange, updateInternalNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (isSession) {
        sessionOnEdgesChange(changes);
      } else if (parentNodeId) {
        updateInternalEdges(parentNodeId, changes);
      }
    },
    [isSession, parentNodeId, sessionOnEdgesChange, updateInternalEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (isSession) {
        sessionOnConnect(connection);
      }
      // Internal graph connections are read-only for now (future: allow rewiring)
    },
    [isSession, sessionOnConnect],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isSession,
  };
}
