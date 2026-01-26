/**
 * EQ Matching Ear Training Game
 *
 * A gamified ear training tool where users listen to audio processed through
 * a hidden 4-band parametric EQ and try to recreate the sound by adjusting
 * their own EQ curve.
 */

// ============================================
// State Management
// ============================================

const state = {
    // Audio context and nodes
    audioContext: null,
    masterGain: null,
    analyser: null,

    // Pink noise
    noiseBuffer: null,
    noiseSource: null,

    // User audio
    userAudioBuffer: null,
    userAudioSource: null,
    userAudioStartTime: 0,
    userAudioPausedAt: 0,

    // EQ chains - each chain: source -> filters[0-3] -> chainGain
    targetFilters: [],
    userFilters: [],
    bypassGain: null,  // Direct connection for bypass
    targetChainGain: null,
    userChainGain: null,

    // EQ Parameters (user-controlled)
    userParams: [
        { type: 'highpass', freq: 80, gain: 0, q: 0.707 },
        { type: 'peaking', freq: 400, gain: 0, q: 1.0 },
        { type: 'peaking', freq: 2000, gain: 0, q: 1.0 },
        { type: 'lowpass', freq: 12000, gain: 0, q: 0.707 }
    ],

    // Target EQ (hidden until reveal)
    targetParams: [
        { type: 'highpass', freq: 80, gain: 0, q: 0.707 },
        { type: 'peaking', freq: 400, gain: 0, q: 1.0 },
        { type: 'peaking', freq: 2000, gain: 0, q: 1.0 },
        { type: 'lowpass', freq: 12000, gain: 0, q: 0.707 }
    ],

    // Game state
    currentMode: 'target',  // 'target', 'user', 'bypass'
    currentSource: 'noise', // 'noise', 'file'
    isPlaying: false,
    roundActive: false,
    guessSubmitted: false,

    // Scoring
    score: null,
    streak: 0,

    // Canvas
    canvas: null,
    ctx: null,
    dpr: 1,
    canvasWidth: 0,
    canvasHeight: 0,

    // Canvas interaction
    draggingBand: null,
    hoveredBand: null,

    // Animation
    animationId: null,

    // Band colors
    bandColors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
};

// ============================================
// Constants
// ============================================

const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const MIN_GAIN = -18;
const MAX_GAIN = 18;
const MIN_Q = 0.1;
const MAX_Q = 10;

const CONTROL_POINT_RADIUS = 8;
const CONTROL_POINT_HIT_RADIUS = 16;

// ============================================
// Audio Setup
// ============================================

function initAudio() {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Master gain
    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = dbToLinear(-24);
    state.masterGain.connect(state.audioContext.destination);

    // Analyser for spectrum (post-reveal)
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 2048;
    state.analyser.connect(state.masterGain);

    // Chain gains (for A/B switching)
    state.targetChainGain = state.audioContext.createGain();
    state.userChainGain = state.audioContext.createGain();
    state.bypassGain = state.audioContext.createGain();

    state.targetChainGain.connect(state.analyser);
    state.userChainGain.connect(state.analyser);
    state.bypassGain.connect(state.analyser);

    // Create filter chains
    state.targetFilters = createFilterChain();
    state.userFilters = createFilterChain();

    // Connect filter chains to their gains
    state.targetFilters[3].connect(state.targetChainGain);
    state.userFilters[3].connect(state.userChainGain);

    // Initialize filter params
    applyParamsToFilters(state.targetParams, state.targetFilters);
    applyParamsToFilters(state.userParams, state.userFilters);

    // Set initial listening mode
    setListeningMode('target');

    // Generate pink noise buffer
    state.noiseBuffer = createPinkNoiseBuffer(10, state.audioContext.sampleRate);
}

function createFilterChain() {
    const filters = [];
    for (let i = 0; i < 4; i++) {
        const filter = state.audioContext.createBiquadFilter();
        filters.push(filter);
        if (i > 0) {
            filters[i - 1].connect(filter);
        }
    }
    return filters;
}

