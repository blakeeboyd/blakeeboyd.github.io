import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

const FILTER_TYPE_LABELS = ['LP', 'HP', 'BP', 'Notch', 'AP', 'LS', 'HS'];

export function FilterModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const filterType = data.parameters.filterType ?? 0;
  const frequency = data.parameters.frequency ?? 1000;
  const Q = data.parameters.Q ?? 1;
  const gain = data.parameters.gain ?? 0;

  const showGain = filterType >= 5; // shelf types

  const formatFreq = (f: number) => f >= 1000 ? `${(f / 1000).toFixed(1)} kHz` : `${f.toFixed(0)} Hz`;

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <Handle type="target" position={Position.Bottom} id="freq-cv" className="daw-handle daw-handle--parameter" />
      <div className="daw-node__header">
        <span>Filter</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {/* Filter type buttons */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 6, flexWrap: 'wrap' }}>
          {FILTER_TYPE_LABELS.map((label, i) => (
            <button
              key={i}
              className={`daw-node__sm-btn ${filterType === i ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); updateParameter(id, 'filterType', i); }}
              style={{ fontSize: '9px', padding: '2px 4px' }}
            >{label}</button>
          ))}
        </div>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Frequency</span>
          <NodeSlider min={20} max={20000} step={1} value={frequency}
            onChange={v => updateParameter(id, 'frequency', v)} />
          <span className="daw-node__param-value">{formatFreq(frequency)}</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Q</span>
          <NodeSlider min={0.1} max={20} step={0.1} value={Q}
            onChange={v => updateParameter(id, 'Q', v)} />
          <span className="daw-node__param-value">{Q.toFixed(1)}</span>
        </label>
        {showGain && (
          <label className="daw-node__param">
            <span className="daw-node__param-label">Gain</span>
            <NodeSlider min={-24} max={24} step={0.5} value={gain}
              onChange={v => updateParameter(id, 'gain', v)} />
            <span className="daw-node__param-value">{gain > 0 ? '+' : ''}{gain.toFixed(1)} dB</span>
          </label>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
