import { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../store/editor-store';
import { useGraphStore } from '../store/graph-store';
import { EditorToolbar } from './editor/EditorToolbar';
import { TimeRuler } from './editor/TimeRuler';
import { TimelineCanvas } from './editor/TimelineCanvas';
import { PlayheadOverlay } from './editor/PlayheadOverlay';
import '../styles/editor.css';

const MIN_HEIGHT = 120;
const DEFAULT_HEIGHT = 250;
const MAX_HEIGHT = 600;
const MIN_LANE_HEIGHT = 60;

export function WaveformEditor() {
  const isOpen = useEditorStore(s => s.isOpen);
  const selectedTrackIds = useEditorStore(s => s.selectedTrackIds);
  const nodes = useGraphStore(s => s.nodes);

  const containerRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT);
  const [containerWidth, setContainerWidth] = useState(0);
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Measure container width
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;

    const handleMove = (moveE: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = startYRef.current - moveE.clientY;
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeightRef.current + delta));
      setPanelHeight(newHeight);
    };

    const handleUp = () => {
      resizingRef.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [panelHeight]);

  if (!isOpen || selectedTrackIds.length === 0) return null;

  const toolbarHeight = 32;
  const rulerHeight = 24;
  const lanesHeight = panelHeight - toolbarHeight - rulerHeight;
  const laneHeight = Math.max(MIN_LANE_HEIGHT, Math.floor(lanesHeight / selectedTrackIds.length));

  return (
    <div
      className="daw-editor"
      style={{ height: panelHeight }}
      ref={containerRef}
    >
      <div
        className="daw-editor__resize-handle"
        onMouseDown={handleResizeStart}
      />
      <EditorToolbar />
      <TimeRuler width={containerWidth} />
      <div className="daw-editor__track-lanes">
        {selectedTrackIds.map((trackId) => {
          const trackNode = nodes.find(n => n.id === trackId);
          const trackLabel = trackNode?.data.fileName ?? trackNode?.data.label ?? 'Track';

          return (
            <div key={trackId} className="daw-editor__track-lane" style={{ height: laneHeight }}>
              <div className="daw-editor__track-label" title={trackLabel}>
                {trackLabel}
              </div>
              <div className="daw-editor__timeline" style={{ height: laneHeight }}>
                <TimelineCanvas
                  width={containerWidth}
                  height={laneHeight}
                  trackId={trackId}
                />
                <PlayheadOverlay
                  width={containerWidth}
                  height={laneHeight}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
