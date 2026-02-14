import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DawNode } from '../../types/graph';

export function MonoSumModuleNode(_props: NodeProps<DawNode>) {
  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 100 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Mono Sum</span>
      </div>
      <div className="daw-node__body" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--daw-text-label)' }}>
        L+R &rarr; M
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--mono" />
    </div>
  );
}
