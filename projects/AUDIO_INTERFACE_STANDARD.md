# Audio Interface Standard

Standard interface patterns for audio projects on blakeeboyd.github.io. All audio projects should follow these conventions to maintain consistency across the site.

## Shared CSS

All shared audio styles live in `css/components-audio.css`. Project-specific styles go in `css/projects/<projectName>.css`.

Components defined in `components-audio.css`:
- Play button (`.play-button`)
- Slider controls (`.slider-control`, `.gain-slider`, `.gain-row`, `.gain-text`)
- Control groups (`.control-group`, `.control-label`)
- Progress bar (`.progress-container`, `.progress-bar`, `.progress-fill`, `.time-display`)
- Upload area (`.upload-area`, `.upload-area-compact`, `.upload-label`)
- Source buttons (`.source-buttons`, `.source-button`)
- Action buttons (`.action-button`, `.action-button-primary`, `.action-button-secondary`)
- Demo controls (`.demo-section`, `.demo-button`, `.demo-status`)
- Playback controls (`.playback-controls`, `.playback-divider`)
- Info tooltips (`.info-trigger`, `.info-tooltip`)
- Educational content (`.background-content`)

Projects must not redefine these base styles. Override or extend using project-specific CSS only when the base pattern genuinely does not cover the need.

## Play/Pause Button

Use the `.play-button` class on a `<button>` element with nested play and pause SVG icons.

```html
<button type="button" id="play-button" class="play-button" aria-label="Play audio">
    <svg id="play-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    <svg id="pause-icon" class="hidden" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
</button>
```

### State management

Toggle icon visibility and ARIA label in JavaScript:

```javascript
function updatePlayButton() {
    if (state.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playButton.setAttribute('aria-label', 'Pause audio');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playButton.setAttribute('aria-label', 'Play audio');
    }
}
```

### Requirements
- Always use `type="button"` to prevent form submission
- Always include `aria-label` that updates to reflect the current action
- SVGs must have `aria-hidden="true"`
- Default size is 42px; use `.play-button--large` for 48px
- Space bar must toggle play/pause when no text input is focused

## Progress Bar

Use `.progress-container` wrapping time displays and a `.progress-bar`:

```html
<div class="progress-container">
    <span class="time-display" id="current-time">0:00</span>
    <div id="progress-bar" class="progress-bar">
        <div id="progress-fill" class="progress-fill"></div>
    </div>
    <span class="time-display" id="total-time">0:00</span>
</div>
```

### Seek behavior

Support both mouse click and touch:

```javascript
function getClientX(e) {
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
    return e.clientX;
}

function seekFromEvent(e) {
    var rect = progressBar.getBoundingClientRect();
    var fraction = (getClientX(e) - rect.left) / rect.width;
    seekTo(Math.max(0, Math.min(1, fraction)));
}

progressBar.addEventListener('click', seekFromEvent);
progressBar.addEventListener('touchstart', function(e) {
    e.preventDefault();
    seekFromEvent(e);
}, { passive: false });
```

### Requirements
- Click anywhere on the bar to seek
- Touch events must be supported alongside mouse events
- Time format: `M:SS` (no leading zero on minutes)
- Progress updates via `requestAnimationFrame` for smooth rendering

## Gain Control

Use `.gain-control` wrapping a `.gain-row` with slider and text display:

```html
<div class="gain-control">
    <label class="control-label" for="master-gain">Gain (dB)</label>
    <div class="gain-row">
        <input type="range" id="master-gain" class="gain-slider" min="-70" max="6" value="-12" step="1">
        <span class="gain-text" id="gain-display">-12</span>
    </div>
</div>
```

### Requirements
- Range: `-70` to `0` dB minimum. Projects needing boost may extend to `+6` dB.
- Default value: `-12` dB for file playback, `-24` dB for synthesis
- Display as integer dB (no "dB" suffix in the value display)
- At `-70` dB, treat as silence (`gain = 0`)
- Use `linearRampToValueAtTime` or `setValueAtTime` for gain changes (no direct `.value` assignment during playback to avoid clicks)

### dB-to-linear conversion

```javascript
function dbToLinear(db) {
    if (db <= -70) return 0;
    return Math.pow(10, db / 20);
}
```

## File Upload

Use `.upload-area` for drag-and-drop file input:

```html
<div class="upload-area" id="upload-area">
    <input type="file" id="audio-file-input" accept="audio/*" hidden>
    <label for="audio-file-input" class="upload-label">
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>Drop audio file or click to upload</span>
        <span class="upload-hint">Supports WAV, MP3, OGG, FLAC</span>
    </label>
</div>
```

After upload, show a compact upload button (`.upload-area-compact`) in the playback controls row so the user can replace the file without losing the control layout.

### Requirements
- Support both drag-and-drop and click-to-browse
- Validate file type before decoding
- Show error via `notify()` for invalid files
- Maximum file size check (200MB)
- After successful upload, hide the full upload area and show playback controls
- Compact upload button persists in the playback controls row

### Drag-and-drop events
- `dragover`: prevent default, add `.dragover` class
- `dragleave`: remove `.dragover` class
- `drop`: prevent default, remove `.dragover` class, process file

## Loop Controls

Two patterns are in use, depending on project complexity:

### Simple loop toggle (button)

For projects where loop region selection is unnecessary:

```html
<button type="button" id="loop-toggle" class="loop-toggle" aria-label="Toggle loop" title="Loop">
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="17 1 21 5 17 9"></polyline>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
        <polyline points="7 23 3 19 7 15"></polyline>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
</button>
```

Toggle `.active` class and set `source.loop = state.isLooping`.

### Loop with region (toggle + handles)

For projects needing selectable loop regions:

```html
<div class="loop-controls">
    <label class="toggle-with-label">
        <span class="toggle-label">Loop</span>
        <label class="toggle-switch toggle-switch-sm">
            <input type="checkbox" id="loop-toggle">
            <span class="toggle-slider"></span>
        </label>
    </label>
    <div class="loop-range-inputs" id="loop-range-inputs">
        <input type="text" id="loop-start-input" placeholder="0:00">
        <input type="text" id="loop-end-input" placeholder="0:00">
    </div>
</div>
```

With draggable handles on the progress bar for visual loop region selection.

### Requirements
- Loop state persists across play/pause cycles
- When loop is on, set `AudioBufferSourceNode.loop = true`
- Update loop state on existing source node when toggled during playback

## Source Selection Buttons

Use `.source-buttons` with `.source-button` children:

```html
<div class="source-buttons">
    <button type="button" class="source-button active" data-source="0">Mute</button>
    <button type="button" class="source-button" data-source="1">Pink Noise</button>
    <button type="button" class="source-button" data-source="2">User Audio</button>
</div>
```

### Requirements
- One button active at a time (radio behavior)
- Use `data-source` attribute for value, not the button text
- Active state: `.active` class
- Switching source stops current audio before starting new source

## Keyboard Shortcuts

### Required for all audio projects
- **Space**: Toggle play/pause (only when no text input is focused)

### Guard against input focus

```javascript
document.addEventListener('keydown', function(e) {
    var isTyping = document.activeElement && (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT'
    );
    if (isTyping) return;

    if (e.code === 'Space' && state.audioBuffer) {
        e.preventDefault();
        togglePlayback();
    }
});
```

### Optional shortcuts (document in UI if present)
- **1/2/3**: Source selection
- **Left/Right arrows**: Seek forward/backward
- **Backspace**: Undo (comparison tools)

## Accessibility

### Required
- All buttons: `type="button"` and descriptive `aria-label`
- Play button: ARIA label updates dynamically ("Play audio" / "Pause audio")
- Canvas elements: `aria-label` describing the visualization
- SVG icons: `aria-hidden="true"`
- Info tooltips: `role="tooltip"` on tooltip content
- Focus-visible styles on interactive elements
- Color is never the sole indicator of state (use text labels, icons, or patterns alongside color)

### Info tooltips

```html
<button type="button" class="info-trigger" aria-label="Information about X">
    i
    <span class="info-tooltip" role="tooltip">
        Tooltip content here.
    </span>
</button>
```

Use `.tooltip-left` or `.tooltip-right` for edge-of-viewport positioning.

## Touch Support

### Required for all interactive elements
- Progress bar: mouse click + `touchstart`
- Sliders: native range input (touch handled by browser)
- Buttons: click events (touch handled by browser)
- Canvas interactions (dials, draggable points): `mousedown`/`mousemove`/`mouseup` + `touchstart`/`touchmove`/`touchend`

### Pattern for combined mouse/touch on canvas

