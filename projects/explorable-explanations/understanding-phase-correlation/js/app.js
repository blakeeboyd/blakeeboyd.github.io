/**
 * Understanding Phase Correlation
 * Interactive audio tool demonstrating phase correlation concepts
 *
 * Audio Architecture:
 * - Pink noise generator(s) → Channel gains → Master gain → Stereo output
 * - AnalyserNodes for correlation meter calculation
 * - Supports correlated (mono) and uncorrelated (independent L/R) modes
 * - Polarity inversion on right channel
 */

// ============================================
// State Management
// ============================================

const state = {
    audioContext: null,
    masterGain: null,

    // Stereo processing
    splitter: null,
    merger: null,
    leftGain: null,
    rightGain: null,
    rightPolarity: null,

    // Pink noise
    noiseBufferCorrelated: null,  // Single buffer for correlated mode
    noiseBufferLeft: null,        // Separate buffer for uncorrelated L
    noiseBufferRight: null,       // Separate buffer for uncorrelated R
    noiseSourceLeft: null,
    noiseSourceRight: null,

    // Analysers for correlation meter
    analyserLeft: null,
    analyserRight: null,
    analyserBufferSize: 2048,

    // User audio
    userAudioBuffer: null,
    userAudioSource: null,
    userAudioStartTime: 0,
    userAudioPausedAt: 0,
    userAudioDuration: 0,

    // Playback state
    isPlaying: false,
    currentSource: 0,      // 0=Mute, 1=Pink Noise, 2=User Audio
    isCorrelated: true,    // true = same signal both channels
    isInverted: false,     // true = invert right channel
    isMono: false,         // true = sum to mono after polarity processing

    // Mono summing nodes
    monoSummer: null,      // Gain node that sums L+R
    monoSplitter: null,    // Splits mono sum back to stereo

    // Separate gain values for each source
    pinkNoiseGainValue: -24,  // dB (initial for pink noise)
    userAudioGainValue: -12,  // dB (initial for user audio)

    // Animation
    meterAnimationId: null,
    progressAnimationId: null,

    // Correlation meter state (LPF-based calculation)
    correlation: {
        // LPF state for numerator (L*R)
        lpfLR: 0,
        // LPF state for L² and R²
        lpfL2: 0,
        lpfR2: 0,
        // Fast and slow averagers for the correlation value
        fastAvg: 0,
        slowAvg: 0,
        // Smoothed fast average (responsive but less jittery)
        smoothedFastAvg: 0,
        // LPF coefficient (higher = more responsive)
        lpfCoeff: 0.005,
        // Averaging coefficients (higher = more responsive)
        fastCoeff: 0.5,   // Very fast response
        slowCoeff: 0.08,  // Slower for numeric display
        smoothCoeff: 0.25 // Smooths the fast average for visual indicator
    },

    // Polar scatter display - history of recent samples for visualization
    scatterHistory: [],
    maxScatterPoints: 200,  // Number of dots to display

    // Auto Demo state
    demoRunning: false,
    demoTimeoutId: null
};

// ============================================
// Auto Demo Sequence
// ============================================

const DEMO_SEQUENCE = [
    { correlated: true, inverted: false, mono: false,
      label: 'Correlated + Same Polarity (Stereo)',
      message: 'Identical signals create a phantom center between speakers.' },
    { correlated: true, inverted: false, mono: true,
      label: 'Correlated + Same Polarity (Mono)',
      message: 'Mono sum reinforces the signal - full volume.' },
    { correlated: true, inverted: true, mono: false,
      label: 'Correlated + Inverted (Stereo)',
      message: 'Inverted polarity shifts sound to the speakers themselves.' },
    { correlated: true, inverted: true, mono: true,
      label: 'Correlated + Inverted (Mono)',
      message: 'L+R cancels completely - signals are equal and opposite.' },
    { correlated: false, inverted: false, mono: false,
      label: 'Uncorrelated + Same Polarity (Stereo)',
      message: 'Independent L/R channels create diffuse, spacious sound.' },
    { correlated: false, inverted: false, mono: true,
      label: 'Uncorrelated + Same Polarity (Mono)',
      message: 'Uncorrelated signals average together - no cancellation.' },
    { correlated: false, inverted: true, mono: false,
      label: 'Uncorrelated + Inverted (Stereo)',
      message: 'No audible difference - there\'s no correlation to invert.' },
    { correlated: false, inverted: true, mono: true,
      label: 'Uncorrelated + Inverted (Mono)',
      message: 'Same as stereo - polarity has no effect on uncorrelated audio.' }
];

// ============================================
// Audio Context and Setup
// ============================================

