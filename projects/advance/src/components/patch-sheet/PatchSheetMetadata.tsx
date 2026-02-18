import { usePatchSheetStore } from '@/store/patch-sheet-store';

export function PatchSheetMetadata() {
  const metadata = usePatchSheetStore(s => s.metadata);
  const setMetadata = usePatchSheetStore(s => s.setMetadata);

  return (
    <div className="advc-metadata">
      <div className="advc-metadata__field">
        <label className="advc-metadata__label">Venue</label>
        <input
          className="advc-metadata__input"
          value={metadata.venue}
          onChange={(e) => setMetadata({ venue: e.target.value })}
          placeholder="Venue name"
        />
      </div>
      <div className="advc-metadata__field">
        <label className="advc-metadata__label">Date</label>
        <input
          className="advc-metadata__input"
          type="date"
          value={metadata.date}
          onChange={(e) => setMetadata({ date: e.target.value })}
        />
      </div>
      <div className="advc-metadata__field">
        <label className="advc-metadata__label">FOH Engineer</label>
        <input
          className="advc-metadata__input"
          value={metadata.fohEngineer}
          onChange={(e) => setMetadata({ fohEngineer: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div className="advc-metadata__field">
        <label className="advc-metadata__label">Monitor Engineer</label>
        <input
          className="advc-metadata__input"
          value={metadata.monitorEngineer}
          onChange={(e) => setMetadata({ monitorEngineer: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div className="advc-metadata__field advc-metadata__notes">
        <label className="advc-metadata__label">Notes</label>
        <textarea
          className="advc-metadata__textarea"
          value={metadata.notes}
          onChange={(e) => setMetadata({ notes: e.target.value })}
          placeholder="General notes..."
        />
      </div>
    </div>
  );
}
