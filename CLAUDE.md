# Blake Boyd Personal Website

A personal website hosted on GitHub Pages at blakeeboyd.github.io.

## Design Philosophy

**Gall's Law**: A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work. You have to start over with a working simple system.

When building new features:
1. First check if existing code can be extended or repurposed
2. Start with the simplest working implementation
3. Add complexity only when the simple version proves insufficient
4. Prefer composing existing pieces over creating new abstractions

## Project Structure

```
/
├── index.html              # Landing page
├── about.html              # About page with headshot
├── works.html              # Creative works catalog (compositions, interactive scores)
├── projects.html           # Projects listing page (tools, explorable explanations)
├── contact.html            # Contact form (Google Forms backend)
├── CLAUDE.md               # Project context for AI agents
├── css/
│   ├── base.css            # Variables, resets, typography, dark mode
│   ├── layout.css          # Header, nav, footer, containers
│   ├── components.css      # Cards, forms, buttons, toggles
│   └── projects/
│       ├── bandlab-parser.css      # BandLab parser styles
│       ├── moylanEQ.css            # Frequency bands app styles
│       ├── cancelledHarmonics.css  # Cancelled harmonics app styles
│       ├── phaseCorrelation.css    # Phase correlation app styles
│       ├── eqMatching.css          # EQ matching ear training styles
│       └── filterIdentification.css # Filter ID ear training styles
├── js/
│   ├── theme.js            # Dark mode toggle
│   ├── nav-component.js    # <site-nav> web component
│   ├── contact-form.js     # Contact form submission handler
│   ├── bandlab-parser.js   # BandLab parser JavaScript
│   └── wip-modal.js        # Reusable "work in progress" modal
├── audio/
│   └── stadium-rock-mp3/   # Multi-track stems (MP3 192kbps, ~3MB total)
├── images/                 # Site images
└── projects/
    ├── bandlab-parser/
    │   ├── index.html          # Parser main page (uses .container.wide)
    │   └── bookmarklet.html    # Bookmarklet setup instructions
    ├── cancelled-harmonics/
    │   ├── index.html          # Main page (uses .container.wide)
    │   └── js/
    │       └── app.js          # Pure Web Audio API, no dependencies
    ├── eq-training/
    │   ├── index.html          # EQ matching game (uses .container.wide)
    │   └── js/
    │       └── app.js          # Web Audio API, canvas EQ visualization, game logic
    ├── filter-id/
    │   ├── index.html          # Filter ID ear training (uses .container.wide)
    │   └── js/
    │       └── app.js          # Web Audio API, IIR filters, canvas visualization
    ├── identifying-frequency-bands/
    │   ├── index.html          # Main page (uses .container.wide)
    │   ├── js/
    │   │   ├── app.js
    │   │   ├── app-moylanEQ.js
    │   │   └── guardrails.js
    │   └── export/
    │       ├── gb.moylanEQ.export.json
    │       ├── dependencies.json
    │       └── media/          # Audio files (not tracked in git due to size)
    ├── modular-daw/
    │   ├── index.html          # Host page (loads bundled React app)
    │   ├── assets/
    │   │   ├── index.js        # Production bundle
    │   │   └── index.css       # Production styles
    │   ├── src/                # React source (Vite + TypeScript)
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── tsconfig.json
    ├── pairwise-matrix/
    │   ├── index.html          # Matrix tool (uses .container.wide)
    │   ├── guide.html          # User guide
    │   ├── architecture.md     # System design documentation
    │   ├── ideas.md            # Future feature ideas
    │   └── js/
    │       └── app.js          # Pure JavaScript, no dependencies
    ├── pechakucha-player/
    │   ├── index.html          # Player main page (uses .container.wide)
    │   ├── presentation.html   # External presentation window
    │   ├── guide.html          # User guide
    │   └── js/
    │       └── app.js          # Pure JavaScript, no dependencies
    ├── round-robin-timer/
    │   ├── index.html          # Timer main page (uses .container.wide)
    │   └── js/
    │       └── app.js          # Pure JavaScript, Web Audio API
    ├── soundbench/
    │   ├── index.html          # Host page (loads bundled React app)
    │   ├── assets/
    │   │   ├── index.js        # Production bundle
    │   │   └── index.css       # Production styles
    │   ├── src/                # React source (Vite + TypeScript)
    │   │   ├── App.tsx         # Root component with router
    │   │   ├── main.tsx        # Entry point
    │   │   ├── components/     # UI components (normalizer/, show-me/, shared/)
    │   │   ├── lib/            # DSP algorithms, worker, encoding
    │   │   ├── pages/          # Route pages
    │   │   ├── store/          # Zustand stores (normalizer, presets)
    │   │   ├── styles/         # Scoped CSS (sb-/norm- prefix)
    │   │   └── types/          # TypeScript types
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── tsconfig.json
    ├── advance/
    │   ├── index.html          # Host page (loads bundled React app)
    │   ├── guide.html          # User guide
    │   ├── assets/
    │   │   ├── index.js        # Production bundle
    │   │   └── index.css       # Production styles
    │   ├── src/                # React source (Vite + TypeScript)
    │   │   ├── App.tsx         # Router setup
    │   │   ├── main.tsx        # Entry point
    │   │   ├── components/     # UI components
    │   │   ├── hooks/          # Custom hooks (auto-save, undo-redo)
    │   │   ├── lib/            # Utilities (export, storage, id)
    │   │   ├── pages/          # Route pages
    │   │   ├── store/          # Zustand stores
    │   │   ├── styles/         # CSS modules
    │   │   └── types/          # TypeScript types
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── tsconfig*.json
    ├── stereo-mic-techniques/
    │   ├── index.html          # Main page (uses .container.wide)
    │   ├── guide.html          # User guide
    │   └── js/
    │       └── app.js          # Web Audio API, B-format audio demos
    ├── textgarden/
    │   ├── index.html          # Main page (uses .container.wide)
    │   ├── guide.html          # User guide
    │   └── js/
    │       └── app.js          # Pure JavaScript, no dependencies
    └── understanding-phase-correlation/
        ├── index.html          # Main page (uses .container.wide)
        └── js/
            └── app.js          # Pure Web Audio API, stereo correlation meter
```

