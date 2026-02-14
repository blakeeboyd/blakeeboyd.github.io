import { usePatchSheetStore } from '@/store/patch-sheet-store';
import { PatchSheetMetadata } from './PatchSheetMetadata';
import { InputTable } from './InputTable';
import { OutputTable } from './OutputTable';

export function PatchSheetEditor() {
  const activeTab = usePatchSheetStore(s => s.activeTab);
  const setActiveTab = usePatchSheetStore(s => s.setActiveTab);

  return (
    <div>
      <PatchSheetMetadata />
      <div className="adv-tabs">
        <button
          className={`adv-tab${activeTab === 'inputs' ? ' adv-tab--active' : ''}`}
          onClick={() => setActiveTab('inputs')}
        >
          Inputs
        </button>
        <button
          className={`adv-tab${activeTab === 'outputs' ? ' adv-tab--active' : ''}`}
          onClick={() => setActiveTab('outputs')}
        >
          Outputs
        </button>
      </div>
      {activeTab === 'inputs' ? <InputTable /> : <OutputTable />}
    </div>
  );
}
