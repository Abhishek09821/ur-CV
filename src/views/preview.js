/**
 * Resume Preview & Shared Template Renderer
 * 
 * Implements the Amity University placement-approved resume template:
 * - Locked header layout with university branding, student photo, name & contact info
 * - Distinctive dark navy section bars with gold accent
 * - Career Objective / Summary
 * - Standardized Academic Qualifications table
 * - Technical Skills, Work Experience / Internships, Projects
 * - Achievements, Leadership & Extracurriculars
 * - Clickable professional links with clean labels (GitHub, LinkedIn, LeetCode, Portfolio)
 * - Self Declaration with Date, Place & Signature block
 * 
 * Shared between the live interactive preview and PDF export engine.
 */

export function renderPreview(data) {
  const p = data.personal || {};
  const a = data.academic || {};

  const hasData = !!(p.fullName || p.email || a.degree || data.objective);

  if (!hasData) {
    return `
      <div class="resume-preview preview-empty">
        <div class="preview-placeholder">
          <div class="placeholder-crest">🎓</div>
          <div class="placeholder-title">AMITY UNIVERSITY RESUME TEMPLATE</div>
          <p class="placeholder-subtitle">Start filling your details in the editor to see your placement-ready resume preview live.</p>
          <div class="placeholder-tags">
            <span>✓ Placement Cell Approved</span>
            <span>✓ A4 Print Formatted</span>
            <span>✓ ATS Friendly</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="resume-preview" id="rendered-resume-preview">
      ${buildAmityResumeHTML(data)}
    </div>
  `;
}

/**
 * Shared source-of-truth HTML generator for both live preview & PDF export
 */
export function buildAmityResumeHTML(data) {
  const p = data.personal || {};
  const a = data.academic || {};
  const links = data.links || {};

  // Build clickable links list
  const linkItems = [];
  if (links.github) linkItems.push(`<a href="${esc(links.github)}" target="_blank" class="cv-link"><strong>GitHub</strong></a>`);
  if (links.linkedin) linkItems.push(`<a href="${esc(links.linkedin)}" target="_blank" class="cv-link"><strong>LinkedIn</strong></a>`);
  if (links.leetcode) linkItems.push(`<a href="${esc(links.leetcode)}" target="_blank" class="cv-link"><strong>LeetCode</strong></a>`);
  if (links.portfolio) linkItems.push(`<a href="${esc(links.portfolio)}" target="_blank" class="cv-link"><strong>Portfolio</strong></a>`);
  if (links.other) linkItems.push(`<a href="${esc(links.other)}" target="_blank" class="cv-link"><strong>Website</strong></a>`);

  const contactItems = [];
  if (p.email) contactItems.push(`<a href="mailto:${esc(p.email)}" class="cv-contact-link">${esc(p.email)}</a>`);
  if (p.phone) contactItems.push(`<span>${esc(p.phone)}</span>`);
  const location = [p.city, p.state].filter(Boolean).join(', ') || p.address;
  if (location) contactItems.push(`<span>${esc(location)}</span>`);

  return `
    <div class="amity-cv-document">
      <!-- ===== UNIVERSITY BRANDED HEADER ===== -->
      <div class="amity-cv-header">
        <div class="amity-cv-brand">
          <div class="amity-crest-box">
            <div class="amity-crest-shield">AU</div>
          </div>
          <div class="amity-brand-text">
            <div class="amity-brand-title">AMITY UNIVERSITY</div>
            <div class="amity-brand-sub">UTTAR PRADESH, INDIA</div>
          </div>
        </div>

        <div class="amity-candidate-main">
          <h1 class="amity-candidate-name">${esc(p.fullName) || 'STUDENT NAME'}</h1>
          ${a.degree ? `<div class="amity-candidate-degree">${esc(a.degree)}${a.specialization ? ` (${esc(a.specialization)})` : ''}</div>` : ''}
          <div class="amity-candidate-contact">
            ${contactItems.join('<span class="cv-sep">•</span>')}
          </div>
          ${linkItems.length > 0 ? `
            <div class="amity-candidate-links">
              ${linkItems.join('<span class="cv-sep">|</span>')}
            </div>
          ` : ''}
        </div>

        <div class="amity-photo-container">
          ${p.photo ? `
            <img src="${p.photo}" class="amity-passport-photo" alt="Passport Photo" />
          ` : `
            <div class="amity-photo-placeholder">
              <span>PHOTO</span>
            </div>
          `}
        </div>
      </div>

      <!-- ===== CAREER OBJECTIVE ===== -->
      ${data.objective ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>CAREER OBJECTIVE</span>
          </div>
          <div class="amity-section-body amity-objective-text">
            ${esc(data.objective)}
          </div>
        </div>
      ` : ''}

      <!-- ===== ACADEMIC QUALIFICATIONS ===== -->
      ${(a.degree || a.twelfthSchool || a.tenthSchool) ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>ACADEMIC DETAILS</span>
          </div>
          <div class="amity-section-body">
            <table class="amity-edu-table">
              <thead>
                <tr>
                  <th style="width: 28%;">Course / Degree</th>
                  <th style="width: 32%;">Institution</th>
                  <th style="width: 18%;">Board / University</th>
                  <th style="width: 10%;">Year</th>
                  <th style="width: 12%;">CGPA / %</th>
                </tr>
              </thead>
              <tbody>
                ${a.degree ? `
                  <tr>
                    <td><strong>${esc(a.degree)}</strong>${a.specialization ? `<br><small>${esc(a.specialization)}</small>` : ''}</td>
                    <td>${esc(a.university || 'Amity University')}</td>
                    <td>Amity University</td>
                    <td>${esc(a.graduationYear) || '—'}</td>
                    <td><strong>${esc(a.cgpa) || '—'}</strong></td>
                  </tr>
                ` : ''}
                ${a.twelfthSchool ? `
                  <tr>
                    <td>Class XII (Senior Secondary)</td>
                    <td>${esc(a.twelfthSchool)}</td>
                    <td>${esc(a.twelfthBoard || 'CBSE')}</td>
                    <td>${esc(a.twelfthYear || '—')}</td>
                    <td><strong>${esc(a.twelfthPercentage || '—')}</strong></td>
                  </tr>
                ` : ''}
                ${a.tenthSchool ? `
                  <tr>
                    <td>Class X (Secondary)</td>
                    <td>${esc(a.tenthSchool)}</td>
                    <td>${esc(a.tenthBoard || 'CBSE')}</td>
                    <td>${esc(a.tenthYear || '—')}</td>
                    <td><strong>${esc(a.tenthPercentage || '—')}</strong></td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
            ${a.relevantCoursework ? `
              <div class="amity-coursework">
                <strong>Relevant Coursework:</strong> ${esc(a.relevantCoursework)}
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- ===== TECHNICAL SKILLS ===== -->
      ${Object.values(data.skills || {}).some((arr) => arr && arr.length > 0) ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>TECHNICAL SKILLS</span>
          </div>
          <div class="amity-section-body">
            <table class="amity-skills-table">
              ${data.skills.languages && data.skills.languages.length > 0 ? `
                <tr>
                  <td class="skills-cat">Languages:</td>
                  <td class="skills-val">${data.skills.languages.map(esc).join(', ')}</td>
                </tr>
              ` : ''}
              ${data.skills.frameworks && data.skills.frameworks.length > 0 ? `
                <tr>
                  <td class="skills-cat">Frameworks & Libraries:</td>
                  <td class="skills-val">${data.skills.frameworks.map(esc).join(', ')}</td>
                </tr>
              ` : ''}
              ${data.skills.tools && data.skills.tools.length > 0 ? `
                <tr>
                  <td class="skills-cat">Developer Tools & Platforms:</td>
                  <td class="skills-val">${data.skills.tools.map(esc).join(', ')}</td>
                </tr>
              ` : ''}
              ${data.skills.databases && data.skills.databases.length > 0 ? `
                <tr>
                  <td class="skills-cat">Databases:</td>
                  <td class="skills-val">${data.skills.databases.map(esc).join(', ')}</td>
                </tr>
              ` : ''}
              ${data.skills.other && data.skills.other.length > 0 ? `
                <tr>
                  <td class="skills-cat">Areas of Interest / Other:</td>
                  <td class="skills-val">${data.skills.other.map(esc).join(', ')}</td>
                </tr>
              ` : ''}
            </table>
          </div>
        </div>
      ` : ''}

      <!-- ===== WORK EXPERIENCE & INTERNSHIPS ===== -->
      ${data.experience && data.experience.length > 0 ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>WORK EXPERIENCE / INTERNSHIPS</span>
          </div>
          <div class="amity-section-body">
            ${data.experience.map((exp) => `
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title">${esc(exp.title || 'Role')} — <em>${esc(exp.company || 'Company')}</em>${exp.location ? `, ${esc(exp.location)}` : ''}</span>
                  <span class="amity-entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                ${exp.bullets && exp.bullets.filter(Boolean).length > 0 ? `
                  <ul class="amity-entry-bullets">
                    ${exp.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ===== PROJECTS ===== -->
      ${data.projects && data.projects.length > 0 ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>PROJECTS</span>
          </div>
          <div class="amity-section-body">
            ${data.projects.map((proj) => `
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title">
                    <strong>${esc(proj.name || 'Project Name')}</strong>
                    ${proj.techStack ? `<span class="amity-tech-badge"> [${esc(proj.techStack)}]</span>` : ''}
                  </span>
                  <span class="amity-entry-date">${formatDateRange(proj.startDate, proj.endDate)}</span>
                </div>
                ${proj.link ? `
                  <div class="amity-proj-link">
                    <a href="${esc(proj.link)}" target="_blank" class="cv-link">🔗 ${esc(proj.link)}</a>
                  </div>
                ` : ''}
                ${proj.bullets && proj.bullets.filter(Boolean).length > 0 ? `
                  <ul class="amity-entry-bullets">
                    ${proj.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ===== ACHIEVEMENTS & CERTIFICATIONS ===== -->
      ${data.achievements && data.achievements.length > 0 ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>AWARDS & ACHIEVEMENTS</span>
          </div>
          <div class="amity-section-body">
            <ul class="amity-entry-bullets">
              ${data.achievements.map((ach) => `
                <li>
                  <strong>${esc(ach.title)}</strong>
                  ${ach.date ? ` (${esc(ach.date)})` : ''}
                  ${ach.description ? ` — ${esc(ach.description)}` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <!-- ===== LEADERSHIP & INITIATIVES ===== -->
      ${data.leadership && data.leadership.length > 0 ? `
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>LEADERSHIP & POSITIONS OF RESPONSIBILITY</span>
          </div>
          <div class="amity-section-body">
            ${data.leadership.map((lead) => `
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title"><strong>${esc(lead.role)}</strong>${lead.organization ? ` — ${esc(lead.organization)}` : ''}</span>
                  <span class="amity-entry-date">${esc(lead.date || '')}</span>
                </div>
                ${lead.description ? `<div class="amity-entry-desc">${esc(lead.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ===== SELF DECLARATION ===== -->
      ${data.declaration && data.declaration.text ? `
        <div class="amity-section amity-declaration-section">
          <div class="amity-section-bar">
            <span>DECLARATION</span>
          </div>
          <div class="amity-section-body">
            <p class="amity-decl-text">${esc(data.declaration.text)}</p>
            <div class="amity-decl-footer">
              <div class="amity-decl-left">
                ${data.declaration.place ? `<div><strong>Place:</strong> ${esc(data.declaration.place)}</div>` : ''}
                ${data.declaration.date ? `<div><strong>Date:</strong> ${esc(data.declaration.date)}</div>` : ''}
              </div>
              <div class="amity-decl-right">
                <div class="amity-signature-line"></div>
                <div class="amity-signature-name">${esc(p.fullName) || 'Candidate Signature'}</div>
              </div>
            </div>
          </div>
        </div>
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

function formatDateRange(start, end, current = false) {
  const parts = [];
  if (start) parts.push(formatMonth(start));
  if (current) {
    parts.push('Present');
  } else if (end) {
    parts.push(formatMonth(end));
  }
  return parts.join(' – ');
}

function formatMonth(yyyymm) {
  if (!yyyymm) return '';
  const [year, month] = yyyymm.split('-');
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month ? `${months[parseInt(month, 10)]} ${year}` : year;
}
