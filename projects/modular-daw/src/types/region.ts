/** A region represents a slice of audio placed on the timeline */
export interface Region {
  id: string;
  trackId: string;
  bufferRef: string;
  /** Where on the timeline the region starts (seconds) */
  position: number;
  /** Offset into the source buffer (seconds) */
  sourceOffset: number;
  /** Length of the region (seconds) */
  duration: number;
  /** Fade-in duration (seconds) */
  fadeIn: number;
  /** Fade-out duration (seconds) */
  fadeOut: number;
}

export type EditorTool = 'pointer' | 'trim' | 'slice' | 'fade' | 'zoom' | 'draw';

export type OverlapMode = 'layer' | 'crossfade' | 'overwrite' | 'ripple';

export interface GridResolution {
  label: string;
  /** Seconds per grid line, null = free (no snap) */
  value: number | null;
}
