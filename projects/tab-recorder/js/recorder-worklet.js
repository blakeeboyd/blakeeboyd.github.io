// Runs on the audio render thread, so it keeps pulling PCM even when the tab is
// backgrounded (unlike ScriptProcessorNode, which throttles on the main thread).
// Posts copied stereo frames to the main thread only while recording.

class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recording = false;
    this.port.onmessage = (e) => { this.recording = e.data === 'start' ? true : false; };
  }

  process(inputs) {
    if (!this.recording) return true;
    var input = inputs[0];
    if (!input || input.length === 0) return true;
    var left = input[0];
    var right = input.length > 1 ? input[1] : input[0];
    // Copy — the render buffers are reused after process() returns.
    this.port.postMessage({ l: left.slice(), r: right.slice() });
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
