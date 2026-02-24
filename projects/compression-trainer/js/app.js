/**
 * Compression Trainer - Ear Training Tool
 * Train your ears to hear dynamic compression.
 *
 * Audio Architecture:
 * Source (Pink Noise / User Audio / Multi-track / Drum Loop)
 *   → sourceGain
 *     → DynamicsCompressorNode (threshold, knee, ratio, attack, release)
 *       → makeupGain (GainNode, manual dB control)
 *         → compressedGain ──→ preMasterMerge → masterGain → destination
 *     → bypassGain ──────────→ preMasterMerge
 *
 * Metering:
 *   sourceGain → inputAnalyser (pre-compression level)
 *   preMasterMerge → outputAnalyser (post-compression level)
 *   DynamicsCompressorNode.reduction → GR meter (polled via rAF)
 */

// ============================================
// Constants
// ============================================

// Source types
var SOURCE_MUTE = 0;
var SOURCE_PINK_NOISE = 1;
var SOURCE_USER_AUDIO = 2;
var SOURCE_MULTITRACK = 3;
var SOURCE_DRUM_LOOP = 4;

// Compressor defaults (override DynamicsCompressorNode defaults)
var COMPRESSOR_DEFAULTS = {
    threshold: -18,
    ratio: 4,
    attack: 0.010,
    release: 0.250,
    knee: 6
};

// Discrete presets for attack/release/knee (Wellington Gordon approach)
var DISCRETE_PRESETS = {
    attack:  { fast: 0.002, medium: 0.020, slow: 0.080 },
    release: { fast: 0.050, medium: 0.250, slow: 0.800 },
    knee:    { hard: 0, medium: 12, soft: 30 }
};

// Parameter ranges (for logarithmic mapping)
var ATTACK_MIN = 0.001;
var ATTACK_MAX = 0.1;
var RELEASE_MIN = 0.01;
var RELEASE_MAX = 1.0;

// Pink noise gate timing (120 BPM quarter notes)
var GATE_ON_DURATION = 0.300;   // seconds
var GATE_OFF_DURATION = 0.200;  // seconds
var GATE_PERIOD = GATE_ON_DURATION + GATE_OFF_DURATION;
var GATE_LOOKAHEAD = 0.100;     // schedule 100ms ahead
var GATE_INTERVAL = 25;         // check every 25ms

// Multi-track stem files (shared with Filter ID)
var MULTITRACK_TRACKS = [
    { key: 'drums',       label: 'Drums',  file: 'Stadium Rock - Drums.mp3' },
    { key: 'tambourine',  label: 'Tamb.',   file: 'Stadium Rock - Tambourine.mp3' },
    { key: 'bass',        label: 'Bass',    file: 'Stadium Rock - Bass.mp3' },
    { key: 'guitar',      label: 'Guitar',  file: 'Stadium Rock - Guitar.mp3' },
    { key: 'keys',        label: 'Keys',    file: 'Stadium Rock - Keys.mp3' },
    { key: 'organ',       label: 'Organ',   file: 'Stadium Rock - Organ.mp3' },
    { key: 'pad',         label: 'Pad',     file: 'Stadium Rock - Pad.mp3' }
];

var MULTITRACK_PATH = '../../audio/stadium-rock-mp3/';

// Teaching sequences (data-driven guided lessons)
var TEACHING_SEQUENCES = {
    hearingCompression: {
        name: 'Hearing Compression',
        recommendation: 'Any source works. Pink noise or full mix recommended.',
        steps: [
            {
                text: 'Heavy compression: threshold at -36 dB, ratio 10:1. Listen for the signal being "squashed" flat. Loud parts are pushed way down.',
                params: { threshold: -36, ratio: 10, attack: 0.010, release: 0.250, knee: 6 }
            },
            {
                text: 'Moderate compression: threshold at -18 dB, ratio 4:1. The dynamics are tamed, but the signal still breathes. This is a typical vocal or bus setting.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 6 }
            },
            {
                text: 'Gentle compression: threshold at -12 dB, ratio 2:1. Subtle leveling. You might barely notice it until you bypass. Compare carefully.',
                params: { threshold: -12, ratio: 2, attack: 0.010, release: 0.250, knee: 6 }
            }
        ]
    },
    attackTime: {
        name: 'Attack Time',
        recommendation: 'Drums or multi-track recommended for hearing transient shaping.',
        steps: [
            {
                text: 'Fast attack (2 ms): The compressor catches the transient immediately. On drums, the initial "crack" or "snap" gets reduced. The sound becomes rounder and more controlled.',
                params: { threshold: -18, ratio: 4, attack: 0.002, release: 0.250, knee: 6 }
            },
            {
                text: 'Medium attack (20 ms): The transient punches through before compression engages. You hear the initial hit, then the sustain gets compressed. Good balance of punch and control.',
                params: { threshold: -18, ratio: 4, attack: 0.020, release: 0.250, knee: 6 }
            },
            {
                text: 'Slow attack (80 ms): The compressor is slow to react, letting the full transient pass. Only the sustained body of the sound gets compressed. Maximum punch, less level control.',
                params: { threshold: -18, ratio: 4, attack: 0.080, release: 0.250, knee: 6 }
            }
        ]
    },
    releaseTime: {
        name: 'Release Time',
        recommendation: 'Drums or multi-track recommended for hearing rhythmic effects.',
        steps: [
            {
                text: 'Fast release (50 ms): The compressor recovers quickly between hits. Listen for the level "pumping" back up between transients. The noise floor or room ambience may surge.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.050, knee: 6 }
            },
            {
                text: 'Medium release (250 ms): A natural-sounding recovery. The compressor lets go smoothly between notes without obvious pumping.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 6 }
            },
            {
                text: 'Slow release (800 ms): The compressor holds the gain reduction for a long time. The sound feels "sat on" or "glued together." Good for smooth, sustained material, but can flatten dynamics on busy material.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.800, knee: 6 }
            }
        ]
    },
    knee: {
        name: 'Knee',
        recommendation: 'Pink noise or vocals recommended. The difference is subtle.',
        steps: [
            {
                text: 'Hard knee (0 dB): Compression snaps on at the threshold. Either it is compressing or it is not. Listen for a harder, more aggressive character.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 0 }
            },
            {
                text: 'Medium knee (12 dB): Compression eases in over a 12 dB range around the threshold. A compromise between precision and transparency.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 12 }
            },
            {
                text: 'Soft knee (30 dB): Compression engages very gradually. The transition is smooth and transparent. Most natural-sounding, often used on vocals and acoustic instruments.',
                params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 30 }
            }
        ]
    },
    pumpingBreathing: {
        name: 'Pumping & Breathing',
        recommendation: 'Full mix (multi-track) recommended for hearing mix-level effects.',
        steps: [
            {
                text: 'Classic pumping: heavy compression with fast release. The level surges up between hits. This is the "pumping" sound, sometimes intentional in dance music.',
                params: { threshold: -30, ratio: 8, attack: 0.002, release: 0.050, knee: 0 }
            },
            {
                text: 'Musical pumping: moderate compression with medium release. The rhythm of the compression becomes part of the groove. Less extreme than classic pumping.',
                params: { threshold: -24, ratio: 4, attack: 0.010, release: 0.150, knee: 6 }
            },
            {
                text: 'Breathing: heavy compression with slow release. The compressor "breathes" with the music, slowly swelling between phrases. Listen for the gradual level changes.',
                params: { threshold: -30, ratio: 6, attack: 0.020, release: 0.800, knee: 12 }
            }
        ]
    }
};

// ============================================
// State
// ============================================

var state = {
    audioContext: null,
    masterGain: null,
    sourceGain: null,
    compressor: null,
    makeupGainNode: null,
    compressedGain: null,
    bypassGain: null,
    preMasterMerge: null,

    // Analysers
    inputAnalyser: null,
    outputAnalyser: null,

    // Pink noise
    noiseBuffer: null,
    noiseSource: null,
    noiseGate: null,
    gateSchedulerId: null,
    gateNextTime: 0,
    gateIsOn: false,

    // User audio
    userAudioBuffer: null,
    userAudioSource: null,
    userAudioStartTime: 0,
    userAudioPausedAt: 0,
    userAudioDuration: 0,
    progressAnimationId: null,

    // Multi-track
    multitrackBuffers: {},
    multitrackSources: [],
    multitrackGains: [],
    multitrackPanners: [],
    multitrackAnalysers: [],
    multitrackMerge: null,
    multitrackMuted: [],
    multitrackVolumes: [],
    multitrackSoloed: null,
    multitrackLoading: false,
    multitrackMeterAnimId: null,

    // Drum loop
    drumLoopBuffer: null,
    drumLoopSource: null,

    // Stereo visualization
    stereoSplitter: null,
    stereoAnalyserL: null,
    stereoAnalyserR: null,
    stereoVizAnimId: null,

    // Playback
    isPlaying: false,
    currentSource: SOURCE_MUTE,

    // Per-source gain
    pinkNoiseGainValue: -12,
    userAudioGainValue: -12,
    multitrackGainValue: -12,
    drumLoopGainValue: -12,

    // Compressor parameters
    threshold: COMPRESSOR_DEFAULTS.threshold,
    ratio: COMPRESSOR_DEFAULTS.ratio,
    attack: COMPRESSOR_DEFAULTS.attack,
    release: COMPRESSOR_DEFAULTS.release,
    knee: COMPRESSOR_DEFAULTS.knee,
    makeupGainDb: 0,
    compressorBypassed: false,

    // Mode
    mode: 'practice',

    // Teaching
    teachingSequence: null,
    teachingStep: 0,

    // Quiz
    quizDrill: 'isCompressed',
    quizAnswer: null,
    quizSelection: {},
    quizCorrect: 0,
    quizTotal: 0,
    quizStreak: 0,
    quizRevealed: false,

    // Test sequence
    testRunning: false,
    testTimeoutIds: [],
    testAnimationId: null,
    testStartTime: 0,
    testPhase: null,
    testLoop: false,
    testBypassDur: 4,
    testCompressedDur: 5,

    // Visualization
    vizAnimId: null,
    envelopeHistory: [],
    grPeakHold: 0,
    grPeakHoldTime: 0,

    // Demo
    demoRunning: false,
    demoStep: 0,
    demoTimeoutIds: []
};

// ============================================
// Utility Functions
// ============================================

function dbToLinear(db) {
    return Math.pow(10, db / 20);
}

