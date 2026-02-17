/**
 * Filter Identification - Ear Training Tool
 * Train your ears to identify filter types, frequencies, and gain.
 *
 * Audio Architecture:
 * Source (Pink Noise / User Audio)
 *   → sourceGain
 *     → BiquadFilter(s) → filterGain ──→ masterGain → destination
 *     → bypassGain ───────────────────┘
 *
 * HP/LP filters cascade 1-4 BiquadFilterNodes for 12/24/48 dB/oct slopes.
 * Shelf filters use IIRFilterNode with Audio EQ Cookbook coefficients (adjustable slope S).
 * Peaking uses a single BiquadFilterNode with adjustable bandwidth (Q).
 */

// ============================================
// Constants
// ============================================

const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000, 16000];
const GAINS = [-12, -6, -3, 3, 6, 12];
const FILTER_TYPES = ['highpass', 'lowpass', 'highshelf', 'lowshelf', 'peaking'];
const PASS_FILTERS = ['highpass', 'lowpass']; // No gain parameter

// Bandwidth Q formula: Q = 1 / (2 * sinh(ln(2)/2 * BW))
function bwToQ(octaves) {
    return 1 / (2 * Math.sinh(Math.LN2 / 2 * octaves));
}

// Defaults
const DEFAULT_PEAKING_BW = 2;    // octaves → Q ≈ 0.667
const DEFAULT_SHELF_S = 1;       // Shelf slope (S=1 is standard; >1 steeper with resonance)
const DEFAULT_PASS_SLOPE = 12;   // dB/oct (single 2nd-order filter)
const SHELF_FILTERS = ['highshelf', 'lowshelf'];

// Butterworth Q values per stage for maximally-flat (no resonance bump) response.
// Each 2nd-order stage in a higher-order Butterworth filter needs a specific Q
// derived from the Butterworth polynomial. Using identical Q=0.707 per stage
// causes a resonance bump near cutoff.
const BUTTERWORTH_Q = {
    1: [0.7071],                               // 2nd order (12 dB/oct)
    2: [0.5412, 1.3066],                       // 4th order (24 dB/oct)
    4: [0.5098, 0.6013, 0.8999, 2.5628]        // 8th order (48 dB/oct)
};

/**
 * Compute IIR coefficients for shelf filters using the Audio EQ Cookbook.
 * BiquadFilterNode ignores Q for shelf types (hardcoded S=1), so we use
 * IIRFilterNode with manually computed coefficients to control shelf slope.
 *
 * @param {string} type - 'lowshelf' or 'highshelf'
 * @param {number} freq - Cutoff frequency in Hz
 * @param {number} gainDb - Gain in dB
 * @param {number} S - Shelf slope parameter (1 = standard, >1 steeper, <1 gentler)
 * @param {number} sampleRate - Audio sample rate
 * @returns {{ feedforward: number[], feedback: number[] }}
 */
function computeShelfCoefficients(type, freq, gainDb, S, sampleRate) {
    var A = Math.pow(10, gainDb / 40);
    var w0 = 2 * Math.PI * freq / sampleRate;
    var cosw0 = Math.cos(w0);
    var sinw0 = Math.sin(w0);
    var alpha = (sinw0 / 2) * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2);
    var sqrtA2alpha = 2 * Math.sqrt(A) * alpha;

    var b0, b1, b2, a0, a1, a2;

    if (type === 'lowshelf') {
        b0 =     A * ((A + 1) - (A - 1) * cosw0 + sqrtA2alpha);
        b1 = 2 * A * ((A - 1) - (A + 1) * cosw0);
        b2 =     A * ((A + 1) - (A - 1) * cosw0 - sqrtA2alpha);
        a0 =          (A + 1) + (A - 1) * cosw0 + sqrtA2alpha;
        a1 =    -2 * ((A - 1) + (A + 1) * cosw0);
        a2 =          (A + 1) + (A - 1) * cosw0 - sqrtA2alpha;
    } else {
        // highshelf
        b0 =     A * ((A + 1) + (A - 1) * cosw0 + sqrtA2alpha);
        b1 = -2 * A * ((A - 1) + (A + 1) * cosw0);
        b2 =     A * ((A + 1) + (A - 1) * cosw0 - sqrtA2alpha);
        a0 =          (A + 1) - (A - 1) * cosw0 + sqrtA2alpha;
        a1 =     2 * ((A - 1) - (A + 1) * cosw0);
        a2 =          (A + 1) - (A - 1) * cosw0 - sqrtA2alpha;
    }

    return {
        feedforward: [b0 / a0, b1 / a0, b2 / a0],
        feedback: [1, a1 / a0, a2 / a0]
    };
}

/**
 * Compute the frequency response of a set of IIR coefficients.
 * Returns magnitude (linear) at each frequency in freqArray.
 */
function computeIIRFrequencyResponse(feedforward, feedback, freqArray, sampleRate) {
    var mag = new Float32Array(freqArray.length);
    for (var i = 0; i < freqArray.length; i++) {
        var w = 2 * Math.PI * freqArray[i] / sampleRate;
        // Numerator: b0 + b1*e^(-jw) + b2*e^(-j2w)
        var numRe = feedforward[0] + feedforward[1] * Math.cos(w) + feedforward[2] * Math.cos(2 * w);
        var numIm = -feedforward[1] * Math.sin(w) - feedforward[2] * Math.sin(2 * w);
        // Denominator: 1 + a1*e^(-jw) + a2*e^(-j2w)
        var denRe = feedback[0] + feedback[1] * Math.cos(w) + feedback[2] * Math.cos(2 * w);
        var denIm = -feedback[1] * Math.sin(w) - feedback[2] * Math.sin(2 * w);
        // |H(w)| = |num| / |den|
        var numMag = Math.sqrt(numRe * numRe + numIm * numIm);
        var denMag = Math.sqrt(denRe * denRe + denIm * denIm);
        mag[i] = numMag / denMag;
    }
    return mag;
}

// Test sequence durations (seconds)
const TEST_BYPASS_1 = 4;
const TEST_FILTER = 5;
const TEST_BYPASS_2 = 4;
const TEST_TOTAL = TEST_BYPASS_1 + TEST_FILTER + TEST_BYPASS_2;

// ============================================
// Quiz Drills
// ============================================

/**
 * Each drill defines a constrained question pool.
 * - types: which filter types to include
 * - freqs: which frequencies to pick from (null = all)
 * - gains: which gain values to pick from (null = all, for shelf/peaking)
 * - fixedFreq: lock frequency to this value (user doesn't guess it)
 * - fixedGain: lock gain magnitude (user guesses boost vs cut only)
 * - guessFields: which parameters the user must identify
 */
const QUIZ_DRILLS = {
    all: {
        label: 'All Parameters',
        types: FILTER_TYPES,
        freqs: null,
        gains: null,
        fixedFreq: null,
        fixedGain: null,
        guessFields: ['type', 'freq', 'gain']
    },
    filterTypesAt1k: {
        label: 'Filter Types at 1 kHz',
        types: FILTER_TYPES,
        freqs: [1000],
        gains: [-12, 12],
        fixedFreq: 1000,
        fixedGain: 12,
        guessFields: ['type', 'gain']
    }
};

// ============================================
// State
// ============================================

