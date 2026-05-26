/* Backchannel push-notification Cloud Function.

   Trigger: any new child added under backchannel/{room}/messages/{msgId} in
   the Realtime Database fires this function. We then:

   1. Read the room's subscriptions and bans nodes.
   2. Build the push payload from the message (truncated text, room key).
   3. Send a Web Push to every subscription EXCEPT the sender's deviceId
      and any banned deviceIds.
   4. Clean up subscriptions that respond 410 Gone (browser unsubscribed).

   Required configuration (set once before deploy):
     firebase functions:config:set \
       vapid.public="<public key>" \
       vapid.private="<private key>" \
       vapid.subject="mailto:you@example.com"

   In v2 Cloud Functions, that config is exposed as process.env.VAPID_*
   only if you also load it via defineSecret / params. Simpler: read it
   from environment variables you set at deploy time via .env files in
   the functions/ directory. Either path works; pick one in firebase.json.

   This function uses environment variables, set via a functions/.env file
   that is NOT committed to git (already in .gitignore). The deploy guide
   walks through populating it.
*/

import { onValueCreated } from "firebase-functions/v2/database";
import { logger } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import webpush from "web-push";

initializeApp();

// VAPID credentials. Read at module load; if any are missing the function
// will throw on first invocation rather than silently no-op.
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC  || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:noreply@example.com";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

// The trigger path. {room} matches any room key, {msgId} matches the push id
// of the message. Region defaults to us-central1; change if you're hosting
// elsewhere (also update firebase.json's hostingConfig if you do).
export const fanoutMessagePush = onValueCreated(
  {
    ref: "/backchannel/{room}/messages/{msgId}",
    region: "us-central1"
  },
  async (event) => {
    if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
      logger.error("VAPID env vars missing; refusing to send. Set VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT.");
      return;
    }

    const room = event.params.room;
    const msg = event.data.val() || {};
    if (!msg.text || !msg.name) {
      logger.info("Message missing required fields; skipping.", { room, msg });
      return;
    }

    const db = getDatabase();
    const subsSnap = await db.ref(`backchannel/${room}/subscriptions`).get();
    const subs = subsSnap.val() || {};

    const bansSnap = await db.ref(`backchannel/${room}/bans`).get();
    const bans = bansSnap.val() || {};

    const senderDeviceId = typeof msg.deviceId === "string" ? msg.deviceId : null;

    // Build the payload. The Service Worker push handler reads JSON.
    const bodyText = msg.text.length > 140 ? msg.text.slice(0, 137) + "..." : msg.text;
    const payload = JSON.stringify({
      title: `${msg.name} on Backchannel`,
      body: bodyText,
      tag: `backchannel-${room}`,
      url: room === "default" ? "./" : `./?room=${encodeURIComponent(room)}`
    });

    const toDelete = []; // subscription keys (deviceIds) that need cleanup

    const sendPromises = Object.keys(subs).map(async (deviceId) => {
      if (deviceId === senderDeviceId) return; // don't notify the sender
      if (bans[deviceId]) return;              // don't notify banned devices
      const sub = subs[deviceId];
      if (!sub || !sub.endpoint) return;
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err) {
        const code = err && err.statusCode;
        if (code === 404 || code === 410) {
          // Subscription is gone (user unsubscribed at browser level or device removed).
          logger.info("Cleaning up dead subscription", { room, deviceId, code });
          toDelete.push(deviceId);
        } else {
          logger.warn("Push send failed (non-cleanup)", { room, deviceId, code, message: err && err.message });
        }
      }
    });

    await Promise.all(sendPromises);

    // Garbage-collect dead subscriptions in one batch update.
    if (toDelete.length > 0) {
      const updates = {};
      for (const d of toDelete) updates[`backchannel/${room}/subscriptions/${d}`] = null;
      try { await db.ref().update(updates); }
      catch (err) { logger.warn("Failed to clean up dead subscriptions", { err: err.message }); }
    }

    logger.info("Fanout complete", {
      room,
      total: Object.keys(subs).length,
      sent: Object.keys(subs).length - toDelete.length - (senderDeviceId && subs[senderDeviceId] ? 1 : 0)
    });
  }
);
