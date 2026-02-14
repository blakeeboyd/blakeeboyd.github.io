import { useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { useScopeStore } from '../../store/scope-store';
import { NodeSlider } from '../../components/NodeSlider';
import { getEngine } from '../../hooks/use-audio-engine';
import { getManifest } from '../registry';
import { instantiateInternalGraph } from '../../utils/instantiate-internal-graph';
import type { DawNode } from '../../types/graph';

export function CompressorNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const handleOpenInternals = useCallback(() => {
    const manifest = getManifest('compressor');
    const composition = manifest.composition;
    if (!composition?.internalGraph) return;

    const scope = useScopeStore.getState();
    // Lazily instantiate the internal graph the first time
    if (!scope.internalGraphs[id]) {
      const { nodes, edges } = instantiateInternalGraph(composition);
      scope.initInternalGraph(id, nodes, edges);
    }
    scope.pushScope(id, data.label || 'Compressor', 'compressor');
  }, [id, data.label]);

  const threshold = data.parameters.threshold ?? -18;
  const ratio = data.parameters.ratio ?? 4;
  const attack = data.parameters.attack ?? 0.003;
  const release = data.parameters.release ?? 0.25;
  const makeup = data.parameters.makeup ?? 0;

  // Gain reduction meter
  const meterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const drawMeter = useCallback(() => {
    const engine = getEngine();
    const proc = engine?.getProcessor(id);
    const reductionDb = proc?.getReductionDb?.() ?? 0;

    // DynamicsCompressorNode.reduction is negative (e.g., -6 means 6 dB of reduction)
    const absReduction = Math.abs(reductionDb);
    // Map 0-20 dB reduction to bar width percentage
    const pct = Math.min(100, (absReduction / 20) * 100);

    if (meterRef.current) {
      meterRef.current.style.width = `${pct}%`;
    }
    if (labelRef.current) {
      labelRef.current.textContent = absReduction > 0.1 ? `${reductionDb.toFixed(1)} dB` : '0.0 dB';
    }

    rafRef.current = requestAnimationFrame(drawMeter);
  }, [id]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawMeter);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawMeter]);

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses} style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Left} id="in"
        className="daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2" />
      <Handle type="target" position={Position.Left} id="sidechain"
        className="daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2" />
      <div className="daw-node__header">
        <span>Compressor</span>
        <div className="daw-node__sm-buttons">
          <button
            className="daw-node__sm-btn daw-node__sm-btn--expand"
            onClick={(e) => { e.stopPropagation(); handleOpenInternals(); }}
            title="Open Internals"
          >&#x25B6;</button>
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        {/* Gain reduction meter */}
        <div className="daw-compressor__gr-meter">
          <div className="daw-compressor__gr-bar" ref={meterRef} />
          <span className="daw-compressor__gr-label" ref={labelRef}>0.0 dB</span>
        </div>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Threshold</span>
          <NodeSlider min={-60} max={0} step={0.5} value={threshold}
            onChange={v => updateParameter(id, 'threshold', v)} />
          <span className="daw-node__param-value">{threshold.toFixed(1)} dB</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Ratio</span>
          <NodeSlider min={1} max={20} step={0.5} value={ratio}
            onChange={v => updateParameter(id, 'ratio', v)} />
          <span className="daw-node__param-value">{ratio.toFixed(1)}:1</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Attack</span>
          <NodeSlider min={0.001} max={0.1} step={0.001} value={attack}
            onChange={v => updateParameter(id, 'attack', v)} />
          <span className="daw-node__param-value">{(attack * 1000).toFixed(1)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Release</span>
          <NodeSlider min={0.01} max={1} step={0.01} value={release}
            onChange={v => updateParameter(id, 'release', v)} />
          <span className="daw-node__param-value">{(release * 1000).toFixed(0)} ms</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">Makeup</span>
          <NodeSlider min={-6} max={24} step={0.5} value={makeup}
            onChange={v => updateParameter(id, 'makeup', v)} />
          <span className="daw-node__param-value">{makeup > 0 ? '+' : ''}{makeup.toFixed(1)} dB</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
