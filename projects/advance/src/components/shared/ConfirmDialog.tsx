interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="advc-modal-overlay" onClick={onCancel}>
      <div className="advc-modal" onClick={e => e.stopPropagation()}>
        <h3 className="advc-modal__title">{title}</h3>
        <p className="advc-modal__body">{message}</p>
        <div className="advc-modal__actions">
          <button className="advc-btn" onClick={onCancel}>Cancel</button>
          <button className="advc-btn advc-btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