function createPinkNoiseBuffer(duration, sampleRate) {
    const length = duration * sampleRate;
    const buffer = state.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Paul Kellet's pink noise algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;

        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;

        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;

        data[i] = pink * 0.11; // Scale down
    }

    return buffer;
}

// ============================================
// Filter Control
// ============================================

function applyParamsToFilters(params, filters) {
    for (let i = 0; i < 4; i++) {
        updateFilter(filters[i], params[i]);
    }
}

function updateFilter(filter, params) {
    filter.type = params.type;
    filter.frequency.setTargetAtTime(params.freq, state.audioContext.currentTime, 0.02);
    filter.Q.setTargetAtTime(params.q, state.audioContext.currentTime, 0.02);

    // Gain only applies to peaking and shelf filters
    if (params.type === 'peaking' || params.type === 'lowshelf' || params.type === 'highshelf') {
        filter.gain.setTargetAtTime(params.gain, state.audioContext.currentTime, 0.02);
    }
}

function setUserBandParams(bandIndex, newParams) {
    Object.assign(state.userParams[bandIndex], newParams);
    updateFilter(state.userFilters[bandIndex], state.userParams[bandIndex]);
    updateBandInputs();
    drawCanvas();
}

function resetUserEQ() {
    state.userParams = [
        { type: 'highpass', freq: 80, gain: 0, q: 0.707 },
        { type: 'peaking', freq: 400, gain: 0, q: 1.0 },
        { type: 'peaking', freq: 2000, gain: 0, q: 1.0 },
        { type: 'lowpass', freq: 12000, gain: 0, q: 0.707 }
    ];
    applyParamsToFilters(state.userParams, state.userFilters);
    updateBandInputs();
    updateFilterTypeSelects();
    drawCanvas();
}

// ============================================
// Playback Control
// ============================================

function startPlayback() {
    if (state.isPlaying) return;

    // Resume audio context if suspended
    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }

    if (state.currentSource === 'noise') {
        startPinkNoise();
    } else if (state.currentSource === 'file' && state.userAudioBuffer) {
        startUserAudio();
    }

    state.isPlaying = true;
}

function stopPlayback() {
    if (!state.isPlaying) return;

    if (state.noiseSource) {
        state.noiseSource.stop();
        state.noiseSource = null;
    }

    if (state.userAudioSource) {
        state.userAudioSource.stop();
        state.userAudioSource = null;
    }

    state.isPlaying = false;
}

function startPinkNoise() {
    if (state.noiseSource) {
        state.noiseSource.stop();
    }

    state.noiseSource = state.audioContext.createBufferSource();
    state.noiseSource.buffer = state.noiseBuffer;
    state.noiseSource.loop = true;

    // Connect to all three paths
    state.noiseSource.connect(state.targetFilters[0]);
    state.noiseSource.connect(state.userFilters[0]);
    state.noiseSource.connect(state.bypassGain);

    state.noiseSource.start();
}

function startUserAudio() {
    if (state.userAudioSource) {
        state.userAudioSource.stop();
    }

    state.userAudioSource = state.audioContext.createBufferSource();
    state.userAudioSource.buffer = state.userAudioBuffer;
    state.userAudioSource.loop = true;

    // Connect to all three paths
    state.userAudioSource.connect(state.targetFilters[0]);
    state.userAudioSource.connect(state.userFilters[0]);
    state.userAudioSource.connect(state.bypassGain);

    state.userAudioSource.start();
}

function setListeningMode(mode) {
    state.currentMode = mode;

    // Mute all chains
    state.targetChainGain.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.02);
    state.userChainGain.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.02);
    state.bypassGain.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.02);

    // Unmute the selected chain
    switch (mode) {
        case 'target':
            state.targetChainGain.gain.setTargetAtTime(1, state.audioContext.currentTime, 0.02);
            break;
        case 'user':
            state.userChainGain.gain.setTargetAtTime(1, state.audioContext.currentTime, 0.02);
            break;
        case 'bypass':
            state.bypassGain.gain.setTargetAtTime(1, state.audioContext.currentTime, 0.02);
            break;
    }

    updateModeButtons();
    updateModeIndicator();
}

