# Backchannel

A live text backchannel for in-class sessions. Students land in one shared room, no auth, names persist per-browser. Designed for use on student phones during a session. Hosted as a static page on blakeeboyd.github.io.

Previously named SoundBox. The rename moved the directory from `projects/soundbox/` to `projects/backchannel/` and renamed Firebase paths from `soundbox/*` to `backchannel/*`. The Firebase **project ID** is still `soundbox-9` (renaming the project itself would require a data migration). A one-time localStorage migration in `index.html` ports old `soundbox.*` keys to `backchannel.*` on first visit.

## Architecture

Single self-contained `index.html`. No build step, no framework, no bundler. Open in a browser, deploy to any static host.

- Vanilla HTML + CSS + JS in one file
- Script tag is `<script type="module">`, ES modules only
- Backend: Firebase Realtime Database v10 modular SDK, loaded from `gstatic` via **dynamic** `import()`
- Falls back to in-memory demo mode if config is still `"PASTE"` or imports fail (sandboxed previews, blocked networks)

### Data model

Messages live at `backchannel/messages`. Each message: `{ name, text, ts: serverTimestamp(), deviceId }`. Read via `query(ref(db, ROOM_PATH), limitToLast(200))` plus `onChildAdded`.

Other Firebase paths:
- `backchannel/adminSession` — `{ token, ts }`. Single-slot admin lock. A fresh token kicks any prior admin.
- `backchannel/bans` — `{ [deviceId]: { ts, byName } }`. Banned devices have their composer disabled and their messages visually muted on every client.
- `backchannel/archives/{pushId}` — `{ ts, archivedBy, count, messages: { ...snapshot... } }`. Snapshot of the messages path captured at clear-room time. Every admin "Clear all messages" archives before wiping, so destruction is always reversible from the admin panel's Archives section.

### State

| Where | What | Lifespan |
|---|---|---|
| Firebase RTDB | Messages, admin session, bans | Persistent, server-side |
| `localStorage["backchannel.name"]` | Per-user name | Per-browser, until cleared |
| `localStorage["backchannel.theme"]` | Light/dark choice | Per-browser, until cleared |
| `localStorage["backchannel.notify"]` | Notification opt-in | Per-browser, until cleared |
| `localStorage["backchannel.deviceId"]` | Stable random per-device id (rides on every message) | Per-browser, until cleared |
| `localStorage["backchannel.renames"]` | This device's name-change history (for "previously known as") | Per-browser, until cleared |
| In-memory only | Demo-mode messages, live participant count, admin status, rate-limit window, banlist | Tab-scoped |

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
Light is default. Dark via `data-theme="dark"` on `<html>`. First load uses `prefers-color-scheme`; subsequent loads honor `localStorage["backchannel.theme"]`. Toggle icon shows the mode you'd switch *to* (moon while in light, sun while in dark) and rotates 15° on hover. The `.messages` scrollbar is tokenized via `scrollbar-color` and `::-webkit-scrollbar` so it reads correctly in both themes.

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
   - **Tap the LIVE indicator 3 times**
   - **Tap the logo 2 more times**
3. Each tap has to land within 4 seconds of the previous. Wrong target or too slow resets to stage 0. A small accent-colored dot appears next to the join hint copy each time a correct tap is registered; this is the only visible feedback. (The live-panel toggle is suppressed on the join screen, so it no longer flashes open during the gesture.)
4. Join button enables. Click Join. You're in the room as Blake.

This is enforced by `ADMIN_GESTURE` in `index.html`. Sticky for the session once completed.

Takeover: each Blake-join writes a new token to `backchannel/adminSession`. Any other device already admin sees the token change and bounces itself to the join screen with "You were signed out of admin on another device."

This is a soft lock. Anyone with View Source can find the gesture. Acceptable threat model for a class session, not for anything FERPA-sensitive.

## Admin actions

When `isAdmin` is true, `<body>` carries `.is-admin`, which reveals admin-only affordances via CSS. The class lives on `<body>` (not on `.room`) because the admin toggle button sits inside `<header>`, which is a sibling of `.room`, not a descendant — a `.room.is-admin` selector would never reach it.

- **Admin button in header**: an "admin" toggle appears next to the live indicator. Clicking it expands `.admin-panel` (mirrors the `.who-panel` pattern: card, multiple sections, list rows). The button doubles as the visible admin indicator — its presence tells the user this tab holds the admin slot.
- **Clear room**: first section of the admin panel. Confirm dialog, then `backend.archiveAndClearRoom(myName)` runs: a one-shot `get(messagesRef)` reads the current snapshot, that snapshot plus metadata gets written to `backchannel/archives/{pushId}`, and only then does `set(messagesRef, null)` fire. An archive write failure aborts the wipe (the destructive step never runs without a successful archive first). The initiating device empties its rendered chains via `clearRoomLocally()`. Every other connected device is subscribed to `backend.listenRoomCleared`, which fires when `onValue(messagesRef)` transitions from populated to empty, and they run the same `clearRoomLocally()` to catch up without a reload. New joiners see an empty room.
- **Archives**: fourth section of the admin panel. Shows the `ADMIN_PANEL_ARCHIVE_PREVIEW` (3) most-recent archives for quick access, each with three actions: `view` opens a standalone HTML transcript in a new tab via a Blob URL, `json` downloads a `backchannel-archive-{iso}.json` file, and `delete` permanently removes the archive. The section footer is a link to the dedicated archives page (see below) showing the full count when there are more archives than fit in the preview. The metadata listing is live via `listenArchives` (refreshes when archives are created or deleted elsewhere); the full messages payload is fetched on demand via `getArchive(id)` rather than held in memory.

