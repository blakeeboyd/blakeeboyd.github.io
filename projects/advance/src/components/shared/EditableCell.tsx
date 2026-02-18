import { useState, useRef, useEffect } from 'react';

interface EditableCellTextProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text';
  placeholder?: string;
}

interface EditableCellSelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'select';
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface EditableCellCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
  type: 'checkbox';
  placeholder?: string;
}

type EditableCellProps = EditableCellTextProps | EditableCellSelectProps | EditableCellCheckboxProps;

export function EditableCell(props: EditableCellProps) {
  if (props.type === 'checkbox') {
    return (
      <input
        className="advc-editable__checkbox"
        type="checkbox"
        checked={props.value}
        onChange={(e) => props.onChange(e.target.checked)}
      />
    );
  }

  if (props.type === 'select') {
    return (
      <select
        className="advc-editable__select"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">{props.placeholder ?? '—'}</option>
        {props.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return <EditableText value={props.value} onChange={props.onChange} placeholder={props.placeholder} />;
}

function EditableText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="advc-editable__input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
          if (e.key === 'Tab') commit();
        }}
      />
    );
  }

  return (
    <div
      className="advc-editable"
      onClick={() => setEditing(true)}
      style={{ color: value ? undefined : 'var(--advc-text-tertiary)' }}
    >
      {value || placeholder || '—'}
    </div>
  );
}
