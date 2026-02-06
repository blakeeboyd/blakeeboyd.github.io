# Reusable Audio & Interactive Patterns

This document catalogs working patterns from across the site's audio projects. Reference these when building new features to avoid reinventing solutions.

## Quick Reference

| Pattern | Best Example | Line Numbers |
|---------|--------------|--------------|
| Audio context setup | stereo-mic-techniques | app.js:171-179 |
| Play/pause toggle | stereo-mic-techniques | app.js:800-808 |
| File upload + decode | stereo-mic-techniques | app.js:533-588 |
| Progress bar seeking | identifying-frequency-bands | app-moylanEQ.js:1032-1095 |
| Gain control (dB) | cancelled-harmonics | app.js:844-847 |
| Canvas DPI scaling | stereo-mic-techniques | app.js:970-982 |
| Theme observer | stereo-mic-techniques | app.js:1510-1514 |
| Demo with abort | cancelled-harmonics | app.js:346-476 |

---

## Audio Playback

### Web Audio Context Setup

```javascript
function ensureAudioContext() {
    if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.masterGain = state.audioContext.createGain();
        state.masterGain.connect(state.audioContext.destination);
    }
}
```

### dB to Linear Conversion

```javascript
function dbToLinear(db) {
    if (db <= -70) return 0;
    return Math.pow(10, db / 20);
}
```

### Smooth Gain Ramping

```javascript
gainNode.gain.setTargetAtTime(
    dbToLinear(newGainDb),
    audioContext.currentTime,
    0.02  // 20ms time constant
);
```

### Time Formatting

```javascript
function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}
```

### Stopping Audio Sources Safely

Always null the `onended` handler before stopping to prevent false triggers:

```javascript
function stopAudio() {
    if (state.audioSource) {
        state.audioSource.onended = null;  // Prevent onended from firing
        try { state.audioSource.stop(); } catch (e) {}
        try { state.audioSource.disconnect(); } catch (e) {}
        state.audioSource = null;
    }
    cancelAnimationFrame(state.progressAnimationId);
    state.isPlaying = false;
    updatePlayButton();
}
```

### Seamless Seeking (No Pause)

When seeking during playback, don't call `stopAudio()` which changes state. Instead:

```javascript
function seekTo(fraction) {
    if (!state.audioBuffer) return;
    var offset = fraction * state.audioDuration;

    if (state.isPlaying) {
        // Remove onended to prevent false trigger
        if (state.audioSource) {
            state.audioSource.onended = null;
            try { state.audioSource.stop(); } catch (e) {}
            try { state.audioSource.disconnect(); } catch (e) {}
            state.audioSource = null;
        }
        cancelAnimationFrame(state.progressAnimationId);

        // Update display immediately
        state.audioPausedAt = offset;
        currentTimeEl.textContent = formatTime(offset);
        progressFill.style.width = (fraction * 100) + '%';

        // Start new source at offset (keeps isPlaying = true)
        startPlayback(offset);
    } else {
        // Not playing: just update position
        state.audioPausedAt = offset;
        currentTimeEl.textContent = formatTime(offset);
        progressFill.style.width = (fraction * 100) + '%';
    }
}
```

### Progress Animation Loop

```javascript
function startProgressUpdate() {
    function update() {
        if (!state.isPlaying) return;

        var elapsed = state.audioContext.currentTime - state.audioStartTime;
        var currentTime = state.audioPausedAt + elapsed;

        if (currentTime >= state.audioDuration) {
            if (state.isLooping) {
                // Handle loop
            } else {
                stopAudio();
                return;
            }
        }

        var fraction = currentTime / state.audioDuration;
        progressFill.style.width = (fraction * 100) + '%';
        currentTimeEl.textContent = formatTime(currentTime);

        state.progressAnimationId = requestAnimationFrame(update);
    }
    state.progressAnimationId = requestAnimationFrame(update);
}
```

---