// ============================================
// Game Logic
// ============================================

function newRound() {
    // Generate random target EQ
    state.targetParams = generateRandomEQ();
    applyParamsToFilters(state.targetParams, state.targetFilters);

    // Reset user EQ
    resetUserEQ();

    // Reset game state
    state.roundActive = true;
    state.guessSubmitted = false;
    state.score = null;

    // Start playback if not playing
    if (!state.isPlaying) {
        startPlayback();
    }

    // Switch to target mode
    setListeningMode('target');

    // Enable submit button
    document.getElementById('submit-btn').disabled = false;

    // Hide result message
    document.getElementById('result-message').classList.add('hidden');

    // Update score display
    updateScoreDisplay();

    // Redraw canvas (hide target curve)
    drawCanvas();
}

function generateRandomEQ() {
    return [
        // Band 1: HPF or LSF
        {
            type: Math.random() > 0.5 ? 'highpass' : 'lowshelf',
            freq: randomLogFreq(30, 200),
            gain: Math.random() > 0.3 ? randomGain(-12, 6) : 0,
            q: 0.707
        },
        // Band 2: Peaking
        {
            type: 'peaking',
            freq: randomLogFreq(200, 1500),
            gain: randomGain(-12, 12),
            q: randomInRange(0.5, 4)
        },
        // Band 3: Peaking
        {
            type: 'peaking',
            freq: randomLogFreq(1000, 8000),
            gain: randomGain(-12, 12),
            q: randomInRange(0.5, 4)
        },
        // Band 4: LPF or HSF
        {
            type: Math.random() > 0.5 ? 'lowpass' : 'highshelf',
            freq: randomLogFreq(4000, 16000),
            gain: Math.random() > 0.3 ? randomGain(-12, 6) : 0,
            q: 0.707
        }
    ];
}

function randomLogFreq(min, max) {
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    return Math.pow(10, logMin + Math.random() * (logMax - logMin));
}

function randomGain(min, max) {
    // Round to nearest 0.5 dB
    return Math.round((min + Math.random() * (max - min)) * 2) / 2;
}

function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}

function submitGuess() {
    if (!state.roundActive || state.guessSubmitted) return;

    state.guessSubmitted = true;
    state.score = calculateScore();

    // Update streak
    if (state.score >= 80) {
        state.streak++;
    } else {
        state.streak = 0;
    }

    // Disable submit button
    document.getElementById('submit-btn').disabled = true;

    // Show result
    updateScoreDisplay();
    showResultMessage();

    // Redraw canvas to show target curve
    drawCanvas();
}

function calculateScore() {
    const numBins = 100;
    let totalError = 0;

    for (let i = 0; i < numBins; i++) {
        // Logarithmic frequency distribution from 20Hz to 20kHz
        const freq = MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, i / (numBins - 1));

        const targetResponse = calculateTotalResponse(state.targetParams, freq);
        const userResponse = calculateTotalResponse(state.userParams, freq);

        const error = Math.abs(targetResponse - userResponse);
        totalError += error;
    }

    const avgError = totalError / numBins;
    // Score: 100 for perfect, 0 for 18dB average error
    return Math.max(0, Math.round(100 - (avgError * 100 / 18)));
}

function calculateTotalResponse(params, freq) {
    let totalGain = 0;

    for (const param of params) {
        totalGain += calculateFilterResponse(param, freq);
    }

    return totalGain;
}

