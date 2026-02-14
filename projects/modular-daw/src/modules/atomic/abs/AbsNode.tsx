import { Handle, Position } from '@xyflow/react';

export function AbsNode() {
  return (
    <div className="daw-node daw-node--atomic" style={{ minWidth: 60 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio" />
      <div className="daw-node__header"><span>Abs</span></div>
      <div className="daw-node__body daw-node__symbol">|x|</div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
