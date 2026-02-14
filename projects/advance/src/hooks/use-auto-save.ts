import { useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'pending' | 'saved';

export function useAutoSave(
  documentId: string | null,
  save: () => void,
  deps: unknown[],
): SaveStatus {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const fadeRef = useRef<ReturnType<typeof setTimeout>>();
  const saveRef = useRef(save);
  const mountRef = useRef(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  saveRef.current = save;

  useEffect(() => {
    // Skip the initial mount — don't show "Saved" on first load
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    if (!documentId) return;

    clearTimeout(timerRef.current);
    clearTimeout(fadeRef.current);
    setStatus('pending');

    timerRef.current = setTimeout(() => {
      saveRef.current();
      setStatus('saved');
      fadeRef.current = setTimeout(() => setStatus('idle'), 2000);
    }, 1500);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(fadeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, ...deps]);

  // Reset on document change
  useEffect(() => {
    mountRef.current = true;
    setStatus('idle');
  }, [documentId]);

  return status;
}
