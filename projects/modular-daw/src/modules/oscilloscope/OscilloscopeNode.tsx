import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function OscilloscopeModuleNode({ id }: NodeProps<DawNode>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) { rafRef.current = requestAnimationFrame(draw); return; }

    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const analyser = proc?.getAnalyserNode?.();

    const w = canvas.width;
    const h = canvas.height;
    ctx2d.fillStyle = '#111';
    ctx2d.fillRect(0, 0, w, h);

    if (analyser) {
      const bufLen = analyser.frequencyBinCount;
      const data = new Float32Array(bufLen);
      analyser.getFloatTimeDomainData(data);

      ctx2d.strokeStyle = '#22c55e';
      ctx2d.lineWidth = 1.5;
      ctx2d.beginPath();
      const sliceWidth = w / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const y = (1 - data[i]) * h / 2;
        if (i === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
        x += sliceWidth;
      }
      ctx2d.stroke();
    }

    // Center line
    ctx2d.strokeStyle = '#333';
    ctx2d.lineWidth = 0.5;
    ctx2d.beginPath();
    ctx2d.moveTo(0, h / 2);
    ctx2d.lineTo(w, h / 2);
    ctx2d.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Oscilloscope</span>
      </div>
      <div className="daw-node__body nodrag nowheel" style={{ padding: 4 }}>
        <canvas ref={canvasRef} width={180} height={80} style={{ display: 'block', borderRadius: 3 }} />
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
