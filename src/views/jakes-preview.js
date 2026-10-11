/**
 * Jake's Resume Template — Overleaf / LaTeX Software Engineer Resume Standard
 * 100% ATS-Compliant, Single-Page Architecture with Elegant Typography
 */

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildJakesResumeHTML(data) {
  const p = data.personal || {};
  const academic = data.academic || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const awards = data.awards || [];
  const leadership = data.leadership || [];
  const links = data.links || [];

  return `
    <table class="amity-print-table">
      <thead class="amity-print-thead">
        <tr>
          <td><div class="amity-print-header-space"></div></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="jakes-resume-container">
              <!-- ================= 1. HEADER ================= -->
              <header class="jakes-header">
                <h1 class="jakes-candidate-name">${esc(p.fullName) || 'Abhishek Tiwari'}</h1>
                <div class="jakes-contact-line">
                  ${p.address ? `<span>${esc(p.address)}</span>` : ''}
                  ${p.phone ? `<span>${p.address ? ' | ' : ''}${esc(p.phone)}</span>` : ''}
                  ${p.email ? `<span>${(p.address || p.phone) ? ' | ' : ''}<a href="mailto:${esc(p.email)}" class="jakes-link">${esc(p.email)}</a></span>` : ''}
                </div>
                ${links.length > 0 ? `
                  <div class="jakes-links-line">
                    ${links.map((l, idx) => `<a href="${esc(l.url)}" target="_blank" class="jakes-link">${esc(l.label || l.url)}</a>`).join(' | ')}
                  </div>
                ` : ''}
              </header>

              <!-- ================= 2. PROFESSIONAL SUMMARY ================= -->
              ${data.objective ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">PROFESSIONAL SUMMARY</div>
                  <p class="jakes-text-justified">${esc(data.objective)}</p>
                </section>
              ` : ''}

              <!-- ================= 3. EDUCATION ================= -->
              ${academic.length > 0 ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">EDUCATION</div>
                  <div class="jakes-education-block">
                    ${academic.map((item) => `
                      <div class="jakes-education-line">
                        <span>${esc(String(item).replace(/^[•\-\*]\s*/, ''))}</span>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              <!-- ================= 4. PROFESSIONAL EXPERIENCE ================= -->
              ${experience.length > 0 ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">PROFESSIONAL EXPERIENCE</div>
                  ${experience.map((exp) => `
                    <div class="jakes-entry">
                      <div class="jakes-row">
                        <span class="jakes-entry-title">
                          <strong>${esc(exp.title || '')}</strong>${exp.company ? ` | <span>${esc(exp.company)}</span>` : ''}
                        </span>
                        ${exp.duration ? `<span class="jakes-entry-date">${esc(exp.duration)}</span>` : ''}
                      </div>
                      ${exp.bullets && exp.bullets.filter(Boolean).length > 0 ? `
                        <ul class="jakes-bullet-list">
                          ${exp.bullets.filter(Boolean).map((b) => `<li>${esc(String(b).replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>
                  `).join('')}
                </section>
              ` : ''}

              <!-- ================= 5. PROJECTS ================= -->
              ${projects.length > 0 ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">PROJECTS</div>
                  ${projects.map((proj) => `
                    <div class="jakes-entry">
                      <div class="jakes-row">
                        <span class="jakes-entry-title">
                          <strong>${esc(proj.name || '')}</strong>${proj.techStack ? ` <span class="jakes-tech-stack">${esc(proj.techStack)}</span>` : ''}
                        </span>
                      </div>
                      ${proj.bullets && proj.bullets.filter(Boolean).length > 0 ? `
                        <ul class="jakes-bullet-list">
                          ${proj.bullets.filter(Boolean).map((b) => `<li>${esc(String(b).replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
                        </ul>
                      ` : ''}
                    </div>
                  `).join('')}
                </section>
              ` : ''}

              <!-- ================= 6. TECHNICAL SKILLS ================= -->
              ${skills.length > 0 ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">TECHNICAL SKILLS</div>
                  <div class="jakes-skills-block">
                    ${skills.map((s) => `
                      <div class="jakes-skill-line">
                        <strong>${esc(s.category)}:</strong> ${esc(s.skills)}
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              <!-- ================= 7. CERTIFICATIONS & ACHIEVEMENTS ================= -->
              ${(awards.length > 0 || leadership.length > 0) ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">CERTIFICATIONS &amp; ACHIEVEMENTS</div>
                  <div class="jakes-awards-block">
                    ${awards.length > 0 ? `
                      <div class="jakes-award-line">
                        <strong>Certifications:</strong> ${awards.map((a) => esc(String(a).replace(/^[•\-\*]\s*/, ''))).join('; ')}.
                      </div>
                    ` : ''}
                    ${leadership.length > 0 ? `
                      <div class="jakes-award-line">
                        <strong>Achievements:</strong> ${leadership.map((lead) => `${lead.title ? `<strong>${esc(lead.title)}:</strong> ` : ''}${esc(lead.description || '')}`).join('; ')}.
                      </div>
                    ` : ''}
                  </div>
                </section>
              ` : ''}
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot class="amity-print-tfoot">
        <tr>
          <td><div class="amity-print-footer-space"></div></td>
        </tr>
      </tfoot>
    </table>
  `;
}
