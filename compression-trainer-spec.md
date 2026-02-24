# Compression Trainer — Build Specification

## Project Overview

A browser-based explorable explanation that trains students to hear dynamic compression. The tool isolates individual compressor parameters (threshold, ratio, attack, release, knee) into focused listening exercises, paired with real-time visualizations that show what the compressor is doing to the signal. Three modes (Practice, Teaching, Quiz) follow the same pattern as the Filter Identification tool.

The core pedagogical insight: students struggle with compression not because the math is hard, but because they don't know what to listen for. A fast attack "catches the transient" and a slow attack "lets it through," but those phrases are meaningless until you've heard the difference on a snare drum with a gain reduction meter moving in front of you. This tool makes the invisible visible.

**Location:** `projects/compression-trainer/`

**Technical approach:** Pure JavaScript (no build step, no dependencies), same as Filter ID. Uses Web Audio API's `DynamicsCompressorNode` for the compressor, with a downstream `GainNode` for manual makeup gain control. Real-time gain reduction read from `DynamicsCompressorNode.reduction`. All visualization via Canvas 2D.

---

## Why DynamicsCompressorNode (Not a Custom Worklet)

The native `DynamicsCompressorNode` is sufficient for this tool because:

1. **It exposes the five parameters we need to teach**: threshold, knee, ratio, attack, release.
2. **`reduction` is readable in real time** via `requestAnimationFrame` polling, which is fast enough for meter visualization.
3. **The knee implementation is musically correct**: Chromium uses a proper exponential blend curve, not a naive linear interpolation.
4. **No build step required**: AudioWorklet processors need separate files or inline blob URLs. The native node keeps this a single-file vanilla JS project.
5. **GitHub Pages lacks cross-origin isolation headers**, so `SharedArrayBuffer` (the best way to get high-resolution data from a worklet) is unavailable anyway.

**Known limitations and mitigations:**

| Limitation | Mitigation |
|---|---|
| No makeup gain parameter | Chain a `GainNode` after the compressor. Expose it as "Makeup Gain" in the UI. |
| Built-in automatic makeup gain | Cannot disable. The transfer curve visualization must account for this. Compute the expected automatic makeup from the static curve and subtract it when drawing the "ideal" transfer curve. |
| `reduction` clamped to -20 dB | Sufficient for educational settings. Cap the gain reduction meter at -20 dB with a ">" indicator if pegged. |
| k-rate parameters (not sample-accurate) | Acceptable for an ear training tool. Parameter changes via button clicks, not continuous modulation. |
| Default settings are aggressive (threshold -24, knee 30, ratio 12) | Override all defaults on creation. Start with threshold -18 dB, knee 6 dB, ratio 4:1, attack 10 ms, release 250 ms. |

---

## Audio Architecture

```
Source (Pink Noise / User Audio / Multi-track / Drum Loop)
  → sourceGain
    → DynamicsCompressorNode (threshold, knee, ratio, attack, release)
      → makeupGain (GainNode, manual dB control)
        → compressedGain ──→ preMasterMerge → masterGain → destination
    → bypassGain ──────────→ preMasterMerge
```

The bypass/compressed crossfade uses the same `GainNode` switching pattern as Filter ID: `compressedGain.gain` and `bypassGain.gain` are toggled between 0 and 1 with `setTargetAtTime` for smooth transitions.

For metering, two taps:

```
sourceGain → inputAnalyser  (pre-compression level)
preMasterMerge → outputAnalyser  (post-compression level)
DynamicsCompressorNode.reduction → gain reduction meter (polled via rAF)
```

The multi-track routing reuses the same pattern as Filter ID: per-track `GainNode` → summing bus → `sourceGain`. The multi-track stems from `audio/stadium-rock-mp3/` are shared.

---

## Audio Sources

Four audio sources plus mute, adapted from Filter ID (no sawtooth, which is less useful for compression training on percussive material):

