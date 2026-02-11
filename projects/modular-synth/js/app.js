/**
 * Modular Synth — Educational Audio Module System
 *
 * 4 modules: VCO (oscillator), VCA (amplifier), Scope (visualizer), Output (destination)
 * Cables: SVG Bezier curves connecting output ports to input ports
 * Audio: Web Audio API with GainNode gates for click-free patching
 */

// ===== STATE =====

const state = {
    audioContext: null,
    isAudioInitialized: false,

    // Module registry: moduleId -> { type, audioNodes, ports }
    modules: {},

    // Connection registry
    connections: [],
    connectionIdCounter: 0,

    // Cable dragging state
    dragging: null,

    // Scope animation
    scopeAnimationId: null,

    // VCO state
    currentFineTune: 0,
    currentWaveform: 'sine',
    displayMode: 'hz' // 'hz' or 'note'
};

// ===== CONSTANTS & UTILITIES =====

function centsToRatio(cents) {
    return Math.pow(2, cents / 1200);
}

function dbToLinear(db) {
    if (db <= -70) return 0;
    return Math.pow(10, db / 20);
}

// Mapping functions for knob value scaling

function linearMap(normalized, min, max) {
    return min + normalized * (max - min);
}

function linearUnmap(value, min, max) {
    return (value - min) / (max - min);
}

function logMap(normalized, min, max) {
    var minLog = Math.log(min);
    var maxLog = Math.log(max);
    return Math.exp(minLog + normalized * (maxLog - minLog));
}

function logUnmap(value, min, max) {
    var minLog = Math.log(min);
    var maxLog = Math.log(max);
    return (Math.log(value) - minLog) / (maxLog - minLog);
}

// Note name conversion

var NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function freqToNoteName(freq) {
    var semitones = 12 * Math.log2(freq / 440);
    var midiNote = Math.round(semitones) + 69;
    var octave = Math.floor(midiNote / 12) - 1;
    var noteIndex = ((midiNote % 12) + 12) % 12;
    var centsOff = Math.round((semitones - Math.round(semitones)) * 100);
    var name = NOTE_NAMES[noteIndex] + octave;
    if (centsOff !== 0) {
        var sign = centsOff > 0 ? '+' : '';
        name += ' (' + sign + centsOff + ')';
    }
    return name;
}

// Knob instances (populated in setupModuleControls)
var coarseKnob = null;
var fineKnob = null;
var levelKnob = null;
var volumeKnob = null;

function getVcoFrequency() {
    var base = coarseKnob ? coarseKnob.getValue() : 261.63;
    var cents = fineKnob ? fineKnob.getValue() : 0;
    return base * centsToRatio(cents);
}

function updateVcoFrequency() {
    if (state.isAudioInitialized) {
        var freq = getVcoFrequency();
        state.modules['vco-1'].audioNodes.oscillator.frequency.setTargetAtTime(
            freq, state.audioContext.currentTime, 0.02
        );
    }
}

function updateFrequencyDisplay(freq) {
    var el = document.getElementById('vco-freq-display');
    if (!el) return;
    if (state.displayMode === 'hz') {
        el.textContent = freq < 100 ? freq.toFixed(1) + ' Hz' : Math.round(freq) + ' Hz';
    } else {
        el.textContent = freqToNoteName(freq);
    }
}

// ===== ROTARY KNOB COMPONENT =====

/**
 * createKnob - SVG arc knob with pointer drag interaction
 *
 * @param {Object} config
 * @param {string} config.id         - matches data-knob-id attribute
 * @param {number} config.min        - minimum raw value
 * @param {number} config.max        - maximum raw value
 * @param {number} config.value      - initial raw value
 * @param {number|null} config.step  - value increment (null for continuous)
 * @param {string} config.mapping    - 'linear' or 'log'
 * @param {boolean} config.bipolar   - if true, arc fills from center
 * @param {Function} config.onChange - callback(rawValue) on value change
 * @returns {Object} { getValue, setValue, element }
 */
