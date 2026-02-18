import { useRef, useEffect, useCallback, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { useGraphStore } from '../../store/graph-store';
import { storeBuffer, getBuffer, extractPeaks } from '../../store/audio-buffer-cache';
import { getSharedAudioContext } from '../../audio/audio-context';
import { NodeSlider } from '../../components/NodeSlider';
import { formatTime } from '../../utils/format-time';
import { useEditorStore } from '../../store/editor-store';
import { useMuteMap } from '../../hooks/use-mute-state';
import { useRecordingStore } from '../../store/recording-store';
import { drawWaveform } from './waveform-utils';
import type { DawNode } from '../../types/graph';

export function TrackNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const setNodeData = useGraphStore(s => s.setNodeData);
  const toggleMute = useGraphStore(s => s.toggleMute);
  const toggleSolo = useGraphStore(s => s.toggleSolo);
  const muteMap = useMuteMap();
  const isDimmed = muteMap.get(id) ?? false;
  const isArmed = useRecordingStore(s => s.armedTrackIds.includes(id));
  const isRecording = useRecordingStore(s => s.isRecording);
  const toggleArm = useRecordingStore(s => s.toggleArm);
  const volume = data.parameters.volume ?? 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Draw waveform when bufferRef changes
  useEffect(() => {
    if (!data.bufferRef || !canvasRef.current) return;
    const entry = getBuffer(data.bufferRef);
    if (!entry) return;

    const color = getComputedStyle(canvasRef.current).getPropertyValue('--daw-accent').trim() || '#3b82f6';
    drawWaveform(canvasRef.current, entry.peaks, color);
  }, [data.bufferRef]);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const ctx = getSharedAudioContext();
      if (!ctx) throw new Error('Audio engine not ready');

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      if (!mountedRef.current) return;

      const bufferRef = nanoid();
      const peaks = extractPeaks(audioBuffer, 200);

      storeBuffer(bufferRef, {
        buffer: audioBuffer,
        peaks,
        fileName: file.name,
        duration: audioBuffer.duration,
        channelCount: audioBuffer.numberOfChannels,
        sampleRate: audioBuffer.sampleRate,
      });

      setNodeData(id, {
        bufferRef,
        fileName: file.name,
        duration: audioBuffer.duration,
      });

      // Remove any existing regions for this track, then create one spanning the full file
      useEditorStore.getState().removeRegionsForTrack(id);
      useEditorStore.getState().addRegion({
        trackId: id,
        bufferRef,
        position: 0,
        sourceOffset: 0,
        duration: audioBuffer.duration,
        fadeIn: 0.005,
        fadeOut: 0.005,
      });
    } catch (e) {
      if (!mountedRef.current) return;
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(`Could not decode file: ${msg}`);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [id, setNodeData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (data.bufferRef) {
      if (e.shiftKey) {
        useEditorStore.getState().toggleTrackInEditor(id);
      } else {
        useEditorStore.getState().openEditor(id);
      }
    }
  }, [id, data.bufferRef]);

  const nodeClasses = [
    'daw-node daw-node--io daw-node--track',
    isDimmed ? 'daw-node--dimmed' : '',
    data.soloed ? 'daw-node--soloed' : '',
    isArmed ? 'daw-node--armed' : '',
    isArmed && isRecording ? 'daw-node--recording' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <div className="daw-node__header">
        <span>Track</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--record ${isArmed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleArm(id); }}
            title="Record arm"
          >R</button>
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--solo ${data.soloed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleSolo(id, !e.shiftKey); }}
            title="Solo (Shift+click for additive)"
          >S</button>
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--mute ${data.muted ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleMute(id); }}
            title="Mute"
          >M</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {data.bufferRef ? (
          <div className="daw-track__waveform-area" onDoubleClick={handleDoubleClick} title="Double-click to open editor">
            <canvas
              ref={canvasRef}
              className="daw-track__canvas"
              width={180}
              height={48}
            />
            <div className="daw-track__file-info">
              <span className="daw-track__filename" title={data.fileName}>
                {data.fileName}
              </span>
              <span className="daw-track__duration">
                {data.duration ? formatTime(data.duration) : ''}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="daw-track__dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleUploadClick}
          >
            {loading ? (
              <span className="daw-track__loading">Loading...</span>
            ) : error ? (
              <span className="daw-track__error">{error}</span>
            ) : (
              <span className="daw-track__placeholder">
                Drop audio file<br />or click to upload
              </span>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="daw-track__file-input"
          onChange={handleFileChange}
        />
        <label className="daw-node__param">
          <span className="daw-node__param-label">Vol</span>
          <NodeSlider
            min={-70}
            max={6}
            step={0.1}
            value={volume}
            onChange={v => updateParameter(id, 'volume', v)}
          />
          <span className="daw-node__param-value">{volume.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
