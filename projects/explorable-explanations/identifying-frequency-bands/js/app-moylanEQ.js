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

    // Create the device
    let device;
    try {
        device = await RNBO.createDevice({ context, patcher });
    } catch (err) {
        if (typeof guardrails === "function") {
            guardrails({ error: err });
        } else {
            throw err;
        }
        return;
    }

    // (Optional) Load the samples (We are using)
    if (dependencies.length)
        await device.loadDataBufferDependencies(dependencies);

    // Connect the device to the web audio graph
    device.node.connect(outputNode);

    // (Optional) Extract the name and rnbo version of the patcher from the description
    // document.getElementById("patcher-title").innerText = (patcher.desc.meta.filename || "Unnamed Patcher") + " (v" + patcher.desc.meta.rnboversion + ")";

    // (Optional) Automatically create sliders for the device parameters
    // makeSliders(device);

    // (Optional) Create a form to send messages to RNBO inputs
    // makeInportForm(device);

    // (Optional) Attach listeners to outports so you can log messages from the RNBO patcher
    attachOutports(device);

    // User Added
    const inports = getInports(device);
    console.log("Inports:");
    console.log(inports);
    const parameters = getParameters(device);
    console.log("Parameters");
    parameters.forEach((param) => {
        console.log(param);
    });

    setupFilters(device);
    setupBandControls(device);
    // Create gain node for user audio (controlled by gain slider)
    const userAudioGain = context.createGain();
    userAudioGain.connect(device.node);

    setupGain(device, userAudioGain);
    setupAudioSource(device, context, userAudioGain);
    setupDemo(device, context);

    // (Optional) Load presets, if any
    // loadPresets(device, patcher);

    // (Optional) Connect MIDI inputs
    // makeMIDIKeyboard(device);

    document.body.onclick = () => {
        if (context.state === "running") return;
        context.resume();
        console.log("Audio context resumed");
      };

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
        el.onload = resolve;
        el.onerror = function(err) {
            console.log(err);
            reject(new Error("Failed to load rnbo.js v" + version));
        };
        document.body.append(el);
    });
}

  function setupFilters(device) {
    const filtersToggle = document.getElementById("filters-toggle");
    // Update band control visual state based on filter toggle
    function updateBandControlsVisualState(filtersEnabled) {
      const bandControls = document.querySelectorAll('.band-control');
      bandControls.forEach(control => {
        control.classList.toggle('filters-disabled', !filtersEnabled);
      });
    }

    filtersToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "filter",
        filtersToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      updateBandControlsVisualState(filtersToggle.checked);
    };
    const toggleState = getParameter(device, "filter");
    filtersToggle.checked = toggleState.value === 1;
    // Initialize visual state on load
    updateBandControlsVisualState(filtersToggle.checked);
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

  function setupBandControls(device) {
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
        updateAllBands(device);
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
        updateAllBands(device);
      });
    });

    // Initialize all bands to enabled (not muted)
    updateAllBands(device);
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

  function updateAllBands(device) {
    const anySoloed = bandNames.some(b => bandState[b].soloed);

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

      // Send message to RNBO
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        band,
        enabled ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);

      // Update UI for implicit mute state
      updateBandUI(band);
    });
  }

  function setupDemo(device, context) {
    const demoButton = document.getElementById('demo-button');
    const demoStatus = document.getElementById('demo-status');
    const demoStatusText = document.getElementById('demo-status-text');
    const selectorParam = getParameter(device, 'audioFile_selector');
    const filtersToggle = document.getElementById('filters-toggle');

    // Track whether we're using user audio for the demo
    let demoUsingUserAudio = false;

    demoButton.addEventListener('click', () => {
      // Resume audio context if suspended (required for iOS)
      if (context.state === "suspended") {
        context.resume();
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

        // Switch to Pink Noise
        if (selectorParam) {
          selectorParam.value = 1;
        }
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
      updateAllBands(device);

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
      updateAllBands(device);

      // Show status
      demoStatus.classList.remove('hidden');
      demoStatusText.textContent = `Soloing "${bandDisplayNames[band]}" Band`;

      // After 3.5 seconds, unsolo and move to next band
      demoTimeouts.push(setTimeout(() => {
        bandState[band].soloed = false;
        updateBandUI(band);
        updateAllBands(device);
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
      updateAllBands(device);

      if (demoUsingUserAudio) {
        // Stop user audio playback and keep UI showing user audio selected
        if (window.userAudioPlayback && window.userAudioPlayback.isPlaying()) {
          window.userAudioPlayback.stop();
        }
        // Keep source set to User Audio (2) in UI, but RNBO will be muted by stopAudio()
        demoUsingUserAudio = false;
      } else {
        // Switch to Mute source (original behavior for pink noise demo)
        if (selectorParam) {
          selectorParam.value = 0;
        }
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
  let userAudioGainValue = -12;
  let currentSource = 0; // 0=Mute, 1=Pink Noise, 2=User Audio

  function setupGain(device, userAudioGain) {
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
    const gainParam = getParameter(device, "gain");
    if (gainParam) {
      gainParam.value = pinkNoiseGain;
    }

    // Update gain control visual state based on source
    const gainControl = document.getElementById("gain-control");
    function updateGainControlVisualState(source) {
      gainControl.classList.toggle('source-muted', source === 0);
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
        // Pink Noise - update RNBO gain and store
        pinkNoiseGain = value;
        const gainParam = getParameter(device, "gain");
        if (gainParam) {
          gainParam.value = value;
        }
      } else {
        // User Audio (or Mute) - update user audio gain node and store
        userAudioGainValue = value;
        userAudioGain.gain.value = dbToLinear(value);
      }
    };
  }

  function setupAudioSource(device, context, userAudioGain) {
    // DOM elements
    const sourceButtons = document.querySelectorAll(".source-button");
    const fileInput = document.getElementById("audio-file-input");
    const fileInputCompact = document.getElementById("audio-file-input-compact");
    const audioUploadSection = document.getElementById("audio-upload-section");
    const fileInfo = document.getElementById("audio-file-info");
    const fileName = document.getElementById("audio-file-name");
    const fileDuration = document.getElementById("audio-file-duration");
    const playbackControls = document.getElementById("playback-controls");
    const playButton = document.getElementById("play-button");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const loopToggle = document.getElementById("loop-toggle");
    const progressBar = document.getElementById("progress-bar");
    const progressFill = document.getElementById("progress-fill");
    const currentTimeDisplay = document.getElementById("current-time");
    const totalTimeDisplay = document.getElementById("total-time");

    // Loop controls DOM elements
    const loopRangeInputs = document.getElementById("loop-range-inputs");
    const loopStartInput = document.getElementById("loop-start-input");
    const loopEndInput = document.getElementById("loop-end-input");
    const loopRegion = document.getElementById("loop-region");
    const loopHandleStart = document.getElementById("loop-handle-start");
    const loopHandleEnd = document.getElementById("loop-handle-end");

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

    // Get the audio source selector parameter
    const selectorParam = getParameter(device, "audioFile_selector");

    // Update source button active state
    function updateSourceButtons(value) {
      sourceButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.source, 10) === value);
      });
    }

    // Initialize buttons from RNBO parameter
    if (selectorParam) {
      updateSourceButtons(selectorParam.value);
    }

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
        // Check if we've passed the loop end point
        if (elapsed >= loopEnd) {
          // Need to restart audio from loop start
          if (audioSourceNode) {
            audioSourceNode.onended = null;
            audioSourceNode.stop();
            audioSourceNode.disconnect();
          }

          audioSourceNode = context.createBufferSource();
          audioSourceNode.buffer = uploadedAudioBuffer;
          audioSourceNode.connect(userAudioGain);
          audioSourceNode.loop = false; // We handle looping manually

          audioSourceNode.onended = () => {
            if (!shouldLoop && isPlaying) {
              isPlaying = false;
              pausedAt = 0;
              updatePlayButton();
              progressFill.style.width = "0%";
              currentTimeDisplay.textContent = "0:00";
              if (progressAnimationId) {
                cancelAnimationFrame(progressAnimationId);
                progressAnimationId = null;
              }
              if (selectorParam) {
                selectorParam.value = 0;
              }
            }
          };

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

      const progress = (currentTime / audioDuration) * 100;
      progressFill.style.width = `${Math.min(progress, 100)}%`;
      currentTimeDisplay.textContent = formatTime(currentTime);

      if (isPlaying) {
        progressAnimationId = requestAnimationFrame(updateProgress);
      }
    }

    // Handle source button clicks
    sourceButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = parseInt(btn.dataset.source, 10);

        // Resume audio context if suspended (required for iOS)
        if (context.state === "suspended") {
          context.resume();
        }

        // Stop any playing user audio when switching away from user audio
        if (value !== 2 && isPlaying) {
          stopAudio();
        }

        // Update button active states
        updateSourceButtons(value);

        // Update gain slider to show the appropriate gain for this source
        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(value);
        }

        // For User Audio, keep RNBO muted until play is pressed
        // For other sources (Mute, Pink Noise), update RNBO parameter directly
        if (selectorParam) {
          if (value === 2) {
            // User Audio selected - stay muted, playAudio() will switch to 2 when needed
            selectorParam.value = 0;
          } else {
            selectorParam.value = value;
          }
        }

        console.log("Audio source changed to:", ["Mute", "Pink Noise", "User Audio"][value]);
      });
    });

    // Handle audio file (shared by file input and drag & drop)
    async function handleAudioFile(file) {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("audio/")) {
        console.error("Please select an audio file");
        return;
      }

      // Stop any existing playback before loading new file
      if (isPlaying) {
        stopAudio();
      }
      // Reset playback position to beginning
      pausedAt = 0;

      try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Decode audio data
        uploadedAudioBuffer = await context.decodeAudioData(arrayBuffer);
        audioDuration = uploadedAudioBuffer.duration;

        // Format duration display (MM:SS)
        const durationFormatted = formatTime(audioDuration);

        // Update UI
        fileName.textContent = file.name;
        fileDuration.textContent = durationFormatted;
        totalTimeDisplay.textContent = durationFormatted;
        currentTimeDisplay.textContent = "0:00";
        progressFill.style.width = "0%";
        fileInfo.classList.remove("hidden");
        playbackControls.classList.remove("hidden");
        audioUploadSection.classList.add("has-file");

        // Initialize loop boundaries
        loopStart = 0;
        loopEnd = audioDuration;
        loopStartInput.value = formatTime(0);
        loopEndInput.value = formatTime(audioDuration);
        updateLoopRegionUI();

        // Log info for debugging
        console.log("Audio file loaded:", file.name);
        console.log("Duration:", durationFormatted);
        console.log("Sample rate:", uploadedAudioBuffer.sampleRate);
        console.log("Channels:", uploadedAudioBuffer.numberOfChannels);

        // Show "User Audio" button active but keep RNBO muted until play is pressed
        updateSourceButtons(2);

        // Update gain control to show active state (source 2 = User Audio)
        if (window.updateGainSliderForSource) {
          window.updateGainSliderForSource(2);
        }

      } catch (error) {
        console.error("Error decoding audio file:", error);
      }
    }

    // Handle file upload via file input
    fileInput.addEventListener("change", (event) => {
      handleAudioFile(event.target.files[0]);
    });

    // Handle file upload via compact file input
    fileInputCompact.addEventListener("change", (event) => {
      handleAudioFile(event.target.files[0]);
    });

    // Drag & drop handlers
    const uploadArea = document.getElementById("audio-upload-area");
    const uploadAreaCompact = document.getElementById("audio-upload-area-compact");

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
      const file = e.dataTransfer.files[0];
      handleAudioFile(file);
    });

    // Drag & drop handlers for compact upload area
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
      const file = e.dataTransfer.files[0];
      handleAudioFile(file);
    });

    // Expose audio playback functions globally for demo
    window.userAudioPlayback = {
      play: () => { if (!isPlaying) playAudio(pausedAt); },
      stop: () => { if (isPlaying) stopAudio(); },
      isPlaying: () => isPlaying,
      hasAudio: () => uploadedAudioBuffer !== null
    };

    // Play audio from a specific offset
    function playAudio(offset = 0) {
      if (!uploadedAudioBuffer) return;

      // Resume audio context if suspended
      if (context.state === "suspended") {
        context.resume();
      }

      // Create a new buffer source node
      audioSourceNode = context.createBufferSource();
      audioSourceNode.buffer = uploadedAudioBuffer;
      audioSourceNode.loop = false; // We handle looping manually with loop start/end

      // Connect through gain node to RNBO device - gain node handles volume control
      audioSourceNode.connect(userAudioGain);

      // Handle playback ended
      audioSourceNode.onended = () => {
        if (!shouldLoop && isPlaying) {
          isPlaying = false;
          pausedAt = 0;
          updatePlayButton();
          progressFill.style.width = "0%";
          currentTimeDisplay.textContent = "0:00";
          if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
          }
          // Mute RNBO input when playback ends to prevent unwanted tone
          // Keep dropdown showing "User Audio" since file is still loaded
          if (selectorParam) {
            selectorParam.value = 0;
          }
        }
      };

      // Switch RNBO to User Audio mode when starting playback
      if (selectorParam) {
        selectorParam.value = 2;
      }

      // Start playback from the offset
      startTime = context.currentTime;
      pausedAt = offset;
      audioSourceNode.start(0, offset);
      isPlaying = true;
      updatePlayButton();
      updateProgress();
      console.log("User audio playback started at", formatTime(offset));
    }

    function stopAudio() {
      if (progressAnimationId) {
        cancelAnimationFrame(progressAnimationId);
        progressAnimationId = null;
      }

      if (audioSourceNode) {
        // Calculate current position before stopping
        const elapsed = context.currentTime - startTime + pausedAt;
        pausedAt = shouldLoop ? elapsed % audioDuration : Math.min(elapsed, audioDuration);

        audioSourceNode.stop();
        audioSourceNode.disconnect();
        audioSourceNode = null;
      }
      isPlaying = false;
      updatePlayButton();

      // Mute RNBO input when paused to prevent unwanted tone
      // Keep dropdown showing "User Audio" since file is still loaded
      if (selectorParam) {
        selectorParam.value = 0;
      }

      console.log("User audio playback paused at", formatTime(pausedAt));
    }

    function updatePlayButton() {
      if (isPlaying) {
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
      } else {
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
      }
    }

    // Play button click handler
    playButton.addEventListener("click", () => {
      if (isPlaying) {
        stopAudio();
      } else {
        playAudio(pausedAt);
      }
    });

    // Loop toggle handler
    loopToggle.addEventListener("change", () => {
      shouldLoop = loopToggle.checked;

      // Toggle visibility of loop controls
      loopRangeInputs.classList.toggle("active", shouldLoop);
      loopRegion.classList.toggle("active", shouldLoop);
      loopHandleStart.classList.toggle("active", shouldLoop);
      loopHandleEnd.classList.toggle("active", shouldLoop);

      // Initialize loop end to audio duration if not set
      if (shouldLoop && loopEnd === 0 && audioDuration > 0) {
        loopEnd = audioDuration;
        loopEndInput.value = formatTime(loopEnd);
        updateLoopRegionUI();
      }

      // Note: We no longer use audioSourceNode.loop - we handle it manually
      console.log("Loop:", shouldLoop ? "enabled" : "disabled");
    });

    // Loop start input handler
    loopStartInput.addEventListener("change", () => {
      const time = parseTime(loopStartInput.value);
      if (time !== null && time >= 0 && time < loopEnd) {
        loopStart = time;
        updateLoopRegionUI();
      } else {
        loopStartInput.value = formatTime(loopStart);
      }
    });

    // Loop end input handler
    loopEndInput.addEventListener("change", () => {
      const time = parseTime(loopEndInput.value);
      if (time !== null && time > loopStart && time <= audioDuration) {
        loopEnd = time;
        updateLoopRegionUI();
      } else {
        loopEndInput.value = formatTime(loopEnd);
      }
    });

    // Drag handlers for loop handles
    function handleDragStart(handle) {
      return (event) => {
        event.preventDefault();
        event.stopPropagation();
        isDraggingHandle = handle;
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
      };
    }

    function handleDragMove(event) {
      if (!isDraggingHandle || !audioDuration) return;

      const rect = progressBar.getBoundingClientRect();
      let percentage = (event.clientX - rect.left) / rect.width;
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

      // If the start handle was moved, start playing from the new loop start position
      if (wasStartHandle && uploadedAudioBuffer) {
        // Stop current playback if any
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
        // Start playback from the new loop start position
        playAudio(loopStart);
      }
    }

    loopHandleStart.addEventListener('mousedown', handleDragStart('start'));
    loopHandleEnd.addEventListener('mousedown', handleDragStart('end'));

    // Progress bar click handler for seeking
    progressBar.addEventListener("click", (event) => {
      if (!uploadedAudioBuffer) return;
      // Ignore clicks on loop handles
      if (event.target.classList.contains('loop-handle')) return;

      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const seekTime = percentage * audioDuration;

      // Update UI
      progressFill.style.width = `${percentage * 100}%`;
      currentTimeDisplay.textContent = formatTime(seekTime);

      if (isPlaying) {
        // Seamlessly seek to new position without stopping audio
        // Stop old source node but keep RNBO in User Audio mode
        if (audioSourceNode) {
          // Remove onended handler to prevent it from triggering when we stop
          audioSourceNode.onended = null;
          audioSourceNode.stop();
          audioSourceNode.disconnect();
          audioSourceNode = null;
        }
        if (progressAnimationId) {
          cancelAnimationFrame(progressAnimationId);
          progressAnimationId = null;
        }

        // Create new source and start immediately (RNBO stays at mode 2)
        audioSourceNode = context.createBufferSource();
        audioSourceNode.buffer = uploadedAudioBuffer;
        audioSourceNode.loop = false; // We handle looping manually with loop start/end
        audioSourceNode.connect(userAudioGain);

        audioSourceNode.onended = () => {
          if (!shouldLoop && isPlaying) {
            isPlaying = false;
            pausedAt = 0;
            updatePlayButton();
            progressFill.style.width = "0%";
            currentTimeDisplay.textContent = "0:00";
            if (progressAnimationId) {
              cancelAnimationFrame(progressAnimationId);
              progressAnimationId = null;
            }
            if (selectorParam) {
              selectorParam.value = 0;
            }
          }
        };

        startTime = context.currentTime;
        pausedAt = seekTime;
        audioSourceNode.start(0, seekTime);
        updateProgress();
        console.log("Seeked to", formatTime(seekTime));
      } else {
        pausedAt = seekTime;
      }
    });
  }