| Source | Description | Why |
|---|---|---|
| Mute | No audio | Default state |
| Pink Noise | Generated, rhythmic gated bursts (~120 BPM) | Even spectral energy with sharp transients for hearing attack and release |
| User Audio | File upload | Student's own material |
| Multi-track | Built-in stems (shared with Filter ID) | Drums for attack/release, bass for transient shaping, full mix for bus compression |
| Drum Loop | Built-in short loop (~4 bars) | The consensus best material for hearing compression. Short enough to loop tightly, rhythmically consistent for hearing pumping and breathing |

**Drum Loop source:** A single stereo WAV or MP3 file at `audio/drum-loop.mp3` (or similar). A simple rock drum beat, 4 bars, ~120 BPM. This source loops continuously and is the default recommendation for beginners. We need to source or create this.

Per-source gain memory (same pattern as Filter ID): each source remembers its last gain setting independently.

---

## Parameters

### Compressor Parameters

These map directly to `DynamicsCompressorNode` properties:

| Parameter | Range | Default | Step | Unit | Notes |
|---|---|---|---|---|---|
| Threshold | -60 to 0 | -18 | 1 | dB | When compression starts |
| Ratio | 1 to 20 | 4 | 0.5 | :1 | How much compression |
| Attack | 0.001 to 0.1 | 0.010 | varies | s | How fast the compressor reacts |
| Release | 0.01 to 1.0 | 0.250 | varies | s | How fast the compressor lets go |
| Knee | 0 to 40 | 6 | 1 | dB | Hard (0) to soft (40) transition |

Attack and release use logarithmic mapping (same as the modular DAW compressor manifest) because perceptual differences are logarithmic: the difference between 1 ms and 5 ms is much more audible than between 95 ms and 100 ms.

### Makeup Gain

| Parameter | Range | Default | Step | Unit |
|---|---|---|---|---|
| Makeup Gain | -12 to +24 | 0 | 0.5 | dB |

Implemented via a separate `GainNode` after the compressor. The built-in automatic makeup gain from `DynamicsCompressorNode` cannot be disabled, so the displayed "Makeup" control adjusts on top of whatever the node applies automatically.

### Output Gain (Master)

Same as Filter ID: a master gain slider from -70 to +6 dB controlling `masterGain.gain`.

---

## Visualizations

Three real-time visualizations, all rendered on Canvas 2D. These are the core differentiator from existing tools.

### 1. Transfer Curve (Static Characteristic)

A plot of input level (x-axis, dB) vs. output level (y-axis, dB). Shows the compressor's static behavior: unity line, threshold point, compressed region, and knee shape.

**What it shows:**
- A diagonal 1:1 line (unity gain, no compression) as reference
- The actual compression curve based on current threshold, ratio, and knee
- A moving dot showing the current input level and corresponding output level (animated via `requestAnimationFrame`)
- The knee region highlighted with a subtle color band

**Axes:**
- X: Input Level, -60 to 0 dBFS
- Y: Output Level, -60 to 0 dBFS
- Grid lines at 6 dB intervals

**Computing the curve:** The transfer function is computed mathematically from threshold, ratio, and knee parameters (not by querying the node). This avoids the automatic makeup gain issue.

```
For hard knee (knee = 0):
  if input_dB < threshold:
    output_dB = input_dB
  else:
    output_dB = threshold + (input_dB - threshold) / ratio

For soft knee (knee > 0):
  if input_dB < threshold - knee/2:
    output_dB = input_dB
  else if input_dB < threshold + knee/2:
    // Quadratic interpolation in the knee region
    output_dB = input_dB + (1/ratio - 1) * (input_dB - threshold + knee/2)^2 / (2 * knee)
  else:
    output_dB = threshold + (input_dB - threshold) / ratio
```

**Real-time dot:** Use `inputAnalyser` to get current RMS or peak level. Plot the dot at (input_dB, computed_output_dB). The dot moves along the curve as the audio plays, showing students exactly where on the curve the signal is operating.

