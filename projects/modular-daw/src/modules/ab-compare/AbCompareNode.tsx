import { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import type { DawNode } from '../../types/graph';

export function AbCompareModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const select = data.parameters.select ?? 0;
  const isB = select >= 0.5;

  const handleToggle = useCallback(() => {
    updateParameter(id, 'select', isB ? 0 : 1);
  }, [id, isB, updateParameter]);

  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 100 }}>
      <Handle type="target" position={Position.Left} id="a"
        className="daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2" />
      <Handle type="target" position={Position.Left} id="b"
        className="daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-2of2" />
      <div className="daw-node__header">
        <span>A/B</span>
      </div>
      <div className="daw-node__body nodrag" style={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
          style={{
            fontSize: '16px',
            fontWeight: 700,
            padding: '6px 16px',
            background: isB ? 'var(--daw-accent)' : 'var(--daw-success)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >{isB ? 'B' : 'A'}</button>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
