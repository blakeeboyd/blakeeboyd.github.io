interface GainReadoutProps {
  appliedGainDb: number;
}

export function GainReadout({ appliedGainDb }: GainReadoutProps) {
  if (appliedGainDb === 0) {
    return (
      <div className="norm-showme__gain">
        <span className="norm-showme__gain-muted">no gain change applied</span>
      </div>
    );
  }

  const gainLinear = Math.pow(10, appliedGainDb / 20);
  const sign = appliedGainDb >= 0 ? '+' : '';

  return (
    <div className="norm-showme__gain">
      every sample&ensp;&times;&ensp;
      <span className="norm-showme__gain-value">{gainLinear.toFixed(3)}</span>
      &ensp;=&ensp;
      <span className="norm-showme__gain-value">{sign}{appliedGainDb.toFixed(1)} dB</span>
    </div>
  );
}
