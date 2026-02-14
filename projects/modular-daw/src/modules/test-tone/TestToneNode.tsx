import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { WAVEFORMS } from './manifest';
import { NodeSlider } from '../../components/NodeSlider';
import { useMuteMap } from '../../hooks/use-mute-state';
import type { DawNode } from '../../types/graph';

export function TestToneNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleMute = useGraphStore(s => s.toggleMute);
  const toggleSolo = useGraphStore(s => s.toggleSolo);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;
  const frequency = data.parameters.frequency ?? 440;
  const waveformIndex = data.parameters.waveform ?? 0;

  const nodeClasses = [
    'daw-node daw-node--generator',
    isDimmed ? 'daw-node--dimmed' : '',
    data.soloed ? 'daw-node--soloed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <div className="daw-node__header">
        <span>Test Tone</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--solo ${data.soloed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleSolo(id, !e.shiftKey); }}
            title="Solo (Shift+click for additive)"
          >S</button>
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Freq</span>
          <NodeSlider
            min={20}
            max={2000}
            step={1}
            value={frequency}
            onChange={v => updateParameter(id, 'frequency', v)}
          />
          <span className="daw-node__param-value">{Math.round(frequency)} Hz</span>
        </label>
        <div className="daw-node__param">
          <span className="daw-node__param-label">Wave</span>
          <div className="daw-node__waveform-btns">
            {WAVEFORMS.map((w, i) => (
              <button
                key={w}
                className={`daw-node__waveform-btn ${i === Math.round(waveformIndex) ? 'active' : ''}`}
                onClick={() => updateParameter(id, 'waveform', i)}
              >
                {w.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio" />
    </div>
  );
}
