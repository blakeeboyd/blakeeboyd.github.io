import { useRef, useEffect, useCallback, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function GateModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const threshold = data.parameters.threshold ?? -40;
  const attack = data.parameters.attack ?? 0.001;
  const hold = data.parameters.hold ?? 0.05;
  const release = data.parameters.release ?? 0.1;
  const range = data.parameters.range ?? -80;

  // Gate state LED
  const [gateOpen, setGateOpen] = useState(false);
  const rafRef = useRef<number>(0);

  const pollGate = useCallback(() => {
    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const reduction = proc?.getReductionDb?.() ?? -80;
    setGateOpen(reduction > -1);
    rafRef.current = requestAnimationFrame(pollGate);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(pollGate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pollGate]);

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2" />
      <Handle type="target" position={Position.Left} id="sidechain"
        className="daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2" />
      <div className="daw-node__header">
        <span>Gate</span>
        <div className="daw-node__sm-buttons">
          <span
            className="daw-gate__led"
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: gateOpen ? 'var(--daw-success)' : 'var(--daw-error)',
              marginRight: 4,
            }}
            title={gateOpen ? 'Open' : 'Closed'}
          />
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Threshold</span>
          <NodeSlider min={-80} max={-10} step={0.5} value={threshold}
            onChange={v => updateParameter(id, 'threshold', v)} />
          <span className="daw-node__param-value">{threshold.toFixed(1)} dB</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Attack</span>
          <NodeSlider min={0.0001} max={0.05} step={0.0001} value={attack}
            onChange={v => updateParameter(id, 'attack', v)} />
          <span className="daw-node__param-value">{(attack * 1000).toFixed(1)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Hold</span>
          <NodeSlider min={0} max={0.5} step={0.001} value={hold}
            onChange={v => updateParameter(id, 'hold', v)} />
          <span className="daw-node__param-value">{(hold * 1000).toFixed(0)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Release</span>
          <NodeSlider min={0.01} max={0.5} step={0.01} value={release}
            onChange={v => updateParameter(id, 'release', v)} />
          <span className="daw-node__param-value">{(release * 1000).toFixed(0)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Range</span>
          <NodeSlider min={-80} max={0} step={0.5} value={range}
            onChange={v => updateParameter(id, 'range', v)} />
          <span className="daw-node__param-value">{range.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
