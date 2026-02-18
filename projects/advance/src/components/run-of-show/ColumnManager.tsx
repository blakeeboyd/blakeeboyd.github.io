import { useState } from 'react';
import { useRunOfShowStore } from '@/store/run-of-show-store';

export function ColumnManager() {
  const customColumns = useRunOfShowStore(s => s.customColumns);
  const addCustomColumn = useRunOfShowStore(s => s.addCustomColumn);
  const removeCustomColumn = useRunOfShowStore(s => s.removeCustomColumn);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      addCustomColumn(newName.trim(), 'text');
      setNewName('');
      setAdding(false);
    }
  };

  return (
    <div className="advc-col-manager">
      <span style={{ fontSize: '0.7rem', color: 'var(--advc-text-tertiary)', marginRight: 4 }}>Columns:</span>
      {customColumns.map(col => (
        <span key={col.id} className="advc-col-tag">
          {col.name}
          <button
            className="advc-col-tag__remove"
            onClick={() => removeCustomColumn(col.id)}
            title="Remove column"
          >
            &times;
          </button>
        </span>
      ))}
      {adding ? (
        <span className="advc-col-tag">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') { setAdding(false); setNewName(''); }
            }}
            onBlur={() => { if (!newName.trim()) setAdding(false); else handleAdd(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--advc-text)',
              fontSize: '0.75rem',
              width: 80,
              outline: 'none',
              fontFamily: 'var(--advc-font)',
            }}
            placeholder="Column name"
          />
        </span>
      ) : (
        <button className="advc-btn advc-btn--sm" onClick={() => setAdding(true)}>+ Column</button>
      )}
    </div>
  );
}
