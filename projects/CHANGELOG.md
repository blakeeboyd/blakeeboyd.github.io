# Projects Changelog & Roadmap

## TextGarden

Tree-structured writing tool inspired by Gingko Writer, organizing ideas horizontally in columns with markdown export.

### Completed

- Core tree data model with 6-level hierarchy (Roots, Stems, Branches, Twigs, Buds, Leaves)
- Card rendering with inline editing and markdown preview
- Expanded editor with four view modes (default, fullscreen, split-left, split-right)
- Zen mode: distraction-free writing with structure bar, breadcrumb, and expandable tree map
- Markdown import/export (round-trip between `.md` files and tree structure)
- JSON import/export (Gingko Writer format compatible)
- Drag-and-drop card reordering within columns
- Column-level drag-and-drop (move cards between hierarchy levels)
- Undo/redo system
- Card splitting at cursor position and merging with previous card
- Search modal with real-time results and keyboard navigation
- Focus history (Alt+Arrow back/forward navigation)
- Keyboard shortcuts for all operations (30+)
- Six writing templates (Novel Outline, Essay, Research Paper, Blog Post, Screenplay, Brainstorm)
- Document management (new, rename, save as copy, recent documents)
- localStorage autosave with debouncing
- Session timer (stopwatch and pomodoro modes) with audio chime
- Word goal tracking with progress bar
- Document statistics (word count, card count, character count)
- Word frequency analysis and reading level analysis modals
- Column width resizing with drag handles
- Column collapsing
- Print/export PDF dialog with configurable options
- Theme support (dusk, twilight, night)
- Card link syntax for cross-referencing cards
- Breadcrumb navigation
- Settings import/export
- Card child count badges (configurable)
- Card hover preview (configurable)
- Typewriter scrolling (normal and zen modes)
- Focus fade effect in zen mode
- File drag-and-drop import (.md, .json, .gingko, .txt)
- Split mode: tree view confined to visible half for full scrollability

### Proposed

- **Drag-and-drop to child columns**: Currently, dragging a card to a deeper column requires first selecting a different card to make the target column visible. The improved behavior would reveal a card's children column on hover during drag, allowing the user to drop directly into any visible hierarchy level without changing selection first.
- Card color labels or tags for visual organization
- Outline/table of contents panel for quick navigation
- Card word count display
- Minimap of full tree structure (outside zen mode)
- Multi-select cards for bulk operations (move, delete)
- Export to OPML format
- Collaborative editing (would require backend)

### Known Issues

- Drag-and-drop only works within visible columns. Users must select a card to reveal its children column before dragging another card into that level.

---

## PechaKucha Player

Web-based presentation player for the PechaKucha 20x20 format with auto-advancing slides.

### Completed

- Drag-and-drop image upload with thumbnail reordering
- Configurable default slide duration (1-60 seconds)
- Per-slide duration overrides
- Optional title slide (untimed)
- Speaker notes per slide
- Practice mode (single-screen fullscreen)
- Presentation mode (dual-screen with presenter view via BroadcastChannel)
- Audio countdown cues (beeps at 3, 2, 1 seconds)
- Keyboard controls (Space: pause, Arrow keys: navigate, Escape: exit)
- Presenter view: current slide, timer, progress bar, next slide preview, editable notes, slide filmstrip
- Export/import presentation settings as JSON
- Lightbox preview for individual slides
- Undo support for slide deletion
- Display modes (Fit, Fill, Native)
- Accessibility improvements (ARIA labels, focus management, semantic HTML)
- User guide page
- Merged via PR #1

### Proposed

- **In-browser slide editor**: Basic editing tools to build presentations directly in the app without needing external software. Could include text overlays, combining multiple images into a single slide, background colors, and simple layout options. The goal is to let users complete the entire PechaKucha workflow (create, edit, present, export) in one place with minimal friction.
- Slide transition effects (fade, slide)
- Audio/music track support with per-slide synchronization
- Remote control via mobile device (QR code pairing)
- Presentation recording/export to video
- Slide templates with text overlay

---

## Identifying Frequency Bands

Educational audio application for learning critical listening skills and frequency band recognition.

### Completed

- Three audio source modes (Mute, Pink Noise, User Audio upload)
- Full playback controls for uploaded audio (play/pause, loop, seek, time display)
- Six frequency band filters based on Moylan's EQ bands
- Master filter toggle and gain control (-70 to +6 dB)
- Exercise prompts for critical listening practice
- Auto Demo mode cycling through bands with solo/mute
- Demo supports both user audio and pink noise
- RNBO (Max/MSP) web audio processing
- iOS Web Audio API compatibility fixes
- Dark mode support
- User guide page

### Proposed

- Quiz mode with scoring (identify which band is boosted/cut)
- Additional filter bank presets (third-octave, parametric)
- Frequency response visualization
- Progress tracking across sessions

---

## Cancelled Harmonics

Interactive Fourier analysis demonstration for toggling individual harmonics and observing spectral changes.

### Completed

