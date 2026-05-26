# Backchannel

A live text channel for in-class sessions. Students land in one shared room, pick a name, and talk during the session from their phones. No accounts, no install.

Hosted at `blakeeboyd.github.io/projects/backchannel/`.

## What it does

- One shared room per URL. Add `?room=<name>` to use a separate namespace for a specific class or event. Without the parameter, everyone lands in the default room.
- Pick a display name on first visit. It persists on your device until you change it.
- Messages from the same person within two minutes group into a chain, so a quick burst reads as one turn.
- A small live count shows how many people have posted in the last ten minutes. Tap it to see who.
- New messages auto-scroll to the bottom unless you have scrolled up to read older messages, in which case a jump-to-bottom button appears.
- Light and dark themes. Your choice is remembered.
- Optional desktop notifications when the tab is not focused (laptops work best; mobile browsers throttle background tabs, and iOS only delivers notifications to installed PWAs).

## How to use it

1. Open the page on your phone or laptop.
2. Type a name and tap Join. If someone else is using that name, you will get a numbered variant to accept or replace.
3. Type a message and tap Send (or press Enter). Shift+Enter for a line break.
4. Change your name later from the "change name" link above the composer. Your earlier messages get a small "now <new name>" annotation, visible only to you.

## Limits

- Messages are capped at 500 characters.
- The composer accepts at most five sends per ten seconds. Beyond that you will see a short "slow down" notice for a moment.
- The room shows the most recent 200 messages on load. Older history stays in the database but is not loaded into the page.

## Technical notes

- Single self-contained `index.html`. No build step, no framework.
- Backend is Firebase Realtime Database, loaded dynamically.
- Names, themes, and a stable per-device id are stored in `localStorage`. Clearing site data resets all of them.

## License

Personal project. No license granted for reuse without permission.
