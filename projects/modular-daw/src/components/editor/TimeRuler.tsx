import { useRef, useEffect, useCallback } from 'react';
import { useEditorStore, resolveGridValue } from '../../store/editor-store';
import { useTransportStore } from '../../store/transport-store';
import { getGridLines } from '../../utils/grid';

interface TimeRulerProps {
  width: number;
}

export function TimeRuler({ width }: TimeRulerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoom = useEditorStore(s => s.zoom);
  const scrollX = useEditorStore(s => s.scrollX);
  const gridResolution = useEditorStore(s => s.gridResolution);
  const bpm = useTransportStore(s => s.bpm);
  const seek = useTransportStore(s => s.seek);

  const height = 24;
  const resolvedGrid = resolveGridValue(gridResolution, bpm);

  // Draw ruler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const startTime = scrollX;
    const endTime = scrollX + width / zoom;

    // Determine tick interval based on zoom
    const minPixelsBetweenLabels = 60;
    const minInterval = minPixelsBetweenLabels / zoom;

    // Round to a nice interval
    const niceIntervals = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60];
    let interval = niceIntervals[0];
    for (const ni of niceIntervals) {
      if (ni >= minInterval) {
        interval = ni;
        break;
      }
    }

    // Major ticks with labels
    const style = getComputedStyle(canvas);
    const textColor = style.getPropertyValue('--color-text-muted').trim() || '#666';
    const lineColor = style.getPropertyValue('--color-border').trim() || '#e5e5e5';

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = '10px Inter, sans-serif';

    const firstTick = Math.ceil(startTime / interval) * interval;

    for (let t = firstTick; t <= endTime; t += interval) {
      const x = (t - scrollX) * zoom;

      // Tick line
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, height);
      ctx.lineTo(Math.round(x) + 0.5, height - 8);
      ctx.stroke();

      // Label
      ctx.fillStyle = textColor;
      const label = formatRulerTime(t);
      ctx.fillText(label, Math.round(x) + 3, height - 2);
    }

    // Grid lines (minor ticks)
    if (resolvedGrid !== null) {
      const gridLines = getGridLines(startTime, endTime, resolvedGrid);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      for (const gt of gridLines) {
        const x = (gt - scrollX) * zoom;
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, height);
        ctx.lineTo(Math.round(x) + 0.5, height - 4);
        ctx.stroke();
      }
    }
  }, [width, zoom, scrollX, resolvedGrid, bpm]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const time = scrollX + x / zoom;
    seek(Math.max(0, time));
  }, [scrollX, zoom, seek]);

  return (
    <canvas
      ref={canvasRef}
      className="daw-editor__ruler"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    />
  );
}

function formatRulerTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(seconds % 1 === 0 ? 0 : 1)}s`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
