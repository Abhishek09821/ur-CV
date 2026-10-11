/**
 * Resume Template Selection Modal
 *
 * Pop-up dialog allowing users to choose or switch between:
 * 1. 🎓 Amity Official Format (University Placement drives, photo & shield)
 * 2. 📄 Jake's Resume (Overleaf / LaTeX Software Engineer ATS single-page)
 */

export function openTemplateModal({ store, toast, onSelect }) {
  // Remove existing modal if already open
  const existing = document.getElementById('template-picker-modal-overlay');
  if (existing) existing.remove();

  const currentTemplate = store.getTemplate ? store.getTemplate() : 'amity';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay template-modal-overlay';
  overlay.id = 'template-picker-modal-overlay';

  overlay.innerHTML = `
    <div class="modal template-picker-modal" role="dialog" aria-modal="true" aria-labelledby="tpl-modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--yellow" style="font-size:0.75rem;">RESUME FORMATS</span>
            <span class="badge badge--green" style="font-size:0.75rem;">100% ATS COMPATIBLE</span>
          </div>
          <h2 class="modal-title mt-xs" id="tpl-modal-title">Choose Resume Template</h2>
          <p class="form-hint" style="margin-top:2px;">
            Select a format suited for your recruitment process. All your entered data carries over seamlessly.
          </p>
        </div>
        <button class="modal-close" id="btn-tpl-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Modal Body: Template Selection Cards -->
      <div class="template-cards-grid">
        <!-- Template 1: Amity Official Format -->
        <div class="template-card ${currentTemplate === 'amity' ? 'active' : ''}" data-tpl="amity">
          <div class="template-card-header">
            <div class="template-card-icon">🎓</div>
            <div class="template-card-meta">
              <span class="template-badge template-badge--amity">OFFICIAL FORMAT</span>
              <h3 class="template-card-title">Amity Official Format</h3>
            </div>
          </div>

          <p class="template-card-desc">
            Official format engineered strictly for Amity University campus placement drives and T&amp;P verification.
          </p>

          <ul class="template-card-features">
            <li><span>✓</span> Official Amity shield logo &amp; passport photo</li>
            <li><span>✓</span> Structured charcoal #2C2E30 section bars</li>
            <li><span>✓</span> Mandatory Self-Declaration with Date &amp; Place</li>
            <li><span>✓</span> Precise Times New Roman justified typography</li>
          </ul>

          <div class="template-card-action">
            <button class="btn btn--block ${currentTemplate === 'amity' ? 'btn--yellow' : 'btn--white'} btn-select-tpl" data-tpl="amity">
              ${currentTemplate === 'amity' ? '✓ Selected (Active)' : 'Use Amity Format &rarr;'}
            </button>
          </div>
        </div>

        <!-- Template 2: Jake's Resume -->
        <div class="template-card ${currentTemplate === 'jakes' ? 'active' : ''}" data-tpl="jakes">
          <div class="template-card-header">
            <div class="template-card-icon">📄</div>
            <div class="template-card-meta">
              <span class="template-badge template-badge--jakes">LATEX / OVERLEAF</span>
              <h3 class="template-card-title">Jake's Resume</h3>
            </div>
          </div>

          <p class="template-card-desc">
            The iconic Software Engineer resume standard from Overleaf. Ultra-clean, single-page, and recruiter-focused.
          </p>

          <ul class="template-card-features">
            <li><span>✓</span> Centered header with interactive social profiles</li>
            <li><span>✓</span> Full-width horizontal divider lines</li>
            <li><span>✓</span> Zero graphics or photos for 100% ATS readability</li>
            <li><span>✓</span> Right-aligned dates and dense bullet layouts</li>
          </ul>

          <div class="template-card-action">
            <button class="btn btn--block ${currentTemplate === 'jakes' ? 'btn--yellow' : 'btn--white'} btn-select-tpl" data-tpl="jakes">
              ${currentTemplate === 'jakes' ? '✓ Selected (Active)' : "Use Jake's Resume &rarr;"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 150);
    document.removeEventListener('keydown', handleKeyDown);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Close button
  overlay.querySelector('#btn-tpl-modal-close')?.addEventListener('click', closeModal);

  // Backdrop click to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Template selection
  overlay.querySelectorAll('.btn-select-tpl, .template-card').forEach((el) => {
    el.addEventListener('click', (e) => {
      const tpl = el.dataset.tpl || el.closest('[data-tpl]')?.dataset.tpl;
      if (!tpl) return;

      if (store.setTemplate) {
        store.setTemplate(tpl);
      } else {
        store.getData().template = tpl;
      }

      if (toast) {
        toast.show(`Switched to ${tpl === 'jakes' ? "Jake's Resume" : 'Amity Official Format'}`, 'success');
      }

      closeModal();

      if (onSelect) {
        onSelect(tpl);
      }
    });
  });
}
