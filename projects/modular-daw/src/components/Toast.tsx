import { useEffect } from 'react';
import '../styles/toast.css';

interface ToastProps {
  message: string;
  variant?: 'default' | 'error';
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, variant = 'default', onDismiss, duration = 2500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className={`daw-toast ${variant === 'error' ? 'daw-toast--error' : ''}`}>
      {message}
    </div>
  );
}
