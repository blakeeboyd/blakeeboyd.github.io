# Blake Boyd Personal Website

A personal website hosted on GitHub Pages at blakeeboyd.github.io.

## Project Structure

```
/
├── index.html              # Landing page (under construction)
├── projects.html           # Projects listing page
├── CLAUDE.md               # Project context for AI agents
├── css/
│   └── style.css           # Shared stylesheet (all pages use this)
├── js/
│   └── bandlab-parser.js   # BandLab parser JavaScript
└── projects/
    ├── bandlab-parser/
    │   ├── index.html      # Parser main page (uses .container.wide)
    │   └── bookmarklet.html # Bookmarklet setup instructions
    └── moylan-eq/
        ├── index.html      # MoylanEQ main page (uses .container.wide)
        ├── js/
        │   ├── app.js
        │   ├── app-moylanEQ.js
        │   └── guardrails.js
        ├── style/
        │   └── style-moylanEQ.css  # Project-specific styles (uses main CSS vars)
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

The site uses a minimalist design inspired by stefanzweifel.dev. All styles are in `/css/style.css`.

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
--max-width: 640px;  /* Default, override with .container.wide for 1200px */
```

### Layout Classes
- `.container` - Default 640px max-width layout
- `.container.wide` - 1200px max-width for two-column layouts (e.g., parser)
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

### MoylanEQ

Educational audio application for learning critical listening skills and frequency band recognition. Built with RNBO (Max/MSP web export) for the MUS399 course.

**Key Features:**
- Three audio source modes: Mute, Pink Noise (internal), User Audio (upload)
- User audio file upload with Web Audio API decoding (supports WAV, MP3, OGG, FLAC)
- Play/pause/loop controls for uploaded audio
- Six frequency band filters based on Moylan's EQ bands (Low, Low Mid, Mid, Mid-High, High, Very High)
- Master filter toggle for all bands
- Gain control (-70 to +6 dB)
- Exercise prompts for critical listening practice

**Technical Stack:**
- RNBO for Web Audio processing (signal processing, filters, pink noise generation)
- Web Audio API for user audio decoding and playback
- Main site CSS with project-specific overrides in `style/style-moylanEQ.css`

**Audio Architecture:**
- `audioFile_selector` parameter controls source: 0=Mute, 1=Pink Noise, 2=User Audio
- User audio routes through `AudioBufferSourceNode` connected to `device.node` (RNBO signal input)
- RNBO handles all frequency band filtering and output

**Key Files:**
- `js/app-moylanEQ.js` - Main application logic, audio routing, UI event handlers
- `js/guardrails.js` - Input validation and safety checks
- `export/gb.moylanEQ.export.json` - RNBO patcher export
- `style/style-moylanEQ.css` - Project-specific styles

## Development Notes

- Static site, no build process required
- Hosted via GitHub Pages
- All processing happens client-side (no server)
- All pages share `/css/style.css` - use relative paths from current page
- Project-specific CSS should use main site CSS variables for consistency
- Navigation should be consistent across all pages (shows "Projects" link)
- Footer shows copyright with current year
