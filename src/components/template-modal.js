/**
 * Resume Template Selection Modal
 *
 * Horizontal, side-by-side layout across all screen sizes.
 * Never stacks vertically — fits completely within screen without scrolling.
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
            <span class="badge badge--yellow" style="font-size:0.7rem;">RESUME FORMATS</span>
            <span class="badge badge--green" style="font-size:0.7rem;">100% ATS COMPATIBLE</span>
          </div>
          <h2 class="modal-title mt-xs" id="tpl-modal-title">Choose Resume Template</h2>
          <p class="form-hint" style="margin-top:2px;">
            Select your preferred standard. Both formats share all your data.
          </p>
        </div>
        <button class="modal-close" id="btn-tpl-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Horizontal Side-by-Side Template Cards -->
      <div class="template-cards-grid">
        <!-- Card 1: Amity Official Format -->
        <div class="template-card ${currentTemplate === 'amity' ? 'active' : ''}" data-tpl="amity">
          <div class="template-card-header">
            <div class="template-card-meta">
              <span class="template-badge template-badge--amity">OFFICIAL FORMAT</span>
              <h3 class="template-card-title">Amity Official</h3>
            </div>
          </div>

          <p class="template-card-desc">
            Campus placement drives &amp; T&amp;P verification.
          </p>

          <ul class="template-card-features">
            <li>Shield logo &amp; photo box</li>
            <li>Charcoal section bars</li>
            <li>Self-Declaration table</li>
          </ul>

          <div class="template-card-action">
            <button class="btn btn--block ${currentTemplate === 'amity' ? 'btn--yellow' : 'btn--white'} btn-select-tpl" data-tpl="amity">
              ${currentTemplate === 'amity' ? 'Selected' : 'Use Amity &rarr;'}
            </button>
          </div>
        </div>

        <!-- Card 2: Jake's Resume -->
        <div class="template-card ${currentTemplate === 'jakes' ? 'active' : ''}" data-tpl="jakes">
          <div class="template-card-header">
            <div class="template-card-meta">
              <span class="template-badge template-badge--jakes">LATEX STANDARD</span>
              <h3 class="template-card-title">Jake's Resume</h3>
            </div>
          </div>

          <p class="template-card-desc">
            Overleaf software engineer ATS single-page format.
          </p>

          <ul class="template-card-features">
            <li>Centered header &amp; links</li>
            <li>1px horizontal rule lines</li>
            <li>Right-aligned dates</li>
          </ul>

          <div class="template-card-action">
            <button class="btn btn--block ${currentTemplate === 'jakes' ? 'btn--yellow' : 'btn--white'} btn-select-tpl" data-tpl="jakes">
              ${currentTemplate === 'jakes' ? 'Selected' : "Use Jake's &rarr;"}
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

  overlay.querySelector('#btn-tpl-modal-close')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  overlay.querySelectorAll('.btn-select-tpl, .template-card').forEach((el) => {
    el.addEventListener('click', () => {
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
