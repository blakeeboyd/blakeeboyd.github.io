import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { useMuteMap } from '../../hooks/use-mute-state';
import { getEngine } from '../../hooks/use-audio-engine';
import type { DawNode } from '../../types/graph';

export function SpectrumAnalyzerNode({ id, data }: NodeProps<DawNode>) {
  const toggleMute = useGraphStore(s => s.toggleMute);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

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

    // Background
    const style = getComputedStyle(canvas);
    const bgColor = style.getPropertyValue('--daw-surface-inset').trim() || '#0a0a0a';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    if (!analyser) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const freqBins = analyser.frequencyBinCount;
    const freqData = new Uint8Array(freqBins);
    analyser.getByteFrequencyData(freqData);

    const sampleRate = analyser.context.sampleRate;
    const accentColor = style.getPropertyValue('--daw-accent').trim() || '#3b82f6';

    // Draw frequency spectrum with log-scale x-axis
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.7;

    const minFreq = 20;
    const maxFreq = 20000;
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);

    const barCount = 64;
    const barW = w / barCount;

    for (let i = 0; i < barCount; i++) {
      // Map bar index to frequency range (log scale)
      const logFreqStart = logMin + (i / barCount) * (logMax - logMin);
      const logFreqEnd = logMin + ((i + 1) / barCount) * (logMax - logMin);
      const freqStart = Math.pow(10, logFreqStart);
      const freqEnd = Math.pow(10, logFreqEnd);

      // Map frequency to FFT bin indices
      const binStart = Math.floor((freqStart / sampleRate) * freqBins * 2);
      const binEnd = Math.min(Math.ceil((freqEnd / sampleRate) * freqBins * 2), freqBins - 1);

      // Average the bins in this range
      let sum = 0;
      let count = 0;
      for (let b = binStart; b <= binEnd; b++) {
        sum += freqData[b];
        count++;
      }
      const avg = count > 0 ? sum / count : 0;

      // Draw bar
      const barH = (avg / 255) * h;
      ctx.fillRect(i * barW, h - barH, barW - 0.5, barH);
    }

    ctx.globalAlpha = 1;
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
    <div className={nodeClasses} style={{ minWidth: 220 }}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Analyzer</span>
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
          width={200}
          height={80}
          style={{ width: 200, height: 80, borderRadius: 4, background: 'var(--daw-surface-inset)' }}
        />
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