function createAudioContext() {
    const WAContext = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new WAContext();

    // Create master gain (will be set based on current source)
    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = dbToLinear(state.pinkNoiseGainValue);

    // Create channel splitter and merger for stereo manipulation
    state.splitter = state.audioContext.createChannelSplitter(2);
    state.merger = state.audioContext.createChannelMerger(2);

    // Create individual channel gains
    state.leftGain = state.audioContext.createGain();
    state.rightGain = state.audioContext.createGain();

    // Create polarity inverter for right channel (gain node with value -1 or 1)
    state.rightPolarity = state.audioContext.createGain();
    state.rightPolarity.gain.value = state.isInverted ? -1 : 1;

    // Create analysers for correlation meter
    state.analyserLeft = state.audioContext.createAnalyser();
    state.analyserRight = state.audioContext.createAnalyser();
    state.analyserLeft.fftSize = state.analyserBufferSize;
    state.analyserRight.fftSize = state.analyserBufferSize;

    // Create mono summing nodes
    // monoSummer receives both channels and outputs their sum
    state.monoSummer = state.audioContext.createGain();
    state.monoSummer.gain.value = 0.5; // Scale down to prevent clipping when summing

    // Connect the stereo processing chain
    // After splitter, signals go through individual gains, then polarity, then to analyser and merger
    state.leftGain.connect(state.analyserLeft);
    state.leftGain.connect(state.merger, 0, 0);

    state.rightGain.connect(state.rightPolarity);
    state.rightPolarity.connect(state.analyserRight);
    state.rightPolarity.connect(state.merger, 0, 1);

    // Also connect both channels to mono summer (for mono mode)
    state.leftGain.connect(state.monoSummer);
    state.rightPolarity.connect(state.monoSummer);

    // Merger to master gain to destination (stereo path - default)
    state.merger.connect(state.masterGain);
    state.masterGain.connect(state.audioContext.destination);

    // Mono summer is NOT connected by default - will be connected when mono mode is enabled

    // Generate pink noise buffers
    generatePinkNoiseBuffers();
}

function dbToLinear(db) {
    return Math.pow(10, db / 20);
}

// ============================================
// Pink Noise Generation
// ============================================

/**
 * Generate pink noise using Paul Kellet's algorithm
 * Pink noise has equal energy per octave (1/f spectrum)
 */
function generatePinkNoise(length, sampleRate) {
    const buffer = new Float32Array(length);

    // Paul Kellet's economical pink noise generator
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;

        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;

        buffer[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
    }

    return buffer;
}

function generatePinkNoiseBuffers() {
    const sampleRate = state.audioContext.sampleRate;
    const duration = 10; // 10 seconds of noise, will loop
    const length = sampleRate * duration;

    // Generate correlated buffer (same for both channels)
    const correlatedData = generatePinkNoise(length, sampleRate);
    state.noiseBufferCorrelated = state.audioContext.createBuffer(1, length, sampleRate);
    state.noiseBufferCorrelated.copyToChannel(correlatedData, 0);

    // Generate uncorrelated buffers (different noise for each channel)
    const leftData = generatePinkNoise(length, sampleRate);
    state.noiseBufferLeft = state.audioContext.createBuffer(1, length, sampleRate);
    state.noiseBufferLeft.copyToChannel(leftData, 0);

    const rightData = generatePinkNoise(length, sampleRate);
    state.noiseBufferRight = state.audioContext.createBuffer(1, length, sampleRate);
    state.noiseBufferRight.copyToChannel(rightData, 0);
}

// ============================================
// Audio Playback Control
// ============================================

async function startAudio() {
    if (state.isPlaying) return;

    // Resume context if suspended
    if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
    }

    if (state.currentSource === 0) {
        // Mute - don't start anything
        return;
    } else if (state.currentSource === 1) {
        // Pink Noise
        startPinkNoise();
    } else if (state.currentSource === 2) {
        // User Audio
        if (state.userAudioBuffer) {
            startUserAudio(state.userAudioPausedAt);
        } else {
            // No audio buffer loaded yet
            return;
        }
    }

    state.isPlaying = true;
    updatePlayButton();
    startCorrelationMeter();
}

function stopAudio() {
    if (!state.isPlaying) return;

    // Stop pink noise
    if (state.noiseSourceLeft) {
        state.noiseSourceLeft.stop();
        state.noiseSourceLeft.disconnect();
        state.noiseSourceLeft = null;
    }
    if (state.noiseSourceRight) {
        state.noiseSourceRight.stop();
        state.noiseSourceRight.disconnect();
        state.noiseSourceRight = null;
    }

    // Stop user audio
    if (state.userAudioSource) {
        // Save current position
        const elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        state.userAudioPausedAt = Math.min(elapsed, state.userAudioDuration);

        state.userAudioSource.stop();
        state.userAudioSource.disconnect();
        state.userAudioSource = null;
    }

    state.isPlaying = false;
    updatePlayButton();
    stopCorrelationMeter();
}

async function togglePlayback() {
    // This function is only for user audio playback
    if (state.currentSource !== 2) return;

    // Check if audio buffer is loaded
    if (!state.userAudioBuffer) {
        console.log('No audio file loaded yet');
        return;
    }

    if (state.isPlaying) {
        stopAudio();
    } else {
        await startAudio();
    }
}

