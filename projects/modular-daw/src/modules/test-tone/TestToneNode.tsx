import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { WAVEFORMS } from './manifest';
import type { DawNode } from '../../types/graph';

export function TestToneNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const frequency = data.parameters.frequency ?? 440;
  const waveformIndex = data.parameters.waveform ?? 0;

  return (
    <div className="daw-node daw-node--generator">
      <div className="daw-node__header">Test Tone</div>
      <div className="daw-node__body">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Freq</span>
          <input
            type="range"
            min={20}
            max={2000}
            step={1}
            value={frequency}
            onChange={e => updateParameter(id, 'frequency', parseFloat(e.target.value))}
            className="daw-node__slider"
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
