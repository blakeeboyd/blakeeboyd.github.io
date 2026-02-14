import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function DeEsserModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const frequency = data.parameters.frequency ?? 6000;
  const range = data.parameters.range ?? 6;
  const listen = data.parameters.listen ?? 0;

  // Gain reduction meter
  const meterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const drawMeter = useCallback(() => {
    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const reductionDb = proc?.getReductionDb?.() ?? 0;

    const absReduction = Math.abs(reductionDb);
    const pct = Math.min(100, (absReduction / 12) * 100);

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

  const handleListenToggle = useCallback(() => {
    updateParameter(id, 'listen', listen > 0.5 ? 0 : 1);
  }, [id, listen, updateParameter]);

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  const formatFreq = (f: number) => f >= 1000 ? `${(f / 1000).toFixed(1)} kHz` : `${f.toFixed(0)} Hz`;

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>De-esser</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn ${listen > 0.5 ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleListenToggle(); }}
            title="Listen to detection band"
            style={{ fontSize: '9px' }}
          >L</button>
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
          <span className="daw-node__param-label">Frequency</span>
          <NodeSlider min={2000} max={16000} step={100} value={frequency}
            onChange={v => updateParameter(id, 'frequency', v)} />
          <span className="daw-node__param-value">{formatFreq(frequency)}</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Range</span>
          <NodeSlider min={0} max={12} step={0.5} value={range}
            onChange={v => updateParameter(id, 'range', v)} />
          <span className="daw-node__param-value">{range.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
