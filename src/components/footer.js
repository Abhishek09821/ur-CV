/**
 * Footer Component — Structured Neo-Brutalist Layout
 */
export function renderFooter({ onNavigate } = {}) {
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
            Official Amity University Resume Builder. Fully client-side, structured, and privacy-preserving.
          </p>
          <div class="footer-meta-badge">
            OFFICIAL AMITY TEMPLATE
          </div>
        </div>

        <!-- Col 2: Navigation Links -->
        <div class="footer-col">
          <h4 class="footer-heading">NAVIGATION</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link" data-route="landing">Home</a></li>
            <li><a href="/builder" class="footer-link" data-route="builder">Resume Editor</a></li>
            <li><a href="/builder" class="footer-link" data-route="builder">Career Objective Tool</a></li>
          </ul>
        </div>

        <!-- Col 3: Creator & Profiles -->
        <div class="footer-col">
          <h4 class="footer-heading">DEVELOPER & CONNECT</h4>
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

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-copy">
          &copy; ${new Date().getFullYear()} ur-CV &bull; Official Format for Amity University Students
        </div>
        <div class="footer-disclaimer">
          Client-Side Only &bull; Zero Server Storage &bull; Private & Secure
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

  return footer;
}
