import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/Canvas';
import { useGraphStore } from './store/graph-store';

export function App() {
  // Add the singleton Master Output on first render
  useEffect(() => {
    const { nodes, addModule } = useGraphStore.getState();
    if (!nodes.some(n => n.type === 'master-output')) {
      addModule('master-output', { x: 600, y: 200 });
    }
  }, []);

  return (
    <ReactFlowProvider>
      <div className="daw-app">
        <div className="daw-header">
          <h1 className="daw-title">Modular DAW</h1>
          <p className="daw-subtitle">Build audio signal chains by connecting modules with virtual patch cables.</p>
        </div>
        <Canvas />
      </div>
    </ReactFlowProvider>
  );
}