function createKnob(config) {
    var container = document.querySelector('[data-knob-id="' + config.id + '"]');
    if (!container) return null;

    var svg = container.querySelector('.knob-svg');
    var trackPath = svg.querySelector('.knob-track');
    var fillPath = svg.querySelector('.knob-fill');
    var indicator = svg.querySelector('.knob-indicator');

    var CX = 28, CY = 28, R = 22;
    // Arc from 7 o'clock (120°) clockwise 300° to 5 o'clock (60°)
    var START_DEG = 120;
    var SWEEP_DEG = 300;
    var startRad = START_DEG * Math.PI / 180;
    var sweepRad = SWEEP_DEG * Math.PI / 180;

    var currentValue = config.value;
    var isDragging = false;
    var dragStartY = 0;
    var dragStartNorm = 0;
    var DRAG_SENSITIVITY = 200;

    var mapFn = config.mapping === 'log' ? logMap : linearMap;
    var unmapFn = config.mapping === 'log' ? logUnmap : linearUnmap;

    function getNormalized() {
        return unmapFn(currentValue, config.min, config.max);
    }

    function setFromNormalized(norm) {
        norm = Math.max(0, Math.min(1, norm));
        var raw = mapFn(norm, config.min, config.max);

        if (config.step) {
            raw = Math.round(raw / config.step) * config.step;
        }
        raw = Math.max(config.min, Math.min(config.max, raw));

        if (raw !== currentValue) {
            currentValue = raw;
            render();
            updateAria();
            if (config.onChange) config.onChange(currentValue);
        }
    }

    function angleAt(norm) {
        return startRad + norm * sweepRad;
    }

    function polarToXY(angle) {
        return {
            x: CX + R * Math.cos(angle),
            y: CY + R * Math.sin(angle)
        };
    }

    function describeArc(fromAngle, toAngle) {
        var p1 = polarToXY(fromAngle);
        var p2 = polarToXY(toAngle);
        var sweep = toAngle - fromAngle;
        if (sweep < 0) sweep += Math.PI * 2;
        var large = sweep > Math.PI ? 1 : 0;
        return 'M ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2) +
               ' A ' + R + ' ' + R + ' 0 ' + large + ' 1 ' +
               p2.x.toFixed(2) + ' ' + p2.y.toFixed(2);
    }

    function render() {
        var norm = getNormalized();

        // Full track arc
        trackPath.setAttribute('d', describeArc(startRad, angleAt(1)));

        // Filled portion
        if (config.bipolar) {
            var centerAngle = angleAt(0.5);
            var valAngle = angleAt(norm);
            if (norm > 0.505) {
                fillPath.setAttribute('d', describeArc(centerAngle, valAngle));
                fillPath.style.display = '';
            } else if (norm < 0.495) {
                fillPath.setAttribute('d', describeArc(valAngle, centerAngle));
                fillPath.style.display = '';
            } else {
                fillPath.style.display = 'none';
            }
        } else {
            if (norm > 0.005) {
                fillPath.setAttribute('d', describeArc(startRad, angleAt(norm)));
                fillPath.style.display = '';
            } else {
                fillPath.style.display = 'none';
            }
        }

        // Indicator dot
        var pos = polarToXY(angleAt(norm));
        indicator.setAttribute('cx', pos.x.toFixed(2));
        indicator.setAttribute('cy', pos.y.toFixed(2));
    }

    function updateAria() {
        svg.setAttribute('aria-valuenow', currentValue.toFixed(2));
    }

    // --- Pointer drag interaction ---

    svg.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        dragStartY = e.clientY;
        dragStartNorm = getNormalized();
        svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        var dy = dragStartY - e.clientY;
        var deltaNorm = dy / DRAG_SENSITIVITY;
        setFromNormalized(dragStartNorm + deltaNorm);
    });

    svg.addEventListener('pointerup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        svg.releasePointerCapture(e.pointerId);
    });

    svg.addEventListener('pointercancel', function() {
        isDragging = false;
    });

    // --- Scroll wheel ---

    svg.addEventListener('wheel', function(e) {
        e.preventDefault();
        var norm = getNormalized();
        var delta = -e.deltaY * 0.001;
        setFromNormalized(norm + delta);
    }, { passive: false });

    // --- Keyboard ---

    svg.addEventListener('keydown', function(e) {
        var norm = getNormalized();
        var smallStep = 0.01;
        var largeStep = 0.1;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
                e.preventDefault();
                setFromNormalized(norm + (e.shiftKey ? largeStep : smallStep));
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                e.preventDefault();
                setFromNormalized(norm - (e.shiftKey ? largeStep : smallStep));
                break;
            case 'Home':
                e.preventDefault();
                setFromNormalized(0);
                break;
            case 'End':
                e.preventDefault();
                setFromNormalized(1);
                break;
        }
    });

    // Initial render
    render();
    updateAria();

    return {
        getValue: function() { return currentValue; },
        setValue: function(v) {
            currentValue = Math.max(config.min, Math.min(config.max, v));
            render();
            updateAria();
        },
        element: container
    };
}

