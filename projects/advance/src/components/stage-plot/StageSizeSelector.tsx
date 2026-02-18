import { useStagePlotStore } from '@/store/stage-plot-store';
import type { StageSize } from '@/types/stage-plot';

const SIZES: { value: StageSize; label: string }[] = [
  { value: 'small-narrow', label: 'Small Narrow' },
  { value: 'small-wide', label: 'Small Wide' },
  { value: 'medium-narrow', label: 'Medium Narrow' },
  { value: 'medium-wide', label: 'Medium Wide' },
  { value: 'large-narrow', label: 'Large Narrow' },
  { value: 'large-wide', label: 'Large Wide' },
  { value: 'xlarge-narrow', label: 'X-Large Narrow' },
  { value: 'xlarge-wide', label: 'X-Large Wide' },
];

export function StageSizeSelector() {
  const stageSize = useStagePlotStore(s => s.stageSize);
  const setStageSize = useStagePlotStore(s => s.setStageSize);
  const gridSnap = useStagePlotStore(s => s.gridSnap);
  const toggleGridSnap = useStagePlotStore(s => s.toggleGridSnap);

  return (
    <div className="advc-stage-size">
      <select
        className="advc-stage-size__select"
        value={stageSize}
        onChange={(e) => setStageSize(e.target.value as StageSize)}
      >
        {SIZES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <label className="advc-stage-size__snap">
        <input type="checkbox" checked={gridSnap} onChange={toggleGridSnap} />
        <span>Snap</span>
      </label>
    </div>
  );
}
