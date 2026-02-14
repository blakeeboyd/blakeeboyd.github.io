import {
  getBezierPath,
  type EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
} from '@xyflow/react';

export function AudioEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isStereo = data?.channelFormat === 'stereo';
  const sourceFormat = data?.sourceChannelFormat as string | undefined;
  const targetFormat = data?.targetChannelFormat as string | undefined;
  const showConversionBadge = sourceFormat && targetFormat && sourceFormat !== targetFormat;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={`daw-edge daw-edge--audio ${isStereo ? 'daw-edge--stereo' : 'daw-edge--mono'}`}
      />
      {showConversionBadge && (
        <EdgeLabelRenderer>
          <div
            className="daw-edge__format-badge"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'none',
            }}
          >
            {sourceFormat === 'mono' ? 'M' : 'S'}&rarr;{targetFormat === 'mono' ? 'M' : 'S'}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
