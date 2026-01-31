/**
 * Work in Progress Modal
 *
 * Include this script on any page to show a "work in progress" notice.
 * The modal appears on page load and must be dismissed before using the page.
 *
 * Usage: Add to any page's <head>:
 *   <script src="../../../js/wip-modal.js" defer></script>
 *
 * Or for root-level pages:
 *   <script src="js/wip-modal.js" defer></script>
 */

(function() {
    'use strict';

    // Get the contact page URL relative to current page
    function getContactUrl() {
        const siteNav = document.querySelector('site-nav');
        if (siteNav && siteNav.hasAttribute('base')) {
            return siteNav.getAttribute('base') + 'contact.html';
        }
        return 'contact.html';
    }

    // Inject CSS styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .wip-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--spacing-md, 16px);
            }

            .wip-modal {
                background: var(--color-card-bg, #ffffff);
                border: 1px solid var(--color-border, #e5e5e5);
                border-radius: var(--radius-lg, 12px);
                max-width: 480px;
                width: 100%;
                padding: var(--spacing-lg, 24px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }

            .wip-modal-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm, 8px);
                margin-bottom: var(--spacing-md, 16px);
            }

            .wip-modal-icon {
                width: 24px;
                height: 24px;
                color: var(--color-warning, #f59e0b);
            }

            .wip-modal-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0;
            }

            .wip-modal-body {
                color: var(--color-text-muted, #666666);
                margin-bottom: var(--spacing-lg, 24px);
            }

            .wip-modal-body p {
                margin-bottom: var(--spacing-sm, 8px);
            }

            .wip-modal-body p:last-child {
                margin-bottom: 0;
            }

            .wip-modal-body a {
                color: var(--color-accent, #2563eb);
                text-decoration: none;
            }

            .wip-modal-body a:hover {
                text-decoration: underline;
            }

            .wip-modal-footer {
                display: flex;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(style);
    }

    // Create and show the modal
    function showModal() {
        const contactUrl = getContactUrl();

        const overlay = document.createElement('div');
        overlay.className = 'wip-modal-overlay';
        overlay.innerHTML = `
            <div class="wip-modal" role="dialog" aria-labelledby="wip-title" aria-describedby="wip-description">
                <div class="wip-modal-header">
                    <svg class="wip-modal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <h2 id="wip-title" class="wip-modal-title">Work in Progress</h2>
                </div>
                <div id="wip-description" class="wip-modal-body">
                    <p>This tool is still under active development. Some features may be incomplete or behave unexpectedly.</p>
                    <p>If you encounter any bugs or have feature requests, please <a href="${contactUrl}">get in touch</a>.</p>
                </div>
                <div class="wip-modal-footer">
                    <button class="action-button wip-confirm-btn">Got it</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const modal = overlay.querySelector('.wip-modal');
        const confirmBtn = overlay.querySelector('.wip-confirm-btn');
        const contactLink = overlay.querySelector('.wip-modal-body a');

        // Store the element that had focus before modal opened
        const previouslyFocused = document.activeElement;

        // Get all focusable elements in the modal
        const focusableElements = [contactLink, confirmBtn].filter(Boolean);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Close modal function
        function closeModal() {
            overlay.remove();
            // Restore focus to previously focused element
            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
        }

        // Add click handler to close button
        confirmBtn.addEventListener('click', closeModal);

        // Add Escape key handler
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                return;
            }

            // Focus trap: Tab and Shift+Tab cycle within modal
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift+Tab: if on first element, go to last
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab: if on last element, go to first
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeydown);

        // Clean up event listener when modal is removed
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(node) {
                    if (node === overlay) {
                        document.removeEventListener('keydown', handleKeydown);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });

        // Focus the button for accessibility
        confirmBtn.focus();
    }

    // Initialize
    injectStyles();
    showModal();
})();