// ===== AUDIO INITIALIZATION =====

function initAudio() {
    if (state.isAudioInitialized) return;

    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();

    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }

    createModuleAudioNodes();
    state.isAudioInitialized = true;
    console.log('Audio initialized');
}

function createModuleAudioNodes() {
    var ctx = state.audioContext;

    // --- VCO ---
    var vcoOsc = ctx.createOscillator();
    vcoOsc.type = state.currentWaveform;
    vcoOsc.frequency.value = getVcoFrequency();
    vcoOsc.start();

    var vcoOutput = ctx.createGain();
    vcoOutput.gain.value = 1;
    vcoOsc.connect(vcoOutput);

    state.modules['vco-1'] = {
        type: 'vco',
        audioNodes: { oscillator: vcoOsc, outputGate: vcoOutput },
        ports: {
            out: { direction: 'output', signal: 'audio', node: vcoOutput }
        }
    };

    // --- VCA ---
    var vcaInput = ctx.createGain();
    vcaInput.gain.value = 1;

    var vcaLevel = ctx.createGain();
    vcaLevel.gain.value = levelKnob ? levelKnob.getValue() / 100 : 0.8;
    vcaInput.connect(vcaLevel);

    // CV input (for future LFO/ADSR modulation)
    var vcaCv = ctx.createGain();
    vcaCv.gain.value = 0;

    state.modules['vca-1'] = {
        type: 'vca',
        audioNodes: { inputGain: vcaInput, levelGain: vcaLevel, cvGain: vcaCv },
        ports: {
            in:  { direction: 'input',  signal: 'audio', node: vcaInput },
            cv:  { direction: 'input',  signal: 'cv',    node: vcaCv },
            out: { direction: 'output', signal: 'audio', node: vcaLevel }
        }
    };

    // --- Scope ---
    var scopeAnalyser = ctx.createAnalyser();
    scopeAnalyser.fftSize = 2048;
    scopeAnalyser.smoothingTimeConstant = 0;

    state.modules['scope-1'] = {
        type: 'scope',
        audioNodes: { analyser: scopeAnalyser },
        ports: {
            in: { direction: 'input', signal: 'audio', node: scopeAnalyser }
        }
    };

    // --- Output ---
    var masterGain = ctx.createGain();
    masterGain.gain.value = dbToLinear(volumeKnob ? volumeKnob.getValue() : -24);
    masterGain.connect(ctx.destination);

    state.modules['output-1'] = {
        type: 'output',
        audioNodes: { masterGain: masterGain },
        ports: {
            in: { direction: 'input', signal: 'audio', node: masterGain }
        }
    };
}

// ===== CONNECTION SYSTEM =====

function createConnection(fromModuleId, fromPortName, toModuleId, toPortName) {
    if (!state.isAudioInitialized) initAudio();

    var fromModule = state.modules[fromModuleId];
    var toModule = state.modules[toModuleId];
    if (!fromModule || !toModule) return null;

    var fromPort = fromModule.ports[fromPortName];
    var toPort = toModule.ports[toPortName];
    if (!fromPort || !toPort) return null;

    // Validate: output -> input only
    if (fromPort.direction !== 'output' || toPort.direction !== 'input') return null;

    // Check if this input already has a connection (one connection per input)
    var existingIndex = -1;
    for (var i = 0; i < state.connections.length; i++) {
        if (state.connections[i].toModuleId === toModuleId &&
            state.connections[i].toPort === toPortName) {
            existingIndex = i;
            break;
        }
    }
    if (existingIndex !== -1) {
        removeConnection(state.connections[existingIndex].id);
    }

    // Create GainNode gate for click-free connection
    var gate = state.audioContext.createGain();
    gate.gain.value = 0;

    fromPort.node.connect(gate);
    gate.connect(toPort.node);

    // Ramp up for click-free start
    gate.gain.setTargetAtTime(1, state.audioContext.currentTime, 0.02);

    var connId = ++state.connectionIdCounter;

    // Create SVG cable
    var cablePath = createCablePath(fromModuleId, fromPortName, toModuleId, toPortName, connId);

    var connection = {
        id: connId,
        fromModuleId: fromModuleId,
        fromPort: fromPortName,
        toModuleId: toModuleId,
        toPort: toPortName,
        gate: gate,
        cablePath: cablePath
    };

    state.connections.push(connection);

    updatePortVisuals(fromModuleId, fromPortName);
    updatePortVisuals(toModuleId, toPortName);

    // Start scope if it just got connected
    if (toModuleId === 'scope-1') {
        startScope();
    }

    console.log('Connected:', fromModuleId + '.' + fromPortName, '->', toModuleId + '.' + toPortName);
    return connection;
}

