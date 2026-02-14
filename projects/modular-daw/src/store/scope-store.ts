import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { DawNode, DawEdge } from '../types/graph';

export interface ScopeEntry {
  /** The node ID of the parent module instance (null for session root) */
  parentNodeId: string | null;
  /** Label for breadcrumb display */
  label: string;
  /** Module type for category coloring */
  moduleType: string | null;
}

export interface InternalGraphInstance {
  nodes: DawNode[];
  edges: DawEdge[];
}

export interface ScopeState {
  /** Stack of scope entries; index 0 is always session root */
  scopeStack: ScopeEntry[];

  /** Per-module-instance internal graphs, keyed by node ID */
  internalGraphs: Record<string, InternalGraphInstance>;

  /** Navigate into a module's internals */
  pushScope: (nodeId: string, label: string, moduleType: string) => void;

  /** Navigate back to a specific depth (0 = session root) */
  popToDepth: (depth: number) => void;

  /** Navigate back to session root */
  popToRoot: () => void;

  /** Initialize an internal graph for a module instance */
  initInternalGraph: (nodeId: string, nodes: DawNode[], edges: DawEdge[]) => void;

  /** Apply React Flow node changes to an internal graph */
  updateInternalNodes: (nodeId: string, changes: NodeChange[]) => void;

  /** Apply React Flow edge changes to an internal graph */
  updateInternalEdges: (nodeId: string, changes: EdgeChange[]) => void;

  /** Check if currently at session root */
  isSessionScope: () => boolean;

  /** Get the current scope's parent node ID (null at session root) */
  currentParentNodeId: () => string | null;

  /** Get current scope depth (0 = session root) */
  currentDepth: () => number;
}

export const useScopeStore = create<ScopeState>()((set, get) => ({
  scopeStack: [{ parentNodeId: null, label: 'Session', moduleType: null }],
  internalGraphs: {},

  pushScope: (nodeId, label, moduleType) => {
    set({
      scopeStack: [...get().scopeStack, { parentNodeId: nodeId, label, moduleType }],
    });
  },

  popToDepth: (depth) => {
    const stack = get().scopeStack;
    if (depth >= 0 && depth < stack.length) {
      set({ scopeStack: stack.slice(0, depth + 1) });
    }
  },

  popToRoot: () => {
    set({ scopeStack: [get().scopeStack[0]] });
  },

  initInternalGraph: (nodeId, nodes, edges) => {
    set({
      internalGraphs: {
        ...get().internalGraphs,
        [nodeId]: { nodes, edges },
      },
    });
  },

  updateInternalNodes: (nodeId, changes) => {
    const graphs = get().internalGraphs;
    const graph = graphs[nodeId];
    if (!graph) return;
    set({
      internalGraphs: {
        ...graphs,
        [nodeId]: {
          ...graph,
          nodes: applyNodeChanges(changes, graph.nodes) as DawNode[],
        },
      },
    });
  },

  updateInternalEdges: (nodeId, changes) => {
    const graphs = get().internalGraphs;
    const graph = graphs[nodeId];
    if (!graph) return;
    set({
      internalGraphs: {
        ...graphs,
        [nodeId]: {
          ...graph,
          edges: applyEdgeChanges(changes, graph.edges) as DawEdge[],
        },
      },
    });
  },

  isSessionScope: () => get().scopeStack.length <= 1,

  currentParentNodeId: () => {
    const stack = get().scopeStack;
    return stack.length > 1 ? stack[stack.length - 1].parentNodeId : null;
  },

  currentDepth: () => get().scopeStack.length - 1,
}));
