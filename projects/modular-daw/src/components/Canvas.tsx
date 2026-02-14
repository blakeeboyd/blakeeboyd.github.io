import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/canvas.css';
import '../styles/nodes.css';
import '../styles/edges.css';
import { useAudioEngine } from '../hooks/use-audio-engine';
import { getNodeTypes, getManifest } from '../modules/registry';
import { edgeTypes } from '../edges/edge-types';
import { useTransportStore } from '../store/transport-store';
import { useGraphStore } from '../store/graph-store';
import { useScopeStore } from '../store/scope-store';
import { useScopedGraph } from '../hooks/use-scoped-graph';
import { validateConnection } from '../utils/validate-connection';
import { ModulePanel } from './ModulePanel';
import { Toolbar } from './Toolbar';
import { TransportBar } from './TransportBar';
import { BreadcrumbNav } from './BreadcrumbNav';
import { WaveformEditor } from './WaveformEditor';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Toast } from './Toast';
import { useEditorStore } from '../store/editor-store';

export function Canvas({ allowedModules }: { allowedModules?: string[] }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, isSession } = useScopedGraph();
  const isInScope = !isSession;
  const scopeStack = useScopeStore(s => s.scopeStack);

  const { initialize } = useAudioEngine();
  const [audioReady, setAudioReady] = useState(false);

  const nodeTypes = useMemo(() => getNodeTypes(), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Toast for connection errors
  const lastConnectionError = useGraphStore(s => s.lastConnectionError);
  const clearConnectionError = useGraphStore(s => s.clearConnectionError);

  const handleStartAudio = useCallback(async () => {
    await initialize();
    setAudioReady(true);
  }, [initialize]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current?.requestFullscreen();
    }
  }, []);

  // Port compatibility: set data-drag-signal on container during cable drag
  const handleConnectStart = useCallback((_: unknown, params: { nodeId: string | null; handleId: string | null }) => {
    if (!params.nodeId || !params.handleId || !containerRef.current) return;
    const node = useGraphStore.getState().nodes.find(n => n.id === params.nodeId);
    if (!node) return;
    try {
      const manifest = getManifest(node.type!);
      const port = manifest.ports.find(p => p.id === params.handleId);
      if (port) {
        containerRef.current.setAttribute('data-drag-signal', port.signalType);
      }
    } catch {
      // Module not found, ignore
    }
  }, []);

  const handleConnectEnd = useCallback(() => {
    containerRef.current?.removeAttribute('data-drag-signal');
  }, []);

  // isValidConnection for React Flow's built-in validation visual feedback
  const isValidConnection = useCallback((connection: Connection) => {
    const { nodes: currentNodes, edges: currentEdges } = useGraphStore.getState();
    return validateConnection(connection, currentNodes, currentEdges).valid;
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!audioReady) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        const { isPlaying, play, pause } = useTransportStore.getState();
        if (isPlaying) pause();
        else play();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        useTransportStore.getState().seek(0);
      } else if (e.code === 'Escape') {
        // Pop scope first, then handle editor
        const scope = useScopeStore.getState();
        if (!scope.isSessionScope()) {
          scope.popToDepth(scope.currentDepth() - 1);
          return;
        }
        const editor = useEditorStore.getState();
        if (editor.selectedRegionIds.length > 0) {
          editor.selectRegions([]);
        } else if (editor.isOpen) {
          editor.closeEditor();
        }
      } else if (e.key === 'v' || e.key === 'V') {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('pointer');
        }
      } else if (e.key === 't') {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('trim');
        }
      } else if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('slice');
        }
      } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('fade');
        }
      } else if (e.key === 'z' && !e.ctrlKey && !e.metaKey) {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('zoom');
        }
      } else if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().setTool('draw');
        }
      } else if (e.key === 'g') {
        if (useEditorStore.getState().isOpen) {
          useEditorStore.getState().toggleSnap();
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && useEditorStore.getState().isOpen) {
        const { selectedRegionIds, removeRegion } = useEditorStore.getState();
        for (const rid of selectedRegionIds) {
          removeRegion(rid);
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioReady]);

  const editorIsOpen = useEditorStore(s => s.isOpen);

  return (
    <div ref={wrapperRef} className={`daw-canvas-wrapper ${editorIsOpen ? 'daw-canvas-wrapper--editor-open' : ''}`}>
      <div ref={containerRef} className={`daw-canvas-container ${isInScope ? 'daw-canvas-container--scope' : ''}`}>
        <ReactFlow
          key={scopeStack.length}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
          isValidConnection={isValidConnection}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <MiniMap pannable zoomable nodeStrokeWidth={3} />
          <Controls />
          {audioReady && isSession && (
            <Panel position="top-left">
              <ModulePanel allowedModules={allowedModules} />
            </Panel>
          )}
          {audioReady && (
            <Panel position="top-right">
              <Toolbar onToggleFullscreen={toggleFullscreen} />
            </Panel>
          )}
          {audioReady && (
            <Panel position="bottom-center">
              <TransportBar />
            </Panel>
          )}
          {audioReady && isInScope && (
            <Panel position="top-center">
              <BreadcrumbNav />
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
        {lastConnectionError && (
          <Toast
            message={lastConnectionError}
            variant="error"
            onDismiss={clearConnectionError}
          />
        )}
      </div>
      <WaveformEditor />
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}
