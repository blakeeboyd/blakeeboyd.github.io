/**
 * Site Navigation Web Component
 * Renders consistent navigation across all pages
 */
class SiteNav extends HTMLElement {
  connectedCallback() {
    const currentPath = window.location.pathname;
    const basePath = this.getAttribute('base') || '';

    // Determine active page - match exact path segments
    const segments = currentPath.split('/').filter(Boolean);
    const firstSegment = segments[0] || '';
    const isAbout = firstSegment === 'about.html' || firstSegment === 'about';
    const isWorks = firstSegment === 'works.html' || firstSegment === 'works';
    const isContact = firstSegment === 'contact.html' || firstSegment === 'contact';
    const isProjects = firstSegment === 'projects.html' || firstSegment === 'projects' || currentPath.includes('/projects/');
    const isHome = !isAbout && !isWorks && !isContact && !isProjects;

    this.innerHTML = `
      <a href="#main-content" class="skip-to-content">Skip to content</a>
      <header>
        <nav>
          <a href="${basePath || '/'}" class="logo">Blake Boyd</a>
          <button type="button" class="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="nav-links" id="nav-links">
            <a href="${basePath}about.html" class="nav-link${isAbout ? ' active' : ''}">About</a>
            <a href="${basePath}works.html" class="nav-link${isWorks ? ' active' : ''}">Works</a>
            <a href="${basePath}projects.html" class="nav-link${isProjects ? ' active' : ''}">Projects</a>
            <a href="${basePath}contact.html" class="nav-link${isContact ? ' active' : ''}">Contact</a>
            <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
              <svg class="icon-sun" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg class="icon-moon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1200 1200" fill="currentColor">
                <path d="m848.28 482.52c0-74.879 29.52-104.4 104.28-104.4-74.762 0-104.28-29.641-104.28-104.4 0 74.762-29.641 104.4-104.4 104.4 74.758 0 104.4 29.879 104.4 104.4zm65.039 39.961c0 49.559-19.559 69.121-69 69.121 49.441 0 69 19.559 69 69 0-49.441 19.68-69 69.121-69-49.441 0-69.121-19.562-69.121-69.121zm-259.08-195.36c0-36 14.039-49.559 49.441-49.559-36 0-49.441-13.922-49.441-49.441 0 36-14.039 49.441-49.559 49.441 35.52-0.003906 49.559 14.039 49.559 49.559zm466.8 584.88c-2.1289-3.2109-5.1914-5.6914-8.7734-7.1094-3.5859-1.4141-7.5156-1.6992-11.266-0.8125-127.81 30.547-262.38 13.438-378.48-48.121-116.1-61.559-205.77-163.34-252.2-286.27-46.438-122.93-46.449-258.58-0.039062-381.52 17.398-45.648 40.848-88.754 69.719-128.16 3.0273-4.1719 4.2109-9.4023 3.2734-14.473-0.93359-5.0703-3.9023-9.5352-8.2188-12.355-4.3125-2.8203-9.5977-3.75-14.613-2.5703-121.18 28.875-229.78 96.145-309.6 191.79-79.82 95.637-126.59 214.52-133.33 338.9-6.7383 124.39 26.91 247.62 95.93 351.33 69.023 103.7 169.71 182.32 287.06 224.12 117.35 41.801 245.07 44.547 364.11 7.832 119.04-36.715 223.02-110.93 296.43-211.57 2.0859-3.1055 3.1992-6.7617 3.1992-10.5s-1.1133-7.3945-3.1992-10.5zm-657.12 186c-104.26-39.129-193.87-109.53-256.56-201.56-62.688-92.035-95.395-201.2-93.633-312.54s37.898-219.42 103.47-309.42c65.57-90.008 157.36-157.54 262.8-193.35-58.273 97.121-86.691 209.23-81.715 322.39 4.9727 113.15 43.121 222.34 109.7 313.97 66.57 91.633 158.62 161.66 264.7 201.36 91.145 34.43 189.55 45.125 285.96 31.082-72.562 81.875-168.23 139.85-274.39 166.29-106.16 26.434-217.84 20.086-320.33-18.207z"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>
    `;

    // Set footer year (replaces document.write pattern)
    document.querySelectorAll('.footer-year').forEach(function(el) {
      el.textContent = new Date().getFullYear();
    });

    // Store references for cleanup
    this._listeners = [];

    // Initialize after rendering
    this.initThemeToggle();
    this.initHamburger();
  }

  disconnectedCallback() {
    // Clean up document-level listeners
    if (this._listeners) {
      this._listeners.forEach(function(item) {
        item.target.removeEventListener(item.type, item.handler);
      });
      this._listeners = [];
    }
  }

  initThemeToggle() {
    const toggleBtn = this.querySelector('#theme-toggle');
    if (toggleBtn && typeof window.toggleTheme === 'function') {
      toggleBtn.addEventListener('click', window.toggleTheme);
    }
  }

  initHamburger() {
    const hamburger = this.querySelector('.hamburger');
    const navLinks = this.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking a link
      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside (document-level, tracked for cleanup)
      const outsideClickHandler = (e) => {
        if (!this.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      };
      document.addEventListener('click', outsideClickHandler);
      this._listeners.push({ target: document, type: 'click', handler: outsideClickHandler });

      // Close menu on Escape key
      const escapeHandler = (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.focus();
        }
      };
      document.addEventListener('keydown', escapeHandler);
      this._listeners.push({ target: document, type: 'keydown', handler: escapeHandler });
    }
  }
}

customElements.define('site-nav', SiteNav);
