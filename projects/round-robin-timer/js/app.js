(function() {
    'use strict';

    // ========================================
    // State
    // ========================================

    var state = {
        phase: 'setup',      // 'setup', 'running', 'complete'
        performers: [],       // [{ name: 'Alice', colorIndex: 0 }, ...]
        schedule: [],         // [{ performers: [0, 1], type: 'duo' }, ...]
        format: 'duo-relay',  // 'duo-relay' or 'solo-duo'
        timerMode: 'auto',    // 'auto' or 'manual'
        audioCue: false,
        countdownBeeps: false,
        isFullscreen: false,
        roundDuration: 300,   // seconds
        currentRound: 0,
        timeRemaining: 0,     // seconds (fractional)
        isPlaying: false,
        totalElapsed: 0,      // seconds
        roundEndPause: false,  // true during 2s pause between auto-advance rounds
        audioContext: null
    };

    var timerInterval = null;
    var lastTickTime = 0;

    // Available colors (max 10)
    var MAX_COLORS = 10;

    // ========================================
    // DOM References
    // ========================================

    var dom = {
        setup: document.getElementById('rr-setup'),
        timer: document.getElementById('rr-timer'),
        complete: document.getElementById('rr-complete'),
        performerList: document.getElementById('rr-performer-list'),
        addPerformerBtn: document.getElementById('rr-add-performer'),
        durationInput: document.getElementById('rr-duration'),
        formatToggle: document.getElementById('rr-format-toggle'),
        formatDesc: document.getElementById('rr-format-desc'),
        modeToggle: document.getElementById('rr-mode-toggle'),
        audioCueCheckbox: document.getElementById('rr-audio-cue'),
        countdownBeepsCheckbox: document.getElementById('rr-countdown-beeps'),
        statPerformers: document.getElementById('rr-stat-performers'),
        statRounds: document.getElementById('rr-stat-rounds'),
        statTime: document.getElementById('rr-stat-time'),
        startBtn: document.getElementById('rr-start-btn'),
        // Timer
        roundInfo: document.getElementById('rr-round-info'),
        performersDisplay: document.getElementById('rr-performers-display'),
        countdown: document.getElementById('rr-countdown'),
        upNext: document.getElementById('rr-up-next'),
        elapsed: document.getElementById('rr-elapsed'),
        playBtn: document.getElementById('rr-play-btn'),
        playIcon: document.getElementById('rr-play-icon'),
        pauseIcon: document.getElementById('rr-pause-icon'),
        playLabel: document.getElementById('rr-play-label'),
        prevBtn: document.getElementById('rr-prev-btn'),
        nextBtn: document.getElementById('rr-next-btn'),
        restartBtn: document.getElementById('rr-restart-btn'),
        fullscreenBtn: document.getElementById('rr-fullscreen-btn'),
        fsEnterIcon: document.getElementById('rr-fs-enter-icon'),
        fsExitIcon: document.getElementById('rr-fs-exit-icon'),
        resetBtn: document.getElementById('rr-reset-btn'),
        scheduleList: document.getElementById('rr-schedule-list'),
        // Complete
        completeTime: document.getElementById('rr-complete-time'),
        completeReset: document.getElementById('rr-complete-reset'),
        // Export/Import
        exportWrapper: document.getElementById('rr-export-wrapper'),
        exportBtn: document.getElementById('rr-export-btn'),
        exportMenu: document.getElementById('rr-export-menu'),
        importBtn: document.getElementById('rr-import-btn'),
        importInput: document.getElementById('rr-import-input'),
        // Modal
        modalOverlay: document.getElementById('rr-modal-overlay'),
        modalCancel: document.getElementById('rr-modal-cancel'),
        modalConfirm: document.getElementById('rr-modal-confirm'),
        // Info
        info: document.querySelector('.rr-info')
    };

    // ========================================
    // Audio
    // ========================================

    function getAudioContext() {
        if (!state.audioContext) {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
        return state.audioContext;
    }

    function playChime() {
        if (!state.audioCue) return;
        var ctx = getAudioContext();
        var now = ctx.currentTime;

        // Two-tone chime: ascending major third
        var frequencies = [523.25, 659.25]; // C5, E5
        var durations = [0.15, 0.3];

        frequencies.forEach(function(freq, i) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3, now + i * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + durations[i]);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.18);
            osc.stop(now + i * 0.18 + durations[i]);
        });
    }

    function playCountdownBeep(secondsLeft) {
        if (!state.countdownBeeps) return;
        var ctx = getAudioContext();
        var now = ctx.currentTime;

        var freq = secondsLeft === 1 ? 880 : 660; // Higher pitch for "1"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // ========================================
    // Utilities
    // ========================================

    function formatTime(totalSeconds) {
        var s = Math.max(0, Math.ceil(totalSeconds));
        var m = Math.floor(s / 60);
        var sec = s % 60;
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function parseDuration(str) {
        str = str.trim();
        var parts = str.split(':');
        if (parts.length === 2) {
            var m = parseInt(parts[0], 10) || 0;
            var s = parseInt(parts[1], 10) || 0;
            return m * 60 + s;
        }
        if (parts.length === 1) {
            var val = parseInt(parts[0], 10) || 0;
            if (val > 15) return val; // treat as seconds
            return val * 60; // treat as minutes
        }
        return 300;
    }

    // ========================================
    // Schedule Generation
    // ========================================

    function generateSchedule() {
        var n = state.performers.length;
        var schedule = [];

        if (state.format === 'duo-relay') {
            // Solo first, duos in sequence, solo last
            // Round 1: Solo 0
            schedule.push({ performers: [0], type: 'solo' });
            // Duos
            for (var i = 0; i < n - 1; i++) {
                schedule.push({ performers: [i, i + 1], type: 'duo' });
            }
            // Solo last
            schedule.push({ performers: [n - 1], type: 'solo' });
        } else {
            // solo-duo alternating
            // Solo 0, Duo 0+1, Solo 1, Duo 1+2, ..., Duo (n-2)+(n-1), Solo (n-1)
            schedule.push({ performers: [0], type: 'solo' });
            for (var j = 0; j < n - 1; j++) {
                schedule.push({ performers: [j, j + 1], type: 'duo' });
                schedule.push({ performers: [j + 1], type: 'solo' });
            }
        }

        return schedule;
    }

    function getRoundLabel(round) {
        var p = round.performers;
        if (round.type === 'solo') {
            return state.performers[p[0]].name + ' (solo)';
        }
        return state.performers[p[0]].name + ' + ' + state.performers[p[1]].name;
    }

    // ========================================
    // Setup Phase
    // ========================================

    function initSetup() {
        // Start with 2 performers
        state.performers = [
            { name: '', colorIndex: 0 },
            { name: '', colorIndex: 1 }
        ];
        renderPerformerList();
        updateSummary();
    }

    // Color values for swatches (must match CSS .rr-color-N)
    var SWATCH_COLORS = [
        '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
        '#db2777', '#0891b2', '#4f46e5', '#b91c1c', '#15803d'
    ];
    var SWATCH_COLORS_DARK = [
        '#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa',
        '#f472b6', '#22d3ee', '#818cf8', '#fca5a5', '#6ee7b7'
    ];

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    // ========================================
    // Custom Color Picker (HSV-based)
    // ========================================

    function hexToHsv(hex) {
        var r = parseInt(hex.slice(1, 3), 16) / 255;
        var g = parseInt(hex.slice(3, 5), 16) / 255;
        var b = parseInt(hex.slice(5, 7), 16) / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var d = max - min;
        var h = 0, s = max === 0 ? 0 : d / max, v = max;
        if (d !== 0) {
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
        }
        return { h: h * 360, s: s, v: v };
    }

    function hsvToHex(h, s, v) {
        h = ((h % 360) + 360) % 360;
        var c = v * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = v - c;
        var r, g, b;
        if (h < 60)      { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else              { r = c; g = 0; b = x; }
        var toHex = function(n) { var h = Math.round((n + m) * 255).toString(16); return h.length === 1 ? '0' + h : h; };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    function buildCustomPicker(opts) {
        // opts: { initialColor, onChange }
        // Returns { el, setColor(hex), getColor() }

        var hsv = hexToHsv(opts.initialColor || '#2563eb');
        var container = document.createElement('div');
        container.className = 'rr-custom-picker';

        // Divider above
        var divider = document.createElement('div');
        divider.className = 'rr-custom-picker-divider';
        container.appendChild(divider);

        // SL canvas (saturation on X, value/brightness on Y)
        var slWrap = document.createElement('div');
        slWrap.className = 'rr-custom-picker-sl';
        var slCanvas = document.createElement('canvas');
        slCanvas.width = 160;
        slCanvas.height = 100;
        slCanvas.style.width = '100%';
        slCanvas.style.height = '100%';
        slCanvas.style.borderRadius = 'inherit';
        slCanvas.style.display = 'block';
        var slCursor = document.createElement('div');
        slCursor.className = 'rr-custom-picker-sl-cursor';
        slWrap.appendChild(slCanvas);
        slWrap.appendChild(slCursor);
        container.appendChild(slWrap);

        // Hue strip
        var hueWrap = document.createElement('div');
        hueWrap.className = 'rr-custom-picker-hue';
        var hueCursor = document.createElement('div');
        hueCursor.className = 'rr-custom-picker-hue-cursor';
        hueWrap.appendChild(hueCursor);
        container.appendChild(hueWrap);

        // Hex row
        var hexRow = document.createElement('div');
        hexRow.className = 'rr-custom-picker-hex-row';
        var preview = document.createElement('div');
        preview.className = 'rr-custom-picker-preview';
        var hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.className = 'rr-custom-picker-hex';
        hexInput.maxLength = 7;
        hexInput.spellcheck = false;
        hexInput.autocomplete = 'off';
        hexRow.appendChild(preview);
        hexRow.appendChild(hexInput);
        container.appendChild(hexRow);

        function drawSL() {
            var ctx = slCanvas.getContext('2d');
            var w = slCanvas.width, h = slCanvas.height;
            // Base hue
            ctx.fillStyle = 'hsl(' + hsv.h + ', 100%, 50%)';
            ctx.fillRect(0, 0, w, h);
            // White gradient (left to right = saturation)
            var white = ctx.createLinearGradient(0, 0, w, 0);
            white.addColorStop(0, 'rgba(255,255,255,1)');
            white.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = white;
            ctx.fillRect(0, 0, w, h);
            // Black gradient (top to bottom = value)
            var black = ctx.createLinearGradient(0, 0, 0, h);
            black.addColorStop(0, 'rgba(0,0,0,0)');
            black.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = black;
            ctx.fillRect(0, 0, w, h);
        }

        function updateUI() {
            var hex = hsvToHex(hsv.h, hsv.s, hsv.v);
            // SL cursor
            slCursor.style.left = (hsv.s * 100) + '%';
            slCursor.style.top = ((1 - hsv.v) * 100) + '%';
            slCursor.style.background = hex;
            // Hue cursor
            hueCursor.style.left = (hsv.h / 360 * 100) + '%';
            hueCursor.style.background = 'hsl(' + hsv.h + ', 100%, 50%)';
            // Preview + hex input
            preview.style.background = hex;
            hexInput.value = hex;
        }

        function emitChange() {
            var hex = hsvToHex(hsv.h, hsv.s, hsv.v);
            if (opts.onChange) opts.onChange(hex);
        }

        // SL interaction
        function handleSL(e) {
            var rect = slCanvas.getBoundingClientRect();
            var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            var y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            hsv.s = x;
            hsv.v = 1 - y;
            updateUI();
            emitChange();
        }

        slWrap.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            slWrap.setPointerCapture(e.pointerId);
            handleSL(e);
        });
        slWrap.addEventListener('pointermove', function(e) {
            if (slWrap.hasPointerCapture(e.pointerId)) {
                handleSL(e);
            }
        });

        // Hue interaction
        function handleHue(e) {
            var rect = hueWrap.getBoundingClientRect();
            var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            hsv.h = x * 360;
            drawSL();
            updateUI();
            emitChange();
        }

        hueWrap.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hueWrap.setPointerCapture(e.pointerId);
            handleHue(e);
        });
        hueWrap.addEventListener('pointermove', function(e) {
            if (hueWrap.hasPointerCapture(e.pointerId)) {
                handleHue(e);
            }
        });

        // Hex input
        hexInput.addEventListener('input', function() {
            var val = this.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                hsv = hexToHsv(val);
                drawSL();
                updateUI();
                emitChange();
            }
        });

        hexInput.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Prevent picker from closing when interacting with custom picker
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Initial draw
        drawSL();
        updateUI();

        return {
            el: container,
            setColor: function(hex) {
                hsv = hexToHsv(hex);
                drawSL();
                updateUI();
            },
            getColor: function() {
                return hsvToHex(hsv.h, hsv.s, hsv.v);
            },
            show: function() {
                container.classList.add('active');
            },
            hide: function() {
                container.classList.remove('active');
            }
        };
    }

    function renderPerformerList() {
        dom.performerList.innerHTML = '';

        state.performers.forEach(function(p, i) {
            var colorIdx = p.colorIndex !== undefined ? p.colorIndex : (i % MAX_COLORS);
            var row = document.createElement('div');
            row.className = 'rr-performer-row rr-color-' + colorIdx;
            row.setAttribute('draggable', 'true');
            row.dataset.index = i;
            if (p.customColor) {
                row.style.setProperty('--performer-color', p.customColor);
                row.style.setProperty('--performer-bg', hexToRgba(p.customColor, isDark() ? 0.18 : 0.12));
            }

            row.innerHTML =
                '<div class="rr-drag-handle" title="Drag to reorder">' +
                    '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg>' +
                '</div>' +
                '<div class="rr-performer-color" title="Change color"></div>' +
                '<div class="rr-color-picker"></div>' +
                '<input type="text" class="rr-performer-input" placeholder="Performer ' + (i + 1) + '" value="' + escapeAttr(p.name) + '" maxlength="30">' +
                (state.performers.length > 2 ?
                    '<button type="button" class="rr-remove-btn" title="Remove">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' : '');

            dom.performerList.appendChild(row);

            // Input event
            var input = row.querySelector('.rr-performer-input');
            input.addEventListener('input', function() {
                state.performers[i].name = this.value;
            });

            // Enter/Tab: move to next performer, or add one if on the last with text
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
                    if (i < state.performers.length - 1) {
                        e.preventDefault();
                        var nextInput = dom.performerList.querySelectorAll('.rr-performer-input')[i + 1];
                        if (nextInput) nextInput.focus();
                    } else if (this.value.trim() !== '' && state.performers.length < MAX_COLORS) {
                        e.preventDefault();
                        addPerformer();
                    }
                }
            });

            // Color picker
            var colorDot = row.querySelector('.rr-performer-color');
            var colorPicker = row.querySelector('.rr-color-picker');
            (function(performerIndex, dot, picker, rowEl) {
                var currentPerformer = state.performers[performerIndex];
                var currentColorIdx = currentPerformer.colorIndex !== undefined ? currentPerformer.colorIndex : performerIndex % MAX_COLORS;
                var hasCustom = !!currentPerformer.customColor;

                // Swatch grid
                var grid = document.createElement('div');
                grid.className = 'rr-color-picker-grid';
                picker.appendChild(grid);

                // Build preset swatches
                for (var c = 0; c < MAX_COLORS; c++) {
                    var swatch = document.createElement('button');
                    swatch.type = 'button';
                    swatch.className = 'rr-color-swatch';
                    if (!hasCustom && c === currentColorIdx) {
                        swatch.classList.add('active');
                    }
                    var colors = isDark() ? SWATCH_COLORS_DARK : SWATCH_COLORS;
                    swatch.style.background = colors[c];
                    swatch.dataset.colorIndex = c;
                    swatch.title = 'Color ' + (c + 1);
                    grid.appendChild(swatch);

                    swatch.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var newColor = parseInt(this.dataset.colorIndex, 10);
                        state.performers[performerIndex].colorIndex = newColor;
                        delete state.performers[performerIndex].customColor;
                        rowEl.className = 'rr-performer-row rr-color-' + newColor;
                        rowEl.setAttribute('draggable', 'true');
                        rowEl.dataset.index = performerIndex;
                        rowEl.style.removeProperty('--performer-color');
                        rowEl.style.removeProperty('--performer-bg');
                        picker.classList.remove('active');
                        // Update active states
                        grid.querySelectorAll('.rr-color-swatch').forEach(function(s) {
                            s.classList.toggle('active', parseInt(s.dataset.colorIndex, 10) === newColor);
                        });
                        var customBtn = picker.querySelector('.rr-color-swatch-custom');
                        if (customBtn) customBtn.classList.remove('active');
                        // Hide custom picker panel
                        var cpanel = picker.querySelector('.rr-custom-picker');
                        if (cpanel) cpanel.classList.remove('active');
                    });
                }

                // Divider
                var divider = document.createElement('div');
                divider.className = 'rr-color-picker-divider';
                picker.appendChild(divider);

                // Custom color row
                var customSwatch = document.createElement('button');
                customSwatch.type = 'button';
                customSwatch.className = 'rr-color-swatch-custom';
                if (hasCustom) {
                    customSwatch.classList.add('active');
                }
                customSwatch.title = 'Custom color';

                var customDot = document.createElement('span');
                customDot.className = 'rr-color-swatch-custom-dot';
                if (hasCustom) {
                    customDot.style.background = currentPerformer.customColor;
                    customDot.style.borderColor = currentPerformer.customColor;
                    customDot.style.borderStyle = 'solid';
                }
                customDot.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

                var customLabel = document.createElement('span');
                customLabel.className = 'rr-color-swatch-custom-label';
                customLabel.textContent = 'Custom';

                // Hidden native input kept as fallback (not used visually)
                var colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = currentPerformer.customColor || '#2563eb';

                customSwatch.appendChild(customDot);
                customSwatch.appendChild(customLabel);
                customSwatch.appendChild(colorInput);
                picker.appendChild(customSwatch);

                // Build in-popover custom picker
                var customPicker = buildCustomPicker({
                    initialColor: currentPerformer.customColor || '#2563eb',
                    onChange: function(hex) {
                        state.performers[performerIndex].customColor = hex;
                        rowEl.style.setProperty('--performer-color', hex);
                        rowEl.style.setProperty('--performer-bg', hexToRgba(hex, isDark() ? 0.18 : 0.12));
                        customSwatch.classList.add('active');
                        customDot.style.background = hex;
                        customDot.style.borderColor = hex;
                        customDot.style.borderStyle = 'solid';
                        grid.querySelectorAll('.rr-color-swatch').forEach(function(s) {
                            s.classList.remove('active');
                        });
                    }
                });
                picker.appendChild(customPicker.el);

                customSwatch.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Toggle the custom picker panel
                    if (customPicker.el.classList.contains('active')) {
                        customPicker.hide();
                    } else {
                        customPicker.show();
                    }
                });

                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Close any other open pickers
                    dom.performerList.querySelectorAll('.rr-color-picker.active').forEach(function(p) {
                        if (p !== picker) p.classList.remove('active');
                    });
                    picker.classList.toggle('active');
                });
            })(i, colorDot, colorPicker, row);

            // Remove event
            var removeBtn = row.querySelector('.rr-remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    state.performers.splice(i, 1);
                    renderPerformerList();
                    updateSummary();
                });
            }

            // Drag events
            row.addEventListener('dragstart', handleDragStart);
            row.addEventListener('dragover', handleDragOver);
            row.addEventListener('dragenter', handleDragEnter);
            row.addEventListener('dragleave', handleDragLeave);
            row.addEventListener('drop', handleDrop);
            row.addEventListener('dragend', handleDragEnd);
        });

        // Focus: if adding a new performer (last is empty, others have values), focus last.
        // Otherwise focus the first input.
        var inputs = dom.performerList.querySelectorAll('.rr-performer-input');
        var lastInput = inputs[inputs.length - 1];
        if (inputs.length > 2 && lastInput && lastInput.value === '' && inputs[inputs.length - 2] && inputs[inputs.length - 2].value !== '') {
            lastInput.focus();
        } else if (inputs.length > 0) {
            inputs[0].focus();
        }
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Drag and drop
    var dragSrcIndex = null;

    function handleDragStart(e) {
        dragSrcIndex = parseInt(this.dataset.index, 10);
        this.classList.add('rr-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIndex);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('rr-drag-over');
    }

    function handleDragLeave() {
        this.classList.remove('rr-drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('rr-drag-over');
        var targetIndex = parseInt(this.dataset.index, 10);
        if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
            var item = state.performers.splice(dragSrcIndex, 1)[0];
            state.performers.splice(targetIndex, 0, item);
            renderPerformerList();
            updateSummary();
        }
    }

    function handleDragEnd() {
        this.classList.remove('rr-dragging');
        var rows = dom.performerList.querySelectorAll('.rr-performer-row');
        rows.forEach(function(r) { r.classList.remove('rr-drag-over'); });
    }

    function addPerformer() {
        if (state.performers.length >= MAX_COLORS) return;
        state.performers.push({ name: '', colorIndex: state.performers.length });
        renderPerformerList();
        updateSummary();
    }

    function updateSummary() {
        var n = state.performers.length;
        var rounds;
        if (state.format === 'duo-relay') {
            rounds = n + 1; // 2 solos + (n-1) duos
        } else {
            rounds = 2 * n - 1; // n solos + (n-1) duos
        }
        var totalSeconds = rounds * state.roundDuration;

        dom.statPerformers.textContent = n;
        dom.statRounds.textContent = rounds;
        dom.statTime.textContent = formatTime(totalSeconds);

        // Enable/disable start based on minimum performers
        dom.startBtn.disabled = n < 2;
    }

    function updateFormatDesc() {
        if (state.format === 'duo-relay') {
            dom.formatDesc.textContent = 'First and last performers play solo. Everyone else plays in duos.';
        } else {
            dom.formatDesc.textContent = 'Every performer gets a solo segment before their first duo begins.';
        }
    }

    // ========================================
    // Timer Phase
    // ========================================

    function startSession() {
        // Fill in default names for empty inputs, preserve custom color choices
        state.performers.forEach(function(p, i) {
            if (!p.name.trim()) {
                p.name = 'Performer ' + (i + 1);
            }
            if (p.colorIndex === undefined) {
                p.colorIndex = i % MAX_COLORS;
            }
        });

        // Parse duration
        state.roundDuration = parseDuration(dom.durationInput.value);
        if (state.roundDuration < 30) state.roundDuration = 30;
        if (state.roundDuration > 900) state.roundDuration = 900;

        state.audioCue = dom.audioCueCheckbox.checked;
        state.countdownBeeps = dom.countdownBeepsCheckbox.checked;

        // Generate schedule
        state.schedule = generateSchedule();
        state.currentRound = 0;
        state.timeRemaining = state.roundDuration;
        state.totalElapsed = 0;
        state.isPlaying = false;
        state.roundEndPause = false;
        state.phase = 'running';

        // Switch to timer view
        dom.setup.classList.add('hidden');
        dom.timer.classList.add('active');
        dom.complete.classList.remove('active');
        if (dom.info) dom.info.style.display = 'none';

        renderScheduleList();
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        var round = state.schedule[state.currentRound];
        var total = state.schedule.length;

        // Round info
        dom.roundInfo.textContent = 'Round ' + (state.currentRound + 1) + ' of ' + total;

        // Performers display
        renderPerformersDisplay(round);

        // Countdown
        dom.countdown.textContent = formatTime(state.timeRemaining);

        // Countdown styling
        dom.countdown.classList.remove('rr-warning', 'rr-urgent', 'rr-paused', 'rr-round-end');
        if (state.roundEndPause) {
            dom.countdown.classList.add('rr-round-end');
        } else if (!state.isPlaying && state.timeRemaining > 0) {
            dom.countdown.classList.add('rr-paused');
        } else if (state.timeRemaining <= 3 && state.timeRemaining > 0) {
            dom.countdown.classList.add('rr-urgent');
        } else if (state.timeRemaining <= 10 && state.timeRemaining > 0) {
            dom.countdown.classList.add('rr-warning');
        }

        // Up next
        if (state.currentRound < total - 1) {
            var next = state.schedule[state.currentRound + 1];
            dom.upNext.innerHTML = 'Up next: <span class="rr-up-next-names">' + escapeHtml(getRoundLabel(next)) + '</span>';
            dom.upNext.style.display = '';
        } else {
            dom.upNext.style.display = 'none';
        }

        // Elapsed
        dom.elapsed.textContent = formatTime(state.totalElapsed);

        // Play/pause button
        if (state.isPlaying) {
            dom.playIcon.style.display = 'none';
            dom.pauseIcon.style.display = '';
            dom.playLabel.textContent = 'Pause';
        } else {
            dom.playIcon.style.display = '';
            dom.pauseIcon.style.display = 'none';
            dom.playLabel.textContent = 'Play';
        }

        // Next button highlight in manual mode when round ends
        if (state.timerMode === 'manual' && state.timeRemaining <= 0 && !state.roundEndPause) {
            dom.nextBtn.classList.add('rr-next-highlight');
        } else {
            dom.nextBtn.classList.remove('rr-next-highlight');
        }

        // Update schedule highlighting
        updateScheduleHighlight();
    }

    function getColorIndex(pi) {
        var p = state.performers[pi];
        return p && p.colorIndex !== undefined ? p.colorIndex : (pi % MAX_COLORS);
    }

    // Convert hex to rgba for performer-bg
    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    // Apply custom color inline styles to an element, or clear them
    function applyPerformerColor(el, pi) {
        var p = state.performers[pi];
        if (p && p.customColor) {
            el.style.setProperty('--performer-color', p.customColor);
            el.style.setProperty('--performer-bg', hexToRgba(p.customColor, isDark() ? 0.18 : 0.12));
        }
    }

    function renderPerformersDisplay(round) {
        dom.performersDisplay.innerHTML = '';

        if (round.type === 'solo') {
            var p = state.performers[round.performers[0]];
            var tag = document.createElement('span');
            tag.className = 'rr-performer-tag rr-color-' + getColorIndex(round.performers[0]);
            applyPerformerColor(tag, round.performers[0]);
            tag.textContent = p.name;
            dom.performersDisplay.appendChild(tag);

            var label = document.createElement('span');
            label.className = 'rr-solo-label';
            label.textContent = 'solo';
            dom.performersDisplay.appendChild(label);
        } else {
            round.performers.forEach(function(pi, idx) {
                if (idx > 0) {
                    var sep = document.createElement('span');
                    sep.className = 'rr-performer-separator';
                    sep.textContent = '+';
                    dom.performersDisplay.appendChild(sep);
                }
                var p = state.performers[pi];
                var tag = document.createElement('span');
                tag.className = 'rr-performer-tag rr-color-' + getColorIndex(pi);
                applyPerformerColor(tag, pi);
                tag.textContent = p.name;
                dom.performersDisplay.appendChild(tag);
            });
        }
    }

    function renderScheduleList() {
        dom.scheduleList.innerHTML = '';

        state.schedule.forEach(function(round, i) {
            var item = document.createElement('div');
            item.className = 'rr-schedule-item';
            item.dataset.round = i;

            var roundNum = document.createElement('span');
            roundNum.className = 'rr-schedule-round';
            roundNum.textContent = (i + 1);

            var names = document.createElement('span');
            names.className = 'rr-schedule-names';

            // Build names with colored indicators
            if (round.type === 'solo') {
                var pi = round.performers[0];
                var colorStyle = state.performers[pi].customColor
                    ? 'color: ' + state.performers[pi].customColor + ';'
                    : 'color: var(--performer-color);';
                names.innerHTML = '<span class="rr-color-' + getColorIndex(pi) + '" style="' + colorStyle + '">' + escapeHtml(state.performers[pi].name) + '</span>';
            } else {
                var parts = [];
                round.performers.forEach(function(pi) {
                    var colorStyle = state.performers[pi].customColor
                        ? 'color: ' + state.performers[pi].customColor + ';'
                        : 'color: var(--performer-color);';
                    parts.push('<span class="rr-color-' + getColorIndex(pi) + '" style="' + colorStyle + '">' + escapeHtml(state.performers[pi].name) + '</span>');
                });
                names.innerHTML = parts.join(' <span style="color: var(--color-text-muted);">+</span> ');
            }

            var typeLabel = document.createElement('span');
            typeLabel.className = 'rr-schedule-type';
            typeLabel.textContent = round.type;

            item.appendChild(roundNum);
            item.appendChild(names);
            item.appendChild(typeLabel);
            dom.scheduleList.appendChild(item);
        });
    }

    function updateScheduleHighlight() {
        var items = dom.scheduleList.querySelectorAll('.rr-schedule-item');
        items.forEach(function(item) {
            var idx = parseInt(item.dataset.round, 10);
            item.classList.toggle('rr-current', idx === state.currentRound);
            item.classList.toggle('rr-completed', idx < state.currentRound);
        });

        // Scroll current round into view
        var current = dom.scheduleList.querySelector('.rr-current');
        if (current) {
            current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ========================================
    // Timer Logic
    // ========================================

    // Track which integer seconds we've already beeped for
    var beepedSeconds = {};

    function startTimer() {
        if (state.isPlaying) return;

        // Init audio context on first user interaction
        getAudioContext();

        state.isPlaying = true;
        lastTickTime = performance.now();
        beepedSeconds = {};

        timerInterval = setInterval(tick, 50); // 50ms ticks for smooth display
        updateTimerDisplay();
    }

    function pauseTimer() {
        state.isPlaying = false;
        clearInterval(timerInterval);
        timerInterval = null;
        updateTimerDisplay();
    }

    function togglePlayPause() {
        if (state.phase !== 'running') return;

        // If round ended in manual mode, advance instead of toggling
        if (state.timerMode === 'manual' && state.timeRemaining <= 0 && !state.roundEndPause) {
            nextRound();
            return;
        }

        if (state.isPlaying) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function tick() {
        var now = performance.now();
        var delta = (now - lastTickTime) / 1000;
        lastTickTime = now;

        if (state.roundEndPause) {
            // During auto-advance pause
            state.timeRemaining -= delta;
            state.totalElapsed += delta;
            if (state.timeRemaining <= 0) {
                state.roundEndPause = false;
                advanceToNextRound();
            }
            updateTimerDisplay();
            return;
        }

        state.timeRemaining -= delta;
        state.totalElapsed += delta;

        // Countdown beeps at 3, 2, 1
        if (state.countdownBeeps && state.timeRemaining > 0 && state.timeRemaining <= 3.5) {
            var intSec = Math.ceil(state.timeRemaining);
            if (intSec >= 1 && intSec <= 3 && !beepedSeconds[intSec] && state.timeRemaining <= intSec && state.timeRemaining > intSec - 0.1) {
                beepedSeconds[intSec] = true;
                playCountdownBeep(intSec);
            }
        }

        if (state.timeRemaining <= 0) {
            state.timeRemaining = 0;

            // Round ended
            playChime();

            if (state.currentRound >= state.schedule.length - 1) {
                // Session complete
                pauseTimer();
                completeSession();
                return;
            }

            if (state.timerMode === 'auto') {
                // Auto-advance: 2-second pause
                state.roundEndPause = true;
                state.timeRemaining = 2; // 2s pause
                updateTimerDisplay();
                return;
            } else {
                // Manual: stop and wait
                pauseTimer();
                updateTimerDisplay();
                return;
            }
        }

        updateTimerDisplay();
    }

    function advanceToNextRound() {
        state.currentRound++;
        state.timeRemaining = state.roundDuration;
        beepedSeconds = {};
        updateTimerDisplay();
    }

    function nextRound() {
        if (state.currentRound >= state.schedule.length - 1) {
            pauseTimer();
            completeSession();
            return;
        }

        var wasPlaying = state.isPlaying;
        if (state.isPlaying) pauseTimer();

        state.roundEndPause = false;
        state.currentRound++;
        state.timeRemaining = state.roundDuration;
        beepedSeconds = {};
        updateTimerDisplay();

        if (wasPlaying) startTimer();
    }

    function prevRound() {
        if (state.currentRound <= 0) return;

        var wasPlaying = state.isPlaying;
        if (state.isPlaying) pauseTimer();

        state.roundEndPause = false;
        state.currentRound--;
        state.timeRemaining = state.roundDuration;
        beepedSeconds = {};
        updateTimerDisplay();

        if (wasPlaying) startTimer();
    }

    function resetSession() {
        // Pause while modal is open
        var wasPlaying = state.isPlaying;
        if (state.isPlaying) pauseTimer();

        dom.modalOverlay.classList.add('active');
        dom.modalConfirm.focus();

        state._resetResolve = function(confirmed) {
            dom.modalOverlay.classList.remove('active');
            if (!confirmed) {
                if (wasPlaying) startTimer();
                return;
            }
            state.phase = 'setup';
            state.currentRound = 0;
            state.timeRemaining = 0;
            state.totalElapsed = 0;
            state.isPlaying = false;
            state.roundEndPause = false;

            if (state.isFullscreen) exitFullscreen();

            dom.timer.classList.remove('active');
            dom.complete.classList.remove('active');
            dom.setup.classList.remove('hidden');
            if (dom.info) dom.info.style.display = '';
            dom.nextBtn.classList.remove('rr-next-highlight');
        };
    }

    function completeSession() {
        state.phase = 'complete';

        if (state.isFullscreen) exitFullscreen();

        dom.timer.classList.remove('active');
        dom.complete.classList.add('active');
        dom.completeTime.textContent = 'Total: ' + formatTime(state.totalElapsed);
    }

    // ========================================
    // Restart (back to round 1, stay in timer)
    // ========================================

    function restartSession() {
        var wasPlaying = state.isPlaying;
        if (state.isPlaying) pauseTimer();

        state.currentRound = 0;
        state.timeRemaining = state.roundDuration;
        state.totalElapsed = 0;
        state.roundEndPause = false;
        beepedSeconds = {};
        updateTimerDisplay();

        if (wasPlaying) startTimer();
    }

    // ========================================
    // Fullscreen
    // ========================================

    function enterFullscreen() {
        state.isFullscreen = true;
        dom.timer.classList.add('rr-fullscreen');
        dom.fsEnterIcon.style.display = 'none';
        dom.fsExitIcon.style.display = '';

        var el = document.documentElement;
        var req = el.requestFullscreen || el.webkitRequestFullscreen;
        if (req) req.call(el);
    }

    function exitFullscreen() {
        state.isFullscreen = false;
        dom.timer.classList.remove('rr-fullscreen');
        dom.fsEnterIcon.style.display = '';
        dom.fsExitIcon.style.display = 'none';

        var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        if (fsEl) {
            var exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (exit) exit.call(document);
        }
    }

    function toggleFullscreen() {
        if (state.isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    // Sync state when browser exits fullscreen (e.g. user presses Escape natively)
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    function onFullscreenChange() {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        if (!fsEl && state.isFullscreen) {
            state.isFullscreen = false;
            dom.timer.classList.remove('rr-fullscreen');
            dom.fsEnterIcon.style.display = '';
            dom.fsExitIcon.style.display = 'none';
        }
    }

    // ========================================
    // Export / Import
    // ========================================

    function getSetupData() {
        // Read current duration from input in case it hasn't been blurred
        var duration = parseDuration(dom.durationInput.value);
        if (duration < 30) duration = 30;
        if (duration > 900) duration = 900;

        return {
            performers: state.performers.map(function(p, i) {
                var out = { name: p.name || ('Performer ' + (i + 1)) };
                if (p.customColor) out.customColor = p.customColor;
                return out;
            }),
            roundDuration: duration,
            format: state.format,
            timerMode: state.timerMode,
            audioCue: dom.audioCueCheckbox.checked,
            countdownBeeps: dom.countdownBeepsCheckbox.checked
        };
    }

    function buildScheduleForExport() {
        var schedule = generateSchedule();
        var performers = state.performers;
        var lines = [];
        schedule.forEach(function(round, i) {
            if (round.type === 'solo') {
                lines.push((i + 1) + '. ' + (performers[round.performers[0]].name || 'Performer ' + (round.performers[0] + 1)) + ' (solo)');
            } else {
                var a = performers[round.performers[0]].name || 'Performer ' + (round.performers[0] + 1);
                var b = performers[round.performers[1]].name || 'Performer ' + (round.performers[1] + 1);
                lines.push((i + 1) + '. ' + a + ' + ' + b);
            }
        });
        return { schedule: schedule, lines: lines };
    }

    function triggerDownload(content, filename, mimeType) {
        var blob = new Blob([content], { type: mimeType });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportJSON() {
        var data = getSetupData();
        var exported = buildScheduleForExport();
        data.schedule = exported.schedule.map(function(round, i) {
            var label;
            if (round.type === 'solo') {
                label = (data.performers[round.performers[0]].name) + ' (solo)';
            } else {
                label = data.performers[round.performers[0]].name + ' + ' + data.performers[round.performers[1]].name;
            }
            return { round: i + 1, performers: label, type: round.type };
        });
        data.version = 1;
        data.type = 'round-robin-timer';

        triggerDownload(JSON.stringify(data, null, 2), 'round-robin-setup.json', 'application/json');
    }

    function exportMarkdown() {
        var data = getSetupData();
        var exported = buildScheduleForExport();
        var formatName = state.format === 'duo-relay' ? 'Duo Relay' : 'Solo-Duo Alternating';
        var modeName = state.timerMode === 'auto' ? 'Auto-advance' : 'Manual';

        var lines = [
            '# Round Robin Timer Setup',
            '',
            '| Setting | Value |',
            '|---------|-------|',
            '| Performers | ' + data.performers.map(function(p) { return p.name; }).join(', ') + ' |',
            '| Round Duration | ' + formatTime(data.roundDuration) + ' |',
            '| Format | ' + formatName + ' |',
            '| Timer Mode | ' + modeName + ' |',
            '| Audio Cue | ' + (data.audioCue ? 'On' : 'Off') + ' |',
            '| Countdown Beeps | ' + (data.countdownBeeps ? 'On' : 'Off') + ' |',
            '',
            '## Schedule (' + exported.lines.length + ' rounds, ' + formatTime(exported.lines.length * data.roundDuration) + ' total)',
            '',
            '| Round | Performers | Type |',
            '|-------|------------|------|'
        ];

        exported.schedule.forEach(function(round, i) {
            var label, type;
            if (round.type === 'solo') {
                label = data.performers[round.performers[0]].name;
                type = 'Solo';
            } else {
                label = data.performers[round.performers[0]].name + ' + ' + data.performers[round.performers[1]].name;
                type = 'Duo';
            }
            lines.push('| ' + (i + 1) + ' | ' + label + ' | ' + type + ' |');
        });

        triggerDownload(lines.join('\n'), 'round-robin-setup.md', 'text/markdown');
    }

    function exportText() {
        var data = getSetupData();
        var exported = buildScheduleForExport();
        var formatName = state.format === 'duo-relay' ? 'Duo Relay' : 'Solo-Duo Alternating';
        var modeName = state.timerMode === 'auto' ? 'Auto-advance' : 'Manual';

        var lines = [
            'Round Robin Timer Setup',
            '=======================',
            '',
            'Performers: ' + data.performers.map(function(p) { return p.name; }).join(', '),
            'Round Duration: ' + formatTime(data.roundDuration),
            'Format: ' + formatName,
            'Timer Mode: ' + modeName,
            'Audio Cue: ' + (data.audioCue ? 'On' : 'Off'),
            'Countdown Beeps: ' + (data.countdownBeeps ? 'On' : 'Off'),
            '',
            'Schedule (' + exported.lines.length + ' rounds, ' + formatTime(exported.lines.length * data.roundDuration) + ' total)',
            '--------',
        ];
        lines = lines.concat(exported.lines);

        triggerDownload(lines.join('\n'), 'round-robin-setup.txt', 'text/plain');
    }

    function toggleExportMenu() {
        dom.exportWrapper.classList.toggle('open');
    }

    function closeExportMenu() {
        dom.exportWrapper.classList.remove('open');
    }

    // --- Import ---

    function importSetup(text, filename) {
        var ext = (filename || '').split('.').pop().toLowerCase();
        var data;

        try {
            if (ext === 'json') {
                data = parseImportJSON(text);
            } else if (ext === 'md' || ext === 'markdown') {
                data = parseImportMarkdown(text);
            } else {
                data = parseImportText(text);
            }
        } catch (e) {
            alert('Could not parse file. Check the format and try again.');
            return;
        }

        if (!data || !data.performers || data.performers.length < 2) {
            alert('File must contain at least 2 performers.');
            return;
        }

        applyImportedData(data);
    }

    function parseImportJSON(text) {
        var obj = JSON.parse(text);
        var performers = (obj.performers || []).map(function(p) {
            if (typeof p === 'string') return { name: p };
            var out = { name: p.name || p.label || '' };
            if (p.customColor) out.customColor = p.customColor;
            return out;
        });
        return {
            performers: performers,
            roundDuration: obj.roundDuration || 300,
            format: obj.format || 'duo-relay',
            timerMode: obj.timerMode || 'auto',
            audioCue: obj.audioCue !== undefined ? obj.audioCue : false,
            countdownBeeps: obj.countdownBeeps !== undefined ? obj.countdownBeeps : false
        };
    }

    function parseImportMarkdown(text) {
        return parseImportKeyValue(text);
    }

    function parseImportText(text) {
        return parseImportKeyValue(text);
    }

    function parseImportKeyValue(text) {
        var lines = text.split('\n');
        var performers = [];
        var roundDuration = 300;
        var format = 'duo-relay';
        var timerMode = 'auto';
        var audioCue = false;
        var countdownBeeps = false;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/^\|?\s*/, '').replace(/\s*\|?\s*$/, '');

            // Match "Performers | Name1, Name2, ..." (markdown table) or "Performers: Name1, Name2, ..."
            var perfMatch = line.match(/^Performers\s*[:|]\s*(.+)/i);
            if (perfMatch) {
                var rawNames = perfMatch[1].replace(/\|$/, '').trim();
                performers = rawNames.split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
            }

            var durMatch = line.match(/^Round Duration\s*[:|]\s*(.+)/i);
            if (durMatch) {
                var durVal = durMatch[1].replace(/\|$/, '').trim();
                roundDuration = parseDuration(durVal);
                if (roundDuration < 30) roundDuration = 30;
                if (roundDuration > 900) roundDuration = 900;
            }

            var fmtMatch = line.match(/^Format\s*[:|]\s*(.+)/i);
            if (fmtMatch) {
                var fmtVal = fmtMatch[1].replace(/\|$/, '').trim().toLowerCase();
                if (fmtVal.indexOf('solo') !== -1 || fmtVal.indexOf('alternating') !== -1) {
                    format = 'solo-duo';
                } else {
                    format = 'duo-relay';
                }
            }

            var modeMatch = line.match(/^Timer Mode\s*[:|]\s*(.+)/i);
            if (modeMatch) {
                var modeVal = modeMatch[1].replace(/\|$/, '').trim().toLowerCase();
                timerMode = modeVal.indexOf('manual') !== -1 ? 'manual' : 'auto';
            }

            var cueMatch = line.match(/^Audio Cue\s*[:|]\s*(.+)/i);
            if (cueMatch) {
                audioCue = cueMatch[1].replace(/\|$/, '').trim().toLowerCase() === 'on';
            }

            var beepMatch = line.match(/^Countdown Beeps\s*[:|]\s*(.+)/i);
            if (beepMatch) {
                countdownBeeps = beepMatch[1].replace(/\|$/, '').trim().toLowerCase() === 'on';
            }
        }

        if (performers.length < 2) return null;

        return {
            performers: performers,
            roundDuration: roundDuration,
            format: format,
            timerMode: timerMode,
            audioCue: audioCue,
            countdownBeeps: countdownBeeps
        };
    }

    function applyImportedData(data) {
        // Set performers (handle both string and object format)
        state.performers = data.performers.map(function(p, i) {
            var entry = { colorIndex: i % MAX_COLORS };
            if (typeof p === 'string') {
                entry.name = p;
            } else {
                entry.name = p.name || '';
                if (p.customColor) entry.customColor = p.customColor;
            }
            return entry;
        });

        // Set round duration
        state.roundDuration = data.roundDuration;
        dom.durationInput.value = formatTime(data.roundDuration);

        // Set format
        state.format = data.format;
        dom.formatToggle.querySelectorAll('.rr-toggle-option').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.value === data.format);
        });
        updateFormatDesc();

        // Set timer mode
        state.timerMode = data.timerMode;
        dom.modeToggle.querySelectorAll('.rr-toggle-option').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.value === data.timerMode);
        });

        // Set audio options
        dom.audioCueCheckbox.checked = data.audioCue;
        dom.countdownBeepsCheckbox.checked = data.countdownBeeps;

        // Re-render
        renderPerformerList();
        updateSummary();
    }

    // ========================================
    // Event Listeners
    // ========================================

    // Add performer
    dom.addPerformerBtn.addEventListener('click', addPerformer);

    // Duration input formatting
    dom.durationInput.addEventListener('blur', function() {
        var seconds = parseDuration(this.value);
        if (seconds < 30) seconds = 30;
        if (seconds > 900) seconds = 900;
        state.roundDuration = seconds;
        this.value = formatTime(seconds);
        updateSummary();
    });

    dom.durationInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });

    // Format toggle
    dom.formatToggle.querySelectorAll('.rr-toggle-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            dom.formatToggle.querySelectorAll('.rr-toggle-option').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            state.format = this.dataset.value;
            updateFormatDesc();
            updateSummary();
        });
    });

    // Timer mode toggle
    dom.modeToggle.querySelectorAll('.rr-toggle-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            dom.modeToggle.querySelectorAll('.rr-toggle-option').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            state.timerMode = this.dataset.value;
        });
    });

    // Start session
    dom.startBtn.addEventListener('click', startSession);

    // Timer controls
    dom.playBtn.addEventListener('click', togglePlayPause);
    dom.nextBtn.addEventListener('click', nextRound);
    dom.prevBtn.addEventListener('click', prevRound);
    dom.restartBtn.addEventListener('click', restartSession);
    dom.fullscreenBtn.addEventListener('click', toggleFullscreen);
    dom.resetBtn.addEventListener('click', resetSession);

    // Export dropdown
    dom.exportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleExportMenu();
    });

    dom.exportMenu.querySelectorAll('.rr-export-option').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var fmt = this.dataset.format;
            if (fmt === 'json') exportJSON();
            else if (fmt === 'md') exportMarkdown();
            else exportText();
            closeExportMenu();
        });
    });

    // Close export menu and color pickers on outside click
    document.addEventListener('click', function() {
        closeExportMenu();
        dom.performerList.querySelectorAll('.rr-color-picker.active').forEach(function(p) {
            p.classList.remove('active');
        });
    });

    // Import
    dom.importBtn.addEventListener('click', function() {
        dom.importInput.click();
    });

    dom.importInput.addEventListener('change', function() {
        var file = this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            importSetup(e.target.result, file.name);
        };
        reader.readAsText(file);
        // Reset so the same file can be re-imported
        this.value = '';
    });

    // Confirm modal
    dom.modalConfirm.addEventListener('click', function() {
        if (state._resetResolve) state._resetResolve(true);
    });
    dom.modalCancel.addEventListener('click', function() {
        if (state._resetResolve) state._resetResolve(false);
    });
    dom.modalOverlay.addEventListener('click', function(e) {
        if (e.target === dom.modalOverlay && state._resetResolve) state._resetResolve(false);
    });

    // Complete reset
    dom.completeReset.addEventListener('click', function() {
        state.phase = 'setup';
        dom.complete.classList.remove('active');
        dom.setup.classList.remove('hidden');
        if (dom.info) dom.info.style.display = '';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape closes modal
        if (e.key === 'Escape' && dom.modalOverlay.classList.contains('active')) {
            if (state._resetResolve) state._resetResolve(false);
            return;
        }

        if (e.target.matches('input, textarea, select')) return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (state.phase === 'running') {
                togglePlayPause();
            }
        }

        if (e.key === 'f' || e.key === 'F') {
            if (state.phase === 'running') {
                toggleFullscreen();
            }
        }

    });

    // ========================================
    // Init
    // ========================================

    initSetup();

})();
