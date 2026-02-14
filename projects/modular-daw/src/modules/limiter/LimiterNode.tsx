import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function LimiterNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const threshold = data.parameters.threshold ?? -1;
  const release = data.parameters.release ?? 0.1;
  const lookahead = data.parameters.lookahead ?? 0.001;

  // Gain reduction meter
  const meterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const drawMeter = useCallback(() => {
    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const reductionDb = proc?.getReductionDb?.() ?? 0;

    const absReduction = Math.abs(reductionDb);
    const pct = Math.min(100, (absReduction / 20) * 100);

    if (meterRef.current) {
      meterRef.current.style.width = `${pct}%`;
    }
    if (labelRef.current) {
      labelRef.current.textContent = absReduction > 0.1 ? `${reductionDb.toFixed(1)} dB` : '0.0 dB';
    }

    rafRef.current = requestAnimationFrame(drawMeter);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawMeter);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawMeter]);

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Limiter</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {/* Gain reduction meter */}
        <div className="daw-compressor__gr-meter">
          <div className="daw-compressor__gr-bar" ref={meterRef} />
          <span className="daw-compressor__gr-label" ref={labelRef}>0.0 dB</span>
        </div>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Threshold</span>
          <NodeSlider min={-30} max={0} step={0.5} value={threshold}
            onChange={v => updateParameter(id, 'threshold', v)} />
          <span className="daw-node__param-value">{threshold.toFixed(1)} dB</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Release</span>
          <NodeSlider min={0.01} max={0.5} step={0.01} value={release}
            onChange={v => updateParameter(id, 'release', v)} />
          <span className="daw-node__param-value">{(release * 1000).toFixed(0)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Lookahead</span>
          <NodeSlider min={0} max={0.005} step={0.0001} value={lookahead}
            onChange={v => updateParameter(id, 'lookahead', v)} />
          <span className="daw-node__param-value">{(lookahead * 1000).toFixed(1)} ms</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