**Redirect stubs:** Old category paths (`projects/creative-tools/`, `projects/ear-training/`, `projects/explorable-explanations/`) and renamed projects (`projects/sounddocs/`) contain redirect stubs that forward to the current flat structure.

## URL Conventions

- Use clean URLs without explicit `index.html` (e.g., `/projects/bandlab-parser/` not `/projects/bandlab-parser/index.html`)
- Use **relative paths** for local development compatibility (e.g., `../../css/style.css` not `/css/style.css`)
- Navigation links should use relative paths from the current page

## Design System

The site uses a minimalist design with modular CSS architecture.

### CSS Architecture

- `base.css` - CSS variables, resets, typography, dark mode theme
- `layout.css` - Header, navigation, footer, containers
- `components.css` - Reusable components (cards, forms, buttons, toggles)
- `projects/*.css` - Project-specific styles

### CSS Variables

```css
--color-bg: #f8f9fa;
--color-text: #1a1a1a;
--color-text-muted: #666666;
--color-accent: #2563eb;
--color-border: #e5e5e5;
--color-card-bg: #ffffff;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-accent-hover: #1d4ed8;
--color-success-hover: #059669;
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--max-width: 640px;  /* Default, override with .container.wide for 1400px */
```

**Dark Mode Button Contrast:**
In dark mode, `--color-accent` becomes `#bfdbfe` (light blue) which has poor contrast with white text. Interactive buttons (play buttons, source buttons) use dark mode overrides with `#3b82f6` (medium blue) for better readability.

### Dark Mode

Dark mode is controlled via `data-theme="dark"` attribute on `<html>`. Theme preference is stored in localStorage and respects system preference on first visit.

