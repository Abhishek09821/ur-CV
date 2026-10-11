/**
 * Landing View — Start screen with single unified Build Your Resume action
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

      <div class="landing-modes landing-modes--single" id="landing-modes">
        <div class="card card--yellow mode-card mode-card--single" data-mode="manual" id="mode-start-builder">
          <span class="mode-icon">🚀</span>
          <div class="mode-title">Build Your Resume</div>
          <p class="mode-desc">
            Complete control over all sections, smart AI objective generator with JD, live A4 preview, and instant vector PDF download.
          </p>
          <div class="mt-md">
            <span class="btn btn--purple btn--block" style="pointer-events:none;font-size:1rem;padding:var(--space-md);">
              Start Building Now →
            </span>
          </div>
        </div>
      </div>

      <div class="landing-features">
        <div class="feature-chip">📱 Mobile First</div>
        <div class="feature-chip">📄 PDF Export</div>
        <div class="feature-chip">🎯 AI Objective</div>
        <div class="feature-chip">🖼 Photo Upload</div>
        <div class="feature-chip">🔒 Privacy First</div>
        <div class="feature-chip">⚡ Live Preview</div>
      </div>
    </div>
  `;

  // Event listener for single start card
  setTimeout(() => {
    const startCard = document.getElementById('mode-start-builder');
    if (startCard) {
      startCard.addEventListener('click', () => {
        startCard.style.transform = 'scale(0.96)';
        setTimeout(() => {
          onSelectMode('manual');
        }, 120);
      });
    }
  }, 0);

  return section;
}
