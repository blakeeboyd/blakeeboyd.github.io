import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import type { DawNode } from '../../types/graph';

export function GainModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const gain = data.parameters.gain ?? 0;

  return (
    <div className="daw-node daw-node--utility">
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio" />
      <Handle
        type="target"
        position={Position.Bottom}
        id="gain-cv"
        className="daw-handle daw-handle--parameter"
      />
      <div className="daw-node__header">Gain</div>
      <div className="daw-node__body">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Gain</span>
          <input
            type="range"
            min={-70}
            max={12}
            step={0.1}
            value={gain}
            onChange={e => updateParameter(id, 'gain', parseFloat(e.target.value))}
            className="daw-node__slider"
          />
          <span className="daw-node__param-value">{gain.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio" />
    </div>
  );
}
