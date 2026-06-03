# Stage 2B: Push notifications deploy plan

Status as of pause: Stage 1 (PWA shell, Service Worker, iOS install banner) and Stage 3 (tightened Firebase database rules) are deployed and live. Stage 2A (Cloud Function code + client subscription logic) is committed in the repo but not deployed.

This document is the resume guide. Pick it up when you're ready to activate Blaze and ship tab-closed push notifications.

## What's already done

- **Code is written and on `main`.**
  - `functions/index.js` — the Cloud Function (`fanoutMessagePush`) that triggers on new messages and sends Web Push to subscribed devices, excluding the sender and banned devices.
  - `functions/package.json`, `functions/.gitignore`, `functions/DEPLOY.md` — function dependencies and deploy walkthrough.
  - `firebase.json` and `.firebaserc` at the repo root — Firebase CLI metadata.
  - Client subscription code in `index.html`: `VAPID_PUBLIC` constant, `subscribeToPush()`, `unsubscribeFromPush()`, notify-toggle wiring, boot-time reconciliation.
  - Backend `subscribeDevice` / `unsubscribeDevice` methods.
  - Subscription path shape validation in `firebase-rules.json` (deployed).

- **Firebase CLI installed** at `/opt/homebrew/bin/firebase` (via `brew install firebase-cli`).
- **`firebase login`** already run; CLI is authenticated against the Google account that owns `soundbox-9`.
- **Tightened database rules are live.** Subscription writes will be shape-validated server-side once subscriptions start being written.

- **VAPID keys generated.** Public key inline in `index.html`. Private key at `~/.config/backchannel-vapid.json` (chmod 0600, not in the repo).

## What's still required

Six steps, in order. Steps 1 and 2 are the ones with friction; the rest are essentially copy-paste-run.

### 1. Activate Firebase Blaze plan

Cloud Functions are not available on the free Spark plan. This is a manual action in the Firebase Console:

