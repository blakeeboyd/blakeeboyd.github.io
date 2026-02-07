/**
 * Media Controller
 * Pauses other embedded players when one starts playing.
 * Supports YouTube, Vimeo, SoundCloud, and Bandcamp.
 */

(function() {
    'use strict';

    // Track all players
    const players = {
        youtube: [],
        vimeo: [],
        soundcloud: [],
        bandcamp: []
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Find all iframes and categorize them
        const iframes = document.querySelectorAll('iframe');

        iframes.forEach((iframe, index) => {
            const src = iframe.src || '';

            if (src.includes('youtube.com/embed')) {
                // Add enablejsapi parameter if not present
                if (!src.includes('enablejsapi=1')) {
                    const separator = src.includes('?') ? '&' : '?';
                    iframe.src = src + separator + 'enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
                }
                players.youtube.push(iframe);
            } else if (src.includes('player.vimeo.com')) {
                players.vimeo.push(iframe);
            } else if (src.includes('soundcloud.com/player')) {
                players.soundcloud.push(iframe);
            } else if (src.includes('bandcamp.com')) {
                players.bandcamp.push(iframe);
            }
        });

        // Listen for messages from players
        window.addEventListener('message', handleMessage);
    }

    // Trusted origins for embedded players
    const trustedOrigins = [
        'https://www.youtube.com',
        'https://player.vimeo.com',
        'https://w.soundcloud.com',
        'https://bandcamp.com'
    ];

    function handleMessage(event) {
        // Validate origin against trusted player domains
        if (!trustedOrigins.some(origin => event.origin.endsWith(new URL(origin).hostname))) {
            return;
        }

        let data;

        // Parse message data
        try {
            data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        } catch (e) {
            // Not JSON, might be a string message
            data = event.data;
        }

        // Find which iframe sent the message
        const sourceIframe = findSourceIframe(event.source);
        if (!sourceIframe) return;

        // Check for play events from different platforms
        if (isPlayEvent(data, event.origin)) {
            pauseAllExcept(sourceIframe);
        }
    }

    function isPlayEvent(data, origin) {
        // YouTube
        if (data && data.event === 'onStateChange' && data.info === 1) {
            return true;
        }
        // YouTube (alternative format)
        if (data && data.info && data.info.playerState === 1) {
            return true;
        }

        // Vimeo
        if (data && data.event === 'play') {
            return true;
        }
        if (data && data.method === 'play') {
            return true;
        }

        // SoundCloud
        if (data && data.method === 'play') {
            return true;
        }
        if (typeof data === 'string' && data.includes('"method":"play"')) {
            return true;
        }

        return false;
    }

    function findSourceIframe(source) {
        const allIframes = [
            ...players.youtube,
            ...players.vimeo,
            ...players.soundcloud,
            ...players.bandcamp
        ];

        return allIframes.find(iframe => iframe.contentWindow === source);
    }

    function pauseAllExcept(activeIframe) {
        // Pause YouTube players
        players.youtube.forEach(iframe => {
            if (iframe !== activeIframe) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'pauseVideo',
                    args: []
                }), 'https://www.youtube.com');
            }
        });

        // Pause Vimeo players
        players.vimeo.forEach(iframe => {
            if (iframe !== activeIframe) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    method: 'pause'
                }), 'https://player.vimeo.com');
            }
        });

        // Pause SoundCloud players
        players.soundcloud.forEach(iframe => {
            if (iframe !== activeIframe) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    method: 'pause'
                }), 'https://w.soundcloud.com');
            }
        });

        // Note: Bandcamp doesn't have a documented postMessage API for control
        // so we can't pause those programmatically
    }
})();
