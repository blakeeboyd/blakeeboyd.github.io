/**
 * Stereo Mic Techniques
 * Decode first-order Ambisonic (B-format) recordings into virtual stereo
 * microphone configurations using the Web Audio API.
 *
 * Audio Pipeline (Virtual Mic modes):
 *   AudioBufferSourceNode (4-ch)
 *     → ChannelSplitter (4 outputs: mapped by format)
 *       → gainL.w, gainL.x, gainL.y → sumL → delayL → merger ch0
 *       → gainR.w, gainR.x, gainR.y → sumR → delayR → merger ch1
 *     → ChannelMerger (stereo)
 *     → masterGain → destination
 *
 * Audio Pipeline (Binaural mode):
 *   AudioBufferSourceNode (4-ch, AmbiX order)
 *     → Omnitone FOARenderer
 *     → masterGain → destination
 */

(function() {
    'use strict';

    // ========================================
    // State
    // ========================================

    var state = {
        audioContext: null,
        masterGain: null,

        // B-format routing
        channelSplitter: null,
        channelMerger: null,
        gainL: { w: null, x: null, y: null },
        gainR: { w: null, x: null, y: null },
        sumL: null,
        sumR: null,
        delayL: null,
        delayR: null,

        // Solo/mono routing
        soloGainL: null,
        soloGainR: null,
        monoSplitter: null,
        monoMerger: null,
        monoGainL: null,
        monoGainR: null,

        // Binaural
        foaRenderer: null,
        foaInitialized: false,

        // Audio buffer
        audioBuffer: null,
        audioSource: null,
        audioStartTime: 0,
        audioPausedAt: 0,
        audioDuration: 0,
        isPlaying: false,
        isLooping: false,

        // Settings
        channelFormat: 'ambix',
        technique: 'xy',

        xy: { angle: 90, p: 0.5 },
        ortf: { angle: 110, p: 0.5 },
        ms: { midP: 0.5, width: 1.0 },
        blumlein: { angle: 90, p: 0 },
        binaural: { yaw: 0 },

        gainValue: -12,

        // Monitoring
        soloLeft: false,
        soloRight: false,
        isMono: false,

        // Animation
        progressAnimationId: null,

        // Yaw drag
        yawDragging: false,

        // User-uploaded files (stored for switching)
        userFiles: {}  // { filename: AudioBuffer }
    };

    // ========================================
    // DOM References
    // ========================================

    var audioSourceRow = document.getElementById('audio-source-row');
    var uploadCompact = document.getElementById('upload-compact');
    var fileInput = document.getElementById('audio-file-input');
    var presetSelect = document.getElementById('preset-select');
    var playbackControls = document.getElementById('playback-controls');
    var playButton = document.getElementById('play-button');
    var playIcon = document.getElementById('play-icon');
    var pauseIcon = document.getElementById('pause-icon');
    var waveformWrapper = document.getElementById('waveform-wrapper');
    var waveformCanvas = document.getElementById('waveform-canvas');
    var waveformCtx = waveformCanvas.getContext('2d');
    var waveformProgress = document.getElementById('waveform-progress');
    var waveformCursor = document.getElementById('waveform-cursor');
    var currentTimeEl = document.getElementById('current-time');
    var totalTimeEl = document.getElementById('total-time');
    var loopToggle = document.getElementById('loop-toggle');
    var formatSelector = document.getElementById('format-selector');
    var gainSlider = document.getElementById('master-gain');
    var gainDisplay = document.getElementById('gain-display');

    // Monitoring controls
    var soloLeftBtn = document.getElementById('solo-left-btn');
    var soloRightBtn = document.getElementById('solo-right-btn');
    var soloLeftLabel = document.getElementById('solo-left-label');
    var soloRightLabel = document.getElementById('solo-right-label');
    var monoToggle = document.getElementById('mono-toggle');
    var monoToggleLabel = document.getElementById('mono-toggle-label');

    var techniqueButtons = document.querySelectorAll('.technique-button');
    var paramsPanels = {
        xy: document.getElementById('params-xy'),
        ortf: document.getElementById('params-ortf'),
        ms: document.getElementById('params-ms'),
        blumlein: document.getElementById('params-blumlein'),
        binaural: document.getElementById('params-binaural')
    };

    // XY controls
    var xyAngleSlider = document.getElementById('xy-angle');
    var xyAngleDisplay = document.getElementById('xy-angle-display');
    var xyAnglePresets = document.querySelectorAll('.angle-preset');
    var xyPatternButtons = document.querySelectorAll('#params-xy .pattern-button');

    // MS controls
    var msWidthSlider = document.getElementById('ms-width');
    var msWidthDisplay = document.getElementById('ms-width-display');
    var msPatternButtons = document.querySelectorAll('#ms-pattern-group .pattern-button');

    // Binaural controls
    var yawDial = document.getElementById('yaw-dial');
    var yawDisplay = document.getElementById('yaw-display');

    // Technique description (inside params card)
    var techniqueDescriptionEl = document.getElementById('technique-description');

    // Polar canvas
    var polarCanvas = document.getElementById('polar-canvas');
    var polarCtx = polarCanvas.getContext('2d');

    // Format buttons
    var formatButtons = document.querySelectorAll('.format-button');

    // Technique descriptions (shown inside params card)
    var techniqueDescriptions = {
        xy: 'Two directional microphones at the same point, angled apart symmetrically. The stereo image comes entirely from level differences created by each mic\'s directional pattern, with no time-of-arrival differences between channels.',
        ortf: 'Two cardioids angled at 110\u00B0 with 17cm capsule spacing (roughly the distance between human ears). The combination of level and time cues gives ORTF a wider, more natural-sounding stereo image than pure XY, while maintaining good mono compatibility.',
        ms: 'A forward-facing mid mic paired with a sideways figure-8 side mic. Left = Mid + Side, Right = Mid \u2212 Side. The key advantage is continuously variable stereo width after recording.',
        blumlein: 'Two figure-8 microphones at 90\u00B0, capturing the full ambient field including reflections from behind the mics. Produces a remarkably natural and spacious stereo image with precise localization.',
        binaural: 'Simulates how sound reaches your eardrums by applying Head-Related Transfer Functions (HRTFs). When heard over headphones, binaural audio creates a convincing illusion of sounds arriving from specific directions in 3D space.'
    };

    function updateTechniqueInfo(technique) {
        if (techniqueDescriptionEl && techniqueDescriptions[technique]) {
            techniqueDescriptionEl.textContent = techniqueDescriptions[technique];
        }
    }

    // ========================================
    // Audio Context
    // ========================================

    function ensureAudioContext() {
        if (state.audioContext) return;
        var AC = window.AudioContext || window.webkitAudioContext;
        state.audioContext = new AC();
        state.masterGain = state.audioContext.createGain();
        state.masterGain.gain.value = dbToLinear(state.gainValue);
        state.masterGain.connect(state.audioContext.destination);
        buildVirtualMicGraph();
    }

    function dbToLinear(db) {
        if (db <= -70) return 0;
        return Math.pow(10, db / 20);
    }

    // ========================================
    // Virtual Mic Audio Graph
    // ========================================

    function buildVirtualMicGraph() {
        var ctx = state.audioContext;

        state.channelSplitter = ctx.createChannelSplitter(4);
        state.channelMerger = ctx.createChannelMerger(2);

        // 3 gain nodes per stereo channel (W, X, Y — Z is not used for horizontal)
        state.gainL.w = ctx.createGain();
        state.gainL.x = ctx.createGain();
        state.gainL.y = ctx.createGain();
        state.gainR.w = ctx.createGain();
        state.gainR.x = ctx.createGain();
        state.gainR.y = ctx.createGain();

        // Sum nodes (sum the 3 weighted channels into one signal per side)
        state.sumL = ctx.createGain();
        state.sumL.gain.value = 1;
        state.sumR = ctx.createGain();
        state.sumR.gain.value = 1;

        // Delay nodes (for ORTF spacing approximation)
        state.delayL = ctx.createDelay(0.01);
        state.delayL.delayTime.value = 0;
        state.delayR = ctx.createDelay(0.01);
        state.delayR.delayTime.value = 0;

        // Solo gain nodes (for muting individual channels)
        state.soloGainL = ctx.createGain();
        state.soloGainL.gain.value = 1;
        state.soloGainR = ctx.createGain();
        state.soloGainR.gain.value = 1;

        // Connect gain nodes → sum nodes
        state.gainL.w.connect(state.sumL);
        state.gainL.x.connect(state.sumL);
        state.gainL.y.connect(state.sumL);
        state.gainR.w.connect(state.sumR);
        state.gainR.x.connect(state.sumR);
        state.gainR.y.connect(state.sumR);

        // Sum → delay → solo gain → merger
        state.sumL.connect(state.delayL);
        state.sumR.connect(state.delayR);
        state.delayL.connect(state.soloGainL);
        state.delayR.connect(state.soloGainR);
        state.soloGainL.connect(state.channelMerger, 0, 0);
        state.soloGainR.connect(state.channelMerger, 0, 1);

        // Build mono mixer
        buildMonoMixer();

        // Wire splitter to gain nodes based on current format
        wireSplitterToGains();
    }

    function buildMonoMixer() {
        var ctx = state.audioContext;

        // For mono: split stereo, sum L+R, send to both channels
        state.monoSplitter = ctx.createChannelSplitter(2);
        state.monoMerger = ctx.createChannelMerger(2);
        state.monoGainL = ctx.createGain();
        state.monoGainR = ctx.createGain();
        state.monoGainL.gain.value = 0.5;
        state.monoGainR.gain.value = 0.5;

        // By default, connect merger directly to master gain (stereo mode)
        state.channelMerger.connect(state.masterGain);
    }

    function setMonoMode(isMono) {
        state.isMono = isMono;
        var ctx = state.audioContext;
        if (!ctx) return;

        // Disconnect merger from master
        try { state.channelMerger.disconnect(); } catch (e) {}

        if (isMono) {
            // Merger → splitter → sum both to both channels
            state.channelMerger.connect(state.monoSplitter);
            state.monoSplitter.connect(state.monoGainL, 0);
            state.monoSplitter.connect(state.monoGainL, 1);
            state.monoSplitter.connect(state.monoGainR, 0);
            state.monoSplitter.connect(state.monoGainR, 1);
            state.monoGainL.connect(state.monoMerger, 0, 0);
            state.monoGainR.connect(state.monoMerger, 0, 1);
            state.monoMerger.connect(state.masterGain);
        } else {
            // Disconnect mono path
            try { state.monoSplitter.disconnect(); } catch (e) {}
            try { state.monoGainL.disconnect(); } catch (e) {}
            try { state.monoGainR.disconnect(); } catch (e) {}
            try { state.monoMerger.disconnect(); } catch (e) {}
            // Direct stereo
            state.channelMerger.connect(state.masterGain);
        }
    }

    function getChannelMap() {
        if (state.channelFormat === 'ambix') {
            // AmbiX: [W, Y, Z, X]
            return { w: 0, x: 3, y: 1, z: 2 };
        } else {
            // FuMa: [W, X, Y, Z]
            return { w: 0, x: 1, y: 2, z: 3 };
        }
    }

    function wireSplitterToGains() {
        var map = getChannelMap();

        // Disconnect all existing connections from splitter
        try { state.channelSplitter.disconnect(); } catch (e) { /* no connections yet */ }

        // Reconnect based on format
        state.channelSplitter.connect(state.gainL.w, map.w);
        state.channelSplitter.connect(state.gainR.w, map.w);
        state.channelSplitter.connect(state.gainL.x, map.x);
        state.channelSplitter.connect(state.gainR.x, map.x);
        state.channelSplitter.connect(state.gainL.y, map.y);
        state.channelSplitter.connect(state.gainR.y, map.y);
    }

    // ========================================
    // Solo Control
    // ========================================

    function updateSoloGains() {
        if (!state.audioContext) return;
        var t = state.audioContext.currentTime;

        // For non-MS techniques: simple L/R muting
        // For MS technique: we handle solo in updateGainsForTechnique() instead
        if (state.technique === 'ms') {
            // MS solo is handled via gain coefficients, not solo gains
            state.soloGainL.gain.setValueAtTime(1, t);
            state.soloGainR.gain.setValueAtTime(1, t);
            // Reapply gains with solo consideration
            updateGainsForTechnique();
            return;
        }

        var leftGain = 1;
        var rightGain = 1;

        if (state.soloLeft && !state.soloRight) {
            // Solo left only
            rightGain = 0;
        } else if (state.soloRight && !state.soloLeft) {
            // Solo right only
            leftGain = 0;
        }
        // If both solo or neither, play both

        state.soloGainL.gain.setValueAtTime(leftGain, t);
        state.soloGainR.gain.setValueAtTime(rightGain, t);
    }

    function updateSoloLabels() {
        // Update labels based on technique
        if (state.technique === 'ms') {
            soloLeftLabel.textContent = 'M';
            soloRightLabel.textContent = 'S';
            soloLeftBtn.setAttribute('aria-label', 'Solo mid channel');
            soloRightBtn.setAttribute('aria-label', 'Solo side channel');
            soloLeftBtn.setAttribute('title', 'Solo Mid');
            soloRightBtn.setAttribute('title', 'Solo Side');
        } else {
            soloLeftLabel.textContent = 'L';
            soloRightLabel.textContent = 'R';
            soloLeftBtn.setAttribute('aria-label', 'Solo left channel');
            soloRightBtn.setAttribute('aria-label', 'Solo right channel');
            soloLeftBtn.setAttribute('title', 'Solo Left');
            soloRightBtn.setAttribute('title', 'Solo Right');
        }
    }

    // ========================================
    // Gain Coefficient Calculations
    // ========================================

    function calculateVirtualMicGains(p, totalAngleDeg) {
        var alpha = (totalAngleDeg / 2) * Math.PI / 180;

        return {
            left: {
                w: p,
                x: (1 - p) * Math.cos(alpha),
                y: (1 - p) * Math.sin(alpha)
            },
            right: {
                w: p,
                x: (1 - p) * Math.cos(alpha),
                y: -(1 - p) * Math.sin(alpha)
            }
        };
    }

    function calculateMSGains(midP, width, soloMid, soloSide) {
        // MS decoding: L = Mid + Side, R = Mid - Side
        // Mid comes from W and X (the forward-facing component)
        // Side comes from Y (the sideways figure-8)

        // Solo Mid: only Mid component, no Side (y = 0)
        // Solo Side: only Side component, no Mid (w = 0, x = 0)
        // Both or neither: normal MS matrix

        var midGain = 1;
        var sideGain = 1;

        if (soloMid && !soloSide) {
            // Solo Mid only: kill the Side component
            sideGain = 0;
        } else if (soloSide && !soloMid) {
            // Solo Side only: kill the Mid component
            midGain = 0;
        }
        // If both or neither, play full MS

        return {
            left: {
                w: midP * midGain,
                x: (1 - midP) * midGain,
                y: width * sideGain
            },
            right: {
                w: midP * midGain,
                x: (1 - midP) * midGain,
                y: -width * sideGain
            }
        };
    }

    function applyGains(gains) {
        var t = state.audioContext.currentTime;
        var ramp = 0.02;

        // Normalize so all techniques produce the same output energy.
        // Use the average RMS of left and right coefficient vectors.
        var lEnergy = Math.sqrt(gains.left.w * gains.left.w + gains.left.x * gains.left.x + gains.left.y * gains.left.y);
        var rEnergy = Math.sqrt(gains.right.w * gains.right.w + gains.right.x * gains.right.x + gains.right.y * gains.right.y);
        var avgEnergy = (lEnergy + rEnergy) / 2;
        // Target energy matches a cardioid (p=0.5) at 90° — the XY default
        var targetEnergy = Math.sqrt(0.5 * 0.5 + 0.354 * 0.354 + 0.354 * 0.354); // ~0.707
        var scale = (avgEnergy > 0.001) ? targetEnergy / avgEnergy : 1;

        state.gainL.w.gain.linearRampToValueAtTime(gains.left.w * scale, t + ramp);
        state.gainL.x.gain.linearRampToValueAtTime(gains.left.x * scale, t + ramp);
        state.gainL.y.gain.linearRampToValueAtTime(gains.left.y * scale, t + ramp);
        state.gainR.w.gain.linearRampToValueAtTime(gains.right.w * scale, t + ramp);
        state.gainR.x.gain.linearRampToValueAtTime(gains.right.x * scale, t + ramp);
        state.gainR.y.gain.linearRampToValueAtTime(gains.right.y * scale, t + ramp);
    }

    function updateGainsForTechnique() {
        if (!state.audioContext) return;

        var gains;
        var t = state.audioContext.currentTime;

        switch (state.technique) {
            case 'xy':
                gains = calculateVirtualMicGains(state.xy.p, state.xy.angle);
                state.delayL.delayTime.setValueAtTime(0, t);
                state.delayR.delayTime.setValueAtTime(0, t);
                break;
            case 'ortf':
                gains = calculateVirtualMicGains(state.ortf.p, state.ortf.angle);
                // 17cm spacing: ~0.5ms delay approximation
                state.delayL.delayTime.setValueAtTime(0, t);
                state.delayR.delayTime.setValueAtTime(0.0005, t);
                break;
            case 'ms':
                gains = calculateMSGains(state.ms.midP, state.ms.width, state.soloLeft, state.soloRight);
                state.delayL.delayTime.setValueAtTime(0, t);
                state.delayR.delayTime.setValueAtTime(0, t);
                break;
            case 'blumlein':
                gains = calculateVirtualMicGains(state.blumlein.p, state.blumlein.angle);
                state.delayL.delayTime.setValueAtTime(0, t);
                state.delayR.delayTime.setValueAtTime(0, t);
                break;
            case 'binaural':
                // Binaural uses Omnitone, not gain matrix
                return;
            default:
                return;
        }

        applyGains(gains);
    }

    // ========================================
    // Binaural Mode (Omnitone)
    // ========================================

    function initBinaural(callback) {
        if (state.foaInitialized) {
            if (callback) callback();
            return;
        }

        if (typeof Omnitone === 'undefined') {
            notify('Omnitone library not loaded. Binaural mode unavailable.', 'error');
            return;
        }

        state.foaRenderer = Omnitone.createFOARenderer(state.audioContext);
        state.foaRenderer.initialize().then(function() {
            state.foaRenderer.output.connect(state.masterGain);
            state.foaInitialized = true;
            if (callback) callback();
        }).catch(function(err) {
            notify('Failed to initialize binaural renderer: ' + err.message, 'error');
            console.error('Omnitone init error:', err);
        });
    }

    function createAmbiXBuffer(originalBuffer) {
        if (state.channelFormat === 'ambix') return originalBuffer;

        // FuMa [W,X,Y,Z] → AmbiX [W,Y,Z,X]
        var ctx = state.audioContext;
        var reordered = ctx.createBuffer(4, originalBuffer.length, originalBuffer.sampleRate);
        reordered.copyToChannel(originalBuffer.getChannelData(0), 0); // W → W
        reordered.copyToChannel(originalBuffer.getChannelData(2), 1); // Y → ch1
        reordered.copyToChannel(originalBuffer.getChannelData(3), 2); // Z → ch2
        reordered.copyToChannel(originalBuffer.getChannelData(1), 3); // X → ch3
        return reordered;
    }

    function updateYawRotation(yawDeg) {
        if (!state.foaRenderer) return;

        var yawRad = yawDeg * Math.PI / 180;
        var cos = Math.cos(yawRad);
        var sin = Math.sin(yawRad);

        // Column-major 3×3 rotation matrix for yaw (around Y-up axis)
        // Negative yaw: when head turns right (+yaw), sound field rotates left
        state.foaRenderer.setRotationMatrix3([
             cos, 0, -sin,
             0,   1,  0,
             sin, 0,  cos
        ]);
    }

    // ========================================
    // Audio File Upload
    // ========================================

    function handleAudioFile(file) {
        if (!file) return;

        var validExtensions = /\.(wav|flac)$/i;
        if (!file.name.match(validExtensions) && !file.type.startsWith('audio/')) {
            notify('Please upload a WAV or FLAC file.', 'error');
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            notify('File too large. Maximum size is 200MB.', 'error');
            return;
        }

        if (state.isPlaying) stopAudio();

        ensureAudioContext();

        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }

        file.arrayBuffer().then(function(arrayBuffer) {
            return state.audioContext.decodeAudioData(arrayBuffer);
        }).then(function(buffer) {
            if (buffer.numberOfChannels !== 4) {
                notify('Expected 4-channel B-format audio, got ' + buffer.numberOfChannels + ' channel' + (buffer.numberOfChannels !== 1 ? 's' : '') + '.', 'error');
                return;
            }

            state.audioBuffer = buffer;
            state.audioDuration = buffer.duration;
            state.audioPausedAt = 0;

            // Store buffer for later switching
            var userKey = 'user:' + file.name;
            state.userFiles[userKey] = buffer;

            // Add to dropdown if not already there
            addUserFileToDropdown(file.name, userKey);

            // Select the newly uploaded file
            presetSelect.value = userKey;

            totalTimeEl.textContent = formatTime(state.audioDuration);
            currentTimeEl.textContent = '0:00';
            updateWaveformProgress(0);
            drawWaveform();

            enablePlaybackControls();

            notify('Loaded: ' + file.name, 'success');
        }).catch(function(err) {
            notify('Error decoding audio file.', 'error');
            console.error('Audio decode error:', err);
        });
    }

    function addUserFileToDropdown(filename, value) {
        // Check if "Your Files" optgroup exists
        var userGroup = presetSelect.querySelector('optgroup[label="Your Files"]');
        if (!userGroup) {
            userGroup = document.createElement('optgroup');
            userGroup.label = 'Your Files';
            // Insert at the beginning, after the placeholder option
            presetSelect.insertBefore(userGroup, presetSelect.querySelector('optgroup'));
        }

        // Check if this file is already in the dropdown
        var existingOption = userGroup.querySelector('option[value="' + value + '"]');
        if (!existingOption) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = filename;
            userGroup.appendChild(option);
        }
    }

    function loadUserFile(key) {
        var buffer = state.userFiles[key];
        if (!buffer) return;

        if (state.isPlaying) stopAudio();

        ensureAudioContext();
        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }

        state.audioBuffer = buffer;
        state.audioDuration = buffer.duration;
        state.audioPausedAt = 0;

        totalTimeEl.textContent = formatTime(state.audioDuration);
        currentTimeEl.textContent = '0:00';
        updateWaveformProgress(0);
        drawWaveform();

        enablePlaybackControls();

        var filename = key.replace('user:', '');
        notify('Loaded: ' + filename, 'success');
    }

    // AmbiX-format preset files (all others are FuMa)
    var ambixPresets = [
        'WilliamDauricio-Batucada_Garantido.wav',
        'WilliamDauricio-Marujada_Caprichoso.wav',
        'clucs-Clock_Test.wav'
    ];

    function loadPresetAudio(filename) {
        if (!filename) return;

        if (state.isPlaying) stopAudio();

        // Auto-switch format based on preset
        var expectedFormat = ambixPresets.indexOf(filename) !== -1 ? 'ambix' : 'fuma';
        if (state.channelFormat !== expectedFormat) {
            switchFormat(expectedFormat);
        }

        ensureAudioContext();

        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }

        // Path relative to project root
        var audioPath = '../../audio/b-format/' + filename;

        notify('Loading ' + filename.replace(/[-_]/g, ' ').replace('.wav', '') + '...', 'info');

        fetch(audioPath)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load audio file');
                }
                return response.arrayBuffer();
            })
            .then(function(arrayBuffer) {
                return state.audioContext.decodeAudioData(arrayBuffer);
            })
            .then(function(buffer) {
                if (buffer.numberOfChannels !== 4) {
                    notify('Expected 4-channel B-format audio, got ' + buffer.numberOfChannels + ' channel' + (buffer.numberOfChannels !== 1 ? 's' : '') + '.', 'error');
                    presetSelect.value = '';
                    return;
                }

                state.audioBuffer = buffer;
                state.audioDuration = buffer.duration;
                state.audioPausedAt = 0;

                totalTimeEl.textContent = formatTime(state.audioDuration);
                currentTimeEl.textContent = '0:00';
                updateWaveformProgress(0);
                drawWaveform();

                enablePlaybackControls();

                var displayName = filename.replace(/[-_]/g, ' ').replace('.wav', '');
                notify('Loaded: ' + displayName, 'success');
            })
            .catch(function(err) {
                notify('Error loading preset audio.', 'error');
                console.error('Preset audio load error:', err);
                presetSelect.value = '';
            });
    }

    // ========================================
    // Playback Control
    // ========================================

    // Shared onended handler for audio source nodes
    function handlePlaybackEnded() {
        if (!state.isLooping && state.isPlaying) {
            stopAudio();
            state.audioPausedAt = 0;
            updateWaveformProgress(0);
            drawWaveform();
            currentTimeEl.textContent = '0:00';
        }
    }

    function startAudio(offset) {
        if (!state.audioBuffer) return;

        ensureAudioContext();
        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }

        // Stop any existing source
        if (state.audioSource) {
            state.audioSource.onended = null;
            try { state.audioSource.stop(); } catch (e) {}
            try { state.audioSource.disconnect(); } catch (e) {}
            state.audioSource = null;
        }

        offset = offset || 0;

        if (state.technique === 'binaural') {
            startBinauralPlayback(offset);
        } else {
            startVirtualMicPlayback(offset);
        }
    }

    function startVirtualMicPlayback(offset) {
        // Ensure merger is connected to masterGain (may have been disconnected for binaural)
        if (!state.isMono) {
            try { state.channelMerger.disconnect(state.masterGain); } catch (e) {}
            state.channelMerger.connect(state.masterGain);
        }

        var source = state.audioContext.createBufferSource();
        source.buffer = state.audioBuffer;
        source.loop = state.isLooping;
        source.connect(state.channelSplitter);
        source.onended = handlePlaybackEnded;

        state.audioSource = source;
        state.audioStartTime = state.audioContext.currentTime - offset;
        source.start(0, offset);
        state.isPlaying = true;

        updatePlayButton();
        updateGainsForTechnique();
        startProgressUpdate();
    }

    function startBinauralPlayback(offset) {
        initBinaural(function() {
            // Disconnect merger from master gain while in binaural mode
            try { state.channelMerger.disconnect(state.masterGain); } catch (e) {}

            var ambiXBuffer = createAmbiXBuffer(state.audioBuffer);
            var source = state.audioContext.createBufferSource();
            source.buffer = ambiXBuffer;
            source.loop = state.isLooping;
            source.connect(state.foaRenderer.input);
            source.onended = handlePlaybackEnded;

            state.audioSource = source;
            state.audioStartTime = state.audioContext.currentTime - offset;
            source.start(0, offset);
            state.isPlaying = true;

            updatePlayButton();
            updateYawRotation(state.binaural.yaw);
            startProgressUpdate();
        });
    }

    function stopAudio() {
        if (state.audioSource) {
            // Nullify onended to prevent it from firing when we call stop()
            state.audioSource.onended = null;
            try { state.audioSource.stop(); } catch (e) {}
            try { state.audioSource.disconnect(); } catch (e) {}
            state.audioSource = null;
        }

        if (state.isPlaying) {
            var elapsed = state.audioContext.currentTime - state.audioStartTime;
            state.audioPausedAt = Math.min(elapsed, state.audioDuration);
        }

        state.isPlaying = false;
        updatePlayButton();
        stopProgressUpdate();

        // Reconnect merger to master gain (may have been disconnected for binaural)
        if (state.channelMerger && state.masterGain) {
            try { state.channelMerger.disconnect(state.masterGain); } catch (e) {}
            if (!state.isMono) {
                state.channelMerger.connect(state.masterGain);
            }
        }
    }

    function togglePlayback() {
        if (!state.audioBuffer) return;

        if (state.isPlaying) {
            stopAudio();
        } else {
            startAudio(state.audioPausedAt);
        }
    }

    function seekTo(fraction) {
        if (!state.audioBuffer) return;

        var offset = fraction * state.audioDuration;

        if (state.isPlaying) {
            // Seamless seek: swap source without stopping playback state
            if (state.audioSource) {
                state.audioSource.onended = null;
                try { state.audioSource.stop(); } catch (e) {}
                try { state.audioSource.disconnect(); } catch (e) {}
                state.audioSource = null;
            }
            stopProgressUpdate();

            state.audioPausedAt = offset;
            currentTimeEl.textContent = formatTime(offset);
            updateWaveformProgress(fraction);
            drawWaveform();

            if (state.technique === 'binaural') {
                startBinauralPlayback(offset);
            } else {
                startVirtualMicPlayback(offset);
            }
        } else {
            state.audioPausedAt = offset;
            currentTimeEl.textContent = formatTime(offset);
            updateWaveformProgress(fraction);
            drawWaveform();
        }
    }

    function enablePlaybackControls() {
        playbackControls.classList.remove('disabled');
        playButton.disabled = false;
        loopToggle.disabled = false;
    }

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

    function startProgressUpdate() {
        stopProgressUpdate();
        function update() {
            if (!state.isPlaying) return;
            var elapsed = state.audioContext.currentTime - state.audioStartTime;
            if (state.isLooping && elapsed > state.audioDuration) {
                elapsed = elapsed % state.audioDuration;
            }
            var fraction = Math.min(elapsed / state.audioDuration, 1);
            updateWaveformProgress(fraction);
            drawWaveform(); // Redraw to update played portion coloring
            currentTimeEl.textContent = formatTime(elapsed);
            state.progressAnimationId = requestAnimationFrame(update);
        }
        state.progressAnimationId = requestAnimationFrame(update);
    }

    function stopProgressUpdate() {
        if (state.progressAnimationId) {
            cancelAnimationFrame(state.progressAnimationId);
            state.progressAnimationId = null;
        }
    }

    function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // ========================================
    // Waveform Visualization
    // ========================================

    function drawWaveform() {
        if (!state.audioBuffer) return;

        var rect = waveformWrapper.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        var width = rect.width;
        var height = rect.height;

        if (width <= 0 || height <= 0) return;

        waveformCanvas.width = width * dpr;
        waveformCanvas.height = height * dpr;
        waveformCanvas.style.width = width + 'px';
        waveformCanvas.style.height = height + 'px';
        waveformCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var waveColor = isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(37, 99, 235, 0.5)';
        var playedColor = isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.8)';

        // Get audio data - use W channel (channel 0) for display
        var rawData = state.audioBuffer.getChannelData(0);
        var samples = Math.floor(width);
        var blockSize = Math.floor(rawData.length / samples);
        var peaks = [];

        // Calculate peaks for each horizontal pixel
        for (var i = 0; i < samples; i++) {
            var start = blockSize * i;
            var sum = 0;
            for (var j = 0; j < blockSize; j++) {
                sum += Math.abs(rawData[start + j] || 0);
            }
            peaks.push(sum / blockSize);
        }

        // Normalize peaks
        var maxPeak = Math.max.apply(null, peaks) || 1;
        for (var k = 0; k < peaks.length; k++) {
            peaks[k] = peaks[k] / maxPeak;
        }

        // Clear canvas
        waveformCtx.clearRect(0, 0, width, height);

        // Draw waveform bars (mirrored top/bottom)
        var barWidth = 2;
        var gap = 1;
        var step = barWidth + gap;
        var centerY = height / 2;
        var maxBarHeight = height / 2 - 4;

        for (var x = 0; x < width; x += step) {
            var peakIndex = Math.floor((x / width) * peaks.length);
            var peak = peaks[peakIndex] || 0;
            var barHeight = Math.max(2, peak * maxBarHeight);

            // Calculate current playback position
            var playedFraction = 0;
            if (state.audioDuration > 0) {
                if (state.isPlaying) {
                    var elapsed = state.audioContext.currentTime - state.audioStartTime;
                    if (state.isLooping && elapsed > state.audioDuration) {
                        elapsed = elapsed % state.audioDuration;
                    }
                    playedFraction = elapsed / state.audioDuration;
                } else {
                    playedFraction = state.audioPausedAt / state.audioDuration;
                }
            }

            var xFraction = x / width;
            waveformCtx.fillStyle = xFraction < playedFraction ? playedColor : waveColor;

            // Top bar
            waveformCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
            // Bottom bar (mirrored)
            waveformCtx.fillRect(x, centerY, barWidth, barHeight);
        }
    }

    function updateWaveformProgress(fraction) {
        waveformProgress.style.width = (fraction * 100) + '%';
    }

    // ========================================
    // Technique Switching
    // ========================================

    function switchTechnique(newTechnique) {
        if (newTechnique === state.technique) return;

        var wasPlaying = state.isPlaying;
        var currentOffset = 0;

        // Need to stop and restart if switching to/from binaural
        var needsRestart = (state.technique === 'binaural' || newTechnique === 'binaural') && wasPlaying;

        if (needsRestart) {
            currentOffset = state.audioContext.currentTime - state.audioStartTime;
            stopAudio();
        }

        state.technique = newTechnique;

        // Update technique buttons
        techniqueButtons.forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.technique === newTechnique);
        });

        // Show/hide parameter panels
        Object.keys(paramsPanels).forEach(function(key) {
            if (paramsPanels[key]) {
                paramsPanels[key].classList.toggle('hidden', key !== newTechnique);
            }
        });

        // Update info bar description
        updateTechniqueInfo(newTechnique);

        // Update solo labels
        updateSoloLabels();

        // Update gains (only for virtual mic modes)
        if (newTechnique !== 'binaural') {
            updateGainsForTechnique();
        }

        // Redraw polar pattern
        drawPolarPattern();

        // Restart if needed
        if (needsRestart) {
            startAudio(currentOffset);
        }
    }

    // ========================================
    // Format Switching
    // ========================================

    function switchFormat(newFormat) {
        if (newFormat === state.channelFormat) return;

        state.channelFormat = newFormat;

        formatButtons.forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.format === newFormat);
        });

        if (state.audioContext) {
            // Rewire splitter connections
            wireSplitterToGains();

            // If playing in binaural mode, restart to pick up new buffer
            if (state.isPlaying && state.technique === 'binaural') {
                var offset = state.audioContext.currentTime - state.audioStartTime;
                stopAudio();
                startAudio(offset);
            }
        }
    }

    // ========================================
    // Polar Pattern Visualization
    // ========================================

    function resizePolarCanvas() {
        var container = polarCanvas.parentElement;
        var rect = container.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        var size = Math.min(rect.width, rect.height, 500);
        if (size <= 0) size = 300;

        polarCanvas.width = size * dpr;
        polarCanvas.height = size * dpr;
        polarCanvas.style.width = size + 'px';
        polarCanvas.style.height = size + 'px';
        polarCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawPolarPattern();
    }

    function getCanvasColors() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            bg: isDark ? '#1e1e1e' : '#f5f5f5',
            grid: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            gridText: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
            left: isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.85)',
            leftFill: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(220, 38, 38, 0.08)',
            right: isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.85)',
            rightFill: isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(37, 99, 235, 0.08)',
            mid: isDark ? 'rgba(74, 222, 128, 0.9)' : 'rgba(22, 163, 74, 0.85)',
            midFill: isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(22, 163, 74, 0.08)',
            side: isDark ? 'rgba(251, 191, 36, 0.9)' : 'rgba(217, 119, 6, 0.85)',
            sideFill: isDark ? 'rgba(251, 191, 36, 0.12)' : 'rgba(217, 119, 6, 0.08)',
            head: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            accent: isDark ? '#60a5fa' : '#2563eb'
        };
    }

    function drawPolarPattern() {
        var w = polarCanvas.width / (window.devicePixelRatio || 1);
        var h = polarCanvas.height / (window.devicePixelRatio || 1);
        var cx = w / 2;
        var cy = h / 2;
        var maxR = Math.min(cx, cy) * 0.85;
        var colors = getCanvasColors();

        polarCtx.clearRect(0, 0, w, h);

        // Background
        polarCtx.fillStyle = colors.bg;
        polarCtx.beginPath();
        polarCtx.arc(cx, cy, maxR + 10, 0, Math.PI * 2);
        polarCtx.fill();

        // Grid circles
        polarCtx.strokeStyle = colors.grid;
        polarCtx.lineWidth = 1;
        [0.25, 0.5, 0.75, 1.0].forEach(function(r) {
            polarCtx.beginPath();
            polarCtx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
            polarCtx.stroke();
        });

        // Cross lines
        polarCtx.beginPath();
        polarCtx.moveTo(cx - maxR, cy);
        polarCtx.lineTo(cx + maxR, cy);
        polarCtx.moveTo(cx, cy - maxR);
        polarCtx.lineTo(cx, cy + maxR);
        polarCtx.stroke();

        // Labels
        polarCtx.fillStyle = colors.gridText;
        polarCtx.font = '11px Inter, sans-serif';
        polarCtx.textAlign = 'center';
        polarCtx.fillText('Front', cx, cy - maxR - 6);
        polarCtx.fillText('Back', cx, cy + maxR + 14);
        polarCtx.textAlign = 'right';
        polarCtx.fillText('L', cx - maxR - 6, cy + 4);
        polarCtx.textAlign = 'left';
        polarCtx.fillText('R', cx + maxR + 6, cy + 4);

        // Draw technique-specific patterns
        switch (state.technique) {
            case 'xy':
                drawMicPattern(polarCtx, cx, cy, maxR, state.xy.p, state.xy.angle / 2, colors.left, colors.leftFill, 'L');
                drawMicPattern(polarCtx, cx, cy, maxR, state.xy.p, -state.xy.angle / 2, colors.right, colors.rightFill, 'R');
                break;
            case 'ortf':
                drawMicPattern(polarCtx, cx, cy, maxR, 0.5, 55, colors.left, colors.leftFill, 'L');
                drawMicPattern(polarCtx, cx, cy, maxR, 0.5, -55, colors.right, colors.rightFill, 'R');
                // Draw spacing indicator
                drawSpacingIndicator(polarCtx, cx, cy, colors);
                break;
            case 'ms':
                drawMicPattern(polarCtx, cx, cy, maxR, state.ms.midP, 0, colors.mid, colors.midFill, 'M');
                drawMicPattern(polarCtx, cx, cy, maxR, 0, 90, colors.side, colors.sideFill, 'S');
                break;
            case 'blumlein':
                drawMicPattern(polarCtx, cx, cy, maxR, 0, 45, colors.left, colors.leftFill, 'L');
                drawMicPattern(polarCtx, cx, cy, maxR, 0, -45, colors.right, colors.rightFill, 'R');
                break;
            case 'binaural':
                drawBinauralHead(polarCtx, cx, cy, maxR, colors);
                break;
        }
    }

    function drawMicPattern(ctx, cx, cy, maxR, p, angleDeg, strokeColor, fillColor, label) {
        // angleDeg: direction mic points, relative to front (0 = front, positive = left)
        var angleRad = angleDeg * Math.PI / 180;

        ctx.beginPath();
        for (var deg = 0; deg <= 360; deg++) {
            var theta = deg * Math.PI / 180;
            // Polar pattern: r = |p + (1-p) * cos(theta)|
            var r = Math.abs(p + (1 - p) * Math.cos(theta));
            var scaledR = r * maxR;

            // Rotate by mic pointing direction
            // In our canvas: up = front, left = left
            // theta=0 is the mic's forward direction
            var canvasAngle = -angleRad + theta;
            var x = cx + scaledR * Math.sin(canvasAngle);
            var y = cy - scaledR * Math.cos(canvasAngle);

            if (deg === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label at the tip of the pattern
        var tipR = Math.abs(p + (1 - p)) * maxR * 0.6;
        var labelX = cx + tipR * Math.sin(-angleRad);
        var labelY = cy - tipR * Math.cos(-angleRad);
        ctx.fillStyle = strokeColor;
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX, labelY);
    }

    function drawSpacingIndicator(ctx, cx, cy, colors) {
        // Small visual hint about the 17cm spacing
        var spacing = 8;
        ctx.save();
        ctx.strokeStyle = colors.gridText;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        // Two dots representing capsule positions
        ctx.beginPath();
        ctx.arc(cx - spacing, cy, 3, 0, Math.PI * 2);
        ctx.arc(cx + spacing, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors.gridText;
        ctx.fill();

        // Line between them
        ctx.beginPath();
        ctx.moveTo(cx - spacing, cy + 8);
        ctx.lineTo(cx + spacing, cy + 8);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('17cm', cx, cy + 20);
        ctx.restore();
    }

    function drawBinauralHead(ctx, cx, cy, maxR, colors) {
        var headR = maxR * 0.3;
        var yawRad = state.binaural.yaw * Math.PI / 180;

        // Soundfield circle
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * 0.95, 0, Math.PI * 2);
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Head circle
        ctx.beginPath();
        ctx.arc(cx, cy, headR, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.strokeStyle = colors.head;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nose (direction indicator, rotated by yaw)
        var noseLen = headR * 1.3;
        var noseX = cx + noseLen * Math.sin(yawRad);
        var noseY = cy - noseLen * Math.cos(yawRad);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(noseX, noseY);
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Nose tip
        ctx.beginPath();
        ctx.arc(noseX, noseY, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();

        // Ears
        var earOffset = headR + 4;
        var leftEarAngle = yawRad + Math.PI / 2;
        var rightEarAngle = yawRad - Math.PI / 2;
        ctx.fillStyle = colors.head;
        ctx.beginPath();
        ctx.arc(cx + earOffset * Math.sin(leftEarAngle), cy - earOffset * Math.cos(leftEarAngle), 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + earOffset * Math.sin(rightEarAngle), cy - earOffset * Math.cos(rightEarAngle), 5, 0, Math.PI * 2);
        ctx.fill();

        // Yaw angle text
        ctx.fillStyle = colors.gridText;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(state.binaural.yaw) + '°', cx, cy + headR + 24);
    }

    // ========================================
    // Yaw Dial
    // ========================================

    function drawYawDial() {
        var canvas = yawDial;
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var displaySize = 120;

        canvas.width = displaySize * dpr;
        canvas.height = displaySize * dpr;
        canvas.style.width = displaySize + 'px';
        canvas.style.height = displaySize + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var colors = getCanvasColors();
        var cxd = displaySize / 2;
        var cyd = displaySize / 2;
        var r = displaySize / 2 - 15;

        // Clear
        ctx.clearRect(0, 0, displaySize, displaySize);

        // Outer ring
        ctx.beginPath();
        ctx.arc(cxd, cyd, r, 0, Math.PI * 2);
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tick marks at 0, 90, 180, 270
        [0, 90, 180, 270].forEach(function(deg) {
            var rad = deg * Math.PI / 180;
            var innerR = r - 6;
            ctx.beginPath();
            ctx.moveTo(cxd + r * Math.sin(rad), cyd - r * Math.cos(rad));
            ctx.lineTo(cxd + innerR * Math.sin(rad), cyd - innerR * Math.cos(rad));
            ctx.strokeStyle = colors.gridText;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // Direction indicator
        var yawRad = state.binaural.yaw * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cxd, cyd);
        ctx.lineTo(cxd + Math.sin(yawRad) * r * 0.8, cyd - Math.cos(yawRad) * r * 0.8);
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Dot at end
        ctx.beginPath();
        ctx.arc(cxd + Math.sin(yawRad) * r * 0.8, cyd - Math.cos(yawRad) * r * 0.8, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(cxd, cyd, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors.gridText;
        ctx.fill();
    }

    function handleYawInteraction(e) {
        var rect = yawDial.getBoundingClientRect();
        var cxd = rect.width / 2;
        var cyd = rect.height / 2;
        var clientX = e.clientX !== undefined ? e.clientX : (e.touches ? e.touches[0].clientX : 0);
        var clientY = e.clientY !== undefined ? e.clientY : (e.touches ? e.touches[0].clientY : 0);
        var x = clientX - rect.left - cxd;
        var y = clientY - rect.top - cyd;
        var angle = Math.atan2(x, -y) * 180 / Math.PI;
        state.binaural.yaw = Math.round(angle);
        updateYawRotation(state.binaural.yaw);
        drawYawDial();
        drawPolarPattern();
        yawDisplay.textContent = Math.round(state.binaural.yaw) + '°';
    }

    // ========================================
    // Event Listeners
    // ========================================

    // File upload
    function handleFileSelect(e) {
        if (e.target.files && e.target.files[0]) {
            handleAudioFile(e.target.files[0]);
        }
    }

    fileInput.addEventListener('change', handleFileSelect);

    // Preset audio selection
    presetSelect.addEventListener('change', function(e) {
        var value = e.target.value;
        if (!value) return;

        // Check if it's a user-uploaded file
        if (value.startsWith('user:') && state.userFiles[value]) {
            loadUserFile(value);
        } else {
            loadPresetAudio(value);
        }
    });

    // Drag and drop on the upload button
    if (uploadCompact) {
        uploadCompact.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadCompact.classList.add('dragover');
        });
        uploadCompact.addEventListener('dragleave', function() {
            uploadCompact.classList.remove('dragover');
        });
        uploadCompact.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadCompact.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleAudioFile(e.dataTransfer.files[0]);
            }
        });
    }

    // Play/pause
    playButton.addEventListener('click', togglePlayback);

    // Waveform seek (mouse + touch)
    function getClientX(e) {
        if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
        if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
        return e.clientX;
    }

    function seekFromEvent(e) {
        var rect = waveformWrapper.getBoundingClientRect();
        var fraction = (getClientX(e) - rect.left) / rect.width;
        seekTo(Math.max(0, Math.min(1, fraction)));
    }

    function updateCursorPosition(e) {
        var rect = waveformWrapper.getBoundingClientRect();
        var fraction = (getClientX(e) - rect.left) / rect.width;
        fraction = Math.max(0, Math.min(1, fraction));
        waveformCursor.style.left = (fraction * 100) + '%';
    }

    waveformWrapper.addEventListener('click', seekFromEvent);
    waveformWrapper.addEventListener('mousemove', updateCursorPosition);
    waveformWrapper.addEventListener('touchstart', function(e) {
        e.preventDefault();
        seekFromEvent(e);
    }, { passive: false });

    // Loop toggle
    loopToggle.addEventListener('click', function() {
        state.isLooping = !state.isLooping;
        loopToggle.classList.toggle('active', state.isLooping);
        if (state.audioSource) {
            state.audioSource.loop = state.isLooping;
        }
    });

    // Gain control
    gainSlider.addEventListener('input', function() {
        state.gainValue = parseInt(gainSlider.value, 10);
        gainDisplay.textContent = state.gainValue;
        if (state.masterGain) {
            state.masterGain.gain.setValueAtTime(dbToLinear(state.gainValue), state.audioContext.currentTime);
        }
    });

    // Solo buttons
    soloLeftBtn.addEventListener('click', function() {
        state.soloLeft = !state.soloLeft;
        soloLeftBtn.classList.toggle('active', state.soloLeft);
        updateSoloGains();
    });

    soloRightBtn.addEventListener('click', function() {
        state.soloRight = !state.soloRight;
        soloRightBtn.classList.toggle('active', state.soloRight);
        updateSoloGains();
    });

    // Mono toggle button
    monoToggle.addEventListener('click', function() {
        state.isMono = !state.isMono;
        monoToggle.classList.toggle('active', state.isMono);
        monoToggleLabel.textContent = state.isMono ? 'Mono' : 'Stereo';
        setMonoMode(state.isMono);
    });

    // Technique buttons
    techniqueButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchTechnique(btn.dataset.technique);
        });
    });

    // Format buttons
    formatButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchFormat(btn.dataset.format);
        });
    });

    // XY angle slider
    xyAngleSlider.addEventListener('input', function() {
        state.xy.angle = parseInt(xyAngleSlider.value, 10);
        xyAngleDisplay.textContent = state.xy.angle + '°';
        updateAnglePresetHighlight();
        updateGainsForTechnique();
        drawPolarPattern();
    });

    // XY angle preset buttons
    xyAnglePresets.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var angle = parseInt(btn.dataset.angle, 10);
            state.xy.angle = angle;
            xyAngleSlider.value = angle;
            xyAngleDisplay.textContent = angle + '°';
            updateAnglePresetHighlight();
            updateGainsForTechnique();
            drawPolarPattern();
        });
    });

    function updateAnglePresetHighlight() {
        xyAnglePresets.forEach(function(btn) {
            btn.classList.toggle('active', parseInt(btn.dataset.angle, 10) === state.xy.angle);
        });
    }

    // XY pattern buttons
    xyPatternButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            xyPatternButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.xy.p = parseFloat(btn.dataset.p);
            updateGainsForTechnique();
            drawPolarPattern();
        });
    });

    // MS width slider
    msWidthSlider.addEventListener('input', function() {
        var raw = parseInt(msWidthSlider.value, 10);
        state.ms.width = raw / 100;
        msWidthDisplay.textContent = state.ms.width.toFixed(2);
        updateGainsForTechnique();
        drawPolarPattern();
    });

    // MS pattern buttons
    msPatternButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            msPatternButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.ms.midP = parseFloat(btn.dataset.midP);
            updateGainsForTechnique();
            drawPolarPattern();
        });
    });

    // Yaw dial interaction
    yawDial.addEventListener('mousedown', function(e) {
        state.yawDragging = true;
        handleYawInteraction(e);
    });
    document.addEventListener('mousemove', function(e) {
        if (state.yawDragging) {
            handleYawInteraction(e);
        }
    });
    document.addEventListener('mouseup', function() {
        state.yawDragging = false;
    });

    // Touch events for yaw dial
    yawDial.addEventListener('touchstart', function(e) {
        e.preventDefault();
        state.yawDragging = true;
        handleYawInteraction(e);
    });
    yawDial.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (state.yawDragging) {
            handleYawInteraction(e);
        }
    });
    yawDial.addEventListener('touchend', function() {
        state.yawDragging = false;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        var isTyping = document.activeElement && (
            document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA'
        );
        if (isTyping) return;

        if (e.code === 'Space' && state.audioBuffer) {
            e.preventDefault();
            togglePlayback();
        }
    });

    // Window resize → redraw canvas
    window.addEventListener('resize', resizePolarCanvas);

    // Theme change → redraw canvases
    var themeObserver = new MutationObserver(function() {
        drawPolarPattern();
        drawYawDial();
        drawWaveform();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Window resize → redraw waveform
    window.addEventListener('resize', function() {
        if (state.audioBuffer) {
            drawWaveform();
        }
    });

    // ========================================
    // Tooltip System
    // ========================================

    function initTooltips() {
        // Create a single tooltip element appended to body
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

                // Position after making visible so we can measure
                var rect = trigger.getBoundingClientRect();
                var tooltipRect = tooltipEl.getBoundingClientRect();
                var margin = 8;

                var top = rect.bottom + margin;
                var left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

                // Keep within viewport
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

    // ========================================
    // Initialization
    // ========================================

    resizePolarCanvas();
    drawYawDial();
    updateSoloLabels();
    initTooltips();

})();
