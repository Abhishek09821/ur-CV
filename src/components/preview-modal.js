/**
 * Full Resume Formats Live Preview Modal
 * 
 * Displays authentic visual previews of:
 * 1. Amity Official Format (Shield logo, passport photo, charcoal bars, declaration)
 * 2. Jake's Resume (Overleaf / LaTeX ATS Software Engineer Standard)
 *
 * Clean, well-organized layout with compact segmented tab controls and responsive A4 scaling.
 */

import { buildAmityResumeHTML } from '../views/preview.js';
import { buildJakesResumeHTML } from '../views/jakes-preview.js';
import { JAKES_DEFAULT_RESUME, UNIVERSAL_DEFAULT_RESUME } from '../store.js';

export function openPreviewModal({ store, toast, onSelect }) {
  const existing = document.getElementById('formats-preview-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay formats-preview-modal-overlay';
  overlay.id = 'formats-preview-modal-overlay';

  let currentTab = store.getTemplate ? store.getTemplate() : 'amity';
  let zoomMode = 'fit'; // 'fit' or '100'
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
          <h2 class="modal-title mt-xs" id="prev-modal-title">Official Resume Formats</h2>
          <p class="form-hint" style="margin-top:2px;">
            Preview the structure, typography, and styling of each official standard.
          </p>
        </div>
        <button class="modal-close" id="btn-prev-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Controls: Sleek Segmented Switcher + Action CTA -->
      <div class="formats-preview-controls-bar">
        <div class="formats-segmented-control">
          <button type="button" class="segmented-tab ${currentTab === 'amity' ? 'active' : ''}" data-tpl="amity">
            Amity Official
          </button>
          <button type="button" class="segmented-tab ${currentTab === 'jakes' ? 'active' : ''}" data-tpl="jakes">
            Jake's ATS
          </button>
        </div>

        <div class="formats-controls-right">
          <div class="formats-zoom-toggle">
            <button type="button" class="btn btn--xs btn--white" id="btn-toggle-sheet-zoom" title="Toggle Zoom / Fit">
              Fit
            </button>
          </div>
          <button type="button" class="btn btn--green btn--sm" id="btn-use-preview-tpl">
            Use Format &rarr;
          </button>
        </div>
      </div>

      <!-- Live Sheet Preview Scroll Area -->
      <div class="formats-preview-viewport" id="formats-preview-viewport">
        <div class="formats-preview-sheet-wrap ${zoomMode === 'fit' ? 'mode-fit' : 'mode-full'}" id="formats-preview-sheet-wrap">
          <!-- Rendered sheet inserted here -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const sheetWrap = overlay.querySelector('#formats-preview-sheet-wrap');
  const btnUse = overlay.querySelector('#btn-use-preview-tpl');
  const btnZoom = overlay.querySelector('#btn-toggle-sheet-zoom');

  function renderSheet(tpl) {
    currentTab = tpl;
    overlay.querySelectorAll('.segmented-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tpl === tpl);
    });

    if (tpl === 'jakes') {
      const isAmityDefault = 
        data.personal?.address?.includes('Gayatri Vihar') || 
        data.projects?.some((p) => p.name === 'CANARY-WORKSPACE AI FILE');
      const jakesPreviewData = isAmityDefault ? JAKES_DEFAULT_RESUME : { ...JAKES_DEFAULT_RESUME, ...data, template: 'jakes' };

      sheetWrap.innerHTML = `
        <div class="jakes-resume-sheet formats-modal-sheet">
          ${buildJakesResumeHTML(jakesPreviewData)}
        </div>
      `;
      btnUse.innerHTML = "Use Jake's Resume &rarr;";
    } else {
      const isJakesDefault = 
        data.projects?.some((p) => p.name === 'Movie Ticket Management System') ||
        data.experience?.some((e) => e.company === 'Pega Platform');
      const amityPreviewData = isJakesDefault ? UNIVERSAL_DEFAULT_RESUME : { ...UNIVERSAL_DEFAULT_RESUME, ...data, template: 'amity' };

      sheetWrap.innerHTML = `
        <div class="amity-resume-sheet formats-modal-sheet">
          ${buildAmityResumeHTML(amityPreviewData)}
        </div>
      `;
      btnUse.innerHTML = "Use Amity Format &rarr;";
    }

    applyScaling();
  }

  function applyScaling() {
    const viewport = overlay.querySelector('#formats-preview-viewport');
    const sheet = overlay.querySelector('.formats-modal-sheet');
    if (!viewport || !sheet) return;

    if (zoomMode === 'fit') {
      const vpWidth = viewport.clientWidth - 32;
      const targetWidth = 794; // approx A4 210mm
      const scale = Math.min(1.0, Math.max(0.38, vpWidth / targetWidth));
      sheet.style.transform = `scale(${scale})`;
      sheet.style.transformOrigin = 'top center';
      sheetWrap.style.height = `${Math.round(sheet.offsetHeight * scale) + 40}px`;
      if (btnZoom) btnZoom.textContent = '100%';
    } else {
      sheet.style.transform = 'none';
      sheetWrap.style.height = 'auto';
      if (btnZoom) btnZoom.textContent = 'Fit';
    }
  }

  renderSheet(currentTab);

  overlay.querySelectorAll('.segmented-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderSheet(btn.dataset.tpl);
    });
  });

  if (btnZoom) {
    btnZoom.addEventListener('click', () => {
      zoomMode = zoomMode === 'fit' ? 'full' : 'fit';
      applyScaling();
    });
  }

  window.addEventListener('resize', applyScaling);

  const closeModal = () => {
    window.removeEventListener('resize', applyScaling);
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
