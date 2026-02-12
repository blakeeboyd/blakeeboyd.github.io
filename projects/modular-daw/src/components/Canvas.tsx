import { useMemo, useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/canvas.css';
import '../styles/nodes.css';
import '../styles/edges.css';
import { useGraphStore } from '../store/graph-store';
import { useAudioEngine } from '../hooks/use-audio-engine';
import { getNodeTypes } from '../modules/registry';
import { edgeTypes } from '../edges/edge-types';
import { ModulePanel } from './ModulePanel';
import { Toolbar } from './Toolbar';

export function Canvas() {
  const nodes = useGraphStore(s => s.nodes);
  const edges = useGraphStore(s => s.edges);
  const onNodesChange = useGraphStore(s => s.onNodesChange);
  const onEdgesChange = useGraphStore(s => s.onEdgesChange);
  const onConnect = useGraphStore(s => s.onConnect);

  const { initialize } = useAudioEngine();
  const [audioReady, setAudioReady] = useState(false);

  const nodeTypes = useMemo(() => getNodeTypes(), []);

  const handleStartAudio = useCallback(async () => {
    await initialize();
    setAudioReady(true);
  }, [initialize]);

  return (
    <div className="daw-canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <MiniMap pannable zoomable nodeStrokeWidth={3} />
        <Controls />
        {audioReady && (
          <Panel position="top-left">
            <ModulePanel />
          </Panel>
        )}
        {audioReady && (
          <Panel position="top-right">
            <Toolbar />
          </Panel>
        )}
        {!audioReady && (
          <Panel position="top-center">
            <button className="daw-start-audio" onClick={handleStartAudio}>
              Start Audio Engine
            </button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