function calculateFilterResponse(param, freq) {
    // Simplified frequency response calculation
    // In reality, this would be more complex, but this approximation works for visualization

    const f0 = param.freq;
    const gain = param.gain;
    const Q = param.q;

    switch (param.type) {
        case 'peaking': {
            // Bell curve response
            const ratio = freq / f0;
            const logRatio = Math.log2(ratio);
            const bandwidth = 1 / Q;
            const response = gain * Math.exp(-Math.pow(logRatio / bandwidth, 2) * 2);
            return response;
        }

        case 'lowshelf': {
            // Low shelf - gain below frequency, flat above
            if (freq < f0) {
                return gain;
            } else {
                const ratio = f0 / freq;
                return gain * Math.pow(ratio, 2);
            }
        }

        case 'highshelf': {
            // High shelf - flat below, gain above frequency
            if (freq > f0) {
                return gain;
            } else {
                const ratio = freq / f0;
                return gain * Math.pow(ratio, 2);
            }
        }

        case 'highpass': {
            // High pass - steep rolloff below frequency
            if (freq >= f0) {
                return 0;
            } else {
                const ratio = freq / f0;
                // 12dB/octave rolloff
                return Math.log2(ratio) * 12;
            }
        }

        case 'lowpass': {
            // Low pass - steep rolloff above frequency
            if (freq <= f0) {
                return 0;
            } else {
                const ratio = f0 / freq;
                // 12dB/octave rolloff
                return Math.log2(ratio) * 12;
            }
        }

        default:
            return 0;
    }
}

// ============================================
// Canvas Drawing
// ============================================

function initCanvas() {
    state.canvas = document.getElementById('eq-canvas');
    state.ctx = state.canvas.getContext('2d');
    state.dpr = window.devicePixelRatio || 1;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const container = state.canvas.parentElement;
    const rect = container.getBoundingClientRect();

    state.canvasWidth = rect.width;
    state.canvasHeight = rect.height;

    state.canvas.width = state.canvasWidth * state.dpr;
    state.canvas.height = state.canvasHeight * state.dpr;
    state.canvas.style.width = state.canvasWidth + 'px';
    state.canvas.style.height = state.canvasHeight + 'px';

    state.ctx.scale(state.dpr, state.dpr);

    drawCanvas();
}

function drawCanvas() {
    const ctx = state.ctx;
    const width = state.canvasWidth;
    const height = state.canvasHeight;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height, isDark);

    // Draw spectrum if guess submitted
    if (state.guessSubmitted && state.analyser) {
        drawSpectrum(ctx, width, height, isDark);
    }

    // Draw target curve (only after submit)
    if (state.guessSubmitted) {
        drawEQCurve(ctx, width, height, state.targetParams, '#16a34a', false);
    }

    // Draw user curve
    drawEQCurve(ctx, width, height, state.userParams, '#2563eb', true);

    // Draw control points (only if round not submitted)
    if (!state.guessSubmitted) {
        drawControlPoints(ctx, width, height);
    }
}

function drawGrid(ctx, width, height, isDark) {
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = textColor;

    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Vertical lines (frequency)
    const freqLines = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    for (const freq of freqLines) {
        const x = padding.left + freqToX(freq, plotWidth);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();

        // Label
        const label = freq >= 1000 ? (freq / 1000) + 'k' : freq.toString();
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - padding.bottom + 15);
    }

    // Horizontal lines (gain)
    const gainLines = [-18, -12, -6, 0, 6, 12, 18];
    for (const gain of gainLines) {
        const y = padding.top + gainToY(gain, plotHeight);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);

        // 0dB line is more prominent
        if (gain === 0) {
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Label
        ctx.textAlign = 'right';
        ctx.fillText(gain + ' dB', padding.left - 5, y + 3);
    }
}

function drawSpectrum(ctx, width, height, isDark) {
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    state.analyser.getByteFrequencyData(dataArray);

    const gradient = ctx.createLinearGradient(0, height - padding.bottom, 0, padding.top);
    gradient.addColorStop(0, isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)');
    gradient.addColorStop(1, isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.15)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);

    const nyquist = state.audioContext.sampleRate / 2;

    for (let i = 0; i < bufferLength; i++) {
        const freq = (i / bufferLength) * nyquist;
        if (freq < MIN_FREQ || freq > MAX_FREQ) continue;

        const x = padding.left + freqToX(freq, plotWidth);
        const magnitude = dataArray[i] / 255;
        const y = height - padding.bottom - magnitude * plotHeight * 0.8;

        ctx.lineTo(x, y);
    }

    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.closePath();
    ctx.fill();
}

