import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { useMuteMap } from '../../hooks/use-mute-state';
import type { DawNode } from '../../types/graph';

export function MergerModuleNode({ id, data }: NodeProps<DawNode>) {
  const toggleMute = useGraphStore(s => s.toggleMute);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;

  const nodeClasses = [
    'daw-node daw-node--routing',
    isDimmed ? 'daw-node--dimmed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="left"
        className="daw-handle daw-handle--audio daw-handle--pos-1of2" />
      <Handle type="target" position={Position.Left} id="right"
        className="daw-handle daw-handle--audio daw-handle--pos-2of2" />
      <div className="daw-node__header">
        <span>Merger</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body">
        <div className="daw-node__port-labels">
          <span className="daw-node__port-label">L</span>
          <span className="daw-node__port-label">R</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
