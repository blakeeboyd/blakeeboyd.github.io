import { usePatchSheetStore } from '@/store/patch-sheet-store';

export function PatchSheetMetadata() {
  const metadata = usePatchSheetStore(s => s.metadata);
  const setMetadata = usePatchSheetStore(s => s.setMetadata);

  return (
    <div className="adv-metadata">
      <div className="adv-metadata__field">
        <label className="adv-metadata__label">Venue</label>
        <input
          className="adv-metadata__input"
          value={metadata.venue}
          onChange={(e) => setMetadata({ venue: e.target.value })}
          placeholder="Venue name"
        />
      </div>
      <div className="adv-metadata__field">
        <label className="adv-metadata__label">Date</label>
        <input
          className="adv-metadata__input"
          type="date"
          value={metadata.date}
          onChange={(e) => setMetadata({ date: e.target.value })}
        />
      </div>
      <div className="adv-metadata__field">
        <label className="adv-metadata__label">FOH Engineer</label>
        <input
          className="adv-metadata__input"
          value={metadata.fohEngineer}
          onChange={(e) => setMetadata({ fohEngineer: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div className="adv-metadata__field">
        <label className="adv-metadata__label">Monitor Engineer</label>
        <input
          className="adv-metadata__input"
          value={metadata.monitorEngineer}
          onChange={(e) => setMetadata({ monitorEngineer: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div className="adv-metadata__field adv-metadata__notes">
        <label className="adv-metadata__label">Notes</label>
        <textarea
          className="adv-metadata__textarea"
          value={metadata.notes}
          onChange={(e) => setMetadata({ notes: e.target.value })}
          placeholder="General notes..."
        />
      </div>
    </div>
  );
}
