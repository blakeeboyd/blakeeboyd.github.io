/**
 * Cancelled Harmonics - Interactive Fourier Analysis Demo
 *
 * Generates a complex tone with 20 harmonics using Web Audio API.
 * Users can toggle individual harmonics and observe spectral changes
 * in a real-time scrolling spectrogram.
 */

// ===== STATE MANAGEMENT =====
const state = {
    audioContext: null,
    masterGain: null,
    analyser: null,
    harmonics: [], // Array of { oscillator, gainNode, baseAmplitude, enabled, harmonicNumber }
    harmonicStates: [], // Preserved enabled states across restarts
    harmonicAmplitudes: [], // Base amplitudes for current waveform
    isPlaying: false,
    fundamentalFreq: 200,
    numHarmonics: 20,
    animationId: null,
    maxDisplayFreq: 8000, // Hz (covers 16th harmonic of 500 Hz fundamental)
    autoDemoRunning: false,
    autoDemoAbortController: null,
    currentWaveform: 'sawtooth'
};

// Waveform amplitude formulas
// Sawtooth: all harmonics, amplitude = 1/n
// Square: odd harmonics only, amplitude = 1/n
// Triangle: odd harmonics only, amplitude = 1/n² (alternating sign, but we use absolute)
// Sine: fundamental only
function getWaveformAmplitudes(waveform, numHarmonics) {
    const amplitudes = [];
    for (let n = 1; n <= numHarmonics; n++) {
        let amp = 0;
        switch (waveform) {
            case 'sine':
                amp = (n === 1) ? 1 : 0;
                break;
            case 'triangle':
                // Odd harmonics only, amplitude = 1/n²
                amp = (n % 2 === 1) ? 1 / (n * n) : 0;
                break;
            case 'square':
                // Odd harmonics only, amplitude = 1/n
                amp = (n % 2 === 1) ? 1 / n : 0;
                break;
            case 'sawtooth':
            default:
                // All harmonics, amplitude = 1/n
                amp = 1 / n;
                break;
        }
        amplitudes.push(amp);
    }
    return amplitudes;
}

// ===== INITIALIZATION =====
function init() {
    // Initialize harmonic states (all enabled by default)
    for (let i = 0; i < state.numHarmonics; i++) {
        state.harmonicStates.push(true);
    }

    // Initialize amplitudes for default waveform (sawtooth)
    state.harmonicAmplitudes = getWaveformAmplitudes(state.currentWaveform, state.numHarmonics);

    createHarmonicButtons();
    setupEventListeners();
    setupSpectrogram();
}

// ===== AUDIO SETUP =====
function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContext();

    // Create master gain node
    state.masterGain = state.audioContext.createGain();
    const initialDb = parseFloat(document.getElementById('master-gain').value);
    state.masterGain.gain.value = dbToLinear(initialDb);

    // Create analyser for spectrogram
    state.analyser = state.audioContext.createAnalyser();
    const fftSize = parseInt(document.getElementById('fft-size').value);
    state.analyser.fftSize = fftSize;
    state.analyser.smoothingTimeConstant = 0.8;

    // Connect: masterGain -> analyser -> destination
    state.masterGain.connect(state.analyser);
    state.analyser.connect(state.audioContext.destination);
}

function createHarmonics() {
    // Clear existing harmonics
    state.harmonics.forEach(h => {
        if (h.oscillator) {
            try {
                h.oscillator.stop();
                h.oscillator.disconnect();
            } catch (e) {
                // Oscillator may already be stopped
            }
        }
        if (h.gainNode) {
            h.gainNode.disconnect();
        }
    });
    state.harmonics = [];

    for (let n = 1; n <= state.numHarmonics; n++) {
        // Create oscillator for harmonic n
        const oscillator = state.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = state.fundamentalFreq * n;

        // Create gain node for this harmonic
        // Use amplitude from current waveform
        const gainNode = state.audioContext.createGain();
        const baseAmplitude = state.harmonicAmplitudes[n - 1];

        // Apply current enabled state
        const isEnabled = state.harmonicStates[n - 1];
        gainNode.gain.value = isEnabled ? baseAmplitude : 0;

        // Connect oscillator -> gain -> master
        oscillator.connect(gainNode);
        gainNode.connect(state.masterGain);

        state.harmonics.push({
            oscillator,
            gainNode,
            baseAmplitude,
            enabled: isEnabled,
            harmonicNumber: n
        });
    }
}

