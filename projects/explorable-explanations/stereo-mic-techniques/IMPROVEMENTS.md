# Stereo Mic Techniques - Improvements

## Known Issues

### Binaural mode audio restart on loop
When playing in binaural mode with looping enabled, there is an audible restart/gap when the audio loops back to the beginning after the first complete playthrough. The initial playthrough works smoothly, but subsequent loops have a noticeable discontinuity.

**Possible causes to investigate:**
- The `onended` handler may be triggering incorrectly when looping
- Omnitone FOA renderer may need to be reset or re-synced at loop boundary
- The AudioBufferSourceNode loop behavior may interact poorly with Omnitone's processing

**Reproduction steps:**
1. Load any B-format audio file
2. Select Binaural technique
3. Enable loop toggle
4. Play audio and wait for it to loop

## Suggested Layout Improvements

These were previously attempted but caused issues. Implement one by one.

### 2-Column Layout Redesign

The current 3-column grid (`1fr minmax(240px,280px) 1fr`) wastes space. The narrow middle column forces technique buttons into a vertical stack while source and visualization columns are oversized.

**Proposed layout (desktop >1024px):**
- Left column: Polar pattern canvas (~400-500px)
- Right column: Stacked controls (Audio Source, Technique, Parameters)

**Responsive breakpoints:**
- Tablet (641-1024px): Single column, polar pattern centered (max 450px)
- Mobile (<=640px): Single column, technique buttons wrap into 2 rows, canvas max 350px

### Horizontal Technique Buttons

Change `.technique-grid` from `flex-direction: column` to `flex-direction: row` so technique buttons display horizontally instead of stacked vertically.

### Format + Gain in Same Row

Wrap `.format-selector` and `.gain-control` in a new `.source-bottom-row` div for horizontal layout within the source card.

## Future Enhancements

- Consider adding more keyboard shortcuts (technique switching, etc.)
- A/B comparison mode between techniques