function startPinkNoise() {
    // Stop any existing noise sources
    if (state.noiseSourceLeft) {
        state.noiseSourceLeft.stop();
        state.noiseSourceLeft.disconnect();
    }
    if (state.noiseSourceRight) {
        state.noiseSourceRight.stop();
        state.noiseSourceRight.disconnect();
    }

    if (state.isCorrelated) {
        // Same noise to both channels
        state.noiseSourceLeft = state.audioContext.createBufferSource();
        state.noiseSourceLeft.buffer = state.noiseBufferCorrelated;
        state.noiseSourceLeft.loop = true;
        state.noiseSourceLeft.connect(state.leftGain);

        state.noiseSourceRight = state.audioContext.createBufferSource();
        state.noiseSourceRight.buffer = state.noiseBufferCorrelated;
        state.noiseSourceRight.loop = true;
        state.noiseSourceRight.connect(state.rightGain);

        state.noiseSourceLeft.start();
        state.noiseSourceRight.start();
    } else {
        // Different noise to each channel
        state.noiseSourceLeft = state.audioContext.createBufferSource();
        state.noiseSourceLeft.buffer = state.noiseBufferLeft;
        state.noiseSourceLeft.loop = true;
        state.noiseSourceLeft.connect(state.leftGain);

        state.noiseSourceRight = state.audioContext.createBufferSource();
        state.noiseSourceRight.buffer = state.noiseBufferRight;
        state.noiseSourceRight.loop = true;
        state.noiseSourceRight.connect(state.rightGain);

        state.noiseSourceLeft.start();
        state.noiseSourceRight.start();
    }
}

function startUserAudio(offset = 0) {
    if (!state.userAudioBuffer) return;

    // Create new buffer source
    state.userAudioSource = state.audioContext.createBufferSource();
    state.userAudioSource.buffer = state.userAudioBuffer;
    state.userAudioSource.loop = false;

    // Split stereo into separate channels
    const userSplitter = state.audioContext.createChannelSplitter(2);
    state.userAudioSource.connect(userSplitter);

    // Route left channel to left gain
    userSplitter.connect(state.leftGain, 0);

    // Route right channel to right gain (which goes through polarity)
    userSplitter.connect(state.rightGain, 1);

    // Handle playback end
    state.userAudioSource.onended = () => {
        if (state.isPlaying && state.currentSource === 2) {
            state.isPlaying = false;
            state.userAudioPausedAt = 0;
            updatePlayButton();
            updateProgressBar(0);
            stopCorrelationMeter();
        }
    };

    state.userAudioStartTime = state.audioContext.currentTime - offset;
    state.userAudioSource.start(0, offset);

    // Start progress update
    startProgressUpdate();
}

// ============================================
// Scenario Control
// ============================================

function setCorrelation(correlated) {
    if (state.isCorrelated === correlated) return;
    state.isCorrelated = correlated;

    // If pink noise is playing, restart it with new correlation setting
    if (state.isPlaying && state.currentSource === 1) {
        startPinkNoise();
    }

    updateScenarioButtons();
}

function setPolarity(inverted) {
    if (state.isInverted === inverted) return;
    state.isInverted = inverted;

    // Update the polarity gain node
    if (state.rightPolarity) {
        state.rightPolarity.gain.setValueAtTime(
            inverted ? -1 : 1,
            state.audioContext.currentTime
        );
    }

    updateScenarioButtons();
}

function setScenario(correlated, inverted) {
    state.isCorrelated = correlated;
    state.isInverted = inverted;

    // Update polarity
    if (state.rightPolarity) {
        state.rightPolarity.gain.setValueAtTime(
            inverted ? -1 : 1,
            state.audioContext.currentTime
        );
    }

    // If pink noise is playing, restart with new correlation
    if (state.isPlaying && state.currentSource === 1) {
        startPinkNoise();
    }

    updateScenarioButtons();
}

/**
 * Set output mode (stereo or mono)
 * In mono mode, L+R are summed after polarity processing
 * This demonstrates how inverted correlated content cancels in mono
 */
function setOutputMode(isMono) {
    if (state.isMono === isMono) return;
    state.isMono = isMono;

    // Disconnect current output routing
    state.merger.disconnect();
    state.monoSummer.disconnect();

    if (isMono) {
        // Mono mode: route mono summer to master gain
        // The mono summer already receives both L and R (after polarity)
        state.monoSummer.connect(state.masterGain);
    } else {
        // Stereo mode: route merger to master gain
        state.merger.connect(state.masterGain);
    }

    updateOutputModeButtons();
}

function updateOutputModeButtons() {
    const buttons = document.querySelectorAll('.output-mode-button');
    buttons.forEach(button => {
        const output = button.dataset.output;
        const isActive = (output === 'mono' && state.isMono) || (output === 'stereo' && !state.isMono);
        button.classList.toggle('active', isActive);
    });
}

// ============================================
// User Audio Upload
// ============================================

