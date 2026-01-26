# Blake Boyd Personal Website

A personal website hosted on GitHub Pages at blakeeboyd.github.io.

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
│       └── eqMatching.css          # EQ matching ear training styles
├── js/
│   ├── theme.js            # Dark mode toggle
│   ├── nav-component.js    # <site-nav> web component
│   ├── contact-form.js     # Contact form submission handler
│   └── bandlab-parser.js   # BandLab parser JavaScript
├── images/                 # Site images
└── projects/
    ├── creative-tools/
    │   └── bandlab-parser/
    │       ├── index.html      # Parser main page (uses .container.wide)
    │       └── bookmarklet.html # Bookmarklet setup instructions
    └── explorable-explanations/
        ├── identifying-frequency-bands/
        │   ├── index.html      # Main page (uses .container.wide)
        │   ├── js/
        │   │   ├── app.js
        │   │   ├── app-moylanEQ.js
        │   │   └── guardrails.js
        │   └── export/
        │       ├── gb.moylanEQ.export.json
        │       ├── dependencies.json
        │       └── media/      # Audio files (not tracked in git due to size)
        ├── cancelled-harmonics/
        │   ├── index.html      # Main page (uses .container.wide)
        │   └── js/
        │       └── app.js      # Pure Web Audio API, no dependencies
        └── understanding-phase-correlation/
            ├── index.html      # Main page (uses .container.wide)
            └── js/
                └── app.js      # Pure Web Audio API, stereo correlation meter
    └── ear-training/
        └── EQ-Training/
            ├── index.html      # EQ matching game (uses .container.wide)
            └── js/
                └── app.js      # Web Audio API, canvas EQ visualization, game logic
```

## URL Conventions

- Use clean URLs without explicit `index.html` (e.g., `/projects/creative-tools/bandlab-parser/` not `/projects/creative-tools/bandlab-parser/index.html`)
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

## Projects

### BandLab Parser

A browser-based tool for parsing BandLab sample pack HTML pages into structured JSON.

**Key Features:**
- File upload for saved HTML files
- Bookmarklet for one-click parsing while browsing BandLab
- Metadata extraction (pack name, artist, genre, instruments, etc.)
- Sample information (BPM, key, duration, type)

**Location:** `projects/creative-tools/bandlab-parser/`

**Bookmarklet URL:**
The bookmarklet is hardcoded to the hosted URL:
```
https://blakeeboyd.github.io/projects/creative-tools/bandlab-parser/index.html#bookmarklet=...
```

**How It Works:**
1. User drags bookmarklet to bookmark bar
2. On a BandLab pack page, clicking the bookmarklet captures the page HTML
3. Opens parser with data in URL hash (`#bookmarklet=<encoded-data>`)
4. `bandlab-parser.js` checks for `#bookmarklet=` hash and processes automatically

### Identifying Frequency Bands (Explorable Explanations)

Educational audio application for learning critical listening skills and frequency band recognition. Built with RNBO (Max/MSP web export) for the MUS399 course.

**Location:** `projects/explorable-explanations/identifying-frequency-bands/`

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

**Location:** `projects/explorable-explanations/cancelled-harmonics/`

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

**Location:** `projects/explorable-explanations/understanding-phase-correlation/`

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

**Location:** `projects/ear-training/EQ-Training/`

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
