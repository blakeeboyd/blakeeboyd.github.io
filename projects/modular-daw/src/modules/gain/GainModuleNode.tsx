import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { useMuteMap } from '../../hooks/use-mute-state';
import type { DawNode } from '../../types/graph';

export function GainModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleMute = useGraphStore(s => s.toggleMute);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;
  const gain = data.parameters.gain ?? 0;

  const nodeClasses = [
    'daw-node daw-node--utility',
    isDimmed ? 'daw-node--dimmed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <Handle
        type="target"
        position={Position.Bottom}
        id="gain-cv"
        className="daw-handle daw-handle--parameter"
      />
      <div className="daw-node__header">
        <span>Gain</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Gain</span>
          <NodeSlider
            min={-70}
            max={12}
            step={0.1}
            value={gain}
            onChange={v => updateParameter(id, 'gain', v)}
          />
          <span className="daw-node__param-value">{gain.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