const state = {
    audioContext: null,
    masterGain: null,
    sourceGain: null,
    filter: null,
    filterGain: null,
    bypassGain: null,

    // Pink noise
    noiseBuffer: null,
    noiseSource: null,

    // User audio
    userAudioBuffer: null,
    userAudioSource: null,
    userAudioStartTime: 0,
    userAudioPausedAt: 0,
    userAudioDuration: 0,
    progressAnimationId: null,

    // Multi-track (built-in audio)
    multitrackBuffer: null,
    multitrackSource: null,
    multitrackLoading: false,

    // Sawtooth oscillator
    sawtoothOscillator: null,

    // Playback
    isPlaying: false,
    currentSource: 0, // 0=Mute, 1=Pink Noise, 2=User Audio, 3=Multi-track, 4=Sawtooth

    // Gain per source
    pinkNoiseGainValue: -24,
    userAudioGainValue: -12,
    multitrackGainValue: -12,
    sawtoothGainValue: -24,

    // Filter state
    filterType: 'highpass',
    filterFreq: 500,
    filterGainDb: 3,
    filterBypassed: false,

    // Filter settings (user-adjustable)
    passSlope: DEFAULT_PASS_SLOPE,     // dB/oct: 12, 24, or 48
    peakingBW: DEFAULT_PEAKING_BW,     // octaves
    shelfS: DEFAULT_SHELF_S,           // Shelf slope (S param from Audio EQ Cookbook)

    // Cascaded filters for steeper slopes
    extraFilters: [],  // additional BiquadFilterNodes when slope > 12

    // Mode
    mode: 'practice', // 'practice' | 'quiz'

    // Quiz
    quizDrill: 'all', // key into QUIZ_DRILLS
    quizAnswer: null, // { type, freq, gain }
    quizSelection: { type: null, freq: null, gain: null },
    quizCorrect: 0,
    quizTotal: 0,
    quizStreak: 0,
    quizRevealed: false,

    // Test
    testRunning: false,
    testTimeoutIds: [],
    testAnimationId: null,
    testStartTime: 0,
    testPhase: null, // 'bypass' | 'filter' | null — for canvas animation

    // Test durations (seconds) — user-adjustable
    testBypass1: TEST_BYPASS_1,
    testFilter: TEST_FILTER,
    testBypass2: TEST_BYPASS_2,

    // Visualization (lazy-initialized)
    vizContext: null
};

// ============================================
// Utilities
// ============================================

function dbToLinear(db) {
    return Math.pow(10, db / 20);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// Audio Context & Graph
// ============================================

function createAudioContext() {
    const WAContext = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new WAContext();

    // Master gain (output)
    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = dbToLinear(state.pinkNoiseGainValue);
    state.masterGain.connect(state.audioContext.destination);

    // Source gain (pre-filter)
    state.sourceGain = state.audioContext.createGain();
    state.sourceGain.gain.value = 1;

    // Filter path gain (for on/bypass switching)
    state.filterGain = state.audioContext.createGain();
    state.filterGain.gain.value = 1;

    // Bypass path gain
    state.bypassGain = state.audioContext.createGain();
    state.bypassGain.gain.value = 0;

    // Bypass path: sourceGain → bypassGain → masterGain
    state.sourceGain.connect(state.bypassGain);
    state.bypassGain.connect(state.masterGain);

    // filterGain → masterGain (static, never rebuilt)
    state.filterGain.connect(state.masterGain);

    // Build the filter chain (sourceGain → filters → filterGain)
    buildFilterChain();

    // Generate pink noise
    generatePinkNoiseBuffer();
}

/**
 * Build (or rebuild) the filter chain based on current settings.
 * For HP/LP with slopes > 12 dB/oct, cascades multiple BiquadFilterNodes.
 * For shelf filters, uses IIRFilterNode with manual coefficients (since
 * BiquadFilterNode ignores Q for shelf types, hardcoding S=1).
 * For peaking, uses a single BiquadFilterNode.
 */
function buildFilterChain() {
    if (!state.audioContext) return;

    // Disconnect old filter chain
    // (bypassGain and filterGain→masterGain connections stay)
    try {
        if (state.filter) {
            state.sourceGain.disconnect(state.filter);
            state.filter.disconnect();
        }
    } catch (e) { /* not connected */ }
    state.extraFilters.forEach(function (f) {
        try { f.disconnect(); } catch (e) { /* not connected */ }
    });
    state.extraFilters = [];

    if (SHELF_FILTERS.includes(state.filterType)) {
        // Shelf filters: use IIRFilterNode with custom coefficients
        var coeffs = computeShelfCoefficients(
            state.filterType,
            state.filterFreq,
            state.filterGainDb,
            state.shelfS,
            state.audioContext.sampleRate
        );
        state.filter = state.audioContext.createIIRFilter(
            coeffs.feedforward, coeffs.feedback
        );
    } else if (PASS_FILTERS.includes(state.filterType)) {
        // HP/LP: cascade BiquadFilterNodes with Butterworth Q per stage
        var numStages = state.passSlope / 12;
        state.filter = state.audioContext.createBiquadFilter();
        applyFilterParams(state.filter, 0, numStages);

        for (var i = 1; i < numStages; i++) {
            var extra = state.audioContext.createBiquadFilter();
            applyFilterParams(extra, i, numStages);
            state.extraFilters.push(extra);
        }
    } else {
        // Peaking: single BiquadFilterNode
        state.filter = state.audioContext.createBiquadFilter();
        applyFilterParams(state.filter, 0, 1);
    }

    // Connect chain: sourceGain → filter → [extra1 → extra2 → ...] → filterGain
    state.sourceGain.connect(state.filter);

    var prev = state.filter;
    state.extraFilters.forEach(function (f) {
        prev.connect(f);
        prev = f;
    });
    prev.connect(state.filterGain);
}

/**
 * Apply current filter parameters to a BiquadFilterNode (HP/LP/peaking only).
 * Shelf filters use IIRFilterNode and are handled in buildFilterChain().
 * For cascaded HP/LP, stageIndex selects the correct Butterworth Q from the table.
 */
function applyFilterParams(filterNode, stageIndex, totalStages) {
    stageIndex = (stageIndex !== undefined) ? stageIndex : 0;
    totalStages = (totalStages !== undefined) ? totalStages : 1;
    filterNode.type = state.filterType;
    var t = state.audioContext ? state.audioContext.currentTime : 0;

    filterNode.frequency.setTargetAtTime(state.filterFreq, t, 0.02);

    if (state.filterType === 'peaking') {
        filterNode.Q.setTargetAtTime(bwToQ(state.peakingBW), t, 0.02);
        filterNode.gain.setTargetAtTime(state.filterGainDb, t, 0.02);
    } else if (PASS_FILTERS.includes(state.filterType)) {
        var qValues = BUTTERWORTH_Q[totalStages] || BUTTERWORTH_Q[1];
        filterNode.Q.setTargetAtTime(qValues[stageIndex], t, 0.02);
        filterNode.gain.setTargetAtTime(0, t, 0.02);
    }
}

// ============================================
// Pink Noise (Paul Kellet algorithm)
// ============================================

function generatePinkNoiseBuffer() {
    const sampleRate = state.audioContext.sampleRate;
    const duration = 10;
    const length = sampleRate * duration;
    const data = new Float32Array(length);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;

        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;

        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
    }

    state.noiseBuffer = state.audioContext.createBuffer(1, length, sampleRate);
    state.noiseBuffer.copyToChannel(data, 0);
}

// ============================================
// Audio Playback
// ============================================

async function startAudio() {
    if (state.isPlaying) return;

    if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
    }

    if (state.currentSource === 0) return;

    if (state.currentSource === 1) {
        startPinkNoise();
    } else if (state.currentSource === 2) {
        if (state.userAudioBuffer) {
            startUserAudio(state.userAudioPausedAt);
        } else {
            return;
        }
    } else if (state.currentSource === 3) {
        if (state.multitrackBuffer) {
            startMultitrack();
        } else {
            return;
        }
    } else if (state.currentSource === 4) {
        startSawtooth();
    }

    state.isPlaying = true;
    updatePlayButton();
}

