export type StageSize = 'small-narrow' | 'small-wide' | 'medium-narrow' | 'medium-wide' |
                       'large-narrow' | 'large-wide' | 'xlarge-narrow' | 'xlarge-wide';

export interface StageElement {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  labelVisible: boolean;
}

export interface StagePlotDoc {
  version: 1;
  type: 'stage-plot';
  stageSize: StageSize;
  elements: StageElement[];
  backgroundImage: string | null;
  backgroundOpacity: number;
}
