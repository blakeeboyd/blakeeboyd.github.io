# Modular DAW: Development Changelog

A browser-based modular digital audio workstation built with React, Web Audio API, and React Flow. This document records the design decisions, implementation phases, and technical details of the project's development. It is intended as a reference for future writing, research papers, or retrospective analysis.

## Project Overview

The Modular DAW is an interactive web application where users build audio processing graphs by connecting modules on a visual canvas. Audio signals flow through user-defined chains (e.g., Track → Gain → Master Output), and a transport system controls playback of loaded audio files. The editor panel allows non-destructive region-based editing: trimming, slicing, and rearranging audio on a timeline.

The project lives within a static GitHub Pages site and requires no server. All audio processing happens client-side using the Web Audio API.

### Technical Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| UI Framework | React 18 | Component model maps well to node-based modules |
| Graph Canvas | React Flow (v12) | Industry-standard node/edge visualization with handles, zoom, pan |
| State Management | Zustand + Zundo | Minimal API, works outside React (for audio engine), Zundo adds undo/redo via temporal middleware |
| Audio | Web Audio API (native) | No abstraction layer: full control over AudioContext, buffer scheduling, gain ramping |
| Build | Vite + TypeScript | Fast dev server, ES module output, strict type checking |
| ID Generation | nanoid | Compact unique IDs for nodes, edges, regions |

### Architecture

The system separates concerns into three layers:

1. **State layer** (Zustand stores): Serializable graph topology, transport state, and editor state. The graph and editor stores use Zundo for undo/redo. Audio buffers live outside Zustand in a plain `Map` because they are large, non-serializable, and would break undo/redo.

2. **Reconciliation layer** (AudioEngine): Listens to state changes and incrementally patches the live Web Audio graph. Only adds, removes, or updates what changed. Uses GainNode gating (ramp from 0→1 on connect, 1→0 on disconnect) to prevent clicks.

3. **UI layer** (React components): React Flow canvas for the graph, custom node components for each module type, transport bar, and waveform editor panel.

### Module Plugin System

Each audio module is defined by three pieces:
- **Manifest**: Declares the module's type, category, label, ports (inputs/outputs with signal type and channel format), and parameters (with ranges, defaults, and mapping).
- **Processor factory**: Creates a `ProcessorInstance` containing live Web Audio nodes, with methods for parameter updates and disposal.
- **React component**: Renders the module's UI inside the React Flow node.

Modules register with a central registry at startup. Adding a new module requires no changes to the engine or canvas: just create the three files and register.

---

## Phase 1: Core Framework

**Date:** 2026-02-12
**Commits:** `5e2476f`, `1d5802c`
**Scope:** Spec items 1-8 (graph canvas, module system, audio engine, undo/redo)

### What Was Built

A working modular audio environment with three modules, type-safe connections, and undo/redo. Users can patch a Test Tone through a Gain module into a Master Output and hear the result.

### Implementation Details

#### Type System

Defined the core interfaces that all modules and the engine depend on:

- `DawNode`: Graph node with `id`, `type`, `position`, and `data` (label + parameters map).
- `DawEdge`: Graph edge with source/target node IDs and handle IDs, plus `data` containing signal type and channel format.
- `PortDef`: Declares an input or output port with signal type (`audio` | `parameter` | `midi`) and channel format (`mono` | `stereo`).
- `ParameterDef`: Declares a parameter with min/max/default/step, unit, and mapping (`linear` | `log`).
- `ModuleManifest`: Combines label, type, category, ports, parameters, singleton flag.
- `ProcessorInstance`: The live audio processor with `inputs`, `outputs`, `setParameter()`, `dispose()`.

#### Modules

| Module | Category | Ports | Key Behavior |
|--------|----------|-------|--------------|
| Master Output | io | stereo in | Singleton. Connects to `AudioContext.destination`. |
| Test Tone | generator | mono out | `OscillatorNode` with frequency (20-2000 Hz), gain (-70 to 0 dB), waveform selection. |
| Gain | utility | stereo in, stereo out, gain-cv (param input) | `GainNode` with dB-to-linear conversion. CV input modulates gain parameter. |

#### Audio Engine

