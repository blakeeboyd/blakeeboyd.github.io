# Modular Browser DAW — Build Specification

## Project Overview

Build a browser-based DAW (Digital Audio Workstation) that exposes all audio routing as a visual modular patching environment. Unlike traditional DAWs that hide routing behind mixer views and track headers, this application requires the user to see and build all signal flow explicitly — connecting modules with virtual patch cables. Unlike a pure modular synth environment (e.g., VCV Rack), this must function as a real production DAW with full audio editing capabilities (splicing, time stretching, pitch shifting, multi-track alignment, etc.).

The core philosophy: the functionality of digital production tools, with the visibility of analog signal flow.

---

## Architecture Overview

The application has three major layers:

1. **Visual Patching UI** — a node-graph interface where users create, connect, and interact with modules
2. **AudioWorklet DSP Pipeline** — the real-time audio engine running on the Web Audio API's audio thread
3. **Module Library** — a standardized set of production modules (tracks, effects, routing, metering, generators, modulation)

### Tech Stack

- **Frontend framework**: React
- **Node graph UI**: React Flow (draggable nodes, connection handles, edge rendering, zoom/pan)
- **Audio engine**: Web Audio API with AudioWorklet for custom DSP
- **DSP acceleration**: WebAssembly (compiled from Rust, C++, or Faust) for performance-critical modules
- **Waveform rendering**: HTML Canvas
- **State management**: Centralized store (Zustand or Redux) holding the abstract graph as source of truth

---

## Layer 1: Visual Patching UI

### Graph Architecture — State-Driven (Not Direct-Coupled)

The visual graph must NOT directly call Web Audio's `.connect()` and `.disconnect()`. Instead, implement a **state-driven architecture**:

- Maintain an **abstract graph data structure** (nodes and edges) as the single source of truth
- The visual UI is a rendering of this abstract graph
- The Web Audio engine is a separate downstream rendering of the same abstract graph
- A **reconciler** watches for graph state changes and builds/tears down actual audio connections to match

This architecture enables:
- Undo/redo (push/pop operations on the graph state)
- Serialization (save/load patches as JSON)
- Connection validation (prevent illegal connections before they reach the audio engine)
- Visual states for pending, invalid, or preview connections

### Node Graph Implementation (React Flow)

Use React Flow as the node graph framework. Justification: modules need rich UIs inside them (knobs, sliders, meters, waveform displays), and having those be React components is essential. A canvas-based approach would require reimplementing all widget rendering.

Each module in the graph is a React Flow node. Edges (cables) are React Flow edges with custom styling.

### Node Anatomy (Consistent Across All Modules)

Every module node must follow this visual structure:

- **Header**: Module name and type indicator (color-coded by category)
- **Left edge**: Input ports (audio inputs and parameter/CV inputs)
- **Right edge**: Output ports
- **Body**: Module-specific controls (knobs, sliders, buttons, small visualizations)
- **Footer** (optional): Level meter or status indicator

### Port System — Three Connection Types

Ports must be visually and functionally distinguished by type:

1. **Audio-rate signals** (the sound path)
   - Thicker cables, darker color
   - Maps to Web Audio's `nodeA.connect(nodeB)`
   - Carries the actual audio signal

2. **Parameter/CV connections** (modulation and control)
   - Thinner cables, color-coded
   - Maps to Web Audio's `nodeA.connect(nodeB.someAudioParam)`
   - Used for modulation (e.g., LFO → filter cutoff)

3. **MIDI / Event data**
   - Distinct visual style (dashed or dotted)
   - Does NOT go through the Web Audio graph
   - Routed through the application state layer
   - Carries note, velocity, CC data

The connection system must enforce type safety — audio ports can only connect to audio ports, parameter ports to parameter ports, etc. Show visual feedback (red highlight, tooltip) when the user attempts an invalid connection.

### Cable Rendering and Visualization

- **Bezier curves** for all cables (React Flow default, customize curvature based on distance)
- **Directional animation**: Subtle moving dash pattern or particle flow showing signal direction
- **Signal-level visualization**: Cables carrying louder signals glow brighter (requires reading signal levels from the audio thread via SharedArrayBuffer and applying to cable opacity/color)
- **Color coding**: By signal type (audio vs. parameter vs. MIDI), with optional user-defined colors

### Spaghetti Management

Implement mitigation strategies for complex patches:
- Per-connection show/hide toggle
- "Tidy" function that reroutes cables to minimize visual crossings
- User-assignable cable colors
- Optional **matrix view** as an alternative to cable view (a grid showing connections as cells, like a mixer routing matrix)

### Connection Validation

Intercept invalid connections at the abstract graph level:
- Output-to-output connections: block with visual feedback
- Feedback loops: detect cycles in the graph. If a loop lacks a `DelayNode`, either auto-insert a single-sample delay or warn the user with an explanation of why feedback loops require delay
- Type mismatches: prevent audio-to-MIDI connections, etc.

### Serialization and Session Management