- 20-harmonic additive synthesizer with toggleable harmonics
- Four waveform presets (sine, triangle, square, sawtooth) with correct amplitude relationships
- Real-time scrolling spectrogram visualization (0-8kHz)
- Adjustable fundamental frequency (50-500 Hz)
- Master gain control (-70 to 0 dB)
- Auto Demo replicating ASA demonstration sequence
- Random Build mode (randomly adds harmonics to build sawtooth)
- Pure Web Audio API, no dependencies

### Proposed

- Amplitude slider per harmonic (not just on/off)
- Phase offset control per harmonic
- Waveform display (time domain) alongside spectrogram
- Audio file input for spectral comparison
- Preset saving/loading

---

## Understanding Phase Correlation

Interactive demonstration of stereo phase correlation and imaging behavior.

### Completed

- Four phase scenarios (correlated/uncorrelated x same/inverted polarity)
- Three audio sources (Mute, Pink Noise, User Audio upload)
- Real-time stereo correlation meter (half-circle visualization)
- Master gain control (-70 to 0 dB)
- Stereo/mono output toggle
- Auto Demo mode
- Pink noise generation using Paul Kellet's algorithm
- Pure Web Audio API, no dependencies

### Proposed

- Mid/side processing demonstration
- Stereo width control
- Lissajous (XY) display alongside correlation meter
- Phase rotation control (0-360 degrees)

---

## EQ Matching

Gamified ear training for recreating hidden parametric EQ curves.

### Completed

- 4-band parametric EQ with graphical canvas interface
- Draggable control points for frequency/gain
- Scroll wheel Q adjustment for peaking bands
- Filter type selection (high-pass/low-shelf, low-pass/high-shelf)
- A/B comparison (Target EQ, User EQ, Bypass)
- Scoring system based on frequency response matching
- Streak tracking
- Spectrum analyzer (revealed after submission)
- Pink noise or user audio sources

### Proposed

- Difficulty levels (fewer bands, constrained frequency ranges)
- Leaderboard or personal best tracking
- Training mode with hints (show target curve partially)
- Additional filter types (notch, bandpass)
- Frequency labeling quiz mode

---

## Pairwise Matrix

Prioritization tool using head-to-head comparisons to rank items by total wins.

### Completed

- Setup flow: enter decision context and item names
- Guided comparison mode: one matchup at a time with progress bar
- Keyboard shortcuts (1/← pick left, 2/→ pick right, Backspace undo)
- Full matrix view showing all comparison results
- Results ranked by total wins
- Export: copy text, download Markdown, download JSON
- Print-friendly layout
- Save/load multiple matrices to localStorage
- Import from JSON or Markdown files
- User guide page

### Proposed

- Weighted criteria mode (score items on multiple factors)
- Google Drive integration (App Data folder for cloud sync)
- Tie handling (skip or half-point options)
- Framework presets (Eisenhower-inspired criteria bundles)
- Matrix heatmap visualization
- Win/loss network graph

---

## Stereo Mic Techniques

Ambisonic B-format decoder with virtual stereo microphone configurations and binaural 3D audio.

### Completed

- First-order Ambisonics decoding into five stereo mic techniques (XY, ORTF, Mid-Side, Blumlein, Binaural)
- B-format file upload (4-channel WAV/FLAC) with AmbiX and FuMa format support
- Real-time polar pattern visualization on canvas
- Per-technique parameter controls (stereo angle, mic pattern, MS width, head rotation)
- Binaural decoding via Omnitone with yaw dial for head rotation
- Seamless audio seeking (no playback gap when clicking progress bar)
- Dynamic technique info bar with descriptions that update on technique change
- Compact source card with inline format/gain controls
- Angle preset buttons for XY (90, 120, 135 degrees)
- Complete guide page covering all techniques
- Dark mode support
- Audio Interface Standard document for cross-project consistency

### Proposed

- **Layout redesign**: The current 3-column layout (Technique | Polar Pattern | Parameters) does not use space well. The polar pattern canvas (square, aspect-ratio 1:1) is difficult to size correctly alongside rectangular control panels. Multiple layout attempts have been tried (2-column, 2x2 grid, asymmetric fixed+fluid). The layout needs a fresh approach, possibly drawing from professional audio plugin interfaces or abandoning the grid in favor of a more creative arrangement.
- ORTF inter-channel delay simulation (currently approximated with gain-only panning)
- Additional technique presets (NOS, DIN, Jecklin Disk)
- Waveform display in the source card
- A/B comparison between two techniques
- Demo mode that cycles through techniques with audio playing

---

## BandLab Parser

Browser-based tool for parsing BandLab sample pack HTML pages into structured JSON.

### Completed

- File upload for saved HTML files
- Bookmarklet for one-click parsing while browsing BandLab
- Metadata extraction (pack name, artist, genre, instruments)
- Sample information (BPM, key, duration, type)

### Proposed

- Batch processing for multiple packs
- Export to CSV format
- Filter/sort parsed results
- Direct URL input (fetch page without bookmarklet)