### Layout Classes
- `.container` - Default 640px max-width layout
- `.container.wide` - 1400px max-width for wide layouts (fits 14" MacBook Pro)
- `.content-wrapper` - 640px wrapper for narrow content inside wide containers

### Navigation

Navigation is implemented as a Web Component (`<site-nav>`). Use the `base` attribute for nested pages:

```html
<!-- Root pages -->
<site-nav></site-nav>

<!-- Nested pages (2 levels deep) -->
<site-nav base="../../"></site-nav>
```

### Fonts
- Inter from Google Fonts (weights: 400, 500, 600)

### Work in Progress Modal

A reusable modal for pages under active development. Include the script on any page to show a dismissible notice on load.

**Usage:**
```html
<!-- For nested pages (adjust path as needed) -->
<script src="../../../js/wip-modal.js" defer></script>

<!-- For root-level pages -->
<script src="js/wip-modal.js" defer></script>
```

The modal:
- Appears on page load with a warning icon
- Shows a message that the tool is under development
- Includes a link to the contact page for bug reports/feature requests
- Must be dismissed with the "Got it" button before using the page
- Automatically detects the correct path to contact.html based on the `<site-nav base="">` attribute

**To disable:** Simply remove the `<script>` tag from the page's `<head>`.

## Projects

### PechaKucha Player

A web-based presentation player for the PechaKucha format where slides auto-advance on a timer. Supports both practice mode (single-screen) and presentation mode (dual-screen with presenter view).

**Location:** `projects/pechakucha-player/`

**Key Features:**
- Drag-and-drop image upload with thumbnail reordering
- Configurable default slide duration (1-60 seconds, default 20)
- Per-slide duration overrides
- Optional title slide (untimed, displays before presentation starts)
- Speaker notes per slide (visible in presenter view and practice mode)
- Two presentation modes:
  - Practice: Single-screen fullscreen view for rehearsing
  - Present: Opens separate audience window with presenter view showing timer, notes, and next slide
- Six image display modes: Fit, Letterbox (black bars), Fill (crop to cover), Smart Crop (per-slide focal point), Ken Burns (slow pan/zoom), Native (original size)
- Audio countdown cues (single beep at 5s, double beep at 3s)
- Keyboard controls (Space: pause, Arrow keys: navigate, Escape: exit)
- Export/import presentation settings as JSON (preserves slide order, notes, durations, focal points)
- Lightbox preview for individual slides
- Undo support for slide deletion

**Technical Stack:**
- Pure JavaScript (no external dependencies)
- Web Audio API for countdown beeps
- Inline CSS (no external stylesheet)
- BroadcastChannel API for presenter/audience window communication
- Drag-and-drop API for slide reordering

**State Management:**
```javascript
let images = [];           // Array of { name, dataUrl, notes, duration, focalPoint, displayMode }
let titleSlide = null;     // { name, dataUrl, notes } | null
let currentIndex = 0;
let isPaused = false;
let isExternalPresentation = false;
let presentationWindow = null;
```

**Presentation Flow:**
1. Upload images via drag-drop or file picker
2. Reorder slides by dragging thumbnails
3. Click slide to add notes or set custom duration
4. Optionally set a title slide (click slide → "Set as Title Slide")
5. Choose Practice or Present mode
6. Start presentation (Space or click Start)
7. Slides auto-advance; pause with Space; exit with Escape

**Presenter View (Present Mode):**
- Left column: Current slide with progress bar, timer, navigation controls
- Right column: Next slide preview, editable notes
- Bottom: Slide filmstrip for quick navigation

**Export Format:**
```json
{
  "version": 1,
  "defaultDuration": 20,
  "displayMode": "fit",
  "titleSlide": { "name": "...", "notes": "" },
  "slides": [
    { "name": "slide1.jpg", "notes": "Speaker notes", "duration": null, "focalPoint": { "x": 50, "y": 50 }, "displayMode": null }
  ]
}
```

**Key Files:**
- `index.html` - Main page with inline styles
- `presentation.html` - External audience window (minimal, receives updates via BroadcastChannel)
- `guide.html` - User documentation
- `js/app.js` - Complete application logic

### Pairwise Matrix

A prioritization tool that ranks items through head-to-head comparisons. Each item competes against every other item exactly once, and the item with the most wins ranks highest.

**Location:** `projects/pairwise-matrix/`

**Key Features:**
- Setup flow: enter decision context (e.g., "Which tasks should I do first?") and item names
- Guided comparison mode: presents one matchup at a time with progress indicator
- Keyboard shortcuts for fast input (1/← pick left, 2/→ pick right, Backspace undo)
- Full matrix view showing all comparison results
- Results ranked by total wins
- Export options: copy text, download Markdown, download JSON, print
- Save/load multiple matrices to localStorage
- Import from previously exported JSON or Markdown

**Technical Stack:**
- Pure JavaScript (no external dependencies)
- localStorage for persistence
- Inline CSS (no external stylesheet)

**State Management:**
```javascript
var state = {
    id: null,
    context: '',           // Decision question
    items: [],             // [{id: 'A', label: 'Steak'}, ...]
    comparisons: {},       // {'A-B': 'A', 'A-C': 'B', ...}
    comparisonOrder: [],   // [['A','B'], ['A','C'], ...]
    currentIndex: 0,
    phase: 'setup'         // 'setup', 'items', 'comparing', 'results'
};
```

**Comparison Count Formula:**
For N items: N × (N-1) / 2 comparisons
- 4 items → 6 comparisons
- 6 items → 15 comparisons
- 10 items → 45 comparisons

**Export Format:**
```json
{
  "version": 1,
  "type": "pairwise-matrix",
  "context": "Which tasks should I do first?",
  "items": [{"id": "A", "label": "Task 1"}, ...],
  "comparisons": {"A-B": "A", "A-C": "B", ...},
  "results": [{"id": "A", "label": "Task 1", "wins": 3}, ...],
  "exportedAt": "2026-02-04T..."
}
```

**Key Files:**
- `index.html` - Main page with inline styles
- `guide.html` - User documentation
- `architecture.md` - System design with mermaid diagrams
- `ideas.md` - Future feature ideas
- `js/app.js` - Complete application logic

### BandLab Parser

A browser-based tool for parsing BandLab sample pack HTML pages into structured JSON.

**Key Features:**
- File upload for saved HTML files
- Bookmarklet for one-click parsing while browsing BandLab
- Metadata extraction (pack name, artist, genre, instruments, etc.)
- Sample information (BPM, key, duration, type)

**Location:** `projects/bandlab-parser/`

**Bookmarklet URL:**
The bookmarklet is hardcoded to the hosted URL:
```
https://blakeeboyd.github.io/projects/bandlab-parser/index.html#bookmarklet=...
```

**How It Works:**
1. User drags bookmarklet to bookmark bar
2. On a BandLab pack page, clicking the bookmarklet captures the page HTML
3. Opens parser with data in URL hash (`#bookmarklet=<encoded-data>`)
4. `bandlab-parser.js` checks for `#bookmarklet=` hash and processes automatically

### Identifying Frequency Bands (Explorable Explanations)

Educational audio application for learning critical listening skills and frequency band recognition. Built with RNBO (Max/MSP web export) for the MUS399 course.

**Location:** `projects/identifying-frequency-bands/`

**Key Features:**
- Three audio source modes: Mute, Pink Noise (internal), User Audio (upload)
- User audio file upload with Web Audio API decoding (supports WAV, MP3, OGG, FLAC)
- Full playback controls for uploaded audio:
  - Play/pause with proper resume from position
  - Loop toggle
  - Progress bar with click-to-seek
  - Current time / total time display
- Six frequency band filters based on Moylan's EQ bands (Low, Low Mid, Mid, Mid-High, High, Very High)
- Master filter toggle for all bands
- Gain control (-70 to +6 dB)
- Exercise prompts for critical listening practice
- Auto Demo mode that cycles through each band with solo/mute
- Demo supports user audio (uses uploaded file) or pink noise (default)

**Technical Stack:**
- RNBO for Web Audio processing (signal processing, filters, pink noise generation)
- Web Audio API for user audio decoding and playback
- Project-specific styles in `/css/projects/moylanEQ.css`

**Audio Architecture:**
- `audioFile_selector` parameter controls source: 0=Mute, 1=Pink Noise, 2=User Audio
- User audio routes through `GainNode` → `device.node` (RNBO signal input)
- Gain slider controls both RNBO gain parameter (pink noise) and Web Audio GainNode (user audio)
- RNBO patch accepts stereo input and sums to mono internally
- Playback state managed with `startTime`, `pausedAt` for accurate seek/resume
- Progress updates via `requestAnimationFrame` for smooth UI
- RNBO handles all frequency band filtering and output

**Key Files:**
- `js/app-moylanEQ.js` - Main application logic, audio routing, UI event handlers
- `js/guardrails.js` - Input validation and safety checks
- `export/gb.moylanEQ.export.json` - RNBO patcher export

**Global API for Demo Integration:**
The user audio playback functions are exposed via `window.userAudioPlayback`:
```javascript
window.userAudioPlayback = {
  play: () => {},     // Start playback
  stop: () => {},     // Stop playback
  isPlaying: () => Boolean,
  hasAudio: () => Boolean
};
```

### Cancelled Harmonics (Explorable Explanations)

Interactive demonstration of Fourier analysis where users can toggle individual harmonics of a complex tone and observe spectral changes in a real-time spectrogram. Based on the ASA (Acoustical Society of America) "Cancelled Harmonics" demo.

**Location:** `projects/cancelled-harmonics/`

**Key Features:**
- 16 harmonic additive synthesizer with toggleable harmonics
- Four waveform presets (sine, triangle, square, sawtooth) with correct amplitude relationships
- Real-time scrolling spectrogram visualization (0-8kHz range)
- Adjustable fundamental frequency (50-500 Hz)
- Master gain control (-70 to 0 dB)
- Auto Demo: Replicates ASA demonstration sequence, toggling harmonics 1-10 three times each
- Random Build: Fun mode that randomly adds harmonics one by one to build a sawtooth

**Technical Stack:**
- Pure Web Audio API (no external dependencies)
- OscillatorNode x 16 with individual GainNodes for harmonic control
- AnalyserNode for FFT-based spectrogram
- Canvas 2D for spectrogram rendering
- Project-specific styles in `/css/projects/cancelledHarmonics.css`

**Audio Architecture:**
```
OscillatorNode x 16 (sine waves at f, 2f, 3f, ... 16f)
    → GainNode x 16 (individual amplitude control)
    → MasterGainNode (volume control)
    → AnalyserNode (FFT for spectrogram)
    → AudioContext.destination
```

**Waveform Amplitude Formulas:**
- Sawtooth: all harmonics, amplitude = 1/n
- Square: odd harmonics only, amplitude = 1/n
- Triangle: odd harmonics only, amplitude = 1/n²
- Sine: fundamental only

**Key Files:**
- `js/app.js` - Complete application (audio synthesis, spectrogram, UI)

### Understanding Phase Correlation (Explorable Explanations)

Interactive demonstration of stereo phase correlation showing how correlated and uncorrelated audio behaves with different polarity configurations. Features a real-time stereo correlation meter.

**Location:** `projects/understanding-phase-correlation/`

**Key Features:**
- Four phase scenarios demonstrating stereo behavior:
  - Correlated + Same Polarity: Phantom center (sound appears between speakers)
  - Correlated + Inverted Polarity: Power valley (sound at speakers with hole in middle)
  - Uncorrelated + Same Polarity: Diffuse sound (no localization)
  - Uncorrelated + Inverted Polarity: No audible change
- Three audio sources: Mute, Pink Noise (generated), User Audio (upload)
- Real-time stereo correlation meter (half-circle visualization)
- Master gain control (-70 to 0 dB)
- User audio file upload with stereo support

**Technical Stack:**
- Pure Web Audio API (no external dependencies)
- Pink noise generation using Paul Kellet's algorithm
- ChannelSplitter/Merger for stereo manipulation
- AnalyserNode x2 for correlation calculation
- Canvas 2D for correlation meter rendering
- Project-specific styles in `/css/projects/phaseCorrelation.css`

**Audio Architecture:**
```
Pink Noise (correlated or uncorrelated)
    → LeftGain → Merger → MasterGain → destination
    → RightGain → PolarityGain (±1) → Merger

User Audio (stereo)
    → Splitter → LeftGain → ...
              → RightGain → PolarityGain → ...

AnalyserNode x2 (L/R channels) → Correlation calculation
```

**Correlation Calculation:**
- Uses Pearson correlation coefficient
- +1 = Perfectly correlated (mono compatible)
- 0 = Uncorrelated (independent L/R)
- -1 = Out of phase (will cancel in mono)

**Key Files:**
- `js/app.js` - Audio engine, correlation meter, UI logic

### EQ Matching (Ear Training)

Gamified ear training tool where users listen to audio processed through a hidden 4-band parametric EQ and try to recreate the sound by adjusting their own EQ curve.

**Location:** `projects/eq-training/`

**Note:** This project is not listed on the projects page - accessible only via direct URL.

**Key Features:**
- 4-band parametric EQ with graphical canvas interface
  - Band 1: High-pass or Low-shelf filter
  - Bands 2-3: Peaking (bell) filters
  - Band 4: Low-pass or High-shelf filter
- Draggable control points for frequency/gain adjustment
- Scroll wheel Q adjustment for peaking bands
- A/B comparison between Target EQ, User EQ, and Bypass
- Scoring system based on frequency response matching
- Streak tracking for consecutive good scores
- Spectrum analyzer (revealed after guess submission)
- Pink noise or user-uploaded audio sources

**Technical Stack:**
- Pure Web Audio API (no external dependencies)
- BiquadFilterNode x 8 (two parallel EQ chains)
- Canvas 2D for EQ curve visualization
- Real-time filter parameter updates
- Project-specific styles in `/css/projects/eqMatching.css`

**Audio Architecture:**
```
Source (Pink Noise or User Audio)
    ├─→ [Target EQ Chain] → TargetGain ─┐
    ├─→ [User EQ Chain] → UserGain ─────┼─→ A/B Switch → MasterGain → Destination
    └─→ BypassGain ─────────────────────┘

Each EQ Chain: HPF/LSF → Peak → Peak → LPF/HSF (4 BiquadFilterNodes)
```

**Game Flow:**
1. New Round generates random EQ parameters
2. User listens to Target EQ and adjusts their curve
3. Toggle between Target/User/Bypass to compare
4. Submit reveals target curve and calculates score
5. Score based on average dB difference across frequency spectrum

**Key Files:**
- `js/app.js` - Audio engine, canvas interaction, game logic

### Filter Identification (Ear Training)

Ear training tool for identifying filter types, frequencies, and gain settings by listening to audio processed through various EQ filters.

**Location:** `projects/filter-id/`

**Key Features:**
- Five audio sources: Mute, Pink Noise (generated), User Audio (upload), Multi-track (built-in stems), Sawtooth (220 Hz oscillator)
- Multi-track source with 7 stems (Drums, Tambourine, Bass, Guitar, Keys, Organ, Pad) and per-track mute/solo/volume mixer
- Real-time stereo waveform visualization (L/R oscilloscope) for multi-track source
- Seven filter types: High-Pass, Low-Pass, High Shelf, Low Shelf, Peaking, Bandpass, Notch
- HP/LP filters cascade 1-4 BiquadFilterNodes for 12/24/48 dB/oct slopes (Butterworth Q per stage)
- Shelf filters use IIRFilterNode with Audio EQ Cookbook coefficients (adjustable slope S parameter)
- Peaking uses BiquadFilterNode with bandwidth-to-Q conversion
- Real-time frequency response canvas visualization
- Three modes: Practice (direct control), Teaching (listen sequence with selectable source, optional loop), Quiz (identify hidden filter)
- Quiz drill system with configurable parameter subsets
- Per-source gain memory
- Formant-based frequency guide with "too much sounds..." descriptors

**Technical Stack:**
- Pure Web Audio API (no external dependencies)
- BiquadFilterNode (HP/LP/peaking), IIRFilterNode (shelf)
- ChannelSplitter + AnalyserNode x 2 for stereo visualization
- Canvas 2D for filter response curve and stereo waveform
- Project-specific styles in `/css/projects/filterIdentification.css`

**Audio Architecture:**
```
Source (Pink Noise / User Audio / Multi-track / Sawtooth)
  → sourceGain
    → BiquadFilter(s) / IIRFilter → filterGain ──→ masterGain → destination
    → bypassGain ─────────────────────────────────┘

Multi-track routing:
  BufferSourceNode[0..6] → GainNode[0..6] → trackMerge → ChannelSplitter → AnalyserL/R
                                                        → sourceGain
```

**Multi-track:**
- 7 stems loaded in parallel on first use (~3 MB total, MP3 192 kbps)
- Mute/solo mixer: per-track M (mute) and S (exclusive solo) buttons with volume faders
- All stems play by default (summing to full band sound)
- All BufferSourceNodes start at the same scheduled time for sample-accurate sync
- Audio files in `audio/stadium-rock-mp3/` (WAV originals in `audio/stadium-rock/`, gitignored)

**State Management:**
```javascript
const state = {
    currentSource: 0,           // 0=Mute, 1=Pink Noise, 2=User Audio, 3=Multi-track, 4=Sawtooth
    filterType: 'highpass',
    filterFreq: 500,
    filterGainDb: 3,
    filterBypassed: false,
    mode: 'practice',           // 'practice' | 'teaching' | 'quiz'
    multitrackBuffers: {},      // { drums: AudioBuffer, bass: AudioBuffer, ... }
    multitrackMuted: [],        // boolean[] — per-track mute state
    multitrackVolumes: [],      // number[] (0..1) — per-track volume
    multitrackSoloed: null,     // null = no solo, or track key string (exclusive)
    // ... per-source gain values, quiz state, test sequence state
};
```

**Key Files:**
- `js/app.js` - Complete application logic (audio engine, filters, visualization, quiz, modes)
- `index.html` - Page structure with filter controls, mode bar, frequency guide

### SoundBench

A browser-based offline audio processing toolkit. The first tool is a loudness normalizer with batch processing, brickwall limiting, trim/pad/fade, and an educational "Show Me" layer that explains what the processing did to each file. Philosophy: "tools that teach."

**Location:** `projects/soundbench/`

**Key Features:**
- Multi-file batch upload (drag-drop, WAV/MP3/OGG/FLAC/AAC/M4A)
- Six normalization types: LUFS (Integrated, Momentary Max, Short-Term Max), Peak, True Peak, RMS
- Normalization conditions: Always, Too Loud (only if above target), Too Quiet (only if below target)
- Batch modes: Each file separately, Loudest file (match loudest to target), Album (average loudness)
- Brickwall limiter (peak or true peak) with batch "together" mode
- Silence trimming, padding, fade in/out (4 curve types: linear, equal-power, logarithmic, S-curve)
- Output: 16/24/32-bit WAV, stereo/mono/split L+R, customizable filename suffix
- Preset system (built-in: Streaming -14 LUFS, Broadcast -24 LUFS, EBU R128 ranges; user presets via localStorage)
- Per-file before/after measurements in results table
- Download individual files or batch ZIP
- "Show Me" educational panel: waveform before/after overlay, gain readout, LUFS meter, educational text explaining what normalization is and why LUFS matters

**Technical Stack:**
- React 18 + TypeScript + Vite
- Zustand for state management (normalizer store + preset store with persistence)
- Web Worker for all DSP (inline via `?worker&inline` for single-bundle build)
- ITU-R BS.1770-4 LUFS measurement (K-weighting, gating)
- ITU-R BS.1509-3 True Peak (192 kHz upsampling)
- Canvas 2D for waveform and LUFS meter visualizations
- nanoid for ID generation

**Architecture:**
```
src/
├── App.tsx                  # Root component with Outlet
├── main.tsx                 # Entry point, createHashRouter
├── components/
│   ├── layout/
│   │   └── AppHeader.tsx    # Header with tool tabs
│   ├── normalizer/
│   │   ├── NormalizerEditor.tsx     # Main orchestrator (decode, cache, process)
│   │   ├── NormalizerSettings.tsx   # Settings sidebar container
│   │   ├── FileDropZone.tsx         # Drag-drop upload
│   │   ├── FileList.tsx / FileRow.tsx
│   │   ├── NormalizeSection.tsx     # Loudness normalization controls
│   │   ├── TrimPadSection.tsx       # Trim, padding, fades
│   │   ├── LimiterSection.tsx       # Brickwall limiter controls
│   │   ├── OutputSection.tsx        # Bit depth, mono mode, suffix
│   │   ├── PresetManager.tsx        # Preset load/save/delete
│   │   ├── NumericInput.tsx         # Reusable numeric input
│   │   ├── ProcessingProgress.tsx   # Progress bars during batch
│   │   ├── ResultsPanel.tsx         # Results table with download/Show Me
│   │   └── show-me/
│   │       ├── ShowMePanel.tsx      # Educational panel container
│   │       ├── WaveformCanvas.tsx   # Before/after waveform overlay (Canvas)
│   │       ├── GainReadout.tsx      # Gain calculation display
│   │       └── LufsMeter.tsx        # Horizontal LUFS position meter (Canvas)
│   └── shared/
│       └── ErrorBoundary.tsx
├── lib/normalizer/
│   ├── worker.ts            # Web Worker entry (measure + process messages)
│   ├── pipeline.ts          # DSP pipeline orchestrator
│   ├── decode.ts            # Web Audio API file decoding
│   ├── lufs.ts              # ITU-R BS.1770-4 LUFS measurement
│   ├── true-peak.ts         # True Peak measurement
│   ├── rms.ts               # RMS measurement
│   ├── limiter.ts           # Brickwall peak/true-peak limiter
│   ├── trim.ts              # Silence trimming
│   ├── pad.ts               # Silence padding
│   ├── fade.ts              # Fade in/out (4 curve types)
│   ├── mono.ts              # Stereo-to-mono downmix
│   ├── wav-encoder.ts       # WAV file encoding
│   ├── batch-gain.ts        # Multi-file batch normalization math
│   ├── waveform-envelope.ts # Envelope extraction for visualization
│   ├── built-in-presets.ts  # Streaming, broadcast, loudness range presets
│   ├── messages.ts          # Worker message type definitions
│   ├── zip.ts               # ZIP creation for batch download
│   └── id.ts                # nanoid wrapper
├── store/
│   ├── normalizer-store.ts  # Files, settings, processing state
│   └── preset-store.ts      # Presets with localStorage persistence
├── types/
│   ├── normalizer.ts        # AudioFileEntry, measurements, settings interfaces
│   └── waveform.ts          # WaveformEnvelope type
├── pages/
│   ├── HomePage.tsx          # Tool gallery
│   └── NormalizerPage.tsx    # Normalizer tool page
└── styles/
    ├── index.css             # Style imports
    ├── tokens.css            # Design tokens (dark-only, scoped to .sb-app)
    ├── layout.css            # Header, page layout
    ├── normalizer.css        # Normalizer UI styles
    └── show-me.css           # Educational panel styles
```

**Audio Processing Architecture:**
```
Main Thread                          Worker Thread
─────────────                        ─────────────
FileDropZone → decodeAudioFile()
  → decodedCache (Float32Array[])
  → envelopeCache (WaveformEnvelope)
  → worker.postMessage('measure')    → LUFS/peak/RMS measurement
  ← inputMeasurements                ← measurements response

Process button
  → worker.postMessage('process')    → Full pipeline:
  ← progress updates                    measure → normalize → trim
  ← result (WAV ArrayBuffer)            → pad → fade → limit → mono
  ← outputMeasurements                  → measure → encode WAV
```

**Key Patterns:**
- Large audio data (`Float32Array[]`) stored in module-scoped Maps (`decodedCache`, `envelopeCache`) outside Zustand to avoid React serialization
- Worker uses `?worker&inline` import for single-bundle output (no separate worker file)
- Batch two-pass: compute batch gains from measurements, then process all files with override
- Waveform visualization uses downsampled envelope (2048 min/max bucket pairs, ~16KB) computed once at decode
- "After" waveform = input envelope × `gainLinear` (exact for pure normalization; note shown when trim/fade/limiter also applied)
- Zustand selectors: select primitives directly to avoid re-render loops

**Build & Deploy:**
- Dev: `cd projects/soundbench && npm run dev` (Vite dev server on localhost:5173)
- Build: `npm run build` (tsc + Vite, copies dist/ to assets/)
- Production: `index.html` loads `assets/index.js` and `assets/index.css`
- Vite config includes custom plugin to proxy site-wide CSS/JS/images from `../../` during dev

**CSS Architecture:**
- Classes prefixed with `sb-` (app-wide) and `norm-` (normalizer-specific)
- Dark-only design: tokens scoped to `.sb-app` class
- Educational accent: `--sb-color-edu` (purple #a78bfa)
- Data visualization: `--sb-color-data` (cyan #22d3ee)
- Tool color: `--sb-color-norm` (green #10b981)

**Worker Message Protocol:**
- Requests: `{ type: 'measure' | 'process', fileId, channelData, sampleRate, settings? }`
- Responses: `measurements`, `progress`, `result` (with WAV buffer), `error`
- Settings carry optional `overrideGainDb` and `overrideLimiterReduction` for batch processing

**File State Machine:**
```
pending → decoding → ready ←→ processing → done
          ↓                        ↓
          error ←←←←←←←←←←←←←←← error
```

### Advance

A browser-based suite of production documentation tools for live sound engineers: patch sheets, stage plots, and run-of-show documents. Built with React + TypeScript + Vite. Tagline: "Get ahead of the show."

**Location:** `projects/advance/`

**Key Features:**
- Three document types: Patch Sheets (input/output channel lists), Stage Plots (visual stage layouts), Run of Show (cue-based production timelines)
- All data persisted in localStorage (no server)
- Export to PDF (tables via jsPDF/autotable, stage plots via html2canvas) and JSON
- Import from previously exported JSON
- Undo/redo with keyboard shortcuts (Ctrl+Z/Y)
- Auto-save with status indicator
- Drag-to-reorder table rows, draggable/resizable stage elements
- Grid snapping for stage plots
- Background image upload for stage plots
- Row highlight colors for run of show

**Technical Stack:**
- React 18 + TypeScript + Vite
- Zustand for state management (one store per document type + one document registry)
- Zundo for undo/redo (temporal middleware on Zustand stores)
- react-router-dom for client-side routing (HashRouter for GitHub Pages)
- jsPDF + jspdf-autotable for table PDF export
- html2canvas for stage plot PDF export
- nanoid for ID generation

**Architecture:**
```
src/
├── App.tsx              # HashRouter + routes
├── main.tsx             # Mount point
├── components/
│   ├── layout/          # Sidebar, Toolbar (shared across all tools)
│   ├── shared/          # DocumentCard, ExportMenu, ConfirmDialog, etc.
│   ├── patch-sheet/     # InputTable, OutputTable, MetadataPanel
│   ├── stage-plot/      # StageCanvas, ElementPalette, PropertiesPanel
│   └── run-of-show/     # RunOfShowEditor (table-based)
├── hooks/
│   ├── use-auto-save.ts # Debounced save with idle/pending/saved status
│   └── use-undo-redo.ts # Keyboard shortcuts + canUndo/canRedo states
├── lib/
│   ├── export-pdf.ts    # PDF generators for all three types
│   ├── export-json.ts   # JSON import/export
│   ├── storage.ts       # localStorage helpers
│   └── id.ts            # nanoid wrapper
├── pages/               # Route pages (HomePage, PatchSheetPage, etc.)
├── store/
│   ├── document-store.ts     # Document registry (persisted)
│   ├── patch-sheet-store.ts  # Patch sheet state (temporal)
│   ├── stage-plot-store.ts   # Stage plot state (temporal)
│   └── run-of-show-store.ts  # Run of show state (temporal)
├── styles/              # Scoped CSS (adv- prefix, CSS variables)
└── types/               # TypeScript interfaces for each document type
```

**Build & Deploy:**
- Dev: `cd projects/advance && npm run dev` (Vite dev server)
- Build: `npm run build` (runs tsc, Vite build, copies dist/ to assets/)
- Production: `index.html` loads `assets/index.js` and `assets/index.css`
- Vite config includes a custom plugin to proxy site-wide CSS/JS/images from `../../` during dev

**CSS Architecture:**
- All classes prefixed with `adv-` to avoid conflicts with site CSS
- CSS variables defined in `tokens.css` (colors, radii, shadows, transitions)
- Separate files: `layout.css`, `components.css`, `stage-plot.css`, `run-of-show.css`
- Print media queries in each CSS file

**Key Patterns:**
- Zustand selectors: use `useShallow` for selectors that return arrays/objects, select primitives directly to avoid infinite re-render loops
- Each tool page follows the pattern: load document on route change, auto-save on state changes, undo/redo via temporal store
- Stage plot elements use pointer events (not drag API) for smooth drag/resize

## Design Inspiration

- https://www.seanhalpin.xyz/fun - Playful, interactive design elements

## Writing Style

The site's written content should be more formal than conversational while maintaining a clear authorial voice.

### Tone and Voice
- Formally conversational: intellectual rigor with accessibility
- Willing to sit with ambiguity rather than forcing resolution
- Personal conviction balanced with intellectual humility
- Use "I think" and "I'm interested in" when appropriate
- Acknowledge incompleteness and work-in-progress thinking

### Sentence Structure
- Use flowing, complex sentences that build ideas through subordination
- Use short sentences strategically for emphasis and conclusions
- Vary sentence length. Avoid uniformly medium-length sentences.
- Do not start consecutive sentences or paragraphs the same way

### Punctuation
- Parentheses: for technical specifications and brief asides
- Colons: to set up explanations or parallel structures
- Quotation marks: around key concepts to signal linguistic precision
- **Never use em dashes or semicolons.** Use commas, colons, or parentheses instead.

### Vocabulary
- Specific over abstract: ground ideas in concrete examples
- Comfortable with philosophical and technical terms when needed
- Use metaphorical language purposefully
- Define or contextualize specialized terms for clarity

### Structure
- Historical or narrative framing when explaining concepts
- Movement from broad context to specific application
- Thematic organization around central ideas
- Use headers for clarity in longer documents
- Use prose when it works better than bullet points

### Patterns to Use
- Position ideas through contrast ("The first impulse... The second impulse...")
- Layer multiple threads simultaneously
- Use questions to invite thinking rather than declare answers
- Ground abstract arguments in specific examples or moments

### Patterns to Avoid
- Filler phrases: "It's important to note that," "In today's world," "When it comes to," "At the end of the day"
- Overused words: "delve," "crucial," "vital," "cutting-edge," "leverage," "robust," "seamless," "utilize," "facilitate," "comprehensive," "innovative"
- Excessive hedging: "It seems that perhaps this might possibly be..."
- Performative enthusiasm: "Great question!" or "Absolutely!"
- Overwrought constructions or phrases that sound too clever

## SEO & Meta Tags

All pages include standard SEO meta tags:
- `theme-color` meta tag (`#2563eb`)
- `author` meta tag
- Open Graph tags (og:title, og:description, og:type, og:url, og:site_name)
- Twitter Card tags (twitter:card, twitter:title, twitter:description)
- Canonical URL

## Development Notes

- Static site, no build process required
- Hosted via GitHub Pages
- All processing happens client-side (no server)
- Modular CSS architecture with separate files for base, layout, components, and project-specific styles
- Navigation implemented as a Web Component with `aria-controls` for accessibility
- Dark mode support with system preference detection
- Contact form uses externalized JavaScript (`js/contact-form.js`) for better performance
- Footer shows copyright with current year
