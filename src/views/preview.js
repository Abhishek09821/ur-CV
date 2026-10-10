/**
 * Amity University Universal Placement Resume Template
 * EXACT DITTO REPLICA of the Official Placement PDF Reference
 * 
 * Features:
 * - Top Header: Official Amity University Shield Logo (Left) | Centered Name & Contact | Passport Photo (Right, max 1MB)
 * - Solid Charcoal Section Header Bars with crisp white text
 * - Fully Justified Typography (Times New Roman)
 * - Bulleted Academic Details (no tables)
 * - Structured Experience with Title | Company, Italic Duration, Justified Bullets
 * - Projects with Title, Tech Stack line, Justified Bullets
 * - Categorized Technical Skills bullets
 * - Awards & Achievements bullets
 * - Leadership & Initiative bullets
 * - Clickable Blue Underlined Links (LinkedIn, GitHub, LeetCode)
 * - Self Declaration with Date, Place, divider line, and Candidate Name
 */

import { AMITY_OFFICIAL_LOGO_DATA_URL } from '../assets/amity-assets.js';

export function renderPreview(data) {
  if (!data) return '';
  return `
    <div class="amity-resume-wrapper">
      <div class="amity-resume-sheet" id="amity-sheet-preview">
        ${buildAmityResumeHTML(data)}
      </div>
    </div>
  `;
}

/**
 * Generates the EXACT Amity University placement resume HTML
 */
export function buildAmityResumeHTML(data) {
  const p = data.personal || {};
  const academic = data.academic || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const awards = data.awards || [];
  const leadership = data.leadership || [];
  const links = data.links || [];
  const declaration = data.declaration || {};

  return `
    <div class="amity-resume-container">
      <!-- ================= HEADER ================= -->
      <header class="amity-header">
        <div class="amity-header-left">
          <img src="${AMITY_OFFICIAL_LOGO_DATA_URL}" class="amity-shield-logo" alt="Amity University Logo" />
        </div>

        <div class="amity-header-center">
          <h1 class="amity-candidate-name">${esc(p.fullName) || 'Abhishek Tiwari'}</h1>
          <div class="amity-candidate-contact-line"><strong>Address:</strong> ${esc(p.address || '')}</div>
          <div class="amity-candidate-contact-line"><strong>Phone:</strong> ${esc(p.phone || '')}</div>
          <div class="amity-candidate-contact-line">
            <strong>Email:</strong> ${p.email ? `<a href="mailto:${esc(p.email)}" class="amity-link-blue">${esc(p.email)}</a>` : ''}
          </div>
        </div>

        <div class="amity-header-right">
          ${p.photo ? `
            <img src="${p.photo}" class="amity-photo-box" alt="Candidate Photo" />
          ` : `
            <div class="amity-photo-box amity-photo-placeholder">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#777">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>PHOTO</span>
            </div>
          `}
        </div>
      </header>

      <!-- ================= CAREER OBJECTIVE ================= -->
      ${data.objective ? `
        <section class="amity-section">
          <div class="amity-bar">CAREER OBJECTIVE</div>
          <div class="amity-content">
            <p class="amity-text-justified">${esc(data.objective)}</p>
          </div>
        </section>
      ` : ''}

      <!-- ================= ACADEMIC DETAILS ================= -->
      ${academic.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">ACADEMIC DETAILS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${academic.map((item) => `<li>${esc(String(item).replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
            </ul>
          </div>
        </section>
      ` : ''}

      <!-- ================= EXPERIENCE ================= -->
      ${experience.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">EXPERIENCE</div>
          <div class="amity-content">
            ${experience.map((exp) => `
              <div class="amity-item">
                <div class="amity-item-title">
                  <strong>${esc(exp.title || '')}${exp.company ? ` | ${esc(exp.company)}` : ''}</strong>
                </div>
                ${exp.duration ? `<div class="amity-item-sub"><em>${esc(exp.duration)}</em></div>` : ''}
                ${exp.bullets && exp.bullets.filter(Boolean).length > 0 ? `
                  <ul class="amity-bullet-list">
                    ${exp.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- ================= PROJECTS ================= -->
      ${projects.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">PROJECTS</div>
          <div class="amity-content">
            ${projects.map((proj) => `
              <div class="amity-item">
                <div class="amity-item-title">
                  <strong>${esc(proj.name || '')}</strong>
                </div>
                ${proj.techStack ? `
                  <div class="amity-item-tech">
                    <strong>Tech Stack:</strong> ${esc(proj.techStack)}
                  </div>
                ` : ''}
                ${proj.bullets && proj.bullets.filter(Boolean).length > 0 ? `
                  <ul class="amity-bullet-list">
                    ${proj.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- ================= TECHNICAL SKILLS ================= -->
      ${skills.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">TECHNICAL SKILLS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${skills.map((s) => `
                <li><strong>${esc(s.category)}:</strong> ${esc(s.skills)}</li>
              `).join('')}
            </ul>
          </div>
        </section>
      ` : ''}

      <!-- ================= AWARDS AND ACHIEVEMENTS ================= -->
      ${awards.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">AWARDS AND ACHIEVEMENTS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${awards.map((a) => `<li>${esc(String(a).replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
            </ul>
          </div>
        </section>
      ` : ''}

      <!-- ================= LEADERSHIP & INITIATIVE ================= -->
      ${leadership.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">LEADERSHIP & INITIATIVE</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${leadership.map((lead) => `
                <li>${lead.title ? `<strong>${esc(lead.title)}:</strong> ` : ''}${esc(lead.description || '')}</li>
              `).join('')}
            </ul>
          </div>
        </section>
      ` : ''}

      <!-- ================= LINKS ================= -->
      ${links.length > 0 ? `
        <section class="amity-section">
          <div class="amity-bar">LINKS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${links.map((l) => `
                <li><a href="${esc(l.url)}" target="_blank" class="amity-link-blue">${esc(l.label || l.url)}</a></li>
              `).join('')}
            </ul>
          </div>
        </section>
      ` : ''}

      <!-- ================= SELF DECLARATION ================= -->
      ${declaration.text ? `
        <section class="amity-section amity-declaration-section">
          <div class="amity-bar">SELF DECLARATION</div>
          <div class="amity-content">
            <p class="amity-text-justified">${esc(declaration.text)}</p>
            <div class="amity-declaration-footer">
              <div class="amity-decl-left">
                ${declaration.date ? `<div><strong>Date:</strong> ${esc(declaration.date)}</div>` : ''}
                ${declaration.place ? `<div><strong>Place:</strong> ${esc(declaration.place)}</div>` : ''}
              </div>
              <div class="amity-decl-center-bar"></div>
              <div class="amity-decl-right">
                <strong>${esc(p.fullName || 'Abhishek Tiwari')}</strong>
              </div>
            </div>
          </div>
        </section>
      ` : ''}
    </div>
  `;
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
