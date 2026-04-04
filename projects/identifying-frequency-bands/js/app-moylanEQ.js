async function setup() {
    const patchExportURL = "export/gb.moylanEQ.export.json"; //points to RNBO export

    // Create AudioContext
    const WAContext = window.AudioContext || window.webkitAudioContext; //loads web audio context
    const context = new WAContext(); 

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);
    
    // Fetch the exported patcher
    let response, patcher;
    try {
        response = await fetch(patchExportURL);
        patcher = await response.json();
    
        if (!window.RNBO) {
            // Load RNBO script dynamically
            // Note that you can skip this by knowing the RNBO version of your patch
            // beforehand and just include it using a <script> tag
            await loadRNBOScript(patcher.desc.meta.rnboversion);
        }

    } catch (err) {
        const errorContext = {
            error: err
        };
        if (response && (response.status >= 300 || response.status < 200)) {
            errorContext.header = `Couldn't load patcher export bundle`,
            errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
            ` trying to load "${patchExportURL}". If that doesn't` + 
            ` match the name of the file you exported from RNBO, modify` + 
            ` patchExportURL in app.js.`;
        }
        if (typeof guardrails === "function") {
            guardrails(errorContext);
        } else {
            throw err;
        }
        return;
    }
    
    // (Optional) Fetch the dependencies (We are using)
    let dependencies = [];
    try {
        const dependenciesResponse = await fetch("export/dependencies.json");
        dependencies = await dependenciesResponse.json();

        // Prepend "export" to any file dependenciies
        dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
    } catch (e) {}

    // Create two RNBO devices (one per stereo channel) for stereo output
    let deviceL, deviceR;
    try {
        deviceL = await RNBO.createDevice({ context, patcher });
        deviceR = await RNBO.createDevice({ context, patcher });
    } catch (err) {
        if (typeof guardrails === "function") {
            guardrails({ error: err });
        } else {
            throw err;
        }
        return;
    }

    // (Optional) Load the samples (We are using)
    if (dependencies.length) {
        await deviceL.loadDataBufferDependencies(dependencies);
        await deviceR.loadDataBufferDependencies(dependencies);
    }

    // Stereo routing: each device processes one channel, merge back to stereo
    // +6 dB boost compensates for RNBO patch internal gain loss
    const merger = context.createChannelMerger(2);
    const outputBoost = context.createGain();
    outputBoost.gain.value = 2.0; // +6 dB
    merger.connect(outputBoost);
    outputBoost.connect(outputNode);
    deviceL.node.connect(merger, 0, 0); // deviceL mono output → left channel
    deviceR.node.connect(merger, 0, 1); // deviceR mono output → right channel
    // Mono fill: routes deviceL to right channel for mono pink noise.
    // Gain is 1.0 during pink noise, 0.0 during user audio.
    const monoFill = context.createGain();
    monoFill.gain.value = 0; // starts muted (source starts as Mute)
    deviceL.node.connect(monoFill);
    monoFill.connect(merger, 0, 1);

    // Splitter for user audio: splits stereo into L/R for each device
    const splitter = context.createChannelSplitter(2);

    // Upmix nodes: force mono→stereo so each RNBO device receives the same
    // channel on both inputs, matching the level of the original stereo path
    const upmixToL = context.createGain();
    upmixToL.channelCount = 2;
    upmixToL.channelCountMode = 'explicit';
    upmixToL.channelInterpretation = 'speakers';
    const upmixToR = context.createGain();
    upmixToR.channelCount = 2;
    upmixToR.channelCountMode = 'explicit';
    upmixToR.channelInterpretation = 'speakers';

    // (Optional) Extract the name and rnbo version of the patcher from the description
    // document.getElementById("patcher-title").innerText = (patcher.desc.meta.filename || "Unnamed Patcher") + " (v" + patcher.desc.meta.rnboversion + ")";

    // (Optional) Automatically create sliders for the device parameters
    // makeSliders(device);

    // (Optional) Create a form to send messages to RNBO inputs
    // makeInportForm(device);

    // (Optional) Attach listeners to outports so you can log messages from the RNBO patcher
    attachOutports(deviceL);

    // User Added
    const inports = getInports(deviceL);
    console.log("Inports:");
    console.log(inports);
    const parameters = getParameters(deviceL);
    console.log("Parameters");
    parameters.forEach((param) => {
        console.log(param);
    });

    const devices = [deviceL, deviceR];

    // Expose monoFill toggle for source switching
    window._monoFill = monoFill;

    setupFilters(devices);
    setupBandControls(devices);
    // Create gain node for user audio, route through splitter to both devices
    const userAudioGain = context.createGain();
    userAudioGain.connect(splitter);
    // Left channel: splitter → upmix (mono→stereo via speakers interpretation) → deviceL
    splitter.connect(upmixToL, 0);
    upmixToL.connect(deviceL.node);
    // Right channel: same pattern → deviceR
    splitter.connect(upmixToR, 1);
    upmixToR.connect(deviceR.node);

    setupGain(devices, userAudioGain);
    setupAudioSource(devices, context, userAudioGain);
    setupDemo(devices, context);
    initTooltips();
    initPlayer2Toggle();

    // (Optional) Load presets, if any
    // loadPresets(device, patcher);

    // (Optional) Connect MIDI inputs
    // makeMIDIKeyboard(device);

    document.body.addEventListener('click', async () => {
        if (context.state === "running") return;
        try {
          await context.resume();
          console.log("Audio context resumed");
        } catch (err) {
          console.error("Failed to resume audio context:", err);
        }
      }, { once: true });

    // Skip if you're not using guardrails.js
    if (typeof guardrails === "function")
        guardrails();
}

