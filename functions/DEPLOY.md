# Deploying Backchannel Cloud Functions

This is a one-time setup followed by `firebase deploy` whenever the function code changes. The function is what turns "a new message was written to Firebase" into "an actual push notification on every subscribed device's lock screen." Without it deployed, Stage 1's PWA + Service Worker still works for in-tab notifications, but tab-closed notifications won't happen.

## One-time setup

### 1. Activate the Blaze plan

Cloud Functions are not available on the free Spark plan. You need to attach a billing account to the Firebase project.

1. Go to the [Firebase Console](https://console.firebase.google.com/) → project **soundbox-9** → bottom-left "Upgrade" or "Modify plan."
2. Choose **Blaze (pay-as-you-go)** and attach a payment method.
3. Set a budget alert if you want one. For classroom volume, you're highly unlikely to exceed the free tier ($0/mo realistic).

Blaze gives you a generous free quota inside it: 2M function invocations/mo, 400K GB-seconds compute, 5 GB egress per month, all free. A class session with 30 students and 100 messages costs in the single-digit dollars at most, and you'd have to do that every day for years to start paying.

### 2. Install the Firebase CLI

```bash
npm install -g firebase-tools
```

Then log in:

```bash
firebase login
```

Browser will open for OAuth. Use the Google account that owns the soundbox-9 project.

### 3. Install function dependencies

From the repo root:

```bash
cd functions
npm install
```

This pulls in `firebase-admin`, `firebase-functions`, and `web-push`. The `functions/node_modules/` directory is gitignored.

### 4. Set VAPID secrets

The function reads its VAPID keys from environment variables. For local development you write them to `functions/.env` (gitignored); for production you set them via the Firebase Functions config and they get baked into the deployed function's environment.

The keys live at `~/.config/backchannel-vapid.json` on this machine (chmod 0600, outside the repo). Copy them out:

```bash
cd functions
cat ~/.config/backchannel-vapid.json
```

Create `functions/.env` (the file is in .gitignore, so don't worry about committing):

```bash
cat > functions/.env <<EOF
VAPID_PUBLIC=<paste publicKey here>
VAPID_PRIVATE=<paste privateKey here>
VAPID_SUBJECT=mailto:soblake2019@gmail.com
EOF
```

Firebase v2 functions read `.env` automatically at deploy time and inject them as `process.env.*` in the deployed environment.

### 5. Deploy

From the repo root:

```bash
firebase deploy --only functions
```

First deploy takes 2-5 minutes. You'll see something like:

```
✔  functions[fanoutMessagePush(us-central1)] Successful create operation.
```

The function is now live. Any new message written to `backchannel/{room}/messages/{msgId}` will trigger it.

### 6. Verify

1. Open the app, sign in as Blake on one device, regular user on a second device.
2. Turn on notifications on the second device (composer → "notifications: off" → "notifications: on" → grant permission).
3. Send a message from Blake's device.
4. The second device should get a system notification within ~1 second.

For diagnostic logs while testing:

```bash
firebase functions:log --only fanoutMessagePush
```

## Subsequent deploys

After the one-time setup, deploying new function code is just:

```bash
firebase deploy --only functions
```

Updating rules (changes to `projects/backchannel/firebase-rules.json`) deploys separately:

```bash
firebase deploy --only database
```

Both can be combined: `firebase deploy` deploys everything in `firebase.json`.

## Troubleshooting

**"Error: HTTP Error: 403, Cloud Functions for Firebase requires the Blaze (pay-as-you-go) billing plan."**
You skipped step 1. Activate Blaze.

**"Error: Failed to load function definition from source: Failed to generate manifest from function source."**
Run `npm install` inside `functions/` first.

**Notifications never arrive on real devices.**
1. Check `firebase functions:log` for errors during the fanout. Common: VAPID env vars missing → set them and redeploy.
2. Check the subscriptions node in the Firebase Console (Realtime Database → backchannel → {room} → subscriptions). Should have an entry keyed by deviceId for every device with notifications on.
3. iOS specifically: notifications only deliver when the PWA is installed (Add to Home Screen). The install banner explains this.
4. Mobile in general: throttling. Background notifications can be delayed up to a minute depending on battery state.

**The function is firing but missing the sender's deviceId in the suppression check.**
The Cloud Function reads `msg.deviceId` from the message. Every Backchannel send includes the deviceId; the migration block in `index.html` keeps existing devices stable. If you ever see the sender getting their own notification, check that the client is sending the deviceId and that the function log shows it.
