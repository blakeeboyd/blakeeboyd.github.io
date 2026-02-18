import { useState, useCallback } from 'react';
import { usePatchSheetStore } from '@/store/patch-sheet-store';
import { EditableCell } from '@/components/shared/EditableCell';
import type { OutputChannel } from '@/types/patch-sheet';

const DragGrip = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <circle cx="3.5" cy="2" r="1.2"/><circle cx="8.5" cy="2" r="1.2"/>
    <circle cx="3.5" cy="6" r="1.2"/><circle cx="8.5" cy="6" r="1.2"/>
    <circle cx="3.5" cy="10" r="1.2"/><circle cx="8.5" cy="10" r="1.2"/>
  </svg>
);

export function OutputTable() {
  const outputs = usePatchSheetStore(s => s.outputs);
  const updateOutput = usePatchSheetStore(s => s.updateOutput);
  const removeOutput = usePatchSheetStore(s => s.removeOutput);
  const addOutput = usePatchSheetStore(s => s.addOutput);
  const reorderOutputs = usePatchSheetStore(s => s.reorderOutputs);

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
            reorderOutputs(prev, drop);
          }
          return null;
        });
        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [reorderOutputs]);

  return (
    <div className="advc-patch-editor">
      <div className="advc-patch-editor__actions">
        <button className="advc-btn advc-btn--sm" onClick={() => addOutput()}>+ Add Output</button>
      </div>
      <div className="advc-table-wrap">
        <table className="advc-table">
          <thead>
            <tr>
              <th style={{ width: 28 }} />
              <th style={{ width: 40 }}>#</th>
              <th>Name</th>
              <th>Source Type</th>
              <th>Source Details</th>
              <th>Dest Type</th>
              <th>Dest Gear</th>
              <th>Notes</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {outputs.map((ch: OutputChannel, i: number) => (
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
                  <EditableCell value={ch.channelNumber} onChange={(v) => updateOutput(ch.id, { channelNumber: v })} placeholder={String(i + 1)} />
                </td>
                <td>
                  <EditableCell value={ch.name} onChange={(v) => updateOutput(ch.id, { name: v })} placeholder="Output name" />
                </td>
                <td>
                  <EditableCell value={ch.sourceType} onChange={(v) => updateOutput(ch.id, { sourceType: v })} placeholder="Source type" />
                </td>
                <td>
                  <EditableCell value={ch.sourceDetails} onChange={(v) => updateOutput(ch.id, { sourceDetails: v })} placeholder="Details" />
                </td>
                <td>
                  <EditableCell value={ch.destinationType} onChange={(v) => updateOutput(ch.id, { destinationType: v })} placeholder="Dest type" />
                </td>
                <td>
                  <EditableCell value={ch.destinationGear} onChange={(v) => updateOutput(ch.id, { destinationGear: v })} placeholder="Gear" />
                </td>
                <td>
                  <EditableCell value={ch.notes} onChange={(v) => updateOutput(ch.id, { notes: v })} placeholder="Notes" />
                </td>
                <td>
                  <button
                    className="advc-btn advc-btn--sm advc-btn--icon advc-btn--danger"
                    onClick={() => removeOutput(ch.id)}
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
      {outputs.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--advc-text-tertiary)', fontSize: '0.85rem', padding: '24px 0' }}>
          No output channels. Click "+ Add Output" to start.
        </p>
      )}
    </div>
  );
}
