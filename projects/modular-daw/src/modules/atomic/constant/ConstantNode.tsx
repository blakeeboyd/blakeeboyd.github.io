import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../../store/graph-store';
import { NodeSlider } from '../../../components/NodeSlider';
import type { DawNode } from '../../../types/graph';

export function ConstantNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const value = data.parameters.value ?? 0;

  return (
    <div className="daw-node daw-node--atomic" style={{ minWidth: 80 }}>
      <div className="daw-node__header"><span>Const</span></div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <NodeSlider min={-1000} max={1000} step={0.01} value={value}
            onChange={v => updateParameter(id, 'value', v)} />
          <span className="daw-node__param-value">{value.toFixed(2)}</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
