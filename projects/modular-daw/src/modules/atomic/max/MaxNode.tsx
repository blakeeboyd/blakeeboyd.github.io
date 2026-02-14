import { Handle, Position } from '@xyflow/react';

export function MaxNode() {
  return (
    <div className="daw-node daw-node--atomic" style={{ minWidth: 60 }}>
      <Handle type="target" position={Position.Left} id="a"
        className="daw-handle daw-handle--audio daw-handle--pos-1of2" />
      <Handle type="target" position={Position.Left} id="b"
        className="daw-handle daw-handle--audio daw-handle--pos-2of2" />
      <div className="daw-node__header"><span>Max</span></div>
      <div className="daw-node__body daw-node__symbol">max</div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