function stopAudio() {
    if (!state.isPlaying) return;

    if (state.noiseSource) {
        state.noiseSource.stop();
        state.noiseSource.disconnect();
        state.noiseSource = null;
    }

    if (state.userAudioSource) {
        const elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        state.userAudioPausedAt = Math.min(elapsed, state.userAudioDuration);

        state.userAudioSource.onended = null;
        state.userAudioSource.stop();
        state.userAudioSource.disconnect();
        state.userAudioSource = null;
    }

    if (state.multitrackSource) {
        state.multitrackSource.stop();
        state.multitrackSource.disconnect();
        state.multitrackSource = null;
    }

    if (state.sawtoothOscillator) {
        state.sawtoothOscillator.stop();
        state.sawtoothOscillator.disconnect();
        state.sawtoothOscillator = null;
    }

    if (state.progressAnimationId) {
        cancelAnimationFrame(state.progressAnimationId);
        state.progressAnimationId = null;
    }

    state.isPlaying = false;
    updatePlayButton();
}

function startPinkNoise() {
    if (state.noiseSource) {
        state.noiseSource.stop();
        state.noiseSource.disconnect();
    }

    state.noiseSource = state.audioContext.createBufferSource();
    state.noiseSource.buffer = state.noiseBuffer;
    state.noiseSource.loop = true;
    state.noiseSource.connect(state.sourceGain);
    state.noiseSource.start();
}

function startUserAudio(offset) {
    if (!state.userAudioBuffer) return;

    offset = offset || 0;

    state.userAudioSource = state.audioContext.createBufferSource();
    state.userAudioSource.buffer = state.userAudioBuffer;
    state.userAudioSource.loop = false;
    state.userAudioSource.connect(state.sourceGain);

    state.userAudioSource.onended = function () {
        if (state.isPlaying && state.currentSource === 2) {
            state.isPlaying = false;
            state.userAudioPausedAt = 0;
            updatePlayButton();
            updateProgressBar(0);
            if (state.progressAnimationId) {
                cancelAnimationFrame(state.progressAnimationId);
                state.progressAnimationId = null;
            }
        }
    };

    state.userAudioStartTime = state.audioContext.currentTime - offset;
    state.userAudioSource.start(0, offset);
    startProgressUpdate();
}

// ============================================
// Multi-track (Built-in Audio)
// ============================================

async function loadMultitrackAudio() {
    if (state.multitrackBuffer || state.multitrackLoading) return;

    state.multitrackLoading = true;

    try {
        var response = await fetch('../../audio/stadium-rock-mp3/Stadium Rock - Full Band.mp3');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var arrayBuffer = await response.arrayBuffer();
        state.multitrackBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
        state.multitrackLoading = false;
    } catch (error) {
        console.error('Error loading multi-track audio:', error);
        state.multitrackLoading = false;
        alert('Could not load built-in audio. Check that the audio files are available.');
    }
}

function startMultitrack() {
    if (!state.multitrackBuffer) return;

    if (state.multitrackSource) {
        state.multitrackSource.stop();
        state.multitrackSource.disconnect();
    }

    state.multitrackSource = state.audioContext.createBufferSource();
    state.multitrackSource.buffer = state.multitrackBuffer;
    state.multitrackSource.loop = true;
    state.multitrackSource.connect(state.sourceGain);
    state.multitrackSource.start();
}

// ============================================
// Sawtooth Oscillator
// ============================================

function startSawtooth() {
    if (state.sawtoothOscillator) {
        state.sawtoothOscillator.stop();
        state.sawtoothOscillator.disconnect();
    }

    state.sawtoothOscillator = state.audioContext.createOscillator();
    state.sawtoothOscillator.type = 'sawtooth';
    state.sawtoothOscillator.frequency.value = 220;
    state.sawtoothOscillator.connect(state.sourceGain);
    state.sawtoothOscillator.start();
}

async function togglePlayback() {
    if (state.currentSource !== 2) return;
    if (!state.userAudioBuffer) return;

    if (state.isPlaying) {
        stopAudio();
    } else {
        await startAudio();
    }
}

// ============================================
// Source Switching
// ============================================

async function setSource(source) {
    const wasPlaying = state.isPlaying;
    if (wasPlaying) stopAudio();

    state.currentSource = source;

    // Update gain for this source
    updateGainForSource(source);

    // Show/hide UI
    const uploadArea = document.getElementById('upload-area');
    const playbackControls = document.getElementById('playback-controls');

    if (source === 2) {
        if (state.userAudioBuffer) {
            uploadArea.classList.add('hidden');
            playbackControls.classList.remove('hidden');
        } else {
            uploadArea.classList.remove('hidden');
            playbackControls.classList.add('hidden');
        }
    } else {
        uploadArea.classList.add('hidden');
        playbackControls.classList.add('hidden');
    }

    updateSourceButtons();

    // Auto-play for continuous sources
    if (source === 1) {
        await startAudio();
    } else if (source === 3) {
        // Load multi-track audio if not already loaded, then auto-play
        if (!state.multitrackBuffer) {
            await loadMultitrackAudio();
        }
        if (state.multitrackBuffer) {
            await startAudio();
        }
    } else if (source === 4) {
        await startAudio();
    }
}

function updateGainForSource(source) {
    const slider = document.getElementById('gain-slider');
    const display = document.getElementById('gain-display');

    let gainDb;
    if (source === 2) {
        gainDb = state.userAudioGainValue;
    } else if (source === 3) {
        gainDb = state.multitrackGainValue;
    } else if (source === 4) {
        gainDb = state.sawtoothGainValue;
    } else {
        gainDb = state.pinkNoiseGainValue;
    }

    slider.value = gainDb;
    display.textContent = gainDb + ' dB';
    updateSliderFill(slider);

    if (state.masterGain) {
        state.masterGain.gain.setTargetAtTime(dbToLinear(gainDb), state.audioContext.currentTime, 0.02);
    }
}

function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(90deg, #2563eb 0%, #3b82f6 ${percentage}%, var(--color-control-bg) ${percentage}%, var(--color-control-bg) 100%)`;
}

// ============================================
// User Audio Upload
// ============================================

async function handleAudioFile(file) {
    if (!file || !file.type.startsWith('audio/')) {
        alert('Please select a valid audio file.');
        return;
    }

    if (file.size > 100 * 1024 * 1024) {
        alert('File is too large. Maximum size is 100MB.');
        return;
    }

    if (state.isPlaying) stopAudio();

    // Ensure audio context exists
    if (!state.audioContext) {
        createAudioContext();
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        state.userAudioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
        state.userAudioDuration = state.userAudioBuffer.duration;
        state.userAudioPausedAt = 0;

        // Update UI
        document.getElementById('upload-area').classList.add('hidden');
        document.getElementById('playback-controls').classList.remove('hidden');
        document.getElementById('time-display').textContent = '0:00 / ' + formatTime(state.userAudioDuration);

        updateProgressBar(0);
    } catch (error) {
        console.error('Error decoding audio:', error);
        alert('Could not decode audio file. Please try a different file.');
    }
}

// ============================================
// Progress Bar
// ============================================

function startProgressUpdate() {
    if (state.progressAnimationId) {
        cancelAnimationFrame(state.progressAnimationId);
    }

    function update() {
        if (!state.isPlaying || state.currentSource !== 2) return;

        const elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        const progress = Math.min(elapsed / state.userAudioDuration, 1);

        updateProgressBar(progress);
        document.getElementById('time-display').textContent =
            formatTime(elapsed) + ' / ' + formatTime(state.userAudioDuration);

        state.progressAnimationId = requestAnimationFrame(update);
    }

    update();
}

