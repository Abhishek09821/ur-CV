/**
 * Resume Upload Modal
 *
 * Provides a full-featured modal for uploading an existing resume:
 * 1. User uploads a PDF or text file
 * 2. User chooses target template (Amity or Jake's)
 * 3. Resume is parsed and auto-fills all form fields
 * 4. Preview updates with the parsed data
 *
 * For users who want to start from scratch, they use the existing
 * "Build Your Resume" flow with default template data.
 */

import { parseUploadedResume } from '../utils/resume-parser.js';

export function openUploadModal({ store, toast, onComplete }) {
  // Remove existing modal if already open
  const existing = document.getElementById('upload-resume-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay upload-modal-overlay';
  overlay.id = 'upload-resume-modal-overlay';

  let selectedTemplate = 'amity';
  let uploadedFile = null;
  let isParsing = false;

  overlay.innerHTML = buildModalHTML(selectedTemplate, uploadedFile, isParsing);
  document.body.appendChild(overlay);

  function refresh() {
    overlay.innerHTML = buildModalHTML(selectedTemplate, uploadedFile, isParsing);
    attachListeners();
  }

  function attachListeners() {
    // Close
    overlay.querySelector('#btn-upload-modal-close')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Template selection
    overlay.querySelectorAll('.upload-tpl-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedTemplate = card.dataset.tpl;
        refresh();
      });
    });

    // File input
    const fileInput = overlay.querySelector('#resume-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          // Validate file
          const allowedTypes = ['application/pdf', 'text/plain'];
          const allowedExts = ['.pdf', '.txt'];
          const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

          if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
            toast.show('Please upload a PDF or TXT file.', 'error');
            fileInput.value = '';
            return;
          }

          if (file.size > 10 * 1024 * 1024) {
            toast.show('File too large. Maximum 10MB allowed.', 'error');
            fileInput.value = '';
            return;
          }

          uploadedFile = file;
          refresh();
        }
      });
    }

    // Remove file
    overlay.querySelector('#btn-remove-file')?.addEventListener('click', () => {
      uploadedFile = null;
      refresh();
    });

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
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
          uploadedFile = file;
          refresh();
        }
      });
    }

    // Parse & Apply button
    overlay.querySelector('#btn-parse-resume')?.addEventListener('click', async () => {
      if (!uploadedFile) {
        toast.show('Please upload a resume file first.', 'error');
        return;
      }

      isParsing = true;
      refresh();

      try {
        const parsedData = await parseUploadedResume(uploadedFile, selectedTemplate);

        // Load parsed data into the store (replace mode — don't merge with defaults)
        store.loadData(parsedData, true);

        // Set the template
        if (store.setTemplate) {
          store.data.template = selectedTemplate;
        }

        toast.show(
          `Resume parsed and loaded into ${selectedTemplate === 'jakes' ? "Jake's" : 'Amity'} format! Review and edit the fields as needed.`,
          'success'
        );

        closeModal();
        if (onComplete) onComplete(selectedTemplate);
      } catch (err) {
        console.error('Resume parsing error:', err);
        toast.show('Failed to parse resume: ' + (err.message || 'Unknown error'), 'error');
        isParsing = false;
        refresh();
      }
    });
  }

  function closeModal() {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 150);
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  document.addEventListener('keydown', handleKey);
  attachListeners();
}

// ============================================================
// MODAL HTML BUILDER
// ============================================================

function buildModalHTML(selectedTemplate, uploadedFile, isParsing) {
  const fileName = uploadedFile ? uploadedFile.name : '';
  const fileSize = uploadedFile ? formatFileSize(uploadedFile.size) : '';

  return `
    <div class="modal upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--purple" style="font-size:0.72rem;">UPLOAD & EDIT</span>
            <span class="badge badge--green" style="font-size:0.72rem;">AUTO-FILL</span>
          </div>
          <h2 class="modal-title mt-xs" id="upload-modal-title">Upload Your Resume</h2>
          <p class="form-hint" style="margin-top:2px;">
            Upload your existing resume to auto-fill all fields. Choose your preferred output format.
          </p>
        </div>
        <button class="modal-close" id="btn-upload-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="upload-modal-body">
        <!-- Step 1: Choose Format -->
        <div class="upload-step">
          <div class="upload-step-header">
            <span class="upload-step-number">1</span>
            <span class="upload-step-title">Choose Output Format</span>
          </div>

          <div class="upload-tpl-grid">
            <div class="upload-tpl-card ${selectedTemplate === 'amity' ? 'active' : ''}" data-tpl="amity">
              <div class="upload-tpl-icon">🎓</div>
              <div class="upload-tpl-info">
                <strong>Amity Official</strong>
                <span class="form-hint">Campus placements & T&P</span>
              </div>
              <div class="upload-tpl-check">${selectedTemplate === 'amity' ? '✓' : ''}</div>
            </div>

            <div class="upload-tpl-card ${selectedTemplate === 'jakes' ? 'active' : ''}" data-tpl="jakes">
              <div class="upload-tpl-icon">📄</div>
              <div class="upload-tpl-info">
                <strong>Jake's Resume</strong>
                <span class="form-hint">ATS-standard LaTeX style</span>
              </div>
              <div class="upload-tpl-check">${selectedTemplate === 'jakes' ? '✓' : ''}</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Upload File -->
        <div class="upload-step">
          <div class="upload-step-header">
            <span class="upload-step-number">2</span>
            <span class="upload-step-title">Upload Resume File</span>
          </div>

          ${uploadedFile ? `
            <div class="upload-file-info">
              <div class="upload-file-icon">📎</div>
              <div class="upload-file-details">
                <strong>${escapeHtml(fileName)}</strong>
                <span class="form-hint">${fileSize}</span>
              </div>
              <button type="button" class="btn btn--sm btn--red" id="btn-remove-file" title="Remove file">&times;</button>
            </div>
          ` : `
            <div class="upload-drop-zone">
              <div class="upload-drop-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p class="upload-drop-text"><strong>Drop your resume here</strong> or click to browse</p>
              <p class="form-hint">Supports PDF, TXT &middot; Max 10MB</p>
              <label class="btn btn--blue btn--sm mt-sm" style="cursor:pointer;">
                Browse Files
                <input type="file" id="resume-file-input" accept=".pdf,.txt,application/pdf,text/plain" style="display:none;" />
              </label>
            </div>
          `}
        </div>

        <!-- Step 3: Parse & Apply -->
        <div class="upload-step">
          <div class="upload-step-header">
            <span class="upload-step-number">3</span>
            <span class="upload-step-title">Parse & Auto-Fill</span>
          </div>

          <p class="form-hint mb-sm">
            Your resume text will be analyzed and all matching sections will be filled automatically.
            Missing information will be left blank for you to fill in manually.
          </p>

          <button 
            type="button" 
            class="btn btn--purple btn--block" 
            id="btn-parse-resume"
            ${!uploadedFile || isParsing ? 'disabled' : ''}
          >
            ${isParsing 
              ? '<span class="upload-spinner"></span> Parsing Resume...' 
              : uploadedFile 
                ? `Parse & Fill ${selectedTemplate === 'jakes' ? "Jake's" : 'Amity'} Format →` 
                : 'Upload a file first to continue'
            }
          </button>

          <div class="upload-info-banner mt-sm">
            <strong>How it works:</strong>
            <ul class="upload-info-list">
              <li>Personal info (name, email, phone) is extracted from the header</li>
              <li>Sections like Experience, Projects, Skills are detected by headings</li>
              <li>Bullet points and details are preserved in the correct format</li>
              <li>You can edit any field after auto-fill in the builder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// HELPERS
// ============================================================

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