/* function makeSliders(device) {
    let pdiv = document.getElementById("rnbo-parameter-sliders");
    let noParamLabel = document.getElementById("no-param-label");
    if (noParamLabel && device.numParameters > 0) pdiv.removeChild(noParamLabel);

    // This will allow us to ignore parameter update events while dragging the slider.
    let isDraggingSlider = false;
    let uiElements = {};

    let deviceParameters = device.parameters;

    device.parameters.forEach(param => {
        // Subpatchers also have params. If we want to expose top-level
        // params only, the best way to determine if a parameter is top level
        // or not is to exclude parameters with a '/' in them.
        // You can uncomment the following line if you don't want to include subpatcher params
        
        //if (param.id.includes("/")) return;

        // Create a label, an input slider and a value display
        let label = document.createElement("label");
        let slider = document.createElement("input");
        let text = document.createElement("input");
        let sliderContainer = document.createElement("div");
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(text);

        // Add a name for the label
        label.setAttribute("name", param.name);
        label.setAttribute("for", param.name);
        label.setAttribute("class", "param-label");
        label.textContent = `${param.name}: `;

        // Make each slider reflect its parameter
        slider.setAttribute("type", "range");
        slider.setAttribute("class", "param-slider");
        slider.setAttribute("id", param.id);
        slider.setAttribute("name", param.name);
        slider.setAttribute("min", param.min);
        slider.setAttribute("max", param.max);
        if (param.steps > 1) {
            slider.setAttribute("step", (param.max - param.min) / (param.steps - 1));
        } else {
            slider.setAttribute("step", (param.max - param.min) / 1000.0);
        }
        slider.setAttribute("value", param.value);

        // Make a settable text input display for the value
        text.setAttribute("value", param.value.toFixed(1));
        text.setAttribute("type", "text");

        // Make each slider control its parameter
        slider.addEventListener("pointerdown", () => {
            isDraggingSlider = true;
        });
        slider.addEventListener("pointerup", () => {
            isDraggingSlider = false;
            slider.value = param.value;
            text.value = param.value.toFixed(1);
        });
        slider.addEventListener("input", () => {
            let value = Number.parseFloat(slider.value);
            param.value = value;
        });

        // Make the text box input control the parameter value as well
        text.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                let newValue = Number.parseFloat(text.value);
                if (isNaN(newValue)) {
                    text.value = param.value;
                } else {
                    newValue = Math.min(newValue, param.max);
                    newValue = Math.max(newValue, param.min);
                    text.value = newValue;
                    param.value = newValue;
                }
            }
        });

        // Store the slider and text by name so we can access them later
        uiElements[param.id] = { slider, text };

        // Add the slider element
        pdiv.appendChild(sliderContainer);
    });

    // Listen to parameter changes from the device
    device.parameterChangeEvent.subscribe(param => {
        if (!isDraggingSlider)
            uiElements[param.id].slider.value = param.value;
        uiElements[param.id].text.value = param.value.toFixed(1);
    });
}
*/

