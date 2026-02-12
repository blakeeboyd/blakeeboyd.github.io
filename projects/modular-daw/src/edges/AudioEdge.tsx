import {
  getBezierPath,
  type EdgeProps,
  BaseEdge,
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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isStereo = data?.channelFormat === 'stereo';

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className={`daw-edge daw-edge--audio ${isStereo ? 'daw-edge--stereo' : 'daw-edge--mono'}`}
    />
  );
}
