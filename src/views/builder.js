/**
 * Builder View — The interactive editor for both Amity & Jake's Resume Standards
 * Split layout: Left Editor Sidebar + Right Live A4 Preview
 */

import { renderPreview } from './preview.js';
import { parseEducationItem } from './jakes-preview.js';
import { openObjectiveModal } from '../components/objective-modal.js';
import { openPhotoCompressorModal } from '../components/photo-compressor-modal.js';
import { openBulletModal } from '../components/bullet-modal.js';
import { downloadVectorPDF } from '../utils/vector-pdf-generator.js';

const AMITY_SECTIONS = [
  { id: 'personal', label: 'Header & Contact', step: '01', required: true },
  { id: 'objective', label: 'Career Objective', step: '02', required: true },
  { id: 'academic', label: 'Academic Details', step: '03', required: true },
  { id: 'experience', label: 'Experience', step: '04', required: false },
  { id: 'projects', label: 'Projects', step: '05', required: false },
  { id: 'skills', label: 'Technical Skills', step: '06', required: true },
  { id: 'awards', label: 'Awards & Honors', step: '07', required: false },
  { id: 'leadership', label: 'Leadership', step: '08', required: false },
  { id: 'links', label: 'Links', step: '09', required: false },
  { id: 'declaration', label: 'Declaration', step: '10', required: true },
];

const JAKES_SECTIONS = [
  { id: 'personal', label: 'Header & Links', step: '01', required: true },
  { id: 'objective', label: 'Summary', step: '02', required: true },
  { id: 'academic', label: 'Education', step: '03', required: true },
  { id: 'experience', label: 'Experience', step: '04', required: false },
  { id: 'projects', label: 'Projects', step: '05', required: false },
  { id: 'skills', label: 'Technical Skills', step: '06', required: true },
  { id: 'awards', label: 'Certifications & Achievements', step: '07', required: false },
];