### 2. Gain Reduction Meter

A vertical bar meter showing real-time gain reduction in dB. Reads `DynamicsCompressorNode.reduction` every animation frame.

**Display:**
- Vertical bar, 0 dB at top, -20 dB at bottom
- Bar fills downward from 0 (more gain reduction = longer bar)
- Color gradient: green (0 to -6), yellow (-6 to -12), red (-12 to -20)
- Numeric readout below: "-4.2 dB" (updated per frame)
- Peak hold indicator: a thin line at the maximum gain reduction, decays slowly (1 dB/s)

**Why this matters:** The gain reduction meter is what makes compression visible. Students can see the compressor "breathing" with short release, or "sitting" with long release. They can see fast attack catching every transient vs. slow attack letting peaks through.

### 3. Envelope Visualization (Time Domain)

A scrolling waveform display showing the amplitude envelope of the signal over time, with the gain reduction envelope overlaid.

**Display:**
- Scrolling left-to-right, ~3 seconds visible
- Top half: Input envelope (gray), Output envelope (blue)
- Bottom half: Gain reduction trace (orange/red, inverted so more reduction goes down)
- Horizontal threshold line drawn at the current threshold level

**Implementation:** Use two `AnalyserNode` instances (pre- and post-compressor) to get `getFloatTimeDomainData`. Compute RMS over short windows (~128 samples) for the envelope. Store a rolling buffer of ~180 frames (3 seconds at 60fps). Draw as a filled area chart.

**Why this matters:** This is the visualization no existing tool provides. Students can literally see the attack time as the slope of the gain reduction onset, see the release as the recovery slope, see pumping as the rhythmic gain modulation pattern.

---

## Modes

### Practice Mode

All parameters directly controllable. Audio plays continuously. All visualizations active.

**UI layout:**
- Toolbar: Mode buttons, Source buttons, Gain slider
- Compressor controls card:
  - Parameter group: Threshold (slider + value)
  - Parameter group: Ratio (slider + value)
  - Parameter group: Attack (slider + value + discrete buttons for Fast/Medium/Slow)
  - Parameter group: Release (slider + value + discrete buttons for Fast/Medium/Slow)
  - Parameter group: Knee (slider + value + discrete buttons for Hard/Medium/Soft)
  - Parameter group: Makeup Gain (slider + value)
  - Bypass button (On/Off toggle, same as Filter ID)
- Visualization area:
  - Left: Transfer curve canvas
  - Right: Gain reduction meter + Envelope visualization

**Discrete buttons for Attack, Release, Knee:** In addition to continuous sliders, provide three named presets per parameter. These follow Wellington Gordon's pedagogical approach of constraining to three discrete values to reduce cognitive load:

| Parameter | Fast/Hard | Medium | Slow/Soft |
|---|---|---|---|
| Attack | 0.002 s (2 ms) | 0.020 s (20 ms) | 0.080 s (80 ms) |
| Release | 0.050 s (50 ms) | 0.250 s (250 ms) | 0.800 s (800 ms) |
| Knee | 0 dB (hard) | 12 dB | 30 dB (soft) |

The buttons set the slider to the corresponding value. The slider can still be adjusted freely for fine control. The active button highlights when the slider matches (within tolerance). This gives students named anchors ("fast attack," "slow release") to build vocabulary around.

### Teaching Mode

Guided listening sequences that isolate one parameter at a time.

**Sequence structure:** Same bypass/process/bypass pattern as Filter ID, but adapted:

1. **Uncompressed** (bypass, configurable duration, default 4s): Audio plays with no compression
2. **Compressed** (configurable duration, default 5s): Compression applied with current settings
3. **Uncompressed** (bypass, default 4s): Audio returns to uncompressed

The phase indicator shows "Uncompressed" / "Compressed" with countdown, same as Filter ID's "Unfiltered" / "Filtered" indicator.