/* function makeInportForm(device) {
    const idiv = document.getElementById("rnbo-inports");
    const inportSelect = document.getElementById("inport-select");
    const inportText = document.getElementById("inport-text");
    const inportForm = document.getElementById("inport-form");
    let inportTag = null;
    
    // Device messages correspond to inlets/outlets or inports/outports
    // You can filter for one or the other using the "type" of the message
    const messages = device.messages;
    const inports = messages.filter(message => message.type === RNBO.MessagePortType.Inport);

    if (inports.length === 0) {
        idiv.removeChild(document.getElementById("inport-form"));
        return;
    } else {
        idiv.removeChild(document.getElementById("no-inports-label"));
        inports.forEach(inport => {
            const option = document.createElement("option");
            option.innerText = inport.tag;
            inportSelect.appendChild(option);
        });
        inportSelect.onchange = () => inportTag = inportSelect.value;
        inportTag = inportSelect.value;

        inportForm.onsubmit = (ev) => {
            // Do this or else the page will reload
            ev.preventDefault();

            // Turn the text into a list of numbers (RNBO messages must be numbers, not text)
            const values = inportText.value.split(/\s+/).map(s => parseFloat(s));
            
            // Send the message event to the RNBO device
            let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, inportTag, values);
            device.scheduleEvent(messageEvent);
        }
    }
}
*/

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
  