The `AudioEngine` class maintains parallel maps of `ProcessorInstance` objects and `LiveConnection` objects. Its `reconcile()` method is called on every Zustand state change and performs five steps:

1. Remove processors for deleted nodes
2. Create processors for added nodes
3. Update parameters for changed values
4. Disconnect removed edges (with 80ms ramp-down)
5. Connect added edges (with ramp-up)

Channel format mismatches (mono→stereo, stereo→mono) are handled by `createChannelAdapter()` which inserts a `ChannelSplitterNode`/`ChannelMergerNode` bridge.

#### Graph Store

The graph store wraps React Flow's `applyNodeChanges` and `applyEdgeChanges` for the visual canvas, while also providing domain actions (`addModule`, `removeModule`, `updateParameter`, `onConnect`). Connection validation enforces:
- Signal types must match (audio↔audio, parameter↔parameter)
- Source must be output, target must be input
- No self-connections
- Each input port accepts at most one connection
- Singleton modules cannot be deleted

Zundo wraps the store with `temporal()` middleware, partializing state to exclude position-only changes (so dragging a node doesn't create undo entries).

#### UI Components

- **Canvas.tsx**: Hosts the React Flow instance with Background, MiniMap, Controls, and overlay panels.
- **ModulePanel.tsx**: Lists available modules with Add buttons. Disabled for singletons already on canvas.
- **NodeSlider.tsx**: Custom range input that works around React Flow's d3-drag capture issue by registering capture-phase event listeners that stop propagation. Also pauses/resumes Zundo during drag to avoid flooding undo history.
- **Toolbar.tsx**: Undo/Redo buttons connected via `useUndoRedo()` hook.
- Module node components (TestToneNode, GainModuleNode, MasterOutputNode): Render parameters, waveform selectors, handles.

#### Build System

Vite configured in library mode (`build.lib`) to output a single ES module (`index.js`) and CSS bundle (`index.css`). The HTML page loads both the built bundle (production) and the raw source (development, served by Vite's dev server). A `process.env.NODE_ENV` define was needed to fix a blank page caused by Zustand's development-mode checks in production builds.

### Decisions and Trade-offs

- **No AudioWorklet**: Decided against AudioWorklet for Phase 1 because the processing graph is built from native Web Audio nodes. AudioWorklet would only be needed for custom DSP (e.g., sample-accurate region scheduling), which was deferred.
- **Click-free gating**: Every audio connection goes through a GainNode "gate" that ramps between 0 and 1. This adds latency (~20ms ramp time) but eliminates audible pops when patching live.
- **Zustand over Redux**: Zustand's ability to read/write state from outside React components (e.g., in the audio engine or rAF loop) was the deciding factor. The graph store is accessed via `useGraphStore.getState()` in the reconciler.

---

## Phase 2a: Track Module and Transport

**Date:** 2026-02-12
**Commits:** Uncommitted (part of current working changes)
**Scope:** Spec items 9-14 (track module, transport, audio file playback)

### What Was Built

A Track module that loads audio files, displays a waveform thumbnail, and plays back through the modular graph in sync with a master transport. Users can load a WAV/MP3 file, connect Track → Gain → Master Output, press Play, and hear audio routed through their patch.

### New Components

#### Transport Store (`transport-store.ts`)

Separate Zustand store (not wrapped with Zundo, since transport state doesn't participate in undo/redo). State:
- `isPlaying`, `position` (seconds), `bpm`, `loopEnabled`, `loopStart`, `loopEnd`
- Actions: `play()`, `stop()`, `pause()`, `seek(position)`, `setBpm()`, `setLoop()`, `toggleLoop()`, `setPosition()`

Position is updated by a `requestAnimationFrame` loop in `useAudioEngine()` that reads `AudioContext.currentTime` and computes elapsed time from playback start.

#### Audio Buffer Cache (`audio-buffer-cache.ts`)

A module-level `Map<string, BufferEntry>` that stores decoded `AudioBuffer` objects alongside metadata (peaks, fileName, duration, channelCount, sampleRate). Buffers are referenced by a nanoid key (`bufferRef`) stored in the graph node's data, allowing the serializable graph to point to non-serializable audio data without breaking undo/redo.

Peak extraction (`extractPeaks()`) downsamples the buffer to N bins by computing the max absolute sample value per bin, averaging across channels. Used for waveform thumbnail rendering.

#### Shared AudioContext (`audio-context.ts`)

Singleton pattern: the engine calls `setSharedAudioContext(ctx)` during initialization, and any module can call `getSharedAudioContext()` to decode audio files. This replaced an earlier pattern where each file decode created a throwaway `AudioContext`.

#### Track Module

- **Manifest**: Type `track`, category `io`, stereo output, volume parameter (-70 to 6 dB).
- **Processor**: Creates a `GainNode` for volume control. `schedulePlayback()` creates a `BufferSourceNode`, connects it to the gain, and calls `source.start(when, offset)`. `stopPlayback()` stops and disconnects the source.
- **TrackNode.tsx**: File drop zone with drag-and-drop and click-to-upload. On file load: decodes via `AudioContext.decodeAudioData()`, extracts peaks, stores in buffer cache, updates node data with `bufferRef`. Displays waveform thumbnail via `drawWaveform()` and file info (name, duration). Volume slider reuses `NodeSlider`.

#### Transport Bar (`TransportBar.tsx`)

Bottom-center panel with SVG icon buttons: Return to Start, Play/Pause (toggles icon), Stop. Position display in `m:ss.d` format. Shared `formatTime()` utility used by both TransportBar and TrackNode.

#### Engine Integration

- `reconcile()` step 3b: Detects `bufferRef` changes on nodes and calls `processor.setBuffer(buffer)`.
- `startPlayback(offset)`: Iterates all processors, calls `schedulePlayback(ctx.currentTime, offset)`.
- `stopPlayback()`: Iterates all processors, calls `stopPlayback()`.
- `useAudioEngine()` subscribes to transport store: on play start, records `playbackStartCtxTime` and `playbackStartOffset`, starts rAF loop. On stop, cancels rAF and stops engine playback.

#### Keyboard Shortcuts

- `Space`: Toggle play/pause
- `Enter`: Seek to position 0

### Code Quality Pass

After Phase 2a implementation, a code audit identified and fixed:
1. **Deleted unused `selectors.ts`**: Contained `selectNodeById` and `selectEdgesForNode` that were never imported.
2. **Consolidated time formatting**: Extracted `formatTime()` into `src/utils/format-time.ts`, replacing duplicate implementations in TransportBar and TrackNode.
3. **Shared AudioContext**: Created `audio-context.ts` to eliminate wasteful `new AudioContext()` per file decode.
4. **Error handling**: Added user-facing error message in TrackNode when audio decode fails.
5. **Unmount safety**: Added `mountedRef` pattern to prevent state updates after component unmount during async file decode.

---

## Phase 2b: Waveform Editor Panel

**Date:** 2026-02-12
**Commits:** Uncommitted (part of current working changes)
**Scope:** Spec items 15-18 (editor panel, region model, editing tools, grid/snap)

### What Was Built

A resizable bottom panel showing a zoomable waveform timeline for the selected track. Users double-click a track node to open the editor, where they can move, trim, and slice audio regions on a timeline. Playback is now region-based: only scheduled regions produce sound, with micro-crossfade envelopes at edit boundaries.

### New Concepts

#### Region Data Model

A `Region` represents a slice of audio placed on the timeline:
```typescript
interface Region {
  id: string;
  trackId: string;          // which track node owns this region
  bufferRef: string;        // key into audio buffer cache
  position: number;         // where on the timeline it starts (seconds)
  sourceOffset: number;     // offset into the source buffer (seconds)
  duration: number;         // how long the region plays (seconds)
  fadeIn: number;           // fade-in duration (seconds)
  fadeOut: number;          // fade-out duration (seconds)
}
```

This is an Edit Decision List (EDL) model. The original audio file is never modified. Regions describe which portion of the source buffer to play and where to place it on the timeline. Multiple regions can reference the same buffer. Trimming adjusts `sourceOffset` and `duration` without affecting the underlying audio data.

#### Editor Store

Separate Zustand store with Zundo for undo/redo on region edits. Contains:
- Panel state: `isOpen`, `selectedTrackId`
- View state: `zoom` (pixels per second, 10-1000), `scrollX` (horizontal offset in seconds)
- Tool state: `activeTool` (`pointer` | `trim` | `slice`)
- Grid state: `gridResolution` (beat-based or time-based presets), `snapEnabled`
- Region data: `regions` (keyed by track ID), `selectedRegionIds`
- Actions: `addRegion`, `updateRegion`, `removeRegion`, `splitRegion`, `openEditor`, `closeEditor`

Grid presets include beat-based values (1 bar, 1/2 note, 1/4 note, 1/8 note, 1/16 note) that resolve to seconds based on BPM, plus fixed time values (1s, 0.5s, 0.1s) and Free mode (no snap).

#### Two-Canvas Rendering

The editor uses two overlapping canvases:
1. **TimelineCanvas** (static): Redrawn on zoom, scroll, or region edit. Renders grid lines, region rectangles with waveform peaks inside, fade indicators, and selection highlights.
2. **PlayheadOverlay** (animated): Redrawn every frame via `requestAnimationFrame`. Renders only the playhead line and triangle indicator. This avoids redrawing the full waveform 60 times per second.

#### Multi-Resolution Peaks Cache

The `peaks-cache.ts` module stores pre-computed peak data at multiple zoom levels per buffer. When the editor zooms, it picks the closest cached resolution (within 50% of desired bins) or computes a new one. Cache is bounded to 5 entries per buffer.

### Implementation Details

#### Editor Panel Layout

The editor panel uses a flex layout within a new `.daw-canvas-wrapper`:
```
┌─────────────────────────────────┐
│         React Flow Canvas       │  flex: 1 (shrinks when editor opens)
│                                 │
├─────────────────────────────────┤  ← resize handle (drag to adjust)
│ [V] [T] [S] | Snap [1/4] | -+  │  ← EditorToolbar
│ ────────────────────────────────│  ← TimeRuler (24px)
│ ┌───────┐    ┌───────┐         │
│ │region │    │region │         │  ← TimelineCanvas + PlayheadOverlay
│ │  ~~~  │    │  ~~~  │         │
│ └───────┘    └───────┘         │
└─────────────────────────────────┘
```

The wrapper expands from 70vh to 90vh when the editor opens. The resize handle allows manual height adjustment between 120px and 500px.

#### Tool Behaviors

**Pointer tool**: Click a region to select it. Shift+click to add to selection. Drag to move regions horizontally (snaps to grid when enabled). Click on empty space to deselect and seek to that position.

**Trim tool**: Near region edges (within 6px), the cursor changes to col-resize. Dragging the left edge adjusts `position`, `sourceOffset`, and `duration` simultaneously (revealing or hiding the start of the audio). Dragging the right edge adjusts only `duration`. Both operations snap to grid. A 5ms micro-crossfade is applied at trimmed edges.

**Slice tool**: Hover shows a vertical cut line. Clicking on a region calls `splitRegion()`, which creates two new regions from the original with adjusted positions, offsets, and durations. Both halves receive 5ms crossfades at the cut point. Undo restores the original single region.

#### Region-Based Playback

The track processor was rewritten to schedule audio from regions instead of playing the entire buffer. When `schedulePlayback(startTime, offset)` is called:

1. Iterate all regions assigned to this track
2. Skip regions that end before the playback offset
3. For each overlapping region, create a `BufferSourceNode` with precise timing:
   - `source.start(when, sourceOffset + localOffset, remainingDuration)`
4. Create a per-source `GainNode` for fade envelope automation:
   - Fade in: `gain.setValueAtTime(0, when); gain.linearRampToValueAtTime(1, when + fadeIn)`
   - Fade out: `gain.linearRampToValueAtTime(0, when + duration)`
5. Track all active sources for cleanup on stop

The `useAudioEngine` hook subscribes to editor store region changes. When regions change during playback, it stops and reschedules all tracks from the current position to reflect the edits in real time.

#### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| Space | Play/Pause | Always |
| Enter | Seek to 0 | Always |
| V | Pointer tool | Editor open |
| T | Trim tool | Editor open |
| S | Slice tool | Editor open |
| G | Toggle snap | Editor open |
| Delete/Backspace | Delete selected regions | Editor open |
| Escape | Deselect all, then close editor | Editor open |

### New Files

```
src/types/region.ts              # Region, EditorTool, GridResolution
src/store/editor-store.ts        # Editor state with Zundo undo/redo
src/utils/grid.ts                # snapToGrid(), getGridLines()
src/utils/peaks-cache.ts         # Multi-resolution peaks cache
src/components/WaveformEditor.tsx # Editor panel shell with resize
src/components/editor/
  EditorToolbar.tsx              # Tool buttons, grid selector, zoom
  TimelineCanvas.tsx             # Waveform + region rendering + tool interaction
  TimeRuler.tsx                  # Time axis with adaptive tick intervals
  PlayheadOverlay.tsx            # rAF-driven playhead
src/styles/editor.css            # Editor panel styles
```

### Modified Files

| File | Changes |
|------|---------|
| `types/audio.ts` | Added `setRegions?()` to ProcessorInstance |
| `modules/track/processor.ts` | Rewrote for region-based scheduling with fade envelopes |
| `modules/track/TrackNode.tsx` | Auto-creates region on file load, double-click opens editor |
| `audio/engine.ts` | Added `updateTrackRegions()` method |
| `hooks/use-audio-engine.ts` | Subscribes to editor store, pushes regions to engine |
| `components/Canvas.tsx` | Renders WaveformEditor, keyboard shortcuts for tools |
| `styles/index.css` | Flex wrapper layout for canvas + editor panel |

---

## Phase 2c: Solo/Mute and Multi-Track Editing

Phase 2c adds two features: Solo/Mute controls on module nodes (with graph-traversal-based solo resolution), and multi-track editing in the waveform editor panel.

### Solo/Mute System

**The problem:** In a DAW, users need to quickly isolate or silence individual tracks. In a modular environment, "silencing a track" is more complex than setting gain to zero, because the signal graph is user-defined, so the system must trace downstream connections to determine which modules should remain active.

**Solo/Mute resolver (`solo-mute-resolver.ts`):** A pure function that takes the current graph state and returns a `Map<nodeId, isMuted>`. The algorithm:
1. If no nodes are soloed, each node uses its own `muted` flag.
2. If any nodes are soloed, BFS downstream from all soloed nodes to build a "reachable" set.
3. Solo-safe nodes (e.g., Master Output, declared via `soloSafe: true` in the module manifest) are always reachable.
4. Any node not in the reachable set is effectively muted. Explicitly muted nodes are muted regardless of solo state.

**Engine integration:** The `applyMuteState()` method on `AudioEngine` ramps connection gate GainNodes to 0 or 1 based on the mute map. This reuses the existing gate infrastructure (GainNodes created for click-free connect/disconnect) rather than adding new audio nodes.

**Solo behavior:**
- Click S: exclusive solo (un-solos all others, solos this one)
- Shift+click S: additive solo (toggles this track's solo without affecting others)
- Mute always overrides solo (a muted+soloed track is silent)

**Visual feedback:**
- Muted nodes: red M button, node dimmed to 40% opacity
- Soloed nodes: amber S button, amber glow border
- Non-reachable nodes (during solo): dimmed to 40% opacity

### Multi-Track Editing

**The change:** The editor store's `selectedTrackId: string | null` became `selectedTrackIds: string[]`. This allows the waveform editor panel to display multiple tracks simultaneously.

**Interaction:**
- Double-click a track: opens the editor with just that track (replaces any existing selection)
- Shift+double-click: toggles a track in/out of the editor selection (additive)
- Toolbar shows tag chips for each open track, with × buttons to remove individual tracks
- Closing the last track closes the entire editor panel

**Layout:** When multiple tracks are selected, the editor panel renders stacked lanes (one `TimelineCanvas` per track). All lanes share the same zoom, scroll position, and playhead. Each lane shows a small label with the track's file name. Lanes are separated by subtle borders.

**TimelineCanvas refactor:** The component now accepts a `trackId` prop instead of reading `selectedTrackId` from the store. This makes it a pure, reusable component: each lane instance renders only the regions belonging to its track.

### New Files

```
src/audio/solo-mute-resolver.ts   # Pure function for graph-based mute resolution
src/hooks/use-mute-state.ts       # useMuteMap() and useAnySoloed() hooks
```

### Modified Files

| File | Changes |
|------|---------|
| `types/modules.ts` | Added `soloSafe?: boolean` to ModuleManifest |
| `types/graph.ts` | Added `muted?: boolean`, `soloed?: boolean` to DawNode.data |
| `store/graph-store.ts` | Added `toggleMute()`, `toggleSolo()`, `clearAllSolo()` actions |
| `store/editor-store.ts` | Changed `selectedTrackId` to `selectedTrackIds[]`, added `toggleTrackInEditor()` |
| `audio/engine.ts` | Added `applyMuteState()` method |
| `hooks/use-audio-engine.ts` | Calls `resolveMuteState()` after every reconcile |
| `modules/master-output/manifest.ts` | Added `soloSafe: true` |
| `modules/track/TrackNode.tsx` | S/M buttons, shift-double-click, dimmed/soloed classes |
| `modules/test-tone/TestToneNode.tsx` | S/M buttons, dimmed/soloed classes |
| `modules/gain/GainModuleNode.tsx` | M button, dimmed class |
| `components/WaveformEditor.tsx` | Stacked track lanes, per-track label |
| `components/editor/TimelineCanvas.tsx` | Accepts `trackId` prop |
| `components/editor/EditorToolbar.tsx` | Multi-track tag chips |
| `styles/nodes.css` | S/M button styles, header flex layout, dimmed/soloed states |
| `styles/editor.css` | Track lane styles, track tag styles |

---

## Future Phases (Planned)

### Phase 3: Effects and Routing

- Filter module (high-pass, low-pass, band-pass, parametric EQ)
- Delay module with feedback and mix controls
- Reverb module (ConvolverNode with impulse response loading)
- Bus/send routing for parallel processing
- Metering on all modules (peak, RMS, spectrum)

### Phase 4: Arrangement and Export

- Arrangement view (linear timeline with all tracks)
- Clip-based arrangement editing
- Offline rendering via `OfflineAudioContext`
- WAV/MP3 export
- Project save/load (serializable graph + regions + buffer references)

---

## File Inventory

Complete list of source files as of Phase 2c:

```
src/
  main.tsx
  App.tsx
  audio/
    audio-context.ts
    engine.ts
    channel-utils.ts
    solo-mute-resolver.ts
  components/
    Canvas.tsx
    ModulePanel.tsx
    NodeSlider.tsx
    Toolbar.tsx
    TransportBar.tsx
    WaveformEditor.tsx
    editor/
      EditorToolbar.tsx
      PlayheadOverlay.tsx
      TimeRuler.tsx
      TimelineCanvas.tsx
  edges/
    AudioEdge.tsx
    ParameterEdge.tsx
    edge-types.ts
  hooks/
    use-audio-engine.ts
    use-mute-state.ts
    use-undo-redo.ts
  modules/
    registry.ts
    index.ts
    master-output/
      manifest.ts
      processor.ts
      MasterOutputNode.tsx
    test-tone/
      manifest.ts
      processor.ts
      TestToneNode.tsx
    gain/
      manifest.ts
      processor.ts
      GainModuleNode.tsx
    track/
      manifest.ts
      processor.ts
      TrackNode.tsx
      waveform-utils.ts
  store/
    graph-store.ts
    transport-store.ts
    editor-store.ts
    audio-buffer-cache.ts
  types/
    graph.ts
    audio.ts
    modules.ts
    region.ts
  utils/
    format-time.ts
    grid.ts
    peaks-cache.ts
    vite-env.d.ts
  styles/
    index.css
    canvas.css
    nodes.css
    edges.css
    editor.css
```

**Dependencies:** React 18, React Flow 12, Zustand 5, Zundo 2, nanoid 5
**Build:** Vite 6, TypeScript 5.7
**Output:** ~528 KB JS + ~30 KB CSS (uncompressed), ~137 KB + ~4.8 KB gzipped
