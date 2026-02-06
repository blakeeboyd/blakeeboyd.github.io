# Explorable Explanations & Interactive Audio Inspiration

Research on sites with interactive audio, explorable explanations, and features worth adopting.

---

## Tier 1: Gold Standard (Study These Closely)

### Bartosz Ciechanowski (ciechanow.ski)

The best explorable explanations on the web. His [Sound article](https://ciechanow.ski/sound/) is directly relevant.

**Interactive Features:**
- Musical keyboard playable via mouse or keyboard (W/E/R keys)
- 3D air particle simulations with time-flow sliders
- Custom waveform drawing → hear the result
- Frequency/amplitude sliders showing pitch/loudness relationship
- Fourier decomposition: input waveforms, see component sine waves
- Draggable ear icons in spatial environments (interference, Doppler)
- Real-time microphone frequency analyzer

**Patterns to Adopt:**
- Sliders that update visualizations AND audio simultaneously
- Drawing tools that generate sound from user input
- Draggable elements in 2D/3D space
- Time-scrubbing for slow-motion physics

**Other Articles:** [Gears](https://ciechanow.ski/gears/), [Bicycle](https://ciechanow.ski/bicycle/), [Lights and Shadows](https://ciechanow.ski/lights-and-shadows/)

---

### Ableton Learning Music & Learning Synths

**[Learning Music](https://learningmusic.ableton.com/)** - Fundamentals of music through interactive exercises.

**[Learning Synths](https://learningsynths.ableton.com/)** - Synthesis education with a browser-based monosynth.

**Interactive Features:**
- Step-by-step lessons with embedded synth
- Two-oscillator monosynth runs entirely in browser
- Interactive components for oscillators, filters, envelopes, LFOs
- MIDI controller support (Chrome)
- Playground mode for free experimentation

**Patterns to Adopt:**
- Lesson flow with embedded interactive components
- "Playground" mode after structured learning
- Clean UI that doesn't overwhelm beginners
- Progressive disclosure of complexity

---

### Jez Swanson's Fourier Introduction

**[An Interactive Introduction to Fourier Transforms](https://www.jezzamon.com/fourier/)**

**Interactive Features:**
- Slider to add/remove sine waves from square wave (with audio)
- "Draw here!" tool → see Fourier decomposition
- Epicycle visualization with circle count slider
- Custom drawing reconstructed by rotating circles
- Play buttons for Full Wave, High Frequency, Low Frequency
- JPEG compression quality slider on real image

**Patterns to Adopt:**
- Drawing input → mathematical visualization → audio output
- Sliders that add/remove components
- Multiple output modes (visual + audio) for same data
- Real-world application demos (JPEG compression)

---

### Nicky Case (ncase.me)

Pioneer of explorable explanations. Focus on systems thinking.

**Notable Projects:**
- [The Evolution of Trust](https://ncase.me/trust/) - Game theory through prisoner's dilemma
- [Parable of the Polygons](https://ncase.me/polygons/) - How small biases create segregation
- [LOOPY](https://ncase.me/loopy/) - Tool for drawing causal loop diagrams
- [To Build a Better Ballot](https://ncase.me/ballot/) - Voting systems comparison

**Patterns to Adopt:**
- Explain systems, not just facts
- Let users manipulate variables and see consequences
- Narrative flow with embedded simulations
- Playful tone that doesn't sacrifice rigor

---

### Seeing Theory (Brown University)

**[seeing-theory.brown.edu](https://seeing-theory.brown.edu/)**

18 interactive visualizations for probability and statistics, built with D3.js.

**Interactive Features:**
- Real-time parameter manipulation (bias coins, change sample size)
- Immediate visual feedback as variables change
- Concise explanations alongside each visualization

**Patterns to Adopt:**
- "What happens if...?" invitation to explore
- Side-by-side text explanation + interactive visualization
- Clean, focused single-concept pages

---

## Tier 2: Audio-Focused Tools

### Chrome Music Lab

**[musiclab.chromeexperiments.com](https://musiclab.chromeexperiments.com/)**

Collection of experiments for exploring how music works. Open source (Web Audio API, Tone.js).

**Experiments:**
- **Song Maker** - Grid-based composition
- **Rhythm** - Tap out patterns, understand meter
- **Kandinsky** - Draw shapes that make sounds
- **Spectrogram** - See frequency content of sounds
- **Sound Waves** - Visualize speaker cone movement
- **Harmonics** - Toggle individual harmonics of a tone

**Patterns to Adopt:**
- Separate focused experiments vs. one monolithic tool
- No sign-up, works in any browser
- Share/export functionality for creations
- Extreme accessibility (works for children)

**Source:** [github.com/googlecreativelab/chrome-music-lab](https://github.com/googlecreativelab/chrome-music-lab)

---

### Groove Pizza (NYU MusEDLab)

**[apps.musedlab.org/groovepizza](https://apps.musedlab.org/groovepizza/)**

Drum sequencer wrapped into a circle to visualize rhythm symmetry.

**Interactive Features:**
- Circular time representation (pizza slices = beats)
- Shape-based rhythm creation
- Export as audio or MIDI
- Integration with Soundtrap, Noteflight, Flat.io
- Accessible version with keyboard controls and audio cues

**Patterns to Adopt:**
- Non-linear time visualization
- Mathematical concepts (symmetry, angles) embedded naturally
- Multiple export formats for different workflows

---

### EarSketch (Georgia Tech)

**[earsketch.gatech.edu](https://earsketch.gatech.edu/earsketch2/)**

Coding education through music production.

**Components:**
- Python/JavaScript API for music
- DAW visualization in browser
- Loop library (samples from Young Guru, Richard Devine)
- Educational curriculum

**Patterns to Adopt:**
- Code → audio feedback loop
- Professional-quality samples elevate experience
- Curriculum integration for classroom use

---

### Patatap & Typatone

**[patatap.com](https://patatap.com/)** - Each keyboard key triggers unique sound + animation.

**[typatone.com](https://typatone.com/)** - Each letter corresponds to a musical note; typing becomes composition.

**Patterns to Adopt:**
- Immediate audiovisual feedback
- Keyboard as instrument
- Multiple "moods" that change timbre/tempo
- Synesthetic design (sound ↔ color/shape)

---

## Tier 3: Technical References

### Wavesurfer.js

**[wavesurfer.xyz](https://wavesurfer.xyz/)**

Audio waveform visualization library.

**Features:**
- Interactive waveform rendering
- Regions (visual overlays for audio sections)
- Timeline with notches and labels
- Minimap for navigation
- Envelope editor for fade in/out
- Recording from microphone
- Spectrogram plugin

**Use Cases:** Add waveform display to audio projects.

---

### Peaks.js (BBC)

**[github.com/bbc/peaks.js](https://github.com/bbc/peaks.js)**

Waveform navigation and annotation.

**Features:**
- Zoom and scroll through audio
- Segment markers and point markers
- Designed for long-form audio editing

**Use Cases:** Add waveform navigation to longer audio files.

---

### Web Audio Lab

**[webaudiolab.com](https://webaudiolab.com/)**

Interactive educational platform for Web Audio API and DSP.

**Use Cases:** Reference for learning Web Audio patterns.

---

### Academo Spectrum Analyzer

**[academo.org/demos/spectrum-analyzer](https://academo.org/demos/spectrum-analyzer/)**

Simple spectrogram visualization.

**Features:**
- Real-time frequency display
- Input from microphone or file

**Use Cases:** Simple, focused reference implementation.

---

### Omnitone (Google)

**[github.com/GoogleChrome/omnitone](https://github.com/GoogleChrome/omnitone)**

Ambisonic decoding with binaural rendering in Web Audio.

**Note:** Already using this in Stereo Mic Techniques project.

---

## Tier 4: Visual Essay Publishers

### The Pudding

**[pudding.cool](https://pudding.cool/)**

Data-driven visual essays. Technology: D3.js, Svelte.

**Notable Audio Projects:**
- Billboard song timeline playing snippets proportional to chart duration
- Various music analysis pieces

**Patterns to Adopt:**
- Scroll-driven narrative with embedded interactivity
- High production value
- Audio snippets triggered by scroll position

---

### 3Blue1Brown / Manim

**[3blue1brown.com](https://www.3blue1brown.com/)** | **[github.com/3b1b/manim](https://github.com/3b1b/manim)**

Math visualization (video, not interactive), but excellent pedagogical model.

**Relevant:** [Fourier Transform video](https://www.3blue1brown.com/lessons/fourier-transforms) begins with decomposing frequencies in sound waves.

**Patterns to Adopt:**
- Building intuition before formalism
- Animation that reveals structure progressively
- "Circles drawing pictures" visualization for Fourier

---

## Feature Ideas by Category

### Drawing/Input → Sound

| Feature | Example | Complexity |
|---------|---------|------------|
| Draw waveform, hear result | Ciechanowski, Jezzamon | Medium |
| Draw path, epicycles trace it | Jezzamon, myfourierepicycles.com | Medium |
| Draw shape, sonify it | Chrome Music Lab Kandinsky | Medium |
| Type text, hear music | Typatone | Low |

### Frequency Visualization

| Feature | Example | Complexity |
|---------|---------|------------|
| Real-time spectrogram | Chrome Music Lab, Academo | Medium |
| Harmonic toggle | Chrome Music Lab Harmonics | Low |
| Fourier decomposition slider | Jezzamon | Medium |
| Microphone frequency analysis | Ciechanowski | Medium |

### Spatial Audio

| Feature | Example | Complexity |
|---------|---------|------------|
| Drag listener position | Ciechanowski, MDN demos | Medium |
| Ambisonic to binaural | Omnitone (already have) | High |
| HRTF visualization | Research tools | High |

### Synthesis

| Feature | Example | Complexity |
|---------|---------|------------|
| Modular synth builder | mod-synth.io | High |
| Envelope ADSR editor | Learning Synths | Medium |
| Filter frequency/Q control | Learning Synths | Low |
| LFO modulation visual | Learning Synths | Medium |

### Game/Quiz

| Feature | Example | Complexity |
|---------|---------|------------|
| Frequency matching game | EQ Training (already have) | Done |
| Interval recognition | Various ear training apps | Medium |
| Rhythm reproduction | Chrome Music Lab Rhythm | Medium |
| A/B comparison scoring | EQ Training | Done |

### Navigation/UX

| Feature | Example | Complexity |
|---------|---------|------------|
| Scroll-driven audio | The Pudding | Medium |
| Playground mode | Learning Synths | Low |
| Share/export creations | Groove Pizza | Medium |
| Keyboard shortcuts | Patatap | Low |

---

## Implementation Priority

### Quick Wins (features to add soon)

1. **Keyboard shortcuts for technique switching** (Stereo Mic) - already noted in IMPROVEMENTS.md
2. **Waveform visualization** - add wavesurfer.js or canvas-based display
3. **Drawing-to-sound tool** - new explorable explanation

### Medium Effort

4. **Fourier decomposition visualization** - pairs well with Cancelled Harmonics
5. **Scroll-driven audio snippets** - for guide pages
6. **Spectrogram view option** - extend existing projects

### Larger Projects

7. **Full synth playground** - Learning Synths style
8. **Modular audio routing visualizer** - show Web Audio graph
9. **Interval/chord recognition trainer** - new ear training tool

---

## Sources

- [Bartosz Ciechanowski](https://ciechanow.ski/)
- [Ableton Learning Music](https://learningmusic.ableton.com/)
- [Ableton Learning Synths](https://learningsynths.ableton.com/)
- [Jez Swanson's Fourier Introduction](https://www.jezzamon.com/fourier/)
- [Nicky Case](https://ncase.me/)
- [Seeing Theory](https://seeing-theory.brown.edu/)
- [Chrome Music Lab](https://musiclab.chromeexperiments.com/)
- [Groove Pizza](https://apps.musedlab.org/groovepizza/)
- [EarSketch](https://earsketch.gatech.edu/earsketch2/)
- [Patatap](https://patatap.com/)
- [Typatone](https://typatone.com/)
- [Wavesurfer.js](https://wavesurfer.xyz/)
- [Peaks.js](https://github.com/bbc/peaks.js)
- [The Pudding](https://pudding.cool/)
- [3Blue1Brown](https://www.3blue1brown.com/)
- [Tone.js Demos](https://tonejs.github.io/demos)
- [awesome-webaudio](https://github.com/notthetup/awesome-webaudio)
- [awesome-audio-visualization](https://github.com/willianjusten/awesome-audio-visualization)
- [awesome-explorables](https://github.com/blob42/awesome-explorables)
