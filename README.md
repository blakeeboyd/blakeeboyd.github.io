# Blake Boyd Personal Website

Personal website hosted on GitHub Pages at [blakeeboyd.github.io](https://blakeeboyd.github.io).

## Features

- Dark/light theme with system preference detection
- Responsive design with mobile hamburger menu
- Modular CSS architecture with CSS custom properties
- Web Component-based navigation
- Accessibility features (aria-controls, proper contrast ratios)

## Projects

### Explorable Explanations

#### Identifying Frequency Bands

An interactive audio tool for learning to identify frequency registers, built for the MUS399 Critical Listening Skills course.

**Features:**
- Three audio sources: Mute, Pink Noise, User Audio (upload)
- Six frequency band filters based on Moylan's EQ bands
- Mute/solo controls for individual bands
- Auto Demo mode (uses user audio if loaded, otherwise pink noise)
- Full playback controls with loop regions
- Built with RNBO (Max/MSP web export) and Web Audio API

[View Project](https://blakeeboyd.github.io/projects/identifying-frequency-bands/)

#### Cancelled Harmonics (ASA 1)

Interactive demonstration of Fourier analysis based on the ASA "Cancelled Harmonics" demo.

**Features:**
- 16 harmonic additive synthesizer with toggleable harmonics
- Four waveform presets (sine, triangle, square, sawtooth)
- Real-time scrolling spectrogram visualization
- Auto Demo mode replicating the ASA demonstration sequence
- Random Build mode for fun exploration
- Pure Web Audio API, no external dependencies

[View Project](https://blakeeboyd.github.io/projects/cancelled-harmonics/)

#### Understanding Phase Correlation

Interactive demonstration of stereo phase correlation with a real-time correlation meter.

**Features:**
- Four phase scenarios (correlated/uncorrelated × same/inverted polarity)
- Real-time stereo correlation meter visualization
- Stereo/Mono output mode toggle
- User audio upload with stereo support
- Pure Web Audio API, no external dependencies

[View Project](https://blakeeboyd.github.io/projects/understanding-phase-correlation/)

### Ear Training

#### EQ Matching

Gamified ear training for matching hidden EQ curves.

**Features:**
- 4-band parametric EQ with graphical canvas interface
- Draggable control points for frequency/gain adjustment
- A/B comparison between Target EQ, User EQ, and Bypass
- Scoring system with streak tracking
- Pink noise or user-uploaded audio sources

[View Project](https://blakeeboyd.github.io/projects/eq-training/)

### Creative Tools

#### PechaKucha Player

A web-based presentation player for the PechaKucha format (auto-advancing slides).

**Features:**
- Drag-and-drop image upload with reordering
- Configurable slide duration (default 20 seconds)
- Practice mode (single-screen fullscreen) and Present mode (dual-screen with presenter view)
- Speaker notes per slide with optional per-slide duration overrides
- Title slide support (untimed intro slide)
- Audio countdown cues
- Export/import presentation settings as JSON
- Real-time timer with progress indication

[View Project](https://blakeeboyd.github.io/projects/pechakucha-player/)

#### BandLab JSON Parser

A browser-based tool for parsing BandLab sample pack pages into structured JSON metadata.

**Features:**
- File upload for saved HTML files
- One-click bookmarklet for parsing while browsing
- Automatic extraction of BPM, key, duration, and sample info

[View Project](https://blakeeboyd.github.io/projects/bandlab-parser/)

## Development

This is a static site with no build process required. Simply open `index.html` in a browser or serve with any static file server.

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### Project Structure

```
/
├── index.html                 # Landing page
├── about.html                 # About page
├── projects.html              # Projects listing
├── contact.html               # Contact form
├── css/
│   ├── base.css               # Variables, resets, typography
│   ├── layout.css             # Header, nav, footer, containers
│   ├── components.css         # Cards, forms, buttons
│   └── projects/              # Project-specific styles
├── js/
│   ├── theme.js               # Dark mode toggle
│   ├── nav-component.js       # Navigation web component
│   ├── contact-form.js        # Contact form handler
│   └── bandlab-parser.js      # BandLab parser logic
├── images/                    # Site images
└── projects/
    ├── bandlab-parser/
    ├── cancelled-harmonics/
    ├── eq-training/
    ├── identifying-frequency-bands/
    ├── modular-synth/
    ├── pairwise-matrix/
    ├── pechakucha-player/
    ├── round-robin-timer/
    ├── stereo-mic-techniques/
    ├── textgarden/
    └── understanding-phase-correlation/
```

## License

Copyright 2025 Blake Boyd
