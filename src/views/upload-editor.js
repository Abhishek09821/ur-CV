/**
 * Upload Editor View — Universal Quick Resume Editor for ANY Template
 *
 * Focuses strictly on:
 * 1. Career Objective / Summary
 * 2. Technical Skills
 * 3. Work Experience / Internships
 *
 * The original header, layout, styling, and static sections are preserved 100%.
 * Features Live 1-Page Space Budget Gauges & Overflow Warnings.
 * Preview is hidden by default and shown on demand via "Preview Resume".
 */

export function renderUploadEditor({ engine, toast, onBack }) {
  const container = document.createElement('div');
  container.className = 'upload-editor-container';

  let currentData = engine.getData();
  let isPreviewOpen = false;
  let zoomLevel = 1.0;

  function getGlobalHealth() {
    const objCap = engine.getSectionCapacity('objective');
    const skillsCap = engine.getSectionCapacity('skills');
    const expCap = engine.getSectionCapacity('experience');

    const totalExcess = (objCap.excessLines || 0) + (skillsCap.excessLines || 0) + (expCap.excessLines || 0);
    const anyExceeded = objCap.isExceeded || skillsCap.isExceeded || expCap.isExceeded;

    return {
      anyExceeded,
      totalExcess,
      objCap,
      skillsCap,
      expCap,
    };
  }

  function renderSpaceGaugeHTML(sectionType) {
    const cap = engine.getSectionCapacity(sectionType);
    const isExceeded = cap.isExceeded;
    const pct = Math.min(150, cap.percentUsed);

    if (isExceeded) {
      return `
        <div class="space-limit-alert" id="gauge-${sectionType}">
          <div class="space-alert-header">
            <span class="space-alert-icon">⚠️</span>
            <strong class="space-alert-title">Space Limit Exceeded (+${cap.excessLines} lines)</strong>
            <span class="space-alert-badge">${cap.currentLines}/${cap.maxLines} lines (${cap.percentUsed}%)</span>
          </div>
          <div class="space-bar-track">
            <div class="space-bar-fill exceeded" style="width: 100%"></div>
          </div>
          <p class="space-alert-desc">
            In a 1-page resume, excess text will not fit in this section without spilling. Please shorten by ~${cap.excessWords} words or remove a bullet to maintain single-page layout.
          </p>
        </div>
      `;
    }

    return `
      <div class="space-limit-ok" id="gauge-${sectionType}">
        <div class="flex items-center justify-between text-xs mb-xs">
          <span class="flex items-center gap-xs font-bold" style="color: #15803d;">
            <span>✓</span> Fits 1-page layout
          </span>
          <span class="font-bold" style="color: #4b5563;">
            ${cap.currentLines} / ${cap.maxLines} lines used (${cap.percentUsed}%)
          </span>
        </div>
        <div class="space-bar-track">
          <div class="space-bar-fill ${pct > 85 ? 'warning' : 'ok'}" style="width: ${Math.min(100, pct)}%"></div>
        </div>
      </div>
    `;
  }

  function renderView() {
    const health = getGlobalHealth();
    const layout = currentData.detectedLayout || {};
    const pageLabel = currentData.numPages === 1 ? '1-PAGE RESUME' : `${currentData.numPages}-PAGE RESUME`;
    const fontLabel = layout.isSerif ? 'SERIF FONT' : 'SANS-SERIF FONT';
    const formatLabel = layout.formatStyle === 'ats_latex' ? 'ATS FORMAT' : 'STANDARD FORMAT';

    container.innerHTML = `
      <!-- Editor Top Bar -->
      <div class="upload-editor-topbar">
        <div class="topbar-left">
          <button type="button" class="btn btn--sm btn--white" id="btn-editor-back" title="Back to Home">
            &larr; Back
          </button>
          <div class="doc-badge-group">
            <span class="doc-title" title="${escapeHtml(currentData.fileName)}">
              📄 ${escapeHtml(currentData.fileName)}
            </span>
            <span class="badge badge--black doc-badge">${pageLabel}</span>
            <span class="badge badge--blue doc-badge">${formatLabel}</span>
            <span class="badge badge--white doc-badge">${fontLabel}</span>
            <span class="badge ${health.anyExceeded ? 'badge--red' : 'badge--green'} doc-badge" id="topbar-space-status">
              ${health.anyExceeded ? `⚠️ EXCEEDS 1-PAGE LIMIT (+${health.totalExcess} LINES)` : '✓ FITS 1 PAGE CLEANLY'}
            </span>
          </div>
        </div>

        <div class="topbar-actions">
          <button type="button" class="btn btn--sm btn--purple" id="btn-open-preview">
            👁️ Preview Resume
          </button>
          <button type="button" class="btn btn--sm btn--green" id="btn-editor-download">
            ⬇️ Download PDF
          </button>
        </div>
      </div>

      <!-- Editor Main Layout: Form Focused -->
      <div class="upload-editor-body">
        <div class="upload-editor-content">
          <div class="upload-editor-intro">
            <h2>Quick Resume Editor</h2>
            <p>
              Your original resume layout, fonts, header, and static sections are protected. Edit your
              <strong>Career Objective</strong>, <strong>Technical Skills</strong>, and <strong>Experience</strong>
              below. Live space limit gauges will warn you if content exceeds available 1-page space.
            </p>
          </div>

          <!-- Section 1: Career Objective / Summary -->
          <div class="card card--yellow editor-section-card" id="card-objective">
            <div class="section-card-header">
              <div class="flex items-center gap-xs">
                <span class="section-icon">🎯</span>
                <span class="section-title">Career Objective &amp; Summary</span>
              </div>
              <span class="badge badge--yellow" id="obj-char-count">
                ${(currentData.objective || '').length} chars
              </span>
            </div>
            <div class="section-card-body">
              <p class="form-hint mb-xs">
                Refine your professional career summary or objective for target roles.
              </p>

              <div id="gauge-container-objective">
                ${renderSpaceGaugeHTML('objective')}
              </div>

              <textarea 
                class="form-textarea input-objective" 
                id="input-objective-text" 
                rows="5" 
                placeholder="Enter your career objective or professional summary..."
              >${escapeHtml(currentData.objective || '')}</textarea>
            </div>
          </div>

          <!-- Section 2: Technical Skills -->
          <div class="card card--blue editor-section-card" id="card-skills">
            <div class="section-card-header">
              <div class="flex items-center gap-xs">
                <span class="section-icon">💻</span>
                <span class="section-title">Technical Skills</span>
              </div>
              <span class="badge badge--blue" id="skills-cat-count">
                ${(currentData.skills || []).length} categories
              </span>
            </div>
            <div class="section-card-body">
              <p class="form-hint mb-xs">
                Organize your skills by domain (e.g. Programming, Web Dev, Tools, Cloud).
              </p>

              <div id="gauge-container-skills">
                ${renderSpaceGaugeHTML('skills')}
              </div>
              
              <div class="skills-list" id="skills-items-container">
                ${renderSkillsInputs(currentData.skills)}
              </div>

              <div class="mt-sm">
                <button type="button" class="btn btn--sm btn--white" id="btn-add-skill-category">
                  + Add Skill Category
                </button>
              </div>
            </div>
          </div>

          <!-- Section 3: Work Experience -->
          <div class="card card--green editor-section-card" id="card-experience">
            <div class="section-card-header">
              <div class="flex items-center gap-xs">
                <span class="section-icon">💼</span>
                <span class="section-title">Work Experience &amp; Internships</span>
              </div>
              <span class="badge badge--green" id="exp-role-count">
                ${(currentData.experience || []).length} roles
              </span>
            </div>
            <div class="section-card-body">
              <p class="form-hint mb-xs">
                Edit job titles, companies, dates, and bullet points. Format and bullets match your original resume style.
              </p>

              <div id="gauge-container-experience">
                ${renderSpaceGaugeHTML('experience')}
              </div>

              <div class="experience-list" id="exp-items-container">
                ${renderExperienceInputs(currentData.experience)}
              </div>

              <div class="mt-sm">
                <button type="button" class="btn btn--sm btn--white" id="btn-add-experience">
                  + Add Experience / Role
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Sticky Bottom Toolbar -->
      <div class="upload-editor-mobile-bar">
        <button type="button" class="btn btn--purple btn--block btn-mobile-preview" id="btn-mobile-preview">
          👁️ Preview Resume
        </button>
        <button type="button" class="btn btn--green btn--block btn-mobile-download" id="btn-mobile-download">
          ⬇️ Download PDF
        </button>
      </div>

      <!-- Live Full-Screen Preview Overlay Modal (Shown on Demand) -->
      <div class="preview-overlay-modal ${isPreviewOpen ? 'active' : ''}" id="preview-modal-overlay">
        <div class="preview-modal-window">
          <div class="preview-modal-top">
            <div class="flex items-center gap-xs">
              <span class="badge badge--green">LIVE PREVIEW</span>
              <span class="preview-doc-name">${escapeHtml(currentData.fileName)}</span>
            </div>

            <div class="preview-modal-controls">
              <button type="button" class="btn btn--sm btn--white btn-zoom" id="btn-zoom-out" title="Zoom Out">&minus;</button>
              <span class="zoom-display" id="zoom-level-text">${Math.round(zoomLevel * 100)}%</span>
              <button type="button" class="btn btn--sm btn--white btn-zoom" id="btn-zoom-in" title="Zoom In">&plus;</button>
              <button type="button" class="btn btn--sm btn--green" id="btn-preview-download-direct">Download PDF</button>
              <button type="button" class="btn btn--sm btn--red" id="btn-close-preview" title="Close Preview">&times; Close</button>
            </div>
          </div>

          <div id="modal-overflow-banner-slot"></div>

          <div class="preview-modal-viewport" id="preview-modal-viewport">
            <div class="preview-canvas-holder" id="preview-canvas-holder" style="transform: scale(${zoomLevel}); transform-origin: top center;">
              <!-- Rendered canvases inserted here -->
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderSkillsInputs(skills) {
    if (!skills || skills.length === 0) {
      return `
        <div class="empty-section-hint">
          No skills detected. Click "+ Add Skill Category" to add your skills.
        </div>
      `;
    }

    return skills
      .map(
        (item, idx) => `
        <div class="skill-row-card" data-idx="${idx}">
          <div class="skill-row-top">
            <input 
              type="text" 
              class="form-input skill-category-input" 
              data-idx="${idx}" 
              placeholder="Domain / Category (e.g. Programming Languages)" 
              value="${escapeHtml(item.category || '')}" 
            />
            <button type="button" class="btn btn--xs btn--red btn-remove-skill-category" data-idx="${idx}" title="Remove Category">
              &times;
            </button>
          </div>
          <textarea 
            class="form-textarea skill-content-input mt-xs" 
            data-idx="${idx}" 
            rows="2" 
            placeholder="Skills list (comma separated, e.g. Python, Java, JavaScript, C++)"
          >${escapeHtml(item.skills || '')}</textarea>
        </div>
      `
      )
      .join('');
  }

  function renderExperienceInputs(experience) {
    if (!experience || experience.length === 0) {
      return `
        <div class="empty-section-hint">
          No work experience entries detected. Click "+ Add Experience / Role" to add one.
        </div>
      `;
    }

    return experience
      .map(
        (exp, expIdx) => `
        <div class="experience-entry-card" data-exp-idx="${expIdx}">
          <div class="exp-entry-header">
            <span class="exp-number">Role #${expIdx + 1}</span>
            <button type="button" class="btn btn--xs btn--red btn-remove-experience" data-exp-idx="${expIdx}" title="Delete Role">
              Delete Role
            </button>
          </div>

          <div class="grid grid-3 gap-xs mt-xs">
            <div class="form-group">
              <label class="form-label-sm">Role / Job Title</label>
              <input 
                type="text" 
                class="form-input exp-title-input" 
                data-exp-idx="${expIdx}" 
                placeholder="Software Engineer Intern" 
                value="${escapeHtml(exp.title || '')}" 
              />
            </div>
            <div class="form-group">
              <label class="form-label-sm">Company / Organization</label>
              <input 
                type="text" 
                class="form-input exp-company-input" 
                data-exp-idx="${expIdx}" 
                placeholder="Google / Tech Corp" 
                value="${escapeHtml(exp.company || '')}" 
              />
            </div>
            <div class="form-group">
              <label class="form-label-sm">Duration / Dates</label>
              <input 
                type="text" 
                class="form-input exp-duration-input" 
                data-exp-idx="${expIdx}" 
                placeholder="May 2025 – Aug 2025" 
                value="${escapeHtml(exp.duration || '')}" 
              />
            </div>
          </div>

          <!-- Bullets -->
          <div class="exp-bullets-section mt-sm">
            <label class="form-label-sm">Bullet Points &amp; Achievements</label>
            <div class="exp-bullets-list" data-exp-idx="${expIdx}">
              ${(exp.bullets || [])
                .map(
                  (bullet, bIdx) => `
                <div class="bullet-row-item">
                  <span class="bullet-bullet-mark">&bull;</span>
                  <textarea 
                    class="form-textarea bullet-text-input" 
                    data-exp-idx="${expIdx}" 
                    data-b-idx="${bIdx}" 
                    rows="2" 
                    placeholder="Describe your achievement with impact and metrics..."
                  >${escapeHtml(bullet || '')}</textarea>
                  <button type="button" class="btn btn--xs btn--white btn-remove-bullet" data-exp-idx="${expIdx}" data-b-idx="${bIdx}" title="Remove Bullet">
                    &times;
                  </button>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="mt-xs">
              <button type="button" class="btn btn--xs btn--white btn-add-bullet" data-exp-idx="${expIdx}">
                + Add Bullet
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  function syncDataFromInputs() {
    // 1. Objective
    const objTextarea = container.querySelector('#input-objective-text');
    if (objTextarea) {
      currentData.objective = objTextarea.value;
      engine.updateObjective(currentData.objective);
    }

    // 2. Skills
    const skillCards = container.querySelectorAll('.skill-row-card');
    const newSkills = [];
    skillCards.forEach((card) => {
      const catInput = card.querySelector('.skill-category-input');
      const contentInput = card.querySelector('.skill-content-input');
      if (catInput || contentInput) {
        newSkills.push({
          category: catInput ? catInput.value.trim() : '',
          skills: contentInput ? contentInput.value.trim() : '',
        });
      }
    });
    currentData.skills = newSkills;
    engine.updateSkills(newSkills);

    // 3. Experience
    const expCards = container.querySelectorAll('.experience-entry-card');
    const newExp = [];
    expCards.forEach((card) => {
      const titleInput = card.querySelector('.exp-title-input');
      const companyInput = card.querySelector('.exp-company-input');
      const durationInput = card.querySelector('.exp-duration-input');
      const bulletInputs = card.querySelectorAll('.bullet-text-input');

      const bullets = [];
      bulletInputs.forEach((b) => {
        if (b.value.trim()) bullets.push(b.value.trim());
      });

      newExp.push({
        title: titleInput ? titleInput.value.trim() : '',
        company: companyInput ? companyInput.value.trim() : '',
        duration: durationInput ? durationInput.value.trim() : '',
        bullets: bullets.length > 0 ? bullets : [''],
      });
    });
    currentData.experience = newExp;
    engine.updateExperience(newExp);

    updateGaugesInPlace();
  }

  function updateGaugesInPlace() {
    const objHolder = container.querySelector('#gauge-container-objective');
    if (objHolder) objHolder.innerHTML = renderSpaceGaugeHTML('objective');

    const skillsHolder = container.querySelector('#gauge-container-skills');
    if (skillsHolder) skillsHolder.innerHTML = renderSpaceGaugeHTML('skills');

    const expHolder = container.querySelector('#gauge-container-experience');
    if (expHolder) expHolder.innerHTML = renderSpaceGaugeHTML('experience');

    const health = getGlobalHealth();
    const statusBadge = container.querySelector('#topbar-space-status');
    if (statusBadge) {
      if (health.anyExceeded) {
        statusBadge.className = 'badge badge--red doc-badge';
        statusBadge.textContent = `⚠️ EXCEEDS 1-PAGE LIMIT (+${health.totalExcess} LINES)`;
      } else {
        statusBadge.className = 'badge badge--green doc-badge';
        statusBadge.textContent = '✓ FITS 1 PAGE CLEANLY';
      }
    }
  }

  async function openPreview() {
    syncDataFromInputs();
    isPreviewOpen = true;

    const overlay = container.querySelector('#preview-modal-overlay');
    const holder = container.querySelector('#preview-canvas-holder');
    const bannerSlot = container.querySelector('#modal-overflow-banner-slot');
    if (!overlay || !holder) return;

    overlay.classList.add('active');
    holder.innerHTML = `
      <div class="preview-loading">
        <div class="spinner"></div>
        <p class="mt-sm font-bold">Rendering preview with your exact template...</p>
      </div>
    `;

    try {
      const pages = await engine.render();
      holder.innerHTML = '';
      pages.forEach((pageCanvas, i) => {
        const pageCard = document.createElement('div');
        pageCard.className = 'preview-sheet-frame';
        pageCard.innerHTML = `<div class="sheet-page-num">PAGE ${i + 1}</div>`;
        pageCard.appendChild(pageCanvas);
        holder.appendChild(pageCard);
      });

      // Show overflow banner if warnings exist
      if (bannerSlot) {
        const health = getGlobalHealth();
        if (health.anyExceeded) {
          const exceededNames = [];
          if (health.objCap.isExceeded) exceededNames.push(`Objective (+${health.objCap.excessLines} lines)`);
          if (health.skillsCap.isExceeded) exceededNames.push(`Skills (+${health.skillsCap.excessLines} lines)`);
          if (health.expCap.isExceeded) exceededNames.push(`Experience (+${health.expCap.excessLines} lines)`);

          bannerSlot.innerHTML = `
            <div class="preview-overflow-banner">
              <span>⚠️</span>
              <div>
                <strong>1-Page Space Limit Warning:</strong> Content in <em>${exceededNames.join(', ')}</em> exceeds available space.
                Text was protected to prevent overlapping next sections. Please trim in the editor to make all text fit cleanly.
              </div>
            </div>
          `;
        } else {
          bannerSlot.innerHTML = '';
        }
      }
    } catch (err) {
      console.error('Preview render error:', err);
      holder.innerHTML = `<div class="preview-error">Failed to render preview: ${escapeHtml(err.message)}</div>`;
    }
  }

  function closePreview() {
    isPreviewOpen = false;
    const overlay = container.querySelector('#preview-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  async function handleDownloadPDF() {
    syncDataFromInputs();
    const health = getGlobalHealth();

    if (health.anyExceeded) {
      const proceed = confirm(
        `Warning: Your edits exceed the 1-page section limit by ~${health.totalExcess} lines. To prevent overlapping headings, excess lines have been clipped. Do you want to download now anyway?`
      );
      if (!proceed) return;
    }

    if (toast) toast.show('Compiling high-quality PDF with preserved template...', 'info');

    try {
      await engine.exportPDF();
      if (toast) toast.show('Resume PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      if (toast) toast.show('Download failed: ' + err.message, 'error');
    }
  }

  function attachEvents() {
    // Back
    container.querySelector('#btn-editor-back')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    // Preview buttons (desktop topbar & mobile bar)
    container.querySelector('#btn-open-preview')?.addEventListener('click', openPreview);
    container.querySelector('#btn-mobile-preview')?.addEventListener('click', openPreview);

    // Download buttons
    container.querySelector('#btn-editor-download')?.addEventListener('click', handleDownloadPDF);
    container.querySelector('#btn-mobile-download')?.addEventListener('click', handleDownloadPDF);
    container.querySelector('#btn-preview-download-direct')?.addEventListener('click', handleDownloadPDF);

    // Close preview
    container.querySelector('#btn-close-preview')?.addEventListener('click', closePreview);

    // Zoom controls
    const holder = container.querySelector('#preview-canvas-holder');
    const zoomText = container.querySelector('#zoom-level-text');

    container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      zoomLevel = Math.min(2.0, zoomLevel + 0.15);
      if (holder) holder.style.transform = `scale(${zoomLevel})`;
      if (zoomText) zoomText.textContent = `${Math.round(zoomLevel * 100)}%`;
    });

    container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      zoomLevel = Math.max(0.4, zoomLevel - 0.15);
      if (holder) holder.style.transform = `scale(${zoomLevel})`;
      if (zoomText) zoomText.textContent = `${Math.round(zoomLevel * 100)}%`;
    });

    // Objective char count & dynamic gauge update
    const objTextarea = container.querySelector('#input-objective-text');
    const objCount = container.querySelector('#obj-char-count');
    if (objTextarea) {
      objTextarea.addEventListener('input', () => {
        if (objCount) objCount.textContent = `${objTextarea.value.length} chars`;
        syncDataFromInputs();
      });
    }

    // Add Skill Category
    container.querySelector('#btn-add-skill-category')?.addEventListener('click', () => {
      syncDataFromInputs();
      currentData.skills.push({ category: 'New Category', skills: '' });
      const skillsContainer = container.querySelector('#skills-items-container');
      if (skillsContainer) {
        skillsContainer.innerHTML = renderSkillsInputs(currentData.skills);
        attachDynamicEvents();
      }
      const countEl = container.querySelector('#skills-cat-count');
      if (countEl) countEl.textContent = `${currentData.skills.length} categories`;
      updateGaugesInPlace();
    });

    // Add Experience Role
    container.querySelector('#btn-add-experience')?.addEventListener('click', () => {
      syncDataFromInputs();
      currentData.experience.push({
        title: 'Job / Internship Title',
        company: 'Company Name',
        duration: 'Month Year – Present',
        bullets: ['Describe your impact and achievements...'],
      });
      const expContainer = container.querySelector('#exp-items-container');
      if (expContainer) {
        expContainer.innerHTML = renderExperienceInputs(currentData.experience);
        attachDynamicEvents();
      }
      const countEl = container.querySelector('#exp-role-count');
      if (countEl) countEl.textContent = `${currentData.experience.length} roles`;
      updateGaugesInPlace();
    });

    attachDynamicEvents();
  }

  function attachDynamicEvents() {
    // Listen to changes on all inputs inside dynamic lists
    container.querySelectorAll('.skills-list input, .skills-list textarea, .experience-list input, .experience-list textarea').forEach((el) => {
      el.oninput = () => {
        syncDataFromInputs();
      };
    });

    // Remove skill category
    container.querySelectorAll('.btn-remove-skill-category').forEach((btn) => {
      btn.onclick = () => {
        syncDataFromInputs();
        const idx = parseInt(btn.dataset.idx, 10);
        currentData.skills.splice(idx, 1);
        const skillsContainer = container.querySelector('#skills-items-container');
        if (skillsContainer) {
          skillsContainer.innerHTML = renderSkillsInputs(currentData.skills);
          attachDynamicEvents();
        }
        const countEl = container.querySelector('#skills-cat-count');
        if (countEl) countEl.textContent = `${currentData.skills.length} categories`;
        updateGaugesInPlace();
      };
    });

    // Remove experience role
    container.querySelectorAll('.btn-remove-experience').forEach((btn) => {
      btn.onclick = () => {
        syncDataFromInputs();
        const expIdx = parseInt(btn.dataset.expIdx, 10);
        currentData.experience.splice(expIdx, 1);
        const expContainer = container.querySelector('#exp-items-container');
        if (expContainer) {
          expContainer.innerHTML = renderExperienceInputs(currentData.experience);
          attachDynamicEvents();
        }
        const countEl = container.querySelector('#exp-role-count');
        if (countEl) countEl.textContent = `${currentData.experience.length} roles`;
        updateGaugesInPlace();
      };
    });

    // Add bullet to an experience
    container.querySelectorAll('.btn-add-bullet').forEach((btn) => {
      btn.onclick = () => {
        syncDataFromInputs();
        const expIdx = parseInt(btn.dataset.expIdx, 10);
        if (currentData.experience[expIdx]) {
          if (!currentData.experience[expIdx].bullets) currentData.experience[expIdx].bullets = [];
          currentData.experience[expIdx].bullets.push('');
          const expContainer = container.querySelector('#exp-items-container');
          if (expContainer) {
            expContainer.innerHTML = renderExperienceInputs(currentData.experience);
            attachDynamicEvents();
          }
          updateGaugesInPlace();
        }
      };
    });

    // Remove bullet
    container.querySelectorAll('.btn-remove-bullet').forEach((btn) => {
      btn.onclick = () => {
        syncDataFromInputs();
        const expIdx = parseInt(btn.dataset.expIdx, 10);
        const bIdx = parseInt(btn.dataset.bIdx, 10);
        if (currentData.experience[expIdx] && currentData.experience[expIdx].bullets) {
          currentData.experience[expIdx].bullets.splice(bIdx, 1);
          const expContainer = container.querySelector('#exp-items-container');
          if (expContainer) {
            expContainer.innerHTML = renderExperienceInputs(currentData.experience);
            attachDynamicEvents();
          }
          updateGaugesInPlace();
        }
      };
    });
  }

  renderView();
  return container;
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
