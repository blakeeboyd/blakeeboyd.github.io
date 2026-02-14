import { useRef, useEffect, useCallback } from 'react';
import { useEditorStore, resolveGridValue } from '../../store/editor-store';
import { useTransportStore } from '../../store/transport-store';
import { getBuffer } from '../../store/audio-buffer-cache';
import { getPeaksForZoom, getStereoPeaksForZoom } from '../../utils/peaks-cache';
import { getGridLines, snapToGrid } from '../../utils/grid';
import type { Region } from '../../types/region';

interface TimelineCanvasProps {
  width: number;
  height: number;
  trackId: string;
}

export function TimelineCanvas({ width, height, trackId }: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoom = useEditorStore(s => s.zoom);
  const scrollX = useEditorStore(s => s.scrollX);
  const setScrollX = useEditorStore(s => s.setScrollX);
  const setZoom = useEditorStore(s => s.setZoom);
  const regions = useEditorStore(s => s.regions[trackId] ?? []);
  const selectedRegionIds = useEditorStore(s => s.selectedRegionIds);
  const activeTool = useEditorStore(s => s.activeTool);
  const snapEnabled = useEditorStore(s => s.snapEnabled);
  const gridResolution = useEditorStore(s => s.gridResolution);
  const bpm = useTransportStore(s => s.bpm);
  const seek = useTransportStore(s => s.seek);

  const resolvedGrid = resolveGridValue(gridResolution, bpm);

  // Drag state
  const dragRef = useRef<{
    type: 'move' | 'trim-left' | 'trim-right' | 'none';
    regionId: string;
    startX: number;
    startTime: number;
    originalRegion: Region;
  } | null>(null);

  // Draw the timeline
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

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const style = getComputedStyle(canvas);
    const bgColor = style.getPropertyValue('--color-bg').trim() || '#f8f9fa';
    const borderColor = style.getPropertyValue('--color-border').trim() || '#e5e5e5';
    const accentColor = style.getPropertyValue('--color-accent').trim() || '#2563eb';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const startTime = scrollX;
    const endTime = scrollX + width / zoom;

    // Draw grid lines
    if (resolvedGrid !== null) {
      const gridLines = getGridLines(startTime, endTime, resolvedGrid);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      for (const t of gridLines) {
        const x = (t - scrollX) * zoom;
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Draw regions
    for (const region of regions) {
      const regionEnd = region.position + region.duration;

      // Skip regions not in view
      if (regionEnd < startTime || region.position > endTime) continue;

      const x = (region.position - scrollX) * zoom;
      const w = region.duration * zoom;
      const isSelected = selectedRegionIds.includes(region.id);

      // Region background
      ctx.fillStyle = isSelected
        ? 'rgba(37, 99, 235, 0.15)'
        : 'rgba(37, 99, 235, 0.08)';
      ctx.fillRect(x, 4, w, height - 8);

      // Region border
      ctx.strokeStyle = isSelected ? accentColor : borderColor;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(x, 4, w, height - 8);

      // Draw waveform inside region
      const entry = getBuffer(region.bufferRef);
      if (entry) {
        const isStereo = entry.channelCount > 1;
        const regionPxStart = Math.max(0, x);
        const regionPxEnd = Math.min(width, x + w);

        if (isStereo) {
          // Stereo: two stacked mirrored waveforms (L top, R bottom)
          const stereoPeaks = getStereoPeaksForZoom(
            region.bufferRef,
            zoom,
            entry.buffer,
            entry.duration,
          );

          const regionTop = 4;
          const regionHeight = height - 8;
          const laneHeight = regionHeight / 2;
          const lCenterY = regionTop + laneHeight / 2;
          const rCenterY = regionTop + laneHeight + laneHeight / 2;
          const amplitude = (laneHeight - 4) / 2;

          // Divider between L and R lanes
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(regionPxStart, regionTop + laneHeight);
          ctx.lineTo(regionPxEnd, regionTop + laneHeight);
          ctx.stroke();

          ctx.fillStyle = isSelected
            ? accentColor
            : 'rgba(37, 99, 235, 0.6)';

          for (let px = Math.floor(regionPxStart); px < regionPxEnd; px++) {
            const time = scrollX + px / zoom;
            const sourceTime = region.sourceOffset + (time - region.position);
            const peakIdx = Math.floor((sourceTime / entry.duration) * stereoPeaks.left.length);
            if (peakIdx < 0 || peakIdx >= stereoPeaks.left.length) continue;

            // Left channel: mirrored in top lane
            const lHeight = stereoPeaks.left[peakIdx] * amplitude;
            ctx.fillRect(px, lCenterY - lHeight, 1, lHeight * 2);

            // Right channel: mirrored in bottom lane
            const rHeight = stereoPeaks.right[peakIdx] * amplitude;
            ctx.fillRect(px, rCenterY - rHeight, 1, rHeight * 2);
          }
        } else {
          // Mono: single mirrored waveform
          const peaks = getPeaksForZoom(
            region.bufferRef,
            zoom,
            entry.buffer,
            entry.duration,
          );

          const centerY = height / 2;
          const amplitude = (height - 16) / 2;

          ctx.fillStyle = isSelected
            ? accentColor
            : 'rgba(37, 99, 235, 0.6)';

          for (let px = Math.floor(regionPxStart); px < regionPxEnd; px++) {
            const time = scrollX + px / zoom;
            const sourceTime = region.sourceOffset + (time - region.position);
            const peakIdx = Math.floor((sourceTime / entry.duration) * peaks.length);
            if (peakIdx < 0 || peakIdx >= peaks.length) continue;

            const peakVal = peaks[peakIdx];
            const barHeight = peakVal * amplitude;
            ctx.fillRect(px, centerY - barHeight, 1, barHeight * 2);
          }
        }
      }

      // Draw fade-in indicator
      if (region.fadeIn > 0.001) {
        const fadeW = region.fadeIn * zoom;
        const grad = ctx.createLinearGradient(x, 0, x + fadeW, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 4, fadeW, height - 8);
      }

      // Draw fade-out indicator
      if (region.fadeOut > 0.001) {
        const fadeW = region.fadeOut * zoom;
        const fadeX = x + w - fadeW;
        const grad = ctx.createLinearGradient(fadeX, 0, fadeX + fadeW, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = grad;
        ctx.fillRect(fadeX, 4, fadeW, height - 8);
      }
    }
  }, [width, height, zoom, scrollX, regions, selectedRegionIds, resolvedGrid, bpm]);

  // Scroll handling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const timeAtMouse = scrollX + mouseX / zoom;

      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const newZoom = Math.max(10, Math.min(1000, zoom * factor));

      // Keep the point under the mouse at the same position
      const newScrollX = timeAtMouse - mouseX / newZoom;

      setZoom(newZoom);
      setScrollX(Math.max(0, newScrollX));
    } else {
      // Horizontal scroll
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      setScrollX(Math.max(0, scrollX + delta / zoom));
    }
  }, [zoom, scrollX, setZoom, setScrollX]);

  // Hit test: find region at pixel position
  const hitTestRegion = useCallback((px: number): Region | null => {
    const time = scrollX + px / zoom;
    // Check in reverse order (top regions first)
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      if (time >= r.position && time <= r.position + r.duration) {
        return r;
      }
    }
    return null;
  }, [scrollX, zoom, regions]);

  // Detect if near a region edge (for trim)
  const nearEdge = useCallback((px: number, region: Region): 'left' | 'right' | null => {
    const edgeThreshold = 6; // pixels
    const regionStartPx = (region.position - scrollX) * zoom;
    const regionEndPx = (region.position + region.duration - scrollX) * zoom;

    if (Math.abs(px - regionStartPx) < edgeThreshold) return 'left';
    if (Math.abs(px - regionEndPx) < edgeThreshold) return 'right';
    return null;
  }, [scrollX, zoom]);

  // Mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;

    if (activeTool === 'pointer') {
      const region = hitTestRegion(px);
      if (region) {
        const edge = nearEdge(px, region);
        if (edge === null) {
          // Start move
          useEditorStore.getState().selectRegions(
            e.shiftKey
              ? [...selectedRegionIds, region.id]
              : [region.id]
          );
          dragRef.current = {
            type: 'move',
            regionId: region.id,
            startX: px,
            startTime: region.position,
            originalRegion: { ...region },
          };
        }
      } else {
        // Click on empty space: deselect and seek
        useEditorStore.getState().selectRegions([]);
        const time = scrollX + px / zoom;
        seek(Math.max(0, time));
      }
    } else if (activeTool === 'trim') {
      const region = hitTestRegion(px);
      if (region) {
        const edge = nearEdge(px, region);
        if (edge) {
          useEditorStore.getState().selectRegions([region.id]);
          dragRef.current = {
            type: edge === 'left' ? 'trim-left' : 'trim-right',
            regionId: region.id,
            startX: px,
            startTime: edge === 'left' ? region.position : region.position + region.duration,
            originalRegion: { ...region },
          };
        }
      }
    } else if (activeTool === 'slice') {
      const region = hitTestRegion(px);
      if (region) {
        let time = scrollX + px / zoom;
        if (snapEnabled && resolvedGrid !== null) {
          time = snapToGrid(time, resolvedGrid);
        }
        useEditorStore.getState().splitRegion(region.id, time);
      }
    }
  }, [activeTool, hitTestRegion, nearEdge, selectedRegionIds, scrollX, zoom, seek, snapEnabled, resolvedGrid]);

  // Mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const drag = dragRef.current;

    if (!drag) {
      // Update cursor
      if (activeTool === 'trim') {
        const region = hitTestRegion(px);
        if (region && nearEdge(px, region)) {
          (canvasRef.current as HTMLCanvasElement).style.cursor = 'col-resize';
        } else {
          (canvasRef.current as HTMLCanvasElement).style.cursor = 'default';
        }
      }
      return;
    }

    const deltaPx = px - drag.startX;
    const deltaTime = deltaPx / zoom;

    if (drag.type === 'move') {
      let newPos = drag.originalRegion.position + deltaTime;
      if (snapEnabled && resolvedGrid !== null) {
        newPos = snapToGrid(newPos, resolvedGrid);
      }
      newPos = Math.max(0, newPos);
      useEditorStore.getState().updateRegion(drag.regionId, { position: newPos });
    } else if (drag.type === 'trim-left') {
      let newStart = drag.originalRegion.position + deltaTime;
      if (snapEnabled && resolvedGrid !== null) {
        newStart = snapToGrid(newStart, resolvedGrid);
      }
      const maxStart = drag.originalRegion.position + drag.originalRegion.duration - 0.01;
      newStart = Math.max(0, Math.min(newStart, maxStart));
      const delta = newStart - drag.originalRegion.position;
      useEditorStore.getState().updateRegion(drag.regionId, {
        position: newStart,
        sourceOffset: drag.originalRegion.sourceOffset + delta,
        duration: drag.originalRegion.duration - delta,
      });
    } else if (drag.type === 'trim-right') {
      let newEnd = drag.originalRegion.position + drag.originalRegion.duration + deltaTime;
      if (snapEnabled && resolvedGrid !== null) {
        newEnd = snapToGrid(newEnd, resolvedGrid);
      }
      const minEnd = drag.originalRegion.position + 0.01;
      newEnd = Math.max(minEnd, newEnd);
      useEditorStore.getState().updateRegion(drag.regionId, {
        duration: newEnd - drag.originalRegion.position,
      });
    }
  }, [zoom, activeTool, hitTestRegion, nearEdge, snapEnabled, resolvedGrid]);

  // Mouse up
  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="daw-editor__canvas"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: activeTool === 'slice' ? 'crosshair' : undefined }}
    />
  );
}
