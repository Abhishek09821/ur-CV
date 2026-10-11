/**
 * Full Resume Formats Live Preview Modal
 * 
 * Displays authentic visual previews of:
 * 1. 🎓 Amity Official Format (Shield logo, passport photo, charcoal bars, declaration)
 * 2. 📄 Jake's Resume (Overleaf / LaTeX ATS Software Engineer Standard)
 */

import { buildAmityResumeHTML } from '../views/preview.js';
import { buildJakesResumeHTML } from '../views/jakes-preview.js';

export function openPreviewModal({ store, toast, onSelect }) {
  const existing = document.getElementById('formats-preview-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay formats-preview-modal-overlay';
  overlay.id = 'formats-preview-modal-overlay';

  let currentTab = store.getTemplate ? store.getTemplate() : 'amity';
  const data = store.getData();

  overlay.innerHTML = `
    <div class="modal formats-preview-modal" role="dialog" aria-modal="true" aria-labelledby="prev-modal-title">
      <!-- Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--yellow" style="font-size:0.75rem;">LIVE FORMAT PREVIEWS</span>
            <span class="badge badge--green" style="font-size:0.75rem;">ORIGINAL TEMPLATES</span>
          </div>
          <h2 class="modal-title mt-xs" id="prev-modal-title">All Resume Formats</h2>
          <p class="form-hint" style="margin-top:2px;">
            Preview the original structure and typography of each official format.
          </p>
        </div>
        <button class="modal-close" id="btn-prev-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Controls: Tabs & Switch Button -->
      <div class="formats-preview-controls">
        <div class="formats-preview-tabs">
          <button type="button" class="preview-tab-btn ${currentTab === 'amity' ? 'active' : ''}" data-tpl="amity">
            🎓 Amity Official Format
          </button>
          <button type="button" class="preview-tab-btn ${currentTab === 'jakes' ? 'active' : ''}" data-tpl="jakes">
            📄 Jake's Resume (LaTeX Standard)
          </button>
        </div>
        <button type="button" class="btn btn--green btn--sm" id="btn-use-preview-tpl">
          Use This Format &amp; Open Editor &rarr;
        </button>
      </div>

      <!-- Live Sheet Preview Scroll Area -->
      <div class="formats-preview-viewport" id="formats-preview-viewport">
        <div class="formats-preview-sheet-wrap" id="formats-preview-sheet-wrap">
          <!-- Rendered sheet inserted here -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const sheetWrap = overlay.querySelector('#formats-preview-sheet-wrap');
  const btnUse = overlay.querySelector('#btn-use-preview-tpl');

  function renderSheet(tpl) {
    currentTab = tpl;
    overlay.querySelectorAll('.preview-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tpl === tpl);
    });

    if (tpl === 'jakes') {
      sheetWrap.innerHTML = `
        <div class="jakes-resume-sheet formats-modal-sheet">
          ${buildJakesResumeHTML({ ...data, template: 'jakes' })}
        </div>
      `;
      btnUse.textContent = "Use Jake's Resume & Open Editor \u2192";
    } else {
      sheetWrap.innerHTML = `
        <div class="amity-resume-sheet formats-modal-sheet">
          ${buildAmityResumeHTML({ ...data, template: 'amity' })}
        </div>
      `;
      btnUse.textContent = "Use Amity Format & Open Editor \u2192";
    }
  }

  renderSheet(currentTab);

  overlay.querySelectorAll('.preview-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderSheet(btn.dataset.tpl);
    });
  });

  const closeModal = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 150);
    document.removeEventListener('keydown', handleKey);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleKey);

  overlay.querySelector('#btn-prev-modal-close')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  btnUse.addEventListener('click', () => {
    if (store.setTemplate) {
      store.setTemplate(currentTab);
    } else {
      data.template = currentTab;
    }
    if (toast) {
      toast.show(`Switched to ${currentTab === 'jakes' ? "Jake's Resume" : 'Amity Official Format'}`, 'success');
    }
    closeModal();
    if (onSelect) {
      onSelect(currentTab);
    }
  });
}