function removeConnection(connId) {
    var index = -1;
    for (var i = 0; i < state.connections.length; i++) {
        if (state.connections[i].id === connId) {
            index = i;
            break;
        }
    }
    if (index === -1) return;

    var conn = state.connections[index];

    // Ramp gate down for click-free disconnect
    if (state.audioContext) {
        conn.gate.gain.setTargetAtTime(0, state.audioContext.currentTime, 0.02);
    }

    // After ramp completes, disconnect audio nodes
    var fromPort = state.modules[conn.fromModuleId] &&
                   state.modules[conn.fromModuleId].ports[conn.fromPort];
    setTimeout(function() {
        try {
            if (fromPort) fromPort.node.disconnect(conn.gate);
            conn.gate.disconnect();
        } catch (e) {
            // Already disconnected
        }
    }, 60);

    // Remove SVG cable
    if (conn.cablePath && conn.cablePath.parentNode) {
        conn.cablePath.remove();
    }

    state.connections.splice(index, 1);

    updatePortVisuals(conn.fromModuleId, conn.fromPort);
    updatePortVisuals(conn.toModuleId, conn.toPort);

    // Stop scope if it lost all connections
    if (conn.toModuleId === 'scope-1') {
        var scopeStillConnected = false;
        for (var j = 0; j < state.connections.length; j++) {
            if (state.connections[j].toModuleId === 'scope-1') {
                scopeStillConnected = true;
                break;
            }
        }
        if (!scopeStillConnected) stopScope();
    }

    console.log('Disconnected:', conn.fromModuleId + '.' + conn.fromPort, '->', conn.toModuleId + '.' + conn.toPort);
}

// ===== CABLE SVG RENDERING =====

function getPortCenter(moduleId, portName) {
    var portEl = document.querySelector(
        '.port[data-module="' + moduleId + '"][data-port="' + portName + '"]'
    );
    var rackEl = document.getElementById('module-rack');

    if (!portEl || !rackEl) return { x: 0, y: 0 };

    var portRect = portEl.getBoundingClientRect();
    var rackRect = rackEl.getBoundingClientRect();

    return {
        x: portRect.left + portRect.width / 2 - rackRect.left,
        y: portRect.top + portRect.height / 2 - rackRect.top
    };
}

function computeCablePath(x1, y1, x2, y2) {
    var dx = Math.abs(x2 - x1);
    var dy = y2 - y1;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var droop = Math.min(dist * 0.3, 80);

    // Control points offset downward for cable sag
    var cp1x = x1 + (x2 - x1) * 0.33;
    var cp1y = y1 + droop;
    var cp2x = x1 + (x2 - x1) * 0.67;
    var cp2y = y2 + droop;

    return 'M ' + x1 + ' ' + y1 + ' C ' + cp1x + ' ' + cp1y + ', ' + cp2x + ' ' + cp2y + ', ' + x2 + ' ' + y2;
}

function createCablePath(fromModuleId, fromPort, toModuleId, toPort, connId) {
    var svg = document.getElementById('cable-svg');
    var from = getPortCenter(fromModuleId, fromPort);
    var to = getPortCenter(toModuleId, toPort);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', computeCablePath(from.x, from.y, to.x, to.y));
    path.setAttribute('class', 'cable-path');
    path.setAttribute('data-conn-id', connId);
    path.setAttribute('fill', 'none');
    path.style.pointerEvents = 'stroke';

    path.addEventListener('click', function() {
        removeConnection(connId);
    });

    svg.appendChild(path);
    return path;
}

function updateAllCablePositions() {
    for (var i = 0; i < state.connections.length; i++) {
        var conn = state.connections[i];
        var from = getPortCenter(conn.fromModuleId, conn.fromPort);
        var to = getPortCenter(conn.toModuleId, conn.toPort);
        if (conn.cablePath) {
            conn.cablePath.setAttribute('d', computeCablePath(from.x, from.y, to.x, to.y));
        }
    }
}

// ===== CABLE DRAG INTERACTION =====