```javascript
canvas.addEventListener('mousedown', function(e) {
    state.dragging = true;
    handleInteraction(e);
});
document.addEventListener('mousemove', function(e) {
    if (state.dragging) handleInteraction(e);
});
document.addEventListener('mouseup', function() {
    state.dragging = false;
});

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    state.dragging = true;
    handleInteraction(e);
});
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (state.dragging) handleInteraction(e);
});
canvas.addEventListener('touchend', function() {
    state.dragging = false;
});
```

## Playback Ended Handler

Use a shared handler function rather than inline callbacks on `AudioBufferSourceNode.onended`. This prevents duplicate logic and stale closure bugs:

```javascript
function handlePlaybackEnded() {
    if (!state.isLooping && state.isPlaying) {
        stopAudio();
        state.audioPausedAt = 0;
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    }
}

// Usage:
source.onended = handlePlaybackEnded;
```

## AudioContext Initialization

Lazy-initialize the AudioContext on first user interaction (not on page load) to comply with browser autoplay policies:

```javascript
function ensureAudioContext() {
    if (state.audioContext) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AC();
    // Build audio graph here
}
```

Resume suspended contexts before playback:

```javascript
if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
}
```

## Notifications

Use the global `notify()` function from `js/notify.js` for user feedback:

```javascript
notify('B-format audio loaded: ' + file.name, 'success');
notify('Please upload a WAV or FLAC file.', 'error');
```

Types: `'success'`, `'error'`, `'info'`

## Dark Mode

All audio projects must render correctly in dark mode. The theme is controlled via `data-theme="dark"` on `<html>`.

### Canvas rendering
Canvas elements must detect theme and adjust colors:

```javascript
function getCanvasColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        bg: isDark ? '#1e1e1e' : '#f5f5f5',
        grid: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        text: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
        accent: isDark ? '#60a5fa' : '#2563eb'
    };
}
```

### Theme change observer
Redraw canvases when the theme changes:

```javascript
var themeObserver = new MutationObserver(function() {
    drawVisualization();
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});
```

### Button contrast
In dark mode, `--color-accent` becomes a light blue that has poor contrast with white text. Interactive buttons (play, source, action-primary) use a manual dark mode override of `#3b82f6` for background color. This is already handled in `components-audio.css` and should not be overridden in project CSS.

## Demo Mode

Projects with a demo/auto-demo feature should follow this pattern:

```html
<button id="demo-button" class="action-button action-button-primary">
    <svg class="demo-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    Auto Demo
</button>
<div id="demo-status" class="demo-status hidden">
    <span id="demo-status-text" class="demo-status-text"></span>
</div>
```

### Requirements
- Button toggles between start and stop
- Running state: add `.running` class (changes button to red)
- Status text updates to describe the current demo step
- Demo can be cancelled at any point by clicking the button again
- Demo does not interfere with the audio source (uses existing source or creates its own)

## Project Checklist

When building a new audio project, verify:

- [ ] Shared CSS loaded: `components-audio.css`
- [ ] Project CSS in `css/projects/`
- [ ] `notify.js` loaded before app script
- [ ] Play/pause with ARIA label updates
- [ ] Space bar shortcut with input focus guard
- [ ] Progress bar with click + touch seek
- [ ] Gain slider with dB display
- [ ] File upload with drag-drop and validation
- [ ] Loop control (toggle or region)
- [ ] Compact upload button in playback controls
- [ ] `handlePlaybackEnded` shared function (not inline)
- [ ] Lazy AudioContext initialization
- [ ] Dark mode canvas rendering
- [ ] Theme change observer for canvases
- [ ] Touch support on custom canvas interactions
- [ ] `aria-label` on all buttons and canvases
- [ ] `aria-hidden="true"` on all decorative SVGs
- [ ] Info tooltips with `role="tooltip"`

## Inconsistencies to Resolve

Known deviations from this standard across existing projects. These should be addressed during future work on each project:

| Project | Issue |
|---------|-------|
| Cancelled Harmonics | No progress bar or file upload (synthesis only, acceptable) |
| Cancelled Harmonics | Play button uses `classList.toggle('playing')` instead of separate icon visibility toggling |
| Phase Correlation | Play button uses `classList.toggle('playing')` instead of separate icon visibility toggling |
| Phase Correlation | No loop toggle on user audio playback |
| EQ Training | No direct play/pause button (audio starts with source selection) |
| EQ Training | No progress bar (pink noise is continuous, acceptable for noise source) |
| EQ Training | Canvas drag interaction lacks touch event support |
| Identifying Frequency Bands | Uses RNBO, so audio routing differs from pure Web Audio projects |