## File Upload

### Drag & Drop + File Input

```javascript
// Drag events on upload area
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleAudioFile(e.dataTransfer.files[0]);
    }
});

// File input change
fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        handleAudioFile(e.target.files[0]);
    }
});
```

### Audio File Validation & Decoding

```javascript
function handleAudioFile(file) {
    // Validate type
    if (!file.type.startsWith('audio/')) {
        notify('Please upload an audio file.', 'error');
        return;
    }

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
        notify('File too large. Maximum 100MB.', 'error');
        return;
    }

    ensureAudioContext();

    file.arrayBuffer().then(function(arrayBuffer) {
        return state.audioContext.decodeAudioData(arrayBuffer);
    }).then(function(buffer) {
        // Optional: validate channel count
        if (buffer.numberOfChannels !== 4) {
            notify('Expected 4-channel audio.', 'error');
            return;
        }

        state.audioBuffer = buffer;
        state.audioDuration = buffer.duration;
        state.audioPausedAt = 0;

        totalTimeEl.textContent = formatTime(state.audioDuration);
        currentTimeEl.textContent = '0:00';
        progressFill.style.width = '0%';

        enablePlaybackControls();
        notify('Loaded: ' + file.name, 'success');

    }).catch(function(err) {
        notify('Error decoding audio file.', 'error');
        console.error('Audio decode error:', err);
    });
}
```

### Adding User Files to Dropdown

```javascript
// State: userFiles: {}

function addUserFileToDropdown(filename, value) {
    var userGroup = presetSelect.querySelector('optgroup[label="Your Files"]');
    if (!userGroup) {
        userGroup = document.createElement('optgroup');
        userGroup.label = 'Your Files';
        presetSelect.insertBefore(userGroup, presetSelect.querySelector('optgroup'));
    }

    var existingOption = userGroup.querySelector('option[value="' + value + '"]');
    if (!existingOption) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = filename;
        userGroup.appendChild(option);
    }
}

// In handleAudioFile, after decoding:
var userKey = 'user:' + file.name;
state.userFiles[userKey] = buffer;
addUserFileToDropdown(file.name, userKey);
presetSelect.value = userKey;
```

---

## UI Components

### Disabled State (Visible but Non-Interactive)

CSS:
```css
.playback-controls.disabled {
    opacity: 0.4;
    pointer-events: none;
}
```

HTML (initial state):
```html
<div id="playback-controls" class="playback-controls disabled">
    <button id="play-button" disabled>...</button>
</div>
```

JS (enable when ready):
```javascript
function enablePlaybackControls() {
    playbackControls.classList.remove('disabled');
    playButton.disabled = false;
    loopToggle.disabled = false;
}
```

### Progress Bar Click-to-Seek

```javascript
progressBar.addEventListener('click', function(e) {
    if (!state.audioBuffer) return;

    var rect = progressBar.getBoundingClientRect();
    var fraction = (e.clientX - rect.left) / rect.width;
    fraction = Math.max(0, Math.min(1, fraction));

    seekTo(fraction);
});
```

### Slider Fill Visualization

```javascript
function updateSliderFill(slider) {
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var value = parseFloat(slider.value);
    var percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = 'linear-gradient(90deg, #2563eb 0%, #3b82f6 ' +
        percentage + '%, #e5e7eb ' + percentage + '%, #e5e7eb 100%)';
}

// Call on input and on load
slider.addEventListener('input', function() {
    updateSliderFill(slider);
});
```

### Source Button Toggle

```javascript
sourceButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        var source = parseInt(btn.dataset.source, 10);

        // Update active state
        sourceButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Update audio
        switchToSource(source);
    });
});
```

---

## Canvas & Visualization

### DPI Scaling for Sharp Canvas

```javascript
function resizeCanvas() {
    var container = canvas.parentElement;
    var size = Math.min(container.clientWidth, 400);

    var dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
```

### Theme-Aware Colors

