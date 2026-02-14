export interface ElementTypeDef {
  type: string;
  name: string;
  category: 'instruments' | 'audio' | 'people' | 'staging';
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
}

export const ELEMENT_TYPES: ElementTypeDef[] = [
  // Instruments
  { type: 'electric-guitar', name: 'Electric Guitar', category: 'instruments', icon: '\uD83C\uDFB8', defaultWidth: 50, defaultHeight: 50, defaultColor: '#ef4444' },
  { type: 'acoustic-guitar', name: 'Acoustic Guitar', category: 'instruments', icon: '\uD83C\uDFB8', defaultWidth: 50, defaultHeight: 50, defaultColor: '#f59e0b' },
  { type: 'bass', name: 'Bass', category: 'instruments', icon: '\uD83C\uDFB8', defaultWidth: 50, defaultHeight: 50, defaultColor: '#8b5cf6' },
  { type: 'drums', name: 'Drums', category: 'instruments', icon: '\uD83E\uDD41', defaultWidth: 80, defaultHeight: 80, defaultColor: '#6b7280' },
  { type: 'keyboard', name: 'Keyboard', category: 'instruments', icon: '\uD83C\uDFB9', defaultWidth: 80, defaultHeight: 40, defaultColor: '#3b82f6' },
  { type: 'piano', name: 'Piano', category: 'instruments', icon: '\uD83C\uDFB9', defaultWidth: 100, defaultHeight: 50, defaultColor: '#1f2937' },
  { type: 'violin', name: 'Violin', category: 'instruments', icon: '\uD83C\uDFBB', defaultWidth: 40, defaultHeight: 40, defaultColor: '#92400e' },
  { type: 'trumpet', name: 'Trumpet', category: 'instruments', icon: '\uD83C\uDFBA', defaultWidth: 40, defaultHeight: 40, defaultColor: '#d97706' },

  // Audio equipment
  { type: 'microphone', name: 'Microphone', category: 'audio', icon: '\uD83C\uDF99\uFE0F', defaultWidth: 30, defaultHeight: 30, defaultColor: '#6b7280' },
  { type: 'monitor-wedge', name: 'Monitor Wedge', category: 'audio', icon: '\uD83D\uDD0A', defaultWidth: 50, defaultHeight: 30, defaultColor: '#374151' },
  { type: 'amp', name: 'Amp/Cabinet', category: 'audio', icon: '\uD83D\uDD0A', defaultWidth: 50, defaultHeight: 50, defaultColor: '#1f2937' },
  { type: 'di-box', name: 'DI Box', category: 'audio', icon: '\uD83D\uDCE6', defaultWidth: 30, defaultHeight: 25, defaultColor: '#6b7280' },
  { type: 'speaker-main', name: 'Main Speaker', category: 'audio', icon: '\uD83D\uDD0A', defaultWidth: 40, defaultHeight: 60, defaultColor: '#1f2937' },
  { type: 'subwoofer', name: 'Subwoofer', category: 'audio', icon: '\uD83D\uDD0A', defaultWidth: 50, defaultHeight: 50, defaultColor: '#111827' },

  // People
  { type: 'vocalist', name: 'Vocalist', category: 'people', icon: '\uD83C\uDFA4', defaultWidth: 40, defaultHeight: 40, defaultColor: '#ec4899' },
  { type: 'performer', name: 'Performer', category: 'people', icon: '\uD83E\uDDCD', defaultWidth: 40, defaultHeight: 40, defaultColor: '#06b6d4' },

  // Staging
  { type: 'riser', name: 'Riser', category: 'staging', icon: '\u2B1C', defaultWidth: 100, defaultHeight: 60, defaultColor: '#4b5563' },
  { type: 'table', name: 'Table', category: 'staging', icon: '\u2B1C', defaultWidth: 80, defaultHeight: 40, defaultColor: '#78716c' },
  { type: 'stool', name: 'Stool/Chair', category: 'staging', icon: '\uD83E\uDE91', defaultWidth: 30, defaultHeight: 30, defaultColor: '#78716c' },
  { type: 'label', name: 'Text Label', category: 'staging', icon: 'Aa', defaultWidth: 80, defaultHeight: 30, defaultColor: '#9ca3af' },
];

export const ELEMENT_CATEGORIES = [
  { key: 'instruments', label: 'Instruments' },
  { key: 'audio', label: 'Audio' },
  { key: 'people', label: 'People' },
  { key: 'staging', label: 'Staging' },
] as const;