function startAudio() {
    if (!state.audioContext) {
        createAudioContext();
    }

    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }

    // Reset master gain to current slider value (may have been ramped to 0)
    const currentDb = parseFloat(document.getElementById('master-gain').value);
    state.masterGain.gain.value = dbToLinear(currentDb);

    createHarmonics();

    // Start all oscillators
    state.harmonics.forEach(h => {
        h.oscillator.start();
    });

    state.isPlaying = true;
    startSpectrogram();
    updatePlayButton();
}

function stopAudio() {
    state.harmonics.forEach(h => {
        if (h.oscillator) {
            try {
                h.oscillator.stop();
                h.oscillator.disconnect();
            } catch (e) {
                // Oscillator may already be stopped
            }
        }
        if (h.gainNode) {
            h.gainNode.disconnect();
        }
    });
    state.harmonics = [];
    state.isPlaying = false;
    stopSpectrogram();
    updatePlayButton();
}

// ===== HARMONIC CONTROL =====
function toggleHarmonic(index) {
    // Update preserved state
    state.harmonicStates[index] = !state.harmonicStates[index];
    const isEnabled = state.harmonicStates[index];

    // If playing, update the actual audio
    if (state.isPlaying && state.harmonics[index]) {
        const harmonic = state.harmonics[index];
        harmonic.enabled = isEnabled;

        // Smooth gain transition to avoid clicks
        const targetGain = isEnabled ? harmonic.baseAmplitude : 0;
        harmonic.gainNode.gain.setTargetAtTime(
            targetGain,
            state.audioContext.currentTime,
            0.02 // 20ms time constant for smooth transition
        );
    }

    updateHarmonicButton(index);
}

function enableAllHarmonics() {
    for (let i = 0; i < state.numHarmonics; i++) {
        state.harmonicStates[i] = true;

        if (state.isPlaying && state.harmonics[i]) {
            const h = state.harmonics[i];
            h.enabled = true;
            h.gainNode.gain.setTargetAtTime(
                h.baseAmplitude,
                state.audioContext.currentTime,
                0.02
            );
        }

        updateHarmonicButton(i);
    }
}

function disableAllHarmonics() {
    for (let i = 0; i < state.numHarmonics; i++) {
        state.harmonicStates[i] = false;

        if (state.isPlaying && state.harmonics[i]) {
            const h = state.harmonics[i];
            h.enabled = false;
            h.gainNode.gain.setTargetAtTime(
                0,
                state.audioContext.currentTime,
                0.02
            );
        }

        updateHarmonicButton(i);
    }
}

// ===== WAVEFORM SELECTION =====
function setWaveform(waveform) {
    state.currentWaveform = waveform;
    state.harmonicAmplitudes = getWaveformAmplitudes(waveform, state.numHarmonics);

    // Update UI buttons
    document.querySelectorAll('.wave-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`wave-${waveform}`).classList.add('active');

    // Update harmonic buttons to show new amplitudes
    createHarmonicButtons();

    // If playing, update the actual gain values
    if (state.isPlaying) {
        for (let i = 0; i < state.numHarmonics; i++) {
            const harmonic = state.harmonics[i];
            harmonic.baseAmplitude = state.harmonicAmplitudes[i];
            const targetGain = state.harmonicStates[i] ? harmonic.baseAmplitude : 0;
            harmonic.gainNode.gain.setTargetAtTime(
                targetGain,
                state.audioContext.currentTime,
                0.02
            );
        }
    }
}

// ===== AUTO DEMO =====
// Timing constants (in milliseconds)
const DEMO_TIMING = {
    fullTone: 1000,       // Full tone with all harmonics (1 second)
    harmonicOut: 1000,    // Harmonic pulled out/muted (1 second)
    silence: 1000,        // Silence between demonstrations (1 second)
    initialPause: 1500    // Initial pause before demo starts
};

/**
 * Programmatically set a harmonic's state (used by auto demo)
 * @param {number} index - Harmonic index (0-based)
 * @param {boolean} enabled - Whether to enable or disable
 */
function setHarmonicState(index, enabled) {
    state.harmonicStates[index] = enabled;

    if (state.isPlaying && state.harmonics[index]) {
        const harmonic = state.harmonics[index];
        harmonic.enabled = enabled;

        const targetGain = enabled ? harmonic.baseAmplitude : 0;
        harmonic.gainNode.gain.setTargetAtTime(
            targetGain,
            state.audioContext.currentTime,
            0.02
        );
    }

    updateHarmonicButton(index);
}

/**
 * Mute or unmute all audio by setting master gain
 * @param {boolean} muted - Whether to mute
 */
function setMasterMute(muted) {
    if (state.masterGain && state.audioContext) {
        const db = parseFloat(document.getElementById('master-gain').value);
        const targetGain = muted ? 0 : dbToLinear(db);
        state.masterGain.gain.setTargetAtTime(
            targetGain,
            state.audioContext.currentTime,
            0.02
        );
    }
}

/**
 * Sleep helper that can be aborted
 * @param {number} ms - Milliseconds to sleep
 * @param {AbortSignal} signal - Abort signal to cancel sleep
 */
function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
}

