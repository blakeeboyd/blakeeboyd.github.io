let loaded = false;

export async function ensureWorklets(ctx: AudioContext): Promise<void> {
  if (loaded) return;
  await ctx.audioWorklet.addModule(
    new URL('./worklets/atomic-processors.js', import.meta.url).href
  );
  loaded = true;
}
