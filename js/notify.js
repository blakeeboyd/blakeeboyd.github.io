/**
 * Accessible Notification System
 *
 * Provides toast notifications that are accessible to screen readers
 * via aria-live regions. Replaces native alert() calls.
 *
 * Usage:
 *   notify('File uploaded successfully', 'success');
 *   notify('Something went wrong', 'error');
 *   notify('Processing...', 'info');
 *
 * Include in HTML:
 *   <script src="path/to/notify.js"></script>
 */

(function() {
    'use strict';

    // Create styles
    const style = document.createElement('style');
    style.textContent = `
        .notify-container {
            position: fixed;
            bottom: var(--spacing-lg, 24px);
            right: var(--spacing-lg, 24px);
            z-index: 4000;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm, 8px);
            pointer-events: none;
        }

        .notify-toast {
            background: var(--color-card-bg, #ffffff);
            border: 1px solid var(--color-border, #e5e5e5);
            border-radius: var(--radius-md, 8px);
            padding: var(--spacing-sm, 12px) var(--spacing-md, 16px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 360px;
            display: flex;
            align-items: center;
            gap: var(--spacing-sm, 8px);
            pointer-events: auto;
            animation: notify-slide-in 0.2s ease-out;
        }

        .notify-toast.notify-exit {
            animation: notify-slide-out 0.2s ease-in forwards;
        }

        @keyframes notify-slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes notify-slide-out {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .notify-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .notify-toast.notify-success .notify-icon {
            color: var(--color-success, #22c55e);
        }

        .notify-toast.notify-error .notify-icon {
            color: var(--color-error, #ef4444);
        }

        .notify-toast.notify-warning .notify-icon {
            color: var(--color-warning, #f59e0b);
        }

        .notify-toast.notify-info .notify-icon {
            color: var(--color-accent, #2563eb);
        }

        .notify-message {
            color: var(--color-text, #1a1a1a);
            font-size: 0.9375rem;
            line-height: 1.4;
        }

        .notify-close {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            color: var(--color-text-muted, #666666);
            margin-left: auto;
            flex-shrink: 0;
        }

        .notify-close:hover {
            color: var(--color-text, #1a1a1a);
        }

        .notify-close svg {
            width: 16px;
            height: 16px;
        }

        /* Screen reader only live region */
        .notify-sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        @media (max-width: 480px) {
            .notify-container {
                left: var(--spacing-md, 16px);
                right: var(--spacing-md, 16px);
                bottom: var(--spacing-md, 16px);
            }

            .notify-toast {
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Create container and aria-live region
    let container = null;
    let liveRegion = null;

    function ensureContainer() {
        if (!container) {
            container = document.createElement('div');
            container.className = 'notify-container';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Notifications');
            document.body.appendChild(container);
        }
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'notify-sr-only';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }

    // Icon SVGs
    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    /**
     * Show a notification toast
     * @param {string} message - The message to display
     * @param {string} type - One of: 'success', 'error', 'warning', 'info'
     * @param {object} options - Optional settings
     * @param {number} options.duration - Auto-dismiss after ms (0 = no auto-dismiss)
     */
    function notify(message, type = 'info', options = {}) {
        ensureContainer();

        const duration = options.duration !== undefined ? options.duration : 5000;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `notify-toast notify-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <span class="notify-icon" aria-hidden="true">${icons[type] || icons.info}</span>
            <span class="notify-message">${escapeHtml(message)}</span>
            <button class="notify-close" aria-label="Dismiss notification">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Add close handler
        const closeBtn = toast.querySelector('.notify-close');
        closeBtn.addEventListener('click', function() {
            dismissToast(toast);
        });

        // Add to container
        container.appendChild(toast);

        // Announce to screen readers
        liveRegion.textContent = message;

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(function() {
                dismissToast(toast);
            }, duration);
        }

        return toast;
    }

    function dismissToast(toast) {
        if (!toast.parentNode) return;
        toast.classList.add('notify-exit');
        toast.addEventListener('animationend', function() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose globally
    window.notify = notify;
})();
