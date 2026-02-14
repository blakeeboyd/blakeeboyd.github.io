import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function EnvelopeDetectorNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const attack = data.parameters.attack ?? 0.003;
  const release = data.parameters.release ?? 0.25;

  return (
    <div className="daw-node daw-node--effect" style={{ minWidth: 160 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio" />
      <div className="daw-node__header"><span>Env Detector</span></div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Attack</span>
          <NodeSlider min={0.001} max={0.1} step={0.001} value={attack}
            onChange={v => updateParameter(id, 'attack', v)} />
          <span className="daw-node__param-value">{(attack * 1000).toFixed(1)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Release</span>
          <NodeSlider min={0.01} max={1} step={0.01} value={release}
            onChange={v => updateParameter(id, 'release', v)} />
          <span className="daw-node__param-value">{(release * 1000).toFixed(0)} ms</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out"
        className="daw-handle daw-handle--audio" />
    </div>
  );
}
