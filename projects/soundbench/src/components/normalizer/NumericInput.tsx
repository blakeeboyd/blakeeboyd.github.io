import { useState, useEffect } from 'react';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  fallback: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * Number input that allows clearing the field while typing.
 * Commits the numeric value on blur; falls back to `fallback` if empty/invalid.
 */
export function NumericInput({ value, onChange, fallback, min, max, step, className }: NumericInputProps) {
  const [display, setDisplay] = useState(String(value));

  // Sync display when the store value changes externally
  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  return (
    <input
      type="number"
      className={className}
      value={display}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        setDisplay(e.target.value);
        const n = parseFloat(e.target.value);
        if (!isNaN(n)) {
          onChange(min !== undefined ? Math.max(min, n) : n);
        }
      }}
      onBlur={() => {
        const n = parseFloat(display);
        if (isNaN(n)) {
          onChange(fallback);
          setDisplay(String(fallback));
        } else {
          const clamped = min !== undefined ? Math.max(min, n) : n;
          onChange(clamped);
          setDisplay(String(clamped));
        }
      }}
    />
  );
}
