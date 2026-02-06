# Modular Synth Roadmap

## Milestone 1 (Current): Simplest Working System
4 fixed modules: VCO, VCA, Scope, Output. Patch cables with SVG Bezier rendering. Basic signal flow and waveform exploration.

## Milestone 2: Modulation
- **LFO module**: OscillatorNode at low frequency (0.1-20 Hz). Waveform selector, rate knob, depth knob. CV output port. Connect to VCA CV input for tremolo, or VCO frequency for vibrato.
- **ADSR Envelope module**: Attack, Decay, Sustain, Release knobs. Gate input, CV output. Visual envelope shape display. Trigger via a simple gate button or keyboard.
- **Keyboard/Gate module**: On-screen keyboard or computer keyboard input. Gate output (for ADSR), pitch CV output (for VCO). Enables playing notes with proper envelope shaping.
- Wire up VCA's CV input to accept audio-rate modulation from LFO/ADSR.

## Milestone 3: Subtractive Synthesis
- **VCF module**: BiquadFilterNode. Filter type selector (lowpass, highpass, bandpass). Cutoff frequency knob, resonance (Q) knob. Audio in, audio out, CV input for cutoff modulation.
- Classic subtractive patch: VCO → VCF → VCA → Output, with ADSR controlling both VCF cutoff and VCA level.
- **Noise module**: White/pink noise source (AudioWorklet or buffer). Useful for percussion, texture, and filter sweeps.

## Milestone 4: Advanced Features
- **Module dragging**: Reposition modules freely on the rack. Cables update dynamically.
- **Module palette**: Add/remove module instances from a palette. Multiple VCOs, VCAs, etc.
- **Mixer module**: Combine multiple audio signals with level controls per input.
- **Spectrum Analyzer module**: Frequency-domain visualization (FFT) to complement the time-domain Scope.
- **Save/load patches**: Export/import patch state as JSON (module positions, control values, connections).

## Milestone 5: Educational Guided Mode
- Structured lessons (inspired by Syntorial and Ableton Learning Synths)
- Progressive disclosure: start with VCO + Output, unlock modules as concepts are learned
- Challenge mode: "recreate this sound" exercises
- Tooltips and contextual help explaining each module and connection

## Milestone 6: Extended Synthesis
- **FM synthesis**: VCO modulating another VCO's frequency at audio rate
- **Ring modulation**: Multiply two signals together
- **Delay module**: DelayNode for echo effects and Karplus-Strong physical modeling
- **Wavefolder/Waveshaper**: WaveShaperNode for non-linear distortion
- **Sample & Hold**: Periodic sampling of input signal (staircase modulation)
- **Sequencer module**: Step sequencer outputting CV and gate patterns

## Research Notes

### Cable rendering
- SVG Bezier is sufficient for <100 cables. Canvas only needed at scale.
- Catenary math is overkill. Simple Bezier droop with gravity-biased control points works well.
- Spring physics (damped harmonic oscillator) could add wobble animation on connect (nice-to-have).

### Anti-aliasing
- Web Audio OscillatorNode is band-limited by spec. No aliasing concerns for built-in waveforms.
- PeriodicWave is also band-limited. Custom waveforms via Fourier coefficients are safe.
- LFOs: sine and triangle are clean. Sawtooth/square LFO at low rates have negligible band-limiting ripple.
- Only risk is in custom AudioWorkletProcessor code (avoid naive sawtooth implementations).

### Key Web Audio patterns
- `setTargetAtTime(value, startTime, timeConstant)` for smooth parameter changes (0.02 = 20ms)
- `exponentialRampToValueAtTime` cannot reach 0 (use 0.0001 as floor)
- GainNode gates on connections prevent clicks: ramp 0→1 on connect, 1→0 on disconnect
- AudioParam.connect() enables audio-rate modulation (the key to FM/AM synthesis)
- Feedback loops require at least one DelayNode in the cycle

### Existing tools surveyed
- Ableton Learning Synths (RNBO, progressive lessons)
- Patchcab (Svelte + Tone.js, Eurorack-style)
- NoiseCraft (vanilla JS, compiles graph to AudioWorklet)
- Syntorial (190+ lessons, ear-based challenges)
- Chrome Music Lab (Tone.js, single-concept experiments)
- Web Audio Synth by Smilebags (TypeScript, 30+ modules)
- Cables.gl, JSPatcher, AudioNodes, Zupiter, Web Synth by Ameobea

### Framework candidates (decided against for M1)
- Litegraph.js: vanilla JS, Canvas-based, best framework fit but overkill for 4 modules
- Drawflow: vanilla JS, SVG, 14KB, designed for flowcharts not synths
- Custom SVG: chosen approach. ~300 lines of focused cable code, no dependencies.
