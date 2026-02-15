import { useRef, useEffect, useCallback } from 'react';

interface LufsMeterProps {
  inputLufs: number;
  outputLufs: number;
  targetLufs: number;
  className?: string;
}

const SCALE_MIN = -60;
const SCALE_MAX = 0;

function lufsToX(lufs: number, width: number): number {
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, lufs));
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * width;
}

export function LufsMeter({ inputLufs, outputLufs, targetLufs, className }: LufsMeterProps) {
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

    const styles = getComputedStyle(container);
    const colorDataSecondary = styles.getPropertyValue('--sb-color-data-secondary').trim() || '#f59e0b';
    const colorEdu = styles.getPropertyValue('--sb-color-edu').trim() || '#a78bfa';
    const colorNorm = styles.getPropertyValue('--sb-color-norm').trim() || '#10b981';
    const colorBorder = styles.getPropertyValue('--sb-border-strong').trim() || 'rgba(255, 255, 255, 0.12)';
    const colorTextTertiary = styles.getPropertyValue('--sb-text-tertiary').trim() || '#6b7280';

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const trackY = cssHeight * 0.45;
    const trackHeight = 3;
    const labelY = cssHeight * 0.85;
    const markerTop = trackY - 14;
    const markerBot = trackY + trackHeight + 4;
    const markerLabelY = markerTop - 4;

    // Scale track
    ctx.fillStyle = colorBorder;
    ctx.fillRect(0, trackY, cssWidth, trackHeight);

    // Scale ticks every 10 LUFS
    ctx.fillStyle = colorTextTertiary;
    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (let lufs = SCALE_MIN; lufs <= SCALE_MAX; lufs += 10) {
      const x = lufsToX(lufs, cssWidth);
      ctx.fillRect(x, trackY - 3, 1, trackHeight + 6);
      ctx.fillText(`${lufs}`, x, labelY);
    }

    // Arrow from input to output
    const inputX = lufsToX(inputLufs, cssWidth);
    const outputX = lufsToX(outputLufs, cssWidth);
    const arrowY = trackY + trackHeight + 14;

    if (Math.abs(outputX - inputX) > 2) {
      ctx.strokeStyle = colorTextTertiary;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(inputX, arrowY);
      ctx.lineTo(outputX, arrowY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      const dir = outputX > inputX ? 1 : -1;
      ctx.fillStyle = colorTextTertiary;
      ctx.beginPath();
      ctx.moveTo(outputX, arrowY);
      ctx.lineTo(outputX - dir * 5, arrowY - 3);
      ctx.lineTo(outputX - dir * 5, arrowY + 3);
      ctx.closePath();
      ctx.fill();
    }

    // Target marker (purple dashed)
    const targetX = lufsToX(targetLufs, cssWidth);
    ctx.strokeStyle = colorEdu;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(targetX, markerTop);
    ctx.lineTo(targetX, markerBot);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = colorEdu;
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('target', targetX, markerLabelY);

    // Input marker (amber)
    ctx.strokeStyle = colorDataSecondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inputX, markerTop);
    ctx.lineTo(inputX, markerBot);
    ctx.stroke();

    ctx.fillStyle = colorDataSecondary;
    ctx.font = '9px system-ui, sans-serif';
    // Offset label to avoid overlap with target
    const inputLabelAlign = inputX < targetX - 20 ? 'center' as const : 'right' as const;
    ctx.textAlign = inputLabelAlign;
    ctx.fillText(`${inputLufs.toFixed(1)}`, inputX, markerLabelY);

    // Output marker (green)
    ctx.strokeStyle = colorNorm;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(outputX, markerTop);
    ctx.lineTo(outputX, markerBot);
    ctx.stroke();

    ctx.fillStyle = colorNorm;
    ctx.font = '9px system-ui, sans-serif';
    const outputLabelAlign = outputX > targetX + 20 ? 'center' as const : 'left' as const;
    ctx.textAlign = outputLabelAlign;
    ctx.fillText(`${outputLufs.toFixed(1)}`, outputX, markerLabelY);
  }, [inputLufs, outputLufs, targetLufs]);

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
