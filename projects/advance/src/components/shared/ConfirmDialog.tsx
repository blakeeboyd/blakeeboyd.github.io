interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="adv-modal-overlay" onClick={onCancel}>
      <div className="adv-modal" onClick={e => e.stopPropagation()}>
        <h3 className="adv-modal__title">{title}</h3>
        <p className="adv-modal__body">{message}</p>
        <div className="adv-modal__actions">
          <button className="adv-btn" onClick={onCancel}>Cancel</button>
          <button className="adv-btn adv-btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
