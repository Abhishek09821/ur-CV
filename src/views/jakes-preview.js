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

/**
 * Intelligent parser for academic qualifications
 * Guarantees that Institution / Board is rendered in BOLD
 * followed by Degree / Minor / Percentage in regular weight
 */
export function parseEducationItem(item) {
  if (!item) return { institution: '', details: '' };
  if (typeof item === 'object' && item.institution !== undefined) {
    return {
      institution: item.institution || '',
      details: item.details || item.score || item.degree || '',
    };
  }
  const str = String(item).replace(/^[•\-\*]\s*/, '').trim();

  // Pattern 1: Starts with Amity University ...
  if (/^Amity University Madhya Pradesh/i.test(str)) {
    const institution = 'Amity University Madhya Pradesh';
    const rest = str.slice(institution.length).replace(/^[\s–—\-:]+/, '').trim();
    return { institution, details: rest };
  }

  // Pattern 2: Senior Secondary (12th), CBSE
  const srMatch = str.match(/^(Senior Secondary\s*\(12th\)[^,\d%]*CBSE|Senior Secondary\s*\(12th\)|12th Board[^,\d%]*CBSE)/i);
  if (srMatch) {
    const institution = srMatch[1].trim();
    const rest = str.slice(srMatch[0].length).replace(/^[\s–—\-:,]+/, '').trim();
    return { institution, details: rest };
  }

  // Pattern 3: Secondary (10th), CBSE
  const secMatch = str.match(/^(Secondary\s*\(10th\)[^,\d%]*CBSE|Secondary\s*\(10th\)|10th Board[^,\d%]*CBSE)/i);
  if (secMatch) {
    const institution = secMatch[1].trim();
    const rest = str.slice(secMatch[0].length).replace(/^[\s–—\-:,]+/, '').trim();
    return { institution, details: rest };
  }

  // Pattern 4: Markdown bold **Institution** Details
  const boldMatch = str.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (boldMatch) {
    return { institution: boldMatch[1].trim(), details: boldMatch[2].trim() };
  }

  // Pattern 5: Separator by dash or colon
  if (str.includes(' – ') || str.includes(' - ') || str.includes(': ')) {
    const parts = str.split(/\s+[–\-:]\s+/);
    return { institution: parts[0].trim(), details: parts.slice(1).join(' - ').trim() };
  }

  // Pattern 6: Starts with BTech / B.Tech
  if (/^B\.?Tech/i.test(str)) {
    if (/amity/i.test(str)) {
      return {
        institution: 'Amity University Madhya Pradesh',
        details: str.replace(/^B\.?Tech[-–\s]*/i, 'B.Tech in Computer Science Engineering | '),
      };
    }
    if (str.includes('|')) {
      const parts = str.split('|').map((p) => p.trim());
      const inst = parts.find((p) => /university|college|institute|iit|nit|dtu|bits|school/i.test(p)) || parts[1] || parts[0];
      const rest = parts.filter((p) => p !== inst).join(' | ');
      return { institution: inst, details: rest };
    }
    return { institution: str, details: '' };
  }

  return { institution: str, details: '' };
}

export function buildJakesResumeHTML(data) {
  const p = data.personal || {};
  const academic = data.academic || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const awards = data.awards || [];
  const leadership = data.leadership || [];
  const achievements = data.achievements || [];
  const links = data.links || [];

  return `
    <div class="jakes-resume-container">
      <!-- ================= 1. HEADER ================= -->
              <header class="jakes-header">
                <h1 class="jakes-candidate-name">${esc(p.fullName) || ''}</h1>
                <div class="jakes-contact-line">
                  ${p.address ? `<span>${esc(p.address)}</span>` : ''}
                  ${p.phone ? `<span>${p.address ? ' | ' : ''}${esc(p.phone)}</span>` : ''}
                  ${p.email ? `<span>${(p.address || p.phone) ? ' | ' : ''}<a href="mailto:${esc(p.email)}" class="jakes-link">${esc(p.email)}</a></span>` : ''}
                </div>
                ${links.length > 0 ? `
                  <div class="jakes-links-line">
                    ${links.map((l) => `<a href="${esc(l.url)}" target="_blank" class="jakes-link">${esc(l.label || l.url)}</a>`).join(' | ')}
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
                    ${academic.map((raw) => {
                      const item = parseEducationItem(raw);
                      return `
                        <div class="jakes-education-line">
                          <strong>${esc(item.institution)}</strong>${item.details ? ` <span>${esc(item.details)}</span>` : ''}
                        </div>
                      `;
                    }).join('')}
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
                          <strong>${esc(exp.title || '')}</strong>${exp.company ? ` <span> | ${esc(exp.company.replace(/^[\|\s–—\-]+/, ''))}</span>` : ''}
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
                          <strong>${esc(proj.name || '')}</strong>${proj.techStack ? ` <span class="jakes-tech-stack"> | ${esc(proj.techStack.replace(/^[\|\s–—\-]+/, ''))}</span>` : ''}
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
              ${(awards.length > 0 || achievements.length > 0 || leadership.length > 0) ? `
                <section class="jakes-section">
                  <div class="jakes-section-title">CERTIFICATIONS &amp; ACHIEVEMENTS</div>
                  <div class="jakes-awards-block">
                    ${awards.length > 0 ? `
                      <div class="jakes-award-line">
                        <strong>Certifications:</strong> ${awards.map((a) => esc(String(a).replace(/^[•\-\*]\s*/, ''))).join('; ')}.
                      </div>
                    ` : ''}
                    ${achievements.length > 0 ? `
                      <div class="jakes-award-line">
                        <strong>Achievements:</strong> ${achievements.map((a) => esc(String(a).replace(/^[•\-\*]\s*/, ''))).join('; ')}.
                      </div>
                    ` : (leadership.length > 0 ? `
                      <div class="jakes-award-line">
                        <strong>Achievements:</strong> ${leadership.map((lead) => `${lead.title ? `<strong>${esc(lead.title)}:</strong> ` : ''}${esc(lead.description || '')}`).join('; ')}.
                      </div>
                    ` : '')}
                  </div>
                </section>
              ` : ''}
    </div>
  `;
}