## Archives page

A separate standalone page lives at `projects/backchannel/archives/index.html`. It is intentionally unlinked from anywhere on the site except the admin panel's "View all archives" footer link. URL: `blakeeboyd.github.io/projects/backchannel/archives/`.

The page has its own self-contained HTML/CSS/JS (no shared build, no imports from the room). It mirrors the design tokens manually — keep them in sync if you change tokens in the room. Two-column layout: a left list of every archive sorted most-recent first, and a right-side viewer that renders the selected archive's transcript inline (no Blob-URL new tab; the transcript appears in place). Each archive has its own `download json` and `delete` actions in the viewer header. The theme toggle shares the `backchannel.theme` localStorage key with the room so the choice persists across the two pages.

Access model: no auth gate. The page reads from `backchannel/archives` directly. Under current Firebase rules (`.read: true`), anyone with the URL can read. Same soft-lock threat model as everything else.
- **Ban**: second section is "Recent participants" — every deviceId we've seen post within `PARTICIPANT_WIN_MS` (10 min), minus the admin themselves and anyone already banned. Each row has a "ban" button that prompts a confirm and writes the deviceId to `backchannel/bans`. Ban affordances are intentionally NOT placed next to messages anymore — touch targets adjacent to names are too easy to fat-finger on a phone.
- **Unban**: third section lists every device currently in `backchannel/bans`. Each row shows the most recent display name we've seen from that deviceId (from the in-memory `deviceLastName` map populated as messages arrive), plus who placed the ban. An "unban" button on each row writes `null` to that deviceId's slot in the banlist.
- **Ban enforcement on the banned device**: composer disables, character-count slot shows "Removed by admin.", placeholder changes to "You have been removed from this room.", and the device's already-rendered messages go to opacity 0.4 italic on every client.
- **Soft lock**: same caveat as the admin gesture. A user with dev tools can post messages with a custom `deviceId` field and dodge the ban. Real enforcement needs Firebase security rules or Cloud Functions (planned alongside push notifications).

## Send rate limit

Every device enforces a rolling window of `SEND_RATE_MAX` (5) messages per `SEND_RATE_WINDOW_MS` (10s). When the limit trips, the composer's character-count slot shows "Slow down. Try again in Ns." and the submit is silently rejected. This is also a soft lock, bypassable in dev tools. Real per-IP rate limits will come via the Cloud Functions stage.

## Deployment

Static site on blakeeboyd.github.io (or any static host). Just upload `index.html`. Firebase database rules during a trusted event:

```json
{ "rules": { ".read": true, ".write": true } }
```

Test-mode rules are fine for a single class session. Tighten (auth-gated, shape-validated, rate-limited) before extended use. The setup notes are in an HTML comment at the top of `index.html`.

## When making changes

Before implementing, check:

1. **Does it require a backend change beyond `push` and `onChildAdded`?** If so, document it and confirm before adding Firebase calls. New paths need rules consideration.
2. **Does it require persisting new client state?** Use `localStorage["backchannel.<key>"]`. Wrap in try/catch — Safari private mode can throw.
3. **Does it introduce new copy?** Run it through the voice rules above before writing.
4. **Does it introduce new visuals?** Use existing tokens. If a token doesn't exist for what you need, surface that rather than hardcoding.
5. **Does it survive demo mode?** Features that only work with Firebase need a clean degraded behavior.
6. **Does it touch message rendering?** Re-verify `textContent` is used for all user-supplied fields.

If a request conflicts with the design system, voice rules, or constraints above, **surface the conflict rather than silently violating them.**

## Roadmap candidates (not yet built)

These are plausible next features that have been discussed but not implemented. Don't assume any are wanted without confirmation.

- Optional pseudonym prompting on the join card for FERPA-sensitive sessions
- Tightened Firebase rules with shape validation and per-IP rate limits via Cloud Functions (this is what makes the client-side ban and rate-limit actually enforceable)
- A per-session room ID in the URL hash (or query param) so multiple classes can run in parallel without sharing backfill
- Light moderation: a soft client-side report button that flags a message for instructor review
- An "instructor view" with slow-mode toggle, message-rate display, or post-session export
- Push notifications (a separate plan exists at `~/.claude/projects/-Users-harrisgb-Library-CloudStorage-SynologyDrive-Maranasati-Projects-GitHub-blakeeboyd-github-io/memory/soundbox-push-notifications-plan.md`)
