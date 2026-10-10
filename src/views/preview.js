/**
 * Resume Preview — Live preview component rendered from store data.
 * Mimics the final PDF template as closely as possible.
 */

export function renderPreview(data) {
  const p = data.personal;
  const a = data.academic;
  const links = data.links;

  // Check if any data exists
  const hasData = p.fullName || p.email || a.degree;

  if (!hasData) {
    return `
      <div class="resume-preview" style="display:flex;align-items:center;justify-content:center;">
        <div class="preview-placeholder">
          <span class="placeholder-icon">📄</span>
          <h3>Your Resume Preview</h3>
          <p style="color:var(--text-muted);font-family:var(--font-body);">Start filling in your details on the left panel and watch your resume come alive here!</p>
        </div>
      </div>
    `;
  }

  // Build link entries
  const linkItems = [];
  if (links.github) linkItems.push(`<a href="${esc(links.github)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">GitHub</a>`);
  if (links.linkedin) linkItems.push(`<a href="${esc(links.linkedin)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">LinkedIn</a>`);
  if (links.leetcode) linkItems.push(`<a href="${esc(links.leetcode)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">LeetCode</a>`);
  if (links.portfolio) linkItems.push(`<a href="${esc(links.portfolio)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">Portfolio</a>`);
  if (links.other) linkItems.push(`<a href="${esc(links.other)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">Other</a>`);

  const contactParts = [p.email, p.phone, [p.city, p.state].filter(Boolean).join(', ')].filter(Boolean);

  return `
    <div class="resume-preview">
      <!-- ===== HEADER ===== -->
      <div class="resume-header" style="position:relative;">
        ${p.photo ? `<img src="${p.photo}" class="resume-photo" alt="Profile photo" />` : ''}
        <div class="resume-name">${esc(p.fullName) || 'Your Name'}</div>
        <div class="resume-contact">
          ${contactParts.map((c) => `<span>${esc(c)}</span>`).join('<span style="color:#999;">|</span>')}
        </div>
        ${linkItems.length > 0 ? `
          <div class="resume-links">
            ${linkItems.join('<span style="color:#999;font-size:9pt;"> | </span>')}
          </div>
        ` : ''}
      </div>

      <!-- ===== EDUCATION ===== -->
      ${a.degree ? `
        <div class="resume-section">
          <div class="resume-section-title">Education</div>
          <div class="resume-entry">
            <div class="resume-entry-header">
              <span>${esc(a.degree)}${a.specialization ? ` — ${esc(a.specialization)}` : ''}</span>
              <span style="font-size:10pt;">${esc(a.graduationYear)}</span>
            </div>
            <div class="resume-entry-sub">
              ${esc(a.university)}${a.cgpa ? ` | CGPA: ${esc(a.cgpa)}` : ''}
            </div>
            ${a.relevantCoursework ? `<div style="font-size:9pt;margin-top:3px;"><strong>Coursework:</strong> ${esc(a.relevantCoursework)}</div>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- ===== EXPERIENCE ===== -->
      ${data.experience.length > 0 ? `
        <div class="resume-section">
          <div class="resume-section-title">Experience</div>
          ${data.experience.map((exp) => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${esc(exp.title)}</span>
                <span style="font-size:9pt;">${formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
              </div>
              <div class="resume-entry-sub">${esc(exp.company)}${exp.location ? `, ${esc(exp.location)}` : ''}</div>
              ${exp.bullets.filter(Boolean).length > 0 ? `
                <ul class="resume-entry-bullets">
                  ${exp.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- ===== PROJECTS ===== -->
      ${data.projects.length > 0 ? `
        <div class="resume-section">
          <div class="resume-section-title">Projects</div>
          ${data.projects.map((proj) => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${esc(proj.name)}${proj.techStack ? ` <span style="font-weight:400;font-size:9pt;">[${esc(proj.techStack)}]</span>` : ''}</span>
                <span style="font-size:9pt;">${formatDateRange(proj.startDate, proj.endDate)}</span>
              </div>
              ${proj.link ? `<div style="font-size:9pt;"><a href="${esc(proj.link)}" target="_blank" style="color:#0066CC;">${esc(proj.link)}</a></div>` : ''}
              ${proj.bullets.filter(Boolean).length > 0 ? `
                <ul class="resume-entry-bullets">
                  ${proj.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- ===== SKILLS ===== -->
      ${Object.values(data.skills).some((arr) => arr.length > 0) ? `
        <div class="resume-section">
          <div class="resume-section-title">Technical Skills</div>
          <table style="width:100%;font-size:10pt;border-collapse:collapse;">
            ${data.skills.languages.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Languages:</td><td>${data.skills.languages.map(esc).join(', ')}</td></tr>` : ''}
            ${data.skills.frameworks.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Frameworks:</td><td>${data.skills.frameworks.map(esc).join(', ')}</td></tr>` : ''}
            ${data.skills.tools.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Tools:</td><td>${data.skills.tools.map(esc).join(', ')}</td></tr>` : ''}
            ${data.skills.databases.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Databases:</td><td>${data.skills.databases.map(esc).join(', ')}</td></tr>` : ''}
            ${data.skills.other.length > 0 ? `<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Other:</td><td>${data.skills.other.map(esc).join(', ')}</td></tr>` : ''}
          </table>
        </div>
      ` : ''}

      <!-- ===== ACHIEVEMENTS ===== -->
      ${data.achievements.length > 0 ? `
        <div class="resume-section">
          <div class="resume-section-title">Achievements & Certifications</div>
          <ul class="resume-entry-bullets">
            ${data.achievements.map((ach) => `
              <li><strong>${esc(ach.title)}</strong>${ach.date ? ` (${esc(ach.date)})` : ''}${ach.description ? ` — ${esc(ach.description)}` : ''}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- ===== LEADERSHIP ===== -->
      ${data.leadership.length > 0 ? `
        <div class="resume-section">
          <div class="resume-section-title">Leadership & Initiatives</div>
          ${data.leadership.map((lead) => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${esc(lead.role)}${lead.organization ? ` — ${esc(lead.organization)}` : ''}</span>
                <span style="font-size:9pt;">${esc(lead.date)}</span>
              </div>
              ${lead.description ? `<div style="font-size:10pt;">${esc(lead.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- ===== DECLARATION ===== -->
      ${data.declaration.text ? `
        <div class="resume-declaration">
          <strong style="font-style:normal;">Declaration</strong><br>
          ${esc(data.declaration.text)}
          <div style="margin-top:8px;">
            ${data.declaration.place ? `Place: ${esc(data.declaration.place)}<br>` : ''}
            ${data.declaration.date ? `Date: ${esc(data.declaration.date)}` : ''}
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
  return month ? `${months[parseInt(month)]} ${year}` : year;
}
