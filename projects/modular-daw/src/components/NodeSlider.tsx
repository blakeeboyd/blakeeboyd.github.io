import { useRef, useEffect, useCallback } from 'react';
import { useGraphStore } from '../store/graph-store';

/**
 * Range slider that works inside React Flow nodes.
 *
 * Two problems solved:
 * 1. d3-drag steals mouse events — native capture-phase listeners stop propagation.
 * 2. Undo coalescing — pauses zundo's temporal store on pointerdown, resumes on
 *    pointerup so an entire slider drag is one undo entry.
 */
export function NodeSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = '',
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const temporal = useGraphStore.temporal;

    const stopAndPause = (e: Event) => {
      e.stopPropagation();
      temporal.getState().pause();
    };

    const resumeTracking = () => {
      temporal.getState().resume();
    };

    // Capture phase: fires before d3's bubble-phase listener on the parent
    el.addEventListener('mousedown', stopAndPause, true);
    el.addEventListener('touchstart', stopAndPause, true);
    el.addEventListener('pointerdown', stopAndPause, true);

    // Resume on pointer release (listen on window to catch releases outside the element)
    window.addEventListener('mouseup', resumeTracking);
    window.addEventListener('touchend', resumeTracking);
    window.addEventListener('pointerup', resumeTracking);

    return () => {
      el.removeEventListener('mousedown', stopAndPause, true);
      el.removeEventListener('touchstart', stopAndPause, true);
      el.removeEventListener('pointerdown', stopAndPause, true);
      window.removeEventListener('mouseup', resumeTracking);
      window.removeEventListener('touchend', resumeTracking);
      window.removeEventListener('pointerup', resumeTracking);
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange],
  );

  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      className={`daw-node__slider nodrag ${className}`}
    />
  );
}
