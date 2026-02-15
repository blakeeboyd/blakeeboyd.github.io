import { useRef, useEffect, useCallback } from 'react';
import type { WaveformEnvelope } from '@/types/waveform';

interface WaveformCanvasProps {
  envelope: WaveformEnvelope;
  gainLinear: number;
  className?: string;
}

export function WaveformCanvas({ envelope, gainLinear, className }: WaveformCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = container.clientWidth;
    const cssHeight = container.clientHeight;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const { data, bucketCount } = envelope;
    const midY = cssHeight / 2;

    // CSS variable colors resolved from computed styles
    const styles = getComputedStyle(container);
    const colorDataDim = styles.getPropertyValue('--sb-color-data-dim').trim() || 'rgba(34, 211, 238, 0.25)';
    const colorData = styles.getPropertyValue('--sb-color-data').trim() || '#22d3ee';
    const colorError = styles.getPropertyValue('--sb-error').trim() || '#ef4444';
    const colorBorder = styles.getPropertyValue('--sb-border-strong').trim() || 'rgba(255, 255, 255, 0.12)';
    const colorTextTertiary = styles.getPropertyValue('--sb-text-tertiary').trim() || '#6b7280';

    // Clear
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Center line
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(cssWidth, midY);
    ctx.stroke();

    // 0 dBFS reference lines (at ±1.0 amplitude)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = colorTextTertiary;
    ctx.lineWidth = 0.5;
    const dbfsY = midY * (1 - 1.0); // top reference
    ctx.beginPath();
    ctx.moveTo(0, dbfsY);
    ctx.lineTo(cssWidth, dbfsY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, cssHeight - dbfsY);
    ctx.lineTo(cssWidth, cssHeight - dbfsY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (bucketCount === 0) return;

    const barWidth = cssWidth / bucketCount;

    // Draw "before" waveform (dim)
    ctx.fillStyle = colorDataDim;
    for (let b = 0; b < bucketCount; b++) {
      const min = data[b * 2];
      const max = data[b * 2 + 1];
      const x = b * barWidth;
      const yTop = midY - max * midY;
      const yBot = midY - min * midY;
      ctx.fillRect(x, yTop, Math.max(barWidth, 1), yBot - yTop);
    }

    // Draw "after" waveform (bright, with clipping in red)
    for (let b = 0; b < bucketCount; b++) {
      const rawMin = data[b * 2] * gainLinear;
      const rawMax = data[b * 2 + 1] * gainLinear;
      const clampedMin = Math.max(rawMin, -1);
      const clampedMax = Math.min(rawMax, 1);
      const x = b * barWidth;
      const w = Math.max(barWidth, 1);

      // Main signal (clamped to ±1)
      const yTop = midY - clampedMax * midY;
      const yBot = midY - clampedMin * midY;
      ctx.fillStyle = colorData;
      ctx.fillRect(x, yTop, w, yBot - yTop);

      // Clipping regions (above +1 or below -1)
      if (rawMax > 1) {
        const clipTop = midY - 1 * midY;
        const clipBot = midY - rawMax * midY;
        const clampedClipBot = Math.max(clipBot, 0);
        ctx.fillStyle = colorError;
        ctx.fillRect(x, clampedClipBot, w, clipTop - clampedClipBot);
      }
      if (rawMin < -1) {
        const clipTop = midY - rawMin * midY;
        const clipBot = midY - (-1) * midY;
        const clampedClipTop = Math.min(clipTop, cssHeight);
        ctx.fillStyle = colorError;
        ctx.fillRect(x, clipBot, w, clampedClipTop - clipBot);
      }
    }
  }, [envelope, gainLinear]);

  useEffect(() => {
    draw();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
}
