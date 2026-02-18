import { useState, useEffect, useCallback } from 'react';
import { listSessions, deleteSession, type SessionRecord } from '../lib/session-db';
import { captureSession, restoreSession, newSession } from '../lib/session-serializer';
import { useSessionStore } from '../store/session-store';

interface SessionManagerProps {
  onClose: () => void;
}

export function SessionManager({ onClose }: SessionManagerProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentSessionId = useSessionStore(s => s.currentSessionId);
  const setCurrentSession = useSessionStore(s => s.setCurrentSession);

  const refreshList = useCallback(async () => {
    const list = await listSessions();
    setSessions(list);
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleSaveNew = useCallback(async () => {
    if (!sessionName.trim()) return;
    setLoading(true);
    setStatus('Saving...');
    try {
      const id = await captureSession(sessionName.trim());
      setCurrentSession(id, sessionName.trim());
      setStatus('Saved');
      await refreshList();
    } catch (e) {
      setStatus(`Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  }, [sessionName, refreshList, setCurrentSession]);

  const handleOverwrite = useCallback(async () => {
    if (!currentSessionId) return;
    setLoading(true);
    setStatus('Saving...');
    try {
      const existing = sessions.find(s => s.id === currentSessionId);
      await captureSession(existing?.name ?? 'Untitled', currentSessionId);
      setStatus('Saved');
      await refreshList();
    } catch (e) {
      setStatus(`Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, sessions, refreshList]);

  const handleLoad = useCallback(async (id: string) => {
    setLoading(true);
    setStatus('Loading...');
    try {
      const ok = await restoreSession(id);
      if (ok) {
        const s = sessions.find(s => s.id === id);
        setCurrentSession(id, s?.name ?? '');
        setStatus('Loaded');
      } else {
        setStatus('Session not found');
      }
    } catch (e) {
      setStatus(`Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  }, [sessions, setCurrentSession]);

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteSession(id);
      if (currentSessionId === id) setCurrentSession(null, '');
      await refreshList();
      setStatus('Deleted');
    } catch (e) {
      setStatus(`Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, refreshList, setCurrentSession]);

  const handleNew = useCallback(() => {
    newSession();
    setCurrentSession(null, '');
    setSessionName('');
    setStatus('New session');
  }, [setCurrentSession]);

  return (
    <div className="daw-session-overlay" onClick={onClose}>
      <div className="daw-session-manager" onClick={e => e.stopPropagation()}>
        <div className="daw-session-manager__header">
          <span>Sessions</span>
          <button className="daw-session-manager__close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>

        <div className="daw-session-manager__body">
          <div className="daw-session-manager__save-row">
            <input
              type="text"
              className="daw-session-manager__input"
              placeholder="Session name..."
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveNew()}
              disabled={loading}
            />
            <button
              className="daw-session-manager__btn"
              onClick={handleSaveNew}
              disabled={loading || !sessionName.trim()}
            >
              Save As
            </button>
            {currentSessionId && (
              <button
                className="daw-session-manager__btn"
                onClick={handleOverwrite}
                disabled={loading}
              >
                Save
              </button>
            )}
          </div>

          <button
            className="daw-session-manager__btn daw-session-manager__btn--new"
            onClick={handleNew}
            disabled={loading}
          >
            New Session
          </button>

          {sessions.length > 0 && (
            <div className="daw-session-manager__list">
              {sessions.map(s => (
                <div
                  key={s.id}
                  className={`daw-session-manager__item ${s.id === currentSessionId ? 'active' : ''}`}
                >
                  <div className="daw-session-manager__item-info">
                    <span className="daw-session-manager__item-name">{s.name}</span>
                    <span className="daw-session-manager__item-date">
                      {new Date(s.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="daw-session-manager__item-actions">
                    <button
                      className="daw-session-manager__btn--sm"
                      onClick={() => handleLoad(s.id)}
                      disabled={loading}
                    >
                      Load
                    </button>
                    <button
                      className="daw-session-manager__btn--sm daw-session-manager__btn--danger"
                      onClick={() => handleDelete(s.id)}
                      disabled={loading}
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {status && (
            <div className="daw-session-manager__status">{status}</div>
          )}
        </div>
      </div>
    </div>
  );
}