// State saved before auto demo starts
let preDemoState = null;

/**
 * Run the ASA demonstration sequence
 * - All 20 harmonics are enabled for the full tone
 * - Toggles harmonics 1-10 on/off 3 times each
 * - For each harmonic: toggle on/off 3 times, then silence
 */
async function runAutoDemo() {
    if (state.autoDemoRunning) {
        // Stop the demo if already running
        stopAutoDemo();
        return;
    }

    // Save current state before demo
    preDemoState = {
        harmonicStates: [...state.harmonicStates],
        waveform: state.currentWaveform
    };

    // Create abort controller for this demo run
    state.autoDemoAbortController = new AbortController();
    const signal = state.autoDemoAbortController.signal;

    state.autoDemoRunning = true;
    updateAutoDemoButton();

    // Switch to sawtooth waveform (demo requires all harmonics)
    setWaveform('sawtooth');

    // Disable waveform buttons during demo
    setWaveformButtonsEnabled(false);

    try {
        // Start audio if not already playing
        if (!state.isPlaying) {
            startAudio();
        }

        // Setup: Enable all 20 harmonics for full tone
        for (let i = 0; i < state.numHarmonics; i++) {
            setHarmonicState(i, true);
        }

        // Initial pause to let user hear the full tone
        await sleep(DEMO_TIMING.initialPause, signal);

        // Process harmonics 1-10
        // Harmonic 1: (out, in) x3
        // Harmonics 2-10: full tone first, then (out, in) x3
        for (let harmonicIndex = 0; harmonicIndex < 10; harmonicIndex++) {
            // For harmonics 2-10, start by hearing the full tone with all harmonics
            if (harmonicIndex > 0) {
                await sleep(DEMO_TIMING.fullTone, signal);
            }

            // Toggle this harmonic 3 times (out, in, out, in, out, in)
            for (let toggle = 0; toggle < 3; toggle++) {
                // Pull out (mute) this harmonic
                setHarmonicState(harmonicIndex, false);
                await sleep(DEMO_TIMING.harmonicOut, signal);

                // Put the harmonic back in
                setHarmonicState(harmonicIndex, true);
                await sleep(DEMO_TIMING.fullTone, signal);
            }

            // Silence before next harmonic
            if (harmonicIndex < 9) {
                setMasterMute(true);
                await sleep(DEMO_TIMING.silence, signal);
                setMasterMute(false);
            }
        }

        // Demo complete - ramp down and stop
        state.autoDemoRunning = false;
        state.autoDemoAbortController = null;
        updateAutoDemoButton();
        setWaveformButtonsEnabled(true);

        // Ramp down master gain to avoid click, then stop and restore
        if (state.isPlaying && state.masterGain && state.audioContext) {
            state.masterGain.gain.setTargetAtTime(
                0,
                state.audioContext.currentTime,
                0.05
            );
            setTimeout(() => {
                stopAudio();
                restorePreDemoState();
            }, 100);
        } else {
            restorePreDemoState();
        }

    } catch (e) {
        if (e.name === 'AbortError') {
            // Demo was stopped by user - handled by stopAutoDemo
        } else {
            console.error('Auto demo error:', e);
            state.autoDemoRunning = false;
            state.autoDemoAbortController = null;
            updateAutoDemoButton();
            setWaveformButtonsEnabled(true);
            restorePreDemoState();
        }
    }
}

/**
 * Stop the auto demo if running
 */
function stopAutoDemo() {
    if (state.autoDemoAbortController) {
        state.autoDemoAbortController.abort();
    }
    state.autoDemoRunning = false;
    state.autoDemoAbortController = null;
    updateAutoDemoButton();
    setWaveformButtonsEnabled(true);

    // Ramp down master gain to avoid click, then stop audio
    if (state.isPlaying && state.masterGain && state.audioContext) {
        state.masterGain.gain.setTargetAtTime(
            0,
            state.audioContext.currentTime,
            0.05 // 50ms ramp down
        );
        // Wait for ramp to complete before stopping
        setTimeout(() => {
            stopAudio();
            restorePreDemoState();
        }, 100);
    } else {
        restorePreDemoState();
    }
}

