/**
 * Rebuilt Resume Upload Modal
 *
 * Accepts EVERY type of resume format and template (PDF).
 * Preserves 100% of the original header, layout, fonts, colors, and static sections.
 * Automatically analyzes the document and opens the Quick Editor for
 * Technical Skills, Career Objective, and Work Experience.
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
  }

  async function processSelectedFile(file) {
    // Validation
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

      statusMessage = 'Parsing Objective, Technical Skills & Experience...';
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
    <div class="modal upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--green" style="font-size:0.75rem;">EVERY TEMPLATE ACCEPTED</span>
            <span class="badge badge--yellow" style="font-size:0.75rem;">ORIGINAL FORMAT KEPT</span>
          </div>
          <h2 class="modal-title mt-xs" id="upload-modal-title">Upload Any Resume</h2>
          <p class="form-hint" style="margin-top:2px;">
            Upload your resume in any style, layout, or format. We preserve your header &amp; design exactly.
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
              <div class="prog-step done">✓ Reading original document</div>
              <div class="prog-step done">✓ Preserving original header, fonts &amp; layout</div>
              <div class="prog-step active">⏳ Extracting editable sections...</div>
            </div>
          </div>
        `
            : `
          <!-- Drop Zone -->
          <div class="upload-drop-zone">
            <div class="upload-drop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p class="upload-drop-text"><strong>Drop any resume here</strong> or click to browse</p>
            <p class="form-hint">Accepted: Any PDF template &middot; Max 20MB &middot; Mobile Friendly</p>
            
            <label class="btn btn--blue btn--sm mt-md" style="cursor:pointer;">
              Select PDF File
              <input type="file" id="resume-file-input" accept=".pdf,application/pdf" style="display:none;" />
            </label>
          </div>

          <div class="upload-feature-highlights mt-md">
            <div class="highlight-item">
              <span class="highlight-icon">🔒</span>
              <div>
                <strong>100% Format Preservation</strong>
                <p class="form-hint">Your header, colors, fonts, photos, and structure remain completely identical.</p>
              </div>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">⚡</span>
              <div>
                <strong>Quick Mobile Editing</strong>
                <p class="form-hint">Edit Career Objective, Technical Skills, and Experience with live reflow.</p>
              </div>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">👁️</span>
              <div>
                <strong>On-Demand Preview</strong>
                <p class="form-hint">Editor opens directly for fast input. Tap Preview Resume whenever you want.</p>
              </div>
            </div>
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