**Teaching sequences (new feature):** Predefined guided lessons that step through parameter values automatically with explanatory text. Each sequence:

1. Sets a specific parameter combination
2. Plays the bypass/compressed/bypass cycle
3. Shows a short text explanation of what to listen for
4. Advances to the next step on button click

**Built-in sequences:**

**Sequence 1: "Hearing Compression" (Introduction)**
- Step 1: Heavy compression (threshold -30, ratio 8:1, fast attack, fast release). "Listen for the level difference. The loud parts get quieter."
- Step 2: Moderate compression (threshold -18, ratio 4:1, medium attack, medium release). "Subtler now. Focus on how the dynamic range narrows."
- Step 3: Gentle compression (threshold -12, ratio 2:1, medium attack, medium release). "Very subtle. Can you still hear the difference?"

**Sequence 2: "Attack Time" (Transient Shaping)**
- Recommended source: Drums or Multi-track (drums solo)
- Step 1: Fast attack (2 ms). "The compressor catches the transient. The drum hit sounds rounded, less punch."
- Step 2: Medium attack (20 ms). "Some transient passes through before compression clamps down. More natural."
- Step 3: Slow attack (80 ms). "The full transient passes through. The initial hit is preserved, but the sustain is compressed. This is 'punchy' compression."

**Sequence 3: "Release Time" (Recovery and Rhythm)**
- Recommended source: Drums or Multi-track (drums solo)
- Step 1: Fast release (50 ms). "The compressor recovers quickly between hits. Listen for the room ambience pumping up between transients."
- Step 2: Medium release (250 ms). "Gain reduction carries into the next hit slightly. Smoother."
- Step 3: Slow release (800 ms). "The compressor doesn't fully recover between hits. Each successive hit may be quieter. The mix feels 'sat on.'"

**Sequence 4: "Knee" (Transition Character)**
- Recommended source: User Audio (vocal or acoustic guitar) or Pink Noise
- Step 1: Hard knee (0 dB). "Compression snaps on abruptly at the threshold. Listen for the 'grab.'"
- Step 2: Medium knee (12 dB). "The transition is gentler. Compression eases in around the threshold."
- Step 3: Soft knee (30 dB). "Very gradual onset. Compression is always slightly active near the threshold. More transparent."

**Sequence 5: "Pumping and Breathing" (Artifacts)**
- Recommended source: Multi-track (full mix or drums)
- Step 1: Classic pumping (threshold -24, ratio 6:1, fast attack 2 ms, fast release 80 ms). "Listen for the volume surging between hits. This is 'pumping.'"
- Step 2: Musical pumping (threshold -20, ratio 4:1, fast attack 5 ms, medium-fast release 150 ms). "Gentler pumping. Used intentionally in dance and electronic music for rhythmic energy."
- Step 3: Breathing (threshold -24, ratio 6:1, fast attack, medium-slow release 400 ms). "With sparse material, listen for the background noise rising as the compressor releases. This is 'breathing.'"

**UI additions for Teaching Mode:**
- Sequence selector dropdown (or buttons): "Hearing Compression," "Attack Time," "Release Time," "Knee," "Pumping & Breathing"
- Step indicator: "Step 2 of 3"
- Explanatory text area below the controls (shows the guidance text for the current step)
- "Listen" button (plays the bypass/compressed/bypass cycle for the current step)
- "Next Step" / "Previous Step" buttons
- Loop toggle (same as Filter ID)
- Source recommendation shown when entering a sequence (e.g., "Best heard on: Drums")

When not in a sequence, Teaching mode works like Filter ID's teaching mode: the student sets parameters manually and clicks "Listen" to hear the bypass/compressed/bypass cycle.

### Quiz Mode

Identify hidden compression parameters by ear.

**Quiz structure:**

1. A random compression setting is applied (hidden from the student)
2. The bypass/compressed/bypass sequence plays
3. The student selects their answer from the available parameter buttons
4. Submit reveals the correct answer with comparison

