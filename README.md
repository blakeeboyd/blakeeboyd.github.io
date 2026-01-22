# Blake Boyd Personal Website

Personal website hosted on GitHub Pages at [blakeeboyd.github.io](https://blakeeboyd.github.io).

## Features

- Dark/light theme with system preference detection
- Responsive design
- Modular CSS architecture
- Web Component-based navigation

## Projects

### Explorable Explanations

#### Identifying Pitch Registers

An interactive audio tool for learning to identify frequency registers, built for the MUS399 Critical Listening Skills course.

**Features:**
- Three audio sources: Mute, Pink Noise, User Audio (upload)
- Six frequency band filters based on Moylan's EQ bands
- Mute/solo controls for individual bands
- Full playback controls with loop regions
- Built with RNBO (Max/MSP web export) and Web Audio API

[View Project](https://blakeeboyd.github.io/projects/explorable-explanations/identifying-pitch-registers/)

#### Cancelled Harmonics (ASA 1)

Interactive demonstration of Fourier analysis based on the ASA "Cancelled Harmonics" demo.

**Features:**
- 16 harmonic additive synthesizer with toggleable harmonics
- Four waveform presets (sine, triangle, square, sawtooth)
- Real-time scrolling spectrogram visualization
- Auto Demo mode replicating the ASA demonstration sequence
- Random Build mode for fun exploration
- Pure Web Audio API, no external dependencies

[View Project](https://blakeeboyd.github.io/projects/explorable-explanations/cancelled-harmonics/)

### Creative Tools

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
│   └── bandlab-parser.js      # BandLab parser logic
├── images/                    # Site images
└── projects/
    ├── bandlab-parser/
    └── explorable-explanations/
        ├── identifying-pitch-registers/
        └── cancelled-harmonics/
```

## License

Copyright 2025 Blake Boyd
