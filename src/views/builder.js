/**
 * Builder View — The main resume editing interface
 * Split layout: Form sidebar + Live preview
 * 
 * Implements:
 * - Direct element-scoped event binding (no unmounted document queries)
 * - Real-time preview updates without destroying form DOM / losing focus
 * - Career Objective / Overview (PRD Section 7)
 * - Complete Academic details (Degree, Class XII, Class X)
 * - Dual PDF Export: html2pdf file download + native vector browser print
 * - Integrated JD Assist panel
 */

import { renderPreview, buildAmityResumeHTML } from './preview.js';
import { renderJDPanel } from './jd-panel.js';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '👤', required: true },
  { id: 'objective', label: 'Career Objective', icon: '🎯', required: false },
  { id: 'academic', label: 'Education', icon: '🎓', required: true },
  { id: 'skills', label: 'Technical Skills', icon: '⚡', required: true },
  { id: 'experience', label: 'Work Experience', icon: '💼', required: false },
  { id: 'projects', label: 'Projects', icon: '🚀', required: false },
  { id: 'achievements', label: 'Achievements', icon: '🏆', required: false },
  { id: 'leadership', label: 'Leadership', icon: '👑', required: false },
  { id: 'links', label: 'Profile Links', icon: '🔗', required: false },
  { id: 'declaration', label: 'Declaration', icon: '📝', required: true },
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
      ${mode === 'jd-assist' ? '<div id="jd-panel-mount"></div>' : ''}
      
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
            ${renderSkillsForm(data, activeSection === 'skills')}
            ${renderExperienceForm(data, activeSection === 'experience')}
            ${renderProjectsForm(data, activeSection === 'projects')}
            ${renderAchievementsForm(data, activeSection === 'achievements')}
            ${renderLeadershipForm(data, activeSection === 'leadership')}
            ${renderLinksForm(data, activeSection === 'links')}
            ${renderDeclarationForm(data, activeSection === 'declaration')}
          </div>

          <!-- Bottom Action Toolbar -->
          <div class="builder-actions-toolbar">
            ${activeSection !== 'personal' ? '<button class="btn btn--white btn--sm" id="btn-prev-section">← Prev</button>' : ''}
            ${activeSection !== 'declaration' ? '<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>' : ''}
            
            <div class="export-btn-group">
              <button class="btn btn--green btn--sm" id="btn-export-pdf" title="Download PDF using html2pdf">
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
    // Update completion icons without re-rendering forms
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
    // Section navigation clicks
    container.querySelectorAll('[data-section]').forEach((el) => {
      el.addEventListener('click', () => {
        activeSection = el.dataset.section;
        buildUI();
      });
    });

    // Mobile view toggle buttons
    container.querySelectorAll('.toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        mobileView = btn.dataset.view;
        buildUI();
      });
    });

    // Prev / Next section buttons
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

    // Export PDF (html2pdf)
    container.querySelector('#btn-export-pdf')?.addEventListener('click', () => {
      exportPDF(store, toast);
    });

    // Native Vector Print (window.print)
    container.querySelector('#btn-print-pdf')?.addEventListener('click', () => {
      window.print();
    });

    // ========== PERSONAL FORM ==========
    attachInputListener('input-fullname', (v) => store.updatePersonal('fullName', v));
    attachInputListener('input-email', (v) => store.updatePersonal('email', v));
    attachInputListener('input-phone', (v) => store.updatePersonal('phone', v));
    attachInputListener('input-address', (v) => store.updatePersonal('address', v));
    attachInputListener('input-city', (v) => store.updatePersonal('city', v));
    attachInputListener('input-state', (v) => store.updatePersonal('state', v));

    // Photo upload & remove
    const photoInput = container.querySelector('#input-photo');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toast.show('Photo must be under 5MB', 'error');
            return;
          }
          if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.show('Only JPEG and PNG photos are supported', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            store.setPhoto(ev.target.result);
            buildUI();
            toast.show('Passport photo uploaded!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    container.querySelector('#btn-remove-photo')?.addEventListener('click', () => {
      store.setPhoto(null);
      buildUI();
      toast.show('Photo removed', 'info');
    });

    // ========== CAREER OBJECTIVE ==========
    attachInputListener('input-objective', (v) => store.updateObjective(v));

    // ========== ACADEMIC FORM ==========
    attachInputListener('input-degree', (v) => store.updateAcademic('degree', v));
    attachInputListener('input-university', (v) => store.updateAcademic('university', v));
    attachInputListener('input-grad-year', (v) => store.updateAcademic('graduationYear', v));
    attachInputListener('input-cgpa', (v) => store.updateAcademic('cgpa', v));
    attachInputListener('input-specialization', (v) => store.updateAcademic('specialization', v));
    attachInputListener('input-coursework', (v) => store.updateAcademic('relevantCoursework', v));
    attachInputListener('input-12-school', (v) => store.updateAcademic('twelfthSchool', v));
    attachInputListener('input-12-board', (v) => store.updateAcademic('twelfthBoard', v));
    attachInputListener('input-12-year', (v) => store.updateAcademic('twelfthYear', v));
    attachInputListener('input-12-pct', (v) => store.updateAcademic('twelfthPercentage', v));
    attachInputListener('input-10-school', (v) => store.updateAcademic('tenthSchool', v));
    attachInputListener('input-10-board', (v) => store.updateAcademic('tenthBoard', v));
    attachInputListener('input-10-year', (v) => store.updateAcademic('tenthYear', v));
    attachInputListener('input-10-pct', (v) => store.updateAcademic('tenthPercentage', v));

    // ========== SKILLS FORM ==========
    const skillCategories = ['languages', 'frameworks', 'tools', 'databases', 'other'];
    skillCategories.forEach((cat) => {
      const input = container.querySelector(`#skill-input-${cat}`);
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            e.preventDefault();
            store.addSkill(cat, input.value.trim());
            buildUI();
          }
        });
      }
    });

    container.querySelectorAll('.skill-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeSkill(btn.dataset.category, btn.dataset.skill);
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
        store.updateExperience(idx, field, input.type === 'checkbox' ? input.checked : input.value);
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

    // ========== ACHIEVEMENTS FORM ==========
    container.querySelector('#btn-add-achievement')?.addEventListener('click', () => {
      store.addAchievement();
      buildUI();
    });

    container.querySelectorAll('.ach-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAchievement(parseInt(btn.dataset.index, 10));
        buildUI();
      });
    });

    container.querySelectorAll('[data-ach-field]').forEach((input) => {
      const idx = parseInt(input.dataset.achIndex, 10);
      const field = input.dataset.achField;
      input.addEventListener('input', () => {
        store.updateAchievement(idx, field, input.value);
        updatePreviewOnly();
      });
    });

    // ========== LEADERSHIP FORM ==========
    container.querySelector('#btn-add-leadership')?.addEventListener('click', () => {
      store.addLeadership();
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

    // ========== LINKS FORM ==========
    attachInputListener('input-github', (v) => store.updateLink('github', v));
    attachInputListener('input-linkedin', (v) => store.updateLink('linkedin', v));
    attachInputListener('input-leetcode', (v) => store.updateLink('leetcode', v));
    attachInputListener('input-portfolio', (v) => store.updateLink('portfolio', v));
    attachInputListener('input-other-link', (v) => store.updateLink('other', v));

    // ========== DECLARATION FORM ==========
    attachInputListener('input-decl-text', (v) => store.updateDeclaration('text', v));
    attachInputListener('input-decl-place', (v) => store.updateDeclaration('place', v));
    attachInputListener('input-decl-date', (v) => store.updateDeclaration('date', v));

    // Mount JD Assist Panel if in JD Assist mode
    if (mode === 'jd-assist') {
      const jdMount = container.querySelector('#jd-panel-mount');
      if (jdMount) {
        jdMount.innerHTML = '';
        jdMount.appendChild(renderJDPanel({ store, toast }));
      }
    }
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
      <h2 class="form-section-title">👤 Personal Details</h2>
      <p class="form-section-desc">Basic candidate details for the Amity resume header.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-fullname" value="${escapeHtml(p.fullName)}" placeholder="e.g. Abhishek Tiwari" />
        </div>
        <div class="form-group">
          <label class="form-label">Official Email <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${escapeHtml(p.email)}" placeholder="e.g. abhishek@amity.edu" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Mobile Number <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${escapeHtml(p.phone)}" placeholder="e.g. +91 98765 43210" />
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input type="text" class="form-input" id="input-city" value="${escapeHtml(p.city)}" placeholder="e.g. Noida / New Delhi" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" class="form-input" id="input-state" value="${escapeHtml(p.state)}" placeholder="e.g. Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Residential Address</label>
          <input type="text" class="form-input" id="input-address" value="${escapeHtml(p.address)}" placeholder="e.g. Sector 125, Amity Campus" />
        </div>
      </div>

      <!-- Passport Photo Upload -->
      <div class="form-group">
        <label class="form-label">Passport Photo (Standard Amity Template)</label>
        <div class="photo-upload">
          <div class="photo-preview">
            ${p.photo ? `<img src="${p.photo}" alt="Passport photo" style="width:100%;height:100%;object-fit:cover;" />` : '<span class="photo-placeholder">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${p.photo ? '<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>' : ''}
          </div>
          <p class="form-hint">JPEG/PNG format, passport ratio. Automatically fitted to template header.</p>
        </div>
      </div>
    </div>
  `;
}

function renderObjectiveForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="objective">
      <h2 class="form-section-title">🎯 Career Objective / Summary</h2>
      <p class="form-section-desc">A concise 2-3 sentence summary of your career aspirations and core strengths.</p>

      <div class="form-group">
        <label class="form-label">Career Objective Statement</label>
        <textarea class="form-textarea" id="input-objective" rows="5" placeholder="e.g. Dedicated Computer Science student with strong foundations in Data Structures, Algorithms, and Full-Stack Web Development. Seeking a software development engineer role to build scalable systems.">${escapeHtml(data.objective || '')}</textarea>
        <p class="form-hint">Tip: If you use JD Assist, this can be automatically tailored to your target job description.</p>
      </div>
    </div>
  `;
}

function renderAcademicForm(data, isActive) {
  const a = data.academic || {};
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="academic">
      <h2 class="form-section-title">🎓 Academic Qualifications</h2>
      <p class="form-section-desc">University program and secondary school records formatted in the official Amity table.</p>

      <!-- University Degree -->
      <div class="entry-card mb-lg">
        <div class="entry-card-header">
          <span class="entry-card-title">1. Current / Graduation Program</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Degree / Program <span class="required">*</span></label>
            <input type="text" class="form-input" id="input-degree" value="${escapeHtml(a.degree)}" placeholder="e.g. B.Tech in Computer Science & Engineering" />
          </div>
          <div class="form-group">
            <label class="form-label">University / Institute</label>
            <input type="text" class="form-input" id="input-university" value="${escapeHtml(a.university)}" placeholder="e.g. Amity University Uttar Pradesh" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Graduation Year <span class="required">*</span></label>
            <input type="text" class="form-input" id="input-grad-year" value="${escapeHtml(a.graduationYear)}" placeholder="e.g. 2026" />
          </div>
          <div class="form-group">
            <label class="form-label">CGPA / Percentage</label>
            <input type="text" class="form-input" id="input-cgpa" value="${escapeHtml(a.cgpa)}" placeholder="e.g. 8.75" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Specialization / Minor (Optional)</label>
          <input type="text" class="form-input" id="input-specialization" value="${escapeHtml(a.specialization)}" placeholder="e.g. Cloud Computing & DevOps" />
        </div>

        <div class="form-group">
          <label class="form-label">Relevant Coursework</label>
          <input type="text" class="form-input" id="input-coursework" value="${escapeHtml(a.relevantCoursework)}" placeholder="e.g. Data Structures & Algorithms, OS, DBMS, Computer Networks, Software Engineering" />
        </div>
      </div>

      <!-- Senior Secondary (12th) -->
      <div class="entry-card mb-lg">
        <div class="entry-card-header">
          <span class="entry-card-title">2. Class XII / Senior Secondary</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" class="form-input" id="input-12-school" value="${escapeHtml(a.twelfthSchool)}" placeholder="e.g. Delhi Public School, R.K. Puram" />
          </div>
          <div class="form-group">
            <label class="form-label">Board</label>
            <input type="text" class="form-input" id="input-12-board" value="${escapeHtml(a.twelfthBoard)}" placeholder="e.g. CBSE / ISC / State Board" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Passing Year</label>
            <input type="text" class="form-input" id="input-12-year" value="${escapeHtml(a.twelfthYear)}" placeholder="e.g. 2022" />
          </div>
          <div class="form-group">
            <label class="form-label">Percentage / Marks</label>
            <input type="text" class="form-input" id="input-12-pct" value="${escapeHtml(a.twelfthPercentage)}" placeholder="e.g. 94.2%" />
          </div>
        </div>
      </div>

      <!-- Secondary (10th) -->
      <div class="entry-card">
        <div class="entry-card-header">
          <span class="entry-card-title">3. Class X / Secondary</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" class="form-input" id="input-10-school" value="${escapeHtml(a.tenthSchool)}" placeholder="e.g. St. Xavier's High School" />
          </div>
          <div class="form-group">
            <label class="form-label">Board</label>
            <input type="text" class="form-input" id="input-10-board" value="${escapeHtml(a.tenthBoard)}" placeholder="e.g. CBSE / ICSE / State Board" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Passing Year</label>
            <input type="text" class="form-input" id="input-10-year" value="${escapeHtml(a.tenthYear)}" placeholder="e.g. 2020" />
          </div>
          <div class="form-group">
            <label class="form-label">Percentage / CGPA</label>
            <input type="text" class="form-input" id="input-10-pct" value="${escapeHtml(a.tenthPercentage)}" placeholder="e.g. 96.0%" />
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSkillsForm(data, isActive) {
  const categories = [
    { key: 'languages', label: 'Programming Languages', placeholder: 'e.g. C++, Java, Python, JavaScript', color: 'tag--blue' },
    { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'e.g. React, Node.js, Express, Spring Boot', color: 'tag--pink' },
    { key: 'tools', label: 'Developer Tools & Platforms', placeholder: 'e.g. Git, Docker, AWS, Postman, Linux', color: 'tag--green' },
    { key: 'databases', label: 'Databases', placeholder: 'e.g. PostgreSQL, MongoDB, MySQL, Redis', color: 'tag--purple' },
    { key: 'other', label: 'Areas of Interest / Core Concepts', placeholder: 'e.g. OOPs, System Design, REST APIs', color: 'tag--yellow' },
  ];

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Categorized technical competencies. Type a skill and press <strong>Enter</strong> to add.</p>

      ${categories.map((cat) => `
        <div class="form-group mb-md">
          <label class="form-label">${cat.label}</label>
          <div class="skills-input-wrapper">
            ${(data.skills[cat.key] || []).map((skill) => `
              <span class="tag ${cat.color}">
                ${escapeHtml(skill)}
                <span class="tag-remove skill-remove" data-category="${cat.key}" data-skill="${escapeHtml(skill)}">✕</span>
              </span>
            `).join('')}
            <input type="text" id="skill-input-${cat.key}" placeholder="${cat.placeholder}" />
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderExperienceForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="experience">
      <h2 class="form-section-title">💼 Work Experience / Internships</h2>
      <p class="form-section-desc">Industry internships, research roles, or corporate experience. Optional section.</p>

      ${data.experience.map((exp, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${i + 1}</span>
            <button class="delete-btn exp-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role / Designation</label>
              <input type="text" class="form-input" data-exp-field="title" data-exp-index="${i}" value="${escapeHtml(exp.title)}" placeholder="e.g. Software Engineering Intern" />
            </div>
            <div class="form-group">
              <label class="form-label">Company / Organization</label>
              <input type="text" class="form-input" data-exp-field="company" data-exp-index="${i}" value="${escapeHtml(exp.company)}" placeholder="e.g. Microsoft" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="month" class="form-input" data-exp-field="startDate" data-exp-index="${i}" value="${escapeHtml(exp.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="month" class="form-input" data-exp-field="endDate" data-exp-index="${i}" value="${escapeHtml(exp.endDate)}" ${exp.current ? 'disabled' : ''} />
              <label style="margin-top:4px;display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer;">
                <input type="checkbox" data-exp-field="current" data-exp-index="${i}" ${exp.current ? 'checked' : ''} /> Currently Working Here
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" data-exp-field="location" data-exp-index="${i}" value="${escapeHtml(exp.location)}" placeholder="e.g. Bengaluru, India (Remote)" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Achievements</label>
            ${(exp.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">▪</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Action verb + context + measurable impact..." style="flex:1;" />
                ${exp.bullets.length > 1 ? `<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${i}">+ Add Bullet Point</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience / Internship</button>
    </div>
  `;
}

function renderProjectsForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="projects">
      <h2 class="form-section-title">🚀 Academic & Personal Projects</h2>
      <p class="form-section-desc">Key technical projects with technology stack and working repository link.</p>

      ${data.projects.map((proj, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${i + 1}</span>
            <button class="delete-btn proj-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project Title</label>
              <input type="text" class="form-input" data-proj-field="name" data-proj-index="${i}" value="${escapeHtml(proj.name)}" placeholder="e.g. Distributed Task Orchestrator" />
            </div>
            <div class="form-group">
              <label class="form-label">Tech Stack (in brackets)</label>
              <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${i}" value="${escapeHtml(proj.techStack)}" placeholder="e.g. React, Node.js, Redis, Docker" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="month" class="form-input" data-proj-field="startDate" data-proj-index="${i}" value="${escapeHtml(proj.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="month" class="form-input" data-proj-field="endDate" data-proj-index="${i}" value="${escapeHtml(proj.endDate)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Repository / Live Demo URL</label>
            <input type="url" class="form-input" data-proj-field="link" data-proj-index="${i}" value="${escapeHtml(proj.link)}" placeholder="https://github.com/username/project" />
          </div>

          <div class="form-group">
            <label class="form-label">Project Description & Bullets</label>
            ${(proj.bullets || ['']).map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">▪</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Describe problem solved, technical complexity..." style="flex:1;" />
                ${proj.bullets.length > 1 ? `<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${i}">+ Add Bullet Point</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project</button>
    </div>
  `;
}

function renderAchievementsForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="achievements">
      <h2 class="form-section-title">🏆 Awards & Certifications</h2>
      <p class="form-section-desc">Competitive coding achievements, hackathons, certifications, or scholarships.</p>

      ${data.achievements.map((ach, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Achievement #${i + 1}</span>
            <button class="delete-btn ach-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Title / Recognition</label>
              <input type="text" class="form-input" data-ach-field="title" data-ach-index="${i}" value="${escapeHtml(ach.title)}" placeholder="e.g. Winner - Smart India Hackathon 2024" />
            </div>
            <div class="form-group">
              <label class="form-label">Date / Year</label>
              <input type="text" class="form-input" data-ach-field="date" data-ach-index="${i}" value="${escapeHtml(ach.date)}" placeholder="e.g. Dec 2024" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Brief Description / Issuing Body</label>
            <input type="text" class="form-input" data-ach-field="description" data-ach-index="${i}" value="${escapeHtml(ach.description)}" placeholder="e.g. Awarded 1st place out of 500+ national teams." />
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-achievement">+ Add Achievement / Certification</button>
    </div>
  `;
}

function renderLeadershipForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="leadership">
      <h2 class="form-section-title">👑 Leadership & Initiatives</h2>
      <p class="form-section-desc">Positions of responsibility, club coordination, or student council roles.</p>

      ${data.leadership.map((lead, i) => `
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Position #${i + 1}</span>
            <button class="delete-btn lead-delete" data-index="${i}" title="Remove entry">✕</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role</label>
              <input type="text" class="form-input" data-lead-field="role" data-lead-index="${i}" value="${escapeHtml(lead.role)}" placeholder="e.g. Lead Organizer" />
            </div>
            <div class="form-group">
              <label class="form-label">Society / Organization</label>
              <input type="text" class="form-input" data-lead-field="organization" data-lead-index="${i}" value="${escapeHtml(lead.organization)}" placeholder="e.g. Amity ACM Student Chapter" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Duration</label>
              <input type="text" class="form-input" data-lead-field="date" data-lead-index="${i}" value="${escapeHtml(lead.date)}" placeholder="e.g. Aug 2023 – Present" />
            </div>
            <div class="form-group">
              <label class="form-label">Contribution</label>
              <input type="text" class="form-input" data-lead-field="description" data-lead-index="${i}" value="${escapeHtml(lead.description)}" placeholder="e.g. Led a team of 15 students to host annual hackathon with 800+ attendees." />
            </div>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-leadership">+ Add Leadership Role</button>
    </div>
  `;
}

function renderLinksForm(data, isActive) {
  const l = data.links || {};
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="links">
      <h2 class="form-section-title">🔗 Professional Profile Links</h2>
      <p class="form-section-desc">Per PRD Section 8: URLs will be formatted as clean, clickable labels (e.g. <strong>GitHub</strong>, <strong>LinkedIn</strong>) in the PDF.</p>

      <div class="form-group">
        <label class="form-label">GitHub Profile URL</label>
        <input type="url" class="form-input" id="input-github" value="${escapeHtml(l.github)}" placeholder="https://github.com/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">LinkedIn Profile URL</label>
        <input type="url" class="form-input" id="input-linkedin" value="${escapeHtml(l.linkedin)}" placeholder="https://linkedin.com/in/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">LeetCode Profile URL</label>
        <input type="url" class="form-input" id="input-leetcode" value="${escapeHtml(l.leetcode)}" placeholder="https://leetcode.com/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">Portfolio / Personal Website</label>
        <input type="url" class="form-input" id="input-portfolio" value="${escapeHtml(l.portfolio)}" placeholder="https://yourportfolio.dev" />
      </div>

      <div class="form-group">
        <label class="form-label">Other Allowed Profile Link</label>
        <input type="url" class="form-input" id="input-other-link" value="${escapeHtml(l.other)}" placeholder="https://codeforces.com/profile/username" />
      </div>
    </div>
  `;
}

function renderDeclarationForm(data, isActive) {
  const d = data.declaration || {};
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="declaration">
      <h2 class="form-section-title">📝 Self Declaration</h2>
      <p class="form-section-desc">Authorized self-declaration wording per Amity placement cell template.</p>

      <div class="form-group">
        <label class="form-label">Declaration Statement</label>
        <textarea class="form-textarea" id="input-decl-text" rows="3">${escapeHtml(d.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Place <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-decl-place" value="${escapeHtml(d.place)}" placeholder="e.g. Noida, Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="input-decl-date" value="${escapeHtml(d.date)}" />
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// PDF EXPORT (html2pdf with clickable links & correct geometry)
// ============================================================

async function exportPDF(store, toast) {
  const errors = store.validate();
  if (errors.length > 0) {
    const errorFields = errors.map((e) => e.message).join('\n• ');
    toast.show(`Please complete required fields:\n• ${errorFields}`, 'error');
    return;
  }

  toast.show('Preparing high-resolution PDF download...', 'info');

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const data = store.getData();

    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:210mm;background:#fff;';
    pdfContainer.innerHTML = `
      <div class="resume-preview" style="width:210mm;min-height:297mm;box-shadow:none;border:none;padding:12mm 15mm;">
        ${buildAmityResumeHTML(data)}
      </div>
    `;
    document.body.appendChild(pdfContainer);

    const element = pdfContainer.querySelector('.resume-preview');
    const studentName = (data.personal.fullName || 'Student').replace(/\s+/g, '_');

    const opt = {
      margin: 0,
      filename: `${studentName}_Amity_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      enableLinks: true,
    };

    await html2pdf().set(opt).from(element).save();

    document.body.removeChild(pdfContainer);
    toast.show('PDF downloaded successfully! (You can also use Native Print for vector PDF)', 'success');
  } catch (err) {
    console.error('PDF export error:', err);
    toast.show('Download failed. Please click "Native Print" to save as PDF directly.', 'error');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
