/**
 * Resume Upload Modal
 *
 * Accepts EVERY type of resume format and template (PDF).
 * Preserves 100% of the original header, layout, fonts, colors, and static sections.
 * Clean, compact, non-stacked layout that fits completely within mobile and desktop viewports.
 */

import { PDFDocumentEngine } from '../utils/pdf-document-engine.js';

export function openUploadModal({ toast, onComplete }) {
  const existing = document.getElementById('upload-resume-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay upload-modal-overlay';
  overlay.id = 'upload-resume-modal-overlay';

  let uploadedFile = null;
  let isParsing = false;
  let statusMessage = '';

  overlay.innerHTML = buildModalHTML(uploadedFile, isParsing, statusMessage);
  document.body.appendChild(overlay);

  function refresh() {
    overlay.innerHTML = buildModalHTML(uploadedFile, isParsing, statusMessage);
    attachListeners();
  }

  function attachListeners() {
    // Close modal
    overlay.querySelector('#btn-upload-modal-close')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !isParsing) closeModal();
    });

    // File input
    const fileInput = overlay.querySelector('#resume-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          await processSelectedFile(file);
        }
      });
    }

    // Drag and drop
    const dropZone = overlay.querySelector('.upload-drop-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });
      dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
          await processSelectedFile(file);
        }
      });
    }

    // Sample resume buttons
    overlay.querySelector('#btn-demo-jake')?.addEventListener('click', async () => {
      try {
        const res = await fetch('/Abhishek-Tiwari-Resume.pdf');
        const blob = await res.blob();
        const file = new File([blob], 'Abhishek-Tiwari-Resume.pdf', { type: 'application/pdf' });
        await processSelectedFile(file);
      } catch (e) {
        console.error('Failed to load sample Jake resume:', e);
      }
    });

    overlay.querySelector('#btn-demo-amity')?.addEventListener('click', async () => {
      try {
        const res = await fetch('/Abhishek_Tiwari_Resume_Updated.pdf');
        const blob = await res.blob();
        const file = new File([blob], 'Abhishek_Tiwari_Resume_Updated.pdf', { type: 'application/pdf' });
        await processSelectedFile(file);
      } catch (e) {
        console.error('Failed to load sample Amity resume:', e);
      }
    });
  }

  async function processSelectedFile(file) {
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      if (toast) toast.show('Please upload a PDF resume file.', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      if (toast) toast.show('File too large. Maximum 20MB allowed.', 'error');
      return;
    }

    uploadedFile = file;
    isParsing = true;
    statusMessage = 'Reading PDF vector document & pages...';
    refresh();

    try {
      const engine = new PDFDocumentEngine();

      statusMessage = 'Analyzing layout, typography & section bounds...';
      refresh();

      await engine.loadFile(file);

      statusMessage = 'Preparing editable sections (Objective, Skills, Experience)...';
      refresh();

      if (toast) {
        toast.show('Resume parsed successfully! Original format preserved.', 'success');
      }

      closeModal();
      if (onComplete) {
        onComplete(engine);
      }
    } catch (err) {
      console.error('Failed to parse uploaded resume:', err);
      isParsing = false;
      statusMessage = '';
      if (toast) {
        toast.show('Error parsing resume: ' + (err.message || 'Ensure PDF contains selectable text.'), 'error');
      }
      refresh();
    }
  }

  function closeModal() {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 150);
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape' && !isParsing) closeModal();
  }

  document.addEventListener('keydown', handleKey);
  attachListeners();
}

function buildModalHTML(uploadedFile, isParsing, statusMessage) {
  return `
    <div class="modal upload-modal-clean" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--green">UNIVERSAL PDF ENGINE</span>
            <span class="badge badge--yellow">ZERO LAYOUT SHIFT</span>
          </div>
          <h2 class="modal-title mt-xs" id="upload-modal-title">Upload Any Resume</h2>
          <p class="form-hint" style="margin-top:2px;">
            Upload your resume in any style. We preserve 100% of your header, fonts, and layout.
          </p>
        </div>
        ${!isParsing ? '<button class="modal-close" id="btn-upload-modal-close" title="Close (ESC)">&times;</button>' : ''}
      </div>

      <!-- Modal Body -->
      <div class="upload-modal-body">
        ${
          isParsing
            ? `
          <div class="upload-parsing-state animate-in">
            <div class="spinner spinner--lg"></div>
            <h3 class="mt-md font-bold">${escapeHtml(uploadedFile ? uploadedFile.name : 'Processing Resume')}</h3>
            <p class="form-hint mt-xs">${escapeHtml(statusMessage || 'Analyzing document...')}</p>
            
            <div class="upload-progress-steps mt-md">
              <div class="prog-step done">Reading original document pages</div>
              <div class="prog-step done">Preserving header, photo, vectors &amp; layout</div>
              <div class="prog-step active">Preparing in-place editable sections...</div>
            </div>
          </div>
        `
            : `
          <!-- Drop Zone -->
          <div class="upload-drop-zone">
            <div class="upload-drop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            
            <p class="upload-drop-title">Drop your resume PDF here</p>
            <p class="upload-drop-subtitle">Any layout or design &middot; LaTeX, Amity, Canva, Word &middot; Max 20MB</p>
            
            <label class="btn btn--blue btn--sm upload-select-btn" style="cursor:pointer;">
              Choose PDF File
              <input type="file" id="resume-file-input" accept=".pdf,application/pdf" style="display:none;" />
            </label>
          </div>

          <!-- Quick Samples Bar -->
          <div class="upload-samples-bar">
            <span class="upload-samples-label">Or try sample:</span>
            <div class="upload-samples-buttons">
              <button type="button" class="btn btn--xs btn--white sample-btn" id="btn-demo-jake">
                Jake's ATS Resume
              </button>
              <button type="button" class="btn btn--xs btn--white sample-btn" id="btn-demo-amity">
                Amity Placement CV
              </button>
            </div>
          </div>

          <!-- Compact Trust Strip -->
          <div class="upload-trust-row">
            <span class="trust-pill">100% Original Design Kept</span>
            <span class="trust-pill">Edit 3 Key Sections</span>
            <span class="trust-pill">Instant Vector Preview</span>
          </div>
        `
        }
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