function linearToDb(linear) {
    if (linear <= 0) return -Infinity;
    return 20 * Math.log10(linear);
}

/** Map a 0-1 slider position to a value in a logarithmic range */
function logMap(position, min, max) {
    return min * Math.pow(max / min, position);
}

/** Map a value in a logarithmic range to a 0-1 slider position */
function logUnmap(value, min, max) {
    return Math.log(value / min) / Math.log(max / min);
}

function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// ============================================
// Audio Context & Signal Chain
// ============================================

function createAudioContext() {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    state.audioContext = ctx;

    // Source gain (all sources connect here)
    state.sourceGain = ctx.createGain();
    state.sourceGain.gain.value = dbToLinear(state.pinkNoiseGainValue);

    // Compressor
    state.compressor = ctx.createDynamicsCompressor();
    state.compressor.threshold.setValueAtTime(state.threshold, 0);
    state.compressor.knee.setValueAtTime(state.knee, 0);
    state.compressor.ratio.setValueAtTime(state.ratio, 0);
    state.compressor.attack.setValueAtTime(state.attack, 0);
    state.compressor.release.setValueAtTime(state.release, 0);

    // Makeup gain (manual, after compressor)
    state.makeupGainNode = ctx.createGain();
    state.makeupGainNode.gain.value = dbToLinear(state.makeupGainDb);

    // Effect path gain (for bypass crossfade)
    state.compressedGain = ctx.createGain();
    state.compressedGain.gain.value = 1;

    // Bypass path gain
    state.bypassGain = ctx.createGain();
    state.bypassGain.gain.value = 0;

    // Pre-master merge point
    state.preMasterMerge = ctx.createGain();
    state.preMasterMerge.gain.value = 1;

    // Master gain
    state.masterGain = ctx.createGain();
    state.masterGain.gain.value = dbToLinear(-12);

    // Input analyser (pre-compression)
    state.inputAnalyser = ctx.createAnalyser();
    state.inputAnalyser.fftSize = 2048;
    state.inputAnalyser.smoothingTimeConstant = 0.8;

    // Output analyser (post-compression)
    state.outputAnalyser = ctx.createAnalyser();
    state.outputAnalyser.fftSize = 2048;
    state.outputAnalyser.smoothingTimeConstant = 0.8;

    // Connect signal chain
    // Effect path: sourceGain → compressor → makeupGain → compressedGain → preMasterMerge
    state.sourceGain.connect(state.compressor);
    state.compressor.connect(state.makeupGainNode);
    state.makeupGainNode.connect(state.compressedGain);
    state.compressedGain.connect(state.preMasterMerge);

    // Bypass path: sourceGain → bypassGain → preMasterMerge
    state.sourceGain.connect(state.bypassGain);
    state.bypassGain.connect(state.preMasterMerge);

    // Output: preMasterMerge → masterGain → destination
    state.preMasterMerge.connect(state.masterGain);
    state.masterGain.connect(ctx.destination);

    // Metering taps
    state.sourceGain.connect(state.inputAnalyser);
    state.preMasterMerge.connect(state.outputAnalyser);

    // Pink noise gate node (between noise source and sourceGain)
    state.noiseGate = ctx.createGain();
    state.noiseGate.gain.value = 0;
    state.noiseGate.connect(state.sourceGain);

    // Generate pink noise buffer
    generatePinkNoiseBuffer();

    // Build multi-track audio graph (gains, analysers, splitter)
    buildMultitrackGraph();
}

// ============================================
// Pink Noise (Paul Kellet algorithm)
// ============================================