export function renderBuilder({ store, toast, onSave, onBack }) {
  const container = document.createElement('div');
  container.className = 'builder-wrapper';
  let activeSection = 'personal';
  let mobileView = 'form'; // 'form' | 'preview'

  function getActiveSections() {
    const isJakes = (store.getTemplate ? store.getTemplate() : 'amity') === 'jakes';
    return isJakes ? JAKES_SECTIONS : AMITY_SECTIONS;
  }

  function buildUI() {
    const data = store.getData();
    const isJakes = (store.getTemplate ? store.getTemplate() : 'amity') === 'jakes';
    const SECTIONS = isJakes ? JAKES_SECTIONS : AMITY_SECTIONS;

    // Validate that current activeSection exists in active format
    if (!SECTIONS.some((s) => s.id === activeSection)) {
      activeSection = 'personal';
    }

    const completion = store.getCompletionStatus();

    container.innerHTML = `
      <!-- Mobile View Switcher -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${mobileView === 'form' ? 'active' : ''}" data-view="form">Edit Form</button>
        <button class="toggle-btn ${mobileView === 'preview' ? 'active' : ''}" data-view="preview">Live Preview</button>
      </div>

      <!-- Top Progress Navigation Bar -->
      <div class="progress-bar ${mobileView === 'preview' ? 'mobile-hidden' : ''}">
        ${SECTIONS.map((s) => `
          <div class="progress-step ${s.id === activeSection ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-section="${s.id}">
            <span class="step-number">${s.step}</span>
            <span class="step-label">${s.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="builder active">
        <!-- Sidebar Form Panels -->
        <div class="builder-sidebar ${mobileView === 'preview' ? 'mobile-hidden' : ''}">
          <!-- Form Panels -->
          <div class="form-container">
            ${renderPersonalForm(data, activeSection === 'personal', isJakes)}
            ${renderObjectiveForm(data, activeSection === 'objective', isJakes)}
            ${renderAcademicForm(data, activeSection === 'academic', isJakes)}
            ${renderExperienceForm(data, activeSection === 'experience', isJakes)}
            ${renderProjectsForm(data, activeSection === 'projects', isJakes)}
            ${renderSkillsForm(data, activeSection === 'skills', isJakes)}
            ${renderAwardsForm(data, activeSection === 'awards', isJakes)}
            ${!isJakes ? renderLeadershipForm(data, activeSection === 'leadership') : ''}
            ${!isJakes ? renderLinksForm(data, activeSection === 'links') : ''}
            ${!isJakes ? renderDeclarationForm(data, activeSection === 'declaration') : ''}
          </div>

          <!-- Bottom Action Toolbar -->
          <div class="builder-actions-toolbar">
            ${activeSection !== SECTIONS[0].id ? '<button class="btn btn--white btn--sm" id="btn-prev-section">&larr; Prev</button>' : ''}
            ${activeSection !== SECTIONS[SECTIONS.length - 1].id ? '<button class="btn btn--blue btn--sm" id="btn-next-section">Next &rarr;</button>' : ''}
            
            <div class="export-btn-group">
              <button class="btn btn--green btn--sm" id="btn-export-pdf" title="Download 100% Searchable Vector PDF (Clean Vector Quality)">
                Download PDF
              </button>
              <button class="btn btn--yellow btn--sm" id="btn-print-pdf" title="Open Browser Native Print dialog for 100% Vector PDF">
                Print
              </button>
            </div>
          </div>
        </div>

        <!-- Live Resume Preview Panel -->
        <div class="builder-preview ${mobileView === 'form' ? 'mobile-hidden' : ''}" id="preview-panel">
          ${renderPreview(data)}
        </div>
      </div>
    `;

    attachEvents();
    scrollActiveStepIntoView(true);
  }

  function scrollActiveStepIntoView(smooth = true) {
    setTimeout(() => {
      const progressBar = container.querySelector('.progress-bar');
      const activeStep = container.querySelector('.progress-step.active');
      if (!progressBar || !activeStep) return;

      const barRect = progressBar.getBoundingClientRect();
      const stepRect = activeStep.getBoundingClientRect();

      const currentScroll = progressBar.scrollLeft;
      const stepRelativeLeft = stepRect.left - barRect.left;
      const centerTarget = (barRect.width - stepRect.width) / 2;
      const scrollTarget = currentScroll + (stepRelativeLeft - centerTarget);

      progressBar.scrollTo({
        left: Math.max(0, Math.round(scrollTarget)),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }, 40);
  }

  function updatePreviewOnly() {
    const previewPanel = container.querySelector('#preview-panel');
    if (previewPanel) {
      previewPanel.innerHTML = renderPreview(store.getData());
    }
    const completion = store.getCompletionStatus();
    const SECTIONS = getActiveSections();
    SECTIONS.forEach((s) => {
      const isDone = completion[s.id];
      const stepItem = container.querySelector(`.progress-step[data-section="${s.id}"]`);
      if (stepItem) {
        stepItem.classList.toggle('completed', !!isDone);
      }
    });
  }

  function attachEvents() {
    const SECTIONS = getActiveSections();

    // Navigation items
    container.querySelectorAll('[data-section]').forEach((el) => {
      el.addEventListener('click', () => {
        activeSection = el.dataset.section;
        buildUI();
      });
    });

    // Mobile tabs
    container.querySelectorAll('.toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        mobileView = btn.dataset.view;
        buildUI();
      });
    });

    // Prev / Next section buttons
    container.querySelector('#btn-prev-section')?.addEventListener('click', () => {
      const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (currentIdx > 0) {
        activeSection = SECTIONS[currentIdx - 1].id;
        buildUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    container.querySelector('#btn-next-section')?.addEventListener('click', () => {
      const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (currentIdx < SECTIONS.length - 1) {
        activeSection = SECTIONS[currentIdx + 1].id;
        buildUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Direct Browser Vector Print
    container.querySelector('#btn-print-pdf')?.addEventListener('click', () => {
      window.print();
    });

    // Export PDF via 100% Vector jsPDF Generator (PRD Compliant)
    container.querySelector('#btn-export-pdf')?.addEventListener('click', async () => {
      const btn = container.querySelector('#btn-export-pdf');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Generating Vector PDF...';
      btn.disabled = true;

      try {
        const resumeData = store.getData();
        await downloadVectorPDF(resumeData);
        toast.show('100% Vector PDF downloaded successfully.', 'success');
      } catch (err) {
        console.error('Vector PDF generation error:', err);
        toast.show('Export failed: ' + (err.message || 'Unknown error'), 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });

    // Helper to attach input listener
    const attachInputListener = (id, callback) => {
      const el = container.querySelector('#' + id);
      if (el) {
        el.addEventListener('input', () => {
          callback(el.value);
          updatePreviewOnly();
        });
      }
    };

    // ========== PERSONAL FORM ==========
    attachInputListener('input-fullname', (v) => store.updatePersonal('fullName', v));
    attachInputListener('input-address', (v) => store.updatePersonal('address', v));
    attachInputListener('input-phone', (v) => store.updatePersonal('phone', v));
    attachInputListener('input-email', (v) => store.updatePersonal('email', v));

    // Passport photo upload with 1MB limit check + automatic compressor fallback (Amity)
    const photoInput = container.querySelector('#input-photo');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 1024 * 1024) {
            toast.show('Photo exceeds 1MB limit. Opening free photo compressor...', 'warning');
            openPhotoCompressorModal({
              initialFile: file,
              toast,
              onApply: (compressedDataUrl) => {
                store.setPhoto(compressedDataUrl);
                buildUI();
                toast.show('Compressed photo applied (under 1MB)!', 'success');
              },
            });
            photoInput.value = '';
            return;
          }
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.show('Only JPEG, PNG and WEBP photos are supported.', 'error');
            photoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            store.setPhoto(ev.target.result);
            buildUI();
            toast.show('Passport photo updated (under 1MB).', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Direct Photo Compressor trigger button (Amity)
    container.querySelector('#btn-open-compressor')?.addEventListener('click', () => {
      openPhotoCompressorModal({
        toast,
        onApply: (compressedDataUrl) => {
          store.setPhoto(compressedDataUrl);
          buildUI();
          toast.show('Compressed photo applied (under 1MB)!', 'success');
        },
      });
    });

    container.querySelector('#btn-remove-photo')?.addEventListener('click', () => {
      store.setPhoto(null);
      buildUI();
      toast.show('Photo removed.', 'info');
    });

    // Integrated Links handlers for Jake's Format (in Step 01)
    container.querySelectorAll('[data-jakes-link-field]').forEach((input) => {
      const idx = parseInt(input.dataset.linkIndex, 10);
      const field = input.dataset.jakesLinkField;
      input.addEventListener('input', () => {
        store.updateLink(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.jakes-link-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLink(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelector('#btn-jakes-add-link')?.addEventListener('click', () => {
      store.addLink('Link', 'https://');
      buildUI();
    });

    // ========== CAREER OBJECTIVE / SUMMARY ==========
    attachInputListener('input-objective', (v) => {
      store.updateObjective(v);
      const counter = container.querySelector('#objective-char-counter');
      if (counter) {
        const words = v.trim().split(/\s+/).filter(Boolean).length;
        counter.textContent = `${v.length} chars (${words} words)`;
      }
    });

    const triggerObjectiveModal = () => {
      openObjectiveModal({
        store,
        toast,
        onApply: (generatedText) => {
          store.updateObjective(generatedText);
          const textarea = container.querySelector('#input-objective');
          if (textarea) {
            textarea.value = generatedText;
            const counter = container.querySelector('#objective-char-counter');
            if (counter) {
              const words = generatedText.trim().split(/\s+/).filter(Boolean).length;
              counter.textContent = `${generatedText.length} chars (${words} words)`;
            }
          }
          updatePreviewOnly();
          toast.show('Objective updated from JD!', 'success');
        },
      });
    };

    container.querySelector('#btn-open-objective-modal')?.addEventListener('click', triggerObjectiveModal);
    container.querySelector('#btn-open-objective-modal-banner')?.addEventListener('click', triggerObjectiveModal);

    // ========== ACADEMIC / EDUCATION FORM ==========
    // Jake's structured Education
    container.querySelectorAll('[data-jakes-academic-field]').forEach((input) => {
      const idx = parseInt(input.dataset.academicIndex, 10);
      const field = input.dataset.jakesAcademicField;
      input.addEventListener('input', () => {
        store.updateAcademicEntry(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.jakes-academic-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAcademicBullet(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelector('#btn-jakes-add-academic')?.addEventListener('click', () => {
      store.addAcademicEntry('', '');
      buildUI();
    });

    // Amity bullet list Education
    container.querySelector('#btn-add-academic')?.addEventListener('click', () => {
      store.addAcademicBullet('');
      buildUI();
    });

    container.querySelectorAll('.academic-input').forEach((input) => {
      input.addEventListener('input', () => {
        store.updateAcademicBullet(parseInt(input.dataset.index, 10), input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.academic-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAcademicBullet(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== EXPERIENCE FORM ==========
    container.querySelector('#btn-add-experience')?.addEventListener('click', () => {
      store.addExperience();
      buildUI();
    });

    container.querySelectorAll('.exp-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeExperience(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-exp-field]').forEach((input) => {
      const idx = parseInt(input.dataset.expIndex, 10);
      const field = input.dataset.expField;
      input.addEventListener('input', () => {
        store.updateExperience(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.exp-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expIdx = parseInt(btn.dataset.expIndex, 10);
        store.addExperienceBullet(expIdx, '');
        buildUI();
      });
    });

    container.querySelectorAll('.exp-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expIdx = parseInt(btn.dataset.expIndex, 10);
        const bulletIdx = parseInt(btn.dataset.bulletIndex, 10);
        store.removeExperienceBullet(expIdx, bulletIdx);
        buildUI();
      });
    });

    container.querySelectorAll('[data-exp-bullet]').forEach((input) => {
      const expIdx = parseInt(input.dataset.expIndex, 10);
      const bulletIdx = parseInt(input.dataset.bulletIndex, 10);
      input.addEventListener('input', () => {
        store.updateExperienceBullet(expIdx, bulletIdx, input.value);
        updatePreviewOnly();
      });
    });

    // Generate Bullets for Experience
    container.querySelectorAll('.exp-generate-bullets').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expIdx = parseInt(btn.dataset.expIndex, 10);
        const data = store.getData();
        const exp = data.experience[expIdx];
        if (!exp) return;
        openBulletModal({
          mode: 'experience',
          entryData: exp,
          entryIndex: expIdx,
          store,
          toast,
          onApply: () => buildUI(),
        });
      });
    });

    // ========== PROJECTS FORM ==========
    container.querySelector('#btn-add-project')?.addEventListener('click', () => {
      store.addProject();
      buildUI();
    });

    container.querySelectorAll('.proj-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeProject(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-proj-field]').forEach((input) => {
      const idx = parseInt(input.dataset.projIndex, 10);
      const field = input.dataset.projField;
      input.addEventListener('input', () => {
        store.updateProject(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.proj-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projIdx = parseInt(btn.dataset.projIndex, 10);
        store.addProjectBullet(projIdx, '');
        buildUI();
      });
    });

    container.querySelectorAll('.proj-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projIdx = parseInt(btn.dataset.projIndex, 10);
        const bulletIdx = parseInt(btn.dataset.bulletIndex, 10);
        store.removeProjectBullet(projIdx, bulletIdx);
        buildUI();
      });
    });

    container.querySelectorAll('[data-proj-bullet]').forEach((input) => {
      const projIdx = parseInt(input.dataset.projIndex, 10);
      const bulletIdx = parseInt(input.dataset.bulletIndex, 10);
      input.addEventListener('input', () => {
        store.updateProjectBullet(projIdx, bulletIdx, input.value);
        updatePreviewOnly();
      });
    });

    // Generate Bullets for Projects
    container.querySelectorAll('.proj-generate-bullets').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projIdx = parseInt(btn.dataset.projIndex, 10);
        const data = store.getData();
        const proj = data.projects[projIdx];
        if (!proj) return;
        openBulletModal({
          mode: 'project',
          entryData: proj,
          entryIndex: projIdx,
          store,
          toast,
          onApply: () => buildUI(),
        });
      });
    });

    // ========== SKILLS FORM ==========
    container.querySelector('#btn-add-skill-cat')?.addEventListener('click', () => {
      store.addSkillCategory('', '');
      buildUI();
    });

    container.querySelectorAll('.skill-cat-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeSkillCategory(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-skill-field]').forEach((input) => {
      const idx = parseInt(input.dataset.skillIndex, 10);
      const field = input.dataset.skillField;
      input.addEventListener('input', () => {
        store.updateSkillCategory(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    // ========== AWARDS & CERTIFICATIONS FORM ==========
    container.querySelector('#btn-add-award')?.addEventListener('click', () => {
      store.addAward('');
      buildUI();
    });

    container.querySelectorAll('.award-input').forEach((input) => {
      input.addEventListener('input', () => {
        store.updateAward(parseInt(input.dataset.index, 10), input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.award-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAward(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== ACHIEVEMENTS FORM (Jake's Format) ==========
    container.querySelector('#btn-add-achievement')?.addEventListener('click', () => {
      store.addAchievement('');
      buildUI();
    });

    container.querySelectorAll('.achievement-input').forEach((input) => {
      input.addEventListener('input', () => {
        store.updateAchievement(parseInt(input.dataset.index, 10), input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.achievement-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAchievement(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== LEADERSHIP FORM (Amity Format) ==========
    container.querySelector('#btn-add-leadership')?.addEventListener('click', () => {
      store.addLeadership('', '');
      buildUI();
    });

    container.querySelectorAll('.lead-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLeadership(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-lead-field]').forEach((input) => {
      const idx = parseInt(input.dataset.leadIndex, 10);
      const field = input.dataset.leadField;
      input.addEventListener('input', () => {
        store.updateLeadership(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    // ========== LINKS FORM (Amity Format) ==========
    container.querySelector('#btn-add-link')?.addEventListener('click', () => {
      store.addLink('', '');
      buildUI();
    });

    container.querySelectorAll('.link-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLink(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-link-field]').forEach((input) => {
      const idx = parseInt(input.dataset.linkIndex, 10);
      const field = input.dataset.linkField;
      input.addEventListener('input', () => {
        store.updateLink(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    // ========== DECLARATION FORM (Amity Format) ==========
    attachInputListener('input-decl-text', (v) => store.updateDeclaration('text', v));
    attachInputListener('input-decl-date', (v) => store.updateDeclaration('date', v));
    attachInputListener('input-decl-place', (v) => store.updateDeclaration('place', v));
  }

  // Initial draw
  buildUI();
  return container;
}

// ============================================================
// FORM SECTION RENDERERS
// ============================================================

function renderPersonalForm(data, isActive, isJakes) {
  const p = data.personal || {};
  const links = data.links || [];

  if (isJakes) {
    return `
      <div class="form-section ${isActive ? 'active' : ''}" data-form="personal">
        <div class="badge badge--yellow mb-xs" style="font-size:0.72rem;">JAKE'S FORMAT — ATS STANDARD</div>
        <h2 class="form-section-title">Header, Contact &amp; Links</h2>
        <p class="form-section-desc">Centered header. Professional links sit directly below contact details. No photo required.</p>

        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-fullname" value="${escapeHtml(p.fullName)}" placeholder="e.g. Abhishek Tiwari" />
        </div>

        <div class="form-group">
          <label class="form-label">Location (City, State) <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-address" value="${escapeHtml(p.address)}" placeholder="e.g. Gwalior, Madhya Pradesh" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <input type="tel" class="form-input" id="input-phone" value="${escapeHtml(p.phone)}" placeholder="e.g. +91 96919 66023" />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address <span class="required">*</span></label>
            <input type="email" class="form-input" id="input-email" value="${escapeHtml(p.email)}" placeholder="e.g. abhishek.tiwarii9821@gmail.com" />
          </div>
        </div>

        <!-- Integrated Links Section for Jake's Resume -->
        <div class="mt-md pt-sm" style="border-top:1px dashed var(--border-color);">
          <div class="flex justify-between items-center mb-xs">
            <label class="form-label mb-0" style="font-weight:800;">Professional Profiles &amp; Links</label>
            <button type="button" class="btn btn--sm btn--blue" id="btn-jakes-add-link">+ Add Link</button>
          </div>
          <p class="form-hint mb-sm">Rendered as clean links (e.g. GitHub | LinkedIn | LeetCode) under contact information.</p>

          ${links.map((link, i) => `
            <div class="entry-card mb-xs" style="padding:8px 10px;">
              <div class="flex gap-sm items-center">
                <input type="text" class="form-input" data-jakes-link-field="label" data-link-index="${i}" value="${escapeHtml(link.label)}" placeholder="Label (e.g. GitHub)" style="width:110px;" />
                <input type="url" class="form-input" data-jakes-link-field="url" data-link-index="${i}" value="${escapeHtml(link.url)}" placeholder="https://..." style="flex:1;" />
                <button type="button" class="btn btn--sm btn--red jakes-link-delete" data-index="${i}" title="Delete link">&times;</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="personal">
      <h2 class="form-section-title">Header &amp; Contact Details</h2>
      <p class="form-section-desc">Universal Amity Header. Official university shield logo is positioned on the top-left.</p>

      <div class="form-group">
        <label class="form-label">Full Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="input-fullname" value="${escapeHtml(p.fullName)}" placeholder="e.g. Abhishek Tiwari" />
      </div>

      <div class="form-group">
        <label class="form-label">Full Address <span class="required">*</span></label>
        <input type="text" class="form-input" id="input-address" value="${escapeHtml(p.address)}" placeholder="e.g. Gayatri Vihar Colony, Pinto Park Rd, Gwalior 474005" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phone Number <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${escapeHtml(p.phone)}" placeholder="e.g. +919691966023" />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${escapeHtml(p.email)}" placeholder="e.g. abhishek.tiwarii9821@gmail.com" />
        </div>
      </div>

      <!-- Passport Photo Upload (Limit: 1MB) -->
      <div class="form-group">
        <label class="form-label">Passport Photo (Max 1MB) <span class="required">*</span></label>
        <div class="photo-upload">
          <div class="photo-preview" style="width:80px;height:100px;">
            ${p.photo ? `<img src="${p.photo}" alt="Passport photo" style="width:100%;height:100%;object-fit:cover;" />` : '<span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);">NO PHOTO</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${p.photo ? '<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>' : ''}
          </div>
          <p class="form-hint">JPEG or PNG. Strictly max 1MB limit. Cropped to passport proportions on the top-right.</p>
          <div class="photo-compressor-hint-wrap mt-xs">
            <button type="button" class="btn-compress-link" id="btn-open-compressor">
              Having trouble to add photo? <span>Click here to compress for free &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderObjectiveForm(data, isActive, isJakes) {
  const objectiveText = data.objective || '';
  const wordCount = objectiveText.trim().split(/\s+/).filter(Boolean).length;
  const sectionTitle = isJakes ? 'Professional Summary' : 'Career Objective';
  const sectionDesc = isJakes
    ? 'Single paragraph software engineering summary. Formatted with justified text alignment in LaTeX standard.'
    : 'Full paragraph summary. Formatted with justified text alignment in the official PDF.';

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="objective">
      <div class="flex items-center justify-between flex-wrap gap-xs mb-sm">
        <h2 class="form-section-title mb-0">${sectionTitle}</h2>
        <button type="button" class="btn btn--purple btn--sm" id="btn-open-objective-modal" title="Generate tailored career objective from any Job Description">
          Generate from JD
        </button>
      </div>
      <p class="form-section-desc">${sectionDesc}</p>

      <div class="objective-banner-card mb-md">
        <div class="flex items-center justify-between flex-wrap gap-xs">
          <div>
            <strong style="font-size:0.85rem;text-transform:uppercase;">Targeting a specific role or company?</strong>
            <p class="form-hint mt-xs" style="margin-bottom:0;">
              Paste any Job Description to generate 4 diverse, role-tailored summaries with unique phrasing.
            </p>
          </div>
          <button type="button" class="btn btn--yellow btn--sm" id="btn-open-objective-modal-banner">
            Open JD Generator
          </button>
        </div>
      </div>

      <div class="form-group">
        <div class="flex items-center justify-between">
          <label class="form-label mb-0" for="input-objective">${sectionTitle} Text</label>
          <span class="form-hint" id="objective-char-counter">${objectiveText.length} chars (${wordCount} words)</span>
        </div>
        <textarea class="form-textarea mt-xs" id="input-objective" rows="6" placeholder="${isJakes ? 'B.Tech Computer Science student focused on Software Development...' : 'Motivated final-year B.Tech Computer Science student...'}">${escapeHtml(objectiveText)}</textarea>
        <div class="flex items-center justify-between mt-xs flex-wrap gap-xs">
          <p class="form-hint mb-0">All text is automatically justified per standard specifications.</p>
          <span class="badge badge--green" style="font-size:0.7rem;">Editable anytime</span>
        </div>
      </div>
    </div>
  `;
}

function renderAcademicForm(data, isActive, isJakes) {
  const academic = data.academic || [];

  if (isJakes) {
    return `
      <div class="form-section ${isActive ? 'active' : ''}" data-form="academic">
        <div class="badge badge--yellow mb-xs" style="font-size:0.72rem;">EXACT BOLD REPLICA FORMAT</div>
        <h2 class="form-section-title">Education</h2>
        <p class="form-section-desc">
          Institution / Board is rendered in <strong>BOLD</strong>, followed by Degree, Minor, CGPA, or Percentage in normal weight.
        </p>

        ${academic.map((raw, i) => {
          const parsed = parseEducationItem(raw);
          return `
            <div class="entry-card mb-md">
              <div class="entry-card-header">
                <span class="entry-card-title">Education #${i + 1}</span>
                <button type="button" class="delete-btn jakes-academic-delete" data-index="${i}" title="Remove entry">&times;</button>
              </div>

              <div class="form-group mb-sm">
                <label class="form-label">Institution / Board / Examination (Rendered in <strong>BOLD</strong>)</label>
                <input 
                  type="text" 
                  class="form-input" 
                  data-jakes-academic-field="institution" 
                  data-academic-index="${i}" 
                  value="${escapeHtml(parsed.institution)}" 
                  placeholder="e.g. Amity University Madhya Pradesh or Senior Secondary (12th), CBSE" 
                />
              </div>

              <div class="form-group">
                <label class="form-label">Degree, Minor, CGPA or Score (Rendered in Regular text)</label>
                <input 
                  type="text" 
                  class="form-input" 
                  data-jakes-academic-field="details" 
                  data-academic-index="${i}" 
                  value="${escapeHtml(parsed.details)}" 
                  placeholder="e.g. B.Tech in Computer Science Engineering | Minor in Cyber Security | CGPA: 7.79 | Final Year or 69.8%" 
                />
              </div>
            </div>
          `;
        }).join('')}

        <button type="button" class="add-entry-btn mt-sm" id="btn-jakes-add-academic">+ Add Education Entry</button>
      </div>
    `;
  }

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="academic">
      <h2 class="form-section-title">Academic Details</h2>
      <p class="form-section-desc">Bulleted educational qualifications (BTech CGPA/Minor, 12th CBSE, 10th CBSE).</p>

      ${academic.map((item, i) => `
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">&bull;</span>
          <input type="text" class="form-input academic-input" data-index="${i}" value="${escapeHtml(typeof item === 'object' ? `${item.institution} ${item.details}` : item)}" placeholder="e.g. BTech- CGPA 7.79 | Minor in Cyber Security" style="flex:1;" />
          <button class="btn btn--sm btn--red academic-delete" data-index="${i}" title="Delete bullet">&times;</button>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-academic">+ Add Academic Bullet</button>
    </div>
  `;
}

function renderExperienceForm(data, isActive, isJakes) {
  const experience = data.experience || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="experience">
      <h2 class="form-section-title">Experience &amp; Internships</h2>
      <p class="form-section-desc">Professional roles, virtual training, or industry experience with bulleted achievements.</p>

      ${experience.map((exp, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${i + 1}</span>
            <div class="flex gap-xs items-center">
              <button class="btn btn--sm btn--purple exp-generate-bullets" data-exp-index="${i}" title="AI-generate bullet points for this experience">Generate Bullets</button>
              <button class="delete-btn exp-delete" data-index="${i}" title="Remove entry">&times;</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Role / Internship Title (Bold)</label>
            <input type="text" class="form-input" data-exp-field="title" data-exp-index="${i}" value="${escapeHtml(exp.title)}" placeholder="e.g. Application Development Intern - Pega National Internship Program (NIP)" />
          </div>

          <div class="form-group">
            <label class="form-label">Company / Platform</label>
            <input type="text" class="form-input" data-exp-field="company" data-exp-index="${i}" value="${escapeHtml(exp.company)}" placeholder="e.g. Pega Platform or | Edunet Foundation - AICTE Collaboration" />
          </div>

          <div class="form-group">
            <label class="form-label">Duration &amp; Modality (Right Aligned)</label>
            <input type="text" class="form-input" data-exp-field="duration" data-exp-index="${i}" value="${escapeHtml(exp.duration)}" placeholder="e.g. Aug 4, 2026 - Sep 4, 2026 or Aug 21, 2025 - Sep 30, 2025 6 weeks, Virtual" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(exp.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">&bull;</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Action verb + technical achievement..." style="flex:1;" />
                ${exp.bullets.length > 1 ? `<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">&times;</button>` : ''}
              </div>
            `).join('')}
            <div class="flex gap-xs">
              <button class="add-entry-btn exp-add-bullet" data-exp-index="${i}">+ Add Bullet</button>
            </div>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience Entry</button>
    </div>
  `;
}

function renderProjectsForm(data, isActive, isJakes) {
  const projects = data.projects || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="projects">
      <h2 class="form-section-title">Technical Projects</h2>
      <p class="form-section-desc">Technical projects with Project Name (Bold), Tech Stack, and justified bullet points.</p>

      ${projects.map((proj, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${i + 1}</span>
            <div class="flex gap-xs items-center">
              <button class="btn btn--sm btn--purple proj-generate-bullets" data-proj-index="${i}" title="AI-generate bullet points for this project">Generate Bullets</button>
              <button class="delete-btn proj-delete" data-index="${i}" title="Remove entry">&times;</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Project Title (Bold, e.g. FINMATE AI)</label>
            <input type="text" class="form-input" data-proj-field="name" data-proj-index="${i}" value="${escapeHtml(proj.name)}" placeholder="e.g. FINMATE AI" />
          </div>

          <div class="form-group">
            <label class="form-label">Tech Stack (e.g. Python, Flask, React.js, MySQL, LLMs, RAG)</label>
            <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${i}" value="${escapeHtml(proj.techStack)}" placeholder="e.g. Python, Flask, React.js, MySQL, LLMs, RAG" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(proj.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">&bull;</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Describe feature, architectural design, outcome..." style="flex:1;" />
                ${proj.bullets.length > 1 ? `<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">&times;</button>` : ''}
              </div>
            `).join('')}
            <div class="flex gap-xs">
              <button class="add-entry-btn proj-add-bullet" data-proj-index="${i}">+ Add Bullet</button>
            </div>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project Entry</button>
    </div>
  `;
}

function renderSkillsForm(data, isActive, isJakes) {
  const skills = data.skills || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="skills">
      <h2 class="form-section-title">Technical Skills</h2>
      <p class="form-section-desc">Category prefix is rendered in <strong>BOLD</strong> (e.g. <strong>Languages:</strong> Python, C, C++, JavaScript, TypeScript, SQL).</p>

      ${skills.map((s, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Skill Category #${i + 1}</span>
            <button class="btn btn--sm btn--red skill-cat-delete" data-index="${i}">&times;</button>
          </div>
          <div class="form-group mb-xs">
            <input type="text" class="form-input" data-skill-field="category" data-skill-index="${i}" value="${escapeHtml(s.category)}" placeholder="Category Name (e.g. Languages or Web & Frameworks)" />
          </div>
          <div class="form-group mb-xs">
            <textarea class="form-textarea" data-skill-field="skills" data-skill-index="${i}" rows="2" placeholder="Skills list (e.g. Python, C, C++, JavaScript, TypeScript, SQL)">${escapeHtml(s.skills)}</textarea>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-skill-cat">+ Add Skill Category</button>
    </div>
  `;
}

function renderAwardsForm(data, isActive, isJakes) {
  const awards = data.awards || [];
  const achievements = data.achievements || [];

  if (isJakes) {
    return `
      <div class="form-section ${isActive ? 'active' : ''}" data-form="awards">
        <h2 class="form-section-title">Certifications &amp; Achievements</h2>
        <p class="form-section-desc">Professional certifications and competition or hackathon achievements.</p>

        <!-- Certifications -->
        <div class="entry-card mb-md">
          <div class="flex justify-between items-center mb-xs">
            <strong style="font-size:0.9rem;">Certifications</strong>
            <button type="button" class="btn btn--sm btn--blue" id="btn-add-award">+ Add Certification</button>
          </div>
          <p class="form-hint mb-sm">Rendered as <strong>Certifications:</strong> IBM Web Development...; Google Generative AI...</p>

          ${awards.map((item, i) => `
            <div class="flex gap-sm items-center mb-xs">
              <span style="font-family:var(--font-mono);font-size:1rem;">&bull;</span>
              <input type="text" class="form-input award-input" data-index="${i}" value="${escapeHtml(item)}" placeholder="e.g. IBM Web Development Certification - IBM SkillsBuild (2025)" style="flex:1;" />
              <button type="button" class="btn btn--sm btn--red award-delete" data-index="${i}">&times;</button>
            </div>
          `).join('')}
        </div>

        <!-- Achievements -->
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <strong style="font-size:0.9rem;">Achievements</strong>
            <button type="button" class="btn btn--sm btn--green" id="btn-add-achievement">+ Add Achievement</button>
          </div>
          <p class="form-hint mb-sm">Rendered as <strong>Achievements:</strong> Participated in 4 hackathons...; Winner, Amity Zync...</p>

          ${achievements.map((item, i) => `
            <div class="flex gap-sm items-center mb-xs">
              <span style="font-family:var(--font-mono);font-size:1rem;">&bull;</span>
              <input type="text" class="form-input achievement-input" data-index="${i}" value="${escapeHtml(item)}" placeholder="e.g. Winner, Amity Zync Hackathon - 2026 with FINMATE AI" style="flex:1;" />
              <button type="button" class="btn btn--sm btn--red achievement-delete" data-index="${i}">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="awards">
      <h2 class="form-section-title">Awards &amp; Honors</h2>
      <p class="form-section-desc">Certifications, hackathon recognitions, and academic awards.</p>

      ${awards.map((item, i) => `
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">&bull;</span>
          <input type="text" class="form-input award-input" data-index="${i}" value="${escapeHtml(item)}" placeholder="e.g. Tata Cybersecurity Analyst Certification" style="flex:1;" />
          <button class="btn btn--sm btn--red award-delete" data-index="${i}">&times;</button>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-award">+ Add Award / Certification</button>
    </div>
  `;
}

function renderLeadershipForm(data, isActive) {
  const leadership = data.leadership || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="leadership">
      <h2 class="form-section-title">Leadership &amp; Initiative</h2>
      <p class="form-section-desc">Student initiatives, hackathon team lead roles, and organizational contributions.</p>

      ${leadership.map((item, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Initiative #${i + 1}</span>
            <button class="btn btn--sm btn--red lead-delete" data-index="${i}">&times;</button>
          </div>
          <div class="form-group mb-xs">
            <input type="text" class="form-input" data-lead-field="title" data-lead-index="${i}" value="${escapeHtml(item.title)}" placeholder="Bold Prefix (Optional, e.g. End-to-End Application Delivery)" />
          </div>
          <div class="form-group mb-xs">
            <textarea class="form-textarea" data-lead-field="description" data-lead-index="${i}" rows="2" placeholder="Description of leadership or initiative...">${escapeHtml(item.description)}</textarea>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-leadership">+ Add Leadership Initiative</button>
    </div>
  `;
}

function renderLinksForm(data, isActive) {
  const links = data.links || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="links">
      <h2 class="form-section-title">Professional Links</h2>
      <p class="form-section-desc">Professional profiles rendered as clean, clickable blue links in the PDF.</p>

      ${links.map((item, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Link #${i + 1}</span>
            <button class="btn btn--sm btn--red link-delete" data-index="${i}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Display Label (e.g. Linkedin)</label>
              <input type="text" class="form-input" data-link-field="label" data-link-index="${i}" value="${escapeHtml(item.label)}" placeholder="Linkedin / Github / LeetCode" />
            </div>
            <div class="form-group">
              <label class="form-label">Full Target URL</label>
              <input type="url" class="form-input" data-link-field="url" data-link-index="${i}" value="${escapeHtml(item.url)}" placeholder="https://..." />
            </div>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-link">+ Add Profile Link</button>
    </div>
  `;
}

function renderDeclarationForm(data, isActive) {
  const d = data.declaration || {};
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="declaration">
      <h2 class="form-section-title">Self Declaration</h2>
      <p class="form-section-desc">Standard declaration with Date, Place, divider, and Candidate Name.</p>

      <div class="form-group">
        <label class="form-label">Declaration Statement</label>
        <textarea class="form-textarea" id="input-decl-text" rows="3">${escapeHtml(d.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date (e.g. 23rd July 2026)</label>
          <input type="text" class="form-input" id="input-decl-date" value="${escapeHtml(d.date)}" placeholder="23rd July 2026" />
        </div>
        <div class="form-group">
          <label class="form-label">Place (e.g. Gwalior)</label>
          <input type="text" class="form-input" id="input-decl-place" value="${escapeHtml(d.place)}" placeholder="Gwalior" />
        </div>
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
