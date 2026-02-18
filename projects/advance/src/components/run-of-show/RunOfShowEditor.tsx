import { useState, useCallback } from 'react';
import { useRunOfShowStore } from '@/store/run-of-show-store';
import { EditableCell } from '@/components/shared/EditableCell';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { ColumnManager } from './ColumnManager';
import { FIXED_COLUMNS } from './column-defaults';
import type { RunOfShowItem } from '@/types/run-of-show';

export function RunOfShowEditor() {
  const items = useRunOfShowStore(s => s.items);
  const customColumns = useRunOfShowStore(s => s.customColumns);
  const addItem = useRunOfShowStore(s => s.addItem);
  const addSectionHeader = useRunOfShowStore(s => s.addSectionHeader);
  const updateItem = useRunOfShowStore(s => s.updateItem);
  const removeItem = useRunOfShowStore(s => s.removeItem);
  const reorderItems = useRunOfShowStore(s => s.reorderItems);
  const setItemHighlight = useRunOfShowStore(s => s.setItemHighlight);
  const recalculateTimes = useRunOfShowStore(s => s.recalculateTimes);

  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // +2: drag handle col + actions col
  const totalColSpan = 1 + FIXED_COLUMNS.length + customColumns.length + 2;

  const handleTimeChange = (id: string, field: string, value: string) => {
    updateItem(id, { [field]: value });
    setTimeout(() => recalculateTimes(), 0);
  };

  const handleDragStart = useCallback((index: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDragIndex(index);

    const onMove = (moveEvent: PointerEvent) => {
      const row = (moveEvent.target as HTMLElement).closest('tr');
      if (row) {
        const rowIndex = Number(row.dataset.index);
        if (!isNaN(rowIndex)) setDropIndex(rowIndex);
      }
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setDragIndex(prev => {
        setDropIndex(drop => {
          if (prev !== null && drop !== null && prev !== drop) {
            reorderItems(prev, drop);
          }
          return null;
        });
        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [reorderItems]);

  return (
    <div className="advc-ros-editor">
      <div className="advc-ros-editor__actions">
        <button className="advc-btn advc-btn--sm" onClick={() => addItem()}>+ Add Item</button>
        <button className="advc-btn advc-btn--sm" onClick={() => addSectionHeader()}>+ Section Header</button>
        <button className="advc-btn advc-btn--sm" onClick={recalculateTimes} title="Recalculate times from start + duration">
          Recalculate Times
        </button>
      </div>
      <ColumnManager />
      <div className="advc-table-wrap">
        <table className="advc-table">
          <thead>
            <tr>
              <th style={{ width: 28 }} />
              {FIXED_COLUMNS.map(col => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>{col.label}</th>
              ))}
              {customColumns.map(col => (
                <th key={col.id}>{col.name}</th>
              ))}
              <th style={{ width: 64 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item: RunOfShowItem, index: number) => {
              if (item.type === 'header') {
                return (
                  <tr
                    key={item.id}
                    data-index={index}
                    className={`advc-ros-header-row${dragIndex !== null && dropIndex === index ? ' advc-row--drop-target' : ''}`}
                    style={{ background: item.highlightColor ?? 'var(--advc-surface-header)' }}
                  >
                    <td colSpan={totalColSpan} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="advc-drag-handle" onPointerDown={(e) => handleDragStart(index, e)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <circle cx="3.5" cy="2" r="1.2"/><circle cx="8.5" cy="2" r="1.2"/>
                          <circle cx="3.5" cy="6" r="1.2"/><circle cx="8.5" cy="6" r="1.2"/>
                          <circle cx="3.5" cy="10" r="1.2"/><circle cx="8.5" cy="10" r="1.2"/>
                        </svg>
                      </span>
                      <input
                        className="advc-ros-header-row__title"
                        value={item.headerTitle}
                        onChange={(e) => updateItem(item.id, { headerTitle: e.target.value })}
                        placeholder="Section title"
                      />
                      <button
                        className="advc-btn advc-btn--sm advc-btn--icon advc-btn--danger"
                        onClick={() => removeItem(item.id)}
                        title="Delete section"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={item.id}
                  data-index={index}
                  className={`${item.highlightColor ? 'advc-row--highlighted' : ''}${dragIndex !== null && dropIndex === index ? ' advc-row--drop-target' : ''}`}
                  style={item.highlightColor ? { background: item.highlightColor + '22' } : undefined}
                >
                  <td>
                    <span className="advc-drag-handle" onPointerDown={(e) => handleDragStart(index, e)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <circle cx="3.5" cy="2" r="1.2"/><circle cx="8.5" cy="2" r="1.2"/>
                        <circle cx="3.5" cy="6" r="1.2"/><circle cx="8.5" cy="6" r="1.2"/>
                        <circle cx="3.5" cy="10" r="1.2"/><circle cx="8.5" cy="10" r="1.2"/>
                      </svg>
                    </span>
                  </td>
                  <td className="advc-table__num">
                    <EditableCell value={item.itemNumber} onChange={(v) => updateItem(item.id, { itemNumber: v })} />
                  </td>
                  <td>
                    <EditableCell value={item.startTime} onChange={(v) => handleTimeChange(item.id, 'startTime', v)} placeholder="00:00:00" />
                  </td>
                  <td>
                    <EditableCell value={item.duration} onChange={(v) => handleTimeChange(item.id, 'duration', v)} placeholder="00:00" />
                  </td>
                  <td>
                    <EditableCell value={item.audio} onChange={(v) => updateItem(item.id, { audio: v })} />
                  </td>
                  <td>
                    <EditableCell value={item.video} onChange={(v) => updateItem(item.id, { video: v })} />
                  </td>
                  <td>
                    <EditableCell value={item.lights} onChange={(v) => updateItem(item.id, { lights: v })} />
                  </td>
                  <td>
                    <EditableCell value={item.productionNotes} onChange={(v) => updateItem(item.id, { productionNotes: v })} />
                  </td>
                  {customColumns.map(col => (
                    <td key={col.id}>
                      <EditableCell
                        value={item.customFields[col.id] ?? ''}
                        onChange={(v) => updateItem(item.id, { customFields: { ...item.customFields, [col.id]: v } })}
                      />
                    </td>
                  ))}
                  <td style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="advc-ros-color-btn"
                        style={{ background: item.highlightColor ?? 'var(--advc-surface-inset)' }}
                        onClick={() => setColorPickerOpen(colorPickerOpen === item.id ? null : item.id)}
                        title="Row color"
                      />
                      {colorPickerOpen === item.id && (
                        <div className="advc-ros-color-popover">
                          <ColorPicker value={item.highlightColor} onChange={(c) => { setItemHighlight(item.id, c); setColorPickerOpen(null); }} />
                        </div>
                      )}
                    </div>
                    <button
                      className="advc-btn advc-btn--sm advc-btn--icon advc-btn--danger"
                      onClick={() => removeItem(item.id)}
                      title="Delete row"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--advc-text-tertiary)', fontSize: '0.85rem', padding: '24px 0' }}>
          No items yet. Add items or section headers to build your timeline.
        </p>
      )}
    </div>
  );
}
