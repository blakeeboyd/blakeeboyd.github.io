import type { StageElement } from '@/types/stage-plot';
import { ELEMENT_TYPES } from './element-types';

interface StageElementComponentProps {
  element: StageElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent) => void;
  onResizeStart: (e: React.PointerEvent) => void;
}

export function StageElementComponent({ element, isSelected, onSelect, onDragStart, onResizeStart }: StageElementComponentProps) {
  const def = ELEMENT_TYPES.find(e => e.type === element.type);
  const icon = def?.icon ?? '?';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    onDragStart(e);
  };

  const handleResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onResizeStart(e);
  };

  return (
    <div
      className={`advc-stage-element${isSelected ? ' advc-stage-element--selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        background: element.color + '33',
        borderColor: isSelected ? undefined : element.color + '66',
      }}
      onPointerDown={handlePointerDown}
    >
      <span className="advc-stage-element__icon">{icon}</span>
      {element.labelVisible && (
        <span className="advc-stage-element__label">{element.label}</span>
      )}
      {isSelected && (
        <div
          className="advc-stage-element__resize advc-stage-element__resize--se"
          onPointerDown={handleResizeDown}
        />
      )}
    </div>
  );
}
