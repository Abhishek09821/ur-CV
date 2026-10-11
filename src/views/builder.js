/**
 * Builder View — The interactive editor for the Amity Placement Resume
 * Split layout: Left Editor Sidebar + Right Live A4 Preview
 * 
 * Implements:
 * - Direct element-scoped event binding (smooth typing without DOM re-render)
 * - 1MB photo upload constraint
 * - Pre-loaded universal Amity reference format
 * - Add/Edit/Remove controls for all sections
 * - Dual export: html2pdf file download + browser vector print
 */

import { renderPreview, buildAmityResumeHTML } from './preview.js';
import { openObjectiveModal } from '../components/objective-modal.js';
import { downloadVectorPDF } from '../utils/vector-pdf-generator.js';

const SECTIONS = [
  { id: 'personal', label: 'Header & Contact', icon: '👤', required: true },
  { id: 'objective', label: 'Career Objective', icon: '🎯', required: true },
  { id: 'academic', label: 'Academic Details', icon: '🎓', required: true },
  { id: 'experience', label: 'Experience', icon: '💼', required: false },
  { id: 'projects', label: 'Projects', icon: '🚀', required: false },
  { id: 'skills', label: 'Technical Skills', icon: '⚡', required: true },
  { id: 'awards', label: 'Awards & Achievements', icon: '🏆', required: false },
  { id: 'leadership', label: 'Leadership & Initiative', icon: '👑', required: false },
  { id: 'links', label: 'Links', icon: '🔗', required: false },
  { id: 'declaration', label: 'Self Declaration', icon: '📝', required: true },
];

