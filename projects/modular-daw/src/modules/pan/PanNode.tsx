import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function PanModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);
  const pan = data.parameters.pan ?? 0;

  const formatPan = (p: number) => {
    if (Math.abs(p) < 0.01) return 'C';
    return p < 0 ? `L${Math.abs(Math.round(p * 100))}` : `R${Math.round(p * 100)}`;
  };

  const nodeClasses = ['daw-node daw-node--utility', data.bypassed ? 'daw-node--bypassed' : ''].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Pan</span>
        <div className="daw-node__sm-buttons">
          <button className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }} title="Bypass">B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Pan</span>
          <NodeSlider min={-1} max={1} step={0.01} value={pan}
            onChange={v => updateParameter(id, 'pan', v)} />
          <span className="daw-node__param-value">{formatPan(pan)}</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