/**
 * Restore harmonic states and waveform from before the demo
 */
function restorePreDemoState() {
    if (!preDemoState) return;

    // Restore waveform
    setWaveform(preDemoState.waveform);

    // Restore harmonic states
    for (let i = 0; i < state.numHarmonics; i++) {
        state.harmonicStates[i] = preDemoState.harmonicStates[i];
        updateHarmonicButton(i);
    }

    preDemoState = null;
}

/**
 * Enable or disable waveform selection buttons
 * @param {boolean} enabled - Whether buttons should be enabled
 */
function setWaveformButtonsEnabled(enabled) {
    document.querySelectorAll('.wave-button').forEach(btn => {
        btn.disabled = !enabled;
    });
}

/**
 * Update the auto demo button appearance
 */
function updateAutoDemoButton() {
    const button = document.getElementById('auto-demo');
    if (button) {
        if (state.autoDemoRunning) {
            button.textContent = 'Stop Demo';
            button.classList.add('running');
        } else {
            button.textContent = 'Auto Demo';
            button.classList.remove('running');
        }
    }
}

// ===== RANDOM BUILD =====
// State for random build
let randomBuildRunning = false;
let randomBuildAbortController = null;

/**
 * Run the random build sequence
 * - Switches to sawtooth, disables all harmonics
 * - Randomly enables harmonics one by one with 0.5-1.5s delays
 * - After all are in, waits 2s then stops audio
 */
async function runRandomBuild() {
    if (randomBuildRunning) {
        stopRandomBuild();
        return;
    }

    // Save current state before demo
    preDemoState = {
        harmonicStates: [...state.harmonicStates],
        waveform: state.currentWaveform
    };

    randomBuildAbortController = new AbortController();
    const signal = randomBuildAbortController.signal;

    randomBuildRunning = true;
    updateRandomBuildButton();

    // Switch to sawtooth waveform
    setWaveform('sawtooth');
    setWaveformButtonsEnabled(false);

    // Disable all harmonics BEFORE starting audio to prevent brief sound
    for (let i = 0; i < state.numHarmonics; i++) {
        state.harmonicStates[i] = false;
        updateHarmonicButton(i);
    }

    try {
        // Start audio (with all harmonics already disabled)
        if (!state.isPlaying) {
            startAudio();
        }

        // Create shuffled array of harmonic indices
        const indices = Array.from({ length: state.numHarmonics }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Enable the first harmonic immediately
        const firstIndex = indices.shift();
        setHarmonicState(firstIndex, true);

        // Enable remaining harmonics one by one with random delays
        for (const index of indices) {
            // Random delay between 0.5 and 1.5 seconds
            const delay = 500 + Math.random() * 1000;
            await sleep(delay, signal);

            setHarmonicState(index, true);
        }

        // Wait 5 seconds with full tone
        await sleep(5000, signal);

        // Demo complete
        randomBuildRunning = false;
        randomBuildAbortController = null;
        updateRandomBuildButton();
        setWaveformButtonsEnabled(true);

        // Ramp down and stop
        if (state.isPlaying && state.masterGain && state.audioContext) {
            state.masterGain.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.05);
            setTimeout(() => {
                stopAudio();
                restorePreDemoState();
            }, 100);
        } else {
            restorePreDemoState();
        }

    } catch (e) {
        if (e.name === 'AbortError') {
            // Stopped by user
        } else {
            console.error('Random build error:', e);
            randomBuildRunning = false;
            randomBuildAbortController = null;
            updateRandomBuildButton();
            setWaveformButtonsEnabled(true);
            restorePreDemoState();
        }
    }
}

/**
 * Stop the random build if running
 */
function stopRandomBuild() {
    if (randomBuildAbortController) {
        randomBuildAbortController.abort();
    }
    randomBuildRunning = false;
    randomBuildAbortController = null;
    updateRandomBuildButton();
    setWaveformButtonsEnabled(true);

    if (state.isPlaying && state.masterGain && state.audioContext) {
        state.masterGain.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.05);
        setTimeout(() => {
            stopAudio();
            restorePreDemoState();
        }, 100);
    } else {
        restorePreDemoState();
    }
}

