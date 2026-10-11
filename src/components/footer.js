/**
 * Footer Component — Structured Neo-Brutalist Layout
 */
export function renderFooter({ onNavigate, onShowTemplates } = {}) {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  footer.innerHTML = `
    <div class="footer-container">
      <!-- Grid Columns -->
      <div class="footer-grid">
        <!-- Col 1: Brand & Description -->
        <div class="footer-col footer-col--brand">
          <div class="footer-logo">
            <span class="logo-accent">ur</span>-CV
          </div>
          <p class="footer-tagline">
            Official Amity University, Jake's Resume and more formats. Fully client-side, structured, and privacy-preserving.
          </p>
          <button type="button" class="footer-meta-badge footer-meta-badge--interactive" id="footer-btn-badge-formats" title="Click to view all resume templates">
            OFFICIAL AMITY, JAKE'S &amp; MORE FORMATS &rarr;
          </button>
        </div>

        <!-- Links Container (Side-by-side grid on mobile, inline on desktop) -->
        <div class="footer-mobile-links-row">
          <!-- Col 2: Navigation Links -->
          <div class="footer-col footer-col--nav">
            <h4 class="footer-heading">NAVIGATION</h4>
            <ul class="footer-links">
              <li><a href="/" class="footer-link" data-route="landing">Home</a></li>
              <li><a href="/builder" class="footer-link" data-route="builder">Resume Editor</a></li>
              <li><button type="button" class="footer-link footer-link-btn" id="footer-btn-all-formats">All Resume Formats ✨</button></li>
              <li><a href="/builder" class="footer-link" data-route="builder">Career Objective Tool</a></li>
            </ul>
          </div>

          <!-- Col 3: Creator & Profiles -->
          <div class="footer-col footer-col--developer">
            <h4 class="footer-heading">DEVELOPER &amp; CONNECT</h4>
            <p class="footer-author-name">Abhishek Tiwari</p>
            <ul class="footer-links">
              <li>
                <a 
                  href="https://www.linkedin.com/in/abhishek-tiwari-3a3594300" 
                  class="footer-social-link footer-social-link--linkedin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile &rarr;
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Abhishek09821/ur-CV" 
                  class="footer-social-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub Repository &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-copy">
          &copy; ${new Date().getFullYear()} ur-CV &bull; Official Formats for Amity Students &amp; Software Engineers
        </div>
        <div class="footer-disclaimer">
          Client-Side Only &bull; Zero Server Storage &bull; Private &amp; Secure
        </div>
      </div>
    </div>
  `;

  // Attach internal routing handlers
  if (onNavigate) {
    footer.querySelectorAll('[data-route]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        onNavigate(route);
      });
    });
  }

  // Attach template modal openers
  if (onShowTemplates) {
    footer.querySelector('#footer-btn-badge-formats')?.addEventListener('click', (e) => {
      e.preventDefault();
      onShowTemplates();
    });

    footer.querySelector('#footer-btn-all-formats')?.addEventListener('click', (e) => {
      e.preventDefault();
      onShowTemplates();
    });
  }

  return footer;
}
