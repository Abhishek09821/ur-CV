/**
 * Upload Editor View — Universal Quick Resume Editor for ANY Template
 *
 * Focuses strictly on the 3 user-editable sections:
 * 1. Career Objective / Summary
 * 2. Technical Skills
 * 3. Work Experience / Internships
 *
 * Zero over-parsing: Text is preserved in full fidelity without synthetic field butchering.
 * Non-destructive: Untouched sections stay 100% original PDF vector pixels (DITTO).
 * Features Live Space Budget Gauges & Overflow Warnings.
 * Preview is shown on demand via "Preview Resume" and allows instant PDF download.
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
            <strong class="space-alert-title">Space Limit Exceeded (+${cap.excessLines} lines)</strong>
            <span class="space-alert-badge">${cap.currentLines}/${cap.maxLines} lines (${cap.percentUsed}%)</span>
          </div>
          <div class="space-bar-track">
            <div class="space-bar-fill exceeded" style="width: 100%"></div>
          </div>
          <p class="space-alert-desc">
            In this section, excess text will not fit without spilling or clipping. Please shorten by ~${cap.excessWords} words or remove a line to maintain clean formatting.
          </p>
        </div>
      `;
    }

    return `
      <div class="space-limit-ok" id="gauge-${sectionType}">
        <div class="flex items-center justify-between text-xs mb-xs">
          <span class="flex items-center gap-xs font-bold" style="color: #15803d;">
            Fits section cleanly
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
              ${escapeHtml(currentData.fileName)}
            </span>
            <span class="badge badge--black doc-badge">${pageLabel}</span>
            <span class="badge badge--blue doc-badge">${formatLabel}</span>
            <span class="badge badge--white doc-badge">${fontLabel}</span>
            <span class="badge ${health.anyExceeded ? 'badge--red' : 'badge--green'} doc-badge" id="topbar-space-status">
              ${health.anyExceeded ? `EXCEEDS SPACE LIMIT (+${health.totalExcess} LINES)` : 'FITS RESUME CLEANLY'}
            </span>
          </div>
        </div>

        <div class="topbar-actions">
          <button type="button" class="btn btn--sm btn--purple" id="btn-open-preview">
            Preview Resume
          </button>
          <button type="button" class="btn btn--sm btn--green" id="btn-editor-download">
            Download PDF
          </button>
        </div>
      </div>

      <!-- Editor Main Layout: Form Focused -->
      <div class="upload-editor-body">
        <div class="upload-editor-content">
          <div class="upload-editor-intro">
            <h2>Quick Resume Editor</h2>
            <p>
              Your original resume layout, fonts, header, and static sections are protected 100%. Edit your
              <strong>Career Objective</strong>, <strong>Technical Skills</strong>, and <strong>Experience</strong>
              below. Live space limit gauges will warn you if content exceeds available space.
            </p>
          </div>

          <!-- Section 1: Career Objective / Summary -->
          <div class="card card--yellow editor-section-card" id="card-objective">
            <div class="section-card-header">
              <div class="flex items-center gap-xs">
                <span class="section-title">Career Objective &amp; Professional Summary</span>
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
                <span class="section-title">Technical Skills</span>
              </div>
              <span class="badge badge--blue" id="skills-line-count">
                ${(currentData.skillsText || '').split('\n').filter((l) => l.trim()).length} skill lines
              </span>
            </div>
            <div class="section-card-body">
              <p class="form-hint mb-xs">
                Each line represents a category and skills (e.g. <code>Languages: Python, C, C++, SQL</code>) or a bullet item (e.g. <code>• Web Dev: React, Node.js</code>).
              </p>

              <div id="gauge-container-skills">
                ${renderSpaceGaugeHTML('skills')}
              </div>
              
              <textarea 
                class="form-textarea input-skills" 
                id="input-skills-text" 
                rows="8" 
                placeholder="Languages: Python, C++, SQL&#10;Web Development: React, Node.js, Express&#10;Databases: PostgreSQL, MongoDB"
              >${escapeHtml(currentData.skillsText || '')}</textarea>
            </div>
          </div>

          <!-- Section 3: Work Experience -->
          <div class="card card--green editor-section-card" id="card-experience">
            <div class="section-card-header">
              <div class="flex items-center gap-xs">
                <span class="section-title">Work Experience &amp; Internships</span>
              </div>
              <span class="badge badge--green" id="exp-line-count">
                ${(currentData.experienceText || '').split('\n').filter((l) => l.trim()).length} lines
              </span>
            </div>
            <div class="section-card-body">
              <p class="form-hint mb-xs">
                Edit job titles, companies, dates, and bullet points. Format headers (e.g. <code>Job Title | Dates</code>) and bullet points (e.g. <code>• Built responsive web interfaces...</code>) freely.
              </p>

              <div id="gauge-container-experience">
                ${renderSpaceGaugeHTML('experience')}
              </div>

              <textarea 
                class="form-textarea input-experience" 
                id="input-experience-text" 
                rows="12" 
                placeholder="Software Engineer Intern | June 2024 – Aug 2024&#10;Google | Mountain View, CA&#10;• Developed full-stack features using React and Node.js&#10;• Improved API response latency by 35%"
              >${escapeHtml(currentData.experienceText || '')}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Sticky Bottom Toolbar -->
      <div class="upload-editor-mobile-bar">
        <button type="button" class="btn btn--purple btn--block btn-mobile-preview" id="btn-mobile-preview">
          Preview Resume
        </button>
        <button type="button" class="btn btn--green btn--block btn-mobile-download" id="btn-mobile-download">
          Download PDF
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
            <div class="preview-modal-ctrls">
              <button type="button" class="btn btn--xs btn--white" id="btn-zoom-out" title="Zoom Out">-</button>
              <span class="zoom-level-text" id="zoom-level-val">${Math.round(zoomLevel * 100)}%</span>
              <button type="button" class="btn btn--xs btn--white" id="btn-zoom-in" title="Zoom In">+</button>
              <button type="button" class="btn btn--xs btn--green" id="btn-preview-download">
                DOWNLOAD PDF
              </button>
              <button type="button" class="btn btn--xs btn--red" id="btn-close-preview">
                CLOSE
              </button>
            </div>
          </div>

          <!-- Dynamic Space Warning Banner in Preview -->
          <div id="preview-overflow-banner-container">
            ${renderPreviewOverflowBanner()}
          </div>

          <div class="preview-modal-canvas-viewport" id="preview-canvas-viewport">
            <div class="preview-canvas-wrapper" id="preview-canvas-wrapper" style="transform: scale(${zoomLevel}); transform-origin: top center;">
              <!-- Rendered canvas elements inserted dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;

    attachListeners();
  }

  function renderPreviewOverflowBanner() {
    const health = getGlobalHealth();
    if (!health.anyExceeded) return '';

    const exceededSections = [];
    if (health.objCap.isExceeded) exceededSections.push(`Objective (+${health.objCap.excessLines} lines)`);
    if (health.skillsCap.isExceeded) exceededSections.push(`Skills (+${health.skillsCap.excessLines} lines)`);
    if (health.expCap.isExceeded) exceededSections.push(`Experience (+${health.expCap.excessLines} lines)`);

    return `
      <div class="preview-overflow-banner">
        <span class="badge badge--red">SPACE LIMIT</span>
        <div class="preview-overflow-text">
          <strong>Notice:</strong> Content in <em>${exceededSections.join(', ')}</em> exceeds available space. Excess text was clipped cleanly to protect other sections. Shorten in the editor to make all text fit cleanly.
        </div>
      </div>
    `;
  }

  function updateGaugesLive() {
    const health = getGlobalHealth();

    // Objective gauge
    const objGaugeEl = container.querySelector('#gauge-container-objective');
    if (objGaugeEl) objGaugeEl.innerHTML = renderSpaceGaugeHTML('objective');

    // Skills gauge
    const skillsGaugeEl = container.querySelector('#gauge-container-skills');
    if (skillsGaugeEl) skillsGaugeEl.innerHTML = renderSpaceGaugeHTML('skills');

    // Experience gauge
    const expGaugeEl = container.querySelector('#gauge-container-experience');
    if (expGaugeEl) expGaugeEl.innerHTML = renderSpaceGaugeHTML('experience');

    // Top bar status
    const topStatusEl = container.querySelector('#topbar-space-status');
    if (topStatusEl) {
      topStatusEl.className = `badge ${health.anyExceeded ? 'badge--red' : 'badge--green'} doc-badge`;
      topStatusEl.textContent = health.anyExceeded
        ? `EXCEEDS SPACE LIMIT (+${health.totalExcess} LINES)`
        : 'FITS RESUME CLEANLY';
    }

    // Modal banner
    const bannerEl = container.querySelector('#preview-overflow-banner-container');
    if (bannerEl) bannerEl.innerHTML = renderPreviewOverflowBanner();
  }

  function attachListeners() {
    // Back button
    container.querySelector('#btn-editor-back')?.addEventListener('click', () => {
      if (onBack) onBack();
    });

    // Objective textarea
    const objTextarea = container.querySelector('#input-objective-text');
    if (objTextarea) {
      objTextarea.addEventListener('input', (e) => {
        currentData.objective = e.target.value;
        engine.updateObjective(currentData.objective);
        const countEl = container.querySelector('#obj-char-count');
        if (countEl) countEl.textContent = `${currentData.objective.length} chars`;
        updateGaugesLive();
      });
    }

    // Skills textarea
    const skillsTextarea = container.querySelector('#input-skills-text');
    if (skillsTextarea) {
      skillsTextarea.addEventListener('input', (e) => {
        currentData.skillsText = e.target.value;
        engine.updateSkillsText(currentData.skillsText);
        const lineCount = currentData.skillsText.split('\n').filter((l) => l.trim()).length;
        const countEl = container.querySelector('#skills-line-count');
        if (countEl) countEl.textContent = `${lineCount} skill lines`;
        updateGaugesLive();
      });
    }

    // Experience textarea
    const expTextarea = container.querySelector('#input-experience-text');
    if (expTextarea) {
      expTextarea.addEventListener('input', (e) => {
        currentData.experienceText = e.target.value;
        engine.updateExperienceText(currentData.experienceText);
        const lineCount = currentData.experienceText.split('\n').filter((l) => l.trim()).length;
        const countEl = container.querySelector('#exp-line-count');
        if (countEl) countEl.textContent = `${lineCount} lines`;
        updateGaugesLive();
      });
    }

    // Preview button (desktop & mobile)
    container.querySelector('#btn-open-preview')?.addEventListener('click', openPreview);
    container.querySelector('#btn-mobile-preview')?.addEventListener('click', openPreview);

    // Download button (desktop, mobile & modal)
    container.querySelector('#btn-editor-download')?.addEventListener('click', handleDownload);
    container.querySelector('#btn-mobile-download')?.addEventListener('click', handleDownload);
    container.querySelector('#btn-preview-download')?.addEventListener('click', handleDownload);

    // Close preview
    container.querySelector('#btn-close-preview')?.addEventListener('click', closePreview);
    const modalOverlay = container.querySelector('#preview-modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closePreview();
      });
    }

    // Zoom controls
    container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      zoomLevel = Math.min(2.0, zoomLevel + 0.15);
      applyZoom();
    });

    container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      zoomLevel = Math.max(0.4, zoomLevel - 0.15);
      applyZoom();
    });
  }

  function applyZoom() {
    const wrapper = container.querySelector('#preview-canvas-wrapper');
    const valText = container.querySelector('#zoom-level-val');
    if (wrapper) {
      wrapper.style.transform = `scale(${zoomLevel})`;
    }
    if (valText) {
      valText.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  async function openPreview() {
    isPreviewOpen = true;
    const modalEl = container.querySelector('#preview-modal-overlay');
    if (modalEl) modalEl.classList.add('active');

    // Re-render pages
    try {
      await engine.render();
      const wrapper = container.querySelector('#preview-canvas-wrapper');
      if (wrapper) {
        wrapper.innerHTML = '';
        for (let i = 0; i < engine.renderedPages.length; i++) {
          const pageCanvas = engine.renderedPages[i];
          const pageContainer = document.createElement('div');
          pageContainer.className = 'preview-page-canvas-card';

          const pageHeader = document.createElement('div');
          pageHeader.className = 'preview-page-header';
          pageHeader.textContent = `PAGE ${i + 1}`;
          pageContainer.appendChild(pageHeader);

          // Clone canvas visual presentation
          const displayCanvas = document.createElement('canvas');
          displayCanvas.width = pageCanvas.width;
          displayCanvas.height = pageCanvas.height;
          displayCanvas.style.width = '100%';
          displayCanvas.style.maxWidth = '850px';
          displayCanvas.style.height = 'auto';
          displayCanvas.style.display = 'block';
          displayCanvas.style.boxShadow = '0 8px 30px rgba(0,0,0,0.18)';
          displayCanvas.style.background = '#FFFFFF';

          const dctx = displayCanvas.getContext('2d');
          dctx.drawImage(pageCanvas, 0, 0);

          pageContainer.appendChild(displayCanvas);
          wrapper.appendChild(pageContainer);
        }
      }

      // Update overflow warning banner
      const bannerEl = container.querySelector('#preview-overflow-banner-container');
      if (bannerEl) bannerEl.innerHTML = renderPreviewOverflowBanner();
    } catch (e) {
      console.error('Error rendering preview:', e);
      if (toast) toast.show('Failed to render preview.', 'error');
    }
  }

  function closePreview() {
    isPreviewOpen = false;
    const modalEl = container.querySelector('#preview-modal-overlay');
    if (modalEl) modalEl.classList.remove('active');
  }

  async function handleDownload() {
    try {
      if (toast) toast.show('Generating high-resolution vector PDF...', 'info');
      await engine.exportPDF();
      if (toast) toast.show('PDF downloaded successfully!', 'success');
    } catch (e) {
      console.error('Download error:', e);
      if (toast) toast.show('Error generating PDF.', 'error');
    }
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

  // Initial render
  renderView();

  return container;
}