function setupCableDragging() {
    var rack = document.getElementById('module-rack');
    var svg = document.getElementById('cable-svg');

    rack.addEventListener('pointerdown', function(e) {
        var portEl = e.target.closest('.port');
        if (!portEl) return;

        var direction = portEl.dataset.direction;
        if (direction !== 'output') return;

        // Initialize audio on first interaction
        if (!state.isAudioInitialized) initAudio();

        e.preventDefault();

        var moduleId = portEl.dataset.module;
        var portName = portEl.dataset.port;
        var from = getPortCenter(moduleId, portName);

        // Create temporary cable
        var tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('class', 'cable-temp');
        tempPath.setAttribute('fill', 'none');
        tempPath.setAttribute('d', computeCablePath(from.x, from.y, from.x, from.y));
        svg.appendChild(tempPath);

        state.dragging = {
            fromModule: moduleId,
            fromPort: portName,
            tempPath: tempPath,
            startX: from.x,
            startY: from.y
        };
    });

    document.addEventListener('pointermove', function(e) {
        if (!state.dragging) return;

        var rackRect = rack.getBoundingClientRect();
        var x = e.clientX - rackRect.left;
        var y = e.clientY - rackRect.top;

        state.dragging.tempPath.setAttribute('d',
            computeCablePath(state.dragging.startX, state.dragging.startY, x, y)
        );

        // Highlight nearest compatible input port
        clearPortHighlights();
        var el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
            var inputPort = el.closest('.port[data-direction="input"]');
            if (inputPort) {
                inputPort.classList.add('drag-target');
            }
        }
    });

    document.addEventListener('pointerup', function(e) {
        if (!state.dragging) return;

        // Check if released over an input port
        var el = document.elementFromPoint(e.clientX, e.clientY);
        var inputPort = el ? el.closest('.port[data-direction="input"]') : null;

        if (inputPort) {
            var toModule = inputPort.dataset.module;
            var toPort = inputPort.dataset.port;

            createConnection(
                state.dragging.fromModule,
                state.dragging.fromPort,
                toModule,
                toPort
            );
        }

        // Clean up
        if (state.dragging.tempPath && state.dragging.tempPath.parentNode) {
            state.dragging.tempPath.remove();
        }
        clearPortHighlights();
        state.dragging = null;
    });

    document.addEventListener('pointercancel', function() {
        if (!state.dragging) return;
        if (state.dragging.tempPath && state.dragging.tempPath.parentNode) {
            state.dragging.tempPath.remove();
        }
        clearPortHighlights();
        state.dragging = null;
    });
}

// ===== PORT VISUALS =====

function updatePortVisuals(moduleId, portName) {
    var portEl = document.querySelector(
        '.port[data-module="' + moduleId + '"][data-port="' + portName + '"]'
    );
    if (!portEl) return;

    var isConnected = false;
    for (var i = 0; i < state.connections.length; i++) {
        var c = state.connections[i];
        if ((c.fromModuleId === moduleId && c.fromPort === portName) ||
            (c.toModuleId === moduleId && c.toPort === portName)) {
            isConnected = true;
            break;
        }
    }

    portEl.classList.toggle('connected', isConnected);
}

function clearPortHighlights() {
    var targets = document.querySelectorAll('.port.drag-target');
    for (var i = 0; i < targets.length; i++) {
        targets[i].classList.remove('drag-target');
    }
}

// ===== SCOPE RENDERER =====

