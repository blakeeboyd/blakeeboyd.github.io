# Blake Boyd Personal Website

A personal website hosted on GitHub Pages at blakeeboyd.github.io.

## Project Structure

```
/
├── index.html              # Landing page (under construction)
├── projects.html           # Projects listing page
├── CLAUDE.md               # Project context for AI agents
├── css/
│   └── style.css           # Single stylesheet for entire site
├── js/
│   └── bandlab-parser.js   # BandLab parser JavaScript
└── projects/
    ├── bandlab-parser/
    │   ├── index.html      # Parser main page (uses .container.wide)
    │   └── bookmarklet.html # Bookmarklet setup instructions
    └── explorable-explanations/
        └── identifying-pitch-registers/
            ├── index.html      # Main page (uses .container.wide)
            ├── js/
            │   ├── app.js
            │   ├── app-moylanEQ.js
            │   └── guardrails.js
            └── export/
                ├── gb.moylanEQ.export.json
                ├── dependencies.json
                └── media/      # Audio files (not tracked in git due to size)
```

## URL Conventions

- Use clean URLs without explicit `index.html` (e.g., `/projects/bandlab-parser/` not `/projects/bandlab-parser/index.html`)
- Use **relative paths** for local development compatibility (e.g., `../../css/style.css` not `/css/style.css`)
- Navigation links should use relative paths from the current page

## Design System

The site uses a minimalist design inspired by stefanzweifel.dev. All styles are in `/css/style.css` (single CSS file for the entire site).

### CSS Variables

```css
--color-bg: #fafafa;
--color-text: #1a1a1a;
--color-text-muted: #666666;
--color-accent: #0066cc;
--color-border: #e5e5e5;
--color-card-bg: #ffffff;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--max-width: 640px;  /* Default, override with .container.wide for 1400px */
```

### Layout Classes
- `.container` - Default 640px max-width layout
- `.container.wide` - 1400px max-width for wide layouts (fits 14" MacBook Pro)
- `.content-wrapper` - 640px wrapper for narrow content inside wide containers

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

### Identifying Pitch Registers (Explorable Explanations)

Educational audio application for learning critical listening skills and frequency band recognition. Built with RNBO (Max/MSP web export) for the MUS399 course.

**Location:** `projects/explorable-explanations/identifying-pitch-registers/`

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

**Technical Stack:**
- RNBO for Web Audio processing (signal processing, filters, pink noise generation)
- Web Audio API for user audio decoding and playback
- Uses main site CSS (MoylanEQ-specific styles are in the "MoylanEQ Styles" section of `/css/style.css`)

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

## Development Notes

- Static site, no build process required
- Hosted via GitHub Pages
- All processing happens client-side (no server)
- **Single CSS file** for entire site (`/css/style.css`) - project-specific styles are organized in labeled sections
- Navigation should be consistent across all pages (shows "Projects" link)
- Footer shows copyright with current year