function updateProgressBar(progress) {
    const fill = document.getElementById('progress-fill');
    if (fill) {
        fill.style.width = (progress * 100) + '%';
    }
}

// ============================================
// Filter Controls
// ============================================

function setFilterType(type) {
    var wasPass = PASS_FILTERS.includes(state.filterType);
    var isPass = PASS_FILTERS.includes(type);
    state.filterType = type;

    // Rebuild filter chain (handles cascading for HP/LP, Q for shelf/peaking)
    if (state.audioContext) {
        buildFilterChain();
    }

    // Show/hide gain group
    const gainGroup = document.getElementById('gain-group');
    if (isPass) {
        gainGroup.classList.add('hidden');
    } else {
        gainGroup.classList.remove('hidden');
    }

    // Show/hide settings row based on filter type
    updateSettingsVisibility();
    updateTypeButtons();
    drawFilterCanvas();
}

function setFilterFreq(freq) {
    state.filterFreq = freq;
    if (state.filter) {
        if (SHELF_FILTERS.includes(state.filterType)) {
            // IIRFilterNode can't change params; rebuild
            buildFilterChain();
        } else {
            var t = state.audioContext.currentTime;
            state.filter.frequency.setTargetAtTime(freq, t, 0.02);
            state.extraFilters.forEach(function (f) {
                f.frequency.setTargetAtTime(freq, t, 0.02);
            });
        }
    }
    updateFreqButtons();
    drawFilterCanvas();
}

function setFilterGainDb(gain) {
    state.filterGainDb = gain;
    if (SHELF_FILTERS.includes(state.filterType)) {
        // IIRFilterNode can't change params; rebuild
        if (state.audioContext) buildFilterChain();
    } else {
        updateFilterGainParam();
    }
    updateGainButtons();
    drawFilterCanvas();
}

function updateFilterQ() {
    if (!state.filter) return;
    if (state.filterType === 'peaking') {
        var t = state.audioContext.currentTime;
        state.filter.Q.setTargetAtTime(bwToQ(state.peakingBW), t, 0.02);
    } else if (PASS_FILTERS.includes(state.filterType)) {
        // For HP/LP, rebuild chain to apply correct Butterworth Q per stage
        buildFilterChain();
    } else {
        // Shelf: rebuild (IIRFilterNode has immutable coefficients)
        buildFilterChain();
    }
}

function updateFilterGainParam() {
    if (!state.filter) return;
    if (PASS_FILTERS.includes(state.filterType)) {
        state.filter.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.02);
    } else {
        state.filter.gain.setTargetAtTime(state.filterGainDb, state.audioContext.currentTime, 0.02);
    }
}

function setFilterBypassed(bypassed) {
    state.filterBypassed = bypassed;
    const t = state.audioContext ? state.audioContext.currentTime : 0;

    if (state.filterGain && state.bypassGain) {
        if (bypassed) {
            state.filterGain.gain.setTargetAtTime(0, t, 0.02);
            state.bypassGain.gain.setTargetAtTime(1, t, 0.02);
        } else {
            state.filterGain.gain.setTargetAtTime(1, t, 0.02);
            state.bypassGain.gain.setTargetAtTime(0, t, 0.02);
        }
    }

    updateBypassButtons();
    drawFilterCanvas();
}

// ============================================
// Test Sequence
// ============================================

/**
 * Run the bypass/filter/bypass test sequence.
 * options.onEnd: callback when sequence finishes (default: restore previous state)
 * options.alwaysStop: always stop audio at end (for quiz mode)
 */
function runTest(options) {
    if (state.testRunning) return;
    if (state.currentSource === 0) return;

    options = options || {};
    state.testRunning = true;

    // Ensure audio context
    if (!state.audioContext) createAudioContext();

    const t = state.audioContext.currentTime;
    const b1 = state.testBypass1;
    const filt = state.testFilter;
    const b2 = state.testBypass2;
    const total = b1 + filt + b2;

    // Schedule bypass/filter/bypass
    state.filterGain.gain.setValueAtTime(0, t);
    state.bypassGain.gain.setValueAtTime(1, t);

    state.filterGain.gain.setValueAtTime(1, t + b1);
    state.bypassGain.gain.setValueAtTime(0, t + b1);

    state.filterGain.gain.setValueAtTime(0, t + b1 + filt);
    state.bypassGain.gain.setValueAtTime(1, t + b1 + filt);

    // Start audio if not playing
    const wasPlaying = state.isPlaying;
    if (!state.isPlaying) {
        startAudio();
    }

    // Show test indicator
    state.testStartTime = t;
    showTestIndicator();

    // Schedule end
    const endTimeout = setTimeout(function () {
        if (options.alwaysStop || !wasPlaying) {
            stopAudio();
        }

        // Restore filter/bypass state
        if (state.filterBypassed) {
            state.filterGain.gain.setValueAtTime(0, state.audioContext.currentTime);
            state.bypassGain.gain.setValueAtTime(1, state.audioContext.currentTime);
        } else {
            state.filterGain.gain.setValueAtTime(1, state.audioContext.currentTime);
            state.bypassGain.gain.setValueAtTime(0, state.audioContext.currentTime);
        }

        state.testRunning = false;
        state.testPhase = null;
        hideTestIndicator();
        state.testTimeoutIds = [];
        updateBypassButtons();
        drawFilterCanvas();

        if (options.onEnd) options.onEnd();
    }, total * 1000);

    state.testTimeoutIds.push(endTimeout);
}

function cancelTest() {
    state.testTimeoutIds.forEach(function (id) { clearTimeout(id); });
    state.testTimeoutIds = [];

    if (state.testAnimationId) {
        cancelAnimationFrame(state.testAnimationId);
        state.testAnimationId = null;
    }

    state.testRunning = false;
    state.testPhase = null;
    hideTestIndicator();
    updateBypassButtons();
    drawFilterCanvas();

    // Restore filter/bypass state
    if (state.audioContext) {
        const t = state.audioContext.currentTime;
        if (state.filterBypassed) {
            state.filterGain.gain.cancelScheduledValues(t);
            state.filterGain.gain.setValueAtTime(0, t);
            state.bypassGain.gain.cancelScheduledValues(t);
            state.bypassGain.gain.setValueAtTime(1, t);
        } else {
            state.filterGain.gain.cancelScheduledValues(t);
            state.filterGain.gain.setValueAtTime(1, t);
            state.bypassGain.gain.cancelScheduledValues(t);
            state.bypassGain.gain.setValueAtTime(0, t);
        }
    }
}

function showTestIndicator() {
    const indicator = document.getElementById('test-indicator');
    indicator.classList.remove('hidden');

    function updateIndicator() {
        if (!state.testRunning) return;

        const elapsed = state.audioContext.currentTime - state.testStartTime;
        const phaseEl = document.getElementById('test-phase');
        const countEl = document.getElementById('test-countdown');
        const b1 = state.testBypass1;
        const filt = state.testFilter;
        const total = b1 + filt + state.testBypass2;

        var prevPhase = state.testPhase;

        if (elapsed < b1) {
            phaseEl.textContent = 'Unfiltered';
            countEl.textContent = Math.ceil(b1 - elapsed) + 's';
            state.testPhase = 'bypass';
        } else if (elapsed < b1 + filt) {
            phaseEl.textContent = 'Filtered';
            countEl.textContent = Math.ceil(b1 + filt - elapsed) + 's';
            state.testPhase = 'filter';
        } else {
            phaseEl.textContent = 'Unfiltered';
            countEl.textContent = Math.ceil(total - elapsed) + 's';
            state.testPhase = 'bypass';
        }

        // Update UI when phase changes
        if (prevPhase !== state.testPhase) {
            updateBypassButtons();
            drawFilterCanvas();
        }

        state.testAnimationId = requestAnimationFrame(updateIndicator);
    }

    updateIndicator();
}

