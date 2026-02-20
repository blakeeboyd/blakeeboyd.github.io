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
const FILTER_TYPES = ['highpass', 'lowpass', 'bandpass', 'highshelf', 'lowshelf', 'peaking'];
const PASS_FILTERS = ['highpass', 'lowpass', 'bandpass']; // No gain parameter
const BANDWIDTH_FILTERS = ['peaking', 'bandpass']; // Use bandwidth/Q control
const SLOPE_FILTERS = ['highpass', 'lowpass']; // Cascade for steeper slopes

// Bandwidth Q formula: Q = 1 / (2 * sinh(ln(2)/2 * BW))
function bwToQ(octaves) {
    return 1 / (2 * Math.sinh(Math.LN2 / 2 * octaves));
}

// Defaults
const DEFAULT_PEAKING_BW = 2;    // octaves → Q ≈ 0.667
const DEFAULT_BANDPASS_BW = 1;   // octaves → Q ≈ 1.414
const DEFAULT_SHELF_S = 1;       // Shelf slope (S=1 is standard; >1 steeper with resonance)
const DEFAULT_PASS_SLOPE = 12;   // dB/oct (single 2nd-order filter)
const SHELF_FILTERS = ['highshelf', 'lowshelf'];

// Multi-track stem files
const MULTITRACK_TRACKS = [
    { key: 'drums',       label: 'Drums',      file: 'Stadium Rock - Drums.mp3' },
    { key: 'tambourine',  label: 'Tamb.',      file: 'Stadium Rock - Tambourine.mp3' },
    { key: 'bass',        label: 'Bass',       file: 'Stadium Rock - Bass.mp3' },
    { key: 'guitar',      label: 'Guitar',     file: 'Stadium Rock - Guitar.mp3' },
    { key: 'keys',        label: 'Keys',       file: 'Stadium Rock - Keys.mp3' },
    { key: 'organ',       label: 'Organ',      file: 'Stadium Rock - Organ.mp3' },
    { key: 'pad',         label: 'Pad',        file: 'Stadium Rock - Pad.mp3' }
];

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
    filterTypes: {
        label: 'Filter Types',
        types: FILTER_TYPES,
        freqs: null,
        gains: [-12, 12],
        fixedFreq: 1000,            // default; user picks via drill freq selector
        fixedGain: 12,
        guessFields: ['type', 'gain'],
        userPicksFreq: true         // show frequency picker in quiz controls
    },
    frequencies: {
        label: 'Frequencies',
        types: FILTER_TYPES,
        freqs: null,
        gains: [-12, 12],
        fixedType: 'peaking',       // default; user picks via drill type selector
        fixedGain: 12,
        guessFields: ['freq', 'gain'],
        userPicksType: true         // show type picker in quiz controls
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
    multitrackBuffers: {},       // { drums: AudioBuffer, bass: AudioBuffer, ... }
    multitrackSources: [],       // Array of BufferSourceNode (one per track)
    multitrackGains: [],         // Array of GainNode (one per track)
    multitrackPanners: [],       // Array of StereoPannerNode (one per track)
    multitrackAnalysers: [],     // Array of AnalyserNode (one per track, for meters)
    multitrackMeterAnimId: null, // rAF ID for meter animation
    multitrackMerge: null,       // GainNode summing bus
    multitrackMuted: [],         // boolean[] — per-track mute state
    multitrackVolumes: [],       // number[] (0..1) — per-track volume
    multitrackPans: [],          // number[] (-1..1) — per-track pan (not yet exposed in UI)
    multitrackSoloed: null,      // null = no solo, or track key string (exclusive)
    multitrackLoading: false,

    // Stereo visualization
    stereoAnalyserL: null,
    stereoAnalyserR: null,
    stereoSplitter: null,
    stereoVizAnimId: null,

    // Spectrum analyser (1/3-octave overlay)
    preMasterMerge: null,
    spectrumAnalyser: null,       // post-filter (what you hear)
    spectrumRefAnalyser: null,    // pre-filter (reference level)
    spectrumAnimId: null,
    spectrumEnabled: false,

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
    quizGainDirection: 'boost', // 'boost' | 'cut' | 'both'
    quizAnswer: null, // { type, freq, gain }
    quizPreviousAnswer: null, // previous question's answer (to avoid repeats)
    quizSpectrumSnapshot: null, // { bands: Float32Array, refPeakDb: number } captured during filtered phase
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
    testLoop: false, // loop the test sequence continuously

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

    // Pre-master merge node: filter + bypass paths merge here before masterGain.
    // Spectrum analyser taps this node so the display is independent of the volume knob.
    state.preMasterMerge = state.audioContext.createGain();
    state.preMasterMerge.gain.value = 1;
    state.preMasterMerge.connect(state.masterGain);

    // Post-filter spectrum analyser (taps pre-master signal for 1/3-octave display)
    state.spectrumAnalyser = state.audioContext.createAnalyser();
    state.spectrumAnalyser.fftSize = 8192;
    state.spectrumAnalyser.smoothingTimeConstant = 0.8;
    state.preMasterMerge.connect(state.spectrumAnalyser);

    // Source gain (pre-filter)
    state.sourceGain = state.audioContext.createGain();
    state.sourceGain.gain.value = 1;

    // Pre-filter reference analyser (taps sourceGain for normalization reference)
    state.spectrumRefAnalyser = state.audioContext.createAnalyser();
    state.spectrumRefAnalyser.fftSize = 8192;
    state.spectrumRefAnalyser.smoothingTimeConstant = 0.8;
    state.sourceGain.connect(state.spectrumRefAnalyser);

    // Filter path gain (for on/bypass switching)
    state.filterGain = state.audioContext.createGain();
    state.filterGain.gain.value = 1;

    // Bypass path gain
    state.bypassGain = state.audioContext.createGain();
    state.bypassGain.gain.value = 0;

    // Bypass path: sourceGain → bypassGain → preMasterMerge
    state.sourceGain.connect(state.bypassGain);
    state.bypassGain.connect(state.preMasterMerge);

    // filterGain → preMasterMerge (static, never rebuilt)
    state.filterGain.connect(state.preMasterMerge);

    // Build the filter chain (sourceGain → filters → filterGain)
    buildFilterChain();

    // Build multitrack audio graph (gain nodes, analysers)
    buildMultitrackGraph();

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
    } else if (SLOPE_FILTERS.includes(state.filterType)) {
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
        // Peaking / Bandpass: single BiquadFilterNode
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

    if (BANDWIDTH_FILTERS.includes(state.filterType)) {
        filterNode.Q.setTargetAtTime(bwToQ(state.peakingBW), t, 0.02);
        filterNode.gain.setTargetAtTime(
            state.filterType === 'peaking' ? state.filterGainDb : 0, t, 0.02
        );
    } else if (SLOPE_FILTERS.includes(state.filterType)) {
        var qValues = BUTTERWORTH_Q[totalStages] || BUTTERWORTH_Q[1];
        filterNode.Q.setTargetAtTime(qValues[stageIndex], t, 0.02);
        filterNode.gain.setTargetAtTime(0, t, 0.02);
    }
}

// ============================================
// Multi-track Audio Graph
// ============================================

