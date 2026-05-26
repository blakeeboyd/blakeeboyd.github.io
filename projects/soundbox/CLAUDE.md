# SoundBox

A live text backchannel for in-class listening sessions. Students land in one shared room, no auth, names persist per-browser. Designed for use on student phones during a session. Hosted as a static page on blakeeboyd.github.io.

## Architecture

Single self-contained `index.html`. No build step, no framework, no bundler. Open in a browser, deploy to any static host.

- Vanilla HTML + CSS + JS in one file
- Script tag is `<script type="module">`, ES modules only
- Backend: Firebase Realtime Database v10 modular SDK, loaded from `gstatic` via **dynamic** `import()`
- Falls back to in-memory demo mode if config is still `"PASTE"` or imports fail (sandboxed previews, blocked networks)

### Data model

Messages live at `soundbox/messages`. Each message: `{ name, text, ts: serverTimestamp() }`. Read via `query(ref(db, ROOM_PATH), limitToLast(200))` plus `onChildAdded`.

### State

| Where | What | Lifespan |
|---|---|---|
| Firebase RTDB | Messages | Persistent, server-side |
| `localStorage["soundbox.name"]` | Per-user name | Per-browser, until cleared |
| `localStorage["soundbox.theme"]` | Light/dark choice | Per-browser, until cleared |
| In-memory only | Demo-mode messages, live participant count | Tab-scoped |

## Design system (Blake Boyd)

All visual styling derives from CSS custom properties defined at the top of `<style>`. **Never hardcode colors or other tokenized values.** Always reference variables: `var(--color-accent)`, `var(--radius-md)`, etc.

### Component rules
- Cards use `--radius-lg` (join card) or `--radius-md` (message rows). **Never pill-shaped.**
- Cards do **not** lift on hover (no transform, no scale).
- Primary buttons: `--color-accent` bg, `--shadow-button`, `scale(0.98)` on active, `--color-accent-hover` on hover.
- Ghost buttons: transparent, 1px `--color-border`, `--radius-md`, hover swaps to `--color-control-bg` with `--color-text` border.
- Inputs on focus get the 3px tinted halo (`box-shadow: 0 0 0 3px rgba(37,99,235,0.1)`). The default outline is removed only because the halo replaces it.
- The live dot is 8px, `--color-success`, with the `pulse` keyframe (2s ease-in-out infinite, opacity 1 → 0.5 → 1).
- **Dashed borders are reserved for file drop zones.** Don't use them for empty states or anywhere else.
- **No `position: fixed`.** The composer is pinned via flexbox, not fixed positioning. The system avoids fixed elements.

### Per-user color palette
Five colors only, picked deterministically from a name hash:
`--color-accent`, `--color-success`, `--color-warning`, `--color-error`, `--color-accent-medium`. **Don't expand this set.**

### Typography
- Display / titles: Source Serif 4 (variable, `opsz`)
- Body / UI: Inter (variable, with `cv11 ss01 cv05` features)
- Mono / labels / timestamps: JetBrains Mono with `tnum zero`

Use the existing utility classes (`.h-page-title`, `.h-card`, `.t-body`, `.t-subtitle`, `.t-small`, `.t-label`, `.t-mono`, `.t-numeric`). Don't reinvent them.

### Theming
Light is default. Dark via `data-theme="dark"` on `<html>`. First load uses `prefers-color-scheme`; subsequent loads honor `localStorage["soundbox.theme"]`. Toggle icon shows the mode you'd switch *to* (moon while in light, sun while in dark) and rotates 15° on hover.

## Voice and copy rules

Apply to every visible string. Buttons, placeholders, headings, notices, error messages, aria-labels, alt text, the lot.

- **Sentence case** for headings, labels, buttons, placeholders. UPPERCASE only for small mono labels (`.t-label`).
- **No emoji anywhere.** Small monochrome line icons (Lucide-style, inline SVG, 24x24 viewBox, `stroke-width="2"`, round caps and joins, `fill="none"`, `stroke="currentColor"`) carry that weight.
- **No em dashes. No semicolons in user-facing copy.** Use commas, colons, periods, or parentheses.
- Avoid filler words ("crucial", "seamless", "leverage", "robust") and performative warmth ("Great question!", "Absolutely!").
- Plain language. Tone reference: *"What should we call you?", "Say something.", "No messages yet. Say hello.", "change name", "live", "Join"*.

These rules apply to **copy**. JS semicolons in code are fine.

## Code conventions

