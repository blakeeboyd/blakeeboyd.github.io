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
    setupLow(device);
    setupLowMid(device);
    setupMid(device);
    setupMidHigh(device);
    setupHigh(device);
    setupVeryHigh(device);
    setupGain(device);
    setupAudioSource(device, context);

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
    filtersToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "filter",
        filtersToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", filtersToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "filter");
    filtersToggle.checked = toggleState.value === 1;
  }

  function setupLow(device) {
    const lowToggle = document.getElementById("low-toggle");
    lowToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "low",
        lowToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", lowToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "low");
    lowToggle.checked = toggleState.value === 1;
  }

  function setupLowMid(device) {
    const lowMidToggle = document.getElementById("lowMid-toggle");
    lowMidToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "lowMid",
        lowMidToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", lowMidToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "lowMid");
    lowMidToggle.checked = toggleState.value === 1;
  }

  function setupMid(device) {
    const midToggle = document.getElementById("mid-toggle");
    midToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "mid",
        midToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", midToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "mid");
    midToggle.checked = toggleState.value === 1;
  }

  function setupMidHigh(device) {
    const midHighToggle = document.getElementById("midHigh-toggle");
    midHighToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "midHigh",
        midHighToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", midHighToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "midHigh");
    midHighToggle.checked = toggleState.value === 1;
  }

  function setupHigh(device) {
    const highToggle = document.getElementById("high-toggle");
    highToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "high",
        highToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", highToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "high");
    highToggle.checked = toggleState.value === 1;
  }
  
  function setupVeryHigh(device) {
    const veryHighToggle = document.getElementById("veryHigh-toggle");
    veryHighToggle.onclick = () => {
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "veryHigh",
        veryHighToggle.checked ? [1] : [0]
      );
      device.scheduleEvent(messageEvent);
      //OR
      // sendMessageToInport(device, "audioFile_loop", veryHighToggle.checked ? "1" : "0");
    };
    const toggleState = getParameter(device, "veryHigh");
    veryHighToggle.checked = toggleState.value === 1;
  }

  function setupGain(device) {
    const gainSlider = document.getElementById("gain-slider");
    const gainValue = document.getElementsByClassName("gain-text")[0];
    gainSlider.value = -12;
    gainValue.innerHTML = -12;

    gainSlider.oninput = function () {
      gainValue.innerHTML = Math.round(this.value);
      // sendMessageToInport(
      //   device,
      //   "track_one_volume",
      //   (this.value * 100).toString()
      // );
      // OR
      const gainParam = getParameter(device, "gain");
      gainParam.value = this.value;
    };
  }

  function setupAudioSource(device, context) {
    // DOM elements
    const sourceSelector = document.getElementById("source-selector");
    const fileInput = document.getElementById("audio-file-input");
    const fileInfo = document.getElementById("audio-file-info");
    const fileName = document.getElementById("audio-file-name");
    const fileDuration = document.getElementById("audio-file-duration");
    const playbackControls = document.getElementById("playback-controls");
    const playButton = document.getElementById("play-button");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const loopToggle = document.getElementById("loop-toggle");

    // Audio playback state
    let uploadedAudioBuffer = null;
    let audioSourceNode = null;
    let isPlaying = false;
    let shouldLoop = false;

    // Get the audio source selector parameter
    const selectorParam = getParameter(device, "audioFile_selector");

    // Initialize selector from RNBO parameter
    if (selectorParam) {
      sourceSelector.value = selectorParam.value;
    }

    // Handle source selection change
    sourceSelector.addEventListener("change", () => {
      const value = parseInt(sourceSelector.value, 10);

      // Send message to RNBO
      const messageEvent = new RNBO.MessageEvent(
        RNBO.TimeNow,
        "audioFile_selector",
        [value]
      );
      device.scheduleEvent(messageEvent);

      // Also update the parameter directly
      if (selectorParam) {
        selectorParam.value = value;
      }

      // Stop any playing user audio when switching away from user audio
      if (value !== 2 && isPlaying) {
        stopAudio();
      }

      console.log("Audio source changed to:", ["Mute", "Pink Noise", "User Audio"][value]);
    });

    // Handle file upload
    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("audio/")) {
        console.error("Please select an audio file");
        return;
      }

      try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Decode audio data
        uploadedAudioBuffer = await context.decodeAudioData(arrayBuffer);

        // Calculate duration in seconds
        const durationSec = uploadedAudioBuffer.duration;

        // Format duration display (MM:SS)
        const minutes = Math.floor(durationSec / 60);
        const seconds = Math.floor(durationSec % 60);
        const durationFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Update UI
        fileName.textContent = file.name;
        fileDuration.textContent = durationFormatted;
        fileInfo.classList.remove("hidden");
        playbackControls.classList.remove("hidden");

        // Log info for debugging
        console.log("Audio file loaded:", file.name);
        console.log("Duration:", durationFormatted);
        console.log("Sample rate:", uploadedAudioBuffer.sampleRate);
        console.log("Channels:", uploadedAudioBuffer.numberOfChannels);

        // Auto-select "User Audio" source when file is uploaded
        sourceSelector.value = "2";
        sourceSelector.dispatchEvent(new Event("change"));

      } catch (error) {
        console.error("Error decoding audio file:", error);
      }
    });

    // Play/Stop button handler
    function playAudio() {
      if (!uploadedAudioBuffer) return;

      // Resume audio context if suspended
      if (context.state === "suspended") {
        context.resume();
      }

      // Create a new buffer source node
      audioSourceNode = context.createBufferSource();
      audioSourceNode.buffer = uploadedAudioBuffer;
      audioSourceNode.loop = shouldLoop;

      // Connect to the RNBO device's signal input
      // The device.node has inputs we can connect to
      audioSourceNode.connect(device.node);

      // Handle playback ended
      audioSourceNode.onended = () => {
        if (!shouldLoop) {
          isPlaying = false;
          updatePlayButton();
        }
      };

      audioSourceNode.start();
      isPlaying = true;
      updatePlayButton();
      console.log("User audio playback started");
    }

    function stopAudio() {
      if (audioSourceNode) {
        audioSourceNode.stop();
        audioSourceNode.disconnect();
        audioSourceNode = null;
      }
      isPlaying = false;
      updatePlayButton();
      console.log("User audio playback stopped");
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
        playAudio();
      }
    });

    // Loop toggle handler
    loopToggle.addEventListener("change", () => {
      shouldLoop = loopToggle.checked;
      if (audioSourceNode) {
        audioSourceNode.loop = shouldLoop;
      }
      console.log("Loop:", shouldLoop ? "enabled" : "disabled");
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
    if (outports.length < 1) {
        document.getElementById("rnbo-console").removeChild(document.getElementById("rnbo-console-div"));
        return;
    }

    document.getElementById("rnbo-console").removeChild(document.getElementById("no-outports-label"));
    device.messageEvent.subscribe((ev) => {

        // Ignore message events that don't belong to an outport
        if (outports.findIndex(elt => elt.tag === ev.tag) < 0) return;

        // Message events have a tag as well as a payload
        console.log(`${ev.tag}: ${ev.payload}`);

        document.getElementById("rnbo-console-readout").innerText = `${ev.tag}: ${ev.payload}`;
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
