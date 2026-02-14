import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { useMuteMap } from '../../hooks/use-mute-state';
import type { DawNode } from '../../types/graph';

const CHANNELS = [
  { portId: 'in1', paramId: 'gain1', label: 'In 1' },
  { portId: 'in2', paramId: 'gain2', label: 'In 2' },
  { portId: 'in3', paramId: 'gain3', label: 'In 3' },
  { portId: 'in4', paramId: 'gain4', label: 'In 4' },
] as const;

export function MixerModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleMute = useGraphStore(s => s.toggleMute);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;

  const nodeClasses = [
    'daw-node daw-node--routing',
    isDimmed ? 'daw-node--dimmed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      {CHANNELS.map((ch, i) => (
        <Handle
          key={ch.portId}
          type="target"
          position={Position.Left}
          id={ch.portId}
          className={`daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-${i + 1}of4`}
        />
      ))}
      <div className="daw-node__header">
        <span>Mixer</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {CHANNELS.map(ch => {
          const gain = data.parameters[ch.paramId] ?? 0;
          return (
            <label key={ch.paramId} className="daw-node__param">
              <span className="daw-node__param-label">{ch.label}</span>
              <NodeSlider
                min={-70}
                max={12}
                step={0.1}
                value={gain}
                onChange={v => updateParameter(id, ch.paramId, v)}
              />
              <span className="daw-node__param-value">{gain.toFixed(1)} dB</span>
            </label>
          );
        })}
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
