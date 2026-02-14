import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function MasterOutputNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const volume = data.parameters.volume ?? 0;

  return (
    <div className="daw-node daw-node--io">
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">Master Output</div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Vol</span>
          <NodeSlider
            min={-70}
            max={6}
            step={0.1}
            value={volume}
            onChange={v => updateParameter(id, 'volume', v)}
          />
          <span className="daw-node__param-value">{volume.toFixed(1)} dB</span>
        </label>
      </div>
    </div>
  );
}