function buildMultitrackGraph() {
    // Summing bus for all tracks
    state.multitrackMerge = state.audioContext.createGain();
    state.multitrackMerge.gain.value = 1;

    // Initialize mixer state arrays
    state.multitrackMuted = MULTITRACK_TRACKS.map(function () { return false; });
    state.multitrackVolumes = MULTITRACK_TRACKS.map(function () { return 1; });
    state.multitrackPans = MULTITRACK_TRACKS.map(function () { return 0; });
    state.multitrackSoloed = null;

    // Per-track: GainNode → StereoPannerNode → summing bus
    //                    └→ AnalyserNode (for meter, dead-end tap)
    state.multitrackGains = [];
    state.multitrackPanners = [];
    state.multitrackAnalysers = [];
    MULTITRACK_TRACKS.forEach(function () {
        var g = state.audioContext.createGain();
        g.gain.value = 1;
        var p = state.audioContext.createStereoPanner();
        p.pan.value = 0;
        var a = state.audioContext.createAnalyser();
        a.fftSize = 256;
        a.smoothingTimeConstant = 0.85;
        g.connect(p);
        g.connect(a); // meter tap (before panner, shows pre-pan level)
        p.connect(state.multitrackMerge);
        state.multitrackGains.push(g);
        state.multitrackPanners.push(p);
        state.multitrackAnalysers.push(a);
    });

    // Stereo visualization: split L/R from the summing bus
    state.stereoSplitter = state.audioContext.createChannelSplitter(2);
    state.stereoAnalyserL = state.audioContext.createAnalyser();
    state.stereoAnalyserR = state.audioContext.createAnalyser();
    state.stereoAnalyserL.fftSize = 2048;
    state.stereoAnalyserR.fftSize = 2048;

    state.multitrackMerge.connect(state.stereoSplitter);
    state.stereoSplitter.connect(state.stereoAnalyserL, 0);
    state.stereoSplitter.connect(state.stereoAnalyserR, 1);
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
        if (hasMultitrackLoaded()) {
            startMultitrack();
        } else {
            return;
        }
    } else if (state.currentSource === 4) {
        startSawtooth();
    }

    state.isPlaying = true;
    updatePlayButton();
    startSpectrumAnimation();
    if (state.currentSource === 3) startMultitrackMeters();
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

    if (state.multitrackSources.length > 0) {
        stopMultitrackSources();
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
    stopSpectrumAnimation();
    stopMultitrackMeters();
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
            stopSpectrumAnimation();
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

function hasMultitrackLoaded() {
    return Object.keys(state.multitrackBuffers).length > 0;
}

async function loadMultitrackAudio() {
    if (hasMultitrackLoaded() || state.multitrackLoading) return;

    state.multitrackLoading = true;
    updateMultitrackLoadingUI(true);

    try {
        var basePath = '../../audio/stadium-rock-mp3/';
        var promises = MULTITRACK_TRACKS.map(function (track) {
            return fetch(basePath + track.file)
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + track.file);
                    return r.arrayBuffer();
                })
                .then(function (ab) {
                    return state.audioContext.decodeAudioData(ab);
                })
                .then(function (buffer) {
                    return { key: track.key, buffer: buffer };
                });
        });

        var results = await Promise.all(promises);
        results.forEach(function (r) {
            state.multitrackBuffers[r.key] = r.buffer;
        });

        state.multitrackLoading = false;
        updateMultitrackLoadingUI(false);
        buildMultitrackTrackButtons();
    } catch (error) {
        console.error('Error loading multi-track audio:', error);
        state.multitrackLoading = false;
        updateMultitrackLoadingUI(false);
        alert('Could not load built-in audio. Check that the audio files are available.');
    }
}

function startMultitrack() {
    if (!hasMultitrackLoaded()) return;

    // Stop any existing sources
    stopMultitrackSources();

    // Create and start all sources simultaneously
    state.multitrackSources = MULTITRACK_TRACKS.map(function (track, i) {
        var src = state.audioContext.createBufferSource();
        src.buffer = state.multitrackBuffers[track.key];
        src.loop = true;
        src.connect(state.multitrackGains[i]);
        return src;
    });

    // Connect summing bus to sourceGain
    state.multitrackMerge.connect(state.sourceGain);

    // Apply current mute/solo/volume state to gain nodes
    applyMultitrackGains();

    // Start all at the same time for sample-accurate sync
    var startTime = state.audioContext.currentTime + 0.01;
    state.multitrackSources.forEach(function (src) {
        src.start(startTime);
    });

    // Start stereo visualization
    startStereoVisualization();
}

function stopMultitrackSources() {
    state.multitrackSources.forEach(function (src) {
        if (src) {
            try { src.stop(); } catch (e) { /* already stopped */ }
            try { src.disconnect(); } catch (e) { /* not connected */ }
        }
    });
    state.multitrackSources = [];

    if (state.multitrackMerge) {
        try { state.multitrackMerge.disconnect(state.sourceGain); } catch (e) { /* not connected */ }
    }

    stopStereoVisualization();
}

function applyMultitrackGains() {
    if (!state.audioContext) return;
    var t = state.audioContext.currentTime;
    var anySoloed = (state.multitrackSoloed !== null);

    MULTITRACK_TRACKS.forEach(function (track, i) {
        var effective;
        if (anySoloed) {
            effective = (track.key === state.multitrackSoloed) ? state.multitrackVolumes[i] : 0;
        } else {
            effective = state.multitrackMuted[i] ? 0 : state.multitrackVolumes[i];
        }
        state.multitrackGains[i].gain.setTargetAtTime(effective, t, 0.02);
    });

    updateMultitrackButtons();
}

function toggleMuteTrack(index) {
    state.multitrackMuted[index] = !state.multitrackMuted[index];
    applyMultitrackGains();
}

function toggleSoloTrack(trackKey) {
    if (state.multitrackSoloed === trackKey) {
        state.multitrackSoloed = null;
    } else {
        state.multitrackSoloed = trackKey;
    }
    applyMultitrackGains();
}

function setTrackVolume(index, value) {
    state.multitrackVolumes[index] = value;
    applyMultitrackGains();
}

function setTrackPan(index, value) {
    state.multitrackPans[index] = value;
    if (state.multitrackPanners[index] && state.audioContext) {
        state.multitrackPanners[index].pan.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
}

function buildMultitrackTrackButtons() {
    var container = document.getElementById('track-buttons');
    if (!container) return;
    container.innerHTML = '';

    MULTITRACK_TRACKS.forEach(function (track, i) {
        var strip = document.createElement('div');
        strip.className = 'fid-channel-strip';
        strip.dataset.track = track.key;

        // Track name at top
        var label = document.createElement('span');
        label.className = 'fid-channel-label';
        label.textContent = track.label;

        // M/S buttons row
        var msRow = document.createElement('div');
        msRow.className = 'fid-channel-ms';

        var muteBtn = document.createElement('button');
        muteBtn.type = 'button';
        muteBtn.className = 'fid-channel-btn fid-mute-btn';
        muteBtn.textContent = 'M';
        muteBtn.title = 'Mute ' + track.label;
        muteBtn.addEventListener('click', function () {
            toggleMuteTrack(i);
        });

        var soloBtn = document.createElement('button');
        soloBtn.type = 'button';
        soloBtn.className = 'fid-channel-btn fid-solo-btn';
        soloBtn.textContent = 'S';
        soloBtn.title = 'Solo ' + track.label;
        soloBtn.addEventListener('click', function () {
            toggleSoloTrack(track.key);
        });

        msRow.appendChild(muteBtn);
        msRow.appendChild(soloBtn);

        // Vertical fader with meter
        var faderWrap = document.createElement('div');
        faderWrap.className = 'fid-fader-wrap';

        var meter = document.createElement('canvas');
        meter.className = 'fid-channel-meter';
        meter.dataset.trackIndex = i;

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'fid-channel-fader';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = '1';
        slider.setAttribute('aria-label', track.label + ' volume');
        slider.addEventListener('input', function () {
            setTrackVolume(i, parseFloat(this.value));
        });

        faderWrap.appendChild(meter);
        faderWrap.appendChild(slider);

        // Assemble strip: label → M/S → fader
        strip.appendChild(label);
        strip.appendChild(msRow);
        strip.appendChild(faderWrap);
        container.appendChild(strip);
    });

    updateMultitrackButtons();
}

function updateMultitrackButtons() {
    var anySoloed = (state.multitrackSoloed !== null);

    document.querySelectorAll('.fid-channel-strip').forEach(function (strip) {
        var trackKey = strip.dataset.track;
        var i = MULTITRACK_TRACKS.findIndex(function (t) { return t.key === trackKey; });
        if (i < 0) return;

        var muteBtn = strip.querySelector('.fid-mute-btn');
        var soloBtn = strip.querySelector('.fid-solo-btn');

        if (muteBtn) muteBtn.classList.toggle('active', state.multitrackMuted[i]);
        if (soloBtn) soloBtn.classList.toggle('active', state.multitrackSoloed === trackKey);

        // Dim strips that are effectively silent
        var silent;
        if (anySoloed) {
            silent = (state.multitrackSoloed !== trackKey);
        } else {
            silent = state.multitrackMuted[i];
        }
        strip.classList.toggle('fid-channel-silenced', silent);
    });
}

function updateMultitrackLoadingUI(loading) {
    var loadingEl = document.getElementById('track-loading');
    var buttonsEl = document.getElementById('track-buttons');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
    if (buttonsEl) buttonsEl.classList.toggle('hidden', loading);
}

// Shared buffer for meter RMS calculation
var meterTimeDomainBuf = null;

function drawMultitrackMeters() {
    var canvases = document.querySelectorAll('.fid-channel-meter');
    if (!canvases.length || !state.multitrackAnalysers.length) return;

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    canvases.forEach(function (canvas) {
        var idx = parseInt(canvas.dataset.trackIndex);
        var analyser = state.multitrackAnalysers[idx];
        if (!analyser) return;

        var dpr = window.devicePixelRatio || 1;
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        if (w === 0 || h === 0) return;

        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }

        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Get RMS level
        var bufLen = analyser.frequencyBinCount;
        if (!meterTimeDomainBuf || meterTimeDomainBuf.length !== bufLen) {
            meterTimeDomainBuf = new Float32Array(bufLen);
        }
        analyser.getFloatTimeDomainData(meterTimeDomainBuf);

        var sum = 0;
        for (var s = 0; s < bufLen; s++) {
            sum += meterTimeDomainBuf[s] * meterTimeDomainBuf[s];
        }
        var rms = Math.sqrt(sum / bufLen);
        var db = rms > 0 ? 20 * Math.log10(rms) : -100;

        // Map dB to height (0 dB = full, -60 dB = empty)
        var normalized = Math.max(0, Math.min(1, (db + 60) / 60));
        var meterHeight = normalized * h;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Background track
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, w, h);

        // Meter fill (green, yellow at top, red at very top)
        if (meterHeight > 0) {
            var meterY = h - meterHeight;
            var gradient = ctx.createLinearGradient(0, h, 0, 0);
            gradient.addColorStop(0, isDark ? '#22c55e' : '#16a34a');
            gradient.addColorStop(0.7, isDark ? '#facc15' : '#ca8a04');
            gradient.addColorStop(1, isDark ? '#ef4444' : '#dc2626');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, meterY, w, meterHeight);
        }
    });
}

