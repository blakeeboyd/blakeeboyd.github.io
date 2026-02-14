/**
 * Snap a time value to the nearest grid line.
 * Returns the input unchanged if resolution is null (free mode).
 */
export function snapToGrid(
  time: number,
  resolution: number | null,
): number {
  if (resolution === null || resolution <= 0) return time;
  return Math.round(time / resolution) * resolution;
}

/**
 * Generate grid line positions within a time range.
 * Returns an empty array if resolution is null.
 */
export function getGridLines(
  startTime: number,
  endTime: number,
  resolution: number | null,
): number[] {
  if (resolution === null || resolution <= 0) return [];

  const lines: number[] = [];
  const first = Math.ceil(startTime / resolution) * resolution;

  for (let t = first; t <= endTime; t += resolution) {
    lines.push(t);
  }

  return lines;
}
