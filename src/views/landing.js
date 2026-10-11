/**
 * Landing View — Start screen with mode selection
 * Journey A: Manual resume | Journey B: JD Assist
 */
export function renderLanding({ onSelectMode }) {
  const section = document.createElement('section');
  section.className = 'landing';

  section.innerHTML = `
    <div class="landing-content animate-in">
      <div class="landing-badge">🎓 Amity University Approved</div>
      
      <h1>
        Build Your<br>
        <span class="highlight">Placement-Ready</span><br>
        Resume
      </h1>
      
      <p class="landing-subtitle">
        Free, mobile-first resume builder with the official Amity template. 
        Fill in your details, preview live, and download a professional PDF — no account needed.
      </p>

      <div class="landing-modes" id="landing-modes">
        <div class="card card--yellow mode-card" data-mode="manual" id="mode-manual">
          <span class="mode-icon">✏️</span>
          <div class="mode-title">Build Manually</div>
          <p class="mode-desc">Complete control over every section with live preview and instant PDF export.</p>
        </div>
        
        <div class="card card--purple mode-card" data-mode="jd-assist" id="mode-jd-assist">
          <span class="mode-icon">🎯</span>
          <div class="mode-title">AI Objective with JD</div>
          <p class="mode-desc">Paste your target Job Description to generate tailored, high-impact career objectives.</p>
        </div>
      </div>

      <div class="landing-features">
        <div class="feature-chip">📱 Mobile First</div>
        <div class="feature-chip">📄 PDF Export</div>
        <div class="feature-chip">🔗 Clickable Links</div>
        <div class="feature-chip">🖼 Photo Upload</div>
        <div class="feature-chip">🔒 Privacy First</div>
        <div class="feature-chip">⚡ Live Preview</div>
      </div>
    </div>
  `;

  // Event delegation for mode cards
  setTimeout(() => {
    const modesContainer = document.getElementById('landing-modes');
    if (modesContainer) {
      modesContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.mode-card');
        if (card) {
          const mode = card.dataset.mode;
          // Add click animation
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            onSelectMode(mode);
          }, 150);
        }
      });
    }
  }, 0);

  return section;
}
