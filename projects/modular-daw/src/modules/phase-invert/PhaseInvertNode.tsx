import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import type { DawNode } from '../../types/graph';

export function PhaseInvertModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const invertL = data.parameters.invertL ?? 1;
  const invertR = data.parameters.invertR ?? 1;

  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 120 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Phase Inv</span>
      </div>
      <div className="daw-node__body nodrag" style={{ display: 'flex', gap: 8, padding: '6px 8px' }}>
        <button
          className={`daw-node__sm-btn ${invertL ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); updateParameter(id, 'invertL', invertL ? 0 : 1); }}
          style={{ fontSize: '10px', padding: '3px 6px' }}
          title="Invert Left Channel"
        >&Oslash; L</button>
        <button
          className={`daw-node__sm-btn ${invertR ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); updateParameter(id, 'invertR', invertR ? 0 : 1); }}
          style={{ fontSize: '10px', padding: '3px 6px' }}
          title="Invert Right Channel"
        >&Oslash; R</button>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
