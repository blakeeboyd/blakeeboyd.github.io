# Restricting the Firebase API key

The `firebaseConfig.apiKey` value in `index.html` is *designed* to be public — [Firebase docs explain why](https://firebase.google.com/docs/projects/api-keys#general-info-firebase-api-keys). It's a project identifier, not a credential. Security comes from the database rules, not from hiding this value.

That said, you can add a small belt-and-suspenders restriction so the key only works when called from `blakeeboyd.github.io`. It takes about two minutes in the Google Cloud Console.

## Steps

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and switch to the `soundbox-9` project via the top-left project picker.
2. Navigate to **APIs & Services → Credentials** in the left sidebar.
3. Under "API Keys" find the entry named something like **"Browser key (auto created by Firebase)"**. Its value starts with `AIzaSy...` — the same one in `firebaseConfig.apiKey`.
4. Click the pencil/edit icon next to it.
5. Under **Application restrictions**, choose **"HTTP referrers (web sites)"**.
6. Under **Website restrictions → Add an item**, add:
   - `https://blakeeboyd.github.io/*`
   - `http://localhost:*/*` (only if you ever run the site locally with a dev server)
7. Under **API restrictions**, optionally choose **"Restrict key"** and select only:
   - Identity Toolkit API
   - Firebase Realtime Database API
   - Token Service API
8. Click **Save**.

## What this changes

- **Browsers on other origins now get rejected.** A clone of your client code hosted at, say, `evil.example.com` cannot use your Firebase project from there — its requests will fail because the `Referer` header doesn't match the allowlist.
- **Browsers on blakeeboyd.github.io still work.** Your actual app is unaffected.

## What this doesn't change

- **An attacker running the code in their browser from `blakeeboyd.github.io`** (e.g., a student who opens DevTools and runs arbitrary Firebase SDK code) still has the same access they had before. Referrer restrictions only stop other origins from impersonating yours; they don't stop people *on* your origin from doing whatever they want.
- **The actual data security still depends on the database rules.** Deploying `firebase-rules.json` is the meaningful action; this is a polish step on top.

## Caveats

- Restricting too aggressively can break things. If you suddenly find the site can't reach Firebase, undo the restriction (just remove the entries) and the key reverts to "unrestricted."
- The "API restrictions" step (limiting which APIs the key can call) is more useful than the referrer check for catching mistakes — if you ever add a non-Firebase Google API to the project, this restriction will prevent the same key from working with it.
- Restriction changes can take 5–10 minutes to propagate. If something fails right after saving, wait a beat before troubleshooting.