/**
 * Update the random build button appearance
 */
function updateRandomBuildButton() {
    const button = document.getElementById('random-build');
    if (button) {
        if (randomBuildRunning) {
            button.textContent = 'Stop Build';
            button.classList.add('running');
        } else {
            button.textContent = 'Random Build';
            button.classList.remove('running');
        }
    }
}

// ===== SPECTROGRAM =====
function setupSpectrogram() {
    const canvas = document.getElementById('spectrogram');
    const container = canvas.parentElement;

    // Set canvas size based on container
    const resize = () => {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 300;
        updateFrequencyAxis();
    };

    resize();
    window.addEventListener('resize', resize);

    // Clear canvas with black
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateFrequencyAxis() {
    const axis = document.getElementById('frequency-axis');
    axis.innerHTML = '';

    // Create frequency labels (0-8kHz range)
    const frequencies = [8000, 6000, 4000, 2000, 0];
    frequencies.forEach(freq => {
        const label = document.createElement('span');
        label.className = 'freq-label';
        label.textContent = freq >= 1000 ? `${freq/1000}k` : freq;
        axis.appendChild(label);
    });
}

function startSpectrogram() {
    if (!state.analyser) return;

    const canvas = document.getElementById('spectrogram');
    const ctx = canvas.getContext('2d');
    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Calculate pixel width for scrolling spectrogram
    const scrollSpeed = 2; // pixels per frame

    function draw() {
        state.animationId = requestAnimationFrame(draw);

        state.analyser.getByteFrequencyData(dataArray);

        // Shift existing content left
        const imageData = ctx.getImageData(scrollSpeed, 0, canvas.width - scrollSpeed, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        // Calculate frequency range
        const sampleRate = state.audioContext.sampleRate;
        const maxFreq = sampleRate / 2;
        const maxBin = Math.floor((state.maxDisplayFreq / maxFreq) * bufferLength);

        // Draw new column on the right
        for (let i = 0; i < maxBin; i++) {
            const value = dataArray[i];
            // Map bin index to y position (invert so low freq at bottom)
            const y = canvas.height - (i / maxBin) * canvas.height;
            const barHeight = canvas.height / maxBin;

            // Color mapping
            const color = getSpectrogramColor(value);
            ctx.fillStyle = color;
            ctx.fillRect(canvas.width - scrollSpeed, y - barHeight, scrollSpeed, barHeight + 1);
        }
    }

    draw();
}

function stopSpectrogram() {
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
}

function getSpectrogramColor(value) {
    // HSL-based color mapping for better visibility
    // 0 = dark/black, 255 = bright red/yellow
    if (value < 10) {
        return '#0a0a0a'; // Background for very low values
    }

    // Normalize value to 0-1
    const normalized = (value - 10) / 245;

    // Color gradient: blue -> cyan -> green -> yellow -> red
    const hue = 240 - normalized * 240; // 240 (blue) to 0 (red)
    const saturation = 100;
    const lightness = 10 + normalized * 45; // 10% to 55%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// ===== UI HELPERS =====
function createHarmonicButtons() {
    const grid = document.getElementById('harmonics-grid');
    grid.innerHTML = '';

    for (let n = 1; n <= state.numHarmonics; n++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.harmonic = n;

        const freq = state.fundamentalFreq * n;
        const freqDisplay = freq >= 1000 ? `${(freq/1000).toFixed(1)}k` : freq;

        // Format amplitude display based on waveform
        const amp = state.harmonicAmplitudes[n - 1];
        let ampDisplay;
        if (amp === 0) {
            ampDisplay = '0';
        } else if (amp === 1) {
            ampDisplay = '1';
        } else if (state.currentWaveform === 'triangle' && n % 2 === 1) {
            ampDisplay = `1/${n}²`;
        } else {
            ampDisplay = `1/${n}`;
        }

        // Determine if this harmonic is available in the current waveform
        const isAvailable = amp > 0;
        const isActive = state.harmonicStates[n - 1] && isAvailable;

        // Build class name
        let className = 'harmonic-button';
        if (isActive) className += ' active';
        if (!isAvailable) className += ' unavailable';
        button.className = className;

        // Disable button if harmonic is not available in this waveform
        if (!isAvailable) {
            button.disabled = true;
        }

        button.innerHTML = `
            <span class="harmonic-number">${n}</span>
            <span class="harmonic-freq">${freqDisplay} Hz</span>
            <span class="harmonic-amp">${ampDisplay}</span>
        `;

        button.addEventListener('click', () => {
            // Only toggle if harmonic is available
            if (isAvailable) {
                toggleHarmonic(n - 1);
            }
        });
        grid.appendChild(button);
    }
}

function updateHarmonicButton(index) {
    const button = document.querySelector(`[data-harmonic="${index + 1}"]`);
    if (button) {
        const amp = state.harmonicAmplitudes[index];
        const isAvailable = amp > 0;
        const isActive = state.harmonicStates[index] && isAvailable;

        button.classList.toggle('active', isActive);
        button.classList.toggle('unavailable', !isAvailable);
        button.disabled = !isAvailable;
    }
}

function updatePlayButton() {
    const button = document.getElementById('play-button');
    if (state.isPlaying) {
        button.classList.add('playing');
        button.setAttribute('aria-label', 'Stop audio');
    } else {
        button.classList.remove('playing');
        button.setAttribute('aria-label', 'Start audio');
    }
}

function dbToLinear(db) {
    if (db <= -70) return 0;
    return Math.pow(10, db / 20);
}

function updateFundamentalFrequency(newFreq) {
    state.fundamentalFreq = newFreq;

    // Update button labels
    createHarmonicButtons();

    // If playing, update oscillator frequencies
    if (state.isPlaying) {
        state.harmonics.forEach((h, i) => {
            const targetFreq = state.fundamentalFreq * (i + 1);
            h.oscillator.frequency.setTargetAtTime(
                targetFreq,
                state.audioContext.currentTime,
                0.02
            );
        });
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Play button
    document.getElementById('play-button').addEventListener('click', () => {
        if (state.isPlaying) {
            stopAudio();
        } else {
            startAudio();
        }
    });

    // Master gain
    const gainSlider = document.getElementById('master-gain');
    const gainDisplay = document.getElementById('gain-display');
    gainSlider.addEventListener('input', (e) => {
        const db = parseFloat(e.target.value);
        gainDisplay.textContent = db;
        if (state.masterGain) {
            state.masterGain.gain.setTargetAtTime(
                dbToLinear(db),
                state.audioContext.currentTime,
                0.02
            );
        }
    });

    // Fundamental frequency (slider and input synced)
    const freqSlider = document.getElementById('fundamental-freq-slider');
    const freqInput = document.getElementById('fundamental-freq-input');

    // Slider updates input and frequency
    freqSlider.addEventListener('input', (e) => {
        const newFreq = parseFloat(e.target.value);
        freqInput.value = newFreq;
        updateFundamentalFrequency(newFreq);
    });

    // Input updates slider and frequency
    freqInput.addEventListener('input', (e) => {
        let newFreq = parseFloat(e.target.value);
        if (isNaN(newFreq)) return;
        // Clamp to valid range
        newFreq = Math.max(50, Math.min(500, newFreq));
        freqSlider.value = newFreq;
        updateFundamentalFrequency(newFreq);
    });

    // On blur, ensure value is clamped and displayed correctly
    freqInput.addEventListener('blur', (e) => {
        let newFreq = parseFloat(e.target.value);
        if (isNaN(newFreq)) newFreq = 200;
        newFreq = Math.max(50, Math.min(500, newFreq));
        e.target.value = newFreq;
        freqSlider.value = newFreq;
    });

    // Enable/Disable all
    document.getElementById('enable-all').addEventListener('click', enableAllHarmonics);
    document.getElementById('disable-all').addEventListener('click', disableAllHarmonics);

    // Waveform selection
    document.getElementById('wave-sine').addEventListener('click', () => setWaveform('sine'));
    document.getElementById('wave-triangle').addEventListener('click', () => setWaveform('triangle'));
    document.getElementById('wave-square').addEventListener('click', () => setWaveform('square'));
    document.getElementById('wave-sawtooth').addEventListener('click', () => setWaveform('sawtooth'));

    // Auto Demo
    document.getElementById('auto-demo').addEventListener('click', runAutoDemo);

    // Random Build
    document.getElementById('random-build').addEventListener('click', runRandomBuild);

    // FFT size
    document.getElementById('fft-size').addEventListener('change', (e) => {
        if (state.analyser) {
            state.analyser.fftSize = parseInt(e.target.value);
        }
    });

    // Resume audio context on any user interaction (browser requirement)
    const resumeContext = () => {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    };

    document.addEventListener('click', resumeContext, { once: true });
    document.addEventListener('keydown', resumeContext, { once: true });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