The abstract graph state serializes to JSON:
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "track",
      "position": { "x": 100, "y": 200 },
      "parameters": { "gain": 0.8, "pan": 0.0 },
      "moduleState": { }
    }
  ],
  "edges": [
    {
      "source": "node-1",
      "sourcePort": "audio-out",
      "target": "node-2",
      "targetPort": "audio-in",
      "type": "audio"
    }
  ],
  "transport": { "bpm": 120, "timeSignature": "4/4" }
}
```

Enable:
- Save/load sessions
- Shareable patches (export as JSON or URL-encoded string)
- Preset patch library demonstrating signal flow concepts (subtractive synthesis chain, parallel compression, mid-side processing, etc.)

### UI Performance

- Throttle meter/visualization updates to 15–20fps
- Only update visuals for nodes visible in the viewport (React Flow provides viewport info)
- For graphs with 100+ visible cables, consider hybrid rendering: Canvas for cables, DOM for nodes

---

## Layer 2: AudioWorklet DSP Pipeline

### AudioWorklet Architecture

The Web Audio API processes audio on a dedicated real-time thread. Custom DSP runs inside `AudioWorkletProcessor` subclasses.

**Registration flow:**
1. Call `audioContext.audioWorklet.addModule('processor.js')` to load processor code onto the audio thread
2. Create nodes with `new AudioWorkletNode(audioContext, 'processor-name')`
3. The processor's `process()` method is called every 128 samples (~2.9ms at 44.1kHz)

**Critical constraint**: The processor scope is sandboxed — no DOM access, no `window`, no `fetch`. It is a pure real-time DSP environment.

### Processor Interface Contract

Every module's AudioWorklet processor must follow a consistent pattern:

```javascript
class ModuleProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'gain', defaultValue: 1.0, minValue: 0.0, maxValue: 2.0, automationRate: 'k-rate' },
      { name: 'frequency', defaultValue: 440, minValue: 20, maxValue: 20000, automationRate: 'a-rate' }
    ];
  }

  constructor(options) {
    super();
    // ALL memory allocation happens here — pre-allocate buffers, state, WASM instances
    this.port.onmessage = (e) => this.handleMessage(e.data);
  }

  process(inputs, outputs, parameters) {
    // REAL-TIME SAFE: No allocation, no GC triggers, no console.log, no message posting per block
    // Pure computation over pre-allocated buffers
    return true; // return true to keep processing
  }
}
```

**Parameter automation rates:**
- `a-rate` (per-sample, 128 values per block): Use for parameters needing smooth modulation (filter cutoff, oscillator frequency)
- `k-rate` (one value per block): Use for infrequently adjusted parameters (wet/dry mix, on/off states). Saves CPU.

### Thread Communication — Three Channels

Implement all three communication mechanisms:

**1. AudioParam (for continuous control)**
- When the user turns a knob: `node.parameters.get('frequency').value = 440`
- For smooth transitions: `param.linearRampToValueAtTime(880, audioContext.currentTime + 0.1)`
- For module-to-module modulation: `sourceNode.connect(destNode.parameters.get('cutoff'))`
- This is sample-accurate and native to the engine

**2. MessagePort (for configuration)**
- Loading sample buffers into a module
- Changing mode settings (filter type, waveform shape)
- Sending reset/initialization commands
- Asynchronous, goes through event loop — NOT for per-frame data

**3. SharedArrayBuffer (for visualization data)**
- Allocate a shared buffer on the main thread
- Pass it to the processor via MessagePort during initialization
- Processor writes peak/RMS levels, FFT data into the buffer every block
- UI reads from the buffer on `requestAnimationFrame` at 15–20fps
- **Requires lock-free data structures** (ring buffers) to avoid race conditions
- **Requires cross-origin isolation headers** on the server:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

### WebAssembly Integration

For performance-critical DSP, compile native code to WASM and run it inside AudioWorklet processors.

**Pipeline:**
1. Write DSP in Rust, C++, or Faust
2. Compile to `.wasm` binary (Emscripten for C/C++, wasm-pack for Rust, Faust compiler for Faust)
3. Load the WASM binary into the AudioWorklet processor
4. In `process()`: copy input samples into WASM memory → call WASM processing function → copy output samples back

The copy overhead is minimal for 128-sample blocks. WASM achieves roughly 60–80% of native performance.

**Faust** is particularly well-suited for a module library. It's a functional DSP language with excellent Web Audio integration and a large standard library. Example: `process = fi.lowpass(2, freq)` compiles to an optimized biquad filter as WASM.

**RNBO** (Cycling '74) can export Web Audio-compatible code, enabling module design in Max/MSP and deployment as browser modules.

### Real-Time Safety Rules

The `process()` method must NEVER:
- Allocate memory (`new`, array creation)
- Trigger garbage collection
- Call `console.log` (can block)
- Post messages on every block (only occasionally)
- Perform any I/O

All buffers and state must be pre-allocated in the constructor.

### Signal Flow and Processing Order

Web Audio processes in 128-sample blocks using a **pull model** — the graph is evaluated from outputs back to inputs. Processing order is determined by the connection topology, not by explicit scheduling. Key implications:
- Disconnected modules are automatically dormant (zero CPU cost)
- Modules used only for visualization (e.g., spectrum analyzer not in the audio path) must be connected to something — even a zero-gain node feeding the destination — to ensure they process
- Series of modules within the same block cycle do NOT add latency (latency only comes from explicit DelayNodes)

### Latency

- Block size: 128 samples (~2.9ms at 44.1kHz)
- Typical total I/O latency: 10–25ms (browser adds 1–2 additional buffer blocks)
- Request lower latency with `new AudioContext({ latencyHint: 'interactive' })`
- Consider visualizing cumulative latency along signal paths in the UI (educational feature)

### Channel Limitations

- Web Audio supports up to 32 channels per AudioNode in Chrome
- Actual hardware output is limited by OS audio subsystem
- For stereo production, this is not a limitation
- For multichannel/spatial audio work, this becomes a constraint

### Mono/Stereo Channel Handling Rules

The spec must define explicit rules for what happens when signals of different channel counts meet, and these rules must be visible in the UI.

**Channel count at every port:**
Every port on every module displays its channel count — either as a label ("mono" / "stereo") or a visual indicator (single circle for mono, double circle for stereo). Cables should also reflect channel count (thinner for mono, thicker for stereo, or a "1" / "2" label near the connection point).

**Conversion rules:**
- **Mono → Stereo input**: The mono signal is duplicated to both left and right channels. This is Web Audio's default `channelInterpretation: "speakers"` behavior. The UI should indicate this is happening — a small "M→S" badge on the cable or input port.
- **Stereo → Mono input**: The left and right channels are summed and scaled by 0.5 (averaged). Show an "S→M" badge. This is important for students to understand — summing to mono can cause phase cancellation, and they should be aware it's happening.
- **Mismatched multi-channel**: For channel counts beyond stereo, use Web Audio's `channelCountMode` and `channelInterpretation` defaults, but display warnings for unexpected conversions.

**Module channel configuration:**
Each module's manifest declares whether it processes in mono, stereo, or adapts to its input (`channelCountMode: "explicit"` vs. `"max"` vs. `"clamped-max"`). The module header or a small indicator shows the module's current operating channel count.

**Educational value:**
In Learn Mode, hovering over a connection between a mono source and stereo destination should explain: "This mono signal is being copied to both the left and right channels. Both channels will contain identical audio (centered in the stereo field)."

---

## Layer 3: Module Library

### Module Manifest Contract

Every module — regardless of type — is defined by a manifest:

```typescript
interface ModuleManifest {
  id: string;                    // unique identifier
  name: string;                  // display name
  category: ModuleCategory;      // 'track' | 'effect' | 'routing' | 'metering' | 'generator' | 'modulation' | 'utility'
  description: string;

  audio: {
    inputs: PortDefinition[];    // { name, channels: 'mono' | 'stereo' | 'sidechain' }
    outputs: PortDefinition[];
    parameters: ParamDefinition[]; // { name, min, max, default, unit, automationRate }
  };

  ui: {
    compactControls: string[];   // controls shown in graph view
    expandedControls: string[];  // controls shown in detail view
    visualizations: string[];    // 'waveform' | 'spectrum' | 'meter' | 'transfer-curve' | 'eq-curve'
  };

  processor: {
    type: 'worklet' | 'native' | 'wasm';
    source: string;              // path to processor code or WASM binary
    latencySamples: number;      // processing latency in samples (0 for most modules, nonzero for lookahead/linear-phase — used by PDC)
  };

  documentation?: {
    summary: string;             // one-line description for tooltips
    explanation: string;         // longer explanation for "About" panel
    useCases: string[];          // typical use cases
  };

