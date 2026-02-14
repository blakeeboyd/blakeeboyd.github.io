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
    <div className="adv-color-picker">
      <button
        className={`adv-color-swatch adv-color-swatch--none${value === null ? ' adv-color-swatch--active' : ''}`}
        onClick={() => onChange(null)}
        title="No color"
      />
      {COLORS.map(color => (
        <button
          key={color}
          className={`adv-color-swatch${value === color ? ' adv-color-swatch--active' : ''}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}