**Quiz drills** (selectable, same pattern as Filter ID):

| Drill | What's Hidden | What Student Guesses | Fixed Parameters |
|---|---|---|---|
| Is It Compressed? | Whether compression is applied | Compressed / Not Compressed | Random settings when compressed |
| Attack Time | Attack value | Fast / Medium / Slow | Threshold -18, Ratio 4:1, Release 250ms, Knee 6 |
| Release Time | Release value | Fast / Medium / Slow | Threshold -18, Ratio 4:1, Attack 10ms, Knee 6 |
| Knee | Knee value | Hard / Medium / Soft | Threshold -18, Ratio 4:1, Attack 10ms, Release 250ms |
| Attack + Release | Both attack and release | Two selections | Threshold -18, Ratio 4:1, Knee 6 |
| All Parameters | Threshold range, ratio, attack, release | Multiple selections | Nothing fixed |

The "Is It Compressed?" drill is the entry-level exercise. On each question, either compression is applied (random moderate settings) or bypass is used for the full duration. The student simply identifies which one. This builds the foundational skill of hearing compression at all.

For the parameter drills (Attack, Release, Knee), the quiz uses the three discrete values from the Practice mode table. The student picks "Fast," "Medium," or "Slow" (or "Hard," "Medium," "Soft" for knee). This constrains the answer space and builds vocabulary.

**Comparison view on reveal:** Same side-by-side pattern as Filter ID. Show two small transfer curves: "Your Answer" and "Correct Answer." For attack/release/knee drills where the transfer curve is identical, show the gain reduction trace comparison instead (the gain reduction over time looks different with different attack/release values on the same material).

**Scoring:** Correct/Total and streak counter, same as Filter ID.

---

## UI Layout

