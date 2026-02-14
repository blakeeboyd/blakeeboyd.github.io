import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function LoudnessMeterModuleNode({ id }: NodeProps<DawNode>) {
  const momentaryRef = useRef<HTMLSpanElement>(null);
  const shortTermRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const integratedRef = useRef<number>(-70);
  const historyRef = useRef<number[]>([]);

  const draw = useCallback(() => {
    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const analyser = proc?.getAnalyserNode?.();

    if (analyser) {
      const bufLen = analyser.frequencyBinCount;
      const data = new Float32Array(bufLen);
      analyser.getFloatTimeDomainData(data);

      // RMS of current block
      let sum = 0;
      for (let i = 0; i < bufLen; i++) {
        sum += data[i] * data[i];
      }
      const rms = Math.sqrt(sum / bufLen);
      const momentaryLufs = rms > 1e-10 ? 20 * Math.log10(rms) - 0.691 : -70;

      // Short-term: average over ~3 seconds of momentary values
      historyRef.current.push(momentaryLufs);
      if (historyRef.current.length > 90) historyRef.current.shift(); // ~3s at 30fps
      const shortTerm = historyRef.current.reduce((a, b) => a + b, 0) / historyRef.current.length;

      // Integrated: running average (simplified)
      integratedRef.current = integratedRef.current * 0.99 + momentaryLufs * 0.01;

      if (momentaryRef.current) {
        momentaryRef.current.textContent = `M: ${momentaryLufs > -60 ? momentaryLufs.toFixed(1) : '-inf'} LUFS`;
      }
      if (shortTermRef.current) {
        shortTermRef.current.textContent = `S: ${shortTerm > -60 ? shortTerm.toFixed(1) : '-inf'} LUFS`;
      }
      if (barRef.current) {
        const pct = Math.max(0, Math.min(100, ((momentaryLufs + 60) / 60) * 100));
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.background = momentaryLufs > -14 ? '#ef4444' : momentaryLufs > -23 ? '#f59e0b' : '#22c55e';
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="daw-node daw-node--utility" style={{ minWidth: 160 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Loudness</span>
      </div>
      <div className="daw-node__body nodrag nowheel" style={{ padding: '4px 6px', fontSize: '9px', fontFamily: 'monospace' }}>
        <div style={{ background: '#111', borderRadius: 3, height: 8, marginBottom: 4, overflow: 'hidden' }}>
          <div ref={barRef} style={{ height: '100%', width: '0%', transition: 'width 0.1s' }} />
        </div>
        <div><span ref={momentaryRef}>M: -inf LUFS</span></div>
        <div><span ref={shortTermRef}>S: -inf LUFS</span></div>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
