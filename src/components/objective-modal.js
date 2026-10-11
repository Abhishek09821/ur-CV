/**
 * Career Objective Generator Modal
 *
 * Pop-up interface where users paste a Job Description (JD),
 * generate multiple distinct, tailored career objectives,
 * edit or preview them, and apply the chosen one directly to their resume.
 */

import { generateObjectivesFromJD } from '../utils/objective-generator.js';

const SAMPLE_JD = `Job Title: Associate Software Engineer / SDE-1
About the Role:
We are looking for a passionate Software Engineer to join our core product engineering team. You will design, build, and deploy high-performance full-stack web applications and scalable APIs.

Key Responsibilities:
- Develop robust, scalable web services using Python, Java, or Node.js.
- Build clean, responsive user interfaces using React.js, HTML5, and CSS3.
- Write efficient SQL queries and manage relational (PostgreSQL, MySQL) and NoSQL (MongoDB) databases.
- Design and integrate RESTful APIs and microservice architectures.
- Collaborate with agile squads, participate in code reviews, and automate tests.

Requirements & Qualifications:
- Bachelor's degree in Computer Science, IT, or related engineering discipline.
- Strong foundational understanding of Data Structures, Algorithms, and Object-Oriented Programming (OOP).
- Hands-on project exposure in React, Python, Java, or JavaScript.
- Familiarity with Git, Linux, Docker, or AWS is a plus.
- Good problem-solving mindset and eagerness to learn new frameworks.`;