- **Escape all user-generated text via `textContent`.** Never `innerHTML` for message bodies, names, or anything a user typed. This is a public room during events — treat every message as untrusted.
- Firebase imports use dynamic `import()` inside a `try/catch` so blocked-network sandboxes fall back to demo mode without throwing.
- Keep the `firebaseConfig` block clearly marked with the `EDIT THIS` comment near the top of the script. If you add config fields, keep the placeholder `"PASTE"` sentinel so `configLooksReal()` still gates demo mode correctly.
- Functional areas are separated by `/* ============ */` headers in both `<style>` and `<script>`. Preserve that structure when adding new sections.
- Constants like `STORAGE_NAME`, `ROOM_PATH`, `GROUP_WINDOW_MS`, `SCROLL_THRESHOLD` are at the top of the script — add new ones there rather than inlining magic numbers.

## Accessibility

- Every input has a label (visible or `.visually-hidden`)
- Messages container is `aria-live="polite"` so new messages get announced
- Honor `prefers-reduced-motion` (already clamps transitions and the pulse to near-zero)
- `:focus-visible` outlines: 2px `--color-accent`, 2px offset. Inputs use the halo instead.
- Touch targets sized for phone use, since students are on phones

## Things to NOT do

- Don't add a build step, bundler, or framework (no React, no Vue, no Vite, no Tailwind)
- Don't add dependencies beyond the Firebase SDK
- Don't introduce `position: fixed` (use flexbox for sticky bottom composer)
- Don't use dashed borders outside file drop zones
- Don't use emoji
- Don't hardcode hex values — always use the CSS variables
- Don't render user-supplied strings via `innerHTML` (use `textContent` or DOM construction)
- Don't expand the per-user color palette beyond the listed five
- Don't break the demo-mode fallback — the full UI must render with config still `"PASTE"`
- Don't violate the voice rules even in "small" places like console warnings, notices, or alt text

## Admin name unlock (Blake)

The admin name (`Blake`, set as `ADMIN_NAME` in the script) is reserved and can't be typed into the join screen normally. To sign in as Blake:

1. On the join screen, type `Blake` into the name field. The Join button greys out.
2. Perform the unlock gesture:
   - **Tap the blue logo icon 2 times**
   - **Tap the LIVE indicator 3 times** (the active-users panel will toggle open/closed as a side effect; that's the visual feedback the taps landed)
   - **Tap the logo 2 more times**
3. Each tap has to land within 4 seconds of the previous. Wrong target or too slow resets to stage 0.
4. Join button enables. Click Join. You're in the room as Blake.

This is enforced by `ADMIN_GESTURE` in `index.html`. Sticky for the session once completed.

Takeover: each Blake-join writes a new token to `soundbox/adminSession`. Any other device already admin sees the token change and bounces itself to the join screen with "You were signed out of admin on another device."

This is a soft lock. Anyone with View Source can find the gesture. Acceptable threat model for a class session, not for anything FERPA-sensitive.

## Deployment

Static site on blakeeboyd.github.io (or any static host). Just upload `index.html`. Firebase database rules during a trusted event:

```json
{ "rules": { ".read": true, ".write": true } }
```

Test-mode rules are fine for a single class session. Tighten (auth-gated, shape-validated, rate-limited) before extended use. The setup notes are in an HTML comment at the top of `index.html`.

## When making changes

Before implementing, check:

1. **Does it require a backend change beyond `push` and `onChildAdded`?** If so, document it and confirm before adding Firebase calls. New paths need rules consideration.
2. **Does it require persisting new client state?** Use `localStorage["soundbox.<key>"]`. Wrap in try/catch — Safari private mode can throw.
3. **Does it introduce new copy?** Run it through the voice rules above before writing.
4. **Does it introduce new visuals?** Use existing tokens. If a token doesn't exist for what you need, surface that rather than hardcoding.
5. **Does it survive demo mode?** Features that only work with Firebase need a clean degraded behavior.
6. **Does it touch message rendering?** Re-verify `textContent` is used for all user-supplied fields.

If a request conflicts with the design system, voice rules, or constraints above, **surface the conflict rather than silently violating them.**

## Roadmap candidates (not yet built)

These are plausible next features that have been discussed but not implemented. Don't assume any are wanted without confirmation.

- An admin "clear room" affordance gated by a passphrase or query parameter
- Optional pseudonym prompting on the join card for FERPA-sensitive sessions
- Tightened Firebase rules with shape validation and per-IP rate limits (likely via Cloud Functions)
- A per-session room ID in the URL hash so multiple classes can run in parallel
- Light moderation: a soft client-side report button that flags a message for instructor review
- An "instructor view" with the same UI but a slow-mode toggle, message-rate display, or post-session export
