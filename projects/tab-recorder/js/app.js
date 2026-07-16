// Tab Recorder — capture another browser tab's audio and record it to a stereo WAV.
//
// The recorder records whatever is patched into `recordBus` (a GainNode), not the
// tab stream directly. Tab capture is the first source; adding mic or a file later
// is just another node.connect(recordBus). The record/encode core is source-agnostic.

(function () {
  'use strict';

  var context = null;      // AudioContext (lazy — created on first capture)
  var recordBus = null;    // everything to be recorded connects here
  var processor = null;    // AudioWorkletNode pulling PCM off the bus
  var tabStream = null;    // active getDisplayMedia stream
  var tabSource = null;    // MediaStreamSource for the tab

  var TRIM_THRESHOLD_DB = -60; // samples below this on both channels count as silence

  var recording = false;
  var chunksL = [];        // Float32Array frames, left channel
  var chunksR = [];        // right channel
  var startTime = 0;
  var timer = null;

  var els = {
    capture: document.getElementById('rec-capture'),
    record: document.getElementById('rec-record'),
    stop: document.getElementById('rec-stop'),
    trim: document.getElementById('rec-trim'),
    dot: document.getElementById('rec-dot'),
    time: document.getElementById('rec-time'),
    source: document.getElementById('rec-source')
  };

  // --- Tab capture -----------------------------------------------------------

  async function captureTab() {
    stopTab();
    try {
      tabStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // audio-only requests are rejected; we stop the video track below
        audio: {
          // These three force a mono downmix if left enabled — disable for stereo.
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          // Brave mutes the whole capture path when this is set. Keep in Chrome
          // (source tab muted at source), drop in Brave.
          suppressLocalAudioPlayback: !navigator.brave
        },
        preferCurrentTab: false
      });
    } catch (err) {
      // User cancelled the picker, or unsupported browser.
      return;
    }

    var videoTracks = tabStream.getVideoTracks();
    var audioTracks = tabStream.getAudioTracks();

    var label = audioTracks.length ? (audioTracks[0].label || '') : '';
    if (!label || label.indexOf('://') !== -1) {
      var vLabel = videoTracks.length ? (videoTracks[0].label || '') : '';
      label = (vLabel && vLabel.indexOf('://') === -1) ? vLabel : 'another tab';
    }

    videoTracks.forEach(function (t) { t.stop(); }); // audio only

    if (audioTracks.length === 0) {
      alert('No audio track captured. Make sure to check "Share tab audio" in the dialog.');
      stopTab();
      return;
    }

    // If the user stops sharing via the browser's own banner, tear down.
    audioTracks[0].addEventListener('ended', function () {
      if (recording) finishRecording();
      stopTab();
    });

    await ensureContext();
    tabSource = context.createMediaStreamSource(tabStream);
    tabSource.connect(recordBus);

    setArmed('Capturing: ' + label);
  }

  function stopTab() {
    if (tabSource) { try { tabSource.disconnect(); } catch (e) {} tabSource = null; }
    if (tabStream) { tabStream.getTracks().forEach(function (t) { t.stop(); }); tabStream = null; }
    if (!recording) setIdle();
  }

  // --- Recording bus + PCM capture ------------------------------------------

  async function ensureContext() {
    if (context) return;
    context = new (window.AudioContext || window.webkitAudioContext)();
    recordBus = context.createGain();

    // AudioWorklet runs on the audio render thread, so capture survives tab
    // backgrounding — which is the normal workflow here (you leave this tab to
    // reach the source tab). The worklet posts copied stereo frames back.
    await context.audioWorklet.addModule('js/recorder-worklet.js');
    processor = new AudioWorkletNode(context, 'recorder-processor', {
      numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2
    });
    processor.port.onmessage = function (e) {
      if (!recording) return;
      chunksL.push(e.data.l);
      chunksR.push(e.data.r);
    };
    recordBus.connect(processor);
    // The worklet only pulls while connected to the graph; a zero-gain sink keeps
    // it running without routing tab audio to the speakers (avoids echo).
    var sink = context.createGain();
    sink.gain.value = 0;
    processor.connect(sink);
    sink.connect(context.destination);
  }

  function startRecording() {
    if (recording || !recordBus) return;
    if (context.state === 'suspended') context.resume();
    chunksL = [];
    chunksR = [];
    recording = true;
    processor.port.postMessage('start');
    startTime = performance.now();
    setRecording();
    timer = setInterval(updateTime, 200);
  }

  function finishRecording() {
    if (!recording) return;
    recording = false;
    if (processor) processor.port.postMessage('stop');
    clearInterval(timer);

    var left = flatten(chunksL);
    var right = flatten(chunksR);
    chunksL = [];
    chunksR = [];

    if (left.length === 0) {
      setArmed('Nothing recorded.');
      return;
    }

    var channels = [left, right];
    if (els.trim.checked) {
      var b = silenceBounds(channels, TRIM_THRESHOLD_DB);
      if (b.end > b.start) {
        channels = [left.slice(b.start, b.end), right.slice(b.start, b.end)];
      }
      // else: entirely below threshold — keep the untrimmed take rather than an empty file.
    }

    var secs = channels[0].length / context.sampleRate;
    var wav = encodeWavFloat32(channels, context.sampleRate);
    download(wav, 'tab-recording-' + timestamp() + '.wav');
    setArmed('Saved ' + secs.toFixed(1) + 's. Ready to record again.');
  }

  function flatten(chunks) {
    var total = chunks.reduce(function (n, c) { return n + c.length; }, 0);
    var out = new Float32Array(total);
    var offset = 0;
    for (var i = 0; i < chunks.length; i++) {
      out.set(chunks[i], offset);
      offset += chunks[i].length;
    }
    return out;
  }

  // Find [start, end) sample range with leading/trailing silence stripped.
  // Ported from SoundBench trim.ts detectSilence. end is exclusive.
  function silenceBounds(channelData, thresholdDb) {
    var threshold = Math.pow(10, thresholdDb / 20);
    var nc = channelData.length;
    var total = channelData[0].length;

    var start = total;
    for (var i = 0; i < total; i++) {
      for (var ch = 0; ch < nc; ch++) {
        if (Math.abs(channelData[ch][i]) > threshold) { start = i; break; }
      }
      if (start !== total) break;
    }
    if (start === total) return { start: 0, end: 0 }; // all silent

    var end = start;
    for (var j = total - 1; j >= start; j--) {
      var above = false;
      for (var c = 0; c < nc; c++) {
        if (Math.abs(channelData[c][j]) > threshold) { above = true; break; }
      }
      if (above) { end = j + 1; break; }
    }
    return { start: start, end: end };
  }

  // --- WAV encoder (32-bit float, ported from SoundBench wav-encoder.ts) ------

  function encodeWavFloat32(channelData, sampleRate) {
    var numChannels = channelData.length;
    var numSamples = channelData[0].length;
    var bytesPerSample = 4;
    var blockAlign = numChannels * bytesPerSample;
    var dataSize = numSamples * blockAlign;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 3, true); // 3 = IEEE float
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 32, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    var offset = 44;
    for (var i = 0; i < numSamples; i++) {
      for (var ch = 0; ch < numChannels; ch++) {
        view.setFloat32(offset, channelData[ch][i], true);
        offset += 4;
      }
    }
    return buffer;
  }

  function writeString(view, offset, str) {
    for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  function download(arrayBuffer, filename) {
    var url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'audio/wav' }));
    var a = Object.assign(document.createElement('a'), { href: url, download: filename });
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function timestamp() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' +
      p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  // --- UI state --------------------------------------------------------------

  function updateTime() {
    var secs = (performance.now() - startTime) / 1000;
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    els.time.textContent = m + ':' + s.toFixed(1).padStart(4, '0');
  }

  function setIdle() {
    els.dot.className = 'rec-dot idle';
    els.time.textContent = 'No source';
    els.source.textContent = 'Capture a tab to arm the recorder.';
    els.record.disabled = true;
    els.stop.disabled = true;
    els.capture.textContent = 'Capture Tab';
  }

  function setArmed(msg) {
    els.dot.className = 'rec-dot armed';
    els.time.textContent = '0:00.0';
    els.source.textContent = msg;
    els.record.disabled = false;
    els.stop.disabled = true;
    els.capture.textContent = 'Recapture Tab';
  }

  function setRecording() {
    els.dot.className = 'rec-dot recording';
    els.record.disabled = true;
    els.stop.disabled = false;
  }

  els.capture.addEventListener('click', captureTab);
  els.record.addEventListener('click', startRecording);
  els.stop.addEventListener('click', finishRecording);
})();