function loadRNBOScript(version) {
    return new Promise((resolve, reject) => {
        if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
            throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
        }
        const el = document.createElement("script");
        el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";
        el.crossOrigin = "anonymous";
        el.onload = resolve;
        el.onerror = function(err) {
            console.log(err);
            reject(new Error("Failed to load rnbo.js v" + version));
        };
        document.body.append(el);
    });
}

  function setupFilters(devices) {
    const filtersToggle = document.getElementById("filters-toggle");
    // Update band control visual state based on filter toggle
    function updateBandControlsVisualState(filtersEnabled) {
      const bandControls = document.querySelectorAll('.band-control');
      bandControls.forEach(control => {
        control.classList.toggle('filters-disabled', !filtersEnabled);
      });
    }

    filtersToggle.onclick = () => {
      updateBandControlsVisualState(filtersToggle.checked);

      if (!filtersToggle.checked) {
        // Turning filters off: clear all mutes/solos and bypass RNBO filtering
        bandNames.forEach(band => {
          bandState[band].muted = false;
          bandState[band].soloed = false;
          updateBandUI(band);
        });
        updateAllBands(devices);
      }
    };
    // Start with filters toggle off (no filtering by default)
    filtersToggle.checked = false;
    updateBandControlsVisualState(false);
    // Ensure RNBO starts bypassed
    const filterBypassEvent = new RNBO.MessageEvent(RNBO.TimeNow, "filter", [0]);
    devices.forEach(d => d.scheduleEvent(filterBypassEvent));
  }

  // Band control state
  const bandNames = ['low', 'lowMid', 'mid', 'midHigh', 'high', 'veryHigh'];
  const bandState = {};

  // Demo state
  let demoRunning = false;
  let demoTimeouts = [];

  // Band display names mapping
  const bandDisplayNames = {
    'low': 'Low',
    'lowMid': 'Low Mid',
    'mid': 'Mid',
    'midHigh': 'Mid-High',
    'high': 'High',
    'veryHigh': 'Very High'
  };

  function setupBandControls(devices) {
    // Initialize state for each band
    bandNames.forEach(band => {
      bandState[band] = {
        muted: false,
        soloed: false
      };
    });

    // Set up mute and solo buttons for each band
    bandNames.forEach(band => {
      const muteBtn = document.getElementById(`${band}-mute`);
      const soloBtn = document.getElementById(`${band}-solo`);

      muteBtn.addEventListener('click', (event) => {
        // Opt+Shift (Mac) or Alt+Shift (Windows) clears all mutes
        if (event.altKey && event.shiftKey) {
          bandNames.forEach(b => {
            bandState[b].muted = false;
          });
        } else {
          bandState[band].muted = !bandState[band].muted;
        }
        updateBandUI(band);
        updateAllBands(devices);
      });

      soloBtn.addEventListener('click', (event) => {
        // Opt+Shift (Mac) or Alt+Shift (Windows) clears all solos
        if (event.altKey && event.shiftKey) {
          bandNames.forEach(b => {
            bandState[b].soloed = false;
          });
        } else {
          bandState[band].soloed = !bandState[band].soloed;
        }
        updateBandUI(band);
        updateAllBands(devices);
      });
    });

    // Initialize all bands to enabled (not muted)
    updateAllBands(devices);
  }

  function updateBandUI(band) {
    const muteBtn = document.getElementById(`${band}-mute`);
    const soloBtn = document.getElementById(`${band}-solo`);

    // Update mute button - show active only if muted AND not soloed
    // (soloed bands show mute as implicit instead of active)
    muteBtn.classList.toggle('active', bandState[band].muted && !bandState[band].soloed);

    // Update solo button
    soloBtn.classList.toggle('active', bandState[band].soloed);

    // Check if any band is soloed
    const anySoloed = bandNames.some(b => bandState[b].soloed);

    // Update implicit mute state:
    // - Band is implicitly muted because another band is soloed (and this one isn't)
    // - OR band is soloed but also has mute enabled (shows mute would apply when solo released)
    if ((anySoloed && !bandState[band].soloed) || (bandState[band].soloed && bandState[band].muted)) {
      muteBtn.classList.add('implicit');
    } else {
      muteBtn.classList.remove('implicit');
    }
  }

  function updateAllBands(devices) {
    const anySoloed = bandNames.some(b => bandState[b].soloed);
    const anyMuted = bandNames.some(b => bandState[b].muted);

    // Only route through RNBO filters when a band is actually muted or soloed
    const needsFiltering = anySoloed || anyMuted;
    const filterEvent = new RNBO.MessageEvent(
      RNBO.TimeNow,
      "filter",
      needsFiltering ? [1] : [0]
    );
    devices.forEach(d => d.scheduleEvent(filterEvent));

    bandNames.forEach(band => {
      let enabled;

      if (anySoloed) {
        // If any band is soloed, soloed bands play (even if muted - mute is "suspended" while soloed)
        // Non-soloed bands don't play
        enabled = bandState[band].soloed;
      } else {
        // No solos - bands play unless muted
        enabled = !bandState[band].muted;
      }

      // Send message to both RNBO devices
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        band,
        enabled ? [1] : [0]
      );
      devices.forEach(d => d.scheduleEvent(messageEvent));

      // Update UI for implicit mute state
      updateBandUI(band);
    });
  }

  function setupDemo(devices, context) {
    const demoButton = document.getElementById('demo-button');
    const demoStatus = document.getElementById('demo-status');
    const demoStatusText = document.getElementById('demo-status-text');
    const selectorParams = devices.map(d => getParameter(d, 'audioFile_selector'));
    const filtersToggle = document.getElementById('filters-toggle');

    // Track whether we're using user audio for the demo
    let demoUsingUserAudio = false;

    demoButton.addEventListener('click', async () => {
      // Resume audio context if suspended (required for iOS)
      if (context.state === "suspended") {
        try {
          await context.resume();
          console.log("Audio context resumed");
        } catch (err) {
          console.error("Failed to resume audio context:", err);
          return;
        }
      }

      if (demoRunning) {
        stopDemo();
      } else {
        startDemo();
      }
    });

    function startDemo() {
      demoRunning = true;
      demoButton.classList.add('running');
      demoButton.innerHTML = `
        <svg aria-hidden="true" class="demo-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Stop Demo
      `;

      // Check if user audio is selected and has audio loaded
      const userAudioSelected = currentSource === 2;
      const hasUserAudio = window.userAudioPlayback && window.userAudioPlayback.hasAudio();

      if (userAudioSelected && hasUserAudio) {
        // Use user audio for demo
        demoUsingUserAudio = true;

        // Start user audio playback if not already playing
        if (!window.userAudioPlayback.isPlaying()) {
          window.userAudioPlayback.play();
        }

        // Keep UI showing user audio is selected (no change needed)
      } else {
        // Use pink noise for demo (mute or pink noise selected, or no user audio loaded)
        demoUsingUserAudio = false;

        // Switch to Pink Noise (deviceL only — mono pink noise, monoFill routes L→R)
        if (selectorParams[0]) selectorParams[0].value = 1;
        if (selectorParams[1]) selectorParams[1].value = 0;
        window._monoFill.gain.value = 1;
        document.querySelectorAll('.source-button').forEach(btn => {
          btn.classList.toggle('active', parseInt(btn.dataset.source, 10) === 1);
        });
        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(1);
        }
      }

      // Step 2: Enable filters if not already enabled
      if (!filtersToggle.checked) {
        filtersToggle.click();
      }

      // Step 3: Clear all mutes and solos
      bandNames.forEach(band => {
        bandState[band].muted = false;
        bandState[band].soloed = false;
        updateBandUI(band);
      });
      updateAllBands(devices);

      // Step 4: Show "Full Range" for 3 seconds, then start cycling
      demoStatus.classList.remove('hidden');
      demoStatusText.textContent = 'Full Range';

      demoTimeouts.push(setTimeout(() => {
        cycleThroughBands(0);
      }, 3000));
    }

    function cycleThroughBands(index) {
      if (!demoRunning) {
        stopDemo();
        return;
      }

      // After all bands, show full range section
      if (index >= bandNames.length) {
        showFullRange();
        return;
      }

      const band = bandNames[index];

      // Solo this band
      bandState[band].soloed = true;
      updateBandUI(band);
      updateAllBands(devices);

      // Show status
      demoStatus.classList.remove('hidden');
      demoStatusText.textContent = `Soloing "${bandDisplayNames[band]}" Band`;

      // After 3.5 seconds, unsolo and move to next band
      demoTimeouts.push(setTimeout(() => {
        bandState[band].soloed = false;
        updateBandUI(band);
        updateAllBands(devices);
        cycleThroughBands(index + 1);
      }, 3500));
    }

    function showFullRange() {
      if (!demoRunning) {
        stopDemo();
        return;
      }

      // Show status
      demoStatus.classList.remove('hidden');
      demoStatusText.textContent = 'Full Range';

      // After 3 seconds, end demo
      demoTimeouts.push(setTimeout(() => {
        stopDemo();
      }, 3000));
    }

    function stopDemo() {
      demoTimeouts.forEach(timeout => clearTimeout(timeout));
      demoTimeouts = [];

      demoRunning = false;
      demoButton.classList.remove('running');
      demoButton.innerHTML = `
        <svg aria-hidden="true" class="demo-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Run Demo
      `;

      demoStatus.classList.add('hidden');

      // Clear all solos
      bandNames.forEach(band => {
        bandState[band].soloed = false;
        updateBandUI(band);
      });
      updateAllBands(devices);

      if (demoUsingUserAudio) {
        // Stop user audio playback and keep UI showing user audio selected
        if (window.userAudioPlayback && window.userAudioPlayback.isPlaying()) {
          window.userAudioPlayback.stop();
        }
        // Keep source set to User Audio (2) in UI, but RNBO will be muted by stopAudio()
        demoUsingUserAudio = false;
      } else {
        // Switch to Mute source (original behavior for pink noise demo)
        selectorParams.forEach(p => { if (p) p.value = 0; });
        window._monoFill.gain.value = 0;
        document.querySelectorAll('.source-button').forEach(btn => {
          btn.classList.toggle('active', parseInt(btn.dataset.source, 10) === 0);
        });
        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(0);
        }
      }
    }
  }

  // Separate gain values for different sources
  let pinkNoiseGain = -24;
  let userAudioGainValue = 0;
  let currentSource = 0; // 0=Mute, 1=Pink Noise, 2=User Audio

  function setupGain(devices, userAudioGain) {
    const gainSlider = document.getElementById("gain-slider");
    const gainValue = document.getElementsByClassName("gain-text")[0];

    // Convert dB to linear gain
    function dbToLinear(db) {
      return Math.pow(10, db / 20);
    }

    // Update slider fill gradient (for Webkit browsers)
    function updateSliderFill(slider) {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const value = parseFloat(slider.value);
      const percentage = ((value - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(90deg, #2563eb 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    }

    // Track last active source (non-mute) for restoring gain display
    let lastActiveSource = 1; // Default to Pink Noise

    // Initialize with mute selected, showing pink noise gain value
    gainSlider.value = pinkNoiseGain;
    gainValue.innerHTML = pinkNoiseGain + ' dB';
    updateSliderFill(gainSlider);

    // Set initial gains
    userAudioGain.gain.value = dbToLinear(userAudioGainValue);
    devices.forEach(d => {
      const gp = getParameter(d, "gain");
      if (gp) gp.value = pinkNoiseGain;
    });

    // Update gain control visual state based on source
    const gainControl = document.getElementById("gain-control");
    const playerContainers = document.querySelectorAll('.audio-player');
    function updateGainControlVisualState(source) {
      gainControl.classList.toggle('source-muted', source === 0);
      playerContainers.forEach(p => p.classList.toggle('source-disabled', source !== 2));
    }

    // Update slider display when source changes
    window.updateGainSliderForSource = function(source) {
      currentSource = source;
      updateGainControlVisualState(source);

      // When switching to Mute, keep slider in last state (don't update display)
      if (source === 0) {
        // Just update visual state, don't change slider value
        return;
      }

      // Track the last non-mute source
      lastActiveSource = source;

      if (source === 1) {
        // Pink Noise
        gainSlider.value = pinkNoiseGain;
        gainValue.innerHTML = Math.round(pinkNoiseGain) + ' dB';
      } else {
        // User Audio
        gainSlider.value = userAudioGainValue;
        gainValue.innerHTML = Math.round(userAudioGainValue) + ' dB';
      }
      updateSliderFill(gainSlider);
    };

    // Initialize gain control visual state (source starts at Mute)
    updateGainControlVisualState(0);

    gainSlider.oninput = function () {
      const value = parseFloat(this.value);
      gainValue.innerHTML = Math.round(value) + ' dB';
      updateSliderFill(this);

      if (currentSource === 1) {
        // Pink Noise - update RNBO gain on both devices and store
        pinkNoiseGain = value;
        devices.forEach(d => {
          const gp = getParameter(d, "gain");
          if (gp) gp.value = value;
        });
      } else {
        // User Audio (or Mute) - update user audio gain node and store
        userAudioGainValue = value;
        userAudioGain.gain.value = dbToLinear(value);
      }
    };
  }

  // Creates an independent audio player instance bound to a container element.
  // The onPlay callback is called before playback starts, allowing the coordinator
  // to pause other players (mutual exclusion).
  function createPlayer(container, devices, context, userAudioGain, onPlay, onFileLoaded) {
    // DOM elements scoped to this player's container
    const audioUploadSection = container.querySelector(".audio-upload-section");
    const fileInput = container.querySelector(".file-input:not(.file-input-compact)");
    const fileInputCompact = container.querySelector(".file-input-compact");
    const fileInfo = container.querySelector(".audio-info-row");
    const fileName = container.querySelector(".file-name");
    const fileDuration = container.querySelector(".file-duration");
    const playerGainRow = container.querySelector(".player-gain-row");
    const playerGainSlider = container.querySelector(".player-gain-slider");
    const playerGainDisplay = container.querySelector(".player-gain-value");
    const playbackControls = container.querySelector(".playback-controls");
    const playButton = container.querySelector(".play-button");
    const playIcon = container.querySelector(".play-icon");
    const pauseIcon = container.querySelector(".pause-icon");
    const loopToggle = container.querySelector(".loop-toggle");
    const waveformWrapper = container.querySelector(".waveform-wrapper");
    const waveformCanvas = container.querySelector(".waveform-canvas");
    const waveformCtx = waveformCanvas.getContext("2d");
    const waveformCursor = container.querySelector(".waveform-cursor");
    const currentTimeDisplay = container.querySelector(".current-time");
    const totalTimeDisplay = container.querySelector(".total-time");

    // Loop controls DOM elements
    const loopRangeInputs = container.querySelector(".loop-range-inputs");
    const loopStartInput = container.querySelector(".loop-start-input");
    const loopEndInput = container.querySelector(".loop-end-input");
    const loopRegion = container.querySelector(".loop-region");
    const loopHandleStart = container.querySelector(".loop-handle-start");
    const loopHandleEnd = container.querySelector(".loop-handle-end");

    // Upload areas
    const uploadArea = container.querySelector(".upload-area:not(.upload-area-compact)");
    const uploadAreaCompact = container.querySelector(".upload-area-compact");

    // Per-player gain node: audioSourceNode → playerGain → userAudioGain
    const playerGain = context.createGain();
    playerGain.connect(userAudioGain);

    function playerDbToLinear(db) {
      return Math.pow(10, db / 20);
    }

    function updatePlayerGainFill() {
      var min = parseFloat(playerGainSlider.min);
      var max = parseFloat(playerGainSlider.max);
      var val = parseFloat(playerGainSlider.value);
      var pct = ((val - min) / (max - min)) * 100;
      playerGainSlider.style.background = 'linear-gradient(90deg, #2563eb 0%, #3b82f6 ' + pct + '%, #e5e7eb ' + pct + '%, #e5e7eb 100%)';
    }

    playerGainSlider.addEventListener('input', function() {
      var db = parseFloat(this.value);
      playerGain.gain.value = playerDbToLinear(db);
      playerGainDisplay.textContent = Math.round(db) + ' dB';
      updatePlayerGainFill();
    });

    updatePlayerGainFill();

    // Cached waveform peaks (computed once per audio file)
    let waveformPeaks = null;

    // Audio playback state
    let uploadedAudioBuffer = null;
    let audioSourceNode = null;
    let isPlaying = false;
    let shouldLoop = false;
    let startTime = 0;
    let pausedAt = 0;
    let audioDuration = 0;
    let progressAnimationId = null;

    // Loop boundary state
    let loopStart = 0;
    let loopEnd = 0;
    let isDraggingHandle = null;

    // Get the audio source selector parameter from both devices
    const selectorParams = devices.map(d => getParameter(d, 'audioFile_selector'));

    // Format time as MM:SS
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // Parse time string (M:SS or MM:SS) to seconds
    function parseTime(timeStr) {
      const parts = timeStr.split(':');
      if (parts.length !== 2) return null;
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      if (isNaN(minutes) || isNaN(seconds)) return null;
      return minutes * 60 + seconds;
    }

    // Shared onended handler for audio source nodes
    function handlePlaybackEnded() {
      if (!shouldLoop && isPlaying) {
        isPlaying = false;
        pausedAt = 0;
        updatePlayButton();
        container.classList.remove('player-active');
        currentTimeDisplay.textContent = "0:00";
        drawWaveform();
        if (progressAnimationId) {
          cancelAnimationFrame(progressAnimationId);
          progressAnimationId = null;
        }
        selectorParams.forEach(p => { if (p) p.value = 0; });
      }
    }

    // Compute waveform peaks from audio buffer (called once per file load)
    function computePeaks() {
      if (!uploadedAudioBuffer) { waveformPeaks = null; return; }

      const rawData = uploadedAudioBuffer.getChannelData(0);
      const targetSamples = 512;
      const blockSize = Math.floor(rawData.length / targetSamples);
      const peaks = [];

      for (let i = 0; i < targetSamples; i++) {
        const start = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[start + j] || 0);
        }
        peaks.push(sum / blockSize);
      }

      const maxPeak = Math.max(...peaks) || 1;
      for (let k = 0; k < peaks.length; k++) {
        peaks[k] = peaks[k] / maxPeak;
      }

      waveformPeaks = peaks;
    }

    // Draw the waveform visualization with played/unplayed color split
    function drawWaveform() {
      if (!waveformPeaks) return;

      const rect = waveformWrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) return;

      waveformCanvas.width = width * dpr;
      waveformCanvas.height = height * dpr;
      waveformCanvas.style.width = width + 'px';
      waveformCanvas.style.height = height + 'px';
      waveformCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const waveColor = isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(37, 99, 235, 0.5)';
      const playedColor = isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.8)';

      waveformCtx.clearRect(0, 0, width, height);

      const barWidth = 2;
      const gap = 1;
      const step = barWidth + gap;
      const centerY = height / 2;
      const maxBarHeight = height / 2 - 2;

      // Calculate playback fraction
      let playedFraction = 0;
      if (audioDuration > 0) {
        if (isPlaying) {
          const elapsed = context.currentTime - startTime + pausedAt;
          playedFraction = Math.min(elapsed / audioDuration, 1);
        } else {
          playedFraction = pausedAt / audioDuration;
        }
      }

      for (let x = 0; x < width; x += step) {
        const peakIndex = Math.floor((x / width) * waveformPeaks.length);
        const peak = waveformPeaks[peakIndex] || 0;
        const barHeight = Math.max(1, peak * maxBarHeight);

        const xFraction = x / width;
        waveformCtx.fillStyle = xFraction < playedFraction ? playedColor : waveColor;

        waveformCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        waveformCtx.fillRect(x, centerY, barWidth, barHeight);
      }
    }

    // Update loop region and handles UI
    function updateLoopRegionUI() {
      if (!audioDuration) return;

      const startPercent = (loopStart / audioDuration) * 100;
      const endPercent = (loopEnd / audioDuration) * 100;

      loopRegion.style.left = `${startPercent}%`;
      loopRegion.style.width = `${endPercent - startPercent}%`;

      loopHandleStart.style.left = `${startPercent}%`;
      loopHandleEnd.style.left = `${endPercent}%`;
    }

    // Update progress bar and time display
    function updateProgress() {
      if (!isPlaying || !uploadedAudioBuffer) return;

      const elapsed = context.currentTime - startTime + pausedAt;
      let currentTime = elapsed;

      if (shouldLoop && loopEnd > loopStart) {
        if (elapsed >= loopEnd) {
          if (audioSourceNode) {
            audioSourceNode.onended = null;
            audioSourceNode.stop();
            audioSourceNode.disconnect();
          }

          audioSourceNode = context.createBufferSource();
          audioSourceNode.buffer = uploadedAudioBuffer;
          audioSourceNode.connect(playerGain);
          audioSourceNode.loop = false;
          audioSourceNode.onended = handlePlaybackEnded;

          startTime = context.currentTime;
          pausedAt = loopStart;
          audioSourceNode.start(0, loopStart);
          currentTime = loopStart;
        } else {
          currentTime = elapsed;
        }
      } else if (currentTime > audioDuration) {
        currentTime = audioDuration;
      }

      currentTimeDisplay.textContent = formatTime(currentTime);
      drawWaveform();

      if (isPlaying) {
        progressAnimationId = requestAnimationFrame(updateProgress);
      }
    }

    // Handle audio file (shared by file input and drag & drop)
    async function handleAudioFile(file) {
      if (!file) return;

      if (!file.type.startsWith("audio/")) {
        alert("Please select a valid audio file.");
        return;
      }

      const MAX_FILE_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Maximum size is 100MB.");
        return;
      }

      if (isPlaying) {
        stopAudio();
      }
      pausedAt = 0;

      try {
        const arrayBuffer = await file.arrayBuffer();
        uploadedAudioBuffer = await context.decodeAudioData(arrayBuffer);
        audioDuration = uploadedAudioBuffer.duration;

        const durationFormatted = formatTime(audioDuration);

        fileName.textContent = file.name;
        fileDuration.textContent = durationFormatted;
        totalTimeDisplay.textContent = durationFormatted;
        currentTimeDisplay.textContent = "0:00";
        fileInfo.classList.remove("hidden");
        playbackControls.classList.remove("hidden");
        audioUploadSection.classList.add("has-file");

        // Compute and draw waveform
        computePeaks();
        drawWaveform();

        loopStart = 0;
        loopEnd = audioDuration;
        loopStartInput.value = formatTime(0);
        loopEndInput.value = formatTime(audioDuration);
        updateLoopRegionUI();

        console.log("Audio file loaded:", file.name);
        console.log("Duration:", durationFormatted);
        console.log("Sample rate:", uploadedAudioBuffer.sampleRate);
        console.log("Channels:", uploadedAudioBuffer.numberOfChannels);

        // No longer inviting upload — file is loaded
        container.classList.remove('upload-inviting');

        if (onFileLoaded) onFileLoaded();

        // Switch source to User Audio when a file is loaded
        document.querySelectorAll('.source-button').forEach(btn => {
          btn.classList.toggle('active', parseInt(btn.dataset.source, 10) === 2);
        });
        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(2);
        }

      } catch (error) {
        console.error("Error decoding audio file:", error);
        alert("Could not decode audio file. Please try a different file.");
      }
    }

    // Play audio from a specific offset
    async function playAudio(offset) {
      if (offset === undefined) offset = pausedAt;
      if (!uploadedAudioBuffer) return;

      // Resume audio context if suspended (required for iOS)
      if (context.state === "suspended") {
        try {
          await context.resume();
          console.log("Audio context resumed");
        } catch (err) {
          console.error("Failed to resume audio context:", err);
          return;
        }
      }

      // Mutual exclusion: pause the other player before starting
      onPlay();

      audioSourceNode = context.createBufferSource();
      audioSourceNode.buffer = uploadedAudioBuffer;
      audioSourceNode.loop = false;
      audioSourceNode.connect(playerGain);
      audioSourceNode.onended = handlePlaybackEnded;

      selectorParams.forEach(p => { if (p) p.value = 2; });

      startTime = context.currentTime;
      pausedAt = offset;
      audioSourceNode.start(0, offset);
      isPlaying = true;
      updatePlayButton();
      container.classList.add('player-active');
      updateProgress();
      console.log("User audio playback started at", formatTime(offset));
    }

    function stopAudio() {
      if (progressAnimationId) {
        cancelAnimationFrame(progressAnimationId);
        progressAnimationId = null;
      }

      if (audioSourceNode) {
        const elapsed = context.currentTime - startTime + pausedAt;
        pausedAt = shouldLoop ? elapsed % audioDuration : Math.min(elapsed, audioDuration);

        audioSourceNode.stop();
        audioSourceNode.disconnect();
        audioSourceNode = null;
      }
      isPlaying = false;
      updatePlayButton();
      container.classList.remove('player-active');

      selectorParams.forEach(p => { if (p) p.value = 0; });

      console.log("User audio playback paused at", formatTime(pausedAt));
    }

    function updatePlayButton() {
      if (isPlaying) {
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
        playButton.setAttribute("aria-label", "Pause audio");
      } else {
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        playButton.setAttribute("aria-label", "Play audio");
      }
    }

    // --- Event listeners ---

    // File inputs
    fileInput.addEventListener("change", (event) => {
      handleAudioFile(event.target.files[0]);
    });

    fileInputCompact.addEventListener("change", (event) => {
      handleAudioFile(event.target.files[0]);
    });

    // Drag & drop on main upload area
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("drag-over");
    });
    uploadArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("drag-over");
    });
    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("drag-over");
      handleAudioFile(e.dataTransfer.files[0]);
    });

    // Drag & drop on compact upload area
    uploadAreaCompact.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadAreaCompact.classList.add("drag-over");
    });
    uploadAreaCompact.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadAreaCompact.classList.remove("drag-over");
    });
    uploadAreaCompact.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadAreaCompact.classList.remove("drag-over");
      handleAudioFile(e.dataTransfer.files[0]);
    });

    // Play button
    playButton.addEventListener("click", async () => {
      if (isPlaying) {
        stopAudio();
      } else {
        await playAudio(pausedAt);
      }
    });

    // Loop toggle
    loopToggle.addEventListener("change", () => {
      shouldLoop = loopToggle.checked;

      loopRangeInputs.classList.toggle("active", shouldLoop);
      loopRegion.classList.toggle("active", shouldLoop);
      loopHandleStart.classList.toggle("active", shouldLoop);
      loopHandleEnd.classList.toggle("active", shouldLoop);

      if (shouldLoop && loopEnd === 0 && audioDuration > 0) {
        loopEnd = audioDuration;
        loopEndInput.value = formatTime(loopEnd);
        updateLoopRegionUI();
      }

      console.log("Loop:", shouldLoop ? "enabled" : "disabled");
    });

    // Loop time inputs
    loopStartInput.addEventListener("change", () => {
      const time = parseTime(loopStartInput.value);
      if (time !== null && time >= 0 && time < loopEnd) {
        loopStart = time;
        updateLoopRegionUI();
      } else {
        loopStartInput.value = formatTime(loopStart);
      }
    });

    loopEndInput.addEventListener("change", () => {
      const time = parseTime(loopEndInput.value);
      if (time !== null && time > loopStart && time <= audioDuration) {
        loopEnd = time;
        updateLoopRegionUI();
      } else {
        loopEndInput.value = formatTime(loopEnd);
      }
    });

    // Drag handlers for loop handles (mouse + touch)
    function getClientX(event) {
      if (event.touches && event.touches.length > 0) return event.touches[0].clientX;
      if (event.changedTouches && event.changedTouches.length > 0) return event.changedTouches[0].clientX;
      return event.clientX;
    }

    function handleDragStart(handle) {
      return (event) => {
        event.preventDefault();
        event.stopPropagation();
        isDraggingHandle = handle;
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
      };
    }

    function handleDragMove(event) {
      if (!isDraggingHandle || !audioDuration) return;
      if (event.cancelable) event.preventDefault();

      const rect = waveformWrapper.getBoundingClientRect();
      let percentage = (getClientX(event) - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      const time = percentage * audioDuration;

      if (isDraggingHandle === 'start' && time < loopEnd - 0.1) {
        loopStart = time;
        loopStartInput.value = formatTime(loopStart);
      } else if (isDraggingHandle === 'end' && time > loopStart + 0.1) {
        loopEnd = time;
        loopEndInput.value = formatTime(loopEnd);
      }

      updateLoopRegionUI();
    }

    function handleDragEnd() {
      const wasStartHandle = isDraggingHandle === 'start';
      isDraggingHandle = null;
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);

      if (wasStartHandle && uploadedAudioBuffer) {
        if (isPlaying && audioSourceNode) {
          audioSourceNode.onended = null;
          audioSourceNode.stop();
          audioSourceNode.disconnect();
          audioSourceNode = null;
          if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
          }
        }
        playAudio(loopStart);
      }
    }

    loopHandleStart.addEventListener('mousedown', handleDragStart('start'));
    loopHandleEnd.addEventListener('mousedown', handleDragStart('end'));
    loopHandleStart.addEventListener('touchstart', handleDragStart('start'), { passive: false });
    loopHandleEnd.addEventListener('touchstart', handleDragStart('end'), { passive: false });

    // Waveform click handler for seeking
    waveformWrapper.addEventListener("click", (event) => {
      if (!uploadedAudioBuffer) return;
      if (event.target.classList.contains('loop-handle')) return;

      const rect = waveformWrapper.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const seekTime = percentage * audioDuration;

      currentTimeDisplay.textContent = formatTime(seekTime);

      if (isPlaying) {
        if (audioSourceNode) {
          audioSourceNode.onended = null;
          audioSourceNode.stop();
          audioSourceNode.disconnect();
          audioSourceNode = null;
        }
        if (progressAnimationId) {
          cancelAnimationFrame(progressAnimationId);
          progressAnimationId = null;
        }

        audioSourceNode = context.createBufferSource();
        audioSourceNode.buffer = uploadedAudioBuffer;
        audioSourceNode.loop = false;
        audioSourceNode.connect(playerGain);
        audioSourceNode.onended = handlePlaybackEnded;

        startTime = context.currentTime;
        pausedAt = seekTime;
        audioSourceNode.start(0, seekTime);
        updateProgress();
        console.log("Seeked to", formatTime(seekTime));
      } else {
        pausedAt = seekTime;
        drawWaveform();
      }
    });

    // Waveform cursor on hover
    waveformWrapper.addEventListener("mousemove", (event) => {
      const rect = waveformWrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      waveformCursor.style.left = x + 'px';
    });

    waveformWrapper.addEventListener("mouseleave", () => {
      waveformCursor.style.left = '0px';
    });

    // Return the player API
    return {
      play: playAudio,
      stop: () => { if (isPlaying) stopAudio(); },
      isPlaying: () => isPlaying,
      hasAudio: () => uploadedAudioBuffer !== null
    };
  }

  // Coordinator: sets up two player instances with mutual exclusion
  function setupAudioSource(devices, context, userAudioGain) {
    const container1 = document.getElementById('player-1');
    const container2 = document.getElementById('player-2');

    // Player 1 upload area stays visually active until a file is loaded
    container1.classList.add('upload-inviting');

    const sourceButtons = document.querySelectorAll(".source-button");
    const selectorParams = devices.map(d => getParameter(d, 'audioFile_selector'));

    // Tab audio capture state
    let tabStream = null;
    let tabSourceNode = null;

    function stopTabCapture() {
      if (tabStream) {
        tabStream.getTracks().forEach(t => t.stop());
        tabStream = null;
      }
      if (tabSourceNode) {
        tabSourceNode.disconnect();
        tabSourceNode = null;
      }
    }

    async function startTabCapture() {
      stopTabCapture();
      try {
        tabStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            suppressLocalAudioPlayback: true
          },
          preferCurrentTab: false
        });

        // Get the tab name from track labels before stopping video
        var videoTracks = tabStream.getVideoTracks();
        var audioTracks = tabStream.getAudioTracks();

        // Try audio track label first, then video
        var rawLabel = '';
        if (audioTracks.length > 0) rawLabel = audioTracks[0].label || '';
        if ((!rawLabel || rawLabel.indexOf('://') !== -1) && videoTracks.length > 0) {
          rawLabel = videoTracks[0].label || '';
        }
        // If the label is a stream URI or empty, fall back
        var tabName = rawLabel;
        if (!tabName || tabName.indexOf('://') !== -1) {
          tabName = 'another tab';
        }
        videoTracks.forEach(function(t) { t.stop(); });
        if (audioTracks.length === 0) {
          alert('No audio track captured. Make sure to check "Share tab audio" in the dialog.');
          stopTabCapture();
          return false;
        }

        tabSourceNode = context.createMediaStreamSource(tabStream);
        tabSourceNode.connect(userAudioGain);

        // Set RNBO devices to process external input
        selectorParams.forEach(function(p) { if (p) p.value = 2; });
        window._monoFill.gain.value = 0;

        // Show overlay on player 1
        var overlay = container1.querySelector('.tab-capture-overlay');
        var nameSpan = container1.querySelector('.tab-capture-name');
        if (overlay && nameSpan) {
          nameSpan.textContent = tabName;
          overlay.classList.remove('hidden');
        }
        // Hide the upload section
        var uploadSection = container1.querySelector('.audio-upload-section');
        if (uploadSection) uploadSection.classList.add('hidden');

        // If the user stops sharing from the browser UI, switch back to mute
        audioTracks[0].addEventListener('ended', function() {
          stopTabCapture();
          updateSourceButtons(0);
          selectorParams.forEach(function(p) { if (p) p.value = 0; });
          if (window.updateGainSliderForSource) window.updateGainSliderForSource(0);
          // Hide overlay, show upload section
          if (overlay) overlay.classList.add('hidden');
          if (uploadSection) uploadSection.classList.remove('hidden');
          console.log("Tab audio capture ended");
        });

        console.log("Tab audio capture started:", tabName);

        return true;
      } catch (err) {
        if (err.name !== 'NotAllowedError') {
          console.error("Tab capture failed:", err);
        }
        stopTabCapture();
        return false;
      }
    }

    let activePlayer = null;

    // Create players with mutual exclusion callbacks
    const player1 = createPlayer(container1, devices, context, userAudioGain, () => {
      player2.stop();
      activePlayer = player1;
    }, () => {
      // First file uploaded to Player 1: expand Player 2
      if (container2.classList.contains('collapsed')) {
        container2.classList.remove('collapsed');
        var toggleBtn = container2.querySelector('.player-label-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    const player2 = createPlayer(container2, devices, context, userAudioGain, () => {
      player1.stop();
      activePlayer = player2;
    });

    activePlayer = player1;

    // Update source button active state
    function updateSourceButtons(value) {
      sourceButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.source, 10) === value);
      });
    }

    // Initialize buttons from RNBO parameter
    if (selectorParams[0]) {
      updateSourceButtons(selectorParams[0].value);
    }

    // Handle source button clicks
    sourceButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const value = parseInt(btn.dataset.source, 10);

        if (context.state === "suspended") {
          try {
            await context.resume();
            console.log("Audio context resumed");
          } catch (err) {
            console.error("Failed to resume audio context:", err);
            return;
          }
        }

        // Stop both players when switching away from user audio
        if (value !== 2 && value !== 3) {
          player1.stop();
          player2.stop();
        }

        // Stop tab capture when switching away from tab audio
        if (value !== 3) {
          stopTabCapture();
          // Hide overlay, show upload section
          var overlay = container1.querySelector('.tab-capture-overlay');
          if (overlay) overlay.classList.add('hidden');
          var uploadSection = container1.querySelector('.audio-upload-section');
          if (uploadSection) uploadSection.classList.remove('hidden');
        }

        // Handle tab audio capture
        if (value === 3) {
          player1.stop();
          player2.stop();
          var success = await startTabCapture();
          if (!success) {
            // User cancelled or no audio — revert to mute
            updateSourceButtons(0);
            selectorParams.forEach(p => { if (p) p.value = 0; });
            if (window.updateGainSliderForSource) window.updateGainSliderForSource(0);
            return;
          }
          updateSourceButtons(3);
          if (window.updateGainSliderForSource) window.updateGainSliderForSource(2);
          // Keep player 2 grayed out during tab capture
          container2.classList.add('source-disabled');
          return;
        }

        updateSourceButtons(value);

        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(value);
        }

        if (value === 1) {
          // Pink noise: deviceL only (mono), monoFill routes L→R
          if (selectorParams[0]) selectorParams[0].value = 1;
          if (selectorParams[1]) selectorParams[1].value = 0;
          window._monoFill.gain.value = 1;
        } else {
          // User audio or mute: both devices, monoFill off
          selectorParams.forEach(p => {
            if (p) p.value = (value === 2) ? 0 : value;
          });
          window._monoFill.gain.value = 0;
        }

        console.log("Audio source changed to:", ["Mute", "Pink Noise", "User Audio", "Browser Tab"][value]);
      });
    });

    // Space bar controls the most recently active player
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space" && !event.target.matches("input, textarea, select, button")) {
        if (!activePlayer || !activePlayer.hasAudio()) return;
        // Don't allow playback when source is not User Audio
        if (container1.classList.contains('source-disabled')) return;
        event.preventDefault();
        if (activePlayer.isPlaying()) {
          activePlayer.stop();
        } else {
          activePlayer.play();
        }
      }
    });

    // Expose for demo integration (uses Player 1)
    window.userAudioPlayback = {
      play: async () => { if (!player1.isPlaying()) await player1.play(); },
      stop: () => { player1.stop(); },
      isPlaying: () => player1.isPlaying(),
      hasAudio: () => player1.hasAudio() || player2.hasAudio()
    };
  }