function drawEQCurve(ctx, width, height, params, color, showFill) {
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let firstPoint = true;

    for (let i = 0; i <= plotWidth; i++) {
        const freq = xToFreq(i, plotWidth);
        const gain = calculateTotalResponse(params, freq);
        const y = padding.top + gainToY(gain, plotHeight);
        const x = padding.left + i;

        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // Fill under curve
    if (showFill) {
        const zeroY = padding.top + gainToY(0, plotHeight);
        ctx.lineTo(width - padding.right, zeroY);
        ctx.lineTo(padding.left, zeroY);
        ctx.closePath();
        ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        ctx.fill();
    }
}

function drawControlPoints(ctx, width, height) {
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    for (let i = 0; i < 4; i++) {
        const param = state.userParams[i];
        const x = padding.left + freqToX(param.freq, plotWidth);

        // For pass filters, show at their cutoff gain effect point
        let displayGain = 0;
        if (param.type === 'peaking' || param.type === 'lowshelf' || param.type === 'highshelf') {
            displayGain = param.gain;
        }

        const y = padding.top + gainToY(displayGain, plotHeight);
        const color = state.bandColors[i];

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, CONTROL_POINT_RADIUS + 2, 0, Math.PI * 2);
        ctx.fillStyle = state.draggingBand === i || state.hoveredBand === i ? 'white' : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Inner circle
        ctx.beginPath();
        ctx.arc(x, y, CONTROL_POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Show Q indicator for peaking filters
        if (param.type === 'peaking' && (state.draggingBand === i || state.hoveredBand === i)) {
            // Draw Q width indicator
            const bandwidth = 1 / param.q;
            const lowFreq = param.freq / Math.pow(2, bandwidth / 2);
            const highFreq = param.freq * Math.pow(2, bandwidth / 2);
            const xLow = padding.left + freqToX(lowFreq, plotWidth);
            const xHigh = padding.left + freqToX(highFreq, plotWidth);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(xLow, y);
            ctx.lineTo(xHigh, y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// Coordinate transformations
function freqToX(freq, plotWidth) {
    const logMin = Math.log10(MIN_FREQ);
    const logMax = Math.log10(MAX_FREQ);
    const logFreq = Math.log10(freq);
    return ((logFreq - logMin) / (logMax - logMin)) * plotWidth;
}

function xToFreq(x, plotWidth) {
    const logMin = Math.log10(MIN_FREQ);
    const logMax = Math.log10(MAX_FREQ);
    const logFreq = logMin + (x / plotWidth) * (logMax - logMin);
    return Math.pow(10, logFreq);
}

function gainToY(gain, plotHeight) {
    // Gain goes from MAX_GAIN (top) to MIN_GAIN (bottom)
    return ((MAX_GAIN - gain) / (MAX_GAIN - MIN_GAIN)) * plotHeight;
}

function yToGain(y, plotHeight) {
    return MAX_GAIN - (y / plotHeight) * (MAX_GAIN - MIN_GAIN);
}

// ============================================
// Canvas Interaction
// ============================================

function setupCanvasEvents() {
    const canvas = state.canvas;

    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });

    // Touch support
    canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleCanvasTouchEnd);
}

function getCanvasCoords(e) {
    const rect = state.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function hitTestControlPoint(x, y) {
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = state.canvasWidth - padding.left - padding.right;
    const plotHeight = state.canvasHeight - padding.top - padding.bottom;

    for (let i = 0; i < 4; i++) {
        const param = state.userParams[i];
        const px = padding.left + freqToX(param.freq, plotWidth);

        let displayGain = 0;
        if (param.type === 'peaking' || param.type === 'lowshelf' || param.type === 'highshelf') {
            displayGain = param.gain;
        }

        const py = padding.top + gainToY(displayGain, plotHeight);

        const dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
        if (dist <= CONTROL_POINT_HIT_RADIUS) {
            return i;
        }
    }

    return null;
}

function handleCanvasMouseDown(e) {
    if (state.guessSubmitted) return;

    const coords = getCanvasCoords(e);
    const bandIndex = hitTestControlPoint(coords.x, coords.y);

    if (bandIndex !== null) {
        state.draggingBand = bandIndex;
        state.canvas.style.cursor = 'grabbing';
        showReadout(bandIndex);
    }
}

function handleCanvasMouseMove(e) {
    if (state.guessSubmitted) return;

    const coords = getCanvasCoords(e);

    if (state.draggingBand !== null) {
        // Dragging a control point
        updateBandFromCoords(state.draggingBand, coords.x, coords.y);
        showReadout(state.draggingBand);
    } else {
        // Just hovering
        const bandIndex = hitTestControlPoint(coords.x, coords.y);

        if (bandIndex !== state.hoveredBand) {
            state.hoveredBand = bandIndex;
            state.canvas.style.cursor = bandIndex !== null ? 'grab' : 'crosshair';
            drawCanvas();

            if (bandIndex !== null) {
                showReadout(bandIndex);
            } else {
                hideReadout();
            }
        }
    }
}

function handleCanvasMouseUp(e) {
    if (state.draggingBand !== null) {
        state.draggingBand = null;
        state.canvas.style.cursor = 'crosshair';
        hideReadout();
        drawCanvas();
    }
}

function handleCanvasMouseLeave(e) {
    state.hoveredBand = null;
    hideReadout();
    drawCanvas();
}

function handleCanvasWheel(e) {
    if (state.guessSubmitted) return;

    const coords = getCanvasCoords(e);
    const bandIndex = hitTestControlPoint(coords.x, coords.y);

    // Only adjust Q for peaking bands
    if (bandIndex !== null && state.userParams[bandIndex].type === 'peaking') {
        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newQ = Math.max(MIN_Q, Math.min(MAX_Q, state.userParams[bandIndex].q + delta));

        setUserBandParams(bandIndex, { q: newQ });
        showReadout(bandIndex);
    }
}

function handleCanvasTouchStart(e) {
    if (state.guessSubmitted) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = state.canvas.getBoundingClientRect();
    const coords = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };

    const bandIndex = hitTestControlPoint(coords.x, coords.y);
    if (bandIndex !== null) {
        state.draggingBand = bandIndex;
        showReadout(bandIndex);
    }
}

function handleCanvasTouchMove(e) {
    if (state.guessSubmitted || state.draggingBand === null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = state.canvas.getBoundingClientRect();
    const coords = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };

    updateBandFromCoords(state.draggingBand, coords.x, coords.y);
    showReadout(state.draggingBand);
}

function handleCanvasTouchEnd(e) {
    state.draggingBand = null;
    hideReadout();
    drawCanvas();
}

function updateBandFromCoords(bandIndex, x, y) {
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };
    const plotWidth = state.canvasWidth - padding.left - padding.right;
    const plotHeight = state.canvasHeight - padding.top - padding.bottom;

    const plotX = Math.max(0, Math.min(plotWidth, x - padding.left));
    const plotY = Math.max(0, Math.min(plotHeight, y - padding.top));

    const freq = xToFreq(plotX, plotWidth);
    const gain = yToGain(plotY, plotHeight);

    const param = state.userParams[bandIndex];
    const newParams = { freq: Math.round(freq) };

    // Only update gain for filters that use it
    if (param.type === 'peaking' || param.type === 'lowshelf' || param.type === 'highshelf') {
        newParams.gain = Math.round(gain * 2) / 2; // Round to 0.5 dB
    }

    setUserBandParams(bandIndex, newParams);
}

function showReadout(bandIndex) {
    const readout = document.getElementById('eq-readout');
    const param = state.userParams[bandIndex];

    let text = `Band ${bandIndex + 1}: ${Math.round(param.freq)} Hz`;

    if (param.type === 'peaking') {
        text += ` | ${param.gain > 0 ? '+' : ''}${param.gain.toFixed(1)} dB | Q: ${param.q.toFixed(1)}`;
    } else if (param.type === 'lowshelf' || param.type === 'highshelf') {
        text += ` | ${param.gain > 0 ? '+' : ''}${param.gain.toFixed(1)} dB`;
    }

    readout.textContent = text;
    readout.classList.add('visible');
}

function hideReadout() {
    document.getElementById('eq-readout').classList.remove('visible');
}

// ============================================
// UI Updates
// ============================================

function updateBandInputs() {
    for (let i = 0; i < 4; i++) {
        const param = state.userParams[i];

        document.getElementById(`band${i}-freq`).value = Math.round(param.freq);
        document.getElementById(`band${i}-gain`).value = param.gain;

        if (i === 1 || i === 2) {
            document.getElementById(`band${i}-q`).value = param.q.toFixed(1);
        }
    }
}

function updateFilterTypeSelects() {
    document.getElementById('band0-type').value = state.userParams[0].type;
    document.getElementById('band3-type').value = state.userParams[3].type;

    // Show/hide gain controls for pass/shelf filters
    updateGainVisibility(0);
    updateGainVisibility(3);
}

function updateGainVisibility(bandIndex) {
    const type = state.userParams[bandIndex].type;
    const gainLabel = document.getElementById(`band${bandIndex}-gain-label`);

    if (type === 'lowshelf' || type === 'highshelf') {
        gainLabel.classList.remove('hidden');
    } else {
        gainLabel.classList.add('hidden');
    }
}

function updateModeButtons() {
    const buttons = document.querySelectorAll('.mode-buttons button');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === state.currentMode);
    });
}

