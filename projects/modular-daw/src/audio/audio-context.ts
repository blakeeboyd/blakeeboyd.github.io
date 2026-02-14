/**
 * Shared AudioContext reference.
 * Set once by the audio engine on initialization.
 * Importable by any module that needs to decode audio buffers.
 */
let sharedCtx: AudioContext | null = null;

export function setSharedAudioContext(ctx: AudioContext): void {
  sharedCtx = ctx;
}

export function getSharedAudioContext(): AudioContext | null {
  return sharedCtx;
}