1. Open the [Firebase Console](https://console.firebase.google.com/project/soundbox-9/usage/details) for the project.
2. Click **Modify plan** (or **Upgrade**) in the bottom-left.
3. Select **Blaze (Pay as you go)** and attach a billing account (a Google Cloud billing account). New users get $300 in free credit; classroom volume costs ~$0/mo in practice, well under Blaze's free tier (2M invocations, 400K GB-seconds compute, 5 GB egress per month).
4. (Optional but recommended) Set a budget alert (e.g., $5/mo) so you get an email if something unexpected starts running up costs.

Confirmation: the project will show "Blaze" instead of "Spark" in the console.

### 2. Install function dependencies and populate `.env`

From the repo root:

```bash
cd functions
npm install
```

This pulls in `firebase-admin`, `firebase-functions`, and `web-push`. The `node_modules` directory is gitignored.

Then create `functions/.env` (also gitignored) by copying from the VAPID key file:

```bash
cat ~/.config/backchannel-vapid.json
# Then create functions/.env:
cat > functions/.env <<EOF
VAPID_PUBLIC=<paste publicKey from the cat above>
VAPID_PRIVATE=<paste privateKey from the cat above>
VAPID_SUBJECT=mailto:soblake2019@gmail.com
EOF
```

Firebase v2 Cloud Functions read `.env` at deploy time and bake the values into the deployed function's `process.env`.

### 3. Deploy the function

From the repo root:

```bash
firebase deploy --only functions
```

First deploy takes 2-5 minutes. You'll see Firebase install dependencies on the server side, build, and deploy. Expected success output:

```
✔  functions[fanoutMessagePush(us-central1)] Successful create operation.
```

If the deploy fails with anything containing "Cloud Functions for Firebase requires the Blaze plan," step 1 wasn't completed. If it fails with anything about missing environment variables, step 2 was incomplete.

### 4. Smoke test on real devices

You need at least two devices (or one device + one browser profile) for this to be meaningful: one to send a message, one to receive the push.

1. **Device A (sender)**: open the app, set a name. Make sure you can post messages.
2. **Device B (receiver)**: open the app. Sign in as a different name. Enable notifications via the composer toggle ("notifications: off" → grant permission → "notifications: on"). On iOS, this requires the app to be installed via Share → Add to Home Screen first (the install banner explains this).
3. **Background Device B.** Lock the screen, switch apps, or close the tab.
4. **Send a message from Device A.** Within ~1 second Device B should receive a system notification: "<name> on Backchannel" with the message text.

While testing, tail the function logs in another terminal:

```bash
firebase functions:log --only fanoutMessagePush
```

You should see entries like:

```
Fanout complete { room: 'default', total: 1, sent: 1 }
```

### 5. Verify the subscription record in Firebase

Sanity check that subscriptions are landing in the right place. Either:

- Firebase Console → Realtime Database → `backchannel` → `default` → `subscriptions` → expect a single child keyed by Device B's `deviceId`.
- Or from the CLI:

```bash
firebase database:get /backchannel/default/subscriptions
```

The subscription entry should have `endpoint`, `keys` (with `p256dh` and `auth`), and `ts`.

### 6. (Optional) API key restriction

See [api-key-restriction.md](api-key-restriction.md) for the Google Cloud Console walkthrough to restrict the Firebase API key to `blakeeboyd.github.io`. Defense in depth on top of the now-deployed rules.

## Caveats and known limitations

- **iOS push only works for installed PWAs.** A student opening the URL in Mobile Safari without "Add to Home Screen" will not get tab-closed pushes. The install banner Stage 1 added prompts them; if they dismiss it, they can re-trigger the install via Safari's Share menu manually.
- **Android push works in both browser tabs and installed PWAs.** Notifications fire even when the tab is closed, as long as the Service Worker is registered.
- **The Cloud Function suppresses the sender by `deviceId`.** Each device generates its own random UUID; multi-device users (laptop + phone) will get pushes on the device they didn't send from, which is the expected behavior.
- **Subscription cleanup on room deletion isn't built.** Deleting a room from `_rooms/` leaves orphaned `subscriptions/{deviceId}` entries under the deleted room's path. Listed as a roadmap candidate in `CLAUDE.md`. No active harm — the orphans just take up a few KB of Firebase storage.
- **Per-room subscription model.** Turning on notifications in `mus399` does not subscribe you for `mus430`. To get notifications for both, students enable the toggle in both rooms. This was deliberate (see the design discussion in the original Stage 2 plan).

## Cost reality check

For a classroom of 30 students, 100 messages per session:

- 30 × 100 = 3,000 push fan-outs per session
- Cloud Function invocations: 100 per session (one per message)
- Function execution time: <1 second per invocation

Blaze free tier is 2M invocations/mo. You'd need to run ~600 sessions per month to start paying. Realistic worst case: under $1/mo at academic-year volume.

## If something goes sideways

The fallback is to undeploy the function:

```bash
firebase functions:delete fanoutMessagePush
```

This removes the trigger. The app continues to work for in-tab notifications (Stage 1 still functions). Tab-closed pushes simply stop happening until you redeploy.

To roll back the rules to test-mode if needed (don't do this unless something's broken):

```bash
# Temporary; this re-opens the database to arbitrary writes.
echo '{ "rules": { ".read": true, ".write": true } }' > /tmp/open-rules.json
firebase deploy --only database --rules /tmp/open-rules.json
```

Then redeploy the tightened rules later:

```bash
firebase deploy --only database
```

## Resuming after a long pause

If significant time has passed and you want to make sure nothing has bitrotted before deploying:

1. `firebase --version` — Firebase CLI installed
2. `firebase projects:list` — should show `soundbox-9 (current)`, confirms login is valid
3. `cat ~/.config/backchannel-vapid.json` — VAPID keys still on this machine
4. `git log --oneline | grep -i "stage 2\|notifications"` — confirms the relevant commits are in `main`
5. Open `blakeeboyd.github.io/projects/backchannel/` — confirms Stage 1 is still live

If any of those fail, re-establish before deploying. The CLAUDE.md in this directory has the full architecture map.

## Pointer summary

| What | Where |
|---|---|
| Cloud Function code | `functions/index.js` |
| Function dependencies | `functions/package.json` |
| Full deploy walkthrough | `functions/DEPLOY.md` |
| Firebase project config | `firebase.json`, `.firebaserc` |
| Database rules (already deployed) | `projects/backchannel/firebase-rules.json` |
| Rules deploy walkthrough | `projects/backchannel/firebase-rules-deploy.md` |
| VAPID private key (local only) | `~/.config/backchannel-vapid.json` |
| VAPID public key (in repo, safe) | `VAPID_PUBLIC` constant in `projects/backchannel/index.html` |
| Client subscribe/unsubscribe logic | `projects/backchannel/index.html` (search "subscribeToPush") |
| API key restriction guide | `projects/backchannel/api-key-restriction.md` |
| Architecture reference | `projects/backchannel/CLAUDE.md` |
