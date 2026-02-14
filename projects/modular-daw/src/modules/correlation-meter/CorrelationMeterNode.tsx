import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

function calcCorrelation(left: Float32Array, right: Float32Array): number {
  let sumLR = 0, sumL2 = 0, sumR2 = 0;
  const n = Math.min(left.length, right.length);
  for (let i = 0; i < n; i++) {
    sumLR += left[i] * right[i];
    sumL2 += left[i] * left[i];
    sumR2 += right[i] * right[i];
  }
  const denom = Math.sqrt(sumL2 * sumR2);
  return denom > 1e-10 ? sumLR / denom : 0;
}

export function CorrelationMeterModuleNode({ id }: NodeProps<DawNode>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) { rafRef.current = requestAnimationFrame(draw); return; }

    const w = canvas.width;
    const h = canvas.height;
    ctx2d.fillStyle = '#111';
    ctx2d.fillRect(0, 0, w, h);

    const engine = getEngine();
    const proc = engine?.getProcessor(id) as any;
    const analysers = proc?.getAnalyserNodes?.();

    let corr = 0;
    if (analysers) {
      const bufLen = analysers.left.frequencyBinCount;
      const leftData = new Float32Array(bufLen);
      const rightData = new Float32Array(bufLen);
      analysers.left.getFloatTimeDomainData(leftData);
      analysers.right.getFloatTimeDomainData(rightData);
      corr = calcCorrelation(leftData, rightData);
    }

    // Draw meter bar: -1 to +1 mapped to 0 to w
    const meterX = ((corr + 1) / 2) * w;
    const barColor = corr > 0 ? '#22c55e' : corr < -0.5 ? '#ef4444' : '#f59e0b';

    ctx2d.fillStyle = barColor;
    ctx2d.fillRect(w / 2, 4, meterX - w / 2, h - 8);

    // Center line
    ctx2d.strokeStyle = '#666';
    ctx2d.lineWidth = 1;
    ctx2d.beginPath();
    ctx2d.moveTo(w / 2, 0);
    ctx2d.lineTo(w / 2, h);
    ctx2d.stroke();

    // Labels
    ctx2d.fillStyle = '#999';
    ctx2d.font = '9px monospace';
    ctx2d.textAlign = 'left';
    ctx2d.fillText('-1', 2, h - 2);
    ctx2d.textAlign = 'right';
    ctx2d.fillText('+1', w - 2, h - 2);
    ctx2d.textAlign = 'center';
    ctx2d.fillStyle = '#fff';
    ctx2d.fillText(corr.toFixed(2), w / 2, h - 2);

    rafRef.current = requestAnimationFrame(draw);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 180 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Correlation</span>
      </div>
      <div className="daw-node__body nodrag nowheel" style={{ padding: 4 }}>
        <canvas ref={canvasRef} width={170} height={24} style={{ display: 'block', borderRadius: 3 }} />
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
