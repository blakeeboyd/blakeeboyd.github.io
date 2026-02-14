/**
 * Atomic DSP Primitive Processors
 *
 * These AudioWorkletProcessors are the irreducible building blocks from which
 * all composite modules (compressor, EQ, delay, etc.) are constructed.
 * Each operates sample-by-sample on 128-sample frames.
 */

// ─── Math Operations ────────────────────────────────────────────────────────

class MultiplyProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      if (aCh && bCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = aCh[i] * bCh[i];
        }
      }
    }
    return true;
  }
}
registerProcessor('multiply-processor', MultiplyProcessor);

class AddProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      if (aCh && bCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = aCh[i] + bCh[i];
        }
      } else if (aCh) {
        outCh.set(aCh);
      } else if (bCh) {
        outCh.set(bCh);
      }
    }
    return true;
  }
}
registerProcessor('add-processor', AddProcessor);

class SubtractProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      if (aCh && bCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = aCh[i] - bCh[i];
        }
      } else if (aCh) {
        outCh.set(aCh);
      }
    }
    return true;
  }
}
registerProcessor('subtract-processor', SubtractProcessor);

class AbsProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = Math.abs(inCh[i]);
        }
      }
    }
    return true;
  }
}
registerProcessor('abs-processor', AbsProcessor);

// ─── Comparison Operations ──────────────────────────────────────────────────

class MaxProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      if (aCh && bCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = Math.max(aCh[i], bCh[i]);
        }
      } else if (aCh) {
        outCh.set(aCh);
      } else if (bCh) {
        outCh.set(bCh);
      }
    }
    return true;
  }
}
registerProcessor('max-processor', MaxProcessor);

class CompareGtProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      if (aCh && bCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = aCh[i] > bCh[i] ? 1.0 : 0.0;
        }
      }
    }
    return true;
  }
}
registerProcessor('compare-gt-processor', CompareGtProcessor);

// ─── Signal Operations ──────────────────────────────────────────────────────

class UnitDelayProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._prev = new Float32Array(8); // up to 8 channels
  }
  process(inputs, outputs) {
    const input = inputs[0];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        // First sample gets the stored previous value
        outCh[0] = this._prev[ch];
        for (let i = 1; i < outCh.length; i++) {
          outCh[i] = inCh[i - 1];
        }
        this._prev[ch] = inCh[inCh.length - 1];
      }
    }
    return true;
  }
}
registerProcessor('unit-delay-processor', UnitDelayProcessor);

class SelectorProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const a = inputs[0];
    const b = inputs[1];
    const ctrl = inputs[2];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const aCh = a[0] ? a[0][ch] || a[0][0] : null;
      const bCh = b[0] ? b[0][ch] || b[0][0] : null;
      const cCh = ctrl[0] ? ctrl[0][ch] || ctrl[0][0] : null;
      if (aCh && bCh && cCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = cCh[i] >= 0.5 ? bCh[i] : aCh[i];
        }
      } else if (aCh) {
        outCh.set(aCh);
      }
    }
    return true;
  }
}
registerProcessor('selector-processor', SelectorProcessor);

class ConstantProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'value', defaultValue: 0, automationRate: 'a-rate' }];
  }
  process(_inputs, outputs, parameters) {
    const out = outputs[0];
    const values = parameters.value;
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      if (values.length === 1) {
        outCh.fill(values[0]);
      } else {
        outCh.set(values);
      }
    }
    return true;
  }
}
registerProcessor('constant-processor', ConstantProcessor);

// ─── Conversion Operations ──────────────────────────────────────────────────

class DbToLinProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        for (let i = 0; i < outCh.length; i++) {
          outCh[i] = Math.pow(10, inCh[i] / 20);
        }
      }
    }
    return true;
  }
}
registerProcessor('db-to-lin-processor', DbToLinProcessor);

class LinToDbProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    const out = outputs[0];
    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        for (let i = 0; i < outCh.length; i++) {
          const val = Math.abs(inCh[i]);
          outCh[i] = val > 1e-10 ? 20 * Math.log10(val) : -200;
        }
      }
    }
    return true;
  }
}
registerProcessor('lin-to-db-processor', LinToDbProcessor);

// ─── Visualization ──────────────────────────────────────────────────────────

class ProbeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._counter = 0;
  }
  process(inputs, outputs) {
    const input = inputs[0];
    const out = outputs[0];
    // Pass through
    for (let ch = 0; ch < out.length; ch++) {
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        out[ch].set(inCh);
      }
    }
    // Report value every ~100ms (at 44100 Hz, 128 samples/frame, ~344 frames/sec)
    this._counter++;
    if (this._counter >= 34) {
      this._counter = 0;
      const ch0 = input[0] && input[0][0] ? input[0][0] : null;
      if (ch0) {
        this.port.postMessage({ value: ch0[0], peak: Math.max(...ch0.map(Math.abs)) });
      }
    }
    return true;
  }
}
registerProcessor('probe-processor', ProbeProcessor);

// ─── Compressor-specific functional blocks ──────────────────────────────────

class EnvelopeDetectorProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'attack', defaultValue: 0.003, automationRate: 'k-rate' },
      { name: 'release', defaultValue: 0.25, automationRate: 'k-rate' },
    ];
  }
  constructor() {
    super();
    this._envelope = 0;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const out = outputs[0];
    const attackTime = parameters.attack[0];
    const releaseTime = parameters.release[0];
    const sr = sampleRate;
    // Convert time to one-pole coefficient
    const attackCoeff = attackTime > 0 ? 1 - Math.exp(-1 / (sr * attackTime)) : 1;
    const releaseCoeff = releaseTime > 0 ? 1 - Math.exp(-1 / (sr * releaseTime)) : 1;

    const inCh = input[0] ? input[0][0] : null;
    if (inCh) {
      const outCh = out[0];
      for (let i = 0; i < inCh.length; i++) {
        const rectified = Math.abs(inCh[i]);
        const coeff = rectified > this._envelope ? attackCoeff : releaseCoeff;
        this._envelope = coeff * rectified + (1 - coeff) * this._envelope;
        // Output as dB
        outCh[i] = this._envelope > 1e-10 ? 20 * Math.log10(this._envelope) : -200;
      }
      // Copy to other output channels
      for (let ch = 1; ch < out.length; ch++) {
        out[ch].set(outCh);
      }
    }
    return true;
  }
}
registerProcessor('envelope-detector-processor', EnvelopeDetectorProcessor);

class GainComputerProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'threshold', defaultValue: -18, automationRate: 'k-rate' },
      { name: 'ratio', defaultValue: 4, automationRate: 'k-rate' },
    ];
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const out = outputs[0];
    const threshold = parameters.threshold[0];
    const ratio = parameters.ratio[0];

    const inCh = input[0] ? input[0][0] : null;
    if (inCh) {
      const outCh = out[0];
      for (let i = 0; i < inCh.length; i++) {
        const levelDb = inCh[i];
        const excess = Math.max(0, levelDb - threshold);
        // Output gain reduction as negative dB
        outCh[i] = -(excess * (1 - 1 / ratio));
      }
      for (let ch = 1; ch < out.length; ch++) {
        out[ch].set(outCh);
      }
    }
    return true;
  }
}
registerProcessor('gain-computer-processor', GainComputerProcessor);

// ─── Gate Processor ─────────────────────────────────────────────────────────

class GateProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'threshold', defaultValue: -40, automationRate: 'k-rate' },
      { name: 'attack', defaultValue: 0.001, automationRate: 'k-rate' },
      { name: 'hold', defaultValue: 0.05, automationRate: 'k-rate' },
      { name: 'release', defaultValue: 0.1, automationRate: 'k-rate' },
      { name: 'range', defaultValue: -80, automationRate: 'k-rate' },
    ];
  }
  constructor() {
    super();
    this._envelope = 0;
    this._holdCounter = 0;
    this._gateGain = 0;
    this._reportCounter = 0;
  }
  process(inputs, outputs, parameters) {
    const audio = inputs[0];
    const sidechain = inputs[1];
    const out = outputs[0];
    const sr = sampleRate;

    const thresholdDb = parameters.threshold[0];
    const attackTime = parameters.attack[0];
    const holdTime = parameters.hold[0];
    const releaseTime = parameters.release[0];
    const rangeDb = parameters.range[0];
    const thresholdLin = Math.pow(10, thresholdDb / 20);
    const rangeLin = Math.pow(10, rangeDb / 20);

    const attackCoeff = attackTime > 0 ? 1 - Math.exp(-1 / (sr * attackTime)) : 1;
    const releaseCoeff = releaseTime > 0 ? 1 - Math.exp(-1 / (sr * releaseTime)) : 1;
    const holdSamples = Math.round(holdTime * sr);

    const detCh = (sidechain[0] && sidechain[0][0]) ? sidechain[0][0] : (audio[0] ? audio[0][0] : null);

    if (detCh && audio[0]) {
      for (let i = 0; i < detCh.length; i++) {
        const level = Math.abs(detCh[i]);
        if (level >= thresholdLin) {
          this._holdCounter = holdSamples;
          this._gateGain += attackCoeff * (1 - this._gateGain);
        } else if (this._holdCounter > 0) {
          this._holdCounter--;
        } else {
          this._gateGain += releaseCoeff * (rangeLin - this._gateGain);
        }
        for (let ch = 0; ch < out.length; ch++) {
          const inCh = audio[0][ch] || audio[0][0];
          if (inCh) {
            out[ch][i] = inCh[i] * this._gateGain;
          }
        }
      }
    }

    this._reportCounter++;
    if (this._reportCounter >= 34) {
      this._reportCounter = 0;
      this.port.postMessage({ gateOpen: this._gateGain > 0.5 });
    }
    return true;
  }
}
registerProcessor('gate-processor', GateProcessor);

// ─── Expander Processor ─────────────────────────────────────────────────────

class ExpanderProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'threshold', defaultValue: -30, automationRate: 'k-rate' },
      { name: 'ratio', defaultValue: 2, automationRate: 'k-rate' },
      { name: 'attack', defaultValue: 0.001, automationRate: 'k-rate' },
      { name: 'release', defaultValue: 0.1, automationRate: 'k-rate' },
    ];
  }
  constructor() {
    super();
    this._envelope = 0;
    this._gainDb = 0;
    this._reportCounter = 0;
  }
  process(inputs, outputs, parameters) {
    const audio = inputs[0];
    const sidechain = inputs[1];
    const out = outputs[0];
    const sr = sampleRate;

    const thresholdDb = parameters.threshold[0];
    const ratio = parameters.ratio[0];
    const attackTime = parameters.attack[0];
    const releaseTime = parameters.release[0];

    const attackCoeff = attackTime > 0 ? 1 - Math.exp(-1 / (sr * attackTime)) : 1;
    const releaseCoeff = releaseTime > 0 ? 1 - Math.exp(-1 / (sr * releaseTime)) : 1;

    const detCh = (sidechain[0] && sidechain[0][0]) ? sidechain[0][0] : (audio[0] ? audio[0][0] : null);

    if (detCh && audio[0]) {
      for (let i = 0; i < detCh.length; i++) {
        const rectified = Math.abs(detCh[i]);
        const coeff = rectified > this._envelope ? attackCoeff : releaseCoeff;
        this._envelope = coeff * rectified + (1 - coeff) * this._envelope;

        const envDb = this._envelope > 1e-10 ? 20 * Math.log10(this._envelope) : -200;
        let gainReductionDb = 0;
        if (envDb < thresholdDb) {
          const below = thresholdDb - envDb;
          gainReductionDb = -(below * (1 - 1 / ratio));
        }

        const gainLin = Math.pow(10, gainReductionDb / 20);
        this._gainDb = gainReductionDb;

        for (let ch = 0; ch < out.length; ch++) {
          const inCh = audio[0][ch] || audio[0][0];
          if (inCh) {
            out[ch][i] = inCh[i] * gainLin;
          }
        }
      }
    }

    this._reportCounter++;
    if (this._reportCounter >= 34) {
      this._reportCounter = 0;
      this.port.postMessage({ reductionDb: this._gainDb });
    }
    return true;
  }
}
registerProcessor('expander-processor', ExpanderProcessor);

// ─── De-esser Processor ─────────────────────────────────────────────────────

class DeEsserProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'range', defaultValue: 6, automationRate: 'k-rate' },
    ];
  }
  constructor() {
    super();
    this._envelope = 0;
    this._reportCounter = 0;
  }
  process(inputs, outputs, parameters) {
    const audio = inputs[0];
    const detection = inputs[1];
    const out = outputs[0];

    const rangeDb = parameters.range[0];

    const detCh = (detection[0] && detection[0][0]) ? detection[0][0] : null;

    if (audio[0]) {
      for (let ch = 0; ch < out.length; ch++) {
        const inCh = audio[0][ch] || audio[0][0];
        if (inCh) {
          out[ch].set(inCh);
        }
      }
    }

    if (detCh) {
      for (let i = 0; i < detCh.length; i++) {
        const rectified = Math.abs(detCh[i]);
        const coeff = rectified > this._envelope ? 0.1 : 0.002;
        this._envelope = coeff * rectified + (1 - coeff) * this._envelope;
      }
    }

    this._reportCounter++;
    if (this._reportCounter >= 34) {
      this._reportCounter = 0;
      const envDb = this._envelope > 1e-10 ? 20 * Math.log10(this._envelope) : -200;
      const reductionDb = envDb > -20 ? -Math.min(rangeDb, Math.max(0, (envDb + 20) * rangeDb / 20)) : 0;
      this.port.postMessage({ reductionDb });
    }
    return true;
  }
}
registerProcessor('de-esser-processor', DeEsserProcessor);

// ─── Bitcrusher Processor ───────────────────────────────────────────────────

class BitcrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bitDepth', defaultValue: 8, automationRate: 'k-rate' },
      { name: 'sampleRateReduction', defaultValue: 1, automationRate: 'k-rate' },
    ];
  }
  constructor() {
    super();
    this._holdL = 0;
    this._holdR = 0;
    this._counter = 0;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const out = outputs[0];

    const bits = Math.round(parameters.bitDepth[0]);
    const srReduce = Math.round(parameters.sampleRateReduction[0]);
    const levels = Math.pow(2, bits);

    for (let ch = 0; ch < out.length; ch++) {
      const outCh = out[ch];
      const inCh = input[0] ? input[0][ch] || input[0][0] : null;
      if (inCh) {
        for (let i = 0; i < outCh.length; i++) {
          if (this._counter % srReduce === 0) {
            // Quantize to bit depth
            const quantized = Math.round(inCh[i] * levels) / levels;
            if (ch === 0) this._holdL = quantized;
            else this._holdR = quantized;
          }
          outCh[i] = ch === 0 ? this._holdL : this._holdR;
          if (ch === 0) this._counter++;
        }
      }
    }
    return true;
  }
}
registerProcessor('bitcrusher-processor', BitcrusherProcessor);
