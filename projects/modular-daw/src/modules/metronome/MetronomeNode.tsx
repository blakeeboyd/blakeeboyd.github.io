import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { useMuteMap } from '../../hooks/use-mute-state';
import type { DawNode } from '../../types/graph';

export function MetronomeNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleMute = useGraphStore(s => s.toggleMute);
  const toggleSolo = useGraphStore(s => s.toggleSolo);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;
  const volume = data.parameters.volume ?? -12;
  const enabled = (data.parameters.enabled ?? 1) >= 0.5;
  const accent = (data.parameters.accent ?? 1) >= 0.5;

  const nodeClasses = [
    'daw-node daw-node--generator',
    isDimmed ? 'daw-node--dimmed' : '',
    data.soloed ? 'daw-node--soloed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <div className="daw-node__header">
        <span>Metronome</span>
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
        <div className="daw-node__param">
          <span className="daw-node__param-label">Click</span>
          <button
            className={`daw-node__toggle-btn ${enabled ? 'active' : ''}`}
            onClick={() => updateParameter(id, 'enabled', enabled ? 0 : 1)}
          >
            {enabled ? 'On' : 'Off'}
          </button>
        </div>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Vol</span>
          <NodeSlider
            min={-70}
            max={0}
            step={0.1}
            value={volume}
            onChange={v => updateParameter(id, 'volume', v)}
          />
          <span className="daw-node__param-value">{Math.round(volume)} dB</span>
        </label>
        <div className="daw-node__param">
          <span className="daw-node__param-label">Accent</span>
          <button
            className={`daw-node__toggle-btn ${accent ? 'active' : ''}`}
            onClick={() => updateParameter(id, 'accent', accent ? 0 : 1)}
          >
            {accent ? 'Beat 1' : 'Off'}
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio" />
    </div>
  );
}
