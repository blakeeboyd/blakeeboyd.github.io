/**
 * Filter ID — Anonymous Telemetry Module
 *
 * Collects anonymous interaction data for SoTL research.
 * No PII. No cookies. No persistent identifiers.
 * Session ID is a random UUID generated per page load.
 * Consent stored in sessionStorage (resets each browser session).
 *
 * Transport: download only (researcher downloads JSON via ?researcher=true).
 * A beacon transport can be swapped in later.
 */

(function () {
    'use strict';

    var SESSION_ID = crypto.randomUUID();
    var SESSION_START = Date.now();
    var CONSENT_KEY = 'fid-telemetry-consent';

    var events = [];
    var consented = false;
    var sessionEnded = false;

    // ── Consent ──────────────────────────────────

    function grantConsent() {
        sessionStorage.setItem(CONSENT_KEY, 'yes');
        consented = true;
        hideBanner();
    }

    function denyConsent() {
        sessionStorage.setItem(CONSENT_KEY, 'no');
        consented = false;
        events = [];
        hideBanner();
    }

    function showBanner() {
        var banner = document.getElementById('fid-consent-banner');
        if (banner) banner.classList.remove('hidden');
    }

    function hideBanner() {
        var banner = document.getElementById('fid-consent-banner');
        if (banner) banner.classList.add('hidden');
    }

    // ── Event Recording ──────────────────────────

    function track(eventName, payload) {
        var entry = { event: eventName, ts: Date.now() - SESSION_START };
        if (payload) {
            var keys = Object.keys(payload);
            for (var i = 0; i < keys.length; i++) {
                entry[keys[i]] = payload[keys[i]];
            }
        }
        events.push(entry);
    }

    // ── Session Envelope ─────────────────────────

    function getSessionData() {
        return {
            schema: 1,
            sessionId: SESSION_ID,
            startedAt: new Date(SESSION_START).toISOString(),
            consented: consented,
            events: consented ? events : []
        };
    }

    // ── Session End ──────────────────────────────

    function endSession(payload) {
        if (sessionEnded) return;
        sessionEnded = true;
        track('session_end', payload || { duration_ms: Date.now() - SESSION_START });
    }

    // ── Download Transport ───────────────────────

    function isResearcherMode() {
        try {
            var params = new URLSearchParams(window.location.search);
            return params.get('researcher') === 'true';
        } catch (e) {
            return false;
        }
    }

    function downloadSessionJSON() {
        var data = getSessionData();
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'filter-id-session-' + SESSION_ID.slice(0, 8) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ── Initialization ───────────────────────────

    function init() {
        var stored = sessionStorage.getItem(CONSENT_KEY);

        if (stored === 'yes') {
            consented = true;
        } else if (stored === 'no') {
            consented = false;
        } else {
            showBanner();
        }

        // Wire up banner buttons
        var acceptBtn = document.getElementById('fid-consent-accept');
        var declineBtn = document.getElementById('fid-consent-decline');
        if (acceptBtn) acceptBtn.addEventListener('click', grantConsent);
        if (declineBtn) declineBtn.addEventListener('click', denyConsent);

        // Researcher mode: show download button
        if (isResearcherMode()) {
            var dlBtn = document.getElementById('fid-download-session');
            if (dlBtn) {
                dlBtn.classList.remove('hidden');
                dlBtn.addEventListener('click', downloadSessionJSON);
            }
        }
    }

    // ── Public API ───────────────────────────────

    window.FilterTelemetry = {
        init: init,
        track: track,
        endSession: endSession,
        getSessionData: getSessionData,
        isResearcherMode: isResearcherMode
    };
})();
