import { Handle, Position } from '@xyflow/react';

export function LinToDbNode() {
  return (
    <div className="daw-node daw-node--atomic" style={{ minWidth: 70 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio" />
      <div className="daw-node__header"><span>Lin&#x2192;dB</span></div>
      <div className="daw-node__body daw-node__symbol">20log</div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
