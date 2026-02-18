const COLORS = [
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16',
];

interface ColorPickerProps {
  value: string | null;
  onChange: (color: string | null) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="advc-color-picker">
      <button
        className={`advc-color-swatch advc-color-swatch--none${value === null ? ' advc-color-swatch--active' : ''}`}
        onClick={() => onChange(null)}
        title="No color"
      />
      {COLORS.map(color => (
        <button
          key={color}
          className={`advc-color-swatch${value === color ? ' advc-color-swatch--active' : ''}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}
