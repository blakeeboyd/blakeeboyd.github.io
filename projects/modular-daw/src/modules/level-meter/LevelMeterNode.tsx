import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { useMuteMap } from '../../hooks/use-mute-state';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function LevelMeterNode({ id, data }: NodeProps<DawNode>) {
  const toggleMute = useGraphStore(s => s.toggleMute);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const peakHoldL = useRef(0);
  const peakDecay = 0.97;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const analyser = proc?.getAnalyserNode?.();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!analyser) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    // Read time-domain data for peak level
    const bufLen = analyser.fftSize;
    const data = new Float32Array(bufLen);
    analyser.getFloatTimeDomainData(data);

    // Compute peak (simplified: single channel from analyser)
    let peak = 0;
    for (let i = 0; i < bufLen; i++) {
      const abs = Math.abs(data[i]);
      if (abs > peak) peak = abs;
    }

    // Convert to dB
    const peakDb = peak > 0 ? 20 * Math.log10(peak) : -70;

    // Update peak hold
    if (peak > peakHoldL.current) {
      peakHoldL.current = peak;
    } else {
      peakHoldL.current *= peakDecay;
    }
    const holdDb = peakHoldL.current > 0 ? 20 * Math.log10(peakHoldL.current) : -70;

    // Map dB to pixel height (-70 dB = 0px, 0 dB = full height)
    const dbToHeight = (db: number) => Math.max(0, ((db + 70) / 70) * h);

    const barH = dbToHeight(peakDb);
    const holdY = h - dbToHeight(holdDb);

    // Background
    const style = getComputedStyle(canvas);
    const bgColor = style.getPropertyValue('--daw-surface-inset').trim() || '#0a0a0a';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Meter bar (green → yellow → red)
    const barTop = h - barH;
    if (barH > 0) {
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, '#22c55e');
      grad.addColorStop(0.7, '#f59e0b');
      grad.addColorStop(1, '#ef4444');
      ctx.fillStyle = grad;
      ctx.fillRect(2, barTop, w - 4, barH);
    }

    // Peak hold line
    if (holdDb > -70) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(2, holdY);
      ctx.lineTo(w - 2, holdY);
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const nodeClasses = [
    'daw-node daw-node--utility',
    isDimmed ? 'daw-node--dimmed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Level Meter</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body">
        <canvas
          ref={canvasRef}
          width={40}
          height={80}
          style={{ width: 40, height: 80, borderRadius: 4, background: 'var(--daw-surface-inset)' }}
        />
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