async function handleAudioFile(file) {
    if (!file || !file.type.startsWith('audio/')) {
        alert('Please select a valid audio file.');
        return;
    }

    // Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 100MB.');
        return;
    }

    // Stop any current playback
    if (state.isPlaying) {
        stopAudio();
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        state.userAudioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
        state.userAudioDuration = state.userAudioBuffer.duration;
        state.userAudioPausedAt = 0;

        // Update UI
        document.getElementById('total-time').textContent = formatTime(state.userAudioDuration);
        document.getElementById('current-time').textContent = '0:00';
        document.getElementById('playback-controls').classList.remove('hidden');

        // Hide original upload area when file is loaded
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.add('hidden');
        }

        updateProgressBar(0);

        console.log('Audio loaded:', file.name, formatTime(state.userAudioDuration));
    } catch (error) {
        console.error('Error decoding audio:', error);
        alert('Could not decode audio file. Please try a different file.');
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// Correlation Meter (Polar Scatter / Goniometer style)
// ============================================

function startCorrelationMeter() {
    if (state.meterAnimationId) return;

    const leftData = new Float32Array(state.analyserBufferSize);
    const rightData = new Float32Array(state.analyserBufferSize);

    // Reset correlation state
    state.correlation.lpfLR = 0;
    state.correlation.lpfL2 = 0;
    state.correlation.lpfR2 = 0;
    state.correlation.fastAvg = 0;
    state.correlation.slowAvg = 0;
    state.correlation.smoothedFastAvg = 0;
    state.scatterHistory = [];

    function updateMeter() {
        state.analyserLeft.getFloatTimeDomainData(leftData);
        state.analyserRight.getFloatTimeDomainData(rightData);

        // Calculate correlation using LPF method
        const correlation = calculateCorrelationLPF(leftData, rightData);

        // Update scatter history with new samples (subsample for performance)
        updateScatterHistory(leftData, rightData);

        // Draw the polar scatter meter
        drawPolarScatterMeter(correlation);
        updateCorrelationValue(state.correlation.slowAvg);

        state.meterAnimationId = requestAnimationFrame(updateMeter);
    }

    updateMeter();
}

function stopCorrelationMeter() {
    if (state.meterAnimationId) {
        cancelAnimationFrame(state.meterAnimationId);
        state.meterAnimationId = null;
    }
}

/**
 * Calculate correlation using LPF-based method with fast/slow averaging
 * Formula: correlation = LPF(L*R) / sqrt(LPF(L²) * LPF(R²))
 */
function calculateCorrelationLPF(leftData, rightData) {
    const n = leftData.length;
    const coeff = state.correlation.lpfCoeff;

    // Process samples and update LPF state
    for (let i = 0; i < n; i++) {
        const L = leftData[i];
        const R = rightData[i];

        // Apply one-pole LPF to each term
        state.correlation.lpfLR += coeff * (L * R - state.correlation.lpfLR);
        state.correlation.lpfL2 += coeff * (L * L - state.correlation.lpfL2);
        state.correlation.lpfR2 += coeff * (R * R - state.correlation.lpfR2);
    }

    // Calculate correlation coefficient
    const denominator = Math.sqrt(state.correlation.lpfL2 * state.correlation.lpfR2);

    let correlation = 0;
    if (denominator > 1e-10) {
        correlation = state.correlation.lpfLR / denominator;
        // Clamp to valid range
        correlation = Math.max(-1, Math.min(1, correlation));
    }

    // Handle NaN/Infinity edge cases
    if (!isFinite(correlation)) {
        correlation = 0;
    }

    // Update fast and slow averagers
    state.correlation.fastAvg += state.correlation.fastCoeff * (correlation - state.correlation.fastAvg);
    state.correlation.slowAvg += state.correlation.slowCoeff * (correlation - state.correlation.slowAvg);

    // Update smoothed fast average (follows fastAvg but with reduced jitter)
    state.correlation.smoothedFastAvg += state.correlation.smoothCoeff * (state.correlation.fastAvg - state.correlation.smoothedFastAvg);

    return correlation;
}

/**
 * Update scatter history with subsampled L/R pairs
 * Converts to polar coordinates for the goniometer display
 */
function updateScatterHistory(leftData, rightData) {
    const subsampleRate = 8; // Take every 8th sample
    const newPoints = [];

    for (let i = 0; i < leftData.length; i += subsampleRate) {
        const L = leftData[i];
        const R = rightData[i];

        // Skip silent samples
        if (Math.abs(L) < 0.001 && Math.abs(R) < 0.001) continue;

        // Convert L/R to Mid/Side (goniometer coordinates)
        // Mid = (L + R) / sqrt(2), Side = (L - R) / sqrt(2)
        const mid = (L + R) * 0.7071;
        const side = (L - R) * 0.7071;

        // Calculate magnitude for alpha/size
        const magnitude = Math.sqrt(L * L + R * R);

        newPoints.push({
            mid: mid,
            side: side,
            magnitude: magnitude,
            age: 0  // For fade effect
        });
    }

    // Add new points to history
    state.scatterHistory = state.scatterHistory.concat(newPoints);

    // Age existing points and remove old ones
    state.scatterHistory = state.scatterHistory.filter(point => {
        point.age++;
        return point.age < 60; // Keep points for ~60 frames (~1 second at 60fps)
    });

    // Limit total points
    if (state.scatterHistory.length > state.maxScatterPoints) {
        state.scatterHistory = state.scatterHistory.slice(-state.maxScatterPoints);
    }
}

/**
 * Draw the polar scatter meter (goniometer style)
 * Shows L/R samples as dots dispersed across a half-circle
 * With a vertical correlation indicator on the right
 */
function drawPolarScatterMeter(correlation) {
    const canvas = document.getElementById('correlation-meter');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Reserve space for vertical indicator on the right
    const indicatorWidth = 35;
    const meterWidth = width - indicatorWidth;

    const centerX = meterWidth / 2;
    const centerY = height - 15;
    const radius = Math.min(meterWidth / 2 - 25, height - 35);

    // Get theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#1f2937' : '#f3f4f6';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    const textColor = isDark ? '#9ca3af' : '#6b7280';
    const tickColor = isDark ? '#4b5563' : '#9ca3af';

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw correlation zone backgrounds (subtle color coding)
    // Negative zone (red tint) - bottom half of semicircle
    const negativeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    if (isDark) {
        negativeGradient.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
        negativeGradient.addColorStop(1, 'rgba(239, 68, 68, 0.15)');
    } else {
        negativeGradient.addColorStop(0, 'rgba(239, 68, 68, 0.03)');
        negativeGradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
    }

    // Draw negative zone (bottom arc from ~135° to ~45°)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 0.25, true);
    ctx.closePath();
    ctx.fillStyle = negativeGradient;
    ctx.fill();

    // Positive zone (green tint) - top of semicircle
    const positiveGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    if (isDark) {
        positiveGradient.addColorStop(0, 'rgba(34, 197, 94, 0.03)');
        positiveGradient.addColorStop(1, 'rgba(34, 197, 94, 0.1)');
    } else {
        positiveGradient.addColorStop(0, 'rgba(34, 197, 94, 0.02)');
        positiveGradient.addColorStop(1, 'rgba(34, 197, 94, 0.08)');
    }

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI, false);
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 0.25, false);
    ctx.closePath();
    ctx.fillStyle = positiveGradient;
    ctx.fill();

    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Radial grid lines (from center outward)
    const gridAngles = [0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4, Math.PI];
    gridAngles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY - Math.sin(angle) * radius
        );
        ctx.stroke();
    });

    // Arc grid lines (concentric)
    [0.33, 0.66, 1].forEach(scale => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, Math.PI, 0);
        ctx.stroke();
    });

    // Draw scatter points
    state.scatterHistory.forEach(point => {
        // Map mid/side to canvas coordinates
        // Mid goes up (positive = towards +1), Side goes left/right
        const scale = radius * 0.85; // Scale factor

        // Normalize and clamp the values
        const normalizedMid = Math.max(-1, Math.min(1, point.mid * 2));
        const normalizedSide = Math.max(-1, Math.min(1, point.side * 2));

        // Convert to screen coordinates
        // Side = horizontal (left/right), Mid = vertical (down is negative, up is positive)
        const x = centerX + normalizedSide * scale;
        const y = centerY - normalizedMid * scale; // Invert Y so positive mid goes up

        // Only draw if in visible area
        if (y > 0 && y < centerY + 10) {
            // Calculate alpha based on age (fade out)
            const alpha = Math.max(0.1, 1 - (point.age / 60) * 0.9);

            // Color based on vertical position (correlation zone)
            let dotColor;
            if (normalizedMid < -0.2) {
                // Negative correlation zone - red
                dotColor = isDark ? `rgba(248, 113, 113, ${alpha})` : `rgba(220, 38, 38, ${alpha})`;
            } else if (normalizedMid > 0.3) {
                // Strong positive correlation - green
                dotColor = isDark ? `rgba(74, 222, 128, ${alpha})` : `rgba(22, 163, 74, ${alpha})`;
            } else {
                // Neutral zone - blue
                dotColor = isDark ? `rgba(96, 165, 250, ${alpha})` : `rgba(37, 99, 235, ${alpha})`;
            }

            // Dot size based on magnitude
            const dotSize = 1.5 + point.magnitude * 3;

            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }
    });

    // Draw tick marks and labels
    ctx.font = '11px SF Mono, Monaco, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;

    const ticks = [
        { angle: Math.PI, label: 'L', position: 'outer' },
        { angle: 0, label: 'R', position: 'outer' },
        { angle: Math.PI / 2, label: '+1', position: 'outer' },
        { angle: Math.PI * 3 / 4, label: '', position: 'tick' },
        { angle: Math.PI / 4, label: '', position: 'tick' }
    ];

    ticks.forEach(tick => {
        const labelRadius = radius + 12;
        const labelX = centerX + Math.cos(tick.angle) * labelRadius;
        const labelY = centerY - Math.sin(tick.angle) * labelRadius;

        if (tick.label) {
            ctx.fillText(tick.label, labelX, labelY);
        }

        // Draw small tick mark
        const innerR = radius - 3;
        const outerR = radius + 3;
        ctx.beginPath();
        ctx.moveTo(
            centerX + Math.cos(tick.angle) * innerR,
            centerY - Math.sin(tick.angle) * innerR
        );
        ctx.lineTo(
            centerX + Math.cos(tick.angle) * outerR,
            centerY - Math.sin(tick.angle) * outerR
        );
        ctx.strokeStyle = tickColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw L/R labels only (removed -1 and 0 labels from semicircle)
    // They are now on the vertical indicator

    // ========================================
    // Draw vertical correlation indicator on the right
    // ========================================
    const barX = meterWidth + 8;
    const barWidth = 12;
    const barTop = 20;
    const barBottom = height - 25;
    const barHeight = barBottom - barTop;

    // Draw bar background with gradient zones
    // Top (green) = +1, Middle (blue) = 0, Bottom (red) = -1
    const barGradient = ctx.createLinearGradient(0, barTop, 0, barBottom);
    if (isDark) {
        barGradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
        barGradient.addColorStop(0.4, 'rgba(34, 197, 94, 0.15)');
        barGradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.2)');
        barGradient.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
        barGradient.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
    } else {
        barGradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
        barGradient.addColorStop(0.4, 'rgba(34, 197, 94, 0.1)');
        barGradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.15)');
        barGradient.addColorStop(0.6, 'rgba(239, 68, 68, 0.1)');
        barGradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
    }

    // Draw bar background
    ctx.fillStyle = barGradient;
    ctx.fillRect(barX, barTop, barWidth, barHeight);

    // Draw bar border
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barTop, barWidth, barHeight);

    // Draw tick marks and labels on the bar
    ctx.font = '10px SF Mono, Monaco, monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const barLabels = [
        { value: 1, label: '+1' },
        { value: 0, label: '0' },
        { value: -1, label: '-1' }
    ];

    barLabels.forEach(({ value, label }) => {
        // Map value (-1 to +1) to y position (barBottom to barTop)
        const y = barBottom - ((value + 1) / 2) * barHeight;

        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(barX - 3, y);
        ctx.lineTo(barX, y);
        ctx.strokeStyle = tickColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw label to the right of the bar
        ctx.fillText(label, barX + barWidth + 3, y);
    });

    // Draw correlation indicator as a dot (use smoothedFastAvg for responsive yet smooth movement)
    const correlationValue = state.correlation.smoothedFastAvg;
    const indicatorY = barBottom - ((correlationValue + 1) / 2) * barHeight;
    const indicatorX = barX + barWidth / 2;

    // Indicator color based on correlation value
    let indicatorColor;
    if (correlationValue < -0.3) {
        indicatorColor = isDark ? '#f87171' : '#dc2626';
    } else if (correlationValue > 0.5) {
        indicatorColor = isDark ? '#4ade80' : '#16a34a';
    } else {
        indicatorColor = isDark ? '#60a5fa' : '#2563eb';
    }

    // Draw the dot indicator
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
    ctx.fillStyle = indicatorColor;
    ctx.fill();

    // Draw a glow around the dot
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = indicatorColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function updateCorrelationValue(correlation) {
    const valueEl = document.getElementById('correlation-value');
    if (valueEl) {
        const sign = correlation >= 0 ? '+' : '';
        valueEl.textContent = sign + correlation.toFixed(2);
    }
}

