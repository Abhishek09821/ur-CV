/**
 * Landing View — Start screen with two primary options:
 * 1. Build Your Resume from Scratch (existing fixed template flow)
 * 2. Upload & Edit Your Resume (parse existing resume into chosen format)
 */
export function renderLanding({ onSelectMode, onUploadMode }) {
  const section = document.createElement('section');
  section.className = 'landing';

  section.innerHTML = `
    <div class="landing-content animate-in">
      <div class="landing-badge">OFFICIAL AMITY UNIVERSITY FORMAT</div>
      
      <h1>
        Build Your<br>
        <span class="highlight">Professional</span><br>
        Resume
      </h1>
      
      <p class="landing-subtitle">
        Mobile-first resume builder adhering to official Amity University &amp; Jake's ATS templates.
        Upload an existing resume or build from scratch. Export searchable vector PDF without account sign-up.
      </p>

      <div class="landing-modes" id="landing-modes">
        <!-- Card 1: Build from Scratch -->
        <div class="card card--yellow mode-card" data-mode="scratch" id="mode-start-builder">
          <div class="mode-card-kicker">START FRESH // OFFICIAL TEMPLATES</div>
          <div class="mode-title">Build from Scratch</div>
          <p class="mode-desc">
            Start with a pre-filled template (Amity or Jake's format). 
            Complete editorial control over every section with live preview and JD-tailored career summary.
          </p>
          <div class="mt-md">
            <span class="btn btn--purple btn--block" style="pointer-events:none;font-size:0.95rem;padding:var(--space-sm) var(--space-md);">
              Open Resume Editor &rarr;
            </span>
          </div>
        </div>

        <!-- Card 2: Upload & Edit -->
        <div class="card card--blue mode-card" data-mode="upload" id="mode-upload-resume">
          <div class="mode-card-kicker">UPLOAD & AUTO-FILL // AI-ASSISTED</div>
          <div class="mode-title">Upload Your Resume</div>
          <p class="mode-desc">
            Upload your existing resume (PDF/TXT) and auto-fill all fields into Amity or Jake's format.
            AI-powered bullet generation for projects &amp; experience.
          </p>
          <div class="mt-md">
            <span class="btn btn--green btn--block" style="pointer-events:none;font-size:0.95rem;padding:var(--space-sm) var(--space-md);">
              Upload &amp; Convert &rarr;
            </span>
          </div>
        </div>
      </div>

      <div class="landing-features">
        <div class="feature-chip">Mobile Responsive</div>
        <div class="feature-chip">Vector PDF Export</div>
        <div class="feature-chip">JD Objective Tool</div>
        <div class="feature-chip">Resume Upload</div>
        <div class="feature-chip">AI Bullet Points</div>
        <div class="feature-chip">Client-Side Private</div>
        <div class="feature-chip">Live A4 Preview</div>
        <div class="feature-chip">Passport Photo</div>
      </div>
    </div>
  `;

  // Event listeners
  setTimeout(() => {
    const scratchCard = document.getElementById('mode-start-builder');
    if (scratchCard) {
      scratchCard.addEventListener('click', () => {
        scratchCard.style.transform = 'scale(0.97)';
        setTimeout(() => {
          onSelectMode('manual');
        }, 120);
      });
    }

    const uploadCard = document.getElementById('mode-upload-resume');
    if (uploadCard) {
      uploadCard.addEventListener('click', () => {
        uploadCard.style.transform = 'scale(0.97)';
        setTimeout(() => {
          if (onUploadMode) onUploadMode();
        }, 120);
      });
    }
  }, 0);

  return section;
}