export function openObjectiveModal({ store, toast, onApply }) {
  // Remove any existing modal if already open
  const existing = document.getElementById('objective-generator-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay objective-modal-overlay';
  overlay.id = 'objective-generator-modal-overlay';

  const candidateData = store.getData();
  let currentResults = null;
  let generationCount = 0;

  overlay.innerHTML = `
    <div class="modal objective-modal" role="dialog" aria-modal="true" aria-labelledby="obj-modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--purple" style="font-size:0.75rem;">JD TAILORED</span>
            <span class="badge badge--yellow" style="font-size:0.75rem;">OFFICIAL AMITY FORMAT</span>
          </div>
          <h2 class="modal-title mt-xs" id="obj-modal-title">Career Objective Generator</h2>
          <p class="form-hint" style="margin-top:2px;">
            Paste your target Job Description (JD) to generate diverse, role-tailored objectives grounded in your verified credentials.
          </p>
        </div>
        <button class="modal-close" id="btn-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="objective-modal-body">
        <!-- Input Section -->
        <div class="obj-input-section">
          <div class="flex items-center justify-between mb-xs">
            <label class="form-label mb-0" for="obj-jd-textarea">
              Target Job Description (JD) <span class="required">*</span>
            </label>
            <div class="flex gap-xs">
              <button type="button" class="btn btn--sm btn--white" id="btn-sample-jd" title="Fill with a realistic tech JD for quick testing">
                Insert Sample JD
              </button>
              <button type="button" class="btn btn--sm btn--white" id="btn-clear-jd" title="Clear input">
                Clear
              </button>
            </div>
          </div>

          <textarea 
            class="form-textarea obj-jd-input" 
            id="obj-jd-textarea" 
            rows="6" 
            placeholder="Paste the full job description here (Role, Responsibilities, Required Tech Stack, Qualifications)..."
          ></textarea>

          <div class="flex items-center justify-between mt-xs">
            <span class="form-hint" id="jd-char-count">0 characters entered</span>
            <span class="form-hint">Tip: Include role title and required technologies for optimal alignment</span>
          </div>

          <!-- Generate Action Button -->
          <button type="button" class="btn btn--purple btn--block mt-md" id="btn-generate-objectives">
            Generate Tailored Objectives
          </button>
        </div>

        <!-- Results Mount Area -->
        <div id="obj-results-container" class="obj-results-container" style="display:none;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Focus the textarea
  const textarea = overlay.querySelector('#obj-jd-textarea');
  const resultsContainer = overlay.querySelector('#obj-results-container');
  const generateBtn = overlay.querySelector('#btn-generate-objectives');
  const charCount = overlay.querySelector('#jd-char-count');

  textarea.focus();

  // Character counter
  textarea.addEventListener('input', () => {
    const len = textarea.value.trim().length;
    charCount.textContent = `${len} character${len === 1 ? '' : 's'} entered`;
  });

  // Sample JD button
  overlay.querySelector('#btn-sample-jd')?.addEventListener('click', () => {
    textarea.value = SAMPLE_JD;
    textarea.dispatchEvent(new Event('input'));
    toast.show('Sample Job Description inserted.', 'info');
  });

  // Clear button
  overlay.querySelector('#btn-clear-jd')?.addEventListener('click', () => {
    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
  });

  // Generate Button Click
  generateBtn.addEventListener('click', () => {
    const jdText = textarea.value.trim();
    if (!jdText || jdText.length < 25) {
      toast.show('Please paste a job description (at least a few sentences/requirements).', 'error');
      textarea.focus();
      return;
    }

    runGeneration(jdText);
  });

  function runGeneration(jdText) {
    generationCount++;
    generateBtn.disabled = true;
    generateBtn.innerHTML = 'Analyzing requirements and generating variations...';

    setTimeout(() => {
      currentResults = generateObjectivesFromJD(jdText, candidateData);
      renderResults(currentResults);
      generateBtn.disabled = false;
      generateBtn.innerHTML = 'Regenerate with Fresh Variations';
      
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      toast.show(`Generated 4 unique objective variations. (Run #${generationCount})`, 'success');
    }, 250);
  }

  function renderResults(results) {
    const { parsed, options } = results;
    resultsContainer.style.display = 'block';

    resultsContainer.innerHTML = `
      <div class="obj-results-header mt-lg mb-md">
        <div class="flex items-center justify-between flex-wrap gap-xs">
          <div class="flex items-center gap-xs">
            <span class="badge badge--green">4 TAILORED VARIATIONS READY</span>
            <span class="badge badge--dark">Role: ${escapeHtml(parsed.targetRole)}</span>
          </div>
          <button type="button" class="btn btn--sm btn--yellow" id="btn-regenerate-more">
            Regenerate New Phrasings
          </button>
        </div>

        <!-- Extracted Skills Cloud -->
        ${parsed.matchedTech && parsed.matchedTech.length > 0 ? `
          <div class="obj-extracted-box mt-sm">
            <span class="obj-extracted-label">Identified JD Stack & Domain:</span>
            <div class="tag-cloud mt-xs">
              ${parsed.matchedTech.slice(0, 10).map((t) => `<span class="tag tag--yellow">${escapeHtml(t)}</span>`).join('')}
              <span class="tag tag--green">Domain: ${escapeHtml(parsed.targetDomain)}</span>
            </div>
          </div>
        ` : ''}
      </div>

      <p class="form-hint mb-md">
        Each option emphasizes a distinct professional angle. You can review or edit the wording before applying:
      </p>

      <div class="obj-cards-grid">
        ${options.map((opt, idx) => `
          <div class="obj-card" data-card-id="${opt.id}" data-card-index="${idx}">
            <div class="obj-card-header">
              <div class="flex items-center gap-xs">
                <span class="badge ${opt.badgeClass}">${escapeHtml(opt.tag)}</span>
                <strong class="obj-card-title">${escapeHtml(opt.title)}</strong>
              </div>
              <span class="obj-card-length" id="len-opt-${idx}">
                ${opt.text.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <p class="obj-card-desc">${escapeHtml(opt.description)}</p>

            <div class="obj-card-body">
              <textarea 
                class="form-textarea obj-card-textarea" 
                id="textarea-opt-${idx}" 
                rows="4"
              >${escapeHtml(opt.text)}</textarea>
            </div>

            <div class="obj-card-actions">
              <button type="button" class="btn btn--sm btn--green btn-apply-objective" data-index="${idx}">
                Apply to Resume
              </button>
              <button type="button" class="btn btn--sm btn--white btn-copy-objective" data-index="${idx}" title="Copy to clipboard">
                Copy Text
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-center mt-lg">
        <button type="button" class="btn btn--yellow" id="btn-regenerate-footer">
          Generate 4 More Variations
        </button>
      </div>
    `;

    // Attach listeners on result cards
    resultsContainer.querySelectorAll('.btn-apply-objective').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.index;
        const editedText = resultsContainer.querySelector(`#textarea-opt-${idx}`)?.value || options[idx].text;
        
        if (onApply) {
          onApply(editedText.trim());
        }
        closeModal();
      });
    });

    resultsContainer.querySelectorAll('.btn-copy-objective').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = btn.dataset.index;
        const text = resultsContainer.querySelector(`#textarea-opt-${idx}`)?.value || options[idx].text;
        try {
          await navigator.clipboard.writeText(text);
          toast.show('Objective copied to clipboard.', 'success');
        } catch {
          toast.show('Failed to copy. Please copy manually.', 'error');
        }
      });
    });

    // Word counter on edit
    options.forEach((_, idx) => {
      const area = resultsContainer.querySelector(`#textarea-opt-${idx}`);
      const lenDisplay = resultsContainer.querySelector(`#len-opt-${idx}`);
      if (area && lenDisplay) {
        area.addEventListener('input', () => {
          const words = area.value.trim().split(/\s+/).filter(Boolean).length;
          lenDisplay.textContent = `${words} words`;
        });
      }
    });

    // Regenerate buttons
    resultsContainer.querySelector('#btn-regenerate-more')?.addEventListener('click', () => {
      const jdText = textarea.value.trim();
      runGeneration(jdText);
    });

    resultsContainer.querySelector('#btn-regenerate-footer')?.addEventListener('click', () => {
      const jdText = textarea.value.trim();
      runGeneration(jdText);
    });
  }

  // Close handlers
  function closeModal() {
    overlay.remove();
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  overlay.querySelector('#btn-modal-close')?.addEventListener('click', closeModal);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', handleKey);
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
