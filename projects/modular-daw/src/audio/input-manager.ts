/**
 * Singleton wrapper around getUserMedia for microphone input.
 * Caches the MediaStream so repeated calls reuse the same stream.
 */

let stream: MediaStream | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;

/** Request microphone access and return a MediaStreamAudioSourceNode. */
export async function requestMicInput(ctx: AudioContext): Promise<MediaStreamAudioSourceNode> {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }
  // Create a new source node each time since nodes are tied to a context
  sourceNode = ctx.createMediaStreamSource(stream);
  return sourceNode;
}

/** Stop all media tracks and release resources. */
export function disposeMicInput(): void {
  if (stream) {
    for (const track of stream.getTracks()) {
      track.stop();
    }
    stream = null;
  }
  if (sourceNode) {
    try { sourceNode.disconnect(); } catch { /* already disconnected */ }
    sourceNode = null;
  }
}

/** Check if mic input has been acquired. */
export function hasMicInput(): boolean {
  return stream !== null;
}
