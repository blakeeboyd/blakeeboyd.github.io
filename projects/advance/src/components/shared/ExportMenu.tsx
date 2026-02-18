import { useState, useRef, useEffect } from 'react';
import type { ExportableDoc } from '@/lib/export-json';
import { exportJson, importJson } from '@/lib/export-json';

interface ExportMenuProps {
  getExportData: () => ExportableDoc;
  documentName: string;
  onImport?: (doc: ExportableDoc) => void;
  onExportPdf?: () => void;
}

export function ExportMenu({ getExportData, documentName, onImport, onExportPdf }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleExportJson = () => {
    const data = getExportData();
    const safeName = documentName.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'document';
    exportJson(data, safeName);
    setOpen(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    try {
      const doc = await importJson(file);
      onImport(doc);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed');
    }
    if (fileRef.current) fileRef.current.value = '';
    setOpen(false);
  };

  return (
    <div className="advc-export-menu" ref={menuRef}>
      <button className="advc-btn advc-btn--sm" onClick={() => setOpen(!open)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>
      {open && (
        <div className="advc-export-menu__dropdown">
          <button className="advc-export-menu__item" onClick={handleExportJson}>
            Export JSON
          </button>
          {onExportPdf && (
            <button className="advc-export-menu__item" onClick={() => { onExportPdf(); setOpen(false); }}>
              Export PDF
            </button>
          )}
          <button className="advc-export-menu__item" onClick={() => { window.print(); setOpen(false); }}>
            Print
          </button>
          {onImport && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid var(--advc-border)', margin: '4px 0' }} />
              <button className="advc-export-menu__item" onClick={() => fileRef.current?.click()}>
                Import JSON
              </button>
            </>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  );
}
