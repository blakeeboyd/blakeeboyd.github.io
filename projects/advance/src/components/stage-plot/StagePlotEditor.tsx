import { useStagePlotStore } from '@/store/stage-plot-store';
import { StageCanvas } from './StageCanvas';
import { ElementPalette } from './ElementPalette';
import { PropertiesPanel } from './PropertiesPanel';
import { StageSizeSelector } from './StageSizeSelector';

export function StagePlotEditor() {
  const selectedElementId = useStagePlotStore(s => s.selectedElementId);

  return (
    <div className="adv-stage-editor">
      <div className="adv-stage-canvas-area">
        <StageSizeSelector />
        <StageCanvas />
      </div>
      <div className="adv-stage-panel">
        {selectedElementId ? (
          <PropertiesPanel />
        ) : (
          <ElementPalette />
        )}
      </div>
    </div>
  );
}
