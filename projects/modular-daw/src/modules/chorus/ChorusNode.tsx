import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function ChorusModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const rate = data.parameters.rate ?? 1.5;
  const depth = data.parameters.depth ?? 0.005;
  const mix = data.parameters.mix ?? 0.5;

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Chorus</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Rate</span>
          <NodeSlider min={0.1} max={10} step={0.1} value={rate}
            onChange={v => updateParameter(id, 'rate', v)} />
          <span className="daw-node__param-value">{rate.toFixed(1)} Hz</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Depth</span>
          <NodeSlider min={0} max={0.02} step={0.001} value={depth}
            onChange={v => updateParameter(id, 'depth', v)} />
          <span className="daw-node__param-value">{(depth * 1000).toFixed(1)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Mix</span>
          <NodeSlider min={0} max={1} step={0.01} value={mix}
            onChange={v => updateParameter(id, 'mix', v)} />
          <span className="daw-node__param-value">{(mix * 100).toFixed(0)}%</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