// helper functions
function getInports(device) {
    const messages = device.messages;
    const inports = messages.filter(
      (message) => message.type === RNBO.MessagePortType.Inport
    );
    return inports;
}
  
function getParameters(device) {
    const parameters = device.parameters;
    return parameters;
}
  
function getParameter(device, parameterName) {
    const parameters = device.parameters;
    const parameter = parameters.find((param) => param.name === parameterName);
    return parameter;
}
  
function attachOutports(device) {
    const outports = device.outports;
    const consoleEl = document.getElementById("rnbo-console");
    const noOutportsLabel = document.getElementById("no-outports-label");
    const readout = document.getElementById("rnbo-console-readout");

    if (outports.length < 1) {
        // No outports - keep console hidden (it's hidden by default in HTML)
        return;
    }

    // Has outports - show console and remove "no outports" label
    if (consoleEl) {
        consoleEl.classList.remove("hidden");
    }
    if (noOutportsLabel && noOutportsLabel.parentNode) {
        noOutportsLabel.parentNode.removeChild(noOutportsLabel);
    }

    device.messageEvent.subscribe((ev) => {
        // Ignore message events that don't belong to an outport
        if (outports.findIndex(elt => elt.tag === ev.tag) < 0) return;

        // Message events have a tag as well as a payload
        console.log(`${ev.tag}: ${ev.payload}`);

        if (readout) {
            readout.innerText = `${ev.tag}: ${ev.payload}`;
        }
    });
}

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
            tooltipEl.textContent = '';
            Array.from(content.cloneNode(true).childNodes).forEach(function(n) { tooltipEl.appendChild(n); });
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

function initPlayer2Toggle() {
    var player2 = document.getElementById('player-2');
    var toggleBtn = player2.querySelector('.player-label-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function() {
        var isCollapsed = player2.classList.toggle('collapsed');
        toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    });
}

setup().catch(err => {
    console.error("Setup failed:", err);
});