  soloSafe?: boolean;            // if true, module stays audible when other tracks are soloed (default: false, typically true for effect buses and master output)
}
```

This manifest drives everything:
- The graph UI reads it to determine port count and layout
- The parameter system reads it to auto-generate knobs with correct ranges
- The serialization system reads it to save/restore state
- User-created modules follow the same contract

---

### Track Module (Most Complex — The Core Production Unit)

The track module is what makes this a DAW, not a patching toy. It is a module node in the graph that contains a full audio editor.

#### Two Visual States

**Graph view (compact):** Standard module node with audio output ports, small waveform thumbnail, transport controls (play/stop/record), solo and mute buttons, and a volume meter. Routes its output into effects, buses, etc.

#### Solo and Mute

Every track module must have **Solo** (S) and **Mute** (M) buttons, prominently placed in the compact graph view.

**Mute behavior:**
- Muted modules silence their output and are visually dimmed (grayed-out header, faded waveform)
- Muting should disconnect the module's output from the audio graph to save CPU, not just set gain to zero
- Muting a module also mutes any module exclusively downstream of it (if a reverb only receives input from a muted track, it should go silent too — but only if ALL its inputs are muted)

**Solo behavior:**
- Solo mutes all other track modules except the soloed one(s)
- **Additive solo** (default): Shift-click solo to solo multiple tracks simultaneously. Clicking solo without shift toggles solo on that track only, without un-soloing others
- **Exclusive solo** (optional mode): Clicking solo on one track un-solos all others
- **Solo-safe**: Certain modules (typically effect buses, reverb returns, the master output) can be marked "solo-safe" via right-click → "Solo Safe." Solo-safe modules remain audible when other tracks are soloed, so you hear the soloed track through its effects chain rather than completely dry
- Solo state is indicated by a highlighted S button and a visual emphasis on the module (brighter, while non-soloed modules dim)

**Solo/Mute in the modular context:**
Since routing is user-built, the solo system must trace the signal graph. When track A is soloed, the system must identify all modules downstream of track A (its effects, buses, the master output) and keep them active, while muting all track modules that are NOT soloed and are NOT solo-safe. This requires a graph traversal at solo time.

**Editor view (expanded):** When the user double-clicks or focuses a track module, a waveform editor panel appears (as a bottom/side panel, not replacing the graph). This panel provides full editing capabilities:

- Waveform display with zoom and scroll
- Region selection (click-drag)
- Cut, copy, paste, delete
- Splice / split at playhead
- Crossfade between adjacent regions
- Time stretching (with visual feedback showing stretch ratio)
- Pitch shifting
- Trim / crop
- Snap to grid (beat-aligned editing)
- Fade in / fade out (draggable fade handles)

#### Multi-Track Editing

When multiple track modules are selected in the graph (shift-click or marquee select), their editors open simultaneously in the panel, stacked vertically with a **shared timeline and playhead**. This provides multi-track alignment capability — users can see how regions line up across tracks, select across tracks, and move content to the same time point — without a permanent linear track layout. The graph is home base; the timeline editor is an on-demand tool.

#### Non-Destructive Editing (Edit Decision List)

Every edit is an operation on a region list, NOT a mutation of the underlying audio data. The track module internally maintains an **Edit Decision List (EDL)**:

```typescript
interface Region {
  id: string;                    // unique identifier
  name: string;                  // display name (defaults to source file name)
  color?: string;                // user-assignable color
  sourceBuffer: AudioBuffer;
  sourceOffset: number;       // start position in source
  duration: number;            // length of region
  position: number;            // position on timeline
  gain: number;
  fadeIn: number;              // fade duration in samples
  fadeOut: number;
  pitchShift: number;          // in semitones
  timeStretch: number;         // ratio (1.0 = original speed)
  microCrossfade: number;      // auto-crossfade duration at edit boundaries in samples (default: ~220 / 5ms)
}

