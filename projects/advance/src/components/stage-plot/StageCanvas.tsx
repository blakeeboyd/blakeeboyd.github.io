import { useRef, useCallback } from 'react';
import { useStagePlotStore } from '@/store/stage-plot-store';
import { StageElementComponent } from './StageElementComponent';
import type { StageSize } from '@/types/stage-plot';

const STAGE_DIMENSIONS: Record<StageSize, { width: number; height: number }> = {
  'small-narrow': { width: 400, height: 200 },
  'small-wide': { width: 500, height: 200 },
  'medium-narrow': { width: 500, height: 300 },
  'medium-wide': { width: 650, height: 300 },
  'large-narrow': { width: 600, height: 400 },
  'large-wide': { width: 750, height: 400 },
  'xlarge-narrow': { width: 700, height: 500 },
  'xlarge-wide': { width: 850, height: 500 },
};

const MIN_SIZE = 20;
const GRID_SIZE = 10;

function snap(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function StageCanvas() {
  const stageSize = useStagePlotStore(s => s.stageSize);
  const elements = useStagePlotStore(s => s.elements);
  const selectedElementId = useStagePlotStore(s => s.selectedElementId);
  const selectElement = useStagePlotStore(s => s.selectElement);
  const updateElement = useStagePlotStore(s => s.updateElement);
  const backgroundImage = useStagePlotStore(s => s.backgroundImage);
  const backgroundOpacity = useStagePlotStore(s => s.backgroundOpacity);
  const gridSnap = useStagePlotStore(s => s.gridSnap);
  const canvasRef = useRef<HTMLDivElement>(null);

  const dims = STAGE_DIMENSIONS[stageSize];

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('advc-stage-canvas__label')) {
      selectElement(null);
    }
  }, [selectElement]);

  const handleDrag = useCallback((id: string, e: React.PointerEvent) => {
    const el = elements.find(el => el.id === id);
    if (!el || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - el.x;
    const offsetY = e.clientY - rect.top - el.y;
    const shouldSnap = gridSnap;

    const onMove = (moveEvent: PointerEvent) => {
      let x = Math.max(0, Math.min(dims.width - el.width, moveEvent.clientX - rect.left - offsetX));
      let y = Math.max(0, Math.min(dims.height - el.height, moveEvent.clientY - rect.top - offsetY));
      if (shouldSnap) {
        x = snap(x);
        y = snap(y);
      }
      updateElement(id, { x, y });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [elements, dims, updateElement, gridSnap]);

  const handleResize = useCallback((id: string, e: React.PointerEvent) => {
    const el = elements.find(el => el.id === id);
    if (!el || !canvasRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = el.width;
    const startH = el.height;
    const shouldSnap = gridSnap;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let width = Math.max(MIN_SIZE, Math.min(dims.width - el.x, startW + dx));
      let height = Math.max(MIN_SIZE, Math.min(dims.height - el.y, startH + dy));
      if (shouldSnap) {
        width = snap(width);
        height = snap(height);
      }
      updateElement(id, { width, height });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [elements, dims, updateElement, gridSnap]);

  return (
    <div
      ref={canvasRef}
      className={`advc-stage-canvas${gridSnap ? ' advc-stage-canvas--grid' : ''}`}
      style={{ width: dims.width, height: dims.height }}
      onClick={handleCanvasClick}
    >
      <span className="advc-stage-canvas__label">AUDIENCE</span>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: backgroundOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
      {elements.map(el => (
        <StageElementComponent
          key={el.id}
          element={el}
          isSelected={el.id === selectedElementId}
          onSelect={() => selectElement(el.id)}
          onDragStart={(e) => handleDrag(el.id, e)}
          onResizeStart={(e) => handleResize(el.id, e)}
        />
      ))}
    </div>
  );
}