```javascript
function getThemeColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        bg: isDark ? '#1e1e1e' : '#f5f5f5',
        text: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
        accent: isDark ? '#60a5fa' : '#2563eb',
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };
}
```

### Theme Change Observer

```javascript
var themeObserver = new MutationObserver(function() {
    drawVisualization();
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});
```

---

## Demo/Auto-Play

### Demo with AbortController

```javascript
var demoController = null;

function sleep(ms, signal) {
    return new Promise(function(resolve, reject) {
        var timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', function() {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
}

async function runDemo() {
    if (demoController) {
        demoController.abort();
        demoController = null;
        restoreDemoState();
        return;
    }

    // Save current state
    var savedState = { /* ... */ };

    demoController = new AbortController();
    var signal = demoController.signal;

    try {
        demoButton.textContent = 'Stop Demo';

        await sleep(1000, signal);
        // Demo step 1...

        await sleep(1000, signal);
        // Demo step 2...

    } catch (e) {
        if (e.name !== 'AbortError') throw e;
    } finally {
        demoController = null;
        demoButton.textContent = 'Auto Demo';
        restoreState(savedState);
    }
}
```

### Demo Status Display

```javascript
function updateDemoStatus(text) {
    demoStatus.textContent = text;
    demoStatus.hidden = false;

    // Flash animation (force reflow)
    demoStatus.style.animation = 'none';
    void demoStatus.offsetWidth;
    demoStatus.style.animation = '';
}

function hideDemoStatus() {
    demoStatus.hidden = true;
}
```

---

## Keyboard Shortcuts

### Space for Play/Pause (Skip When Typing)

```javascript
document.addEventListener('keydown', function(e) {
    var tag = document.activeElement.tagName;
    var isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (isTyping) return;

    if (e.code === 'Space' && state.audioBuffer) {
        e.preventDefault();
        togglePlayback();
    }
});
```

---

## Audio Context Resume

Browser policy requires user gesture to start audio:

```javascript
function resumeContext() {
    if (state.audioContext && state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }
}

// Attach to first user interaction
document.addEventListener('click', resumeContext, { once: true });
document.addEventListener('keydown', resumeContext, { once: true });
```

---

## Per-Source Gain Tracking

When switching between sources (e.g., Pink Noise vs User Audio), remember each source's gain:

```javascript
var state = {
    pinkNoiseGain: -24,
    userAudioGain: -12,
    currentSource: 0  // 0=Mute, 1=Pink Noise, 2=User Audio
};

function switchSource(source) {
    // Save current gain to old source
    if (state.currentSource === 1) {
        state.pinkNoiseGain = parseFloat(gainSlider.value);
    } else if (state.currentSource === 2) {
        state.userAudioGain = parseFloat(gainSlider.value);
    }

    // Load gain for new source
    state.currentSource = source;
    var newGain = source === 1 ? state.pinkNoiseGain :
                  source === 2 ? state.userAudioGain : -12;

    gainSlider.value = newGain;
    gainDisplay.textContent = newGain;
    updateSliderFill(gainSlider);

    // Apply to audio
    applyGain(newGain);
}
```

---

## Common Gotchas

1. **onended fires when stopping**: Always set `source.onended = null` before calling `source.stop()`

2. **AudioContext suspended**: Must resume after user gesture. Call `audioContext.resume()` in click/keydown handler

3. **Seeking pauses audio**: Don't call `stopAudio()` during seek. Stop source directly, then start new source without changing `isPlaying`

4. **Canvas blurry on retina**: Use `devicePixelRatio` scaling with `setTransform()`

5. **Theme colors cached**: Use MutationObserver on `document.documentElement` for `data-theme` changes

6. **Progress bar flicker**: Use `requestAnimationFrame` for smooth updates, not `setInterval`

7. **Gain jumps**: Use `setTargetAtTime()` for smooth transitions, not direct `.value` assignment
