import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function TapeSaturationModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const drive = data.parameters.drive ?? 30;
  const tone = data.parameters.tone ?? 0;
  const mix = data.parameters.mix ?? 1;

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Tape Sat</span>
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
          <span className="daw-node__param-label">Drive</span>
          <NodeSlider min={0} max={100} step={1} value={drive}
            onChange={v => updateParameter(id, 'drive', v)} />
          <span className="daw-node__param-value">{drive.toFixed(0)}%</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Tone</span>
          <NodeSlider min={-100} max={100} step={1} value={tone}
            onChange={v => updateParameter(id, 'tone', v)} />
          <span className="daw-node__param-value">{tone > 0 ? '+' : ''}{tone.toFixed(0)}</span>
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