function sendMessageToInport(device, inportTag, values) {
    // Turn the text into a list of numbers (RNBO messages must be numbers, not text)
    const messsageValues = values.split(/\s+/).map((s) => parseFloat(s));
  
    // Send the message event to the RNBO device
    let messageEvent = new RNBO.MessageEvent(
      RNBO.TimeNow,
      inportTag,
      messsageValues
    );
    device.scheduleEvent(messageEvent);
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

/* function loadPresets(device, patcher) {
    let presets = patcher.presets || [];
    if (presets.length < 1) {
        document.getElementById("rnbo-presets").removeChild(document.getElementById("preset-select"));
        return;
    }

    document.getElementById("rnbo-presets").removeChild(document.getElementById("no-presets-label"));
    let presetSelect = document.getElementById("preset-select");
    presets.forEach((preset, index) => {
        const option = document.createElement("option");
        option.innerText = preset.name;
        option.value = index;
        presetSelect.appendChild(option);
    });
    presetSelect.onchange = () => device.setPreset(presets[presetSelect.value].preset);
}
*/

/* function makeMIDIKeyboard(device) {
    let mdiv = document.getElementById("rnbo-clickable-keyboard");
    if (device.numMIDIInputPorts === 0) return;

    mdiv.removeChild(document.getElementById("no-midi-label"));

    const midiNotes = [49, 52, 56, 63];
    midiNotes.forEach(note => {
        const key = document.createElement("div");
        const label = document.createElement("p");
        label.textContent = note;
        key.appendChild(label);
        key.addEventListener("pointerdown", () => {
            let midiChannel = 0;

            // Format a MIDI message paylaod, this constructs a MIDI on event
            let noteOnMessage = [
                144 + midiChannel, // Code for a note on: 10010000 & midi channel (0-15)
                note, // MIDI Note
                100 // MIDI Velocity
            ];
        
            let noteOffMessage = [
                128 + midiChannel, // Code for a note off: 10000000 & midi channel (0-15)
                note, // MIDI Note
                0 // MIDI Velocity
            ];
        
            // Including rnbo.min.js (or the unminified rnbo.js) will add the RNBO object
            // to the global namespace. This includes the TimeNow constant as well as
            // the MIDIEvent constructor.
            let midiPort = 0;
            let noteDurationMs = 250;
        
            // When scheduling an event to occur in the future, use the current audio context time
            // multiplied by 1000 (converting seconds to milliseconds) for now.
            let noteOnEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000, midiPort, noteOnMessage);
            let noteOffEvent = new RNBO.MIDIEvent(device.context.currentTime * 1000 + noteDurationMs, midiPort, noteOffMessage);
        
            device.scheduleEvent(noteOnEvent);
            device.scheduleEvent(noteOffEvent);

            key.classList.add("clicked");
        });

        key.addEventListener("pointerup", () => key.classList.remove("clicked"));

        mdiv.appendChild(key);
    });
}
*/

setup();
