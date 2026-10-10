/**
 * Builder View — The main resume editing interface
 * Split layout: Form sidebar + Live preview
 */
import { renderPreview } from './preview.js';
import { renderJDPanel } from './jd-panel.js';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '👤', required: true },
  { id: 'academic', label: 'Education', icon: '🎓', required: true },
  { id: 'experience', label: 'Experience', icon: '💼', required: false },
  { id: 'projects', label: 'Projects', icon: '🚀', required: false },
  { id: 'skills', label: 'Skills', icon: '⚡', required: true },
  { id: 'achievements', label: 'Achievements', icon: '🏆', required: false },
  { id: 'leadership', label: 'Leadership', icon: '👑', required: false },
  { id: 'links', label: 'Profile Links', icon: '🔗', required: false },
  { id: 'declaration', label: 'Declaration', icon: '📝', required: true },
];

export function renderBuilder({ store, mode, toast, onSave, onBack }) {
  const container = document.createElement('div');
  let activeSection = 'personal';
  let mobileView = 'form'; // 'form' | 'preview'

  function buildUI() {
    const data = store.getData();
    const completion = store.getCompletionStatus();

    container.innerHTML = `
      ${mode === 'jd-assist' ? '<div id="jd-panel-mount"></div>' : ''}
      
      <!-- Mobile Toggle -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${mobileView === 'form' ? 'active' : ''}" data-view="form">✏️ Edit</button>
        <button class="toggle-btn ${mobileView === 'preview' ? 'active' : ''}" data-view="preview">👁 Preview</button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        ${SECTIONS.map((s) => `
          <div class="progress-step ${s.id === activeSection ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-section="${s.id}">
            <span class="step-number">${s.icon}</span>
            <span class="step-label">${s.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="builder active">
        <!-- Sidebar: Section Nav + Form -->
        <div class="builder-sidebar ${mobileView === 'preview' ? 'mobile-hidden' : ''}">
          <nav class="section-nav">
            ${SECTIONS.map((s) => `
              <div class="section-nav-item ${s.id === activeSection ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-section="${s.id}">
                <span class="nav-icon">${s.icon}</span>
                <span>${s.label}</span>
                ${s.required ? '<span class="required" style="font-size:0.7rem;">REQ</span>' : ''}
                <span class="nav-status">${completion[s.id] ? '✓' : '○'}</span>
              </div>
            `).join('')}
          </nav>

          <!-- Form Sections -->
          ${renderPersonalForm(data, activeSection === 'personal')}
          ${renderAcademicForm(data, activeSection === 'academic')}
          ${renderExperienceForm(data, activeSection === 'experience')}
          ${renderProjectsForm(data, activeSection === 'projects')}
          ${renderSkillsForm(data, activeSection === 'skills')}
          ${renderAchievementsForm(data, activeSection === 'achievements')}
          ${renderLeadershipForm(data, activeSection === 'leadership')}
          ${renderLinksForm(data, activeSection === 'links')}
          ${renderDeclarationForm(data, activeSection === 'declaration')}

          <!-- Navigation buttons -->
          <div style="padding: var(--space-lg); display: flex; gap: var(--space-md); flex-wrap: wrap;">
            ${activeSection !== 'personal' ? '<button class="btn btn--white btn--sm" id="btn-prev-section">← Previous</button>' : ''}
            ${activeSection !== 'declaration' ? '<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>' : ''}
            <button class="btn btn--green" id="btn-export-pdf" style="margin-left: auto;">📄 Export PDF</button>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="builder-preview ${mobileView === 'form' ? 'mobile-hidden' : ''}" id="preview-panel">
          ${renderPreview(data)}
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Section navigation
    container.querySelectorAll('[data-section]').forEach((el) => {
      el.addEventListener('click', () => {
        activeSection = el.dataset.section;
        buildUI();
      });
    });

    // Mobile view toggle
    container.querySelectorAll('.toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        mobileView = btn.dataset.view;
        buildUI();
      });
    });

    // Prev/Next section buttons
    document.getElementById('btn-prev-section')?.addEventListener('click', () => {
      const idx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (idx > 0) {
        activeSection = SECTIONS[idx - 1].id;
        buildUI();
      }
    });

    document.getElementById('btn-next-section')?.addEventListener('click', () => {
      const idx = SECTIONS.findIndex((s) => s.id === activeSection);
      if (idx < SECTIONS.length - 1) {
        activeSection = SECTIONS[idx + 1].id;
        buildUI();
      }
    });

    // Export PDF
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      exportPDF(store, toast);
    });

    // ========== PERSONAL FORM ==========
    attachInputListener('input-fullname', (v) => store.updatePersonal('fullName', v));
    attachInputListener('input-email', (v) => store.updatePersonal('email', v));
    attachInputListener('input-phone', (v) => store.updatePersonal('phone', v));
    attachInputListener('input-address', (v) => store.updatePersonal('address', v));
    attachInputListener('input-city', (v) => store.updatePersonal('city', v));
    attachInputListener('input-state', (v) => store.updatePersonal('state', v));

    // Photo upload
    const photoInput = document.getElementById('input-photo');
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
            toast.show('Photo uploaded!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    document.getElementById('btn-remove-photo')?.addEventListener('click', () => {
      store.setPhoto(null);
      buildUI();
      toast.show('Photo removed', 'info');
    });

    // ========== ACADEMIC FORM ==========
    attachInputListener('input-degree', (v) => store.updateAcademic('degree', v));
    attachInputListener('input-university', (v) => store.updateAcademic('university', v));
    attachInputListener('input-grad-year', (v) => store.updateAcademic('graduationYear', v));
    attachInputListener('input-cgpa', (v) => store.updateAcademic('cgpa', v));
    attachInputListener('input-specialization', (v) => store.updateAcademic('specialization', v));
    attachInputListener('input-coursework', (v) => store.updateAcademic('relevantCoursework', v));

    // ========== EXPERIENCE FORM ==========
    document.getElementById('btn-add-experience')?.addEventListener('click', () => {
      store.addExperience();
      buildUI();
    });

    container.querySelectorAll('.exp-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeExperience(parseInt(btn.dataset.index));
        buildUI();
      });
    });

    container.querySelectorAll('[data-exp-field]').forEach((input) => {
      const idx = parseInt(input.dataset.expIndex);
      const field = input.dataset.expField;
      input.addEventListener('input', () => {
        store.updateExperience(idx, field, input.type === 'checkbox' ? input.checked : input.value);
        debouncePreview();
      });
    });

    container.querySelectorAll('[data-exp-bullet]').forEach((input) => {
      const expIdx = parseInt(input.dataset.expIndex);
      const bulletIdx = parseInt(input.dataset.bulletIndex);
      input.addEventListener('input', () => {
        store.updateExperienceBullet(expIdx, bulletIdx, input.value);
        debouncePreview();
      });
    });

    container.querySelectorAll('.exp-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.addExperienceBullet(parseInt(btn.dataset.expIndex));
        buildUI();
      });
    });

    container.querySelectorAll('.exp-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeExperienceBullet(parseInt(btn.dataset.expIndex), parseInt(btn.dataset.bulletIndex));
        buildUI();
      });
    });

    // ========== PROJECTS FORM ==========
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      store.addProject();
      buildUI();
    });

    container.querySelectorAll('.proj-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeProject(parseInt(btn.dataset.index));
        buildUI();
      });
    });

    container.querySelectorAll('[data-proj-field]').forEach((input) => {
      const idx = parseInt(input.dataset.projIndex);
      const field = input.dataset.projField;
      input.addEventListener('input', () => {
        store.updateProject(idx, field, input.value);
        debouncePreview();
      });
    });

    container.querySelectorAll('[data-proj-bullet]').forEach((input) => {
      const projIdx = parseInt(input.dataset.projIndex);
      const bulletIdx = parseInt(input.dataset.bulletIndex);
      input.addEventListener('input', () => {
        store.updateProjectBullet(projIdx, bulletIdx, input.value);
        debouncePreview();
      });
    });

    container.querySelectorAll('.proj-add-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.addProjectBullet(parseInt(btn.dataset.projIndex));
        buildUI();
      });
    });

    container.querySelectorAll('.proj-remove-bullet').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeProjectBullet(parseInt(btn.dataset.projIndex), parseInt(btn.dataset.bulletIndex));
        buildUI();
      });
    });

    // ========== SKILLS FORM ==========
    const skillCategories = ['languages', 'frameworks', 'tools', 'databases', 'other'];
    skillCategories.forEach((cat) => {
      const input = document.getElementById(`skill-input-${cat}`);
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

    // ========== ACHIEVEMENTS FORM ==========
    document.getElementById('btn-add-achievement')?.addEventListener('click', () => {
      store.addAchievement();
      buildUI();
    });

    container.querySelectorAll('.ach-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeAchievement(parseInt(btn.dataset.index));
        buildUI();
      });
    });

    container.querySelectorAll('[data-ach-field]').forEach((input) => {
      const idx = parseInt(input.dataset.achIndex);
      const field = input.dataset.achField;
      input.addEventListener('input', () => {
        store.updateAchievement(idx, field, input.value);
        debouncePreview();
      });
    });

    // ========== LEADERSHIP FORM ==========
    document.getElementById('btn-add-leadership')?.addEventListener('click', () => {
      store.addLeadership();
      buildUI();
    });

    container.querySelectorAll('.lead-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.removeLeadership(parseInt(btn.dataset.index));
        buildUI();
      });
    });

    container.querySelectorAll('[data-lead-field]').forEach((input) => {
      const idx = parseInt(input.dataset.leadIndex);
      const field = input.dataset.leadField;
      input.addEventListener('input', () => {
        store.updateLeadership(idx, field, input.value);
        debouncePreview();
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

    // ========== JD ASSIST ==========
    if (mode === 'jd-assist') {
      const jdMount = document.getElementById('jd-panel-mount');
      if (jdMount) {
        jdMount.innerHTML = '';
        jdMount.appendChild(renderJDPanel({ store, toast }));
      }
    }
  }

  let debounceTimer = null;
  function debouncePreview() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const previewPanel = document.getElementById('preview-panel');
      if (previewPanel) {
        previewPanel.innerHTML = renderPreview(store.getData());
      }
    }, 300);
  }

  function attachInputListener(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        callback(el.value);
        debouncePreview();
      });
    }
  }

  // Initial render
  buildUI();

  // Subscribe to store for external changes
  store.subscribe(() => {
    buildUI();
  });

  return container;
}