The layout follows Filter ID's structure: toolbar at top, controls card, visualization area.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Practice] [Teaching] [Quiz]                            [Demo]  │
│ Source: [Mute] [Pink Noise] [User Audio] [Multi-track] [Drums]  │
│ Gain: ──────────────────── -12 dB                               │
├─────────────────────────────────────────────────────────────────┤
│ ┌─ Test Indicator ─────────────────────────────────────────────┐│
│ │ Compressed  3s                                                ││
│ └──────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                     COMPRESSOR CONTROLS                         │
│                                                                 │
│ Compressor [On] / [Off]                                         │
│                                                                 │
│ Threshold  ─────────────●─────────  -18 dB                      │
│                                                                 │
│ Ratio      ────●──────────────────  4:1                         │
│                                                                 │
│ Attack     ────────●──────────────  10 ms                       │
│            [Fast 2ms] [Med 20ms] [Slow 80ms]                    │
│                                                                 │
│ Release    ──────────●────────────  250 ms                      │
│            [Fast 50ms] [Med 250ms] [Slow 800ms]                 │
│                                                                 │
│ Knee       ──●────────────────────  6 dB                        │
│            [Hard 0] [Med 12] [Soft 30]                          │
│                                                                 │
│ Makeup     ────────────●──────────  0 dB                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     VISUALIZATION                               │
│                                                                 │
│  ┌─ Transfer Curve ────────────┐  ┌─ GR Meter ─┐               │
│  │          /                  │  │    0 dB     │               │
│  │        /·                   │  │    ▓        │               │
│  │      / ·                    │  │    ▓▓       │               │
│  │    /  ·                     │  │    ▓▓▓      │               │
│  │  /___·______                │  │    ▓▓▓▓     │               │
│  │ /                           │  │   -20 dB    │               │
│  │           Input →           │  │   -4.2 dB   │               │
│  └─────────────────────────────┘  └─────────────┘               │
│                                                                 │
│  ┌─ Envelope (scrolling) ──────────────────────────────────────┐│
│  │  ░░▓▓░░▓▓░░▓▓░░  input (gray)                               ││
│  │  ░░▓░░░▓░░░▓░░░  output (blue)                              ││
│  │  ──────────────── threshold                                  ││
│  │  ▒▒  ▒▒  ▒▒      gain reduction (orange, inverted)          ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ ┌─ Multi-track controls (when Multi-track selected) ──────────┐│
│ │  [Drums] [Tamb] [Bass] [Guitar] [Keys] [Organ] [Pad]        ││
│ │    M S     M S   M S     M S     M S    M S     M S          ││
│ │   ─┼─    ─┼─   ─┼─    ─┼─     ─┼─    ─┼─    ─┼─            ││
│ └──────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                     FREQUENCY GUIDE                             │
│                                                                 │
│ (collapsible card with experiential descriptions)               │
└─────────────────────────────────────────────────────────────────┘
```

### Visualization Layout

On wide screens (>900px), the transfer curve and GR meter sit side by side above the envelope display. On narrow screens, they stack vertically.

The transfer curve canvas is the primary visualization. It should be approximately square, ~300x300px on desktop. The GR meter is narrow (~60px wide) and the same height as the transfer curve.

The envelope visualization spans the full width below.

---

## Compression Guide (Reference Card)

A collapsible card below the visualizations with experiential descriptions of what each parameter does. This is the compression equivalent of Filter ID's vowel-hint frequency guide.

### Threshold
> "When does the compressor start working?" Below the threshold, audio passes through unchanged. Above it, the compressor reduces the level. Lower thresholds mean more of the signal gets compressed.

### Ratio
> "How much does it compress?" At 2:1, a signal 10 dB above threshold comes out only 5 dB above. At 4:1, it comes out 2.5 dB above. Higher ratios mean more aggressive compression. Above 10:1 is essentially limiting.

### Attack
> "What happens to the transient?" Fast attack catches the initial hit and smooths it out. Slow attack lets the transient punch through, then compresses the sustain. On a snare drum: fast attack kills the crack, slow attack preserves it.

### Release
> "How does it let go?" Fast release recovers quickly between hits, which can pump the level up audibly between transients. Slow release holds the gain reduction, creating a smoother but potentially "sat on" feel. Time the release to the music: the meter should return to zero just before the next downbeat.

### Knee
> "How does compression engage?" Hard knee (0 dB): compression snaps on at the threshold. The compressor is either working or it isn't. Soft knee (>10 dB): compression eases in gradually around the threshold, producing a more transparent, musical character. The difference is subtle and most audible on dynamic material like vocals or acoustic guitar.

### Makeup Gain
> "Compensating for what you lost." Compression reduces loud peaks, which lowers the overall level. Makeup gain brings it back up. Always level-match when comparing compressed vs. uncompressed, or your ears will prefer whichever is louder.

---

## Demo Mode

A single "Demo" button (same as Filter ID) that runs an automated demonstration cycling through the key compression concepts:

1. Bypass (2s) → Heavy compression (4s) → Bypass (2s) — "Hearing compression"
2. Fast attack (3s) → Medium attack (3s) → Slow attack (3s) — "Attack time"
3. Fast release (3s) → Medium release (3s) → Slow release (3s) — "Release time"
4. Hard knee (3s) → Soft knee (3s) — "Knee"

During the demo, the parameter controls update in real time to reflect the current settings, and the visualizations animate. A label shows the current demo step. The demo can be stopped at any time.

---

## State Management

```javascript
const state = {
    audioContext: null,
    masterGain: null,
    sourceGain: null,
    compressor: null,         // DynamicsCompressorNode
    makeupGain: null,         // GainNode (manual makeup)
    compressedGain: null,     // GainNode (effect path)
    bypassGain: null,         // GainNode (bypass path)
    preMasterMerge: null,     // GainNode (merge point)

    // Analysers for visualization
    inputAnalyser: null,      // Pre-compression
    outputAnalyser: null,     // Post-compression

    // Pink noise
    noiseBuffer: null,
    noiseSource: null,

    // User audio (same pattern as Filter ID)
    userAudioBuffer: null,
    userAudioSource: null,
    userAudioStartTime: 0,
    userAudioPausedAt: 0,
    userAudioDuration: 0,
    progressAnimationId: null,

    // Multi-track (shared stems, same pattern as Filter ID)
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

    // Drum loop (new source)
    drumLoopBuffer: null,
    drumLoopSource: null,

    // Stereo visualization (reuse Filter ID pattern)
    stereoSplitter: null,
    stereoAnalyserL: null,
    stereoAnalyserR: null,
    stereoVizAnimId: null,

    // Playback
    isPlaying: false,
    currentSource: 0,         // 0=Mute, 1=Pink Noise, 2=User Audio, 3=Multi-track, 4=Drum Loop

    // Per-source gain
    pinkNoiseGainValue: -24,
    userAudioGainValue: -12,
    multitrackGainValue: -12,
    drumLoopGainValue: -12,

    // Compressor parameters
    threshold: -18,           // dB
    ratio: 4,                 // :1
    attack: 0.010,            // seconds
    release: 0.250,           // seconds
    knee: 6,                  // dB
    makeupGainDb: 0,          // dB
    compressorBypassed: false,

    // Mode
    mode: 'practice',         // 'practice' | 'teaching' | 'quiz'

    // Teaching sequences
    teachingSequence: null,   // null or sequence ID
    teachingStep: 0,

    // Quiz (same pattern as Filter ID)
    quizDrill: 'isCompressed',
    quizAnswer: null,
    quizSelection: {},
    quizCorrect: 0,
    quizTotal: 0,
    quizStreak: 0,
    quizRevealed: false,

    // Test sequence (bypass/compressed/bypass)
    testRunning: false,
    testTimeoutIds: [],
    testAnimationId: null,
    testStartTime: 0,
    testPhase: null,          // 'bypass' | 'compressed' | null
    testLoop: false,
    testBypassDur: 4,         // seconds (user-adjustable)
    testCompressedDur: 5,     // seconds (user-adjustable)

    // Visualization state
    vizAnimId: null,
    envelopeHistory: [],      // Rolling buffer for scrolling envelope
    grPeakHold: 0,            // Peak hold for GR meter (dB, negative)
    grPeakHoldTime: 0,        // Timestamp of peak hold

    // Demo
    demoRunning: false,
    demoStep: 0,
    demoTimeoutIds: []
};
```

---

## File Structure

```
projects/compression-trainer/
├── index.html              # Main page (uses .container.wide)
├── guide.html              # User guide
└── js/
    └── app.js              # Complete application logic
