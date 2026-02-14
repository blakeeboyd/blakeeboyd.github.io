import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { DawNode, DawEdge } from '../types/graph';
import { getManifest } from '../modules/registry';
import { validateConnection } from '../utils/validate-connection';

export interface GraphState {
  nodes: DawNode[];
  edges: DawEdge[];
  lastConnectionError: string | null;

  // React Flow callbacks
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Domain actions
  addModule: (type: string, position?: { x: number; y: number }) => string;
  removeModule: (nodeId: string) => void;
  updateParameter: (nodeId: string, parameterId: string, value: number) => void;
  setNodeData: (nodeId: string, patch: Partial<DawNode['data']>) => void;
  toggleMute: (nodeId: string) => void;
  toggleSolo: (nodeId: string, exclusive?: boolean) => void;
  clearAllSolo: () => void;
  toggleBypass: (nodeId: string) => void;
  loadPatch: (nodes: DawNode[], edges: DawEdge[]) => void;
  clearConnectionError: () => void;
}

export const useGraphStore = create<GraphState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      lastConnectionError: null,

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as DawNode[],
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges) as DawEdge[],
        });
      },

      onConnect: (connection) => {
        const result = validateConnection(connection, get().nodes, get().edges);
        if (!result.valid) {
          set({ lastConnectionError: result.reason ?? 'Invalid connection' });
          return;
        }

        // Look up source port for edge metadata
        const sourceNode = get().nodes.find(n => n.id === connection.source)!;
        const sourceManifest = getManifest(sourceNode.type!);
        const sourcePort = sourceManifest.ports.find(
          p => p.id === connection.sourceHandle
        )!;

        const newEdge: DawEdge = {
          id: nanoid(),
          source: connection.source!,
          sourceHandle: connection.sourceHandle!,
          target: connection.target!,
          targetHandle: connection.targetHandle!,
          type: sourcePort.signalType,
          data: {
            signalType: sourcePort.signalType,
            channelFormat: sourcePort.channelFormat,
          },
        };

        set({ edges: [...get().edges, newEdge], lastConnectionError: null });
      },

      addModule: (type, position) => {
        const manifest = getManifest(type);

        // Check singleton constraint
        if (manifest.singleton) {
          const existing = get().nodes.find(n => n.type === type);
          if (existing) return existing.id;
        }

        const id = nanoid();
        const defaultParams: Record<string, number> = {};
        for (const param of manifest.parameters) {
          defaultParams[param.id] = param.defaultValue;
        }

        const newNode: DawNode = {
          id,
          type,
          position: position ?? { x: 100, y: 100 },
          dragHandle: '.daw-node__header',
          data: {
            label: manifest.label,
            parameters: defaultParams,
          },
        };

        set({ nodes: [...get().nodes, newNode] });
        return id;
      },

      removeModule: (nodeId) => {
        // Check if singleton (don't allow deletion)
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
          const manifest = getManifest(node.type!);
          if (manifest.singleton) return;
        }

        set({
          nodes: get().nodes.filter(n => n.id !== nodeId),
          edges: get().edges.filter(
            e => e.source !== nodeId && e.target !== nodeId
          ),
        });
      },

      updateParameter: (nodeId, parameterId, value) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    parameters: {
                      ...n.data.parameters,
                      [parameterId]: value,
                    },
                  },
                }
              : n
          ),
        });
      },

      setNodeData: (nodeId, patch) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, ...patch } }
              : n
          ),
        });
      },

      toggleMute: (nodeId) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, muted: !n.data.muted } }
              : n
          ),
        });
      },

      toggleSolo: (nodeId, exclusive = true) => {
        const nodes = get().nodes;
        const targetNode = nodes.find(n => n.id === nodeId);
        if (!targetNode) return;

        const newSoloed = !targetNode.data.soloed;

        set({
          nodes: nodes.map(n => {
            if (n.id === nodeId) {
              return { ...n, data: { ...n.data, soloed: newSoloed } };
            }
            // In exclusive mode, un-solo all others when soloing
            if (exclusive && newSoloed) {
              return { ...n, data: { ...n.data, soloed: false } };
            }
            return n;
          }),
        });
      },

      clearAllSolo: () => {
        set({
          nodes: get().nodes.map(n =>
            n.data.soloed ? { ...n, data: { ...n.data, soloed: false } } : n
          ),
        });
      },

      toggleBypass: (nodeId) => {
        set({
          nodes: get().nodes.map(n =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, bypassed: !n.data.bypassed } }
              : n
          ),
        });
      },

      clearConnectionError: () => {
        set({ lastConnectionError: null });
      },

      loadPatch: (nodes, edges) => {
        set({ nodes, edges });
      },
    }),
    {
      // Undo/redo config: exclude position-only changes
      limit: 100,
      partialize: (state) => ({
        nodes: state.nodes.map(n => ({
          id: n.id,
          type: n.type,
          data: n.data,
        })),
        edges: state.edges,
      }),
    }
  )
);
