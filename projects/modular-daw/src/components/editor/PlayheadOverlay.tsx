import { useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/editor-store';
import { useTransportStore } from '../../store/transport-store';

interface PlayheadOverlayProps {
  width: number;
  height: number;
}

export function PlayheadOverlay({ width, height }: PlayheadOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const zoom = useEditorStore(s => s.zoom);
  const scrollX = useEditorStore(s => s.scrollX);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const transport = useTransportStore.getState();
      const currentZoom = useEditorStore.getState().zoom;
      const currentScrollX = useEditorStore.getState().scrollX;

      // Draw loop region highlight
      if (transport.loopEnabled && transport.loopEnd > transport.loopStart) {
        const loopStartX = (transport.loopStart - currentScrollX) * currentZoom;
        const loopEndX = (transport.loopEnd - currentScrollX) * currentZoom;
        const lx = Math.max(0, loopStartX);
        const rx = Math.min(width, loopEndX);

        if (rx > lx) {
          ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
          ctx.fillRect(lx, 0, rx - lx, height);

          // Loop boundary lines
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 3]);
          if (loopStartX >= 0 && loopStartX <= width) {
            ctx.beginPath();
            ctx.moveTo(Math.round(loopStartX) + 0.5, 0);
            ctx.lineTo(Math.round(loopStartX) + 0.5, height);
            ctx.stroke();
          }
          if (loopEndX >= 0 && loopEndX <= width) {
            ctx.beginPath();
            ctx.moveTo(Math.round(loopEndX) + 0.5, 0);
            ctx.lineTo(Math.round(loopEndX) + 0.5, height);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }
      }

      const x = (transport.position - currentScrollX) * currentZoom;

      // Only draw if in view
      if (x >= -1 && x <= width + 1) {
        // Playhead line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
        ctx.stroke();

        // Playhead triangle at top
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(x - 5, 0);
        ctx.lineTo(x + 5, 0);
        ctx.lineTo(x, 6);
        ctx.closePath();
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [width, height, zoom, scrollX]);

  return (
    <canvas
      ref={canvasRef}
      className="daw-editor__overlay"
    />
  );
}
