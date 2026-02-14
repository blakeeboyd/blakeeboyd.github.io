import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)}k`;
  return `${Math.round(hz)}`;
}

// Compute approximate biquad magnitude response for visualization
function lowShelfResponse(freq: number, centerFreq: number, gain: number): number {
  const ratio = freq / centerFreq;
  const gainLin = Math.pow(10, gain / 40);
  // Simplified low-shelf response
  if (ratio < 0.5) return gainLin;
  if (ratio > 2) return 1;
  const t = (ratio - 0.5) / 1.5;
  return gainLin + (1 - gainLin) * t;
}

function peakResponse(freq: number, centerFreq: number, gain: number, Q: number): number {
  const ratio = freq / centerFreq;
  const logRatio = Math.log2(ratio);
  const bw = 1 / Q;
  const x = logRatio / bw;
  const gainLin = Math.pow(10, gain / 20);
  return 1 + (gainLin - 1) * Math.exp(-x * x * 2);
}

function highShelfResponse(freq: number, centerFreq: number, gain: number): number {
  const ratio = freq / centerFreq;
  const gainLin = Math.pow(10, gain / 40);
  if (ratio > 2) return gainLin;
  if (ratio < 0.5) return 1;
  const t = (ratio - 0.5) / 1.5;
  return 1 + (gainLin - 1) * t;
}

export function EQModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const lowFreq = data.parameters.lowFreq ?? 80;
  const lowGain = data.parameters.lowGain ?? 0;
  const midFreq = data.parameters.midFreq ?? 1000;
  const midGain = data.parameters.midGain ?? 0;
  const midQ = data.parameters.midQ ?? 1;
  const highFreq = data.parameters.highFreq ?? 8000;
  const highGain = data.parameters.highGain ?? 0;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    // Grid lines at +/- 12 dB
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (const db of [-12, 0, 12]) {
      const y = midY - (db / 24) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw composite EQ curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < w; i++) {
      // Map pixel to log frequency (20 Hz to 20000 Hz)
      const freq = 20 * Math.pow(1000, i / w);

      // Composite response in linear scale
      let response = 1;
      response *= lowShelfResponse(freq, lowFreq, lowGain);
      response *= peakResponse(freq, midFreq, midGain, midQ);
      response *= highShelfResponse(freq, highFreq, highGain);

      // Convert to dB and map to canvas
      const db = 20 * Math.log10(response);
      const y = midY - (db / 24) * h;

      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();

    // Band markers (dots at center frequencies)
    const bands = [
      { freq: lowFreq, gain: lowGain, color: '#f59e0b' },
      { freq: midFreq, gain: midGain, color: '#22c55e' },
      { freq: highFreq, gain: highGain, color: '#a855f7' },
    ];
    for (const band of bands) {
      const x = (Math.log10(band.freq / 20) / Math.log10(1000)) * w;
      const y = midY - (band.gain / 24) * h;
      ctx.fillStyle = band.color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [lowFreq, lowGain, midFreq, midGain, midQ, highFreq, highGain]);

  useEffect(() => {
    drawCurve();
  }, [drawCurve]);

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 220 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>EQ</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {/* EQ frequency response curve */}
        <canvas ref={canvasRef} width={200} height={60}
          style={{ display: 'block', borderRadius: 3, marginBottom: 6, width: '100%', height: 60 }} />

        {/* Low band */}
        <div className="daw-node__param-group">
          <span className="daw-node__param-label">Low</span>
          <label className="daw-node__param">
            <NodeSlider min={20} max={500} step={1} value={lowFreq}
              onChange={v => updateParameter(id, 'lowFreq', v)} />
            <span className="daw-node__param-value">{formatFreq(lowFreq)} Hz</span>
          </label>
          <label className="daw-node__param">
            <NodeSlider min={-24} max={24} step={0.5} value={lowGain}
              onChange={v => updateParameter(id, 'lowGain', v)} />
            <span className="daw-node__param-value">{lowGain > 0 ? '+' : ''}{lowGain.toFixed(1)} dB</span>
          </label>
        </div>

        {/* Mid band */}
        <div className="daw-node__param-group">
          <span className="daw-node__param-label">Mid</span>
          <label className="daw-node__param">
            <NodeSlider min={200} max={5000} step={1} value={midFreq}
              onChange={v => updateParameter(id, 'midFreq', v)} />
            <span className="daw-node__param-value">{formatFreq(midFreq)} Hz</span>
          </label>
          <label className="daw-node__param">
            <NodeSlider min={-24} max={24} step={0.5} value={midGain}
              onChange={v => updateParameter(id, 'midGain', v)} />
            <span className="daw-node__param-value">{midGain > 0 ? '+' : ''}{midGain.toFixed(1)} dB</span>
          </label>
          <label className="daw-node__param">
            <NodeSlider min={0.1} max={18} step={0.1} value={midQ}
              onChange={v => updateParameter(id, 'midQ', v)} />
            <span className="daw-node__param-value">Q {midQ.toFixed(1)}</span>
          </label>
        </div>

        {/* High band */}
        <div className="daw-node__param-group">
          <span className="daw-node__param-label">High</span>
          <label className="daw-node__param">
            <NodeSlider min={2000} max={20000} step={1} value={highFreq}
              onChange={v => updateParameter(id, 'highFreq', v)} />
            <span className="daw-node__param-value">{formatFreq(highFreq)} Hz</span>
          </label>
          <label className="daw-node__param">
            <NodeSlider min={-24} max={24} step={0.5} value={highGain}
              onChange={v => updateParameter(id, 'highGain', v)} />
            <span className="daw-node__param-value">{highGain > 0 ? '+' : ''}{highGain.toFixed(1)} dB</span>
          </label>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