function generatePinkNoiseBuffer() {
    var sampleRate = state.audioContext.sampleRate;
    var duration = 10;
    var length = sampleRate * duration;
    var data = new Float32Array(length);

    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (var i = 0; i < length; i++) {
        var white = Math.random() * 2 - 1;

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
// Pink Noise Gate Scheduler
// ============================================

function startNoiseGate() {
    var ctx = state.audioContext;
    state.gateNextTime = ctx.currentTime;
    state.gateIsOn = false;

    function scheduleGate() {
        var now = ctx.currentTime;
        var scheduleUntil = now + GATE_LOOKAHEAD;

        while (state.gateNextTime < scheduleUntil) {
            if (!state.gateIsOn) {
                // Turn gate on
                state.noiseGate.gain.setValueAtTime(1, state.gateNextTime);
                state.gateNextTime += GATE_ON_DURATION;
                state.gateIsOn = true;
            } else {
                // Turn gate off
                state.noiseGate.gain.setValueAtTime(0, state.gateNextTime);
                state.gateNextTime += GATE_OFF_DURATION;
                state.gateIsOn = false;
            }
        }

        state.gateSchedulerId = setTimeout(scheduleGate, GATE_INTERVAL);
    }

    scheduleGate();
}

function stopNoiseGate() {
    if (state.gateSchedulerId !== null) {
        clearTimeout(state.gateSchedulerId);
        state.gateSchedulerId = null;
    }
    if (state.noiseGate) {
        state.noiseGate.gain.cancelScheduledValues(0);
        state.noiseGate.gain.setValueAtTime(0, 0);
    }
}

// ============================================
// Audio Playback
// ============================================

async function startAudio() {
    if (state.isPlaying) return;

    if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
    }

    if (state.currentSource === SOURCE_MUTE) return;

    if (state.currentSource === SOURCE_PINK_NOISE) {
        startPinkNoise();
    } else if (state.currentSource === SOURCE_USER_AUDIO) {
        if (state.userAudioBuffer) {
            startUserAudio(state.userAudioPausedAt);
        } else {
            return;
        }
    } else if (state.currentSource === SOURCE_MULTITRACK) {
        if (hasMultitrackLoaded()) {
            startMultitrack();
        } else {
            return;
        }
    } else if (state.currentSource === SOURCE_DRUM_LOOP) {
        // TODO: implement when drum loop source is provided
        return;
    }

    state.isPlaying = true;
    updatePlayButton();
    startVisualizationLoop();
}

function stopAudio() {
    if (!state.isPlaying) return;

    if (state.noiseSource) {
        stopNoiseGate();
        state.noiseSource.stop();
        state.noiseSource.disconnect();
        state.noiseSource = null;
    }

    if (state.userAudioSource) {
        var elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        state.userAudioPausedAt = Math.min(elapsed, state.userAudioDuration);

        state.userAudioSource.onended = null;
        state.userAudioSource.stop();
        state.userAudioSource.disconnect();
        state.userAudioSource = null;
    }

    if (state.multitrackSources.length > 0) {
        stopMultitrackSources();
    }

    if (state.drumLoopSource) {
        state.drumLoopSource.stop();
        state.drumLoopSource.disconnect();
        state.drumLoopSource = null;
    }

    if (state.progressAnimationId) {
        cancelAnimationFrame(state.progressAnimationId);
        state.progressAnimationId = null;
    }

    state.isPlaying = false;
    stopVisualizationLoop();
    updatePlayButton();
}

function startPinkNoise() {
    if (state.noiseSource) {
        stopNoiseGate();
        state.noiseSource.stop();
        state.noiseSource.disconnect();
    }

    state.noiseSource = state.audioContext.createBufferSource();
    state.noiseSource.buffer = state.noiseBuffer;
    state.noiseSource.loop = true;
    // Connect to gate node (not directly to sourceGain)
    state.noiseSource.connect(state.noiseGate);
    state.noiseSource.start();

    startNoiseGate();
}

// ============================================
// User Audio
// ============================================

function startUserAudio(offset) {
    if (!state.userAudioBuffer) return;
    offset = offset || 0;

    state.userAudioSource = state.audioContext.createBufferSource();
    state.userAudioSource.buffer = state.userAudioBuffer;
    state.userAudioSource.loop = false;
    state.userAudioSource.connect(state.sourceGain);

    state.userAudioSource.onended = function () {
        if (state.isPlaying && state.currentSource === SOURCE_USER_AUDIO) {
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

    if (!state.audioContext) createAudioContext();

    try {
        var arrayBuffer = await file.arrayBuffer();
        state.userAudioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
        state.userAudioDuration = state.userAudioBuffer.duration;
        state.userAudioPausedAt = 0;

        document.getElementById('upload-area').classList.add('hidden');
        document.getElementById('playback-controls').classList.remove('hidden');
        document.getElementById('time-display').textContent = '0:00 / ' + formatTime(state.userAudioDuration);
        updateProgressBar(0);
    } catch (error) {
        console.error('Error decoding audio:', error);
        alert('Could not decode audio file. Please try a different file.');
    }
}

function startProgressUpdate() {
    if (state.progressAnimationId) {
        cancelAnimationFrame(state.progressAnimationId);
    }

    function update() {
        if (!state.isPlaying || state.currentSource !== SOURCE_USER_AUDIO) return;

        var elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        var progress = Math.min(elapsed / state.userAudioDuration, 1);

        updateProgressBar(progress);
        document.getElementById('time-display').textContent =
            formatTime(elapsed) + ' / ' + formatTime(state.userAudioDuration);

        state.progressAnimationId = requestAnimationFrame(update);
    }

    update();
}

function updateProgressBar(progress) {
    var fill = document.getElementById('progress-fill');
    if (fill) {
        fill.style.width = (progress * 100) + '%';
    }
}

// ============================================
// Multi-track
// ============================================

function hasMultitrackLoaded() {
    return Object.keys(state.multitrackBuffers).length === MULTITRACK_TRACKS.length;
}

function buildMultitrackGraph() {
    state.multitrackMerge = state.audioContext.createGain();
    state.multitrackMerge.gain.value = 1;

    state.multitrackMuted = MULTITRACK_TRACKS.map(function () { return false; });
    state.multitrackVolumes = MULTITRACK_TRACKS.map(function () { return 1; });
    state.multitrackSoloed = null;

    state.multitrackGains = [];
    state.multitrackAnalysers = [];
    MULTITRACK_TRACKS.forEach(function () {
        var g = state.audioContext.createGain();
        g.gain.value = 1;
        var a = state.audioContext.createAnalyser();
        a.fftSize = 256;
        a.smoothingTimeConstant = 0.85;
        g.connect(state.multitrackMerge);
        g.connect(a);
        state.multitrackGains.push(g);
        state.multitrackAnalysers.push(a);
    });

    // Stereo visualization splitter
    state.stereoSplitter = state.audioContext.createChannelSplitter(2);
    state.stereoAnalyserL = state.audioContext.createAnalyser();
    state.stereoAnalyserR = state.audioContext.createAnalyser();
    state.stereoAnalyserL.fftSize = 2048;
    state.stereoAnalyserR.fftSize = 2048;

    state.multitrackMerge.connect(state.stereoSplitter);
    state.stereoSplitter.connect(state.stereoAnalyserL, 0);
    state.stereoSplitter.connect(state.stereoAnalyserR, 1);
}

async function loadMultitrackAudio() {
    if (hasMultitrackLoaded() || state.multitrackLoading) return;

    state.multitrackLoading = true;
    updateMultitrackLoadingUI(true);

    try {
        var promises = MULTITRACK_TRACKS.map(function (track) {
            return fetch(MULTITRACK_PATH + track.file)
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

        setMultitrackSumGain();

        state.multitrackLoading = false;
        updateMultitrackLoadingUI(false);
        buildMultitrackTrackButtons();

        // Auto-start if user is still on multitrack source
        if (state.currentSource === SOURCE_MULTITRACK && !state.isPlaying) {
            startAudio();
        }
    } catch (error) {
        console.error('Error loading multi-track audio:', error);
        state.multitrackLoading = false;
        updateMultitrackLoadingUI(false);
        alert('Could not load built-in audio. Check that the audio files are available.');
    }
}

function setMultitrackSumGain() {
    var buffers = MULTITRACK_TRACKS.map(function (t) { return state.multitrackBuffers[t.key]; });
    if (!buffers.length || !buffers[0]) return;

    var maxLength = 0;
    var numChannels = 1;
    buffers.forEach(function (buf) {
        if (buf.length > maxLength) maxLength = buf.length;
        if (buf.numberOfChannels > numChannels) numChannels = buf.numberOfChannels;
    });

    var channelArrays = [];
    for (var ch = 0; ch < numChannels; ch++) {
        var chData = [];
        for (var b = 0; b < buffers.length; b++) {
            var c = Math.min(ch, buffers[b].numberOfChannels - 1);
            chData.push(buffers[b].getChannelData(c));
        }
        channelArrays.push(chData);
    }

    var step = 256;
    var peak = 0;
    for (var ch = 0; ch < numChannels; ch++) {
        var chData = channelArrays[ch];
        for (var i = 0; i < maxLength; i += step) {
            var sum = 0;
            for (var b = 0; b < chData.length; b++) {
                if (i < chData[b].length) sum += chData[b][i];
            }
            var abs = sum < 0 ? -sum : sum;
            if (abs > peak) peak = abs;
        }
    }

    if (peak <= 0) return;

    var targetLinear = Math.pow(10, -0.5 / 20);
    var gain = targetLinear / peak;
    if (gain >= 1) return;

    state.multitrackMerge.gain.value = gain;
}

function startMultitrack() {
    if (!hasMultitrackLoaded()) return;

    stopMultitrackSources();

    state.multitrackSources = MULTITRACK_TRACKS.map(function (track, i) {
        var src = state.audioContext.createBufferSource();
        src.buffer = state.multitrackBuffers[track.key];
        src.loop = true;
        src.connect(state.multitrackGains[i]);
        return src;
    });

    state.multitrackMerge.connect(state.sourceGain);

    applyMultitrackGains();

    var startTime = state.audioContext.currentTime + 0.01;
    state.multitrackSources.forEach(function (src) {
        src.start(startTime);
    });

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

// ============================================
// Multi-track Mixer Controls
// ============================================

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

function updateMultitrackButtons() {
    var anySoloed = (state.multitrackSoloed !== null);

    document.querySelectorAll('.ct-channel-strip').forEach(function (strip) {
        var trackKey = strip.dataset.track;
        var i = MULTITRACK_TRACKS.findIndex(function (t) { return t.key === trackKey; });
        if (i < 0) return;

        var muteBtn = strip.querySelector('.ct-mute-btn');
        var soloBtn = strip.querySelector('.ct-solo-btn');

        if (muteBtn) muteBtn.classList.toggle('muted', state.multitrackMuted[i]);
        if (soloBtn) soloBtn.classList.toggle('soloed', state.multitrackSoloed === trackKey);

        var silent;
        if (anySoloed) {
            silent = (state.multitrackSoloed !== trackKey);
        } else {
            silent = state.multitrackMuted[i];
        }
        strip.classList.toggle('ct-channel-silenced', silent);
    });
}

function updateMultitrackLoadingUI(loading) {
    var loadingEl = document.getElementById('track-loading');
    var buttonsEl = document.getElementById('track-buttons');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
    if (buttonsEl) buttonsEl.classList.toggle('hidden', loading);
}

function buildMultitrackTrackButtons() {
    var container = document.getElementById('track-buttons');
    if (!container) return;
    container.innerHTML = '';

    MULTITRACK_TRACKS.forEach(function (track, i) {
        var strip = document.createElement('div');
        strip.className = 'ct-channel-strip';
        strip.dataset.track = track.key;

        var label = document.createElement('span');
        label.className = 'ct-channel-label';
        label.textContent = track.label;

        var msRow = document.createElement('div');
        msRow.className = 'ct-channel-ms';

        var muteBtn = document.createElement('button');
        muteBtn.type = 'button';
        muteBtn.className = 'ct-channel-btn ct-mute-btn';
        muteBtn.textContent = 'M';
        muteBtn.title = 'Mute ' + track.label;
        muteBtn.addEventListener('click', function () {
            toggleMuteTrack(i);
        });

        var soloBtn = document.createElement('button');
        soloBtn.type = 'button';
        soloBtn.className = 'ct-channel-btn ct-solo-btn';
        soloBtn.textContent = 'S';
        soloBtn.title = 'Solo ' + track.label;
        soloBtn.addEventListener('click', function () {
            toggleSoloTrack(track.key);
        });

        msRow.appendChild(muteBtn);
        msRow.appendChild(soloBtn);

        var faderWrap = document.createElement('div');
        faderWrap.className = 'ct-fader-wrap';

        var meter = document.createElement('div');
        meter.className = 'ct-channel-meter';
        meter.dataset.trackIndex = i;

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'ct-channel-fader';
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

        strip.appendChild(label);
        strip.appendChild(msRow);
        strip.appendChild(faderWrap);
        container.appendChild(strip);
    });

    updateMultitrackButtons();
}

// ============================================
// Multi-track Meters
// ============================================

var meterTimeDomainBuf = null;

function drawMultitrackMeters() {
    var meters = document.querySelectorAll('.ct-channel-meter');
    if (!meters.length || !state.multitrackAnalysers.length) return;

    meters.forEach(function (meterEl) {
        var idx = parseInt(meterEl.dataset.trackIndex);
        var analyser = state.multitrackAnalysers[idx];
        if (!analyser) return;

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

        var normalized = Math.max(0, Math.min(1, (db + 60) / 60));
        meterEl.style.height = (normalized * 100) + '%';
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
}

// ============================================
// Stereo Visualization (Multi-track)
// ============================================

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
    startMultitrackMeters();
}

function stopStereoVisualization() {
    if (state.stereoVizAnimId) {
        cancelAnimationFrame(state.stereoVizAnimId);
        state.stereoVizAnimId = null;
    }
    stopMultitrackMeters();
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

    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    var halfH = h / 2;

    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, halfH);
    ctx.lineTo(w, halfH);
    ctx.stroke();

    ctx.font = '9px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)';
    ctx.textAlign = 'left';
    ctx.fillText('L', 4, 12);
    ctx.fillText('R', 4, halfH + 12);

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
// Source Switching
// ============================================

function setSource(sourceIndex) {
    var wasPlaying = state.isPlaying;
    stopAudio();

    // Save current gain for previous source
    saveGainForSource(state.currentSource);

    state.currentSource = sourceIndex;

    // Restore gain for new source
    restoreGainForSource(sourceIndex);

    // Show/hide source-specific UI
    updateSourceUI();

    // Load multi-track stems on first selection
    if (sourceIndex === SOURCE_MULTITRACK && !hasMultitrackLoaded() && !state.multitrackLoading) {
        loadMultitrackAudio();
    }

    // Auto-start continuous sources in practice mode
    if (wasPlaying || (state.mode === 'practice' && sourceIndex !== SOURCE_MUTE)) {
        if (sourceIndex === SOURCE_PINK_NOISE ||
            (sourceIndex === SOURCE_MULTITRACK && hasMultitrackLoaded())) {
            startAudio();
        }
    }

    // Update source buttons
    var buttons = document.querySelectorAll('[data-source]');
    buttons.forEach(function(btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.source) === sourceIndex);
    });
}

function saveGainForSource(source) {
    var slider = document.getElementById('gain-slider');
    var val = parseInt(slider.value);
    if (source === SOURCE_PINK_NOISE) state.pinkNoiseGainValue = val;
    else if (source === SOURCE_USER_AUDIO) state.userAudioGainValue = val;
    else if (source === SOURCE_MULTITRACK) state.multitrackGainValue = val;
    else if (source === SOURCE_DRUM_LOOP) state.drumLoopGainValue = val;
}

function restoreGainForSource(source) {
    var val;
    if (source === SOURCE_PINK_NOISE) val = state.pinkNoiseGainValue;
    else if (source === SOURCE_USER_AUDIO) val = state.userAudioGainValue;
    else if (source === SOURCE_MULTITRACK) val = state.multitrackGainValue;
    else if (source === SOURCE_DRUM_LOOP) val = state.drumLoopGainValue;
    else val = -12;

    var slider = document.getElementById('gain-slider');
    slider.value = val;
    document.getElementById('gain-display').textContent = val + ' dB';
    updateSliderFill(slider);

    if (state.sourceGain) {
        state.sourceGain.gain.setTargetAtTime(dbToLinear(val), state.audioContext.currentTime, 0.02);
    }
}

function updateSourceUI() {
    var uploadArea = document.getElementById('upload-area');
    var playbackControls = document.getElementById('playback-controls');
    var multitrackControls = document.getElementById('multitrack-controls');

    // Hide all source-specific UI
    uploadArea.classList.add('hidden');
    playbackControls.classList.add('hidden');
    multitrackControls.classList.add('hidden');

    if (state.currentSource === SOURCE_USER_AUDIO) {
        uploadArea.classList.remove('hidden');
        if (state.userAudioBuffer) {
            playbackControls.classList.remove('hidden');
        }
    } else if (state.currentSource === SOURCE_MULTITRACK) {
        multitrackControls.classList.remove('hidden');
    }
}

// ============================================
// Compressor Parameter Controls
// ============================================

function setThreshold(value) {
    state.threshold = value;
    if (state.compressor) {
        state.compressor.threshold.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
    document.getElementById('threshold-slider').value = value;
    document.getElementById('threshold-display').textContent = value + ' dB';
    updateSliderFill(document.getElementById('threshold-slider'));
}

function setRatio(value) {
    state.ratio = value;
    if (state.compressor) {
        state.compressor.ratio.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
    document.getElementById('ratio-slider').value = value;
    document.getElementById('ratio-display').textContent = value + ':1';
    updateSliderFill(document.getElementById('ratio-slider'));
}

function setAttack(value) {
    state.attack = value;
    if (state.compressor) {
        state.compressor.attack.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
    // Update slider position (logarithmic)
    var pos = logUnmap(value, ATTACK_MIN, ATTACK_MAX);
    document.getElementById('attack-slider').value = pos;
    document.getElementById('attack-display').textContent = (value * 1000).toFixed(0) + ' ms';
    updateSliderFill(document.getElementById('attack-slider'));
    updateDiscreteButtons('attack', value);
}

function setRelease(value) {
    state.release = value;
    if (state.compressor) {
        state.compressor.release.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
    var pos = logUnmap(value, RELEASE_MIN, RELEASE_MAX);
    document.getElementById('release-slider').value = pos;
    document.getElementById('release-display').textContent = (value * 1000).toFixed(0) + ' ms';
    updateSliderFill(document.getElementById('release-slider'));
    updateDiscreteButtons('release', value);
}

function setKnee(value) {
    state.knee = value;
    if (state.compressor) {
        state.compressor.knee.setTargetAtTime(value, state.audioContext.currentTime, 0.02);
    }
    document.getElementById('knee-slider').value = value;
    document.getElementById('knee-display').textContent = value + ' dB';
    updateSliderFill(document.getElementById('knee-slider'));
    updateDiscreteButtons('knee', value);
}

function setMakeupGain(value) {
    state.makeupGainDb = value;
    if (state.makeupGainNode) {
        state.makeupGainNode.gain.setTargetAtTime(dbToLinear(value), state.audioContext.currentTime, 0.02);
    }
    document.getElementById('makeup-slider').value = value;
    document.getElementById('makeup-display').textContent = value + ' dB';
    updateSliderFill(document.getElementById('makeup-slider'));
}

// ============================================
// Bypass Toggle
// ============================================

function setCompressorBypassed(bypassed) {
    state.compressorBypassed = bypassed;
    var t = state.audioContext ? state.audioContext.currentTime : 0;
    if (bypassed) {
        state.compressedGain.gain.setTargetAtTime(0, t, 0.02);
        state.bypassGain.gain.setTargetAtTime(1, t, 0.02);
    } else {
        state.compressedGain.gain.setTargetAtTime(1, t, 0.02);
        state.bypassGain.gain.setTargetAtTime(0, t, 0.02);
    }
    updateBypassButton();
}

function updateBypassButton() {
    var btn = document.getElementById('compressor-on-btn');
    if (state.compressorBypassed) {
        btn.textContent = 'Off';
        btn.classList.remove('active');
    } else {
        btn.textContent = 'On';
        btn.classList.add('active');
    }
}

// ============================================
// Discrete Button Highlighting
// ============================================

function updateDiscreteButtons(param, value) {
    var presets = DISCRETE_PRESETS[param];
    var containerId = param + '-buttons';
    var container = document.getElementById(containerId);
    if (!container) return;

    var buttons = container.querySelectorAll('.ct-discrete-btn');
    buttons.forEach(function(btn) {
        var presetKey = btn.dataset[param];
        if (presetKey && presets[presetKey] !== undefined) {
            var presetValue = presets[presetKey];
            var tolerance = (param === 'knee') ? 0.5 : 0.001;
            btn.classList.toggle('active', Math.abs(value - presetValue) < tolerance);
        }
    });
}

// ============================================
// Slider Fill (visual gradient)
// ============================================

function updateSliderFill(slider) {
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var val = parseFloat(slider.value);
    var percent = ((val - min) / (max - min)) * 100;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var accentColor = isDark ? '#3b82f6' : 'var(--color-accent)';
    var trackColor = 'var(--color-border)';
    slider.style.background = 'linear-gradient(to right, ' + accentColor + ' ' + percent + '%, ' + trackColor + ' ' + percent + '%)';
}

function updateAllSliderFills() {
    var sliders = document.querySelectorAll('.ct-toolbar-slider, .ct-param-slider');
    sliders.forEach(updateSliderFill);
}

// ============================================
// Play Button
// ============================================

function updatePlayButton() {
    var btn = document.getElementById('play-button');
    if (!btn) return;
    btn.classList.toggle('playing', state.isPlaying);
}

// ============================================
// Visualization Loop
// ============================================

var ENVELOPE_HISTORY_LENGTH = 180; // ~3 seconds at 60fps

function startVisualizationLoop() {
    if (state.vizAnimId) return;

    function loop() {
        state.vizAnimId = requestAnimationFrame(loop);
        drawTransferCurve();
        drawGainReductionMeter();
        drawScrollingEnvelope();
    }

    loop();
}

function stopVisualizationLoop() {
    if (state.vizAnimId) {
        cancelAnimationFrame(state.vizAnimId);
        state.vizAnimId = null;
    }
}

// ============================================
// Transfer Curve Visualization
// ============================================

function computeGainReduction(inputDb, threshold, ratio, knee) {
    // Compute output dB from input dB using standard compressor transfer function
    if (knee <= 0) {
        // Hard knee
        if (inputDb <= threshold) return 0;
        return inputDb - (threshold + (inputDb - threshold) / ratio);
    }

    // Soft knee
    var halfKnee = knee / 2;
    if (inputDb <= threshold - halfKnee) {
        return 0;
    } else if (inputDb >= threshold + halfKnee) {
        return inputDb - (threshold + (inputDb - threshold) / ratio);
    } else {
        // In the knee region: quadratic interpolation
        var x = inputDb - threshold + halfKnee;
        var gr = (1 / ratio - 1) * (x * x) / (2 * knee);
        return -gr;
    }
}

function computeOutputDb(inputDb, threshold, ratio, knee) {
    return inputDb - computeGainReduction(inputDb, threshold, ratio, knee);
}

function getRmsDb(analyser) {
    if (!analyser) return -100;
    var bufLen = analyser.frequencyBinCount;
    var data = new Float32Array(bufLen);
    analyser.getFloatTimeDomainData(data);

    var sum = 0;
    for (var i = 0; i < bufLen; i++) {
        sum += data[i] * data[i];
    }
    var rms = Math.sqrt(sum / bufLen);
    return rms > 0 ? 20 * Math.log10(rms) : -100;
}

function drawTransferCurve() {
    var canvas = document.getElementById('transfer-canvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    var dbMin = -60;
    var dbMax = 0;
    var range = dbMax - dbMin;

    function dbToX(db) { return ((db - dbMin) / range) * w; }
    function dbToY(db) { return h - ((db - dbMin) / range) * h; }

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    // Grid lines at 6 dB intervals
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.font = '9px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';

    for (var db = dbMin; db <= dbMax; db += 6) {
        var x = dbToX(db);
        var y = dbToY(db);

        // Vertical grid
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();

        // Horizontal grid
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        // Axis labels (only a few)
        if (db % 12 === 0) {
            ctx.textAlign = 'center';
            ctx.fillText(db + '', x, h - 4);
            ctx.textAlign = 'right';
            ctx.fillText(db + '', w - 4, y - 4);
        }
    }

    // Unity diagonal (dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dbToX(dbMin), dbToY(dbMin));
    ctx.lineTo(dbToX(dbMax), dbToY(dbMax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Knee region highlight
    var threshold = state.threshold;
    var ratio = state.ratio;
    var knee = state.knee;
    var halfKnee = knee / 2;

    if (knee > 0) {
        var kneeStartDb = threshold - halfKnee;
        var kneeEndDb = threshold + halfKnee;
        var kneeX1 = dbToX(kneeStartDb);
        var kneeX2 = dbToX(kneeEndDb);
        ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(37, 99, 235, 0.06)';
        ctx.fillRect(kneeX1, 0, kneeX2 - kneeX1, h);
    }

    // Compression curve
    ctx.strokeStyle = isDark ? '#60a5fa' : '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();

    var started = false;
    for (var px = 0; px <= w; px++) {
        var inDb = dbMin + (px / w) * range;
        var outDb = computeOutputDb(inDb, threshold, ratio, knee);
        outDb = Math.max(dbMin, Math.min(dbMax, outDb));
        var y = dbToY(outDb);

        if (!started) {
            ctx.moveTo(px, y);
            started = true;
        } else {
            ctx.lineTo(px, y);
        }
    }
    ctx.stroke();

    // Threshold line (vertical dashed)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dbToX(threshold), 0);
    ctx.lineTo(dbToX(threshold), h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Real-time dot (input RMS mapped through transfer function)
    if (state.isPlaying && state.inputAnalyser) {
        var inputDb = getRmsDb(state.inputAnalyser);
        if (inputDb > dbMin) {
            var outputDb = computeOutputDb(inputDb, threshold, ratio, knee);
            outputDb = Math.max(dbMin, Math.min(dbMax, outputDb));
            var dotX = dbToX(inputDb);
            var dotY = dbToY(outputDb);

            ctx.fillStyle = isDark ? '#f97316' : '#ea580c';
            ctx.beginPath();
            ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================
// Gain Reduction Meter
// ============================================

function drawGainReductionMeter() {
    var canvas = document.getElementById('gr-canvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    // Meter range: 0 to -20 dB
    var grMax = 20;
    var meterTop = 20;
    var meterBottom = h - 25;
    var meterH = meterBottom - meterTop;

    // Read gain reduction (negative value from DynamicsCompressorNode)
    var gr = 0;
    if (state.compressor && state.isPlaying && !state.compressorBypassed) {
        gr = state.compressor.reduction; // negative dB value
    }
    var grAbs = Math.min(Math.abs(gr), grMax);

    // Peak hold
    var now = performance.now() / 1000;
    if (grAbs > state.grPeakHold) {
        state.grPeakHold = grAbs;
        state.grPeakHoldTime = now;
    } else if (now - state.grPeakHoldTime > 1) {
        // Decay at 8 dB/s after 1 second hold
        state.grPeakHold = Math.max(0, state.grPeakHold - 8 * (1 / 60));
    }

    // Scale labels
    ctx.font = '8px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)';
    ctx.textAlign = 'center';
    ctx.fillText('0', w / 2, meterTop - 4);
    ctx.fillText('-20', w / 2, meterBottom + 12);

    // Tick marks
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    for (var db = 0; db <= grMax; db += 2) {
        var y = meterTop + (db / grMax) * meterH;
        ctx.beginPath();
        ctx.moveTo(4, y);
        ctx.lineTo(w - 4, y);
        ctx.stroke();
    }

    // Meter bar (fills downward from top)
    if (grAbs > 0) {
        var barH = (grAbs / grMax) * meterH;
        var barPad = 6;
        var barW = w - barPad * 2;

        // Color gradient: green → yellow → red
        var gradient = ctx.createLinearGradient(0, meterTop, 0, meterTop + meterH);
        gradient.addColorStop(0, isDark ? '#22c55e' : '#16a34a');          // 0 dB = green
        gradient.addColorStop(0.3, isDark ? '#22c55e' : '#16a34a');       // -6 dB still green
        gradient.addColorStop(0.6, isDark ? '#facc15' : '#ca8a04');       // -12 dB = yellow
        gradient.addColorStop(1.0, isDark ? '#ef4444' : '#dc2626');       // -20 dB = red

        ctx.fillStyle = gradient;
        ctx.fillRect(barPad, meterTop, barW, barH);
    }

    // Peak hold line
    if (state.grPeakHold > 0.5) {
        var peakY = meterTop + (state.grPeakHold / grMax) * meterH;
        ctx.strokeStyle = isDark ? '#ffffff' : '#1a1a1a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(4, peakY);
        ctx.lineTo(w - 4, peakY);
        ctx.stroke();
    }

    // Numeric readout at bottom
    ctx.font = '11px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? '#e2e8f0' : '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(grAbs > 0.1 ? '-' + grAbs.toFixed(1) : '0.0', w / 2, h - 4);
}

// ============================================
// Scrolling Envelope Visualization
// ============================================

function drawScrollingEnvelope() {
    var canvas = document.getElementById('envelope-canvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Collect data frame
    if (state.isPlaying) {
        var inputDb = getRmsDb(state.inputAnalyser);
        var outputDb = getRmsDb(state.outputAnalyser);
        var gr = state.compressor ? Math.abs(state.compressor.reduction) : 0;
        state.envelopeHistory.push({ inputDb: inputDb, outputDb: outputDb, gr: gr });
        if (state.envelopeHistory.length > ENVELOPE_HISTORY_LENGTH) {
            state.envelopeHistory.shift();
        }
    }

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    var history = state.envelopeHistory;
    if (history.length < 2) return;

    var dbMin = -60;
    var dbMax = 0;
    var range = dbMax - dbMin;

    function dbToNorm(db) {
        return Math.max(0, Math.min(1, (db - dbMin) / range));
    }

    var envelopeH = h * 0.65; // top 65% for envelope
    var grH = h * 0.3;        // bottom 30% for GR trace
    var gapH = h * 0.05;
    var grTop = envelopeH + gapH;

    // Draw input envelope (gray filled area)
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, envelopeH);
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var norm = dbToNorm(history[i].inputDb);
        var y = envelopeH - norm * envelopeH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(((history.length - 1) / (ENVELOPE_HISTORY_LENGTH - 1)) * w, envelopeH);
    ctx.closePath();
    ctx.fill();

    // Input envelope outline
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var norm = dbToNorm(history[i].inputDb);
        var y = envelopeH - norm * envelopeH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw output envelope (blue filled area)
    ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(37, 99, 235, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, envelopeH);
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var norm = dbToNorm(history[i].outputDb);
        var y = envelopeH - norm * envelopeH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(((history.length - 1) / (ENVELOPE_HISTORY_LENGTH - 1)) * w, envelopeH);
    ctx.closePath();
    ctx.fill();

    // Output envelope outline
    ctx.strokeStyle = isDark ? '#60a5fa' : '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var norm = dbToNorm(history[i].outputDb);
        var y = envelopeH - norm * envelopeH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Threshold line (horizontal dashed)
    var threshNorm = dbToNorm(state.threshold);
    var threshY = envelopeH - threshNorm * envelopeH;
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, threshY);
    ctx.lineTo(w, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Threshold label
    ctx.font = '8px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('Th ' + state.threshold + 'dB', w - 4, threshY - 3);

    // Separator line
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, envelopeH);
    ctx.lineTo(w, envelopeH);
    ctx.stroke();

    // GR trace (orange, fills downward from grTop)
    var grMax = 20;
    ctx.fillStyle = isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(234, 88, 12, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, grTop);
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var grNorm = Math.min(history[i].gr / grMax, 1);
        var y = grTop + grNorm * grH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(((history.length - 1) / (ENVELOPE_HISTORY_LENGTH - 1)) * w, grTop);
    ctx.closePath();
    ctx.fill();

    // GR trace outline
    ctx.strokeStyle = isDark ? '#f97316' : '#ea580c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var i = 0; i < history.length; i++) {
        var x = (i / (ENVELOPE_HISTORY_LENGTH - 1)) * w;
        var grNorm = Math.min(history[i].gr / grMax, 1);
        var y = grTop + grNorm * grH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // GR label
    ctx.fillStyle = isDark ? 'rgba(249, 115, 22, 0.5)' : 'rgba(234, 88, 12, 0.4)';
    ctx.textAlign = 'left';
    ctx.fillText('GR', 4, grTop + 10);

    // Legend
    ctx.textAlign = 'right';
    ctx.font = '8px SF Mono, Monaco, Inconsolata, monospace';
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.4)';
    ctx.fillText('Input', w - 4, 10);
    ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.6)';
    ctx.fillText('Output', w - 4, 20);
}

// ============================================
// Mode Switching
// ============================================

function setMode(mode) {
    state.mode = mode;

    // Update mode buttons
    var buttons = document.querySelectorAll('[data-mode]');
    buttons.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Show/hide mode-specific controls
    var teachingControls = document.getElementById('teaching-controls');
    var sequencePanel = document.getElementById('sequence-panel');
    var quizControls = document.getElementById('quiz-controls');
    var controlsCard = document.getElementById('controls-card');
    var quizAnswerArea = document.getElementById('quiz-answer-area');
    var quizSubmit = document.getElementById('quiz-submit');
    var quizResult = document.getElementById('quiz-result');
    var quizCompare = document.getElementById('quiz-compare');

    // Hide all mode-specific UI
    teachingControls.classList.add('hidden');
    sequencePanel.classList.add('hidden');
    quizControls.classList.add('hidden');
    quizAnswerArea.classList.add('hidden');
    quizSubmit.classList.add('hidden');
    quizResult.classList.add('hidden');
    quizCompare.classList.add('hidden');

    // Show controls card and restore param visibility
    controlsCard.classList.remove('hidden');
    var paramGroups = ['threshold-group', 'ratio-group', 'attack-group', 'release-group', 'knee-group', 'makeup-group'];
    paramGroups.forEach(function (id) {
        document.getElementById(id).classList.remove('hidden');
    });

    // Apply mode class to app container for CSS-driven visibility
    var app = document.querySelector('.ct-app');
    app.classList.remove('practice-mode', 'teaching-mode', 'quiz-mode');
    app.classList.add(mode + '-mode');

    if (mode === 'teaching') {
        teachingControls.classList.remove('hidden');
        sequencePanel.classList.remove('hidden');
    } else if (mode === 'quiz') {
        quizControls.classList.remove('hidden');
        quizAnswerArea.classList.remove('hidden');
        quizSubmit.classList.remove('hidden');
        if (!state.audioContext) createAudioContext();
        startQuiz();
    }

    // Stop any running test sequence
    cancelTestSequence();
}

function cancelTestSequence() {
    state.testTimeoutIds.forEach(clearTimeout);
    state.testTimeoutIds = [];
    if (state.testAnimationId) {
        cancelAnimationFrame(state.testAnimationId);
        state.testAnimationId = null;
    }
    state.testRunning = false;
    state.testPhase = null;
    hideTestIndicator();

    // Restore compressor bypass state
    if (state.audioContext) {
        var t = state.audioContext.currentTime;
        state.compressedGain.gain.cancelScheduledValues(t);
        state.bypassGain.gain.cancelScheduledValues(t);
        if (state.compressorBypassed) {
            state.compressedGain.gain.setValueAtTime(0, t);
            state.bypassGain.gain.setValueAtTime(1, t);
        } else {
            state.compressedGain.gain.setValueAtTime(1, t);
            state.bypassGain.gain.setValueAtTime(0, t);
        }
    }
}

// ============================================
// Test Sequence (bypass / compressed / bypass)
// ============================================

function runTest(options) {
    if (state.testRunning) return;
    if (state.currentSource === SOURCE_MUTE) return;

    options = options || {};
    state.testRunning = true;
    state._testOptions = options;

    if (!state.audioContext) createAudioContext();

    var wasPlaying = state.isPlaying;
    if (!state.isPlaying) {
        startAudio();
    }

    scheduleTestCycle(wasPlaying);
}

function scheduleTestCycle(wasPlaying) {
    var options = state._testOptions || {};

    var t = state.audioContext.currentTime;
    var b1 = state.testBypassDur;
    var comp = state.testCompressedDur;
    var b2 = state.testBypassDur;
    var total = b1 + comp + b2;

    // Schedule bypass / compressed / bypass
    state.compressedGain.gain.setValueAtTime(0, t);
    state.bypassGain.gain.setValueAtTime(1, t);

    state.compressedGain.gain.setValueAtTime(1, t + b1);
    state.bypassGain.gain.setValueAtTime(0, t + b1);

    state.compressedGain.gain.setValueAtTime(0, t + b1 + comp);
    state.bypassGain.gain.setValueAtTime(1, t + b1 + comp);

    state.testStartTime = t;
    showTestIndicator();

    var endTimeout = setTimeout(function () {
        if (state.testLoop && state.testRunning) {
            scheduleTestCycle(wasPlaying);
            return;
        }

        if (options.alwaysStop || !wasPlaying) {
            stopAudio();
        }

        // Restore bypass state
        var now = state.audioContext.currentTime;
        if (state.compressorBypassed) {
            state.compressedGain.gain.setValueAtTime(0, now);
            state.bypassGain.gain.setValueAtTime(1, now);
        } else {
            state.compressedGain.gain.setValueAtTime(1, now);
            state.bypassGain.gain.setValueAtTime(0, now);
        }

        state.testRunning = false;
        state.testPhase = null;
        state._testOptions = null;
        hideTestIndicator();
        state.testTimeoutIds = [];
        updateBypassButton();

        if (options.onEnd) options.onEnd();
    }, total * 1000);

    state.testTimeoutIds.push(endTimeout);
}

function showTestIndicator() {
    document.getElementById('test-indicator').classList.remove('hidden');

    if (state.testAnimationId) {
        cancelAnimationFrame(state.testAnimationId);
        state.testAnimationId = null;
    }

    function updateIndicator() {
        if (!state.testRunning) return;

        var elapsed = state.audioContext.currentTime - state.testStartTime;
        var phaseEl = document.getElementById('test-phase');
        var countEl = document.getElementById('test-countdown');
        var b1 = state.testBypassDur;
        var comp = state.testCompressedDur;
        var total = b1 + comp + state.testBypassDur;

        if (elapsed < b1) {
            phaseEl.textContent = 'Uncompressed';
            countEl.textContent = Math.ceil(b1 - elapsed) + 's';
            state.testPhase = 'bypass';
        } else if (elapsed < b1 + comp) {
            phaseEl.textContent = 'Compressed';
            countEl.textContent = Math.ceil(b1 + comp - elapsed) + 's';
            state.testPhase = 'compressed';
        } else {
            phaseEl.textContent = 'Uncompressed';
            countEl.textContent = Math.ceil(total - elapsed) + 's';
            state.testPhase = 'bypass';
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

function setTestLoop(enabled) {
    state.testLoop = enabled;
    var btn = document.getElementById('loop-btn');
    if (btn) btn.classList.toggle('active', enabled);
}

function stopTestSequence() {
    cancelTestSequence();
    stopAudio();

    var listenBtn = document.getElementById('listen-btn');
    if (listenBtn) listenBtn.textContent = 'Listen';
}

// ============================================
// Teaching Mode
// ============================================

async function teachingListen() {
    var listenBtn = document.getElementById('listen-btn');

    // If already running, stop
    if (state.testRunning) {
        stopTestSequence();
        return;
    }

    var source = state.currentSource;
    if (source === SOURCE_MUTE) {
        alert('Select an audio source first.');
        return;
    }
    if (source === SOURCE_USER_AUDIO && !state.userAudioBuffer) {
        alert('Upload an audio file first (switch to Practice mode to upload).');
        return;
    }
    if (source === SOURCE_MULTITRACK && !hasMultitrackLoaded()) {
        if (!state.audioContext) createAudioContext();
        await loadMultitrackAudio();
        if (!hasMultitrackLoaded()) return;
    }

    // Update durations from inputs
    var bypassDur = parseInt(document.getElementById('teaching-bypass-dur').value) || 4;
    var compDur = parseInt(document.getElementById('teaching-filter-dur').value) || 5;
    state.testBypassDur = bypassDur;
    state.testCompressedDur = compDur;

    listenBtn.textContent = 'Stop';

    runTest({
        onEnd: function () {
            listenBtn.textContent = 'Listen';
        }
    });
}

function selectTeachingSequence(sequenceKey) {
    state.teachingSequence = sequenceKey || null;
    state.teachingStep = 0;

    var stepPanel = document.getElementById('sequence-step');
    var recPanel = document.getElementById('source-recommendation');

    if (!sequenceKey || !TEACHING_SEQUENCES[sequenceKey]) {
        stepPanel.classList.add('hidden');
        recPanel.classList.add('hidden');
        return;
    }

    var seq = TEACHING_SEQUENCES[sequenceKey];
    stepPanel.classList.remove('hidden');

    if (seq.recommendation) {
        recPanel.textContent = seq.recommendation;
        recPanel.classList.remove('hidden');
    } else {
        recPanel.classList.add('hidden');
    }

    applyTeachingStep();
}

function applyTeachingStep() {
    if (!state.teachingSequence) return;
    var seq = TEACHING_SEQUENCES[state.teachingSequence];
    if (!seq) return;

    var step = seq.steps[state.teachingStep];
    if (!step) return;

    // Update step indicator
    document.getElementById('step-indicator').textContent =
        'Step ' + (state.teachingStep + 1) + ' of ' + seq.steps.length;

    // Update step text
    document.getElementById('step-text').textContent = step.text;

    // Apply parameter preset
    if (!state.audioContext) createAudioContext();

    if (step.params.threshold !== undefined) setThreshold(step.params.threshold);
    if (step.params.ratio !== undefined) setRatio(step.params.ratio);
    if (step.params.attack !== undefined) setAttack(step.params.attack);
    if (step.params.release !== undefined) setRelease(step.params.release);
    if (step.params.knee !== undefined) setKnee(step.params.knee);

    // Update nav button states
    document.getElementById('prev-step-btn').disabled = (state.teachingStep === 0);
    document.getElementById('next-step-btn').disabled = (state.teachingStep >= seq.steps.length - 1);
}

function nextTeachingStep() {
    if (!state.teachingSequence) return;
    var seq = TEACHING_SEQUENCES[state.teachingSequence];
    if (!seq) return;

    if (state.testRunning) stopTestSequence();

    if (state.teachingStep < seq.steps.length - 1) {
        state.teachingStep++;
        applyTeachingStep();
    }
}

function prevTeachingStep() {
    if (!state.teachingSequence) return;

    if (state.testRunning) stopTestSequence();

    if (state.teachingStep > 0) {
        state.teachingStep--;
        applyTeachingStep();
    }
}

// ============================================
// Quiz Mode
// ============================================

// Quiz drill definitions
var QUIZ_DRILLS = {
    isCompressed: {
        name: 'Is It Compressed?',
        groups: [
            { label: '', choices: ['Compressed', 'Not Compressed'] }
        ]
    },
    attackTime: {
        name: 'Attack Time',
        groups: [
            { label: 'Attack', choices: ['Fast', 'Medium', 'Slow'] }
        ]
    },
    releaseTime: {
        name: 'Release Time',
        groups: [
            { label: 'Release', choices: ['Fast', 'Medium', 'Slow'] }
        ]
    },
    kneeType: {
        name: 'Knee',
        groups: [
            { label: 'Knee', choices: ['Hard', 'Medium', 'Soft'] }
        ]
    },
    attackRelease: {
        name: 'Attack + Release',
        groups: [
            { label: 'Attack', choices: ['Fast', 'Medium', 'Slow'] },
            { label: 'Release', choices: ['Fast', 'Medium', 'Slow'] }
        ]
    },
    allParams: {
        name: 'All Parameters',
        groups: [
            { label: 'Attack', choices: ['Fast', 'Medium', 'Slow'] },
            { label: 'Release', choices: ['Fast', 'Medium', 'Slow'] },
            { label: 'Knee', choices: ['Hard', 'Medium', 'Soft'] }
        ]
    }
};

// Fixed params for each drill (not varied)
var QUIZ_FIXED_PARAMS = {
    isCompressed: {},
    attackTime:   { threshold: -18, ratio: 4, release: 0.250, knee: 6 },
    releaseTime:  { threshold: -18, ratio: 4, attack: 0.010, knee: 6 },
    kneeType:     { threshold: -18, ratio: 4, attack: 0.010, release: 0.250 },
    attackRelease: { threshold: -18, ratio: 4, knee: 6 },
    allParams:    {}
};

function generateQuizQuestion() {
    var drill = state.quizDrill;
    var answer = {};

    if (drill === 'isCompressed') {
        // 50/50 compressed vs not
        var isCompressed = Math.random() < 0.5;
        answer.isCompressed = isCompressed;
        if (isCompressed) {
            // Random moderate settings
            var attacks = ['fast', 'medium', 'slow'];
            var releases = ['fast', 'medium', 'slow'];
            answer.attack = attacks[Math.floor(Math.random() * 3)];
            answer.release = releases[Math.floor(Math.random() * 3)];
            answer.threshold = -18;
            answer.ratio = 4;
            answer.knee = 6;
        }
    } else {
        // Apply fixed params first
        var fixed = QUIZ_FIXED_PARAMS[drill];
        var drillDef = QUIZ_DRILLS[drill];

        drillDef.groups.forEach(function (group) {
            var paramName = group.label.toLowerCase();
            var choices;
            if (paramName === 'knee') {
                choices = ['hard', 'medium', 'soft'];
            } else {
                choices = ['fast', 'medium', 'slow'];
            }
            // Avoid repeating the same answer as last time
            var prev = state.quizAnswer ? state.quizAnswer[paramName] : null;
            var filtered = choices.filter(function (c) { return c !== prev; });
            answer[paramName] = filtered[Math.floor(Math.random() * filtered.length)];
        });

        // Copy fixed params
        if (fixed.threshold !== undefined) answer.threshold = fixed.threshold;
        if (fixed.ratio !== undefined) answer.ratio = fixed.ratio;
        if (fixed.attack !== undefined) answer.attack = fixed.attack;
        if (fixed.release !== undefined) answer.release = fixed.release;
        if (fixed.knee !== undefined) answer.knee = fixed.knee;
    }

    return answer;
}

function applyQuizAnswer(answer) {
    if (!state.audioContext) createAudioContext();

    if (answer.isCompressed === false) {
        // Apply bypass for the entire sequence
        setCompressorBypassed(true);
        return;
    }

    setCompressorBypassed(false);

    // Apply threshold/ratio from answer or defaults
    setThreshold(answer.threshold !== undefined ? answer.threshold : -18);
    setRatio(answer.ratio !== undefined ? answer.ratio : 4);

    // Apply attack
    if (answer.attack) {
        setAttack(DISCRETE_PRESETS.attack[answer.attack]);
    } else if (typeof answer.attackValue === 'number') {
        setAttack(answer.attackValue);
    }

    // Apply release
    if (answer.release) {
        setRelease(DISCRETE_PRESETS.release[answer.release]);
    } else if (typeof answer.releaseValue === 'number') {
        setRelease(answer.releaseValue);
    }

    // Apply knee
    if (answer.knee !== undefined) {
        if (typeof answer.knee === 'string') {
            setKnee(DISCRETE_PRESETS.knee[answer.knee]);
        } else {
            setKnee(answer.knee);
        }
    }
}

function startQuiz() {
    state.quizRevealed = false;
    state.quizSelection = {};

    // Generate and apply question
    state.quizAnswer = generateQuizQuestion();
    applyQuizAnswer(state.quizAnswer);

    // Build answer buttons
    buildQuizAnswerUI();

    // Hide result and comparison
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-compare').classList.add('hidden');

    // Reset submit button
    var submitBtn = document.getElementById('submit-answer-btn');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.disabled = true;
    document.getElementById('play-again-btn').disabled = false;

    // Hide parameter controls in quiz mode (don't reveal the settings)
    var groups = ['threshold-group', 'ratio-group', 'attack-group', 'release-group', 'knee-group', 'makeup-group'];
    groups.forEach(function (id) {
        document.getElementById(id).classList.add('hidden');
    });
}

function buildQuizAnswerUI() {
    var container = document.getElementById('quiz-answer-area');
    container.innerHTML = '';

    var drill = state.quizDrill;
    var drillDef = QUIZ_DRILLS[drill];
    if (!drillDef) return;

    drillDef.groups.forEach(function (group) {
        var groupDiv = document.createElement('div');
        groupDiv.className = 'ct-quiz-answer-group';

        if (group.label) {
            var labelEl = document.createElement('div');
            labelEl.className = 'ct-quiz-answer-label';
            labelEl.textContent = group.label;
            groupDiv.appendChild(labelEl);
        }

        var buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'ct-quiz-answer-buttons';

        group.choices.forEach(function (choice) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ct-discrete-btn';
            btn.textContent = choice;
            btn.dataset.group = group.label.toLowerCase() || 'main';
            btn.dataset.value = choice.toLowerCase().replace(/ /g, '');

            btn.addEventListener('click', function () {
                // Toggle selection within group
                var groupKey = btn.dataset.group;
                var groupBtns = buttonsDiv.querySelectorAll('.ct-discrete-btn');
                groupBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                state.quizSelection[groupKey] = btn.dataset.value;

                // Check if all groups have selections
                var allSelected = drillDef.groups.every(function (g) {
                    var key = g.label.toLowerCase() || 'main';
                    return state.quizSelection[key];
                });
                document.getElementById('submit-answer-btn').disabled = !allSelected;
            });

            buttonsDiv.appendChild(btn);
        });

        groupDiv.appendChild(buttonsDiv);
        container.appendChild(groupDiv);
    });
}

function submitQuizAnswer() {
    if (state.quizRevealed) return;
    state.quizRevealed = true;

    var drill = state.quizDrill;
    var answer = state.quizAnswer;
    var selection = state.quizSelection;
    var correct = true;

    // Compare answers
    if (drill === 'isCompressed') {
        var userSaysCompressed = (selection.main === 'compressed');
        correct = (userSaysCompressed === answer.isCompressed);
    } else {
        var drillDef = QUIZ_DRILLS[drill];
        drillDef.groups.forEach(function (group) {
            var key = group.label.toLowerCase();
            var userChoice = selection[key];
            var correctChoice;

            if (key === 'knee') {
                correctChoice = answer.knee;
            } else if (key === 'attack') {
                correctChoice = answer.attack;
            } else if (key === 'release') {
                correctChoice = answer.release;
            }

            if (userChoice !== correctChoice) correct = false;
        });
    }

    // Update score
    state.quizTotal++;
    if (correct) {
        state.quizCorrect++;
        state.quizStreak++;
    } else {
        state.quizStreak = 0;
    }

    updateQuizScore();

    // Show result
    var resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden', 'correct', 'incorrect');
    if (correct) {
        resultEl.textContent = 'Correct!';
        resultEl.classList.add('correct');
    } else {
        resultEl.classList.add('incorrect');
        resultEl.textContent = buildIncorrectMessage(drill, answer, selection);
    }

    // Show parameter controls again
    var groups = ['threshold-group', 'ratio-group', 'attack-group', 'release-group', 'knee-group', 'makeup-group'];
    groups.forEach(function (id) {
        document.getElementById(id).classList.remove('hidden');
    });

    // Show comparison view for drills with curves
    showQuizComparison(drill, answer, selection);

    // Change submit to "Next Question"
    var submitBtn = document.getElementById('submit-answer-btn');
    submitBtn.textContent = 'Next Question';
    submitBtn.disabled = false;

    // Stop test sequence if running
    if (state.testRunning) stopTestSequence();
}

function buildIncorrectMessage(drill, answer, selection) {
    if (drill === 'isCompressed') {
        return answer.isCompressed ? 'Incorrect. It was compressed.' : 'Incorrect. It was not compressed.';
    }

    var parts = ['Incorrect.'];
    var drillDef = QUIZ_DRILLS[drill];
    drillDef.groups.forEach(function (group) {
        var key = group.label.toLowerCase();
        var correctVal = key === 'knee' ? answer.knee : (key === 'attack' ? answer.attack : answer.release);
        var userVal = selection[key];
        if (userVal !== correctVal) {
            parts.push(group.label + ': ' + capitalize(correctVal) + ' (you said ' + capitalize(userVal) + ')');
        }
    });

    return parts.join(' ');
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showQuizComparison(drill, answer, selection) {
    var compareEl = document.getElementById('quiz-compare');

    // For attack/release/knee-only drills, use text comparison
    if (drill === 'attackTime' || drill === 'releaseTime' || drill === 'kneeType' ||
        drill === 'attackRelease' || drill === 'isCompressed') {
        compareEl.classList.add('hidden');
        return;
    }

    // For allParams, show transfer curve comparison
    compareEl.classList.remove('hidden');

    // Draw user's answer transfer curve
    drawComparisonCurve('compare-user-canvas', selectionToParams(selection));

    // Draw correct answer transfer curve
    drawComparisonCurve('compare-correct-canvas', answerToParams(answer));
}

function selectionToParams(selection) {
    var params = { threshold: -18, ratio: 4, knee: 6 };
    if (selection.attack) params.attack = DISCRETE_PRESETS.attack[selection.attack] || 0.010;
    if (selection.release) params.release = DISCRETE_PRESETS.release[selection.release] || 0.250;
    if (selection.knee) params.knee = DISCRETE_PRESETS.knee[selection.knee] || 6;
    return params;
}

function answerToParams(answer) {
    var params = { threshold: answer.threshold || -18, ratio: answer.ratio || 4 };
    if (typeof answer.knee === 'string') {
        params.knee = DISCRETE_PRESETS.knee[answer.knee] || 6;
    } else {
        params.knee = answer.knee || 6;
    }
    return params;
}

function drawComparisonCurve(canvasId, params) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var dbMin = -60;
    var dbMax = 0;
    var range = dbMax - dbMin;

    function dbToX(db) { return ((db - dbMin) / range) * w; }
    function dbToY(db) { return h - ((db - dbMin) / range) * h; }

    // Background
    ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fb';
    ctx.fillRect(0, 0, w, h);

    // Unity diagonal
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dbToX(dbMin), dbToY(dbMin));
    ctx.lineTo(dbToX(dbMax), dbToY(dbMax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Compression curve
    ctx.strokeStyle = isDark ? '#60a5fa' : '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();

    var threshold = params.threshold;
    var ratio = params.ratio;
    var knee = params.knee;
    var started = false;

    for (var px = 0; px <= w; px++) {
        var inDb = dbMin + (px / w) * range;
        var outDb = computeOutputDb(inDb, threshold, ratio, knee);
        outDb = Math.max(dbMin, Math.min(dbMax, outDb));
        var y = dbToY(outDb);

        if (!started) {
            ctx.moveTo(px, y);
            started = true;
        } else {
            ctx.lineTo(px, y);
        }
    }
    ctx.stroke();

    // Threshold line
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dbToX(threshold), 0);
    ctx.lineTo(dbToX(threshold), h);
    ctx.stroke();
    ctx.setLineDash([]);
}

function updateQuizScore() {
    document.getElementById('quiz-score').textContent = state.quizCorrect + '/' + state.quizTotal;
    document.getElementById('quiz-streak').textContent = state.quizStreak;
}

function quizPlayAgain() {
    if (state.testRunning) {
        stopTestSequence();
        return;
    }

    var source = state.currentSource;
    if (source === SOURCE_MUTE) {
        alert('Select an audio source first.');
        return;
    }

    // Update durations from quiz inputs
    var bypassDur = parseInt(document.getElementById('quiz-bypass-dur').value) || 4;
    var compDur = parseInt(document.getElementById('quiz-filter-dur').value) || 5;
    state.testBypassDur = bypassDur;
    state.testCompressedDur = compDur;

    var playBtn = document.getElementById('play-again-btn');
    playBtn.textContent = 'Stop';

    runTest({
        onEnd: function () {
            playBtn.textContent = 'Play Again';
        }
    });
}

function nextQuizQuestion() {
    startQuiz();

    // Auto-play
    var source = state.currentSource;
    if (source !== SOURCE_MUTE) {
        var bypassDur = parseInt(document.getElementById('quiz-bypass-dur').value) || 4;
        var compDur = parseInt(document.getElementById('quiz-filter-dur').value) || 5;
        state.testBypassDur = bypassDur;
        state.testCompressedDur = compDur;

        var playBtn = document.getElementById('play-again-btn');
        playBtn.textContent = 'Stop';

        runTest({
            onEnd: function () {
                playBtn.textContent = 'Play Again';
            }
        });
    }
}

// ============================================
// Demo Mode
// ============================================

var DEMO_STEPS = [
    {
        label: 'Hearing Compression',
        params: { threshold: -30, ratio: 8, attack: 0.010, release: 0.250, knee: 6 },
        duration: 8
    },
    {
        label: 'Fast vs Slow Attack',
        params: { threshold: -18, ratio: 4, attack: 0.002, release: 0.250, knee: 6 },
        duration: 6
    },
    {
        label: 'Fast vs Slow Attack (Slow)',
        params: { threshold: -18, ratio: 4, attack: 0.080, release: 0.250, knee: 6 },
        duration: 6
    },
    {
        label: 'Fast vs Slow Release',
        params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.050, knee: 6 },
        duration: 6
    },
    {
        label: 'Fast vs Slow Release (Slow)',
        params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.800, knee: 6 },
        duration: 6
    },
    {
        label: 'Hard vs Soft Knee',
        params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 0 },
        duration: 6
    },
    {
        label: 'Hard vs Soft Knee (Soft)',
        params: { threshold: -18, ratio: 4, attack: 0.010, release: 0.250, knee: 30 },
        duration: 6
    }
];

function startDemo() {
    if (state.demoRunning) {
        stopDemo();
        return;
    }

    state.demoRunning = true;
    state.demoStep = 0;

    var demoBtn = document.getElementById('demo-btn');
    demoBtn.classList.add('running');
    demoBtn.innerHTML = '<svg aria-hidden="true" class="demo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>Stop Demo';

    // Ensure audio context and start pink noise if no source
    if (!state.audioContext) createAudioContext();
    if (state.currentSource === SOURCE_MUTE) {
        setSource(SOURCE_PINK_NOISE);
    }
    if (!state.isPlaying) {
        startAudio();
    }

    // Make sure compressor is on
    setCompressorBypassed(false);

    runDemoStep();
}

function runDemoStep() {
    if (!state.demoRunning) return;
    if (state.demoStep >= DEMO_STEPS.length) {
        state.demoStep = 0; // loop
    }

    var step = DEMO_STEPS[state.demoStep];

    // Apply parameters
    if (step.params.threshold !== undefined) setThreshold(step.params.threshold);
    if (step.params.ratio !== undefined) setRatio(step.params.ratio);
    if (step.params.attack !== undefined) setAttack(step.params.attack);
    if (step.params.release !== undefined) setRelease(step.params.release);
    if (step.params.knee !== undefined) setKnee(step.params.knee);

    // Show label
    var demoBtn = document.getElementById('demo-btn');
    demoBtn.title = step.label;

    // Schedule next step
    var timeout = setTimeout(function () {
        state.demoStep++;
        runDemoStep();
    }, step.duration * 1000);

    state.demoTimeoutIds.push(timeout);
}

function stopDemo() {
    state.demoRunning = false;
    state.demoTimeoutIds.forEach(clearTimeout);
    state.demoTimeoutIds = [];

    var demoBtn = document.getElementById('demo-btn');
    demoBtn.classList.remove('running');
    demoBtn.innerHTML = '<svg aria-hidden="true" class="demo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21"></polygon></svg>Demo';
    demoBtn.title = '';
}

// ============================================
// Keyboard Shortcuts
// ============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (!state.audioContext) createAudioContext();
                setCompressorBypassed(!state.compressorBypassed);
                break;
            case '1':
                if (!state.audioContext) createAudioContext();
                setSource(SOURCE_PINK_NOISE);
                break;
            case '2':
                if (!state.audioContext) createAudioContext();
                setSource(SOURCE_USER_AUDIO);
                break;
            case '3':
                if (!state.audioContext) createAudioContext();
                setSource(SOURCE_MULTITRACK);
                break;
            case '4':
                // Drum loop not available yet
                break;
        }
    });
}

// ============================================
// Tooltip Initialization
// ============================================

function initTooltips() {
    var triggers = document.querySelectorAll('.info-trigger');
    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            var tooltip = trigger.querySelector('.info-tooltip');
            if (tooltip) {
                tooltip.classList.toggle('visible');
            }
        });
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.info-tooltip.visible').forEach(function(tip) {
            tip.classList.remove('visible');
        });
    });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Mode buttons
    document.querySelectorAll('[data-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            setMode(btn.dataset.mode);
        });
    });

    // Source buttons
    document.querySelectorAll('[data-source]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (btn.disabled) return;
            if (!state.audioContext) createAudioContext();
            setSource(parseInt(btn.dataset.source));
        });
    });

    // Master gain slider
    var gainSlider = document.getElementById('gain-slider');
    gainSlider.addEventListener('input', function() {
        var val = parseInt(gainSlider.value);
        document.getElementById('gain-display').textContent = val + ' dB';
        if (state.sourceGain) {
            state.sourceGain.gain.setTargetAtTime(dbToLinear(val), state.audioContext.currentTime, 0.02);
        }
        updateSliderFill(gainSlider);
    });

    // Threshold slider
    var thresholdSlider = document.getElementById('threshold-slider');
    thresholdSlider.addEventListener('input', function() {
        setThreshold(parseInt(thresholdSlider.value));
    });

    // Ratio slider
    var ratioSlider = document.getElementById('ratio-slider');
    ratioSlider.addEventListener('input', function() {
        setRatio(parseFloat(ratioSlider.value));
    });

    // Attack slider (logarithmic)
    var attackSlider = document.getElementById('attack-slider');
    attackSlider.addEventListener('input', function() {
        var pos = parseFloat(attackSlider.value);
        var val = logMap(pos, ATTACK_MIN, ATTACK_MAX);
        setAttack(val);
    });

    // Release slider (logarithmic)
    var releaseSlider = document.getElementById('release-slider');
    releaseSlider.addEventListener('input', function() {
        var pos = parseFloat(releaseSlider.value);
        var val = logMap(pos, RELEASE_MIN, RELEASE_MAX);
        setRelease(val);
    });

    // Knee slider
    var kneeSlider = document.getElementById('knee-slider');
    kneeSlider.addEventListener('input', function() {
        setKnee(parseInt(kneeSlider.value));
    });

    // Makeup gain slider
    var makeupSlider = document.getElementById('makeup-slider');
    makeupSlider.addEventListener('input', function() {
        setMakeupGain(parseFloat(makeupSlider.value));
    });

    // Bypass toggle
    document.getElementById('compressor-on-btn').addEventListener('click', function() {
        if (!state.audioContext) createAudioContext();
        setCompressorBypassed(!state.compressorBypassed);
    });

    // Discrete preset buttons
    document.querySelectorAll('[data-attack]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (!state.audioContext) createAudioContext();
            var presetKey = btn.dataset.attack;
            setAttack(DISCRETE_PRESETS.attack[presetKey]);
        });
    });

    document.querySelectorAll('[data-release]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (!state.audioContext) createAudioContext();
            var presetKey = btn.dataset.release;
            setRelease(DISCRETE_PRESETS.release[presetKey]);
        });
    });

    document.querySelectorAll('[data-knee]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (!state.audioContext) createAudioContext();
            var presetKey = btn.dataset.knee;
            setKnee(DISCRETE_PRESETS.knee[presetKey]);
        });
    });

    // Play button (user audio)
    var playBtn = document.getElementById('play-button');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (!state.audioContext) createAudioContext();
            if (state.isPlaying) {
                stopAudio();
            } else {
                startAudio();
            }
        });
    }

    // Progress bar click-to-seek
    var progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', function (e) {
            if (state.currentSource !== SOURCE_USER_AUDIO || !state.userAudioBuffer) return;

            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var progress = x / rect.width;
            var seekTime = progress * state.userAudioDuration;

            var wasPlaying = state.isPlaying;
            if (wasPlaying && state.userAudioSource) {
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
    }

    // File upload (drag-and-drop + file input)
    var uploadArea = document.getElementById('upload-area');
    var fileInput = document.getElementById('audio-file-input');

    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                if (!state.audioContext) createAudioContext();
                handleAudioFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                if (!state.audioContext) createAudioContext();
                handleAudioFile(fileInput.files[0]);
            }
        });
    }

    // Demo button
    document.getElementById('demo-btn').addEventListener('click', function () {
        startDemo();
    });

    // Teaching mode: Listen button
    document.getElementById('listen-btn').addEventListener('click', function () {
        teachingListen();
    });

    // Teaching mode: Loop toggle
    document.getElementById('loop-btn').addEventListener('click', function () {
        setTestLoop(!state.testLoop);
    });

    // Teaching mode: Sequence selector
    document.getElementById('sequence-select').addEventListener('change', function () {
        selectTeachingSequence(this.value);
    });

    // Teaching mode: Step navigation
    document.getElementById('prev-step-btn').addEventListener('click', prevTeachingStep);
    document.getElementById('next-step-btn').addEventListener('click', nextTeachingStep);

    // Teaching mode: Step listen button
    document.getElementById('step-listen-btn').addEventListener('click', function () {
        teachingListen();
    });

    // Duration inputs (teaching)
    document.getElementById('teaching-bypass-dur').addEventListener('change', function () {
        state.testBypassDur = parseInt(this.value) || 4;
    });
    document.getElementById('teaching-filter-dur').addEventListener('change', function () {
        state.testCompressedDur = parseInt(this.value) || 5;
    });

    // Quiz mode: Drill selector
    document.getElementById('quiz-drill-select').addEventListener('change', function () {
        state.quizDrill = this.value;
        startQuiz();
    });

    // Quiz mode: Submit answer
    document.getElementById('submit-answer-btn').addEventListener('click', function () {
        if (state.quizRevealed) {
            nextQuizQuestion();
        } else {
            submitQuizAnswer();
        }
    });

    // Quiz mode: Play Again
    document.getElementById('play-again-btn').addEventListener('click', function () {
        quizPlayAgain();
    });

    // Quiz mode: Duration inputs
    document.getElementById('quiz-bypass-dur').addEventListener('change', function () {
        state.testBypassDur = parseInt(this.value) || 4;
    });
    document.getElementById('quiz-filter-dur').addEventListener('change', function () {
        state.testCompressedDur = parseInt(this.value) || 5;
    });

    // Dark mode changes: update slider fills
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                updateAllSliderFills();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

// ============================================
// Initialization
// ============================================

function init() {
    setupEventListeners();
    setupKeyboardShortcuts();
    initTooltips();

    // Set initial slider positions for log-mapped parameters
    var attackPos = logUnmap(state.attack, ATTACK_MIN, ATTACK_MAX);
    document.getElementById('attack-slider').value = attackPos;
    document.getElementById('attack-display').textContent = (state.attack * 1000).toFixed(0) + ' ms';

    var releasePos = logUnmap(state.release, RELEASE_MIN, RELEASE_MAX);
    document.getElementById('release-slider').value = releasePos;
    document.getElementById('release-display').textContent = (state.release * 1000).toFixed(0) + ' ms';

    // Set initial discrete button highlights
    updateDiscreteButtons('attack', state.attack);
    updateDiscreteButtons('release', state.release);
    updateDiscreteButtons('knee', state.knee);

    // Set initial slider fills
    updateAllSliderFills();

    // Set initial mode
    setMode('practice');
}

document.addEventListener('DOMContentLoaded', init);