function updateModeIndicator() {
    const indicator = document.getElementById('eq-mode');

    switch (state.currentMode) {
        case 'target':
            indicator.textContent = 'Target EQ';
            indicator.className = 'eq-mode-indicator target';
            break;
        case 'user':
            indicator.textContent = 'Your EQ';
            indicator.className = 'eq-mode-indicator';
            break;
        case 'bypass':
            indicator.textContent = 'Bypass';
            indicator.className = 'eq-mode-indicator bypass';
            break;
    }
}

function updateSourceButtons() {
    const buttons = document.querySelectorAll('.source-buttons button');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.source === state.currentSource);
    });

    // Show/hide upload area
    const uploadArea = document.getElementById('upload-area');
    const fileInfo = document.getElementById('file-info');

    if (state.currentSource === 'file') {
        if (state.userAudioBuffer) {
            uploadArea.classList.add('hidden');
            fileInfo.classList.remove('hidden');
        } else {
            uploadArea.classList.remove('hidden');
            fileInfo.classList.add('hidden');
        }
    } else {
        uploadArea.classList.add('hidden');
        fileInfo.classList.add('hidden');
    }
}

function updateScoreDisplay() {
    const scoreValue = document.getElementById('score-value');
    const streakValue = document.getElementById('streak-value');

    if (state.score !== null) {
        scoreValue.textContent = state.score;

        // Color based on score
        scoreValue.className = 'score-value';
        if (state.score >= 90) {
            scoreValue.classList.add('excellent');
        } else if (state.score >= 75) {
            scoreValue.classList.add('good');
        } else if (state.score >= 50) {
            scoreValue.classList.add('fair');
        } else {
            scoreValue.classList.add('poor');
        }
    } else {
        scoreValue.textContent = '--';
        scoreValue.className = 'score-value';
    }

    streakValue.textContent = state.streak;
}