function hideTestIndicator() {
    document.getElementById('test-indicator').classList.add('hidden');

    if (state.testAnimationId) {
        cancelAnimationFrame(state.testAnimationId);
        state.testAnimationId = null;
    }
}

// ============================================
// Teaching Mode
// ============================================

async function teachingListen() {
    if (state.testRunning) return;

    var source = parseInt(document.getElementById('teaching-source-select').value);
    if (source === 2 && !state.userAudioBuffer) {
        alert('Upload an audio file first (switch to Practice mode to upload).');
        return;
    }
    if (source === 3 && !state.multitrackBuffer) {
        // Try to load it on the fly
        if (!state.audioContext) createAudioContext();
        await loadMultitrackAudio();
        if (!state.multitrackBuffer) return;
    }

    if (!state.audioContext) createAudioContext();

    // Rebuild filter chain to ensure settings are applied
    buildFilterChain();

    // Set source
    if (state.isPlaying) stopAudio();
    state.currentSource = source;
    updateGainForSource(source);

    // Ensure filter is active
    setFilterBypassed(false);

    // Disable listen button during playback
    document.getElementById('listen-btn').disabled = true;

    // Run the bypass/filter/bypass sequence, mute after
    runTest({
        alwaysStop: true,
        onEnd: function () {
            document.getElementById('listen-btn').disabled = false;
        }
    });
}

// ============================================
// Quiz Mode
// ============================================

async function newQuestion() {
    // Cancel any running test
    if (state.testRunning) cancelTest();

    const drill = QUIZ_DRILLS[state.quizDrill];

    // Pick random filter type from drill's allowed types
    const types = drill.types;
    const type = types[Math.floor(Math.random() * types.length)];

    // Pick random frequency (drill may lock it)
    const freqPool = drill.freqs || FREQUENCIES;
    const freq = drill.fixedFreq || freqPool[Math.floor(Math.random() * freqPool.length)];

    // Pick random gain (only for shelf/peaking)
    let gain = null;
    if (!PASS_FILTERS.includes(type)) {
        const gainPool = drill.gains || GAINS;
        gain = gainPool[Math.floor(Math.random() * gainPool.length)];
    }

    state.quizAnswer = { type: type, freq: freq, gain: gain };
    state.quizRevealed = false;

    // Clear user selection
    state.quizSelection = { type: null, freq: null, gain: null };

    // Ensure audio context
    if (!state.audioContext) createAudioContext();

    // Apply filter (hidden from user in quiz mode)
    // Update state so buildFilterChain uses correct type
    state.filterType = type;
    state.filterFreq = freq;
    state.filterGainDb = gain !== null ? gain : 0;

    // Rebuild chain (handles cascaded stages for HP/LP)
    buildFilterChain();

    // Ensure filter is active (not bypassed)
    setFilterBypassed(false);

    // Update UI: clear active states on selection buttons
    clearSelectionButtons();

    // Show/hide parameter groups based on drill
    updateQuizParamVisibility(drill);

    // Hide result
    document.getElementById('quiz-result').classList.add('hidden');

    // Enable submit (will check selections before allowing)
    updateSubmitButton();

    // Set source from quiz dropdown and run test sequence
    var quizSource = parseInt(document.getElementById('quiz-source-select').value);
    if (quizSource === 2 && !state.userAudioBuffer) {
        alert('Upload an audio file first (switch to Practice mode to upload).');
        return;
    }
    if (quizSource === 3 && !state.multitrackBuffer) {
        await loadMultitrackAudio();
        if (!state.multitrackBuffer) return;
    }

    // Switch to the quiz source (without auto-playing pink noise)
    if (state.isPlaying) stopAudio();
    state.currentSource = quizSource;
    updateGainForSource(quizSource);

    // Disable new question during playback, enable play again after
    document.getElementById('new-question-btn').disabled = true;
    document.getElementById('play-again-btn').disabled = true;

    // Run the test sequence, mute after
    runTest({
        alwaysStop: true,
        onEnd: function () {
            document.getElementById('new-question-btn').disabled = false;
            document.getElementById('play-again-btn').disabled = false;
        }
    });
}

async function playAgain() {
    if (state.testRunning || !state.quizAnswer) return;

    var quizSource = parseInt(document.getElementById('quiz-source-select').value);
    if (quizSource === 2 && !state.userAudioBuffer) return;
    if (quizSource === 3 && !state.multitrackBuffer) {
        await loadMultitrackAudio();
        if (!state.multitrackBuffer) return;
    }

    // Ensure source is set
    if (state.isPlaying) stopAudio();
    state.currentSource = quizSource;
    updateGainForSource(quizSource);

    document.getElementById('new-question-btn').disabled = true;
    document.getElementById('play-again-btn').disabled = true;

    runTest({
        alwaysStop: true,
        onEnd: function () {
            document.getElementById('new-question-btn').disabled = false;
            document.getElementById('play-again-btn').disabled = false;
        }
    });
}

function updateQuizParamVisibility(drill) {
    var freqGroup = document.querySelector('#freq-buttons').closest('.fid-param-group');
    var gainGroup = document.getElementById('gain-group');

    // Frequency: hide if not a guess field (e.g., fixed at 1 kHz)
    if (!drill.guessFields.includes('freq')) {
        freqGroup.classList.add('hidden');
    } else {
        freqGroup.classList.remove('hidden');
    }

    // Gain: start hidden, will show when user picks a non-pass type
    if (!drill.guessFields.includes('gain')) {
        gainGroup.classList.add('hidden');
    }

    // Filter gain buttons to only show drill-relevant values
    var drillGains = drill.gains || GAINS;
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        var val = parseInt(btn.dataset.gain);
        if (drillGains.includes(val)) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    // Filter freq buttons similarly if drill constrains them
    var drillFreqs = drill.freqs || FREQUENCIES;
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        var val = parseInt(btn.dataset.freq);
        if (drillFreqs.includes(val)) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
}

function clearSelectionButtons() {
    document.querySelectorAll('#type-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
    });
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
    });
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
    });
}

function handleQuizTypeSelection(type) {
    state.quizSelection.type = type;

    const drill = QUIZ_DRILLS[state.quizDrill];

    // Show/hide gain based on selected type + drill
    const gainGroup = document.getElementById('gain-group');
    if (PASS_FILTERS.includes(type) || !drill.guessFields.includes('gain')) {
        gainGroup.classList.add('hidden');
        if (PASS_FILTERS.includes(type)) state.quizSelection.gain = null;
    } else {
        gainGroup.classList.remove('hidden');
    }

    // Update button states
    document.querySelectorAll('#type-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    updateSubmitButton();
}

function handleQuizFreqSelection(freq) {
    state.quizSelection.freq = freq;

    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.freq) === freq);
    });

    updateSubmitButton();
}

function handleQuizGainSelection(gain) {
    state.quizSelection.gain = gain;

    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.gain) === gain);
    });

    updateSubmitButton();
}

function updateSubmitButton() {
    const btn = document.getElementById('submit-answer-btn');
    if (!state.quizAnswer || state.quizRevealed) {
        btn.disabled = true;
        return;
    }

    const sel = state.quizSelection;
    const drill = QUIZ_DRILLS[state.quizDrill];
    const fields = drill.guessFields;

    var ready = true;
    if (fields.includes('type') && !sel.type) ready = false;
    if (fields.includes('freq') && !sel.freq) ready = false;
    if (fields.includes('gain') && sel.type && !PASS_FILTERS.includes(sel.type) && sel.gain === null) ready = false;

    btn.disabled = !ready;
}

