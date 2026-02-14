import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function GainComputerNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const threshold = data.parameters.threshold ?? -18;
  const ratio = data.parameters.ratio ?? 4;

  return (
    <div className="daw-node daw-node--effect" style={{ minWidth: 160 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio" />
      <div className="daw-node__header"><span>Gain Computer</span></div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Threshold</span>
          <NodeSlider min={-60} max={0} step={0.5} value={threshold}
            onChange={v => updateParameter(id, 'threshold', v)} />
          <span className="daw-node__param-value">{threshold.toFixed(1)} dB</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Ratio</span>
          <NodeSlider min={1} max={20} step={0.5} value={ratio}
            onChange={v => updateParameter(id, 'ratio', v)} />
          <span className="daw-node__param-value">{ratio.toFixed(1)}:1</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
