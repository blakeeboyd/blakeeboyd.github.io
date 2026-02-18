import { useStagePlotStore } from '@/store/stage-plot-store';
import { StageCanvas } from './StageCanvas';
import { ElementPalette } from './ElementPalette';
import { PropertiesPanel } from './PropertiesPanel';
import { StageSizeSelector } from './StageSizeSelector';

export function StagePlotEditor() {
  const selectedElementId = useStagePlotStore(s => s.selectedElementId);

  return (
    <div className="advc-stage-editor">
      <div className="advc-stage-canvas-area">
        <StageSizeSelector />
        <StageCanvas />
      </div>
      <div className="advc-stage-panel">
        {selectedElementId ? (
          <PropertiesPanel />
        ) : (
          <ElementPalette />
        )}
      </div>
    </div>
  );
}