function submitAnswer() {
    if (!state.quizAnswer || state.quizRevealed) return;

    state.quizRevealed = true;
    state.quizTotal++;

    const answer = state.quizAnswer;
    const sel = state.quizSelection;
    const drill = QUIZ_DRILLS[state.quizDrill];
    const fields = drill.guessFields;

    // Check correctness only for fields the drill requires
    const typeCorrect = !fields.includes('type') || sel.type === answer.type;
    const freqCorrect = !fields.includes('freq') || sel.freq === answer.freq;
    const gainCorrect = !fields.includes('gain') || answer.gain === null || sel.gain === answer.gain;
    const allCorrect = typeCorrect && freqCorrect && gainCorrect;

    if (allCorrect) {
        state.quizCorrect++;
        state.quizStreak++;
    } else {
        state.quizStreak = 0;
    }

    // Build result message
    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden', 'correct', 'incorrect');

    if (allCorrect) {
        resultEl.classList.add('correct');
        resultEl.textContent = 'Correct!';
    } else {
        resultEl.classList.add('incorrect');
        let msg = 'Incorrect. It was ' + formatFilterName(answer.type) + ' at ' + formatFreq(answer.freq);
        if (answer.gain !== null) {
            msg += ', ' + (answer.gain > 0 ? '+' : '') + answer.gain + ' dB';
        }
        resultEl.textContent = msg;
    }

    // Update score display
    document.getElementById('quiz-score').textContent = state.quizCorrect + '/' + state.quizTotal;
    document.getElementById('quiz-streak').textContent = state.quizStreak;

    updateSubmitButton();
}

function formatFilterName(type) {
    var names = {
        highpass: 'High-Pass',
        lowpass: 'Low-Pass',
        highshelf: 'High Shelf',
        lowshelf: 'Low Shelf',
        peaking: 'Peaking'
    };
    return names[type] || type;
}

function formatFreq(freq) {
    if (freq >= 1000) return (freq / 1000) + ' kHz';
    return freq + ' Hz';
}

// ============================================
// Mode Switching
// ============================================

function setMode(mode) {
    // Stop everything when switching modes
    if (state.testRunning) cancelTest();
    if (state.isPlaying) stopAudio();

    state.mode = mode;

    const app = document.querySelector('.fid-app');
    const sourceCard = document.querySelector('.fid-source-card');
    const filterHeader = document.getElementById('filter-header');
    const teachingControls = document.getElementById('teaching-controls');
    const quizControls = document.getElementById('quiz-controls');
    const quizSubmit = document.getElementById('quiz-submit');

    // Hide everything first
    app.classList.remove('quiz-mode');
    sourceCard.classList.add('hidden');
    filterHeader.classList.add('hidden');
    teachingControls.classList.add('hidden');
    quizControls.classList.add('hidden');
    quizSubmit.classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');

    // Restore all buttons visible (drills may have hidden some)
    restoreAllButtons();

    if (mode === 'practice') {
        sourceCard.classList.remove('hidden');
        filterHeader.classList.remove('hidden');

        // Restore practice state: re-apply filter from current selections
        setFilterType(state.filterType);
        setFilterFreq(state.filterFreq);
        setFilterGainDb(state.filterGainDb);

    } else if (mode === 'teaching') {
        filterHeader.classList.remove('hidden');
        teachingControls.classList.remove('hidden');

        // Teaching mode: buttons control filter directly (like practice)
        // Re-apply current filter state
        setFilterType(state.filterType);
        setFilterFreq(state.filterFreq);
        setFilterGainDb(state.filterGainDb);

    } else if (mode === 'quiz') {
        app.classList.add('quiz-mode');
        quizControls.classList.remove('hidden');
        quizSubmit.classList.remove('hidden');

        // Reset quiz state
        state.quizAnswer = null;
        state.quizSelection = { type: null, freq: null, gain: null };
        state.quizCorrect = 0;
        state.quizTotal = 0;
        state.quizStreak = 0;
        state.quizRevealed = false;

        document.getElementById('quiz-score').textContent = '0/0';
        document.getElementById('quiz-streak').textContent = '0';
        document.getElementById('play-again-btn').disabled = true;

        clearSelectionButtons();
        updateSubmitButton();
    }

    updateModeButtons();
}

function restoreAllButtons() {
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('hidden');
    });
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('hidden');
    });
    document.querySelector('#freq-buttons').closest('.fid-param-group').classList.remove('hidden');
}

// ============================================
// UI Update Functions
// ============================================

function updateSourceButtons() {
    document.querySelectorAll('.fid-source-card .source-button').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.source) === state.currentSource);
    });
}

function updatePlayButton() {
    const btn = document.getElementById('play-button');
    if (!btn) return;
    btn.classList.toggle('playing', state.isPlaying);
}

function updateTypeButtons() {
    document.querySelectorAll('#type-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.type === state.filterType);
    });
}

function updateFreqButtons() {
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.freq) === state.filterFreq);
    });
}

function updateGainButtons() {
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.gain) === state.filterGainDb);
    });
}

function updateBypassButtons() {
    var btn = document.getElementById('filter-on-btn');
    // During a test sequence, show the current phase state
    var isOn = state.testPhase ? state.testPhase === 'filter' : !state.filterBypassed;
    btn.classList.toggle('active', isOn);
    btn.textContent = isOn ? 'On' : 'Off';
}

function updateModeButtons() {
    document.querySelectorAll('.fid-mode-buttons .source-button').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.mode === state.mode);
    });
}

function syncDurationInputs() {
    document.getElementById('teaching-bypass-dur').value = state.testBypass1;
    document.getElementById('teaching-filter-dur').value = state.testFilter;
    document.getElementById('quiz-bypass-dur').value = state.testBypass1;
    document.getElementById('quiz-filter-dur').value = state.testFilter;
}

function updateSettingsVisibility() {
    var slopeGroup = document.getElementById('settings-slope');
    var bwGroup = document.getElementById('settings-bandwidth');
    var shelfQGroup = document.getElementById('settings-shelf-q');

    if (PASS_FILTERS.includes(state.filterType)) {
        slopeGroup.classList.remove('hidden');
        bwGroup.classList.add('hidden');
        shelfQGroup.classList.add('hidden');
    } else if (state.filterType === 'peaking') {
        slopeGroup.classList.add('hidden');
        bwGroup.classList.remove('hidden');
        shelfQGroup.classList.add('hidden');
    } else {
        // Shelf filters
        slopeGroup.classList.add('hidden');
        bwGroup.classList.add('hidden');
        shelfQGroup.classList.remove('hidden');
    }

    updateSettingsButtons();
    updateQReadout();
}

function updateSettingsButtons() {
    // Slope buttons
    document.querySelectorAll('#slope-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.slope) === state.passSlope);
    });

    // Bandwidth buttons (peaking only)
    document.querySelectorAll('#bw-buttons .fid-toggle').forEach(function (btn) {
        var bw = parseFloat(btn.dataset.bw);
        btn.classList.toggle('active', bw === state.peakingBW);
    });

    // Shelf slope buttons
    document.querySelectorAll('#shelf-q-buttons .fid-toggle').forEach(function (btn) {
        var s = parseFloat(btn.dataset.q);
        btn.classList.toggle('active', s === state.shelfS);
    });
}

