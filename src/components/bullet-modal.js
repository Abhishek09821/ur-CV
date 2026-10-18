/**
 * Bullet Point Generator Modal
 *
 * Pop-up interface for generating AI-suggested bullet points for:
 * - Experience entries (based on role, company, tech)
 * - Project entries (based on project name, tech stack)
 *
 * Similar to the Career Objective Generator modal — shows 4 suggestions,
 * allows editing, and applies selected bullets to the resume.
 */

import { generateExperienceBullets, generateProjectBullets } from '../utils/bullet-generator.js';

/**
 * Open the bullet generator modal.
 *
 * @param {Object} params
 * @param {string} params.mode - 'experience' or 'project'
 * @param {Object} params.entryData - The current entry data (title, company, etc.)
 * @param {number} params.entryIndex - Index of the entry in the store
 * @param {Object} params.store - ResumeStore instance
 * @param {Object} params.toast - ToastManager instance
 * @param {Function} params.onApply - Callback after bullets are applied
 */
export function openBulletModal({ mode, entryData, entryIndex, store, toast, onApply }) {
  // Remove existing modal
  const existing = document.getElementById('bullet-generator-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay bullet-modal-overlay';
  overlay.id = 'bullet-generator-modal-overlay';

  const isExperience = mode === 'experience';
  const title = isExperience ? 'Experience Bullet Generator' : 'Project Bullet Generator';
  const subtitle = isExperience
    ? 'Generate professional bullet points for your experience entry based on the role and company.'
    : 'Generate descriptive bullet points for your project based on the name and tech stack.';

  let generationCount = 0;
  let currentSuggestions = [];

  overlay.innerHTML = buildBulletModalHTML(title, subtitle, isExperience, entryData, currentSuggestions, generationCount);
  document.body.appendChild(overlay);

  function refresh() {
    overlay.innerHTML = buildBulletModalHTML(title, subtitle, isExperience, entryData, currentSuggestions, generationCount);
    attachListeners();
  }

  function generate() {
    generationCount++;

    if (isExperience) {
      const result = generateExperienceBullets({
        title: entryData.title || '',
        company: entryData.company || '',
        duration: entryData.duration || '',
        existingBullets: entryData.bullets || [],
      });
      currentSuggestions = result.suggestions;
    } else {
      const result = generateProjectBullets({
        name: entryData.name || '',
        techStack: entryData.techStack || '',
        existingBullets: entryData.bullets || [],
      });
      currentSuggestions = result.suggestions;
    }

    refresh();
    toast.show(`Generated 4 bullet suggestions (Run #${generationCount})`, 'success');
  }

  function attachListeners() {
    // Close
    overlay.querySelector('#btn-bullet-modal-close')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Generate button
    overlay.querySelector('#btn-generate-bullets')?.addEventListener('click', generate);

    // Regenerate button
    overlay.querySelector('#btn-regenerate-bullets')?.addEventListener('click', generate);

    function applyBullet(bulletText) {
      if (isExperience) {
        const cur = store.getData().experience[entryIndex]?.bullets || [];
        if (cur.length === 1 && !cur[0].trim()) {
          store.updateExperienceBullet(entryIndex, 0, bulletText);
        } else {
          store.addExperienceBullet(entryIndex);
          const updated = store.getData().experience[entryIndex]?.bullets || [];
          store.updateExperienceBullet(entryIndex, updated.length - 1, bulletText);
        }
      } else {
        const cur = store.getData().projects[entryIndex]?.bullets || [];
        if (cur.length === 1 && !cur[0].trim()) {
          store.updateProjectBullet(entryIndex, 0, bulletText);
        } else {
          store.addProjectBullet(entryIndex);
          const updated = store.getData().projects[entryIndex]?.bullets || [];
          store.updateProjectBullet(entryIndex, updated.length - 1, bulletText);
        }
      }
    }

    // Apply individual bullet
    overlay.querySelectorAll('.btn-apply-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const textarea = overlay.querySelector(`#bullet-suggestion-${idx}`);
        const bulletText = textarea ? textarea.value.trim() : currentSuggestions[idx];

        applyBullet(bulletText);
        toast.show('Bullet point added to your resume!', 'success');

        // Update entryData
        if (isExperience) {
          entryData = store.getData().experience[entryIndex];
        } else {
          entryData = store.getData().projects[entryIndex];
        }
      });
    });

    // Apply all bullets
    overlay.querySelector('#btn-apply-all-bullets')?.addEventListener('click', () => {
      for (let i = 0; i < currentSuggestions.length; i++) {
        const textarea = overlay.querySelector(`#bullet-suggestion-${i}`);
        const bulletText = textarea ? textarea.value.trim() : currentSuggestions[i];
        if (bulletText) {
          applyBullet(bulletText);
        }
      }

      toast.show('All bullet points added to your resume!', 'success');
      closeModal();
      if (onApply) onApply();
    });

    // Copy individual
    overlay.querySelectorAll('.btn-copy-bullet').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.index, 10);
        const textarea = overlay.querySelector(`#bullet-suggestion-${idx}`);
        const text = textarea ? textarea.value : currentSuggestions[idx];
        try {
          await navigator.clipboard.writeText(text);
          toast.show('Bullet copied to clipboard.', 'success');
        } catch {
          toast.show('Failed to copy.', 'error');
        }
      });
    });
  }

  function closeModal() {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 150);
    document.removeEventListener('keydown', handleKey);
    if (onApply) onApply();
  }

  function handleKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  document.addEventListener('keydown', handleKey);
  attachListeners();
}