// ============================================================
// FORM RENDERERS
// ============================================================

function renderPersonalForm(data, isActive) {
  const p = data.personal;
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="personal">
      <h2 class="form-section-title">👤 Personal Information</h2>
      <p class="form-section-desc">Basic contact information for your resume header.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-fullname" value="${escapeHtml(p.fullName)}" placeholder="e.g. Abhishek Tiwari" />
        </div>
        <div class="form-group">
          <label class="form-label">Email <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${escapeHtml(p.email)}" placeholder="e.g. abhishek@amity.edu" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phone <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${escapeHtml(p.phone)}" placeholder="e.g. +91 98765 43210" />
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input type="text" class="form-input" id="input-city" value="${escapeHtml(p.city)}" placeholder="e.g. Noida" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" class="form-input" id="input-state" value="${escapeHtml(p.state)}" placeholder="e.g. Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <input type="text" class="form-input" id="input-address" value="${escapeHtml(p.address)}" placeholder="e.g. Sector 125" />
        </div>
      </div>

      <!-- Photo Upload -->
      <div class="form-group">
        <label class="form-label">Profile Photo</label>
        <div class="photo-upload">
          <div class="photo-preview">
            ${p.photo ? `<img src="${p.photo}" alt="Profile photo" />` : '<span class="photo-placeholder">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${p.photo ? '<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>' : ''}
          </div>
          <p class="form-hint">JPEG or PNG, max 5MB. Will be cropped to passport size.</p>
        </div>
      </div>
    </div>
  `;
}

function renderAcademicForm(data, isActive) {
  const a = data.academic;
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="academic">
      <h2 class="form-section-title">🎓 Education</h2>
      <p class="form-section-desc">Your academic background and qualifications.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-degree" value="${escapeHtml(a.degree)}" placeholder="e.g. B.Tech in Computer Science" />
        </div>
        <div class="form-group">
          <label class="form-label">University</label>
          <input type="text" class="form-input" id="input-university" value="${escapeHtml(a.university)}" placeholder="e.g. Amity University" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Graduation Year <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-grad-year" value="${escapeHtml(a.graduationYear)}" placeholder="e.g. 2026" />
        </div>
        <div class="form-group">
          <label class="form-label">CGPA</label>
          <input type="text" class="form-input" id="input-cgpa" value="${escapeHtml(a.cgpa)}" placeholder="e.g. 8.5" />
          <p class="form-hint">Scale of 0–10</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Specialization</label>
        <input type="text" class="form-input" id="input-specialization" value="${escapeHtml(a.specialization)}" placeholder="e.g. Machine Learning & AI" />
      </div>

      <div class="form-group">
        <label class="form-label">Relevant Coursework</label>
        <textarea class="form-textarea" id="input-coursework" placeholder="e.g. Data Structures, Algorithms, Operating Systems, DBMS">${escapeHtml(a.relevantCoursework)}</textarea>
      </div>
    </div>
  `;
}

function renderExperienceForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="experience">
      <h2 class="form-section-title">💼 Work Experience</h2>
      <p class="form-section-desc">Internships, part-time roles, or full-time positions. Leave empty if not applicable.</p>

      ${data.experience.map((exp, i) => `
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${i + 1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn exp-delete" data-index="${i}" title="Remove">✕</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input type="text" class="form-input" data-exp-field="title" data-exp-index="${i}" value="${escapeHtml(exp.title)}" placeholder="e.g. Software Engineering Intern" />
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <input type="text" class="form-input" data-exp-field="company" data-exp-index="${i}" value="${escapeHtml(exp.company)}" placeholder="e.g. Google" />
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
              <label style="margin-top:4px;display:flex;align-items:center;gap:4px;font-size:0.8rem;">
                <input type="checkbox" data-exp-field="current" data-exp-index="${i}" ${exp.current ? 'checked' : ''} /> Currently working here
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Key Responsibilities / Achievements</label>
            ${exp.bullets.map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Describe what you did..." style="flex:1;" />
                ${exp.bullets.length > 1 ? `<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${i}" style="margin-top:4px;padding:8px;">+ Add Bullet Point</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience</button>
    </div>
  `;
}

function renderProjectsForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="projects">
      <h2 class="form-section-title">🚀 Projects</h2>
      <p class="form-section-desc">Academic projects, personal projects, or hackathon entries.</p>

      ${data.projects.map((proj, i) => `
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${i + 1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn proj-delete" data-index="${i}" title="Remove">✕</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project Name</label>
              <input type="text" class="form-input" data-proj-field="name" data-proj-index="${i}" value="${escapeHtml(proj.name)}" placeholder="e.g. Real-time Chat Application" />
            </div>
            <div class="form-group">
              <label class="form-label">Tech Stack</label>
              <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${i}" value="${escapeHtml(proj.techStack)}" placeholder="e.g. React, Node.js, Socket.io" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Duration Start</label>
              <input type="month" class="form-input" data-proj-field="startDate" data-proj-index="${i}" value="${escapeHtml(proj.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Duration End</label>
              <input type="month" class="form-input" data-proj-field="endDate" data-proj-index="${i}" value="${escapeHtml(proj.endDate)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Project Link</label>
            <input type="url" class="form-input" data-proj-field="link" data-proj-index="${i}" value="${escapeHtml(proj.link)}" placeholder="https://github.com/..." />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            ${proj.bullets.map((bullet, bi) => `
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${i}" data-bullet-index="${bi}" value="${escapeHtml(bullet)}" placeholder="Describe what you built..." style="flex:1;" />
                ${proj.bullets.length > 1 ? `<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${i}" data-bullet-index="${bi}" style="padding:4px 8px;">✕</button>` : ''}
              </div>
            `).join('')}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${i}" style="margin-top:4px;padding:8px;">+ Add Bullet Point</button>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project</button>
    </div>
  `;
}

function renderSkillsForm(data, isActive) {
  const categories = [
    { key: 'languages', label: 'Programming Languages', placeholder: 'e.g. Python', color: 'tag--blue' },
    { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'e.g. React', color: 'tag--pink' },
    { key: 'tools', label: 'Tools & Technologies', placeholder: 'e.g. Git', color: 'tag--green' },
    { key: 'databases', label: 'Databases', placeholder: 'e.g. MongoDB', color: 'tag--purple' },
    { key: 'other', label: 'Other Skills', placeholder: 'e.g. Agile', color: '' },
  ];

  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Add skills by category. Press Enter to add each skill.</p>

      ${categories.map((cat) => `
        <div class="form-group">
          <label class="form-label">${cat.label}</label>
          <div class="skills-input-wrapper">
            ${data.skills[cat.key].map((skill) => `
              <span class="tag ${cat.color}">
                ${escapeHtml(skill)}
                <span class="tag-remove skill-remove" data-category="${cat.key}" data-skill="${escapeHtml(skill)}">✕</span>
              </span>
            `).join('')}
            <input type="text" id="skill-input-${cat.key}" placeholder="${cat.placeholder}" />
          </div>
          <p class="form-hint">Type a skill and press Enter to add</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAchievementsForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="achievements">
      <h2 class="form-section-title">🏆 Achievements & Certifications</h2>
      <p class="form-section-desc">Awards, certifications, or notable accomplishments. Optional section.</p>

      ${data.achievements.map((ach, i) => `
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Achievement #${i + 1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn ach-delete" data-index="${i}" title="Remove">✕</button>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-input" data-ach-field="title" data-ach-index="${i}" value="${escapeHtml(ach.title)}" placeholder="e.g. AWS Certified Solutions Architect" />
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input type="text" class="form-input" data-ach-field="date" data-ach-index="${i}" value="${escapeHtml(ach.date)}" placeholder="e.g. March 2025" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" data-ach-field="description" data-ach-index="${i}" value="${escapeHtml(ach.description)}" placeholder="Brief description..." />
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-achievement">+ Add Achievement</button>
    </div>
  `;
}

function renderLeadershipForm(data, isActive) {
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="leadership">
      <h2 class="form-section-title">👑 Leadership & Initiatives</h2>
      <p class="form-section-desc">Club activities, volunteer work, or leadership roles. Optional section.</p>

      ${data.leadership.map((lead, i) => `
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Role #${i + 1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn lead-delete" data-index="${i}" title="Remove">✕</button>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role</label>
              <input type="text" class="form-input" data-lead-field="role" data-lead-index="${i}" value="${escapeHtml(lead.role)}" placeholder="e.g. Technical Lead" />
            </div>
            <div class="form-group">
              <label class="form-label">Organization</label>
              <input type="text" class="form-input" data-lead-field="organization" data-lead-index="${i}" value="${escapeHtml(lead.organization)}" placeholder="e.g. Amity Coding Club" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" class="form-input" data-lead-field="description" data-lead-index="${i}" value="${escapeHtml(lead.description)}" placeholder="What did you do?" />
            </div>
            <div class="form-group">
              <label class="form-label">Date / Duration</label>
              <input type="text" class="form-input" data-lead-field="date" data-lead-index="${i}" value="${escapeHtml(lead.date)}" placeholder="e.g. Jan 2024 – Present" />
            </div>
          </div>
        </div>
      `).join('')}

      <button class="add-entry-btn" id="btn-add-leadership">+ Add Leadership Role</button>
    </div>
  `;
}

function renderLinksForm(data, isActive) {
  const l = data.links;
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="links">
      <h2 class="form-section-title">🔗 Profile Links</h2>
      <p class="form-section-desc">Add your professional profile URLs. These will be clickable in the PDF.</p>

      <div class="form-group">
        <label class="form-label">GitHub</label>
        <input type="url" class="form-input" id="input-github" value="${escapeHtml(l.github)}" placeholder="https://github.com/yourusername" />
        <p class="form-hint">Copy the full URL from your browser address bar</p>
      </div>

      <div class="form-group">
        <label class="form-label">LinkedIn</label>
        <input type="url" class="form-input" id="input-linkedin" value="${escapeHtml(l.linkedin)}" placeholder="https://linkedin.com/in/yourusername" />
      </div>

      <div class="form-group">
        <label class="form-label">LeetCode</label>
        <input type="url" class="form-input" id="input-leetcode" value="${escapeHtml(l.leetcode)}" placeholder="https://leetcode.com/yourusername" />
      </div>

      <div class="form-group">
        <label class="form-label">Portfolio Website</label>
        <input type="url" class="form-input" id="input-portfolio" value="${escapeHtml(l.portfolio)}" placeholder="https://yourportfolio.com" />
      </div>

      <div class="form-group">
        <label class="form-label">Other Link</label>
        <input type="url" class="form-input" id="input-other-link" value="${escapeHtml(l.other)}" placeholder="https://..." />
      </div>
    </div>
  `;
}

function renderDeclarationForm(data, isActive) {
  const d = data.declaration;
  return `
    <div class="form-section ${isActive ? 'active' : ''}" data-form="declaration">
      <h2 class="form-section-title">📝 Declaration</h2>
      <p class="form-section-desc">Standard declaration for your resume. Only approved wording should be used.</p>

      <div class="form-group">
        <label class="form-label">Declaration Text</label>
        <textarea class="form-textarea" id="input-decl-text">${escapeHtml(d.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Place <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-decl-place" value="${escapeHtml(d.place)}" placeholder="e.g. Noida" />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="input-decl-date" value="${escapeHtml(d.date)}" />
        </div>
      </div>

      <!-- Validation Checklist -->
      <div class="card card--yellow mt-xl">
        <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:0.9rem;margin-bottom:var(--space-md);">📋 Pre-Export Checklist</h3>
        <ul class="checklist" id="validation-checklist"></ul>
      </div>
    </div>
  `;
}

// ============================================================
// PDF EXPORT
// ============================================================

async function exportPDF(store, toast) {
  const errors = store.validate();
  if (errors.length > 0) {
    toast.show(`Please fix ${errors.length} error(s) before exporting`, 'error');
    return;
  }

  toast.show('Generating PDF...', 'info');

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    
    const data = store.getData();
    
    // Create a standalone element for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = 'position:absolute;left:-9999px;top:0;';
    
    // Build a clean resume HTML for PDF
    pdfContainer.innerHTML = buildPDFContent(data);
    document.body.appendChild(pdfContainer);

    const element = pdfContainer.querySelector('.pdf-resume');

    const opt = {
      margin: 0,
      filename: `${data.personal.fullName || 'Resume'}_ur-CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    await html2pdf().set(opt).from(element).save();
    
    document.body.removeChild(pdfContainer);
    toast.show('PDF exported successfully!', 'success');
  } catch (err) {
    console.error('PDF export error:', err);
    toast.show('PDF export failed. Please try again.', 'error');
  }
}

function buildPDFContent(data) {
  const p = data.personal;
  const a = data.academic;
  const links = data.links;

  const linkEntries = [];
  if (links.github) linkEntries.push(`<a href="${escapeHtml(links.github)}" style="color:#0066CC;">GitHub</a>`);
  if (links.linkedin) linkEntries.push(`<a href="${escapeHtml(links.linkedin)}" style="color:#0066CC;">LinkedIn</a>`);
  if (links.leetcode) linkEntries.push(`<a href="${escapeHtml(links.leetcode)}" style="color:#0066CC;">LeetCode</a>`);
  if (links.portfolio) linkEntries.push(`<a href="${escapeHtml(links.portfolio)}" style="color:#0066CC;">Portfolio</a>`);
  if (links.other) linkEntries.push(`<a href="${escapeHtml(links.other)}" style="color:#0066CC;">Other</a>`);

  return `
    <div class="pdf-resume" style="width:210mm;min-height:297mm;padding:15mm 20mm;font-family:'Times New Roman',Times,serif;font-size:11pt;color:#000;background:#fff;line-height:1.4;">
      <!-- Header -->
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:12px;position:relative;">
        ${p.photo ? `<img src="${p.photo}" style="width:80px;height:100px;object-fit:cover;border:1px solid #000;position:absolute;right:0;top:0;" />` : ''}
        <div style="font-size:20pt;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${escapeHtml(p.fullName || 'Your Name')}</div>
        <div style="font-size:9pt;color:#333;">
          ${[p.email, p.phone, [p.city, p.state].filter(Boolean).join(', ')].filter(Boolean).join(' | ')}
        </div>
        ${linkEntries.length > 0 ? `<div style="margin-top:4px;font-size:9pt;">${linkEntries.join(' | ')}</div>` : ''}
      </div>

      <!-- Education -->
      ${a.degree ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Education</div>
          <div style="display:flex;justify-content:space-between;font-weight:700;">
            <span>${escapeHtml(a.degree)}${a.specialization ? ` — ${escapeHtml(a.specialization)}` : ''}</span>
            <span>${escapeHtml(a.graduationYear)}</span>
          </div>
          <div style="font-style:italic;color:#444;font-size:10pt;">
            ${escapeHtml(a.university)}${a.cgpa ? ` | CGPA: ${escapeHtml(a.cgpa)}` : ''}
          </div>
          ${a.relevantCoursework ? `<div style="font-size:9pt;margin-top:3px;"><strong>Coursework:</strong> ${escapeHtml(a.relevantCoursework)}</div>` : ''}
        </div>
      ` : ''}

      <!-- Experience -->
      ${data.experience.length > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Experience</div>
          ${data.experience.map((exp) => `
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>${escapeHtml(exp.title)}</span>
                <span style="font-size:9pt;">${escapeHtml(exp.startDate)}${exp.endDate ? ` – ${escapeHtml(exp.endDate)}` : exp.current ? ' – Present' : ''}</span>
              </div>
              <div style="font-style:italic;color:#444;font-size:10pt;">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
              ${exp.bullets.filter(Boolean).length > 0 ? `
                <ul style="list-style:disc;padding-left:18px;font-size:10pt;margin-top:3px;">
                  ${exp.bullets.filter(Boolean).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Projects -->
      ${data.projects.length > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Projects</div>
          ${data.projects.map((proj) => `
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>${escapeHtml(proj.name)}${proj.techStack ? ` <span style="font-weight:400;font-size:9pt;">[${escapeHtml(proj.techStack)}]</span>` : ''}</span>
                <span style="font-size:9pt;">${escapeHtml(proj.startDate)}${proj.endDate ? ` – ${escapeHtml(proj.endDate)}` : ''}</span>
              </div>
              ${proj.link ? `<div style="font-size:9pt;"><a href="${escapeHtml(proj.link)}" style="color:#0066CC;">${escapeHtml(proj.link)}</a></div>` : ''}
              ${proj.bullets.filter(Boolean).length > 0 ? `
                <ul style="list-style:disc;padding-left:18px;font-size:10pt;margin-top:3px;">
                  ${proj.bullets.filter(Boolean).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${Object.values(data.skills).some((arr) => arr.length > 0) ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Technical Skills</div>
          <table style="width:100%;font-size:10pt;">
            ${data.skills.languages.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Languages:</td><td>${data.skills.languages.map(escapeHtml).join(', ')}</td></tr>` : ''}
            ${data.skills.frameworks.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Frameworks:</td><td>${data.skills.frameworks.map(escapeHtml).join(', ')}</td></tr>` : ''}
            ${data.skills.tools.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Tools:</td><td>${data.skills.tools.map(escapeHtml).join(', ')}</td></tr>` : ''}
            ${data.skills.databases.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Databases:</td><td>${data.skills.databases.map(escapeHtml).join(', ')}</td></tr>` : ''}
            ${data.skills.other.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Other:</td><td>${data.skills.other.map(escapeHtml).join(', ')}</td></tr>` : ''}
          </table>
        </div>
      ` : ''}

      <!-- Achievements -->
      ${data.achievements.length > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Achievements & Certifications</div>
          <ul style="list-style:disc;padding-left:18px;font-size:10pt;">
            ${data.achievements.map((ach) => `
              <li><strong>${escapeHtml(ach.title)}</strong>${ach.date ? ` (${escapeHtml(ach.date)})` : ''}${ach.description ? ` — ${escapeHtml(ach.description)}` : ''}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Leadership -->
      ${data.leadership.length > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Leadership & Initiatives</div>
          ${data.leadership.map((lead) => `
            <div style="margin-bottom:6px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                <span>${escapeHtml(lead.role)}${lead.organization ? ` — ${escapeHtml(lead.organization)}` : ''}</span>
                <span>${escapeHtml(lead.date)}</span>
              </div>
              ${lead.description ? `<div style="font-size:10pt;">${escapeHtml(lead.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Declaration -->
      ${data.declaration.text ? `
        <div style="margin-top:20px;font-size:9pt;font-style:italic;color:#555;">
          <div style="font-weight:700;font-style:normal;margin-bottom:4px;">Declaration</div>
          <p>${escapeHtml(data.declaration.text)}</p>
          <div style="margin-top:10px;">
            ${data.declaration.place ? `<div>Place: ${escapeHtml(data.declaration.place)}</div>` : ''}
            ${data.declaration.date ? `<div>Date: ${escapeHtml(data.declaration.date)}</div>` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================
// UTILS
// ============================================================

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
