import { useCallback } from 'react';
import { useEditorStore, GRID_PRESETS } from '../../store/editor-store';
import { useGraphStore } from '../../store/graph-store';
import type { EditorTool, OverlapMode } from '../../types/region';

export function EditorToolbar() {
  const activeTool = useEditorStore(s => s.activeTool);
  const setTool = useEditorStore(s => s.setTool);
  const snapEnabled = useEditorStore(s => s.snapEnabled);
  const toggleSnap = useEditorStore(s => s.toggleSnap);
  const gridResolution = useEditorStore(s => s.gridResolution);
  const setGridResolution = useEditorStore(s => s.setGridResolution);
  const zoom = useEditorStore(s => s.zoom);
  const setZoom = useEditorStore(s => s.setZoom);
  const closeEditor = useEditorStore(s => s.closeEditor);
  const overlapMode = useEditorStore(s => s.overlapMode);
  const setOverlapMode = useEditorStore(s => s.setOverlapMode);
  const selectedTrackIds = useEditorStore(s => s.selectedTrackIds);
  const toggleTrackInEditor = useEditorStore(s => s.toggleTrackInEditor);

  const graphNodes = useGraphStore(s => s.nodes);

  const handleToolClick = useCallback((tool: EditorTool) => {
    setTool(tool);
  }, [setTool]);

  const handleGridChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = GRID_PRESETS.find(p => p.label === e.target.value);
    if (preset) setGridResolution(preset);
  }, [setGridResolution]);

  const handleZoomIn = useCallback(() => {
    setZoom(zoom * 1.5);
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(zoom / 1.5);
  }, [zoom, setZoom]);

  const handleOverlapChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setOverlapMode(e.target.value as OverlapMode);
  }, [setOverlapMode]);

  const tools: { tool: EditorTool; label: string; shortcut: string }[] = [
    { tool: 'pointer', label: 'V', shortcut: 'Pointer (V)' },
    { tool: 'trim', label: 'T', shortcut: 'Trim (T)' },
    { tool: 'slice', label: 'S', shortcut: 'Slice (S)' },
    { tool: 'fade', label: 'F', shortcut: 'Fade (F)' },
    { tool: 'zoom', label: 'Z', shortcut: 'Zoom (Z)' },
    { tool: 'draw', label: 'D', shortcut: 'Draw (D)' },
  ];

  return (
    <div className="daw-editor-toolbar">
      <div className="daw-editor-toolbar__section">
        {tools.map(({ tool, label, shortcut }) => (
          <button
            key={tool}
            className={`daw-editor-toolbar__btn ${activeTool === tool ? 'active' : ''}`}
            onClick={() => handleToolClick(tool)}
            title={shortcut}
            aria-label={shortcut}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="daw-editor-toolbar__divider" />

      <div className="daw-editor-toolbar__section">
        <button
          className={`daw-editor-toolbar__btn daw-editor-toolbar__btn--snap ${snapEnabled ? 'active' : ''}`}
          onClick={toggleSnap}
          title="Toggle snap (G)"
          aria-label="Toggle snap"
        >
          Snap
        </button>
        <select
          className="daw-editor-toolbar__select"
          value={gridResolution.label}
          onChange={handleGridChange}
        >
          {GRID_PRESETS.map(p => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="daw-editor-toolbar__divider" />

      <div className="daw-editor-toolbar__section">
        <select
          className="daw-editor-toolbar__select"
          value={overlapMode}
          onChange={handleOverlapChange}
          title="Region overlap mode"
        >
          <option value="layer">Layer</option>
          <option value="crossfade">Crossfade</option>
          <option value="overwrite">Overwrite</option>
          <option value="ripple">Ripple</option>
        </select>
      </div>

      <div className="daw-editor-toolbar__divider" />

      <div className="daw-editor-toolbar__zoom">
        <button
          className="daw-editor-toolbar__zoom-btn"
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          className="daw-editor-toolbar__zoom-btn"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      <div className="daw-editor-toolbar__tracks">
        {selectedTrackIds.map(trackId => {
          const node = graphNodes.find(n => n.id === trackId);
          const name = node?.data.fileName ?? node?.data.label ?? 'Track';
          return (
            <span key={trackId} className="daw-editor-toolbar__track-tag" title={name}>
              {name}
              {selectedTrackIds.length > 1 && (
                <button
                  className="daw-editor-toolbar__track-tag-close"
                  onClick={() => toggleTrackInEditor(trackId)}
                  aria-label={`Remove ${name} from editor`}
                >
                  ×
                </button>
              )}
            </span>
          );
        })}
      </div>

      <button
        className="daw-editor-toolbar__close"
        onClick={closeEditor}
        title="Close editor (Esc)"
        aria-label="Close editor"
      >
        ×
      </button>
    </div>
  );
}