function updateQReadout() {
    var readout = document.getElementById('q-readout');
    if (!readout) return;

    if (state.filterType === 'peaking') {
        var q = bwToQ(state.peakingBW);
        readout.textContent = 'Q = ' + q.toFixed(2) + '  (BW = ' + state.peakingBW + ' oct)';
        readout.classList.remove('hidden');
    } else if (PASS_FILTERS.includes(state.filterType)) {
        var qValues = BUTTERWORTH_Q[state.passSlope / 12] || BUTTERWORTH_Q[1];
        if (qValues.length === 1) {
            readout.textContent = 'Q = ' + qValues[0].toFixed(3);
        } else {
            readout.textContent = 'Q per stage: ' + qValues.map(function (q) { return q.toFixed(3); }).join(', ');
        }
        readout.classList.remove('hidden');
    } else {
        // Shelf
        readout.textContent = 'S = ' + state.shelfS.toFixed(2);
        readout.classList.remove('hidden');
    }
}

function setPassSlope(slope) {
    state.passSlope = slope;
    if (state.audioContext && PASS_FILTERS.includes(state.filterType)) {
        buildFilterChain();
    }
    updateSettingsButtons();
    updateQReadout();
    drawFilterCanvas();
}

function setBandwidth(bw) {
    state.peakingBW = bw;
    if (state.filter) {
        updateFilterQ();
    }
    updateSettingsButtons();
    updateQReadout();
    drawFilterCanvas();
}

function setShelfS(s) {
    state.shelfS = s;
    if (state.audioContext && SHELF_FILTERS.includes(state.filterType)) {
        buildFilterChain();
    }
    updateSettingsButtons();
    updateQReadout();
    drawFilterCanvas();
}

// ============================================
// Frequency Response Visualization
// ============================================

const VIZ_MIN_FREQ = 20;
const VIZ_MAX_FREQ = 20000;
const VIZ_MIN_GAIN = -18;
const VIZ_MAX_GAIN = 18;
const VIZ_PADDING = { left: 36, right: 12, top: 12, bottom: 24 };
const VIZ_NUM_POINTS = 512;

// Pre-compute log frequency array for getFrequencyResponse
const vizFreqArray = new Float32Array(VIZ_NUM_POINTS);
(function () {
    const logMin = Math.log10(VIZ_MIN_FREQ);
    const logMax = Math.log10(VIZ_MAX_FREQ);
    for (var i = 0; i < VIZ_NUM_POINTS; i++) {
        var t = i / (VIZ_NUM_POINTS - 1);
        vizFreqArray[i] = Math.pow(10, logMin + t * (logMax - logMin));
    }
})();

function freqToX(freq, plotWidth) {
    var logMin = Math.log10(VIZ_MIN_FREQ);
    var logMax = Math.log10(VIZ_MAX_FREQ);
    return ((Math.log10(freq) - logMin) / (logMax - logMin)) * plotWidth;
}

function gainToY(gain, plotHeight) {
    return ((VIZ_MAX_GAIN - gain) / (VIZ_MAX_GAIN - VIZ_MIN_GAIN)) * plotHeight;
}

function drawFilterCanvas() {
    var canvas = document.getElementById('filter-canvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth;
    var h = container.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var pad = VIZ_PADDING;
    var plotWidth = w - pad.left - pad.right;
    var plotHeight = h - pad.top - pad.bottom;

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    // Grid
    drawVizGrid(ctx, w, h, plotWidth, plotHeight, pad, isDark);

    // Compute frequency response using an OfflineAudioContext for accuracy
    // Compute frequency response
    var magResponse = new Float32Array(VIZ_NUM_POINTS);
    var phaseResponse = new Float32Array(VIZ_NUM_POINTS);

    if (SHELF_FILTERS.includes(state.filterType)) {
        // Shelf: compute from IIR coefficients directly (BiquadFilterNode ignores Q for shelves)
        var vizCoeffs = computeShelfCoefficients(
            state.filterType, state.filterFreq, state.filterGainDb, state.shelfS, 44100
        );
        magResponse = computeIIRFrequencyResponse(
            vizCoeffs.feedforward, vizCoeffs.feedback, vizFreqArray, 44100
        );
    } else {
        // HP/LP/Peaking: use BiquadFilterNode.getFrequencyResponse
        if (!state.vizContext) {
            state.vizContext = new OfflineAudioContext(1, 1, 44100);
        }
        var vf = state.vizContext.createBiquadFilter();
        vf.type = state.filterType;
        vf.frequency.value = state.filterFreq;
        vf.gain.value = PASS_FILTERS.includes(state.filterType) ? 0 : state.filterGainDb;

        if (state.filterType === 'peaking') {
            vf.Q.value = bwToQ(state.peakingBW);
        } else {
            vf.Q.value = 0.7071; // placeholder for per-stage Butterworth
        }

        if (PASS_FILTERS.includes(state.filterType)) {
            // Cascaded HP/LP: multiply per-stage responses
            var numStages = state.passSlope / 12;
            var qValues = BUTTERWORTH_Q[numStages] || BUTTERWORTH_Q[1];
            var tempMag = new Float32Array(VIZ_NUM_POINTS);
            var tempPhase = new Float32Array(VIZ_NUM_POINTS);

            for (var si = 0; si < VIZ_NUM_POINTS; si++) {
                magResponse[si] = 1.0;
            }

            for (var stage = 0; stage < numStages; stage++) {
                vf.Q.value = qValues[stage];
                vf.getFrequencyResponse(vizFreqArray, tempMag, tempPhase);
                for (var si = 0; si < VIZ_NUM_POINTS; si++) {
                    magResponse[si] *= tempMag[si];
                }
            }
        } else {
            // Peaking: single stage
            vf.getFrequencyResponse(vizFreqArray, magResponse, phaseResponse);
        }
    }

    // Draw curve
    var accentColor = isDark ? '#60a5fa' : '#2563eb';
    var fillColor = isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(37, 99, 235, 0.08)';
    // Gray out curve when bypassed or during unfiltered test phases
    var bypassedAlpha = (state.filterBypassed || state.testPhase === 'bypass') ? 0.3 : 1;

    ctx.save();
    ctx.globalAlpha = bypassedAlpha;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    var zeroY = pad.top + gainToY(0, plotHeight);

    for (var i = 0; i < VIZ_NUM_POINTS; i++) {
        var x = pad.left + (i / (VIZ_NUM_POINTS - 1)) * plotWidth;
        var gainDb = 20 * Math.log10(magResponse[i]);
        // Clamp to visible range
        gainDb = Math.max(VIZ_MIN_GAIN, Math.min(VIZ_MAX_GAIN, gainDb));
        var y = pad.top + gainToY(gainDb, plotHeight);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // Fill between curve and 0 dB line
    var lastX = pad.left + plotWidth;
    ctx.lineTo(lastX, zeroY);
    ctx.lineTo(pad.left, zeroY);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.restore();
}

function drawVizGrid(ctx, w, h, plotWidth, plotHeight, pad, isDark) {
    var gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    var gridColorStrong = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    var textColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)';

    ctx.font = '10px Inter, -apple-system, sans-serif';

    // Vertical lines (frequency)
    var freqLines = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
    for (var fi = 0; fi < freqLines.length; fi++) {
        var freq = freqLines[fi];
        var x = pad.left + freqToX(freq, plotWidth);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, h - pad.bottom);
        ctx.stroke();

        // Label
        var label = freq >= 1000 ? (freq / 1000) + 'k' : freq.toString();
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, h - pad.bottom + 13);
    }

    // Horizontal lines (gain)
    var gainLines = [-12, -6, 0, 6, 12];
    for (var gi = 0; gi < gainLines.length; gi++) {
        var gain = gainLines[gi];
        var y = pad.top + gainToY(gain, plotHeight);

        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);

        if (gain === 0) {
            ctx.strokeStyle = gridColorStrong;
            ctx.lineWidth = 1.5;
        } else {
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Label
        ctx.fillStyle = textColor;
        ctx.textAlign = 'right';
        ctx.fillText((gain > 0 ? '+' : '') + gain, pad.left - 4, y + 3);
    }
}