export function renderBuilder({ store, mode, toast, onSave, onBack }) {
  const container = document.createElement('div');
  container.className = 'builder-wrapper';
  let activeSection = 'personal';
  let mobileView = 'form'; // 'form' | 'preview'

  function buildUI() {
    const data = store.getData();
    const completion = store.getCompletionStatus();

    container.innerHTML = `
      
      <!-- Mobile View Switcher -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${mobileView === 'form' ? 'active' : ''}" data-view="form">✏️ Edit Form</button>
        <button class="toggle-btn ${mobileView === 'preview' ? 'active' : ''}" data-view="preview">👁 Live Preview</button>
      </div>

      <!-- Top Progress Navigation Bar -->
      <div class="progress-bar">
        ${SECTIONS.map((s) => `
          <div class="progress-step ${s.id === activeSection ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-section="${s.id}">
            <span class="step-number">${s.icon}</span>
            <span class="step-label">${s.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="builder active">
        <!-- Sidebar Form & Navigation -->
        <div class="builder-sidebar ${mobileView === 'preview' ? 'mobile-hidden' : ''}">
          <nav class="section-nav">
            ${SECTIONS.map((s) => `
              <div class="section-nav-item ${s.id === activeSection ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-section="${s.id}">
                <span class="nav-icon">${s.icon}</span>
                <span class="nav-text">${s.label}</span>
                ${s.required ? '<span class="required" style="font-size:0.65rem;margin-left:auto;">REQ</span>' : ''}
                <span class="nav-status">${completion[s.id] ? '✓' : '○'}</span>
              </div>
            `).join('')}
          </nav>

          <!-- Form Panels -->
          <div class="form-container">
            ${renderPersonalForm(data, activeSection === 'personal')}
            ${renderObjectiveForm(data, activeSection === 'objective')}
            ${renderAcademicForm(data, activeSection === 'academic')}
            ${renderExperienceForm(data, activeSection === 'experience')}
            ${renderProjectsForm(data, activeSection === 'projects')}
            ${renderSkillsForm(data, activeSection === 'skills')}
            ${renderAwardsForm(data, activeSection === 'awards')}
            ${renderLeadershipForm(data, activeSection === 'leadership')}
            ${renderLinksForm(data, activeSection === 'links')}
            ${renderDeclarationForm(data, activeSection === 'declaration')}
          </div>

          <!-- Bottom Action Toolbar -->
          <div class="builder-actions-toolbar">
            ${activeSection !== 'personal' ? '<button class="btn btn--white btn--sm" id="btn-prev-section">← Prev</button>' : ''}
            ${activeSection !== 'declaration' ? '<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>' : ''}
            
            <div class="export-btn-group">
              <button class="btn btn--green btn--sm" id="btn-export-pdf" title="Download 100% Searchable Vector PDF (No cutoff, ATS-ready)">
                📄 Download PDF
              </button>
              <button class="btn btn--yellow btn--sm" id="btn-print-pdf" title="Open Browser Native Print dialog for 100% Vector PDF">
                🖨️ Native Print
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
  }

  function updatePreviewOnly() {
    const previewPanel = container.querySelector('#preview-panel');
    if (previewPanel) {
      previewPanel.innerHTML = renderPreview(store.getData());
    }
    const completion = store.getCompletionStatus();
    SECTIONS.forEach((s) => {
      const isDone = completion[s.id];
      const navItem = container.querySelector(`.section-nav-item[data-section="${s.id}"]`);
      if (navItem) {
        navItem.classList.toggle('completed', !!isDone);
        const statusSpan = navItem.querySelector('.nav-status');
        if (statusSpan) statusSpan.textContent = isDone ? '✓' : '○';
      }
      const stepItem = container.querySelector(`.progress-step[data-section="${s.id}"]`);
      if (stepItem) {
        stepItem.classList.toggle('completed', !!isDone);
      }
    });
  }

  function attachEvents() {
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

    // Prev / Next buttons
    container.querySelector('#btn-prev-section')?.addEventListener('click', () => {
      const idx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (idx > 0) {
        activeSection = SECTIONS[idx - 1].id;
        buildUI();
      }
    });

    container.querySelector('#btn-next-section')?.addEventListener('click', () => {
      const idx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (idx < SECTIONS.length - 1) {
        activeSection = SECTIONS[idx + 1].id;
        buildUI();
      }
    });

    // PDF Export
    container.querySelector('#btn-export-pdf')?.addEventListener('click', () => {
      exportPDF(store, toast);
    });

    // Vector Print
    container.querySelector('#btn-print-pdf')?.addEventListener('click', () => {
      window.print();
    });

    // ========== PERSONAL FORM ==========
    attachInputListener('input-fullname', (v) => store.updatePersonal('fullName', v));
    attachInputListener('input-address', (v) => store.updatePersonal('address', v));
    attachInputListener('input-phone', (v) => store.updatePersonal('phone', v));
    attachInputListener('input-email', (v) => store.updatePersonal('email', v));

    // Photo upload with strictly enforced 1MB limit per user request
    const photoInput = container.querySelector('#input-photo');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 1 * 1024 * 1024) {
            toast.show('Photo size must be under 1MB!', 'error');
            photoInput.value = '';
            return;
          }
          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.show('Only JPEG and PNG photos are supported.', 'error');
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

    container.querySelector('#btn-remove-photo')?.addEventListener('click', () => {
      store.setPhoto(null);
      buildUI();
      toast.show('Photo removed.', 'info');
    });

    // ========== CAREER OBJECTIVE ==========
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
          }
          const counter = container.querySelector('#objective-char-counter');
          if (counter) {
            const words = generatedText.trim().split(/\s+/).filter(Boolean).length;
            counter.textContent = `${generatedText.length} chars (${words} words)`;
          }
          updatePreviewOnly();
          toast.show('✨ Career Objective applied to your resume!', 'success');
        },
      });
    };

    container.querySelector('#btn-open-objective-modal')?.addEventListener('click', triggerObjectiveModal);
    container.querySelector('#btn-open-objective-modal-banner')?.addEventListener('click', triggerObjectiveModal);

    // ========== ACADEMIC DETAILS ==========
    container.querySelector('#btn-add-academic')?.addEventListener('click', () => {
      store.addAcademicBullet('');
      buildUI();
    });

    container.querySelectorAll('.academic-input').forEach((input) => {
      const idx = parseInt(input.dataset.index, 10);
      input.addEventListener('input', () => {
        store.updateAcademicBullet(idx, input.value);
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

    container.querySelectorAll('[data-exp-bullet]').forEach((input) => {
      const expIdx = parseInt(input.dataset.expIndex, 10);
      const bulletIdx = parseInt(input.dataset.bulletIndex, 10);
      input.addEventListener('input', () => {
        store.updateExperienceBullet(expIdx, bulletIdx, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.exp-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.addExperienceBullet(parseInt(btn.dataset.expIndex, 10));
        buildUI();
      });
    });

    container.querySelectorAll('.exp-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeExperienceBullet(parseInt(btn.dataset.expIndex, 10), parseInt(btn.dataset.bulletIndex, 10));
        buildUI();
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

    container.querySelectorAll('[data-proj-bullet]').forEach((input) => {
      const projIdx = parseInt(input.dataset.projIndex, 10);
      const bulletIdx = parseInt(input.dataset.bulletIndex, 10);
      input.addEventListener('input', () => {
        store.updateProjectBullet(projIdx, bulletIdx, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.proj-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.addProjectBullet(parseInt(btn.dataset.projIndex, 10));
        buildUI();
      });
    });

    container.querySelectorAll('.proj-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeProjectBullet(parseInt(btn.dataset.projIndex, 10), parseInt(btn.dataset.bulletIndex, 10));
        buildUI();
      });
    });

    // ========== TECHNICAL SKILLS FORM ==========
    container.querySelector('#btn-add-skill-cat')?.addEventListener('click', () => {
      store.addSkillCategory('', '');
      buildUI();
    });

    container.querySelectorAll('[data-skill-field]').forEach((input) => {
      const idx = parseInt(input.dataset.skillIndex, 10);
      const field = input.dataset.skillField;
      input.addEventListener('input', () => {
        store.updateSkillCategory(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.skill-cat-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeSkillCategory(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== AWARDS & ACHIEVEMENTS ==========
    container.querySelector('#btn-add-award')?.addEventListener('click', () => {
      store.addAward('');
      buildUI();
    });

    container.querySelectorAll('.award-input').forEach((input) => {
      const idx = parseInt(input.dataset.index, 10);
      input.addEventListener('input', () => {
        store.updateAward(idx, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.award-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAward(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== LEADERSHIP & INITIATIVE ==========
    container.querySelector('#btn-add-leadership')?.addEventListener('click', () => {
      store.addLeadership('', '');
      buildUI();
    });

    container.querySelectorAll('[data-lead-field]').forEach((input) => {
      const idx = parseInt(input.dataset.leadIndex, 10);
      const field = input.dataset.leadField;
      input.addEventListener('input', () => {
        store.updateLeadership(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.lead-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLeadership(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== LINKS FORM ==========
    container.querySelector('#btn-add-link')?.addEventListener('click', () => {
      store.addLink('', '');
      buildUI();
    });

    container.querySelectorAll('[data-link-field]').forEach((input) => {
      const idx = parseInt(input.dataset.linkIndex, 10);
      const field = input.dataset.linkField;
      input.addEventListener('input', () => {
        store.updateLink(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    container.querySelectorAll('.link-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLink(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    // ========== DECLARATION FORM ==========
    attachInputListener('input-decl-text', (v) => store.updateDeclaration('text', v));
    attachInputListener('input-decl-date', (v) => store.updateDeclaration('date', v));
    attachInputListener('input-decl-place', (v) => store.updateDeclaration('place', v));
  }

  function attachInputListener(id, callback) {
    const el = container.querySelector(`#${id}`);
    if (el) {
      el.addEventListener('input', () => {
        callback(el.value);
        updatePreviewOnly();
      });
    }
  }

  // Initial render
  buildUI();

  return container;
}

// ============================================================
// FORM SECTION RENDERERS
// ============================================================

function renderPersonalForm(data, isActive) {
  const p = data.personal || {};
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="personal">
      <h2 class="form-section-title">👤 Header & Contact Info</h2>
      <p class="form-section-desc">Universal Amity Header. The official university logo is permanently embedded on top-left.</p>

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
        <label class="form-label">Candidate Passport Photo (Max 1MB) <span class="required">*</span></label>
        <div class="photo-upload">
          <div class="photo-preview" style="width:80px;height:100px;">
            ${p.photo ? `<img src="${p.photo}" alt="Passport photo" style="width:100%;height:100%;object-fit:cover;" />` : '<span style="font-size:1.8rem;">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${p.photo ? '<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>' : ''}
          </div>
          <p class="form-hint">JPEG or PNG. Strictly max 1MB limit. Cropped to passport proportions on the top-right.</p>
        </div>
      </div>
    </div>
  `;
}

function renderObjectiveForm(data, isActive) {
  const objectiveText = data.objective || '';
  const wordCount = objectiveText.trim().split(/\s+/).filter(Boolean).length;

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="objective">
      <div class="flex items-center justify-between flex-wrap gap-xs mb-sm">
        <h2 class="form-section-title mb-0">🎯 Career Objective</h2>
        <button type="button" class="btn btn--purple btn--sm" id="btn-open-objective-modal" title="Generate tailored career objective from any Job Description">
          ✨ Generate with JD
        </button>
      </div>
      <p class="form-section-desc">Full paragraph summary. Formatted with justified text alignment in the PDF.</p>

      <div class="objective-banner-card mb-md">
        <div class="flex items-center justify-between flex-wrap gap-xs">
          <div class="flex items-center gap-xs">
            <span style="font-size:1.1rem;">🤖</span>
            <strong style="font-size:0.85rem;">Targeting a specific role or company?</strong>
          </div>
          <button type="button" class="btn btn--yellow btn--sm" id="btn-open-objective-modal-banner">
            ⚡ Open JD Generator
          </button>
        </div>
        <p class="form-hint mt-xs" style="margin-bottom:0;">
          Paste any Job Description to generate 4 diverse, placement-tailored objectives with unique phrasing every time.
        </p>
      </div>

      <div class="form-group">
        <div class="flex items-center justify-between">
          <label class="form-label mb-0" for="input-objective">Career Objective Text</label>
          <span class="form-hint" id="objective-char-counter">${objectiveText.length} chars (${wordCount} words)</span>
        </div>
        <textarea class="form-textarea mt-xs" id="input-objective" rows="6" placeholder="Motivated final-year B.Tech Computer Science student...">${escapeHtml(objectiveText)}</textarea>
        <div class="flex items-center justify-between mt-xs flex-wrap gap-xs">
          <p class="form-hint mb-0">All text is automatically justified per Amity placement standards.</p>
          <span class="badge badge--green" style="font-size:0.7rem;">Editable anytime</span>
        </div>
      </div>
    </div>
  `;
}

function renderAcademicForm(data, isActive) {
  const academic = data.academic || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="academic">
      <h2 class="form-section-title">🎓 Academic Details</h2>
      <p class="form-section-desc">Bulleted educational qualifications (BTech CGPA/Minor, 12th CBSE, 10th CBSE).</p>

      ${academic.map((item, i) => `
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">•</span>
          <input type="text" class="form-input academic-input" data-index="${i}" value="${escapeHtml(item)}" placeholder="e.g. BTech- CGPA 7.79 | Minor in Cyber Security" style="flex:1;" />
          <button class="btn btn--sm btn--red academic-delete" data-index="${i}" title="Delete bullet">✕</button>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-academic">+ Add Academic Bullet</button>
    </div>
  `;
}

function renderExperienceForm(data, isActive) {
  const experience = data.experience || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="experience">
      <h2 class="form-section-title">💼 Experience / Internships</h2>
      <p class="form-section-desc">Internships, virtual training, or industry experience with bulleted achievements.</p>

      ${experience.map((exp, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${i + 1}</span>
            <button class="delete-btn exp-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>

          <div class="form-group">
            <label class="form-label">Role / Internship Title</label>
            <input type="text" class="form-input" data-exp-field="title" data-exp-index="${i}" value="${escapeHtml(exp.title)}" placeholder="e.g. Web Development Internship" />
          </div>

          <div class="form-group">
            <label class="form-label">Organization / Collaboration</label>
            <input type="text" class="form-input" data-exp-field="company" data-exp-index="${i}" value="${escapeHtml(exp.company)}" placeholder="e.g. Edunet Foundation – AICTE Collaboration" />
          </div>

          <div class="form-group">
            <label class="form-label">Duration & Modality (Italic Line)</label>
            <input type="text" class="form-input" data-exp-field="duration" data-exp-index="${i}" value="${escapeHtml(exp.duration)}" placeholder="e.g. Aug 21, 2025 – Sep 30, 2025 (6 weeks, Virtual)" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(exp.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Action verb + technical achievement..." style="flex:1;" />
                ${exp.bullets.length > 1 ? `<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${i}">+ Add Bullet</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience Entry</button>
    </div>
  `;
}

function renderProjectsForm(data, isActive) {
  const projects = data.projects || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="projects">
      <h2 class="form-section-title">🚀 Projects</h2>
      <p class="form-section-desc">Technical projects with Project Name, Tech Stack, and justified bullet points.</p>

      ${projects.map((proj, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${i + 1}</span>
            <button class="delete-btn proj-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>

          <div class="form-group">
            <label class="form-label">Project Title (e.g. FINMATE AI)</label>
            <input type="text" class="form-input" data-proj-field="name" data-proj-index="${i}" value="${escapeHtml(proj.name)}" placeholder="e.g. FINMATE AI" />
          </div>

          <div class="form-group">
            <label class="form-label">Tech Stack</label>
            <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${i}" value="${escapeHtml(proj.techStack)}" placeholder="e.g. Python, Flask, MySQL, LLM, RAG, React.js" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(proj.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Describe feature, architectural design, outcome..." style="flex:1;" />
                ${proj.bullets.length > 1 ? `<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${i}">+ Add Bullet</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project Entry</button>
    </div>
  `;
}

function renderSkillsForm(data, isActive) {
  const skills = data.skills || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Bullet format with bold category prefix (e.g. Web Development and Backend: React.js, Node.js...).</p>

      ${skills.map((s, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Skill Category #${i + 1}</span>
            <button class="btn btn--sm btn--red skill-cat-delete" data-index="${i}">✕</button>
          </div>
          <div class="form-group mb-xs">
            <input type="text" class="form-input" data-skill-field="category" data-skill-index="${i}" value="${escapeHtml(s.category)}" placeholder="Category Name (e.g. Programming & Core Skills)" />
          </div>
          <div class="form-group mb-xs">
            <textarea class="form-textarea" data-skill-field="skills" data-skill-index="${i}" rows="2" placeholder="Skills list (e.g. Python, SQL, Java, C++, OOP, DSA)">${escapeHtml(s.skills)}</textarea>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn mt-sm" id="btn-add-skill-cat">+ Add Skill Category</button>
    </div>
  `;
}

function renderAwardsForm(data, isActive) {
  const awards = data.awards || [];
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="awards">
      <h2 class="form-section-title">🏆 Awards and Achievements</h2>
      <p class="form-section-desc">Certifications, hackathon wins, and professional achievements.</p>

      ${awards.map((item, i) => `
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">•</span>
          <input type="text" class="form-input award-input" data-index="${i}" value="${escapeHtml(item)}" placeholder="e.g. Tata Cybersecurity Analyst Certification" style="flex:1;" />
          <button class="btn btn--sm btn--red award-delete" data-index="${i}">✕</button>
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
      <h2 class="form-section-title">👑 Leadership & Initiative</h2>
      <p class="form-section-desc">Student initiatives, hackathon leadership, and problem-solving contributions.</p>

      ${leadership.map((item, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Initiative #${i + 1}</span>
            <button class="btn btn--sm btn--red lead-delete" data-index="${i}">✕</button>
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
      <h2 class="form-section-title">🔗 Links</h2>
      <p class="form-section-desc">Professional profiles rendered as clean, clickable blue links in the PDF.</p>

      ${links.map((item, i) => `
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Link #${i + 1}</span>
            <button class="btn btn--sm btn--red link-delete" data-index="${i}">✕</button>
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
      <h2 class="form-section-title">📝 Self Declaration</h2>
      <p class="form-section-desc">Standard placement cell declaration with Date, Place, divider, and Candidate Name.</p>

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
          <label class="form-label">Place (e.g. Gwalior / Noida)</label>
          <input type="text" class="form-input" id="input-decl-place" value="${escapeHtml(d.place)}" placeholder="Gwalior" />
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// PDF EXPORT
// ============================================================

async function exportPDF(store, toast) {
  const data = store.getData();
  const rawName = (data.personal?.fullName || 'Student').trim().replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
  const fileName = `${rawName || 'Student'}_Amity_Resume.pdf`;

  await downloadVectorPDF(data, fileName, toast);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