function startMultitrackMeters() {
    if (state.multitrackMeterAnimId) return;

    function loop() {
        state.multitrackMeterAnimId = requestAnimationFrame(loop);
        drawMultitrackMeters();
    }
    loop();
}

function stopMultitrackMeters() {
    if (state.multitrackMeterAnimId) {
        cancelAnimationFrame(state.multitrackMeterAnimId);
        state.multitrackMeterAnimId = null;
    }
    // Clear meters
    document.querySelectorAll('.fid-channel-meter').forEach(function (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

/**
 * Preload multitrack audio when Multi-track is selected from a dropdown.
 * Creates the audio context if needed and triggers loading + button build.
 */
async function preloadMultitrack() {
    if (hasMultitrackLoaded() || state.multitrackLoading) return;
    if (!state.audioContext) createAudioContext();
    await loadMultitrackAudio();
}

/**
 * Show or hide the multitrack controls based on the active source.
 * In practice mode, checks state.currentSource.
 * In teaching/quiz mode, checks the dropdown value.
 */
function updateMultitrackControlsVisibility() {
    var controls = document.getElementById('multitrack-controls');
    if (!controls) return;

    var wasHidden = controls.classList.contains('hidden');

    var isMultitrack = false;
    if (state.mode === 'practice') {
        isMultitrack = (state.currentSource === 3);
    } else if (state.mode === 'teaching') {
        isMultitrack = (parseInt(document.getElementById('teaching-source-select').value) === 3);
    } else if (state.mode === 'quiz') {
        isMultitrack = (parseInt(document.getElementById('quiz-source-select').value) === 3);
    }

    controls.classList.toggle('hidden', !isMultitrack);

    // Draw idle waveform when controls become visible (needs a frame for layout)
    if (isMultitrack && wasHidden && !state.stereoVizAnimId) {
        requestAnimationFrame(drawStereoWaveformIdle);
    }
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

    // Show/hide multitrack controls
    updateMultitrackControlsVisibility();

    updateSourceButtons();

    // Auto-play for continuous sources
    if (source === 1) {
        await startAudio();
    } else if (source === 3) {
        // Load multi-track audio if not already loaded, then auto-play
        if (!hasMultitrackLoaded()) {
            await loadMultitrackAudio();
        }
        if (hasMultitrackLoaded()) {
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
    slider.style.background = `linear-gradient(90deg, #2563eb 0%, #3b82f6 ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`;
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

    // Set default bandwidth per filter type
    if (type === 'bandpass') {
        state.peakingBW = DEFAULT_BANDPASS_BW;
    } else if (type === 'peaking') {
        state.peakingBW = DEFAULT_PEAKING_BW;
    }

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
    if (BANDWIDTH_FILTERS.includes(state.filterType)) {
        var t = state.audioContext.currentTime;
        state.filter.Q.setTargetAtTime(bwToQ(state.peakingBW), t, 0.02);
    } else if (SLOPE_FILTERS.includes(state.filterType)) {
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

    // Store options for looping
    state._testOptions = options;

    // Ensure audio context
    if (!state.audioContext) createAudioContext();

    // Start audio if not playing
    const wasPlaying = state.isPlaying;
    if (!state.isPlaying) {
        startAudio();
    }

    scheduleTestCycle(wasPlaying);
}

function scheduleTestCycle(wasPlaying) {
    var options = state._testOptions || {};

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

    // Show test indicator
    state.testStartTime = t;
    showTestIndicator();

    // Schedule end of this cycle
    const endTimeout = setTimeout(function () {
        // If looping, restart the cycle
        if (state.testLoop && state.testRunning) {
            scheduleTestCycle(wasPlaying);
            return;
        }

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
        state._testOptions = null;
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
    state._testOptions = null;
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

function setTestLoop(enabled) {
    state.testLoop = enabled;
    var btn = document.getElementById('loop-btn');
    if (btn) btn.classList.toggle('active', enabled);
}

/**
 * Stop a running test sequence and reset all mode buttons to their default labels.
 * Called from event handlers when the user clicks a button that currently says "Stop".
 */
function stopTestSequence() {
    cancelTest();
    stopAudio();

    // Reset teaching button
    document.getElementById('listen-btn').textContent = 'Listen';

    // Reset quiz buttons
    var playBtn = document.getElementById('play-again-btn');
    playBtn.textContent = 'Play Again';
    playBtn.disabled = !state.quizAnswer;
    updateSubmitButton();
}

function showTestIndicator() {
    const indicator = document.getElementById('test-indicator');
    indicator.classList.remove('hidden');

    // Cancel any existing animation frame to avoid stacking when looping
    if (state.testAnimationId) {
        cancelAnimationFrame(state.testAnimationId);
        state.testAnimationId = null;
    }

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

            // In quiz mode, capture spectrum snapshot mid-way through filtered phase
            if (state.mode === 'quiz' && state.testPhase === 'filter' && state.spectrumAnalyser) {
                // Delay capture by 1s to let the analyser settle
                setTimeout(function () {
                    if (state.testPhase === 'filter') {
                        var bands = getSpectrumBands(state.spectrumAnalyser);
                        var refBands = getSpectrumBands(state.spectrumRefAnalyser);
                        var refPeak = -Infinity;
                        if (refBands) {
                            for (var r = 0; r < refBands.length; r++) {
                                if (refBands[r] > refPeak) refPeak = refBands[r];
                            }
                        }
                        state.quizSpectrumSnapshot = bands ? { bands: new Float32Array(bands), refPeakDb: refPeak } : null;
                    }
                }, 1000);
            }
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
    var listenBtn = document.getElementById('listen-btn');

    var source = parseInt(document.getElementById('teaching-source-select').value);
    if (source === 2 && !state.userAudioBuffer) {
        alert('Upload an audio file first (switch to Practice mode to upload).');
        return;
    }
    if (source === 3 && !hasMultitrackLoaded()) {
        // Try to load it on the fly
        if (!state.audioContext) createAudioContext();
        await loadMultitrackAudio();
        if (!hasMultitrackLoaded()) return;
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

    // Toggle button to Stop
    listenBtn.textContent = 'Stop';

    // Run the bypass/filter/bypass sequence, mute after
    runTest({
        alwaysStop: true,
        onEnd: function () {
            listenBtn.textContent = 'Listen';
        }
    });
}

// ============================================
// Quiz Mode
// ============================================

async function newQuestion() {
    var submitBtn = document.getElementById('submit-answer-btn');
    var playBtn = document.getElementById('play-again-btn');

    const drill = QUIZ_DRILLS[state.quizDrill];
    const prev = state.quizPreviousAnswer;

    // Pick random parameters, avoiding exact repeat of previous question
    var type, freq, gain, attempts = 0;
    do {
        type = drill.fixedType || drill.types[Math.floor(Math.random() * drill.types.length)];
        var freqPool = drill.freqs || FREQUENCIES;
        freq = drill.fixedFreq || freqPool[Math.floor(Math.random() * freqPool.length)];
        gain = null;
        if (!PASS_FILTERS.includes(type)) {
            var gainPool = drill.gains || GAINS;
            // Filter by boost/cut direction preference
            if (state.quizGainDirection === 'boost') {
                gainPool = gainPool.filter(function (g) { return g > 0; });
            } else if (state.quizGainDirection === 'cut') {
                gainPool = gainPool.filter(function (g) { return g < 0; });
            }
            gain = gainPool[Math.floor(Math.random() * gainPool.length)];
        }
        attempts++;
    } while (prev && attempts < 20 &&
        type === prev.type && freq === prev.freq && gain === prev.gain);

    state.quizAnswer = { type: type, freq: freq, gain: gain };
    state.quizPreviousAnswer = { type: type, freq: freq, gain: gain };
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

    // Hide result, reset comparison to blank labels
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('filter-header').classList.add('hidden');
    var compareEl = document.getElementById('quiz-compare');
    compareEl.classList.remove('hidden');
    var userLabel = document.getElementById('compare-user-label');
    var correctLabel = document.getElementById('compare-correct-label');
    userLabel.textContent = 'Your Answer';
    correctLabel.textContent = 'Correct';
    userLabel.className = 'fid-compare-label';
    correctLabel.className = 'fid-compare-label';
    var flatConfig = { type: 'peaking', freq: 1000, gain: 0 };
    requestAnimationFrame(function () {
        drawFilterConfigToCanvas(document.getElementById('compare-user-canvas'), flatConfig, null);
        drawFilterConfigToCanvas(document.getElementById('compare-correct-canvas'), flatConfig, null);
    });

    // Clear spectrum snapshot
    state.quizSpectrumSnapshot = null;

    // Enable submit (will check selections before allowing)
    updateSubmitButton();

    // Set source from quiz dropdown and run test sequence
    var quizSource = parseInt(document.getElementById('quiz-source-select').value);
    if (quizSource === 2 && !state.userAudioBuffer) {
        alert('Upload an audio file first (switch to Practice mode to upload).');
        return;
    }
    if (quizSource === 3 && !hasMultitrackLoaded()) {
        await loadMultitrackAudio();
        if (!hasMultitrackLoaded()) return;
    }

    // Switch to the quiz source (without auto-playing pink noise)
    if (state.isPlaying) stopAudio();
    state.currentSource = quizSource;
    updateGainForSource(quizSource);

    // Play Again becomes Stop during playback; submit shows Submit Answer (disabled until selections)
    playBtn.textContent = 'Stop';
    playBtn.disabled = false;
    updateSubmitButton();

    // Run the test sequence, mute after
    runTest({
        alwaysStop: true,
        onEnd: function () {
            playBtn.textContent = 'Play Again';
            playBtn.disabled = false;
        }
    });
}

async function playAgain() {
    var submitBtn = document.getElementById('submit-answer-btn');
    var playBtn = document.getElementById('play-again-btn');

    if (!state.quizAnswer) return;

    var quizSource = parseInt(document.getElementById('quiz-source-select').value);
    if (quizSource === 2 && !state.userAudioBuffer) return;
    if (quizSource === 3 && !hasMultitrackLoaded()) {
        await loadMultitrackAudio();
        if (!hasMultitrackLoaded()) return;
    }

    // Ensure source is set
    if (state.isPlaying) stopAudio();
    state.currentSource = quizSource;
    updateGainForSource(quizSource);

    // Play Again becomes Stop during playback
    playBtn.textContent = 'Stop';
    playBtn.disabled = false;

    runTest({
        alwaysStop: true,
        onEnd: function () {
            playBtn.textContent = 'Play Again';
        }
    });
}

function updateQuizParamVisibility(drill) {
    var typeGroup = document.querySelector('#type-buttons').closest('.fid-param-group');
    var freqGroup = document.querySelector('#freq-buttons').closest('.fid-param-group');
    var gainGroup = document.getElementById('gain-group');

    // Type: hide if not a guess field (e.g., fixed type in Frequencies drill)
    if (!drill.guessFields.includes('type')) {
        typeGroup.classList.add('hidden');
    } else {
        typeGroup.classList.remove('hidden');
    }

    // Frequency: hide if not a guess field (e.g., fixed at 1 kHz)
    if (!drill.guessFields.includes('freq')) {
        freqGroup.classList.add('hidden');
    } else {
        freqGroup.classList.remove('hidden');
    }

    // Gain: show/hide based on whether gain is guessable
    if (!drill.guessFields.includes('gain')) {
        gainGroup.classList.add('hidden');
    } else if (drill.fixedType) {
        // Fixed type drill: show gain immediately if type has gain, hide if pass filter
        if (PASS_FILTERS.includes(drill.fixedType)) {
            gainGroup.classList.add('hidden');
        } else {
            gainGroup.classList.remove('hidden');
        }
    } else {
        // User picks type: start hidden, will show when user picks a non-pass type
        gainGroup.classList.add('hidden');
    }

    // Filter gain buttons to only show drill-relevant values + direction
    var drillGains = drill.gains || GAINS;
    var dir = state.quizGainDirection;
    var selectableGainBtns = [];
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        var val = parseInt(btn.dataset.gain);
        var inDrill = drillGains.includes(val);
        var inDir = dir === 'both' || (dir === 'boost' && val > 0) || (dir === 'cut' && val < 0);
        if (inDrill && inDir) {
            btn.classList.remove('hidden');
            btn.disabled = false;
            selectableGainBtns.push(btn);
        } else if (inDrill) {
            // Show but disable (e.g., -12 dB visible but greyed out in boost-only)
            btn.classList.remove('hidden');
            btn.disabled = true;
            btn.classList.remove('active');
        } else {
            btn.classList.add('hidden');
        }
    });

    // Auto-select and lock if only one selectable gain button
    if (selectableGainBtns.length === 1) {
        var autoGain = parseInt(selectableGainBtns[0].dataset.gain);
        selectableGainBtns[0].disabled = true;
        handleQuizGainSelection(autoGain);
    }

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

function updateGainDirVisibility(drill) {
    var label = document.getElementById('quiz-gain-dir-label');
    // Show if drill can produce gain-bearing filters
    var hasGainFilters = drill.types.some(function (t) { return !PASS_FILTERS.includes(t); });
    // If drill has a fixed type that's a pass filter, hide
    if (drill.fixedType && PASS_FILTERS.includes(drill.fixedType)) {
        hasGainFilters = false;
    }
    label.classList.toggle('hidden', !hasGainFilters);
}

function clearSelectionButtons() {
    document.querySelectorAll('#type-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
        btn.disabled = false;
    });
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
        btn.disabled = false;
    });
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('active');
        btn.disabled = false;
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
    if (state.quizRevealed) {
        btn.textContent = 'New Question';
        btn.disabled = false;
        return;
    }
    if (!state.quizAnswer) {
        btn.textContent = 'New Question';
        btn.disabled = false;
        return;
    }
    btn.textContent = 'Submit Answer';

    const sel = state.quizSelection;
    const drill = QUIZ_DRILLS[state.quizDrill];
    const fields = drill.guessFields;

    var ready = true;
    if (fields.includes('type') && !sel.type) ready = false;
    if (fields.includes('freq') && !sel.freq) ready = false;
    var effectiveType = sel.type || drill.fixedType;
    if (fields.includes('gain') && effectiveType && !PASS_FILTERS.includes(effectiveType) && sel.gain === null) ready = false;

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

    // Show the comparison view
    showQuizComparison(allCorrect);
}

function showQuizComparison(allCorrect) {
    var answer = state.quizAnswer;
    var sel = state.quizSelection;
    var drill = QUIZ_DRILLS[state.quizDrill];
    var spectrum = state.quizSpectrumSnapshot;

    // Build the user's guess config
    var effectiveType = sel.type || drill.fixedType || 'peaking';
    var userConfig = {
        type: effectiveType,
        freq: sel.freq || (drill.fixedFreq || answer.freq),
        gain: sel.gain !== null ? sel.gain : (PASS_FILTERS.includes(effectiveType) ? null : 0)
    };
    // For drills with fixed freq, use that freq for the user's config too
    if (drill.fixedFreq) {
        userConfig.freq = drill.fixedFreq;
    }

    // Show comparison with answer details
    document.getElementById('filter-header').classList.add('hidden');
    var compareEl = document.getElementById('quiz-compare');
    compareEl.classList.remove('hidden');

    // Label the panels
    var userLabel = document.getElementById('compare-user-label');
    var correctLabel = document.getElementById('compare-correct-label');

    var userDesc = formatFilterName(userConfig.type) + ' at ' + formatFreq(userConfig.freq);
    if (userConfig.gain !== null && !PASS_FILTERS.includes(userConfig.type)) {
        userDesc += ', ' + (userConfig.gain > 0 ? '+' : '') + userConfig.gain + ' dB';
    }
    var correctDesc = formatFilterName(answer.type) + ' at ' + formatFreq(answer.freq);
    if (answer.gain !== null && !PASS_FILTERS.includes(answer.type)) {
        correctDesc += ', ' + (answer.gain > 0 ? '+' : '') + answer.gain + ' dB';
    }

    userLabel.textContent = 'Your Answer: ' + userDesc;
    correctLabel.textContent = 'Correct: ' + correctDesc;

    userLabel.className = 'fid-compare-label ' + (allCorrect ? 'correct' : 'incorrect');
    correctLabel.className = 'fid-compare-label correct';

    // Render both canvases (use requestAnimationFrame to ensure layout is computed)
    requestAnimationFrame(function () {
        drawFilterConfigToCanvas(
            document.getElementById('compare-user-canvas'),
            userConfig,
            spectrum
        );
        drawFilterConfigToCanvas(
            document.getElementById('compare-correct-canvas'),
            answer,
            spectrum
        );
    });
}

function formatFilterName(type) {
    var names = {
        highpass: 'High-Pass',
        lowpass: 'Low-Pass',
        highshelf: 'High Shelf',
        lowshelf: 'Low Shelf',
        peaking: 'Peaking',
        bandpass: 'Bandpass'
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
    if (state.testRunning) stopTestSequence();
    if (state.isPlaying) stopAudio();

    state.mode = mode;

    const app = document.querySelector('.fid-app');
    const filterHeader = document.getElementById('filter-header');
    const teachingControls = document.getElementById('teaching-controls');
    const quizControls = document.getElementById('quiz-controls');
    const quizSubmit = document.getElementById('quiz-submit');

    // Hide everything first
    app.classList.remove('quiz-mode', 'teaching-mode');
    filterHeader.classList.add('hidden');
    teachingControls.classList.add('hidden');
    quizControls.classList.add('hidden');
    quizSubmit.classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-compare').classList.add('hidden');

    // Restore all buttons visible (drills may have hidden some)
    restoreAllButtons();

    if (mode === 'practice') {
        filterHeader.classList.remove('hidden');

        // Restore practice state: re-apply filter from current selections
        setFilterType(state.filterType);
        setFilterFreq(state.filterFreq);
        setFilterGainDb(state.filterGainDb);

    } else if (mode === 'teaching') {
        app.classList.add('teaching-mode');
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

        // Show comparison view with blank labels and flat canvases
        var compareEl = document.getElementById('quiz-compare');
        compareEl.classList.remove('hidden');
        var userLabel = document.getElementById('compare-user-label');
        var correctLabel = document.getElementById('compare-correct-label');
        userLabel.textContent = 'Your Answer';
        correctLabel.textContent = 'Correct';
        userLabel.className = 'fid-compare-label';
        correctLabel.className = 'fid-compare-label';

        clearSelectionButtons();
        updateSubmitButton();

        // Draw blank canvases (flat 0 dB response)
        var flatConfig = { type: 'peaking', freq: 1000, gain: 0 };
        requestAnimationFrame(function () {
            drawFilterConfigToCanvas(document.getElementById('compare-user-canvas'), flatConfig, null);
            drawFilterConfigToCanvas(document.getElementById('compare-correct-canvas'), flatConfig, null);
        });
    }

    // Show multitrack controls if Multi-track is selected in the mode's dropdown
    updateMultitrackControlsVisibility();

    updateModeButtons();
}

function restoreAllButtons() {
    document.querySelectorAll('#freq-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('hidden');
        btn.disabled = false;
    });
    document.querySelectorAll('#gain-buttons .fid-toggle').forEach(function (btn) {
        btn.classList.remove('hidden');
        btn.disabled = false;
    });
    document.querySelector('#freq-buttons').closest('.fid-param-group').classList.remove('hidden');
}

// ============================================
// UI Update Functions
// ============================================

function updateSourceButtons() {
    document.querySelectorAll('.fid-toolbar [data-source]').forEach(function (btn) {
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
    document.querySelectorAll('.fid-toolbar [data-mode]').forEach(function (btn) {
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

    if (SLOPE_FILTERS.includes(state.filterType)) {
        slopeGroup.classList.remove('hidden');
        bwGroup.classList.add('hidden');
        shelfQGroup.classList.add('hidden');
    } else if (BANDWIDTH_FILTERS.includes(state.filterType)) {
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

    if (BANDWIDTH_FILTERS.includes(state.filterType)) {
        var q = bwToQ(state.peakingBW);
        readout.textContent = 'Q = ' + q.toFixed(2) + '  (BW = ' + state.peakingBW + ' oct)';
        readout.classList.remove('hidden');
    } else if (SLOPE_FILTERS.includes(state.filterType)) {
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
    if (state.audioContext && SLOPE_FILTERS.includes(state.filterType)) {
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

// ============================================
// 64-Band Spectrum Analyser
// ============================================

// 64 logarithmically spaced center frequencies (20 Hz – 20 kHz)
const SPECTRUM_NUM_BANDS = 64;
const SPECTRUM_BANDS = (function () {
    var bands = [];
    var logMin = Math.log(20);
    var logMax = Math.log(20000);
    for (var i = 0; i < SPECTRUM_NUM_BANDS; i++) {
        bands.push(Math.exp(logMin + (i / (SPECTRUM_NUM_BANDS - 1)) * (logMax - logMin)));
    }
    return bands;
})();

// Band edges: geometric mean between adjacent centers
const SPECTRUM_EDGES = (function () {
    var edges = [];
    edges.push(SPECTRUM_BANDS[0] / Math.pow(SPECTRUM_BANDS[1] / SPECTRUM_BANDS[0], 0.5));
    for (var i = 0; i < SPECTRUM_BANDS.length - 1; i++) {
        edges.push(Math.sqrt(SPECTRUM_BANDS[i] * SPECTRUM_BANDS[i + 1]));
    }
    edges.push(SPECTRUM_BANDS[SPECTRUM_BANDS.length - 1] * Math.pow(SPECTRUM_BANDS[SPECTRUM_BANDS.length - 1] / SPECTRUM_BANDS[SPECTRUM_BANDS.length - 2], 0.5));
    return edges;
})();

// Reusable buffers for FFT data (allocated once)
var spectrumDataArray = null;
var spectrumRefDataArray = null;

function getSpectrumBands(analyser) {
    if (!analyser) return null;

    var bufferLength = analyser.frequencyBinCount;

    if (!spectrumDataArray || spectrumDataArray.length !== bufferLength) {
        spectrumDataArray = new Float32Array(bufferLength);
    }

    analyser.getFloatFrequencyData(spectrumDataArray);

    var sampleRate = state.audioContext.sampleRate;
    var binWidth = sampleRate / analyser.fftSize;
    var bandLevels = new Float32Array(SPECTRUM_BANDS.length);

    for (var b = 0; b < SPECTRUM_BANDS.length; b++) {
        var lowBin = Math.max(1, Math.floor(SPECTRUM_EDGES[b] / binWidth));
        var highBin = Math.min(bufferLength - 1, Math.ceil(SPECTRUM_EDGES[b + 1] / binWidth));

        var sum = 0;
        var count = 0;
        for (var i = lowBin; i <= highBin; i++) {
            sum += spectrumDataArray[i];
            count++;
        }
        bandLevels[b] = count > 0 ? sum / count : -100;
    }

    return bandLevels;
}

// Smoothed reference peak (from pre-filter signal) for stable normalization
var spectrumRefPeakDb = -100;

function drawSpectrumBars(ctx, plotWidth, plotHeight, pad, isDark) {
    // Get post-filter spectrum (what the user hears)
    var bandLevels = getSpectrumBands(state.spectrumAnalyser);
    if (!bandLevels) return;

    // Get pre-filter spectrum for reference normalization
    var refLevels = getSpectrumBands(state.spectrumRefAnalyser);
    var refPeakDb = -Infinity;
    if (refLevels) {
        for (var r = 0; r < refLevels.length; r++) {
            if (refLevels[r] > refPeakDb) refPeakDb = refLevels[r];
        }
    }
    if (refPeakDb < -100) return;

    // Smooth the reference peak: rise fast, fall slowly
    if (refPeakDb > spectrumRefPeakDb) {
        spectrumRefPeakDb = refPeakDb;
    } else {
        spectrumRefPeakDb += (refPeakDb - spectrumRefPeakDb) * 0.02;
    }

    // Normalize against the pre-filter peak so the filter's effect is visible:
    // unfiltered bands reach full height, filtered bands drop proportionally
    var dynamicRange = 60;
    var maxDb = spectrumRefPeakDb + 3;
    var minDb = maxDb - dynamicRange;
    var barColor = isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(37, 99, 235, 0.15)';
    var gap = 1;

    ctx.fillStyle = barColor;

    for (var b = 0; b < SPECTRUM_BANDS.length; b++) {
        var x1 = pad.left + freqToX(Math.max(SPECTRUM_EDGES[b], VIZ_MIN_FREQ), plotWidth);
        var x2 = pad.left + freqToX(Math.min(SPECTRUM_EDGES[b + 1], VIZ_MAX_FREQ), plotWidth);
        var barWidth = x2 - x1;
        if (barWidth < 1) barWidth = 1;

        var normalized = Math.max(0, Math.min(1, (bandLevels[b] - minDb) / dynamicRange));
        var barHeight = normalized * plotHeight;
        var barY = pad.top + plotHeight - barHeight;

        ctx.fillRect(x1 + gap / 2, barY, barWidth - gap, barHeight);
    }
}

function startSpectrumAnimation() {
    if (state.spectrumAnimId) return;
    if (!state.spectrumEnabled) return;

    function draw() {
        state.spectrumAnimId = requestAnimationFrame(draw);
        drawFilterCanvas(true);
    }
    draw();
}

function stopSpectrumAnimation() {
    if (state.spectrumAnimId) {
        cancelAnimationFrame(state.spectrumAnimId);
        state.spectrumAnimId = null;
    }
    spectrumRefPeakDb = -100; // reset smoothed peak for next session
    drawFilterCanvas();
}

function drawFilterCanvas(fromAnimLoop) {
    // When the spectrum animation loop is running, skip redundant calls
    // from filter controls etc. — the next rAF frame will pick up the changes.
    // This prevents double-draws that cause flickering.
    if (!fromAnimLoop && state.spectrumAnimId) return;

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

    // In quiz mode before reveal: show only the grid (no curve, no spectrum)
    if (state.mode === 'quiz' && !state.quizRevealed) {
        return;
    }

    // Spectrum bars (behind filter curve)
    if (state.spectrumEnabled && state.spectrumAnalyser && state.isPlaying) {
        drawSpectrumBars(ctx, plotWidth, plotHeight, pad, isDark);
    }

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
        // HP/LP/Peaking/Bandpass: use BiquadFilterNode.getFrequencyResponse
        if (!state.vizContext) {
            state.vizContext = new OfflineAudioContext(1, 1, 44100);
        }
        var vf = state.vizContext.createBiquadFilter();
        vf.type = state.filterType;
        vf.frequency.value = state.filterFreq;
        vf.gain.value = PASS_FILTERS.includes(state.filterType) ? 0 : state.filterGainDb;

        if (BANDWIDTH_FILTERS.includes(state.filterType)) {
            vf.Q.value = bwToQ(state.peakingBW);
        } else {
            vf.Q.value = 0.7071; // placeholder for per-stage Butterworth
        }

        if (SLOPE_FILTERS.includes(state.filterType)) {
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
            // Peaking / Bandpass: single stage
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

/**
 * Render a specific filter config + optional frozen spectrum to any canvas.
 * Used for the quiz comparison view.
 * @param {HTMLCanvasElement} canvas
 * @param {object} config - { type, freq, gain }
 * @param {object|null} spectrum - { bands: Float32Array, refPeakDb: number } or null
 * @param {string} accentOverride - optional accent color for the curve
 */
function drawFilterConfigToCanvas(canvas, config, spectrum, accentOverride) {
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

    // Frozen spectrum bars
    if (spectrum && spectrum.bands) {
        var dynamicRange = 60;
        var maxDb = spectrum.refPeakDb + 3;
        var minDb = maxDb - dynamicRange;
        var barColor = isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(37, 99, 235, 0.15)';
        ctx.fillStyle = barColor;

        for (var b = 0; b < SPECTRUM_BANDS.length && b < spectrum.bands.length; b++) {
            var x1 = pad.left + freqToX(Math.max(SPECTRUM_EDGES[b], VIZ_MIN_FREQ), plotWidth);
            var x2 = pad.left + freqToX(Math.min(SPECTRUM_EDGES[b + 1], VIZ_MAX_FREQ), plotWidth);
            var barWidth = x2 - x1;
            if (barWidth < 1) barWidth = 1;
            var normalized = Math.max(0, Math.min(1, (spectrum.bands[b] - minDb) / dynamicRange));
            var barHeight = normalized * plotHeight;
            var barY = pad.top + plotHeight - barHeight;
            ctx.fillRect(x1 + 0.5, barY, barWidth - 1, barHeight);
        }
    }

    // Compute frequency response for this config
    var magResponse = new Float32Array(VIZ_NUM_POINTS);
    var phaseResponse = new Float32Array(VIZ_NUM_POINTS);
    var filterType = config.type;
    var filterFreq = config.freq;
    var filterGainDb = config.gain !== null ? config.gain : 0;

    if (SHELF_FILTERS.includes(filterType)) {
        var vizCoeffs = computeShelfCoefficients(filterType, filterFreq, filterGainDb, 1, 44100);
        magResponse = computeIIRFrequencyResponse(vizCoeffs.feedforward, vizCoeffs.feedback, vizFreqArray, 44100);
    } else {
        if (!state.vizContext) {
            state.vizContext = new OfflineAudioContext(1, 1, 44100);
        }
        var vf = state.vizContext.createBiquadFilter();
        vf.type = filterType;
        vf.frequency.value = filterFreq;
        vf.gain.value = PASS_FILTERS.includes(filterType) ? 0 : filterGainDb;

        if (BANDWIDTH_FILTERS.includes(filterType)) {
            vf.Q.value = bwToQ(2); // default 2 octave bandwidth
        } else {
            vf.Q.value = 0.7071;
        }

        if (SLOPE_FILTERS.includes(filterType)) {
            var numStages = 1; // default 12 dB/oct for quiz display
            var qValues = BUTTERWORTH_Q[numStages] || BUTTERWORTH_Q[1];
            var tempMag = new Float32Array(VIZ_NUM_POINTS);
            var tempPhase = new Float32Array(VIZ_NUM_POINTS);
            for (var si = 0; si < VIZ_NUM_POINTS; si++) magResponse[si] = 1.0;
            for (var stage = 0; stage < numStages; stage++) {
                vf.Q.value = qValues[stage];
                vf.getFrequencyResponse(vizFreqArray, tempMag, tempPhase);
                for (var si2 = 0; si2 < VIZ_NUM_POINTS; si2++) magResponse[si2] *= tempMag[si2];
            }
        } else {
            vf.getFrequencyResponse(vizFreqArray, magResponse, phaseResponse);
        }
    }

    // Draw curve
    var accentColor = accentOverride || (isDark ? '#60a5fa' : '#2563eb');
    var fillColor = isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(37, 99, 235, 0.08)';

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    var zeroY = pad.top + gainToY(0, plotHeight);

    for (var i = 0; i < VIZ_NUM_POINTS; i++) {
        var x = pad.left + (i / (VIZ_NUM_POINTS - 1)) * plotWidth;
        var gainDb2 = 20 * Math.log10(magResponse[i]);
        gainDb2 = Math.max(VIZ_MIN_GAIN, Math.min(VIZ_MAX_GAIN, gainDb2));
        var y = pad.top + gainToY(gainDb2, plotHeight);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }

    ctx.stroke();

    var lastX = pad.left + plotWidth;
    ctx.lineTo(lastX, zeroY);
    ctx.lineTo(pad.left, zeroY);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
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
// Stereo Waveform Visualization
// ============================================

function drawStereoWaveformIdle() {
    var silence = new Float32Array(1024);
    drawStereoWaveform(silence, silence);
}

function startStereoVisualization() {
    if (state.stereoVizAnimId) return;
    if (!state.stereoAnalyserL || !state.stereoAnalyserR) return;

    var bufferLength = state.stereoAnalyserL.frequencyBinCount;
    var leftData = new Float32Array(bufferLength);
    var rightData = new Float32Array(bufferLength);

    function draw() {
        state.stereoVizAnimId = requestAnimationFrame(draw);
        state.stereoAnalyserL.getFloatTimeDomainData(leftData);
        state.stereoAnalyserR.getFloatTimeDomainData(rightData);
        drawStereoWaveform(leftData, rightData);
    }

    draw();
}

function stopStereoVisualization() {
    if (state.stereoVizAnimId) {
        cancelAnimationFrame(state.stereoVizAnimId);
        state.stereoVizAnimId = null;
    }
}

function drawStereoWaveform(leftData, rightData) {
    var canvas = document.getElementById('stereo-viz-canvas');
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

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    var halfH = h / 2;

    // Center divider
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, halfH);
    ctx.lineTo(w, halfH);
    ctx.stroke();

    // L/R labels
    ctx.font = '9px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)';
    ctx.textAlign = 'left';
    ctx.fillText('L', 4, 12);
    ctx.fillText('R', 4, halfH + 12);

    // Draw channels
    var leftColor = isDark ? '#60a5fa' : '#2563eb';
    var rightColor = isDark ? '#34d399' : '#10b981';
    drawWaveformChannel(ctx, leftData, 0, halfH, w, leftColor);
    drawWaveformChannel(ctx, rightData, halfH, halfH, w, rightColor);
}

function drawWaveformChannel(ctx, data, yOffset, height, width, color) {
    var centerY = yOffset + height / 2;
    var amplitude = height / 2 * 0.85;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (var i = 0; i < width; i++) {
        var idx = Math.floor(i * data.length / width);
        var val = data[idx];
        var y = centerY - val * amplitude;

        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }

    ctx.stroke();
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
    document.querySelectorAll('.fid-toolbar [data-source]').forEach(function (btn) {
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

    // Spectrum analyser toggle
    document.getElementById('spectrum-btn').addEventListener('click', function () {
        state.spectrumEnabled = !state.spectrumEnabled;
        this.classList.toggle('active', state.spectrumEnabled);
        this.textContent = state.spectrumEnabled ? 'On' : 'Off';
        if (state.spectrumEnabled && state.isPlaying) {
            startSpectrumAnimation();
        } else {
            stopSpectrumAnimation();
        }
    });

    // Teaching mode: Listen button (doubles as Stop during playback)
    document.getElementById('listen-btn').addEventListener('click', function () {
        if (state.testRunning) {
            stopTestSequence();
            return;
        }
        if (!state.audioContext) createAudioContext();
        teachingListen();
    });

    // Loop toggle button (teaching mode)
    document.getElementById('loop-btn').addEventListener('click', function () {
        setTestLoop(!state.testLoop);
    });

    // Source dropdowns: show/hide multitrack controls + preload on change
    document.getElementById('teaching-source-select').addEventListener('change', function () {
        updateMultitrackControlsVisibility();
        var isMultitrack = parseInt(this.value) === 3;
        if (isMultitrack) preloadMultitrack();
        // Auto-enable loop for multi-track
        setTestLoop(isMultitrack);
    });
    document.getElementById('quiz-source-select').addEventListener('change', function () {
        updateMultitrackControlsVisibility();
        if (parseInt(this.value) === 3) preloadMultitrack();
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
    document.querySelectorAll('.fid-toolbar [data-mode]').forEach(function (btn) {
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
        // Show/hide drill frequency picker (label wraps the select)
        var drillFreqLabel = document.getElementById('quiz-drill-freq-label');
        if (drill.userPicksFreq) {
            drillFreqLabel.classList.remove('hidden');
        } else {
            drillFreqLabel.classList.add('hidden');
        }
        // Show/hide drill type picker
        var drillTypeLabel = document.getElementById('quiz-drill-type-label');
        if (drill.userPicksType) {
            drillTypeLabel.classList.remove('hidden');
        } else {
            drillTypeLabel.classList.add('hidden');
        }
        // Show/hide gain direction picker
        updateGainDirVisibility(drill);
    });

    // Drill frequency picker (for "Filter Types" drill)
    document.getElementById('quiz-drill-freq').addEventListener('change', function () {
        var drill = QUIZ_DRILLS[state.quizDrill];
        if (drill.userPicksFreq) {
            drill.fixedFreq = parseInt(this.value);
        }
    });

    // Drill type picker (for "Frequencies" drill)
    document.getElementById('quiz-drill-type').addEventListener('change', function () {
        var drill = QUIZ_DRILLS[state.quizDrill];
        if (drill.userPicksType) {
            drill.fixedType = this.value;
            // Update gain visibility based on new type
            var gainGroup = document.getElementById('gain-group');
            if (drill.guessFields.includes('gain') && !PASS_FILTERS.includes(this.value)) {
                gainGroup.classList.remove('hidden');
            } else {
                gainGroup.classList.add('hidden');
            }
            // Update gain direction picker visibility
            updateGainDirVisibility(drill);
        }
    });

    // Gain direction picker (boost/cut/both)
    document.getElementById('quiz-gain-dir').addEventListener('change', function () {
        state.quizGainDirection = this.value;
        // Refresh gain button visibility
        var drill = QUIZ_DRILLS[state.quizDrill];
        updateQuizParamVisibility(drill);
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

    // Submit / New Question toggle button
    document.getElementById('submit-answer-btn').addEventListener('click', function () {
        if (state.quizRevealed || !state.quizAnswer) {
            // In "New Question" state
            if (!state.audioContext) createAudioContext();
            newQuestion();
        } else {
            submitAnswer();
        }
    });

    // Play again button (doubles as Stop during playback)
    document.getElementById('play-again-btn').addEventListener('click', function () {
        if (state.testRunning) {
            stopTestSequence();
            return;
        }
        if (!state.audioContext) createAudioContext();
        playAgain();
    });

    // Demo tour button
    document.getElementById('demo-btn').addEventListener('click', function () {
        Tour.start();
    });

}

// ============================================
// Practice Demo Tour
// ============================================

var Tour = {
    steps: [
        {
            target: null,
            title: 'Welcome',
            text: 'Filter Identification is an ear training tool. You\'ll learn to recognize different filter types and frequencies by listening to how they shape audio. Let\'s walk through the controls.'
        },
        {
            target: '.fid-toolbar-row:first-child',
            title: 'Mode',
            text: 'There are three modes. <strong>Practice</strong> gives you direct control of all parameters. <strong>Teaching</strong> plays a listen sequence so you can hear the difference. <strong>Quiz</strong> tests your ability to identify a hidden filter.'
        },
        {
            target: '.fid-source-row',
            title: 'Source',
            text: 'Choose your audio source. <strong>Pink Noise</strong> is ideal for hearing filter shapes because it has equal energy per octave. You can also upload your own audio, use built-in multi-track stems, or a synthetic sawtooth tone.'
        },
        {
            target: '.fid-filter-header',
            title: 'Filter Display',
            text: 'This canvas shows the filter\'s frequency response. The horizontal axis is frequency (20 Hz to 20 kHz, logarithmic). The vertical axis is gain in dB. The curve shows how the filter boosts or cuts each frequency.'
        },
        {
            target: '#type-group',
            title: 'Filter Type',
            text: 'Select a filter type. <strong>High-Pass</strong> and <strong>Low-Pass</strong> remove frequencies below or above the cutoff. <strong>Shelving</strong> filters boost or cut a range. <strong>Peaking</strong> targets a band around the center frequency. <strong>Bandpass</strong> isolates a narrow range.'
        },
        {
            target: '#freq-group',
            title: 'Frequency',
            text: 'Pick the center or cutoff frequency. The hints below each button show what a narrow boost at that frequency sounds like in pink noise. Try saying the vowel sounds while you listen.'
        },
        {
            target: '#gain-group',
            title: 'Gain',
            text: 'Set how much the filter boosts or cuts. Positive values boost, negative values cut. Try extreme settings first (+12 or -12 dB) to make the effect obvious, then move to subtler settings.'
        },
        {
            target: null,
            title: 'Ready',
            text: 'You\'re ready to start. Select a source, press Play, and experiment with different filter settings. When you\'re comfortable identifying filters by ear, try <strong>Teaching</strong> mode for guided listening or <strong>Quiz</strong> mode to test yourself.'
        }
    ],
    currentStep: 0,
    overlayEl: null,
    cardEl: null,
    prevHighlight: null,

    start: function () {
        // Switch to practice mode
        if (state.mode !== 'practice') {
            setMode('practice');
        }

        // Make sure gain group is visible for the tour
        document.getElementById('gain-group').classList.remove('hidden');

        this.currentStep = 0;
        this.createElements();
        this.showStep(0);
    },

    createElements: function () {
        // Overlay
        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'fid-tour-overlay';
        this.overlayEl.addEventListener('click', this.skip.bind(this));
        document.body.appendChild(this.overlayEl);

        // Card
        this.cardEl = document.createElement('div');
        this.cardEl.className = 'fid-tour-card';
        document.body.appendChild(this.cardEl);
    },

    showStep: function (index) {
        var step = this.steps[index];
        if (!step) { this.cleanup(); return; }
        this.currentStep = index;

        // Remove previous highlight
        if (this.prevHighlight) {
            this.prevHighlight.classList.remove('fid-tour-highlight');
            this.prevHighlight = null;
        }

        // Build card content
        var isLast = index === this.steps.length - 1;
        var html = '<div class="fid-tour-step">Step ' + (index + 1) + ' of ' + this.steps.length + '</div>';
        html += '<h3>' + step.title + '</h3>';
        html += '<p>' + step.text + '</p>';
        html += '<div class="fid-tour-actions">';
        html += '<button type="button" class="fid-tour-skip">Skip</button>';
        html += '<button type="button" class="fid-tour-next">' + (isLast ? 'Done' : 'Next') + '</button>';
        html += '</div>';
        this.cardEl.innerHTML = html;

        // Wire buttons
        var self = this;
        this.cardEl.querySelector('.fid-tour-skip').addEventListener('click', function () { self.skip(); });
        this.cardEl.querySelector('.fid-tour-next').addEventListener('click', function () {
            if (isLast) { self.cleanup(); } else { self.next(); }
        });

        // Highlight target
        if (step.target) {
            var el = document.querySelector(step.target);
            if (el) {
                el.classList.add('fid-tour-highlight');
                this.prevHighlight = el;
                // Hide overlay (box-shadow on highlight creates its own)
                this.overlayEl.style.display = 'none';
                // Scroll so the element sits ~15% down the viewport (above the card at 60%)
                var rect = el.getBoundingClientRect();
                var targetY = window.innerHeight * 0.15;
                var scrollTo = window.scrollY + rect.top - targetY;
                window.scrollTo({ top: Math.max(0, scrollTo), behavior: 'smooth' });

                return;
            }
        }

        // No target: show overlay
        this.overlayEl.style.display = '';
    },

    next: function () {
        this.showStep(this.currentStep + 1);
    },

    skip: function () {
        this.cleanup();
    },

    cleanup: function () {
        if (this.prevHighlight) {
            this.prevHighlight.classList.remove('fid-tour-highlight');
            this.prevHighlight = null;
        }
        if (this.overlayEl) {
            this.overlayEl.remove();
            this.overlayEl = null;
        }
        if (this.cardEl) {
            this.cardEl.remove();
            this.cardEl = null;
        }

        // Restore gain group visibility based on current filter type
        if (PASS_FILTERS.includes(state.filterType)) {
            document.getElementById('gain-group').classList.add('hidden');
        }
    }
};

// ============================================
// Tooltips
// ============================================

function initTooltips() {
    var tooltipEl = document.createElement('div');
    tooltipEl.className = 'global-tooltip';
    tooltipEl.style.cssText = 'position:fixed;z-index:10000;background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:8px;padding:12px;box-shadow:0 4px 20px rgba(0,0,0,0.25);font-size:0.8rem;line-height:1.5;color:var(--color-text);max-width:280px;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;pointer-events:none;';
    document.body.appendChild(tooltipEl);

    var triggers = document.querySelectorAll('.info-trigger');

    triggers.forEach(function(trigger) {
        var content = trigger.querySelector('.info-tooltip');
        if (!content) return;

        function showTooltip() {
            tooltipEl.innerHTML = content.innerHTML;
            tooltipEl.style.opacity = '1';
            tooltipEl.style.visibility = 'visible';

            var rect = trigger.getBoundingClientRect();
            var tooltipRect = tooltipEl.getBoundingClientRect();
            var margin = 8;

            var top = rect.bottom + margin;
            var left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

            if (left < margin) left = margin;
            if (left + tooltipRect.width > window.innerWidth - margin) {
                left = window.innerWidth - tooltipRect.width - margin;
            }

            tooltipEl.style.top = top + 'px';
            tooltipEl.style.left = left + 'px';
        }

        function hideTooltip() {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.visibility = 'hidden';
        }

        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
        trigger.addEventListener('focus', showTooltip);
        trigger.addEventListener('blur', hideTooltip);
    });
}

// ============================================
// Initialization
// ============================================

function init() {
    setupEventListeners();
    initTooltips();

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