// ============================================
// Event Handlers
// ============================================

function setupEventListeners() {
    // Audio context resume on user gesture
    document.addEventListener('click', function () {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }, { once: true });
    document.addEventListener('touchstart', function () {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }, { once: true });

    // Source buttons
    document.querySelectorAll('.fid-source-card .source-button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!state.audioContext) createAudioContext();
            setSource(parseInt(btn.dataset.source));
        });
    });

    // Play button (user audio)
    document.getElementById('play-button').addEventListener('click', function () {
        togglePlayback();
    });

    // Progress bar seek
    document.getElementById('progress-bar').addEventListener('click', function (e) {
        if (state.currentSource !== 2 || !state.userAudioBuffer) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = x / rect.width;
        const seekTime = progress * state.userAudioDuration;

        const wasPlaying = state.isPlaying;
        if (wasPlaying) {
            state.userAudioSource.onended = null;
            state.userAudioSource.stop();
            state.userAudioSource.disconnect();
            state.userAudioSource = null;

            if (state.progressAnimationId) {
                cancelAnimationFrame(state.progressAnimationId);
                state.progressAnimationId = null;
            }
        }

        state.userAudioPausedAt = seekTime;
        updateProgressBar(progress);
        document.getElementById('time-display').textContent =
            formatTime(seekTime) + ' / ' + formatTime(state.userAudioDuration);

        if (wasPlaying) {
            state.isPlaying = false;
            startUserAudio(seekTime);
            state.isPlaying = true;
        }
    });

    // File upload
    var fileInput = document.getElementById('audio-file-input');
    fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            handleAudioFile(e.target.files[0]);
        }
    });

    // Drag and drop on upload area
    var uploadArea = document.getElementById('upload-area');
    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleAudioFile(e.dataTransfer.files[0]);
        }
    });

    // Gain slider
    var gainSlider = document.getElementById('gain-slider');
    gainSlider.addEventListener('input', function () {
        var gainDb = parseFloat(this.value);
        if (state.currentSource === 2) {
            state.userAudioGainValue = gainDb;
        } else if (state.currentSource === 3) {
            state.multitrackGainValue = gainDb;
        } else if (state.currentSource === 4) {
            state.sawtoothGainValue = gainDb;
        } else {
            state.pinkNoiseGainValue = gainDb;
        }

        document.getElementById('gain-display').textContent = gainDb + ' dB';
        updateSliderFill(this);

        if (state.masterGain) {
            state.masterGain.gain.setTargetAtTime(dbToLinear(gainDb), state.audioContext.currentTime, 0.02);
        }
    });

    // Filter on/off toggle
    document.getElementById('filter-on-btn').addEventListener('click', function () {
        if (!state.audioContext) createAudioContext();
        setFilterBypassed(!state.filterBypassed);
    });

    // Teaching mode: Listen button
    document.getElementById('listen-btn').addEventListener('click', function () {
        if (!state.audioContext) createAudioContext();
        teachingListen();
    });

    // Filter type buttons
    document.querySelectorAll('#type-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!state.audioContext) createAudioContext();

            if (state.mode === 'quiz') {
                handleQuizTypeSelection(btn.dataset.type);
            } else {
                // Practice and Teaching modes: direct control
                setFilterType(btn.dataset.type);
            }
        });
    });

    // Frequency buttons
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!state.audioContext) createAudioContext();

            var freq = parseInt(btn.dataset.freq);
            if (state.mode === 'quiz') {
                handleQuizFreqSelection(freq);
            } else {
                setFilterFreq(freq);
            }
        });
    });

    // Gain buttons
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!state.audioContext) createAudioContext();

            var gain = parseInt(btn.dataset.gain);
            if (state.mode === 'quiz') {
                handleQuizGainSelection(gain);
            } else {
                setFilterGainDb(gain);
            }
        });
    });

    // Mode buttons
    document.querySelectorAll('.fid-mode-buttons .source-button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setMode(btn.dataset.mode);
        });
    });

    // Filter settings: slope buttons
    document.querySelectorAll('#slope-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setPassSlope(parseInt(btn.dataset.slope));
        });
    });

    // Filter settings: bandwidth buttons (peaking)
    document.querySelectorAll('#bw-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setBandwidth(parseFloat(btn.dataset.bw));
        });
    });

    // Filter settings: shelf slope buttons
    document.querySelectorAll('#shelf-q-buttons .fid-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setShelfS(parseFloat(btn.dataset.q));
        });
    });

    // Drill select
    document.getElementById('quiz-drill-select').addEventListener('change', function () {
        state.quizDrill = this.value;
        // Reset quiz when drill changes
        if (state.testRunning) cancelTest();
        if (state.isPlaying) stopAudio();
        state.quizAnswer = null;
        state.quizSelection = { type: null, freq: null, gain: null };
        state.quizRevealed = false;
        clearSelectionButtons();
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('play-again-btn').disabled = true;
        // Show/hide param groups for new drill
        var drill = QUIZ_DRILLS[state.quizDrill];
        updateQuizParamVisibility(drill);
        updateSubmitButton();
    });

    // Duration inputs (teaching + quiz share state)
    var durationInputs = [
        { bypass: 'teaching-bypass-dur', filter: 'teaching-filter-dur' },
        { bypass: 'quiz-bypass-dur', filter: 'quiz-filter-dur' }
    ];

    durationInputs.forEach(function (pair) {
        document.getElementById(pair.bypass).addEventListener('change', function () {
            var val = Math.max(1, Math.min(30, parseInt(this.value) || 1));
            this.value = val;
            state.testBypass1 = val;
            state.testBypass2 = val;
            // Sync the other input
            syncDurationInputs();
        });
        document.getElementById(pair.filter).addEventListener('change', function () {
            var val = Math.max(1, Math.min(30, parseInt(this.value) || 1));
            this.value = val;
            state.testFilter = val;
            // Sync the other input
            syncDurationInputs();
        });
    });

    // New question button
    document.getElementById('new-question-btn').addEventListener('click', function () {
        if (!state.audioContext) createAudioContext();
        newQuestion();
    });

    // Play again button
    document.getElementById('play-again-btn').addEventListener('click', function () {
        if (!state.audioContext) createAudioContext();
        playAgain();
    });

    // Submit answer button
    document.getElementById('submit-answer-btn').addEventListener('click', function () {
        submitAnswer();
    });

}

// ============================================
// Initialization
// ============================================

function init() {
    setupEventListeners();

    // Set initial UI state
    updateSourceButtons();
    updateTypeButtons();
    updateFreqButtons();
    updateGainButtons();
    updateBypassButtons();
    updateModeButtons();

    // Initialize gain slider fill
    var gainSlider = document.getElementById('gain-slider');
    updateSliderFill(gainSlider);

    // Hide gain group initially (highpass selected by default)
    if (PASS_FILTERS.includes(state.filterType)) {
        document.getElementById('gain-group').classList.add('hidden');
    }

    // Set initial settings visibility
    updateSettingsVisibility();

    // Initial canvas draw
    drawFilterCanvas();

    // Redraw on resize
    window.addEventListener('resize', drawFilterCanvas);

    // Redraw on theme change
    var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'data-theme') {
                drawFilterCanvas();
                break;
            }
        }
    });
    observer.observe(document.documentElement, { attributes: true });
}

document.addEventListener('DOMContentLoaded', init);