function showResultMessage() {
    const message = document.getElementById('result-message');
    let text = '';

    if (state.score >= 90) {
        text = 'Excellent! Your ears are finely tuned.';
    } else if (state.score >= 75) {
        text = 'Good job! You matched most of the EQ.';
    } else if (state.score >= 50) {
        text = 'Not bad. Keep practicing to improve.';
    } else {
        text = 'Keep at it! Try to identify the frequency ranges.';
    }

    message.textContent = text;
    message.classList.remove('hidden');
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Source buttons
    document.querySelectorAll('.source-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            const wasPlaying = state.isPlaying;
            if (wasPlaying) stopPlayback();

            state.currentSource = btn.dataset.source;
            updateSourceButtons();

            if (wasPlaying) startPlayback();
        });
    });

    // Mode buttons
    document.querySelectorAll('.mode-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            setListeningMode(btn.dataset.mode);
        });
    });

    // Gain slider
    const gainSlider = document.getElementById('master-gain');
    const gainDisplay = document.getElementById('gain-display');
    gainSlider.addEventListener('input', () => {
        const db = parseFloat(gainSlider.value);
        gainDisplay.textContent = db + ' dB';
        if (state.masterGain) {
            state.masterGain.gain.setTargetAtTime(dbToLinear(db), state.audioContext.currentTime, 0.02);
        }
    });

    // Game buttons
    document.getElementById('new-round-btn').addEventListener('click', newRound);
    document.getElementById('submit-btn').addEventListener('click', submitGuess);
    document.getElementById('reset-btn').addEventListener('click', resetUserEQ);

    // Band parameter inputs
    for (let i = 0; i < 4; i++) {
        const freqInput = document.getElementById(`band${i}-freq`);
        const gainInput = document.getElementById(`band${i}-gain`);

        freqInput.addEventListener('change', () => {
            setUserBandParams(i, { freq: parseFloat(freqInput.value) });
        });

        gainInput.addEventListener('change', () => {
            setUserBandParams(i, { gain: parseFloat(gainInput.value) });
        });

        // Q inputs for peaking bands
        if (i === 1 || i === 2) {
            const qInput = document.getElementById(`band${i}-q`);
            qInput.addEventListener('change', () => {
                setUserBandParams(i, { q: parseFloat(qInput.value) });
            });
        }
    }

    // Filter type selects
    document.getElementById('band0-type').addEventListener('change', (e) => {
        setUserBandParams(0, { type: e.target.value, gain: 0 });
        updateGainVisibility(0);
    });

    document.getElementById('band3-type').addEventListener('change', (e) => {
        setUserBandParams(3, { type: e.target.value, gain: 0 });
        updateGainVisibility(3);
    });

    // File upload
    const fileInput = document.getElementById('audio-file-input');
    const uploadArea = document.getElementById('upload-area');

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleAudioFile(e.target.files[0]);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        if (e.dataTransfer.files[0]) {
            handleAudioFile(e.dataTransfer.files[0]);
        }
    });
}

async function handleAudioFile(file) {
    // Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 100MB.');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        state.userAudioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);

        // Update file info
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-duration').textContent =
            formatTime(state.userAudioBuffer.duration);

        updateSourceButtons();

        // If playing, switch to user audio
        if (state.isPlaying) {
            stopPlayback();
            startPlayback();
        }
    } catch (error) {
        console.error('Error loading audio file:', error);
        alert('Could not load audio file. Please try a different file.');
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// Utilities
// ============================================

function dbToLinear(db) {
    return Math.pow(10, db / 20);
}

// ============================================
// Initialization
// ============================================

function init() {
    initAudio();
    initCanvas();
    setupCanvasEvents();
    setupEventListeners();

    // Initial UI state
    updateBandInputs();
    updateFilterTypeSelects();
    updateSourceButtons();
    updateModeButtons();
    updateModeIndicator();
    updateScoreDisplay();

    // Draw initial canvas
    drawCanvas();
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Handle audio context resume on user interaction
document.addEventListener('click', () => {
    if (state.audioContext && state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }
}, { once: true });
