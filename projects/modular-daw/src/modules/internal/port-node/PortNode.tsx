import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DawNode } from '../../../types/graph';

/**
 * Boundary port node shown at the edges of an internal graph view.
 * Input ports appear on the left (with a source handle to connect outward).
 * Output ports appear on the right (with a target handle to receive connections).
 */
export function PortNode({ data }: NodeProps<DawNode>) {
  const isInput = data.portDirection === 'input';
  const label = data.label || 'Port';

  return (
    <div className={`daw-port-node daw-port-node--${isInput ? 'input' : 'output'}`}>
      {!isInput && (
        <Handle type="target" position={Position.Left} id="in"
          className="daw-handle daw-handle--audio daw-handle--stereo" />
      )}
      <div className="daw-port-node__label">{label}</div>
      {isInput && (
        <Handle type="source" position={Position.Right} id="out"
          className="daw-handle daw-handle--audio daw-handle--stereo" />
      )}
    </div>
  );
}
