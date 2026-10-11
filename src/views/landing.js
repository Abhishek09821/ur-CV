/**
 * Landing View — Start screen with single unified Build Your Resume action
 */
export function renderLanding({ onSelectMode }) {
  const section = document.createElement('section');
  section.className = 'landing';

  section.innerHTML = `
    <div class="landing-content animate-in">
      <div class="landing-badge">AMITY UNIVERSITY PLACEMENT FORMAT</div>
      
      <h1>
        Build Your<br>
        <span class="highlight">Placement-Ready</span><br>
        Resume
      </h1>
      
      <p class="landing-subtitle">
        Mobile-first resume builder adhering to the official Amity placement template.
        Enter your credentials, inspect live A4 layout, and export searchable vector PDF without account sign-up.
      </p>

      <div class="landing-modes landing-modes--single" id="landing-modes">
        <div class="card card--yellow mode-card mode-card--single" data-mode="manual" id="mode-start-builder">
          <div class="mode-card-kicker">OFFICIAL TEMPLATE // ZERO TRACKING</div>
          <div class="mode-title">Build Your Resume</div>
          <p class="mode-desc">
            Complete editorial control over academic qualifications, projects, internships, skills, and JD-tailored career summary with instant live preview.
          </p>
          <div class="mt-md">
            <span class="btn btn--purple btn--block" style="pointer-events:none;font-size:1rem;padding:var(--space-md);">
              Open Resume Editor &rarr;
            </span>
          </div>
        </div>
      </div>

      <div class="landing-features">
        <div class="feature-chip">Mobile Responsive</div>
        <div class="feature-chip">Vector PDF Export</div>
        <div class="feature-chip">JD Objective Tool</div>
        <div class="feature-chip">Passport Photo</div>
        <div class="feature-chip">Client-Side Private</div>
        <div class="feature-chip">Live A4 Preview</div>
      </div>
    </div>
  `;

  // Event listener for start card
  setTimeout(() => {
    const startCard = document.getElementById('mode-start-builder');
    if (startCard) {
      startCard.addEventListener('click', () => {
        startCard.style.transform = 'scale(0.97)';
        setTimeout(() => {
          onSelectMode('manual');
        }, 120);
      });
    }
  }, 0);

  return section;
}