// ============================================
// Progress Bar
// ============================================

function startProgressUpdate() {
    // Cancel any existing animation
    if (state.progressAnimationId) {
        cancelAnimationFrame(state.progressAnimationId);
        state.progressAnimationId = null;
    }

    function update() {
        // Check if we should continue updating
        // Note: we check userAudioSource instead of isPlaying because isPlaying
        // may not be set yet when startProgressUpdate is called from startUserAudio
        if (!state.userAudioSource || state.currentSource !== 2) {
            state.progressAnimationId = null;
            return;
        }

        const elapsed = state.audioContext.currentTime - state.userAudioStartTime;
        const progress = Math.min(elapsed / state.userAudioDuration, 1);

        updateProgressBar(progress);
        document.getElementById('current-time').textContent = formatTime(elapsed);

        state.progressAnimationId = requestAnimationFrame(update);
    }

    update();
}

function updateProgressBar(progress) {
    const fill = document.getElementById('progress-fill');
    if (fill) {
        fill.style.width = `${progress * 100}%`;
    }
}

// ============================================
// UI Updates
// ============================================

function updatePlayButton() {
    const button = document.getElementById('play-button');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (button && playIcon && pauseIcon) {
        // Only show playing state for user audio
        const isUserAudioPlaying = state.isPlaying && state.currentSource === 2;
        button.setAttribute('aria-label', isUserAudioPlaying ? 'Pause audio' : 'Play audio');

        if (isUserAudioPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }
}

function updateScenarioButtons() {
    const buttons = document.querySelectorAll('.scenario-button');
    buttons.forEach(button => {
        const correlated = button.dataset.correlated === 'true';
        const inverted = button.dataset.inverted === 'true';

        button.classList.toggle('active',
            correlated === state.isCorrelated && inverted === state.isInverted
        );
    });
}

function updateSourceButtons() {
    const buttons = document.querySelectorAll('.source-button');
    buttons.forEach(button => {
        const source = parseInt(button.dataset.source, 10);
        button.classList.toggle('active', source === state.currentSource);
    });
}

function updateGainDisplay() {
    const display = document.getElementById('gain-display');
    const currentGain = state.currentSource === 2 ? state.userAudioGainValue : state.pinkNoiseGainValue;
    if (display) {
        display.textContent = Math.round(currentGain);
    }
}

function updateGainForSource(source) {
    const gainSlider = document.getElementById('master-gain');
    const gainValue = source === 2 ? state.userAudioGainValue : state.pinkNoiseGainValue;

    // Update slider position
    if (gainSlider) {
        gainSlider.value = gainValue;
        updateSliderFill(gainSlider);
    }

    // Update master gain node
    if (state.masterGain) {
        state.masterGain.gain.setValueAtTime(
            dbToLinear(gainValue),
            state.audioContext.currentTime
        );
    }

    updateGainDisplay();
}

function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(90deg, #2563eb 0%, #3b82f6 ${percentage}%, var(--color-control-bg) ${percentage}%, var(--color-control-bg) 100%)`;
}

// ============================================
// Source Selection
// ============================================

function setSource(source) {
    // Stop current audio first
    if (state.isPlaying) {
        stopAudio();
    }

    state.currentSource = source;

    // Toggle uncorrelated buttons and user audio section
    const uncorrelatedSame = document.getElementById('uncorrelated-same');
    const uncorrelatedInverted = document.getElementById('uncorrelated-inverted');
    const userAudioSection = document.getElementById('user-audio-section');
    const correlationLabels = document.querySelectorAll('.scenario-correlation');

    if (source === 2) {
        // User Audio: hide uncorrelated buttons, show user audio section in their place
        if (uncorrelatedSame) uncorrelatedSame.classList.add('hidden');
        if (uncorrelatedInverted) uncorrelatedInverted.classList.add('hidden');
        if (userAudioSection) userAudioSection.classList.remove('hidden');

        // Hide "Correlated Audio" labels on the remaining buttons
        correlationLabels.forEach(label => label.classList.add('hidden'));

        // If currently on an uncorrelated scenario, switch to correlated same polarity
        if (!state.isCorrelated) {
            setScenario(true, false);
        }
    } else {
        // Mute or Pink Noise: show all 4 scenario buttons, hide user audio section
        if (uncorrelatedSame) uncorrelatedSame.classList.remove('hidden');
        if (uncorrelatedInverted) uncorrelatedInverted.classList.remove('hidden');
        if (userAudioSection) userAudioSection.classList.add('hidden');

        // Show "Correlated Audio" labels
        correlationLabels.forEach(label => label.classList.remove('hidden'));
    }

    // Update gain slider and master gain based on source
    updateGainForSource(source);

    // Auto-play pink noise when selected
    if (source === 1) {
        // Resume context if suspended (required for iOS)
        (async () => {
            if (state.audioContext.state === 'suspended') {
                try {
                    await state.audioContext.resume();
                    console.log('Audio context resumed');
                } catch (err) {
                    console.error('Failed to resume audio context:', err);
                    return;
                }
            }
            startPinkNoise();
            state.isPlaying = true;
            startCorrelationMeter();
        })();
    }

    // For user audio, don't auto-play - let user click play button
    updatePlayButton();
}

// ============================================
// Auto Demo
// ============================================

function startDemo() {
    if (state.demoRunning) {
        stopDemo();
        return;
    }

    state.demoRunning = true;

    // Save current state to restore after demo
    const savedState = {
        source: state.currentSource,
        correlated: state.isCorrelated,
        inverted: state.isInverted,
        mono: state.isMono
    };

    // Switch to pink noise
    setSource(1);
    updateSourceButtons();

    // Update button appearance
    const demoBtn = document.getElementById('auto-demo-btn');
    demoBtn.classList.add('demo-running');
    demoBtn.innerHTML = `
        <svg class="demo-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Stop Demo
    `;

    // Show status display
    document.getElementById('demo-status').classList.remove('hidden');

    let stepIndex = 0;
    const stepDuration = 4000; // 4 seconds per step

    function runStep() {
        if (!state.demoRunning || stepIndex >= DEMO_SEQUENCE.length) {
            stopDemo(savedState);
            return;
        }

        const step = DEMO_SEQUENCE[stepIndex];

        // Apply the scenario
        setScenario(step.correlated, step.inverted);
        setOutputMode(step.mono);

        // Update status display with flash effect
        const demoStatus = document.getElementById('demo-status');
        document.getElementById('demo-status-text').textContent = `${step.label}: ${step.message}`;

        // Trigger flash animation
        demoStatus.classList.remove('flash');
        // Force reflow to restart animation
        void demoStatus.offsetWidth;
        demoStatus.classList.add('flash');

        stepIndex++;
        state.demoTimeoutId = setTimeout(runStep, stepDuration);
    }

    // Start the demo
    runStep();
}

function stopDemo(savedState = null) {
    state.demoRunning = false;

    // Clear any pending timeout
    if (state.demoTimeoutId) {
        clearTimeout(state.demoTimeoutId);
        state.demoTimeoutId = null;
    }

    // Reset button
    const demoBtn = document.getElementById('auto-demo-btn');
    if (demoBtn) {
        demoBtn.classList.remove('demo-running');
        demoBtn.innerHTML = `
            <svg class="demo-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Auto Demo
        `;
    }

    // Hide status display
    const demoStatus = document.getElementById('demo-status');
    if (demoStatus) {
        demoStatus.classList.add('hidden');
    }

    // Stop audio and restore state
    if (savedState) {
        stopAudio();
        setSource(savedState.source);
        updateSourceButtons();
        setScenario(savedState.correlated, savedState.inverted);
        setOutputMode(savedState.mono);
    } else {
        // Default: stop audio and set to mute
        stopAudio();
        setSource(0);
        updateSourceButtons();
        setScenario(true, false);
        setOutputMode(false);
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Play button
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', togglePlayback);
    }

    // Gain slider
    const gainSlider = document.getElementById('master-gain');
    if (gainSlider) {
        updateSliderFill(gainSlider);

        gainSlider.addEventListener('input', (e) => {
            const gainValue = parseFloat(e.target.value);

            // Save to the appropriate state variable based on current source
            if (state.currentSource === 2) {
                state.userAudioGainValue = gainValue;
            } else {
                state.pinkNoiseGainValue = gainValue;
            }

            if (state.masterGain) {
                state.masterGain.gain.setValueAtTime(
                    dbToLinear(gainValue),
                    state.audioContext.currentTime
                );
            }
            updateGainDisplay();
            updateSliderFill(gainSlider);
        });
    }

    // Source buttons
    const sourceButtons = document.querySelectorAll('.source-button');
    sourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const source = parseInt(button.dataset.source, 10);
            setSource(source);
            updateSourceButtons();
        });
    });

    // Scenario buttons
    const scenarioButtons = document.querySelectorAll('.scenario-button');
    scenarioButtons.forEach(button => {
        button.addEventListener('click', () => {
            const correlated = button.dataset.correlated === 'true';
            const inverted = button.dataset.inverted === 'true';
            setScenario(correlated, inverted);
        });
    });

    // Output mode buttons (Stereo/Mono)
    const outputModeButtons = document.querySelectorAll('.output-mode-button');
    outputModeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const output = button.dataset.output;
            setOutputMode(output === 'mono');
        });
    });

    // File upload (both original and compact)
    const fileInput = document.getElementById('audio-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleAudioFile(e.target.files[0]);
            }
        });
    }

    const fileInputCompact = document.getElementById('audio-file-input-compact');
    if (fileInputCompact) {
        fileInputCompact.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleAudioFile(e.target.files[0]);
            }
        });
    }

    // Drag and drop
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
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

    // Progress bar seek
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (!state.userAudioBuffer) return;

            const rect = progressBar.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const seekTime = percentage * state.userAudioDuration;

            // If playing, seek by restarting
            if (state.isPlaying && state.currentSource === 2) {
                if (state.userAudioSource) {
                    state.userAudioSource.onended = null;
                    state.userAudioSource.stop();
                    state.userAudioSource.disconnect();
                    state.userAudioSource = null;
                }
                if (state.progressAnimationId) {
                    cancelAnimationFrame(state.progressAnimationId);
                    state.progressAnimationId = null;
                }
                startUserAudio(seekTime);
            } else {
                state.userAudioPausedAt = seekTime;
                updateProgressBar(percentage);
                document.getElementById('current-time').textContent = formatTime(seekTime);
            }
        });
    }

    // Theme change observer for meter redraw
    const observer = new MutationObserver(() => {
        if (!state.isPlaying) {
            drawPolarScatterMeter(0);
        }
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Auto Demo button
    const demoBtn = document.getElementById('auto-demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', startDemo);
    }
}

// ============================================
// Initialization
// ============================================

function init() {
    createAudioContext();
    setupEventListeners();

    // Draw initial meter state (empty polar scatter)
    drawPolarScatterMeter(0);

    // Set initial state
    updateScenarioButtons();
    updateSourceButtons();
    updateOutputModeButtons();

    // Set initial gain slider to pink noise value (default source)
    const gainSlider = document.getElementById('master-gain');
    if (gainSlider) {
        gainSlider.value = state.pinkNoiseGainValue;
        updateSliderFill(gainSlider);
    }
    updateGainDisplay();

    console.log('Phase Correlation app initialized');
}

// Handle audio context suspension (browsers require user gesture)
function setupContextResume() {
    const resumeContext = async () => {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            try {
                await state.audioContext.resume();
                console.log('Audio context resumed');
            } catch (err) {
                console.error('Failed to resume audio context:', err);
            }
        }
    };

    document.addEventListener('click', resumeContext, { once: true });
    document.addEventListener('keydown', resumeContext, { once: true });
    document.addEventListener('touchstart', resumeContext, { once: true });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupContextResume();
});
