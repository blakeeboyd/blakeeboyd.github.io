// Runs on the audio render thread, so it keeps pulling PCM even when the tab is
// backgrounded (unlike ScriptProcessorNode, which throttles on the main thread).
//
// process() fires every 128-sample quantum (375x/sec at 48k). Posting a message
// per quantum saturates the main-thread message queue and silently drops frames
// after ~20s. Instead we accumulate into a block and post ~4x/sec.

var BLOCK = 16384; // samples per channel per post (~0.34s at 48k)

class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recording = false;
    this.bufL = new Float32Array(BLOCK);
    this.bufR = new Float32Array(BLOCK);
    this.fill = 0;
    this.port.onmessage = (e) => {
      if (e.data === 'start') { this.fill = 0; this.recording = true; }
      else if (e.data === 'stop') { this.flush(); this.recording = false; }
    };
  }

  flush() {
    if (this.fill === 0) return;
    this.port.postMessage({
      l: this.bufL.slice(0, this.fill),
      r: this.bufR.slice(0, this.fill)
    });
    this.fill = 0;
  }

  process(inputs) {
    if (!this.recording) return true;
    var input = inputs[0];
    if (!input || input.length === 0) return true;
    var left = input[0];
    var right = input.length > 1 ? input[1] : input[0];
    var n = left.length;

    for (var i = 0; i < n; i++) {
      this.bufL[this.fill] = left[i];
      this.bufR[this.fill] = right[i];
      this.fill++;
      if (this.fill === BLOCK) this.flush();
    }
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
