/**
 * Landing View — Clean, well-organized gateway
 * Two clear, beautifully structured pathways:
 * 1. Build from Scratch (Amity Official & Jake's ATS templates)
 * 2. Upload Any Resume (Universal in-place reflow editor)
 */
export function renderLanding({ onSelectMode, onUploadMode }) {
  const section = document.createElement('section');
  section.className = 'landing';

  section.innerHTML = `
    <div class="landing-content animate-in">
      <div class="landing-badge">
        OFFICIAL AMITY UNIVERSITY FORMAT
      </div>
      
      <h1 class="landing-headline">
        BUILD YOUR <span class="highlight">PROFESSIONAL</span> RESUME
      </h1>
      
      <p class="landing-subtitle">
        Create an ATS-perfect resume from official templates or upload your existing CV to edit on mobile without losing layout, fonts, or styling.
      </p>

      <!-- Two Primary Pathways: Clean, Balanced Dashboard Cards -->
      <div class="landing-modes" id="landing-modes">
        <!-- Pathway 1: Build from Scratch -->
        <div class="mode-card mode-card--scratch" data-mode="scratch" id="mode-start-builder">
          <div class="mode-card-top">
            <span class="mode-icon-badge mode-icon-badge--yellow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </span>
            <span class="mode-tag">START FRESH</span>
          </div>

          <div class="mode-card-body">
            <h2 class="mode-title">Build from Scratch</h2>
            <p class="mode-desc">
              Create a new resume with official Amity or Jake's ATS format. Full section control with step-by-step guidance and live preview.
            </p>
          </div>

          <div class="mode-card-footer">
            <span class="btn btn--purple btn--sm mode-action-btn">
              Open Builder &rarr;
            </span>
          </div>
        </div>

        <!-- Pathway 2: Upload Existing Resume -->
        <div class="mode-card mode-card--upload" data-mode="upload" id="mode-upload-resume">
          <div class="mode-card-top">
            <span class="mode-icon-badge mode-icon-badge--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </span>
            <span class="mode-tag">UNIVERSAL PDF</span>
          </div>

          <div class="mode-card-body">
            <h2 class="mode-title">Upload Any Resume</h2>
            <p class="mode-desc">
              Upload any PDF resume. We protect 100% of your original header, photo, and layout while letting you edit content on mobile.
            </p>
          </div>

          <div class="mode-card-footer">
            <span class="btn btn--green btn--sm mode-action-btn">
              Upload &amp; Edit &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  setTimeout(() => {
    const scratchCard = document.getElementById('mode-start-builder');
    if (scratchCard) {
      scratchCard.addEventListener('click', () => {
        scratchCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
          onSelectMode('manual');
        }, 100);
      });
    }

    const uploadCard = document.getElementById('mode-upload-resume');
    if (uploadCard) {
      uploadCard.addEventListener('click', () => {
        uploadCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
          if (onUploadMode) onUploadMode();
        }, 100);
      });
    }
  }, 0);

  return section;
}