interface TrackState {
  regions: Region[];
  edlHistory: Region[][];      // undo stack
  overlapMode: 'layer' | 'crossfade' | 'overwrite' | 'ripple';  // current collision behavior
}
```

The AudioWorklet processor reads this EDL and plays back accordingly. Undo/redo is pushing and popping the EDL stack.

#### Region Overlap and Collision Behavior

The spec must define what happens when a user drags a region on top of another region on the same track. Provide selectable behavior modes in the waveform editor toolbar:

- **Layer (default)**: Both regions play simultaneously in the overlap zone — their audio is summed. The overlapping area is visually indicated with a crosshatch pattern or color blend. This is the most non-destructive option.
- **Crossfade**: Overlapping regions automatically create a crossfade in the overlap zone. The earlier region fades out while the later region fades in. Crossfade length equals the overlap length. The user can adjust the crossfade curve after placement.
- **Overwrite**: The incoming (moved/pasted) region replaces the content underneath. Existing regions are trimmed or split to accommodate. No audio plays from the overwritten portions.
- **Ripple**: Moving or inserting a region pushes all subsequent regions on the same track forward in time by the duration of the inserted region. Deleting a region pulls all subsequent regions backward. This maintains relative spacing between regions.

The active mode should be clearly indicated in the editor toolbar. Regardless of mode, all operations are non-destructive (original region data is preserved, only the EDL changes).

#### Click/Pop Prevention at Edit Points

When audio is sliced, the cut point may fall at a non-zero sample crossing, producing an audible click or pop. The system must automatically handle this:

**Automatic micro-crossfades:**
- At every edit boundary (splice, region start, region end), automatically apply a very short crossfade: 2-5ms (approximately 100-220 samples at 44.1kHz)
- The micro-crossfade fades the outgoing audio to zero and fades the incoming audio from zero over this short duration
- At splice points within a continuous piece of audio, crossfade between the two sides
- These micro-crossfades are invisible at normal zoom levels but visible at extreme zoom (showing the tiny fade curve)
- They are applied in the AudioWorklet playback processor, not baked into the audio data

**User override:**
- Users can disable auto-crossfade on a per-edit-point basis if they specifically want a hard cut (rare, but useful for glitch effects or sample-accurate editing)
- The default crossfade duration should be configurable in preferences (default: 5ms)

#### Time Stretching and Pitch Shifting

- Use WASM-compiled algorithms for real-time playback (phase vocoder at minimum; Rubber Band library or SoundTouch if license allows)
- For preview: apply changes destructively to a preview buffer for visual feedback, but keep original source and parameters for reversibility
- Display stretch ratio and pitch offset visually on affected regions

#### Transport and Synchronization

A **master transport** (either a dedicated module or a global system feature) broadcasts position and tempo to all track modules:
- All track module processors advance playback position in lockstep
- `audioContext.currentTime` is the master clock
- Tempo-synced effects (delays, LFOs) lock to this same clock
- Transport controls: play, stop, record, loop, metronome

#### Timeline Overview Module

An optional special module that displays a miniature arrangement view of all track modules — a bird's-eye timeline showing where regions sit across all tracks. Purely visual, no audio processing. Provides temporal context without leaving the graph view.

---

### Effect Modules

Each effect is a node with audio inputs, audio outputs, and parameter controls.

#### Dynamics
- **Compressor**: With real-time gain reduction visualization — show the transfer curve and a moving dot representing current input/output level. Parameters: threshold, ratio, attack, release, makeup gain, knee.
- **Limiter**: Brick-wall limiter with lookahead. Show gain reduction meter.
- **Gate**: With threshold indicator on waveform. Parameters: threshold, attack, hold, release, range.
- **Expander**: Downward expander with adjustable ratio.
- **De-esser**: Frequency-targeted compressor with sidechain filter visualization.

#### EQ and Filters
- **Parametric EQ**: Multi-band (at least 4 bands) with draggable frequency response curve displayed in the module body. Each band has frequency, gain, Q, and type (peak, shelf, pass). Show composite frequency response updated live as the user drags handles.
- **High/Low Pass Filter**: With resonance (Q) control. Visualize cutoff point on a frequency response curve.
- **Shelving Filter**: High and low shelf with frequency and gain.
- **Notch Filter**: Narrow band rejection with frequency and Q.

#### Time-Based
- **Delay**: Simple, ping-pong, and multi-tap modes. Parameters: time, feedback, wet/dry, filter in feedback path. Tempo sync option.
- **Reverb**: Dual mode — convolution (with impulse response loading via file upload) AND algorithmic. Parameters vary by mode.
- **Chorus**: Built internally from a short modulated delay — or let the user build it themselves from an LFO + delay module to demonstrate the principle.
- **Flanger**: Similar to chorus with shorter delay times and feedback.
- **Phaser**: All-pass filter chain with LFO modulation.

#### Distortion and Saturation
- **Waveshaper**: With a **drawable transfer function curve** in the module UI. The user literally draws the waveshaping curve, which maps to a `WaveShaperNode` curve array. Exceptional teaching moment about nonlinear processing.
- **Bitcrusher**: Sample rate reduction and bit depth reduction. Parameters: bit depth, sample rate.
- **Tape Saturation**: Soft-clipping model with drive and tone controls.

#### Utility
- **Gain**: Simple level control with meter.
- **Stereo Pan**: Linear or equal-power panning law (selectable). Visualize the two gain curves.
- **Mono Sum**: Stereo to mono conversion.
- **Phase Invert**: Polarity flip with per-channel control.
- **DC Offset Removal**: High-pass filter at ~5Hz.

---

### Routing and Utility Modules

- **Mixer Module**: Multiple audio inputs summed to one output with per-input gain and pan. Teaches that a mixer is gain stages + summing.
- **Splitter**: One stereo input → two mono outputs (L and R). Also a general fan-out for duplicating a signal.
- **Merger**: Two mono inputs → one stereo output. Also a general summing node.
- **A/B Comparison Module**: Two inputs, one output, a toggle switch. Insert at the end of a chain to compare processed vs. dry.

Note: **Send/Return is implicit** in a modular system. Splitting a signal (connecting one output to multiple inputs) and routing copies through effects IS an aux send. The modular paradigm makes sends self-evident.

---

### Metering Modules

These are passthrough nodes — audio passes through unchanged, but visualization is displayed. They are essential for education (insert anywhere in the chain to see what the signal looks like at that point).

- **Level Meter**: Peak and RMS with configurable ballistics.
- **Spectrum Analyzer**: FFT-based frequency display (linear or log scale, various window functions).
- **Oscilloscope**: Time-domain waveform display.
- **Stereo Correlation Meter**: Phase correlation between L and R.
- **Loudness Meter**: LUFS measurement (integrated, short-term, momentary).

---

### Generator Modules

- **Oscillator**: Sine, square, saw, triangle, noise waveforms. Frequency control via knob or MIDI input. Useful for sound design, testing, and synthesis.
- **Sampler**: Load a sample, map across MIDI notes, trigger via WebMIDI or internal sequencer. This is an instrument, distinct from the track module.
- **Test Signal Generator**: Sine sweep, impulse, white noise, pink noise. Invaluable for frequency response testing and acoustic analysis.

---

### Modulation and Control Modules

- **LFO**: Sine, square, triangle, saw, sample-and-hold waveforms. Rate (free or tempo-synced), depth, phase. Output connects to any AudioParam on any module.
- **Envelope Generator**: ADSR or multi-stage envelope. Triggered by MIDI note-on or a gate signal. Connect to filter cutoff for subtractive synthesis demonstration.
- **Step Sequencer**: 16-step (expandable) grid in the module body. Outputs pitch and gate values. Tempo-synced to master transport.
- **MIDI Input Module**: Receives from WebMIDI API. Outputs note, velocity, CC data as parameter connections. Enables hardware controller integration.

---

### User-Created Modules

Provide a "Create Module" workflow:

1. User writes an AudioWorklet processor (or Faust code, or uploads WASM)
2. User defines a module manifest (JSON) specifying ports, parameters, UI layout
3. System validates and integrates the module into the palette
4. Module appears ready to patch like any built-in module

Provide template processors with boilerplate handled — the user fills in the DSP logic inside `process()`.

Enable a **module sharing system** — export/import modules as packages (processor code + manifest + optional WASM binary).

---

## Global Systems

### Master Transport

- Play, stop, pause, record
- BPM with tap tempo
- Time signature
- Loop region (with loop start/end markers)
- Metronome (with click output as a module output, so it can be routed and mixed)
- Song position in bars:beats:ticks and samples

### File Management

- Use **Origin Private File System (OPFS)** as primary storage for audio files and sessions
- **File System Access API** (Chromium) for import/export to local filesystem
- **IndexedDB** as fallback for session data and preferences
- Support drag-and-drop file import

### Audio Pool / Media Manager

A centralized panel showing all audio assets in the current session. Accessible from a menu or keyboard shortcut.

**For each audio file, display:**
- File name and original path
- Duration
- Sample rate (and whether it was resampled on import)
- Channel count (mono/stereo)
- Bit depth (of original file)
- Memory usage (buffer size in MB)
- Reference count — how many track modules/regions reference this file

**Actions:**
- **Remove Unused Audio**: Identify audio buffers with zero references (not used by any region on any track) and offer to delete them, freeing memory. This is critical in the browser where memory is limited.
- **Replace Audio**: Swap a source file with a different file across all regions that reference it (useful for updating a mix element without rebuilding the arrangement)
- **Locate / Reveal**: Show which track modules and regions reference a selected audio file
- **Import**: Add new audio files to the pool without placing them on any track
- **Export**: Save an individual audio file from the pool to the local filesystem

**Memory management:**
Display total audio memory usage at the bottom of the pool panel. Warn when approaching browser memory limits (typically 1-2GB for a single tab, varies by browser and device). Suggest freezing tracks or removing unused audio when memory is high.

### Audio I/O

- **Input**: MediaStream API for microphone/instrument input. Appears as an "Audio Input" module.
- **Output**: AudioContext destination. Appears as a "Master Output" module (always present, cannot be deleted).
- **Bounce/Export**: OfflineAudioContext for offline rendering to WAV/MP3. MediaRecorder API for real-time capture.

### Cross-Origin Isolation

The server MUST serve these headers for SharedArrayBuffer support:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

This affects loading of third-party resources — all external resources must support CORS or be self-hosted.

---

## Additional Systems

### Automation

Parameter automation must be a first-class feature, implemented as a module to maintain the modular philosophy.

**Automation Module**: A module type that outputs a time-varying control signal synced to the master transport. The user draws or records an automation curve inside the module's UI (similar to how the track module has a waveform editor, the automation module has a curve editor). The output patches into any parameter port on any module.

This keeps automation visible and explicit — rather than hidden lanes attached to tracks, automation is a module with a cable going to a specific parameter. A student can see that "this curve is controlling that filter's cutoff over time."

Features:
- Draw mode: click to create breakpoints, drag to shape curves (linear, exponential, S-curve interpolation between points)
- Record mode: arm the automation module, move the target knob during playback, and the automation curve is written in real time
- Loop/cycle recording: layer multiple passes, keep best take
- Snap breakpoints to grid (beat-aligned automation)
- Multiple automation lanes per module (one output per parameter being automated)

### Subpatching / Macro Modules

Users must be able to select a group of connected modules and collapse them into a single **macro module** node.

Implementation:
1. User selects multiple modules (marquee or shift-click)
2. "Create Macro" action encapsulates them into a single node
3. The macro node exposes the unconnected inputs and outputs of the internal modules as its own ports
4. The user can label these ports (e.g., "Audio In", "Sidechain", "Output")
5. Double-clicking the macro opens it, revealing the internal patch for editing
6. Macros can be saved as reusable templates ("Vocal Chain", "Drum Bus", "Sidechain Pump")

This is critical for:
- Managing complexity in large sessions
- Creating reusable signal chains
- Education — distribute a macro, have students open it and study the internal routing
- Nesting: macros can contain other macros

The internal patch is stored as a nested graph in the session JSON. The audio engine flattens macros into the main Web Audio graph (no performance overhead from the abstraction).

### Recording Workflow

The spec must support a complete recording pipeline:

**Input Monitoring**: When a track module is record-armed, route the audio input through the track's effect chain to the output in real time so the performer can hear themselves with processing. Manage latency by offering a "direct monitoring" option that bypasses the Web Audio graph where hardware supports it.

**Record Modes**:
- Normal: replace existing content from punch-in point
- Overdub/Layer: mix new recording with existing content
- Punch-in / Punch-out: automatically start and stop recording at defined timeline positions
- Loop recording: record multiple takes over a loop region, stack as layers or "takes" for comping

**Count-in**: Configurable count-in (1 bar, 2 bars, custom) with metronome before recording begins.

**Comping**: After loop recording multiple takes, provide a comping interface in the track editor where the user can select the best sections from each take and assemble a composite.

**Recording Latency Compensation:**
When recording through the browser's audio I/O pipeline, the recorded audio arrives late by the round-trip I/O latency. A vocalist singing in time with a beat will produce a recording shifted late by 10-25ms, causing it to sound behind the existing material.

The system must:
1. Measure total I/O latency at session start using `audioContext.outputLatency` and `audioContext.baseLatency`
2. When a recording is committed to the timeline, automatically nudge the recorded region backward (earlier) on the timeline by the measured latency amount
3. Display the compensation amount in the audio preferences or transport settings (e.g., "Recording latency compensation: -512 samples / -11.6ms")
4. Allow manual adjustment of the compensation offset for fine-tuning (some hardware introduces additional latency not reported by the browser)

Without this, every recording will be out of sync with existing material, which makes the tool unusable for overdubbing.

### Per-Module Presets

Every module supports saving and loading parameter presets independently of the session.

```typescript
interface ModulePreset {
  moduleType: string;          // must match the module manifest id
  name: string;
  author: string;
  tags: string[];              // e.g., ["vocal", "gentle", "mixing"]
  parameters: Record<string, number>;  // parameter name → value
  moduleState?: any;           // module-specific state (e.g., waveshaper curve, IR file reference)
}
```

Features:
- Save current module settings as a named preset
- Browse and load presets per module type
- Factory presets ship with each module (e.g., compressor ships with "Gentle Vocal", "Drum Smash", "Bus Glue")
- User presets stored in OPFS/IndexedDB
- Import/export presets as JSON for sharing

### Keyboard Shortcuts

Define a comprehensive shortcut map. DAW users depend on keyboard efficiency.

**Transport**:
- `Space` — Play / Stop
- `R` — Toggle record arm on selected track
- `Enter` — Return playhead to start
- `L` — Toggle loop mode
- `Cmd/Ctrl + .` — Toggle metronome

**Editing (in waveform editor panel)**:
- `Cmd/Ctrl + X` — Cut selection
- `Cmd/Ctrl + C` — Copy selection
- `Cmd/Ctrl + V` — Paste at playhead
- `Delete / Backspace` — Delete selection
- `Cmd/Ctrl + Z` — Undo
- `Cmd/Ctrl + Shift + Z` — Redo

**Navigation**:
- `Cmd/Ctrl + +/-` — Zoom in/out (timeline)
- `Scroll wheel` — Vertical scroll in editor panel
- `Shift + Scroll wheel` — Horizontal scroll (timeline)
- `H` — Fit entire session in view
- `,` / `.` — Jump to previous / next marker

**Graph**:
- `Cmd/Ctrl + A` — Select all modules
- `Cmd/Ctrl + G` — Group selected into macro
- `Cmd/Ctrl + D` — Duplicate selected module(s)
- `Delete / Backspace` — Delete selected modules (with confirmation if connected)
- `Tab` — Toggle between graph view and editor panel focus
- `N` — Open module palette / search

**Waveform Editor Tools**:
- `V` — Pointer / Select tool
- `T` — Trim / Resize tool
- `S` — Slice / Razor tool (also quick-access from any tool)
- `D` — Draw tool
- `Z` — Zoom tool
- `F` — Fade tool

Shortcuts should be user-remappable and discoverable via a `?` shortcut overlay.

### Sample Rate and Format Handling

**Session sample rate**: Defined at session creation (44100 or 48000 Hz). The `AudioContext` is instantiated at this rate.

**Import formats**: WAV, MP3, FLAC, OGG, AAC — `decodeAudioData()` handles these natively. If a format is unsupported, show a clear error.

**Sample rate conversion**: When an imported file's sample rate differs from the session rate, automatically resample on import using `OfflineAudioContext` or a WASM-based SRC (Secret Rabbit Code / libsamplerate compiled to WASM for higher quality). Store the converted buffer; keep a reference to the original file.

**Bit depth**: Internal processing is 32-bit float (Web Audio standard). On export, offer 16-bit, 24-bit, and 32-bit float WAV options, plus MP3 and OGG encoding (via WASM-compiled LAME or libvorbis).

**Export**: OfflineAudioContext renders the full graph offline at arbitrary speed. The entire modular graph is replayed through the offline context, producing the final mixdown.

### Error Recovery and Module Resilience

AudioWorklet processors can fail. The system must handle this gracefully:

**Detection**: Monitor each module's processing state. If a processor's `process()` method returns `false` (signaling it wants to stop), or throws an error, or becomes unresponsive (no output for N consecutive blocks), flag the module.

**Visual feedback**: Flagged modules display a red error indicator in the graph. The cable leaving the module dims or turns red.

**Isolation**: A failing module must NOT crash the entire audio engine. The Web Audio graph should continue processing around the failed node. Implement try/catch within processor wrappers where possible, and architect the graph so one failed node results in silence from that node, not a cascade failure.

**Recovery options**:
- "Reset Module" — re-instantiate the AudioWorkletNode and processor with the same parameters
- "Bypass Module" — route audio around the failed module (connect its upstream directly to its downstream)
- "Remove Module" — delete and reconnect surrounding graph
- "View Error" — show the error message/stack trace for debugging (especially useful for user-created modules)

**Auto-save**: Periodically save session state (every 30–60 seconds) to OPFS/IndexedDB so that a catastrophic failure doesn't lose work. On reload, offer to restore from the last auto-save.

### Plugin Delay Compensation (PDC)

When parallel signal paths converge at a summing point (e.g., dry signal + parallel compression bus), modules that introduce latency (lookahead limiters, linear-phase EQs, any module with internal delay) cause timing misalignment between paths.

**Strategy — Automatic Compensation:**
1. Each module's manifest declares its processing latency in samples (0 for most modules, nonzero for lookahead processors or linear-phase filters)
2. When the graph changes, analyze all paths from any source to any summing point
3. Identify parallel paths with latency mismatches
4. Automatically insert compensating delay on shorter paths to align them
5. Visualize this in the UI: show per-path latency labels at summing points, and indicate where compensation delay has been inserted (a small "PDC" badge on the auto-inserted delay)

**Fallback — Visual Warning:**
If automatic compensation is not yet implemented, at minimum display a warning icon at any summing point (mixer module, merger) where incoming paths have different cumulative latencies. Show a tooltip: "Path A: 512 samples, Path B: 0 samples — timing mismatch of 512 samples (~11.6ms at 44.1kHz)."

PDC must update dynamically as the user adds, removes, or rearranges modules.

### Freeze / Bounce-in-Place

Browser CPU is limited. Users must be able to freeze processing chains to reclaim resources.

**Freeze workflow:**
1. User right-clicks a track module and selects "Freeze"
2. The system renders the track through its entire downstream effect chain using `OfflineAudioContext`
3. The rendered audio replaces live processing — the track module plays back the frozen file directly
4. All effect modules in the chain are visually grayed out and their processors are disconnected (CPU freed)
5. The frozen track displays a rendered waveform with a "Frozen" indicator

**Unfreeze workflow:**
1. User right-clicks and selects "Unfreeze"
2. The frozen render is discarded, live processing chain is restored
3. All effect modules reconnect and resume processing

**Bounce-in-Place:**
Similar to freeze, but permanent — the rendered audio replaces the track's regions and the effect modules can be removed. Non-destructive in the sense that the original regions are saved to the undo history.

### Waveform Editor Tool Modes

The waveform editor panel must have a tool selector bar with distinct cursor modes:

- **Pointer / Select Tool** (V): Click to place playhead, click-drag to select a time range, click on regions to select and move them. Shift-click to add to selection.
- **Trim / Resize Tool** (T): Hover over region edges to get trim cursors. Drag edges to shorten or extend regions, revealing more or less of the underlying source audio.
- **Slice / Razor Tool** (S key for quick access): Click on a region to split it at that point. Alt-click to split across all visible tracks at that point.
- **Draw Tool** (D): For drawing volume automation directly on regions (clip gain envelopes), or for audio repair (pencil-redraw waveform samples at extreme zoom).
- **Zoom Tool** (Z): Click to zoom in, Alt-click to zoom out, click-drag to zoom to a specific region.
- **Fade Tool** (F): Drag from region edges to create fade-in or fade-out curves. Drag between adjacent regions to create crossfades. Click on existing fades to change curve shape (linear, exponential, S-curve, equal-power).

Display the active tool in the toolbar with a keyboard shortcut hint. Support quick-switch: holding a modifier key temporarily activates a different tool (e.g., hold Cmd for pointer while in slice mode).

### Markers, Regions, and Arrangement Structure

The master transport / timeline must support structural markers:

**Markers:**
- Drop named markers at any point on the timeline (e.g., "Verse 1", "Chorus", "Bridge")
- Navigate between markers with keyboard shortcuts (`,` / `.` for previous/next marker)
- Markers are visible in the waveform editor panel as flags above the timeline ruler
- Also visible in the Timeline Overview Module

**Arrangement Regions:**
- Define named, color-coded regions spanning a time range (e.g., green "Intro" from bar 1-8, blue "Verse" from bar 9-24)
- Regions appear as colored bars above the timeline ruler
- Enable "select all content in arrangement region" for quick editing
- Support rearranging song structure by moving arrangement regions (all content within the region moves with it)

**Marker data structure:**
```typescript
interface Marker {
  id: string;
  name: string;
  position: number;        // in samples or beats
  color?: string;
}

