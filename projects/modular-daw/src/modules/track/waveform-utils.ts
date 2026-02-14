/**
 * Draw a waveform from pre-computed peaks onto a canvas.
 * Renders a mirrored amplitude plot (positive above center, negative below).
 */
export function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: Float32Array,
  color: string,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const mid = height / 2;
  const barWidth = width / peaks.length;

  ctx.fillStyle = color;

  for (let i = 0; i < peaks.length; i++) {
    const amp = peaks[i] * mid;
    const x = i * barWidth;
    ctx.fillRect(x, mid - amp, Math.max(barWidth - 0.5, 0.5), amp * 2 || 1);
  }
}
