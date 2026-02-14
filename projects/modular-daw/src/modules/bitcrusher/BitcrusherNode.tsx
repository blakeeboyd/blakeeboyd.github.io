import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useGraphStore } from '../../store/graph-store';
import { NodeSlider } from '../../components/NodeSlider';
import type { DawNode } from '../../types/graph';

export function BitcrusherModuleNode({ id, data }: NodeProps<DawNode>) {
  const updateParameter = useGraphStore(s => s.updateParameter);
  const toggleBypass = useGraphStore(s => s.toggleBypass);

  const bitDepth = data.parameters.bitDepth ?? 8;
  const sampleRateReduction = data.parameters.sampleRateReduction ?? 1;

  const nodeClasses = [
    'daw-node daw-node--effect',
    data.bypassed ? 'daw-node--bypassed' : '',
  ].join(' ');

  return (
    <div className={nodeClasses}>
      <Handle type="target" position={Position.Left} id="in" className="daw-handle daw-handle--audio daw-handle--stereo" />
      <div className="daw-node__header">
        <span>Bitcrusher</span>
        <div className="daw-node__sm-buttons">
          <button
            className={`daw-node__sm-btn daw-node__sm-btn--bypass ${data.bypassed ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleBypass(id); }}
            title="Bypass"
          >B</button>
        </div>
      </div>
      <div className="daw-node__body nodrag nowheel">
        <label className="daw-node__param">
          <span className="daw-node__param-label">Bit Depth</span>
          <NodeSlider min={1} max={16} step={1} value={bitDepth}
            onChange={v => updateParameter(id, 'bitDepth', v)} />
          <span className="daw-node__param-value">{Math.round(bitDepth)} bit</span>
        </label>
        <label className="daw-node__param">
          <span className="daw-node__param-label">SR Reduction</span>
          <NodeSlider min={1} max={64} step={1} value={sampleRateReduction}
            onChange={v => updateParameter(id, 'sampleRateReduction', v)} />
          <span className="daw-node__param-value">{Math.round(sampleRateReduction)}x</span>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" className="daw-handle daw-handle--audio daw-handle--stereo" />
    </div>
  );
}