function startScope() {
    if (state.scopeAnimationId) return;
    if (!state.isAudioInitialized) return;

    var canvas = document.getElementById('scope-canvas');
    var ctx = canvas.getContext('2d');
    var analyser = state.modules['scope-1'].audioNodes.analyser;
    var dataArray = new Float32Array(analyser.fftSize);

    function resizeCanvas() {
        var rect = canvas.parentElement.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();

    function draw() {
        state.scopeAnimationId = requestAnimationFrame(draw);

        analyser.getFloatTimeDomainData(dataArray);

        var width = canvas.width / (window.devicePixelRatio || 1);
        var height = canvas.height / (window.devicePixelRatio || 1);

        // Clear
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Center line
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Find zero-crossing trigger (rising edge)
        var triggerIndex = 0;
        var bufLen = dataArray.length;
        for (var i = 1; i < bufLen / 2; i++) {
            if (dataArray[i - 1] < 0 && dataArray[i] >= 0) {
                triggerIndex = i;
                break;
            }
        }

        // Draw waveform from trigger point
        var samplesToShow = Math.min(bufLen - triggerIndex, 1024);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (var j = 0; j < samplesToShow; j++) {
            var x = (j / samplesToShow) * width;
            var sample = dataArray[triggerIndex + j];
            var y = height / 2 - sample * (height / 2) * 0.85;

            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    draw();
}

function stopScope() {
    if (state.scopeAnimationId) {
        cancelAnimationFrame(state.scopeAnimationId);
        state.scopeAnimationId = null;
    }

    // Clear canvas to dark
    var canvas = document.getElementById('scope-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, rect.width, rect.height);
    }
}

// ===== MODULE CONTROLS =====

function setupModuleControls() {
    // --- VCO Waveform ---
    var waveBtns = document.querySelectorAll('.module-vco .wave-btn');
    waveBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.currentWaveform = btn.dataset.wave;

            waveBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            if (state.isAudioInitialized) {
                state.modules['vco-1'].audioNodes.oscillator.type = state.currentWaveform;
            }
        });
    });

    // --- VCO Coarse Tune (logarithmic, 20-2000 Hz) ---
    coarseKnob = createKnob({
        id: 'vco-coarse',
        min: 20,
        max: 2000,
        value: 261.63,
        step: null,
        mapping: 'log',
        bipolar: false,
        onChange: function(freq) {
            updateVcoFrequency();
            updateFrequencyDisplay(getVcoFrequency());
        }
    });

    // --- VCO Fine Tune (bipolar, +/- 50 cents) ---
    fineKnob = createKnob({
        id: 'vco-fine',
        min: -50,
        max: 50,
        value: 0,
        step: 1,
        mapping: 'linear',
        bipolar: true,
        onChange: function(cents) {
            state.currentFineTune = cents;
            var sign = cents > 0 ? '+' : '';
            document.getElementById('vco-fine-display').textContent = sign + cents + ' ct';
            updateVcoFrequency();
            updateFrequencyDisplay(getVcoFrequency());
        }
    });

    // --- VCA Level ---
    levelKnob = createKnob({
        id: 'vca-level',
        min: 0,
        max: 100,
        value: 80,
        step: 1,
        mapping: 'linear',
        bipolar: false,
        onChange: function(val) {
            var level = val / 100;
            document.getElementById('vca-level-display').textContent = level.toFixed(2);
            if (state.isAudioInitialized) {
                state.modules['vca-1'].audioNodes.levelGain.gain.setTargetAtTime(
                    level, state.audioContext.currentTime, 0.02
                );
            }
        }
    });

    // --- Output Volume ---
    volumeKnob = createKnob({
        id: 'master-volume',
        min: -70,
        max: 0,
        value: -24,
        step: 1,
        mapping: 'linear',
        bipolar: false,
        onChange: function(db) {
            document.getElementById('master-volume-display').textContent = db + ' dB';
            if (state.isAudioInitialized) {
                state.modules['output-1'].audioNodes.masterGain.gain.setTargetAtTime(
                    dbToLinear(db), state.audioContext.currentTime, 0.02
                );
            }
        }
    });

    // --- Display toggle (Hz / note name) ---
    var freqDisplay = document.getElementById('vco-freq-display');
    if (freqDisplay) {
        freqDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            state.displayMode = state.displayMode === 'hz' ? 'note' : 'hz';
            updateFrequencyDisplay(getVcoFrequency());
        });
    }
}

// ===== INITIALIZATION =====

function init() {
    setupCableDragging();
    setupModuleControls();

    // Size and clear scope canvas
    var scopeCanvas = document.getElementById('scope-canvas');
    if (scopeCanvas) {
        var rect = scopeCanvas.parentElement.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        scopeCanvas.width = rect.width * dpr;
        scopeCanvas.height = rect.height * dpr;
        scopeCanvas.style.width = rect.width + 'px';
        scopeCanvas.style.height = rect.height + 'px';
        var ctx = scopeCanvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, rect.width, rect.height);
    }

    // Update cable positions on resize
    window.addEventListener('resize', function() {
        updateAllCablePositions();
        // Re-render scope if active
        if (state.scopeAnimationId) {
            cancelAnimationFrame(state.scopeAnimationId);
            state.scopeAnimationId = null;
            startScope();
        }
    });

    // Resume audio context on user interaction
    function resumeContext() {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }
    document.addEventListener('click', resumeContext, { once: true });
    document.addEventListener('touchstart', resumeContext, { once: true });
}

// Clean up AudioContext on page unload
window.addEventListener('pagehide', function() {
    if (state.audioContext && state.audioContext.state !== 'closed') {
        state.audioContext.close();
    }
});

document.addEventListener('DOMContentLoaded', init);