// ============================================================
// HTML BUILDER
// ============================================================

function buildBulletModalHTML(title, subtitle, isExperience, entryData, suggestions, genCount) {
  const entryName = isExperience
    ? (entryData.title || 'Untitled Role')
    : (entryData.name || 'Untitled Project');
  const entryMeta = isExperience
    ? (entryData.company || '')
    : (entryData.techStack || '');

  return `
    <div class="modal bullet-modal" role="dialog" aria-modal="true" aria-labelledby="bullet-modal-title">
      <!-- Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--green" style="font-size:0.72rem;">AI-ASSISTED</span>
            <span class="badge badge--yellow" style="font-size:0.72rem;">${isExperience ? 'EXPERIENCE' : 'PROJECT'}</span>
          </div>
          <h2 class="modal-title mt-xs" id="bullet-modal-title">${escapeHtml(title)}</h2>
          <p class="form-hint" style="margin-top:2px;">${escapeHtml(subtitle)}</p>
        </div>
        <button class="modal-close" id="btn-bullet-modal-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Body -->
      <div class="bullet-modal-body">
        <!-- Entry Context Card -->
        <div class="bullet-context-card">
          <div class="bullet-context-label">${isExperience ? 'Role' : 'Project'}:</div>
          <div class="bullet-context-value"><strong>${escapeHtml(entryName)}</strong></div>
          ${entryMeta ? `
            <div class="bullet-context-label mt-xs">${isExperience ? 'Company' : 'Tech Stack'}:</div>
            <div class="bullet-context-value">${escapeHtml(entryMeta)}</div>
          ` : ''}
        </div>

        <!-- Generate Button -->
        ${suggestions.length === 0 ? `
          <button type="button" class="btn btn--purple btn--block mt-md" id="btn-generate-bullets">
            Generate 4 Bullet Suggestions
          </button>
          <p class="form-hint mt-xs" style="text-align:center;">
            Based on the ${isExperience ? 'role, company' : 'project name, tech stack'} information above
          </p>
        ` : ''}

        <!-- Suggestions -->
        ${suggestions.length > 0 ? `
          <div class="bullet-suggestions-header mt-md">
            <div class="flex items-center gap-xs">
              <span class="badge badge--green">4 SUGGESTIONS READY</span>
              <span class="badge badge--dark">Run #${genCount}</span>
            </div>
            <button type="button" class="btn btn--sm btn--yellow" id="btn-regenerate-bullets">
              Regenerate
            </button>
          </div>

          <p class="form-hint mt-xs mb-sm">
            Edit each suggestion, then apply individually or apply all at once:
          </p>

          <div class="bullet-suggestions-grid">
            ${suggestions.map((s, i) => `
              <div class="bullet-suggestion-card">
                <div class="bullet-suggestion-header">
                  <span class="badge badge--${['green', 'blue', 'yellow', 'purple'][i % 4]}" style="font-size:0.7rem;">
                    OPTION ${i + 1}
                  </span>
                  <span class="form-hint">${s.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea class="form-textarea bullet-suggestion-textarea" id="bullet-suggestion-${i}" rows="3">${escapeHtml(s)}</textarea>
                <div class="bullet-suggestion-actions">
                  <button type="button" class="btn btn--sm btn--green btn-apply-bullet" data-index="${i}">
                    + Add to Resume
                  </button>
                  <button type="button" class="btn btn--sm btn--white btn-copy-bullet" data-index="${i}">
                    Copy
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex justify-center mt-md gap-sm">
            <button type="button" class="btn btn--green" id="btn-apply-all-bullets">
              Apply All 4 Bullets to Resume
            </button>
            <button type="button" class="btn btn--yellow" id="btn-regenerate-bullets">
              Generate Fresh Set
            </button>
          </div>
        ` : ''}
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
