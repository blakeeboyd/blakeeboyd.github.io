/**
 * Site Navigation Web Component
 * Renders consistent navigation across all pages
 */
class SiteNav extends HTMLElement {
  connectedCallback() {
    const currentPath = window.location.pathname;
    const basePath = this.getAttribute('base') || '';

    // Determine active page
    const isAbout = currentPath.includes('about');
    const isContact = currentPath.includes('contact');
    const isProjects = currentPath.includes('projects');
    const isHome = !isAbout && !isContact && !isProjects;

    this.innerHTML = `
      <header>
        <nav>
          <a href="${basePath || '/'}" class="logo">Blake Boyd</a>
          <button type="button" class="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="nav-links">
            <a href="${basePath}about.html" class="nav-link${isAbout ? ' active' : ''}">About</a>
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
              <svg class="icon-moon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>
    `;

    // Initialize after rendering
    this.initThemeToggle();
    this.initHamburger();
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

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
}

customElements.define('site-nav', SiteNav);
