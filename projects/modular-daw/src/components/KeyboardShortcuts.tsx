import { useEffect, useCallback } from 'react';
import '../styles/shortcuts.css';

interface ShortcutEntry {
  action: string;
  keys: string[][];  // Array of key combos, each combo is array of keys
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutEntry[];
}

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const mod = isMac ? '\u2318' : 'Ctrl';

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Transport',
    shortcuts: [
      { action: 'Play / Pause', keys: [['Space']] },
      { action: 'Return to start', keys: [['Enter']] },
    ],
  },
  {
    title: 'Editor Tools',
    shortcuts: [
      { action: 'Pointer', keys: [['V']] },
      { action: 'Trim', keys: [['T']] },
      { action: 'Slice', keys: [['S']] },
      { action: 'Fade', keys: [['F']] },
      { action: 'Zoom', keys: [['Z']] },
      { action: 'Draw', keys: [['D']] },
      { action: 'Toggle snap', keys: [['G']] },
      { action: 'Delete region', keys: [['Del']] },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { action: 'Undo', keys: [[mod, 'Z']] },
      { action: 'Redo', keys: [[mod, 'Shift', 'Z']] },
      { action: 'Exit scope / Close editor', keys: [['Esc']] },
      { action: 'Show shortcuts', keys: [['?']] },
    ],
  },
  {
    title: 'Timeline',
    shortcuts: [
      { action: 'Zoom in / out', keys: [[mod, 'Scroll']] },
      { action: 'Scroll timeline', keys: [['Scroll']] },
    ],
  },
];

export function KeyboardShortcuts({ onClose }: { onClose: () => void }) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="daw-shortcuts-backdrop" onClick={handleBackdropClick}>
      <div className="daw-shortcuts">
        <div className="daw-shortcuts__header">
          <span className="daw-shortcuts__title">Keyboard Shortcuts</span>
          <button className="daw-shortcuts__close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>
        <div className="daw-shortcuts__body">
          {SHORTCUT_GROUPS.map(group => (
            <div key={group.title} className="daw-shortcuts__group">
              <div className="daw-shortcuts__group-title">{group.title}</div>
              {group.shortcuts.map(shortcut => (
                <div key={shortcut.action} className="daw-shortcuts__row">
                  <span className="daw-shortcuts__action">{shortcut.action}</span>
                  <span className="daw-shortcuts__keys">
                    {shortcut.keys[0].map((key, i) => (
                      <span key={i}>
                        {i > 0 && <span className="daw-shortcuts__plus">+</span>}
                        <kbd className="daw-shortcuts__key">{key}</kbd>
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="daw-shortcuts__footer">
          <span className="daw-shortcuts__hint">Press ? or Esc to close</span>
        </div>
      </div>
    </div>
  );
}
