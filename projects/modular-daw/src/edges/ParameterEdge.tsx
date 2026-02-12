import {
  getBezierPath,
  type EdgeProps,
  BaseEdge,
} from '@xyflow/react';

export function ParameterEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className="daw-edge daw-edge--parameter"
    />
  );
}