interface ArrangementRegion {
  id: string;
  name: string;
  start: number;
  end: number;
  color: string;
}
```

### Tempo Map and Time Signature Changes

Replace the single BPM value with a full **tempo map**:

```typescript
interface TempoEvent {
  position: number;           // in beats (or a beat-independent unit like ticks)
  bpm: number;
  curve: 'instant' | 'linear' | 'exponential';  // how to transition from previous tempo
}

interface TimeSignatureEvent {
  position: number;           // in beats
  numerator: number;
  denominator: number;
}

interface TempoMap {
  tempoEvents: TempoEvent[];           // at minimum one event at position 0
  timeSignatureEvents: TimeSignatureEvent[];
}
```

The tempo map affects:
- Grid snap positions (beats shift as tempo changes)
- Metronome click timing
- Tempo-synced modules (delays, LFOs, sequencers) — these must read from the tempo map, not a static BPM
- The timeline ruler display (bar/beat positions are non-uniform when tempo changes)
- Automation module curve display (breakpoints are in beats, but their real-time spacing changes with tempo)

Provide a **Tempo Editor** — either a dedicated module or a panel accessible from the transport bar — where users draw tempo curves and insert time signature changes.

### Educational / Contextual Help System

Given the educational mission, the application must include a layered help system:

**Tooltips (always available):**
- Hover over any port → tooltip showing port name, signal type, and what it does ("Audio Output — stereo signal after all processing")
- Hover over any cable → tooltip showing source and destination ("Oscillator 1 audio out → Filter 1 audio in")
- Hover over any parameter knob → tooltip showing parameter name, current value, range, and a one-line explanation ("Threshold: -18 dB — signals above this level are compressed")

**Learn Mode (toggle on/off):**
When enabled, the graph view adds educational annotations:
- Parallel signal paths are highlighted and labeled ("Parallel path — both receive the same input signal")
- Feedback loops are annotated ("Feedback loop — output feeds back to input through a delay, creating comb filtering")
- Modulation connections are explained ("This LFO is modulating the filter cutoff at 2 Hz, sweeping between 200 Hz and 2000 Hz")
- Signal flow direction is emphasized with animated arrows
- Summing points show "These N signals are being mixed together"

**Module documentation:**
Each module manifest includes a `documentation` field with a longer explanation of what the module does, how it works, and typical use cases. Accessible via a "?" button on each module or via right-click → "About This Module."

### Drag-and-Drop Interactions

**File import onto graph canvas:**
- Drag an audio file from desktop onto the empty graph canvas → create a new track module with that file loaded
- Drag onto an existing track module → add the file to that track's timeline at the current playhead position
- Drag onto a convolution reverb module → load as impulse response
- Drag onto a sampler module → load as sample

**Module interactions:**
- Drag a module from the module palette onto the canvas → create instance at drop position
- Drag a module preset file onto an existing module → load those preset settings

**Supported drop targets must provide visual feedback** — highlight when a valid drop target is hovered, show a preview of what the drop will do.

### Module Duplication

- `Cmd/Ctrl + D` or right-click → "Duplicate" on any selected module(s)
- Creates an exact copy with all current parameter values, positioned slightly offset from the original
- Duplicating multiple selected modules preserves their relative positions and internal connections (i.e., if modules A and B are connected, duplicating both creates A' and B' with the same connection between them)
- Does NOT duplicate incoming or outgoing connections to non-selected modules

### Accessibility

The application must be usable by people with disabilities, especially important in an educational context:

**Keyboard navigation:**
- `Tab` cycles focus between modules in the graph
- Arrow keys move between ports on a focused module
- `Enter` on a focused port enters "connection mode" — then `Tab` to another module's port and `Enter` again to create the connection
- `Escape` cancels connection mode
- All waveform editor tools are accessible via keyboard

**Screen reader support:**
- All modules have ARIA labels describing their type, name, and current state ("Compressor 1, threshold negative 18 dB, ratio 4 to 1, 3 inputs connected, 1 output connected")
- Connection changes are announced ("Connected Compressor 1 audio output to Master Bus audio input 3")
- Transport state changes are announced ("Playing from bar 5 beat 1")

**Visual accessibility:**
- High contrast mode (ensure all connection types, module categories, and states are distinguishable without relying solely on color)
- Scalable UI (all text, knobs, ports scale with browser zoom)
- Reduced motion mode (disable cable animations, meter animations)
- Minimum touch target sizes for ports and controls (44px per WCAG guidelines)

### Sidechain Routing

Sidechaining is a first-class concept in this system. It means "this module listens to one signal for its detection/analysis, but processes a different signal." In the modular graph, this is visually self-explanatory: two cables enter the same module from different sources, into different ports.

Every dynamics module (compressor, gate, de-esser, expander) must have a **dedicated sidechain input port** visually distinct from its main audio input. When nothing is connected to the sidechain port, the module uses its own audio input for detection (normal operation). When a sidechain cable is connected, the module uses that signal for detection while processing the main audio input.

Port layout example for a compressor:
- Left side, top: **Audio In** (the signal being compressed)
- Left side, middle: **Sidechain In** (the signal driving the compressor's gain reduction — e.g., a kick drum)
- Right side: **Audio Out**

The sidechain port should be visually labeled and use a distinct color/style (e.g., dashed border or a different color from standard audio ports). In Learn Mode, hovering the sidechain cable should explain: "This kick drum signal is controlling the compressor's gain reduction, but the bass track is the signal being compressed."

Also support sidechain filter — many compressors have an internal EQ applied to the sidechain signal (e.g., de-essing focuses on high frequencies). This could be an expandable control within the compressor module, or the user patches an EQ module inline between the sidechain source and the sidechain input, which is the more modular and educational approach.

### Grouping and Linked Parameters (VCA-Style Group Control)

Users need to control multiple modules proportionally from a single control — e.g., one fader controlling the volume of 6 drum track modules.

**Modular approach — Group Control Module:**
A "VCA Group" module with one control input (a gain knob or an external parameter signal) and multiple outputs. Each output acts as a multiplier on whatever it's connected to. Patch the group module's outputs into the gain parameters of multiple track modules. Turn the group knob and all connected tracks scale proportionally.

This keeps grouping visible in the graph — you can see which tracks are grouped and how.

**Parameter linking (complementary):**
Right-click any parameter knob → "Link Parameter" → click another parameter on any module → they now move together. Linked parameters display a small chain icon. Support relative linking (maintaining offset between values) and absolute linking (values match exactly). Links are shown as thin dotted lines in the graph when a linked parameter is selected.

### Grid and Snap System

Define the grid system explicitly:

**Snap resolution options:**
- Bar, beat, half-beat (1/8), quarter-beat (1/16), eighth-beat (1/32)
- Triplet variants: 1/8T, 1/16T
- Dotted variants: dotted 1/8, dotted 1/16
- Off (free positioning)

**Snap behavior modes:**
- **Magnetic snap**: Items gravitate to the nearest grid line when within a threshold distance, but can be placed between grid lines if dragged deliberately past the threshold
- **Absolute snap**: All positions quantize strictly to grid lines, no in-between placement
- **Relative snap**: Moving a region preserves its offset from the grid — useful for regions that are intentionally off-grid (e.g., a slightly ahead-of-beat snare)

**Grid display in the waveform editor:**
- Vertical lines at beat divisions, with visual hierarchy (bar lines darkest, beat lines medium, subdivision lines lightest)
- Grid density adapts to zoom level — zoomed out shows only bar lines, zoomed in reveals subdivision lines
- Current snap resolution is highlighted/bolded in the grid

**Grid and tempo map interaction:**
When the tempo map contains tempo changes, grid line spacing is non-uniform. Beat positions are calculated from the tempo map, not from a fixed BPM. All snap, grid display, and ruler markings must reference the tempo map.

**Grid selector widget**: Accessible from the waveform editor toolbar. Dropdown or button group showing resolution options. Keyboard shortcut to cycle through common resolutions (e.g., `Cmd/Ctrl + G` to cycle: off → bar → beat → 1/8 → 1/16).

### Undo System Design

**Scope — Global undo with context awareness:**
One unified undo history for the entire session, but actions are tagged with their context (graph, editor, parameter). This allows:
- `Cmd/Ctrl + Z` always undoes the most recent action regardless of context
- Future option: filtered undo per context if needed

**Action types (each is one undoable step):**
- Creating or deleting a module
- Creating or deleting a connection
- Moving a module in the graph
- Changing a parameter value (coalesced — see below)
- Any waveform edit (cut, splice, move region, trim, stretch, etc.)
- Creating or dissolving a macro
- Loading a preset

**Action coalescing:**
Continuous interactions must be coalesced into a single undo action:
- Dragging a knob: one action, committed on mouse/touch release
- Dragging a module position: one action, committed on release
- Typing a value into a number field: one action, committed on blur or Enter
- Multiple rapid same-parameter changes (e.g., scroll wheel on a knob): coalesce within a 500ms window

**Undo state structure:**
```typescript
interface UndoAction {
  id: string;
  type: 'graph' | 'editor' | 'parameter' | 'session';
  description: string;       // human-readable, e.g., "Move Compressor 1"
  timestamp: number;
  undo: () => void;          // function to reverse the action
  redo: () => void;          // function to reapply the action
}
```

**Max undo depth**: 200 actions. Oldest actions are discarded when the limit is exceeded. Session save resets the undo history (or optionally preserves it within the session file).

**Undo across save**: After saving, undo history remains intact for the current session. Loading a different session clears the history.

### CPU and Performance Metering

**Global CPU meter:**
Display in the transport bar, showing total audio thread utilization as a percentage. Calculated by comparing the time spent processing each audio block against the block duration (~2.9ms at 44.1kHz / 128 samples). Update at 5–10fps.

Color coding:
- Green: < 50% utilization
- Yellow: 50–80% utilization
- Red: > 80% utilization (risk of glitches)

**Per-module CPU cost:**
On hover over any module, or in a dedicated "Performance View" overlay, show the approximate CPU cost of each module as a percentage of the total budget. Implemented by measuring `process()` execution time per module via `performance.now()` in the AudioWorklet (noting that timer resolution may be limited in worklets — SharedArrayBuffer timing data may be more reliable).

**Memory usage:**
Display total audio memory (loaded buffers, WASM heap) in the transport bar alongside CPU. Useful for sessions with many audio files or large impulse responses.

### Graph Organization Tools

**Comment / Label Boxes:**
User-created rectangular regions in the graph canvas that visually group related modules. Features:
- Named header (e.g., "Drums", "Vocal Chain", "FX Bus")
- User-selectable background color (semi-transparent)
- Modules inside the box are not affected functionally — this is purely visual organization
- Moving the box moves all contained modules with it
- Resizable by dragging edges

**Module color coding:**
Right-click any module → "Set Color" → choose from a palette. The module header and/or border takes on the chosen color. Useful for visual grouping without boxes.

**Auto-layout / Arrange:**
A "Tidy Graph" function (accessible via menu or shortcut) that automatically organizes module positions based on signal flow topology:
- Sources (audio input, oscillators, track modules) placed on the left
- Effects and processing in the middle, laid out following the connection graph
- Output and metering modules on the right
- Parallel paths arranged vertically
- Respect existing comment boxes as grouping hints
- Animate the transition smoothly so the user can follow the rearrangement

**Minimap:**
A small overview of the entire graph in a corner of the canvas (React Flow supports this natively). Shows all modules as dots/rectangles with a viewport indicator. Click to navigate to any area of the graph.

### Touch and Mobile Support

The browser-based architecture means tablets (especially iPads in educational contexts) are a target platform. The architecture must not preclude touch interaction.

**Graph canvas touch interactions:**
- Single tap: select module
- Double tap: open module detail / editor
- Two-finger drag: pan the canvas
- Pinch: zoom
- Long press: context menu (equivalent to right-click)
- Drag from port: create cable connection (with a generous touch target — ports should be at least 44px tap target per WCAG)

**Knob interaction on touch:**
Do NOT use rotational gesture for knobs (unreliable on touch). Instead:
- Vertical drag: drag up to increase value, drag down to decrease
- Double-tap: open numeric input field for precise entry
- Ensure all knobs have a minimum 44px touch target

**Waveform editor on touch:**
- Tap to place playhead
- Long-press-drag to select a region
- Two-finger pinch to zoom timeline
- Tool switching via toolbar buttons (no keyboard shortcuts on tablets)

**Responsive layout considerations:**
- On smaller screens, the graph canvas and editor panel may need to be full-screen toggleable views rather than side-by-side
- Module detail views should be usable as full-screen overlays on tablets
- Consider a simplified "compact mode" for smaller displays that reduces module body UI to essentials

**Phase 1 approach**: Design the interaction model and touch targets from the start, but don't prioritize full tablet optimization until later phases. The key is not making architectural decisions that break touch later.

### Offline Processing / Destructive Apply

Different from freeze (which renders an entire chain). This is applying a specific effect to a specific region permanently.

**Workflow:**
1. Select a region in the waveform editor
2. Right-click → "Apply Effect" (or menu option)
3. Choose an effect from the module library (opens a temporary standalone instance with parameter controls)
4. Preview: hear the effect applied to the selection in real time
5. Confirm: render the effect onto the region, producing a new audio buffer
6. The original region data is preserved in the undo history

**Common destructive operations (also available as direct menu items):**
- **Normalize**: Peak normalize to 0 dBFS (or user-specified level)
- **Reverse**: Reverse the selected region
- **Gain change**: Apply a fixed gain offset
- **DC offset removal**: High-pass filter at ~5Hz
- **Silence**: Replace selection with silence
- **Fade in/out**: Render a fade directly onto the audio (vs. the non-destructive fade handles)

### Export and Rendering Quality

Expand the export pipeline with professional quality options:

**Bit depth on export:**
- 16-bit integer (CD quality — requires dithering from 32-bit float)
- 24-bit integer (professional standard — dithering optional but recommended)
- 32-bit float (no dithering needed, lossless)

**Dithering options (when reducing bit depth):**
- None (truncation — not recommended but available)
- Triangular (TPDF — standard, flat noise floor)
- Noise-shaped (pushes dither noise into less audible frequency ranges — higher quality for 16-bit)

**Oversampling for offline bounce:**
Option to render at 2x or 4x the session sample rate, then downsample with a high-quality anti-aliasing filter. This reduces aliasing artifacts from nonlinear effects (distortion, saturation, bitcrusher) in the final render. Increases render time proportionally.

**Normalization on export:**
- Off (export as-is)
- Peak normalize to a target level (e.g., -1 dBFS)
- Loudness normalize to a target LUFS (e.g., -14 LUFS for streaming platforms)

**Tail rendering:**
After the last region on any track ends, continue rendering for a configurable duration (default: 5 seconds, or "auto-detect" — keep rendering until output falls below a threshold like -80 dBFS) to capture reverb and delay tails.

**Export formats:**
- WAV (PCM, all bit depths)
- MP3 (via WASM-compiled LAME encoder, VBR or CBR, configurable bitrate)
- OGG Vorbis (via WASM-compiled libvorbis, configurable quality)
- FLAC (via WASM-compiled libflac, lossless compression)

**Export scope:**
- Full session (entire timeline from start to end + tail)
- Selection only (export only the selected time range)
- Individual tracks (solo each track and export separately — "stem export")
- Between markers (export each arrangement region as a separate file)

### Session Versioning

Beyond auto-save, users need explicit version management:

**Save As Version:**
- Menu → "Save Version" (or `Cmd/Ctrl + Shift + S`)
- Prompts for a version name (e.g., "v2 — added strings", "pre-mix rough", "final arrangement")
- Saves a complete snapshot of the session state (graph, all module parameters, audio region references, tempo map, markers)
- Previous versions remain accessible

**Version Browser:**
- Accessible from the session menu
- Lists all saved versions with name, date, and a brief diff summary ("added 3 modules, changed arrangement")
- Click to load any version (with confirmation: "This will replace your current session. Unsaved changes will be lost.")
- Option to "Branch from Version" — load an old version as the starting point for a new branch of work

**Storage:**
Each version is a separate JSON file in OPFS, sharing audio buffer references (audio data is not duplicated across versions — only the EDLs and graph state differ). This keeps version storage lightweight.

**Version limit:** Cap at 50 versions per session to manage storage. Oldest versions can be manually deleted from the version browser, or auto-pruned with a warning.

---

## Build Priorities

### Phase 1 — Core Framework
1. React app scaffold with React Flow graph canvas (including minimap)
2. Abstract graph state store (nodes, edges, connection types)
3. Audio engine reconciler (state changes → Web Audio graph updates)
4. Master output module and audio input module
5. Basic gain module and connection system (prove the architecture)
6. Cable rendering with type-based styling (audio, parameter, MIDI)
7. Mono/stereo channel handling rules with visual indicators on ports and cables
8. Global undo/redo system with action coalescing

### Phase 2 — Track Module
9. Track module with audio file loading and waveform display
10. Basic playback engine (EDL-based, single track)
11. Region overlap behavior modes (layer, crossfade, overwrite, ripple)
12. Automatic micro-crossfades at edit boundaries (click/pop prevention)
13. Solo and mute (with graph traversal for solo-safe and downstream logic)
14. Master transport with play/stop/position sync
15. Waveform editor panel with tool modes (pointer, trim, slice, draw, zoom, fade)
16. Grid and snap system (resolution options, magnetic/absolute/relative modes)
17. Multi-track synchronized editing view
18. Non-destructive edit history integrated with global undo

### Phase 3 — Effects and Routing
19. Core effect modules (EQ, compressor, delay, reverb) with sidechain input ports on all dynamics modules
20. Routing modules (mixer, splitter, merger)
21. Metering modules (level meter, spectrum analyzer)
22. AudioParam modulation connections (parameter ports)
23. CPU and memory performance meters (global + per-module on hover)

### Phase 4 — Recording and Automation
24. Recording pipeline (record arm, input monitoring, punch-in/out)
25. Recording latency compensation (auto-measure I/O latency, nudge recorded regions)
26. Count-in and metronome module
27. Automation module (draw and record parameter curves)
28. Loop recording with take stacking
29. Comping interface in track editor
30. Session auto-save (periodic save to OPFS/IndexedDB)
31. Session save/load with version management (Save As Version, version browser)

### Phase 5 — Editor Polish and Workflow
32. Markers and arrangement regions on the timeline
33. Keyboard shortcut system (with remapping and `?` overlay)
34. Drag-and-drop file import (desktop → canvas, desktop → module)
35. Module duplication (Cmd+D, preserve internal connections)
36. Freeze / Bounce-in-Place (offline render, CPU reclaim)
37. Offline processing / destructive apply (normalize, reverse, apply effect to selection)
38. Graph organization tools (comment boxes, module colors, auto-layout)
39. VCA Group module and parameter linking
40. Audio Pool / Media Manager (centralized asset view, remove unused audio, memory tracking)

### Phase 6 — Advanced DSP and Instruments
41. Time stretching and pitch shifting (WASM)
42. LFO and envelope generator modules
43. MIDI input module (WebMIDI)
44. Oscillator and sampler modules
45. Sample rate conversion on import (WASM SRC)
46. Tempo map with tempo and time signature changes
47. Export pipeline (WAV/MP3/OGG/FLAC, dithering, oversampling, normalization, tail rendering, stem export)

### Phase 7 — Structural and Routing Intelligence
48. Plugin Delay Compensation (graph analysis, auto-insert compensating delay)
49. Subpatching / macro modules (group, encapsulate, nest, save as template)
50. Per-module preset system (save, load, factory presets)
51. Waveshaper with drawable transfer curve
52. Error recovery system (detection, bypass, reset, error display)

### Phase 8 — Education and Accessibility
53. Contextual tooltips on all ports, cables, and parameters
54. Learn Mode toggle (annotated signal flow, parallel path detection, feedback loop explanation)
55. Sidechain educational annotations (explain what sidechain routing means in context)
56. Mono/stereo conversion annotations (M→S and S→M badges, Learn Mode explanations)
57. Module documentation system (per-module "About" with explanation and use cases)
58. Accessibility: keyboard navigation of graph and editor
59. Accessibility: screen reader support (ARIA labels, announcements)
60. Accessibility: high contrast mode, reduced motion mode, scalable UI
61. Touch and mobile support (tap, pinch-zoom, long-press context menus, vertical-drag knobs)

### Phase 9 — Community and Extension
62. User-created module workflow (template + manifest + integration)
63. Module sharing / preset sharing (import/export packages)
64. Preset patch library (educational signal flow demos)
65. Matrix routing view
66. Timeline overview module
67. Cable signal-level visualization (SharedArrayBuffer metering)
68. Connection validation with educational feedback

---

## Key Design Principles

1. **What you see is what's happening.** The visual graph must accurately represent the actual audio routing. No hidden connections, no invisible processing.

2. **The graph is home base.** Every audio operation is a module. Every signal path is a visible cable. The waveform editor is a tool you reach for, not a permanent view.

3. **Education through transparency.** A student should be able to look at a patch and understand WHY a compressor sounds the way it does, WHY an aux send works, WHY feedback creates comb filtering. The visual paradigm teaches signal flow implicitly.

4. **Real production capability.** This is not a toy. Track modules must support real audio editing workflows — splicing, time stretching, multi-track alignment. The modular interface is a different way to produce, not a lesser way.

5. **Module consistency.** Every module follows the same manifest contract, the same port conventions, the same visual language. A user who understands one module understands the system.
