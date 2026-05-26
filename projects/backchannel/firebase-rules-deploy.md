# Deploying the Firebase rules

The rules in `firebase-rules.json` replace the current open `.read: true / .write: true` test-mode rules with shape validation and ban/lock enforcement. Deploy them manually before relying on the new features in production.

## What changes

**Before** (test mode):
```json
{ "rules": { ".read": true, ".write": true } }
```

**After**: validated shape on messages, bans, archives, adminSession, locked. Server-side enforcement of:
- Banned devices cannot post messages
- Locked rooms accept only messages with `name == "Blake"`
- Random keys outside the known schema are rejected

What it does **not** add (would require Firebase Auth):
- Real authentication for admin actions. Writing `bans/{deviceId}` is still permitted from any client. The soft lock on the admin name is still the only gate at the app layer.
- Real per-IP rate limiting. The client-side rolling window is still the only rate limit.

## Steps

1. Open the [Firebase Console](https://console.firebase.google.com/) → `soundbox-9` → Realtime Database → Rules tab.
2. Paste the contents of `firebase-rules.json` into the editor.
3. Click **Publish**.
4. Verify by:
   - Posting a normal message from the room — should succeed.
   - Opening the admin panel, locking the room, attempting to send a non-admin message — should fail in DevTools network panel with a permission error. The composer should also be disabled at the UI layer.
   - Banning a test device and attempting to send from there — should fail at the rules level even if the client tries to bypass UI.

## Rollback

If something breaks, paste back the open rules:

```json
{ "rules": { ".read": true, ".write": true } }
```

and click **Publish**. This restores the previous behavior immediately. Investigate, fix the rules JSON, and re-publish.

## Future tightening

To move past soft locks, the next step is Firebase Authentication. With auth in place, rules can be rewritten to gate admin writes on a specific UID, enforce server-side rate limiting via Cloud Functions, and verify that the `deviceId` in a message body matches the writer's auth UID (preventing impersonation by message-body name).
