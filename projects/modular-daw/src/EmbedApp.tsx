import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/Canvas';
import { useGraphStore } from './store/graph-store';
import { getManifest } from './modules/registry';
import { nanoid } from 'nanoid';
import type { DawNode, DawEdge } from './types/graph';

export interface PatchNodeDef {
  id: string;
  type: string;
  position: { x: number; y: number };
  parameters?: Record<string, number>;
}

export interface PatchEdgeDef {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

export interface PatchDef {
  nodes: PatchNodeDef[];
  edges: PatchEdgeDef[];
}

export interface EmbedAppProps {
  title?: string;
  subtitle?: string;
  initialPatch?: PatchDef;
  allowedModules?: string[];
}

export function EmbedApp({ title, subtitle, initialPatch, allowedModules }: EmbedAppProps) {
  useEffect(() => {
    const { nodes, addModule, loadPatch } = useGraphStore.getState();

    if (initialPatch) {
      // Build proper DawNode[] from patch definition
      const dawNodes: DawNode[] = initialPatch.nodes.map(n => {
        const manifest = getManifest(n.type);
        const defaultParams: Record<string, number> = {};
        for (const param of manifest.parameters) {
          defaultParams[param.id] = param.defaultValue;
        }
        if (n.parameters) Object.assign(defaultParams, n.parameters);

        return {
          id: n.id,
          type: n.type,
          position: n.position,
          dragHandle: '.daw-node__header',
          data: {
            label: manifest.label,
            parameters: defaultParams,
          },
        };
      });

      const dawEdges: DawEdge[] = initialPatch.edges.map(e => {
        const sourceNode = dawNodes.find(n => n.id === e.source);
        const sourceManifest = getManifest(sourceNode!.type!);
        const sourcePort = sourceManifest.ports.find(p => p.id === e.sourceHandle);
        if (!sourcePort) {
          throw new Error(`Port "${e.sourceHandle}" not found on module "${sourceNode!.type}"`);
        }

        return {
          id: nanoid(),
          source: e.source,
          sourceHandle: e.sourceHandle,
          target: e.target,
          targetHandle: e.targetHandle,
          type: sourcePort.signalType,
          data: {
            signalType: sourcePort.signalType,
            channelFormat: sourcePort.channelFormat,
          },
        };
      });

      loadPatch(dawNodes, dawEdges);
    } else {
      // Default: just add master output like the standalone App
      if (!nodes.some(n => n.type === 'master-output')) {
        addModule('master-output', { x: 600, y: 200 });
      }
    }
  }, []);

  return (
    <ReactFlowProvider>
      <div className="daw-app">
        {(title || subtitle) && (
          <div className="daw-header">
            {title && <h1 className="daw-title">{title}</h1>}
            {subtitle && <p className="daw-subtitle">{subtitle}</p>}
          </div>
        )}
        <Canvas allowedModules={allowedModules} />
      </div>
    </ReactFlowProvider>
  );
}
