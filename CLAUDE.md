# Blake Boyd Personal Website

A personal website hosted on GitHub Pages at blakeeboyd.github.io.

## Project Structure

```
/
├── index.html              # Landing page (under construction)
├── vibe-coding.html        # Vibe coding projects listing
├── CLAUDE.md               # Project context for AI agents
├── css/
│   └── style.css           # Shared stylesheet (all pages use this)
├── js/
│   └── bandlab-parser.js   # BandLab parser JavaScript
└── projects/
    └── bandlab-parser/
        ├── index.html      # Parser main page (uses .container.wide)
        └── bookmarklet.html # Bookmarklet setup instructions
```

## URL Conventions

- Use clean URLs without explicit `index.html` (e.g., `/projects/bandlab-parser/` not `/projects/bandlab-parser/index.html`)
- All asset paths should be absolute from root (e.g., `/css/style.css`, `/js/bandlab-parser.js`)

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

## BandLab Parser

A browser-based tool for parsing BandLab sample pack HTML pages into structured JSON.

### Key Features
- File upload for saved HTML files
- Bookmarklet for one-click parsing while browsing BandLab
- Metadata extraction (pack name, artist, genre, instruments, etc.)
- Sample information (BPM, key, duration, type)

### Bookmarklet URL
The bookmarklet is hardcoded to the hosted URL:
```
https://blakeeboyd.github.io/projects/bandlab-parser/index.html#bookmarklet=...
```

### How It Works
1. User drags bookmarklet to bookmark bar
2. On a BandLab pack page, clicking the bookmarklet captures the page HTML
3. Opens parser with data in URL hash (`#bookmarklet=<encoded-data>`)
4. `bandlab-parser.js` checks for `#bookmarklet=` hash and processes automatically

## Development Notes

- Static site, no build process required
- Hosted via GitHub Pages
- All processing happens client-side (no server)
- All pages share `/css/style.css` - use absolute paths from root
- Project-specific JS goes in `/js/` with descriptive names
- Navigation should be consistent across all pages (currently shows "Vibe Coding" link)
- Footer shows copyright with current year
