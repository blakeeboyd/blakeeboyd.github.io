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

export interface GraphState {
  nodes: DawNode[];
  edges: DawEdge[];

  // React Flow callbacks
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Domain actions
  addModule: (type: string, position?: { x: number; y: number }) => string;
  removeModule: (nodeId: string) => void;
  updateParameter: (nodeId: string, parameterId: string, value: number) => void;
}

export const useGraphStore = create<GraphState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],

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
        if (!connection.source || !connection.target) return;
        if (!connection.sourceHandle || !connection.targetHandle) return;

        // Look up source port to determine signal type
        const sourceNode = get().nodes.find(n => n.id === connection.source);
        if (!sourceNode) return;

        const sourceManifest = getManifest(sourceNode.type!);
        const sourcePort = sourceManifest.ports.find(
          p => p.id === connection.sourceHandle
        );
        if (!sourcePort) return;

        // Look up target port for validation
        const targetNode = get().nodes.find(n => n.id === connection.target);
        if (!targetNode) return;

        const targetManifest = getManifest(targetNode.type!);
        const targetPort = targetManifest.ports.find(
          p => p.id === connection.targetHandle
        );
        if (!targetPort) return;

        // Validate: signal types must match
        if (sourcePort.signalType !== targetPort.signalType) return;

        // Validate: source must be output, target must be input
        if (sourcePort.direction !== 'output' || targetPort.direction !== 'input') return;

        // Validate: no self-connections
        if (connection.source === connection.target) return;

        // Check if target port already has a connection (inputs accept 1 by default)
        const existingConn = get().edges.find(
          e => e.target === connection.target && e.targetHandle === connection.targetHandle
        );
        if (existingConn) return;

        const newEdge: DawEdge = {
          id: nanoid(),
          source: connection.source,
          sourceHandle: connection.sourceHandle,
          target: connection.target,
          targetHandle: connection.targetHandle,
          type: sourcePort.signalType,
          data: {
            signalType: sourcePort.signalType,
            channelFormat: sourcePort.channelFormat,
          },
        };

        set({ edges: [...get().edges, newEdge] });
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
