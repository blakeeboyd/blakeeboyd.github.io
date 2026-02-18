import { useState, useCallback } from 'react';
import { usePatchSheetStore } from '@/store/patch-sheet-store';
import { EditableCell } from '@/components/shared/EditableCell';
import { MIC_TYPES, CONNECTION_TYPES } from './channel-defaults';
import type { InputChannel, MicType, ConnectionType } from '@/types/patch-sheet';

const DragGrip = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <circle cx="3.5" cy="2" r="1.2"/><circle cx="8.5" cy="2" r="1.2"/>
    <circle cx="3.5" cy="6" r="1.2"/><circle cx="8.5" cy="6" r="1.2"/>
    <circle cx="3.5" cy="10" r="1.2"/><circle cx="8.5" cy="10" r="1.2"/>
  </svg>
);

export function InputTable() {
  const inputs = usePatchSheetStore(s => s.inputs);
  const updateInput = usePatchSheetStore(s => s.updateInput);
  const removeInput = usePatchSheetStore(s => s.removeInput);
  const addInput = usePatchSheetStore(s => s.addInput);
  const reorderInputs = usePatchSheetStore(s => s.reorderInputs);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDragIndex(index);

    const onMove = (moveEvent: PointerEvent) => {
      const row = (moveEvent.target as HTMLElement).closest('tr');
      if (row) {
        const ri = Number(row.dataset.index);
        if (!isNaN(ri)) setDropIndex(ri);
      }
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setDragIndex(prev => {
        setDropIndex(drop => {
          if (prev !== null && drop !== null && prev !== drop) {
            reorderInputs(prev, drop);
          }
          return null;
        });
        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [reorderInputs]);

  return (
    <div className="advc-patch-editor">
      <div className="advc-patch-editor__actions">
        <button className="advc-btn advc-btn--sm" onClick={() => addInput()}>+ Add Input</button>
      </div>
      <div className="advc-table-wrap">
        <table className="advc-table">
          <thead>
            <tr>
              <th style={{ width: 28 }} />
              <th style={{ width: 40 }}>#</th>
              <th>Name</th>
              <th style={{ width: 100 }}>Mic Type</th>
              <th>Device</th>
              <th style={{ width: 50 }}>48V</th>
              <th style={{ width: 110 }}>Connection</th>
              <th>Details</th>
              <th>Notes</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {inputs.map((ch: InputChannel, i: number) => (
              <tr
                key={ch.id}
                data-index={i}
                className={dragIndex !== null && dropIndex === i ? 'advc-row--drop-target' : ''}
              >
                <td>
                  <span className="advc-drag-handle" onPointerDown={(e) => handleDragStart(i, e)}>
                    <DragGrip />
                  </span>
                </td>
                <td className="advc-table__num">
                  <EditableCell value={ch.channelNumber} onChange={(v) => updateInput(ch.id, { channelNumber: v })} placeholder={String(i + 1)} />
                </td>
                <td>
                  <EditableCell value={ch.name} onChange={(v) => updateInput(ch.id, { name: v })} placeholder="Channel name" />
                </td>
                <td>
                  <EditableCell type="select" value={ch.micType} options={MIC_TYPES} onChange={(v) => updateInput(ch.id, { micType: v as MicType })} />
                </td>
                <td>
                  <EditableCell value={ch.device} onChange={(v) => updateInput(ch.id, { device: v })} placeholder="Model" />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <EditableCell type="checkbox" value={ch.phantom} onChange={(v) => updateInput(ch.id, { phantom: v })} />
                </td>
                <td>
                  <EditableCell type="select" value={ch.connection} options={CONNECTION_TYPES} onChange={(v) => updateInput(ch.id, { connection: v as ConnectionType })} />
                </td>
                <td>
                  <EditableCell value={ch.connectionDetails} onChange={(v) => updateInput(ch.id, { connectionDetails: v })} placeholder="Details" />
                </td>
                <td>
                  <EditableCell value={ch.notes} onChange={(v) => updateInput(ch.id, { notes: v })} placeholder="Notes" />
                </td>
                <td>
                  <button
                    className="advc-btn advc-btn--sm advc-btn--icon advc-btn--danger"
                    onClick={() => removeInput(ch.id)}
                    title="Delete row"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {inputs.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--advc-text-tertiary)', fontSize: '0.85rem', padding: '24px 0' }}>
          No input channels. Click "+ Add Input" to start.
        </p>
      )}
    </div>
  );
}