```

Project-specific CSS in `css/projects/compressionTrainer.css`.

The CSS class prefix is `ct-` (compression trainer). All classes scoped: `ct-app`, `ct-toolbar`, `ct-param-group`, `ct-slider`, `ct-viz-container`, `ct-transfer-curve`, `ct-gr-meter`, `ct-envelope`, `ct-guide`, etc.

---

## Implementation Phases

### Phase 1: Core Audio and Practice Mode

Build the complete audio graph, source switching (all four sources plus mute), compressor parameter controls, and bypass toggle. No visualizations yet, just the controls and audible compression.

**Deliverables:**
- Audio context creation with full signal chain
- Source switching (Mute, Pink Noise, User Audio, Multi-track, Drum Loop) — no sawtooth
- All compressor parameter sliders + discrete buttons
- Makeup gain control
- Bypass toggle with smooth crossfade
- Per-source gain memory
- Master gain slider
- File upload for User Audio
- Multi-track mixer (reuse Filter ID pattern)

### Phase 2: Visualizations

Add the three canvas visualizations.

**Deliverables:**
- Transfer curve canvas (static characteristic, real-time dot, knee region highlight)
- Gain reduction meter (vertical bar, peak hold, numeric readout)
- Envelope visualization (scrolling, input/output envelopes, GR trace, threshold line)
- `requestAnimationFrame` loop driving all three
- Dark mode support in all canvas rendering

### Phase 3: Teaching Mode

Teaching mode with manual listen cycles and guided sequences.

**Deliverables:**
- Bypass/compressed/bypass test cycle (same infrastructure as Filter ID)
- Phase indicator with countdown
- Loop toggle
- Configurable durations
- Teaching sequence system (data-driven, steps with parameter presets + guidance text)
- Five built-in sequences (Hearing Compression, Attack, Release, Knee, Pumping & Breathing)
- Sequence selector UI
- Step navigation (previous/next)
- Source recommendations per sequence
- Explanatory text display

### Phase 4: Quiz Mode

Quiz drills with scoring.

**Deliverables:**
- Quiz drill system (Is It Compressed?, Attack Time, Release Time, Knee, Attack + Release, All Parameters)
- Random parameter generation per drill constraints
- Answer selection UI (discrete buttons matching drill type)
- Comparison view on reveal (side-by-side transfer curves or GR traces)
- Scoring (correct/total, streak)
- Avoid repeating the same question twice in a row

### Phase 5: Polish

**Deliverables:**
- Demo mode (automated cycling through compression concepts)
- Compression guide (collapsible reference card with experiential descriptions)
- Guide page (guide.html)
- Responsive layout (mobile-friendly stacking)
- Keyboard shortcuts
- About section
- SEO meta tags
- Add to projects listing page

---

## CSS Architecture

Project-specific styles in `css/projects/compressionTrainer.css`, following site conventions:

- Class prefix: `ct-`
- Reuse shared component classes from `components.css` and `components-audio.css` (`.card`, `.action-button`, `.play-button`, `.upload-area`, `.playback-controls`, `.info-trigger`, `.info-tooltip`, `.demo-button`)
- Dark mode via `[data-theme="dark"]` selectors
- Canvas containers use the same pattern as Filter ID: `ct-canvas-container` with relative positioning and a `<canvas>` filling it

---

## Shared Code with Filter ID

Several patterns are identical between this project and Filter ID. Rather than creating shared modules (which would add coupling and complexity), copy the patterns:

- Pink noise generation (Paul Kellet algorithm)
- User audio upload and playback with progress bar
- Multi-track loading, mixer, mute/solo/volume, stereo visualization
- Source switching with per-source gain memory
- Test sequence (bypass/process/bypass) with phase indicator
- Mode switching infrastructure
- Quiz scoring and streak tracking
- Dark mode canvas color detection
- Slider fill gradient updates

This is intentional duplication. Each project is self-contained, single-file, zero dependencies. Shared abstractions would add indirection without meaningful benefit for two standalone pages.

---

## Accessibility

- All sliders have `aria-label` attributes
- Canvas visualizations have `aria-label` describing what they show
- Keyboard navigation: Tab through controls, Enter/Space to activate buttons
- Color is never the sole indicator: GR meter has numeric readout, transfer curve has grid lines
- Teaching sequence text is in the DOM (not canvas), readable by screen readers
- Quiz answers are button elements with clear labels

---

## Open Questions

1. **Drum loop source material:** We need a short (4-8 bar) drum loop. Options: create one in a DAW, find a royalty-free loop, or generate one with Web Audio (kick + snare + hi-hat pattern using oscillators and noise). The generated approach is interesting pedagogically (students see "drums" being made from synthesis) but may sound too synthetic for realistic compression training. Recommend: source a real recorded loop. *User will provide this.*

2. **Auto-makeup gain mismatch:** The `DynamicsCompressorNode` applies automatic makeup gain that cannot be disabled. The transfer curve visualization shows the textbook mathematical curve (no auto-makeup), so the moving dot will be slightly inaccurate relative to the actual output level. Current approach: draw the textbook curve, note in the guide that the browser's compressor applies automatic gain compensation. Tracked as a bug for later investigation — may need a correction factor or a note in the UI.
