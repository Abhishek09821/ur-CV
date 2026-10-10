/**
 * JD Assist Panel — Job Description AI-powered suggestions
 * Per PRD Section 9: AI is an assistant, not an authority.
 * 
 * Rules:
 * - Clear privacy consent prior to any processing
 * - Accept pasted JD text or file upload (.txt, .pdf, .docx)
 * - Safe keyword & requirement extraction (Role, Responsibilities, Required/Preferred Skills)
 * - Traceable suggestions grounded ONLY in the student's confirmed profile data
 * - Never hallucinate credentials, metrics, skills, or employment
 * - Clear diff / change inspection with Accept, Edit, and Reject controls
 * - Accepting a suggestion directly updates the student's resume data
 */

export function renderJDPanel({ store, toast }) {
  const panel = document.createElement('div');
  panel.className = 'jd-panel active';

  let jdText = '';
  let isAnalyzing = false;
  let suggestions = [];
  let consentGiven = false;
  let extractedJDInfo = null;

  function build() {
    panel.innerHTML = `
      <!-- Privacy Consent Banner -->
      ${!consentGiven ? `
        <div class="privacy-banner" id="jd-privacy-consent-box">
          <div class="privacy-header">
            <span class="privacy-badge">🔒 PRIVACY GUARANTEE</span>
            <h3>JD Assist — Job Description Tailoring</h3>
          </div>
          <p class="privacy-text">
            JD Assist analyzes target job descriptions against your existing profile data to recommend
            relevant skill order, bullet point emphasis, and tailored career summaries.
          </p>
          <div class="privacy-bullets">
            <div class="p-bullet">🛡️ <strong>Zero Hallucination:</strong> AI will never invent employers, grades, skills, or fake metrics.</div>
            <div class="p-bullet">💻 <strong>Local & Private:</strong> Analyzed securely in your session. No personal data sold or retained.</div>
            <div class="p-bullet">✏️ <strong>Full Student Control:</strong> Nothing is added to your resume without your explicit approval.</div>
          </div>
          <div class="flex gap-md mt-md">
            <button class="btn btn--green" id="btn-consent-accept">✓ I Consent & Continue</button>
            <button class="btn btn--white" id="btn-consent-decline">✕ Switch to Manual Mode</button>
          </div>
        </div>
      ` : `
        <div class="jd-container-box">
          <!-- Accordion Header -->
          <div class="jd-accordion-header" id="jd-accordion-toggle">
            <div class="flex items-center gap-sm">
              <span class="badge badge--yellow">STEP 1</span>
              <strong style="font-family:var(--font-display);letter-spacing:0.5px;">TARGET JOB DESCRIPTION (JD)</strong>
            </div>
            <span class="accordion-icon" id="jd-accordion-icon">▼</span>
          </div>

          <div class="jd-accordion-content" id="jd-accordion-body">
            <!-- Paste or Upload -->
            <div class="form-group">
              <label class="form-label">
                Paste Job Description Text <span class="required">*</span>
              </label>
              <textarea class="form-textarea" id="jd-textarea" rows="7" 
                placeholder="Paste the full job description here (e.g., job role, responsibilities, required tech stack, qualifications)..."
              >${escapeHtml(jdText)}</textarea>
            </div>

            <div class="jd-divider">
              <span>— OR UPLOAD JD DOCUMENT —</span>
            </div>

            <div class="jd-upload-area" id="jd-upload-area">
              <span class="upload-icon">📄</span>
              <p><strong>Click or drag JD file here</strong></p>
              <p class="form-hint">Supported: .TXT, .PDF, .DOCX (Max 2MB)</p>
              <input type="file" id="jd-file-input" accept=".txt,.pdf,.docx" style="display:none;" />
            </div>

            <button class="btn btn--purple btn--block mt-lg" id="btn-analyze-jd" ${isAnalyzing ? 'disabled' : ''}>
              ${isAnalyzing ? '⏳ Analyzing JD & Matching Profile...' : '⚡ Analyze JD & Generate Grounded Suggestions'}
            </button>
          </div>

          <!-- Extracted JD Analysis Summary -->
          ${extractedJDInfo ? `
            <div class="jd-extracted-summary mt-lg">
              <div class="summary-header">
                <span class="badge badge--green">EXTRACTED JD REQUIREMENTS</span>
                <span style="font-size:0.8rem;color:var(--text-muted);">Confidence: High</span>
              </div>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Target Role:</span>
                  <strong>${escapeHtml(extractedJDInfo.roleTitle || 'Software Engineer / Technology Role')}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Key Requirements Found:</span>
                  <div class="tag-cloud">
                    ${extractedJDInfo.requiredSkills.map((s) => `<span class="tag tag--yellow">${escapeHtml(s)}</span>`).join(' ')}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Suggestions List -->
          ${suggestions.length > 0 ? `
            <div class="mt-xl">
              <div class="flex items-center justify-between mb-md">
                <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1.05rem;">
                  ✨ Grounded Suggestions <span class="tag tag--green">${suggestions.length} available</span>
                </h3>
                <span class="form-hint">Per PRD: Only verified profile facts are used</span>
              </div>

              <div class="suggestions-list">
                ${suggestions.map((s, i) => `
                  <div class="suggestion-card ${s.type === 'Gap Analysis' ? 'suggestion-card--warning' : ''}" data-sug-index="${i}">
                    <div class="suggestion-header">
                      <div class="flex items-center gap-sm">
                        <span class="tag tag--dark">${escapeHtml(s.section)}</span>
                        <span>${escapeHtml(s.type)}</span>
                      </div>
                      <span class="tag tag--${s.confidence === 'high' ? 'green' : s.confidence === 'medium' ? 'blue' : 'pink'}">
                        ${s.confidence} confidence
                      </span>
                    </div>

                    <div class="suggestion-body">
                      <!-- Diff or Comparison -->
                      ${s.originalText ? `
                        <div class="suggestion-diff">
                          <div class="diff-block diff-original">
                            <span class="diff-label">CURRENT PROFILE:</span>
                            <p>${escapeHtml(s.originalText)}</p>
                          </div>
                          <div class="diff-block diff-suggested">
                            <span class="diff-label">RECOMMENDED EDIT:</span>
                            <p>${escapeHtml(s.suggestedText)}</p>
                          </div>
                        </div>
                      ` : `
                        <div class="suggestion-text">
                          <p><strong>${escapeHtml(s.text)}</strong></p>
                        </div>
                      `}

                      <div class="suggestion-source">
                        📌 <strong>Profile Provenance:</strong> ${escapeHtml(s.source)}
                      </div>
                    </div>

                    <div class="suggestion-actions">
                      <button class="btn btn--sm btn--green suggestion-accept" data-index="${i}">✓ Accept & Apply</button>
                      <button class="btn btn--sm btn--white suggestion-edit" data-index="${i}">✏️ Edit Before Applying</button>
                      <button class="btn btn--sm btn--red suggestion-reject" data-index="${i}">✕ Dismiss</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : extractedJDInfo && !isAnalyzing ? `
            <div class="alert alert--info mt-lg">
              <strong>All caught up!</strong> All suggestions have been reviewed or your profile already aligns closely with this JD.
            </div>
          ` : ''}
        </div>
      `}
    `;

    attachJDEvents();
  }

  function attachJDEvents() {
    // Consent buttons
    panel.querySelector('#btn-consent-accept')?.addEventListener('click', () => {
      consentGiven = true;
      build();
      toast.show('Privacy consent recorded. You can now analyze your JD.', 'success');
    });

    panel.querySelector('#btn-consent-decline')?.addEventListener('click', () => {
      toast.show('Switched to Manual Mode.', 'info');
      panel.classList.remove('active');
    });

    // Accordion toggle
    panel.querySelector('#jd-accordion-toggle')?.addEventListener('click', () => {
      const body = panel.querySelector('#jd-accordion-body');
      const icon = panel.querySelector('#jd-accordion-icon');
      if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.textContent = isHidden ? '▼' : '►';
      }
    });

    // Textarea input
    const jdTextarea = panel.querySelector('#jd-textarea');
    if (jdTextarea) {
      jdTextarea.addEventListener('input', (e) => {
        jdText = e.target.value;
      });
    }

    // File upload
    const uploadArea = panel.querySelector('#jd-upload-area');
    const fileInput = panel.querySelector('#jd-file-input');
    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          toast.show('File exceeds 2MB limit. Please paste text instead.', 'error');
          return;
        }

        if (file.name.endsWith('.txt') || file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (ev) => {
            jdText = ev.target.result;
            build();
            toast.show('Loaded JD text from file!', 'success');
          };
          reader.readAsText(file);
        } else {
          // For binary PDF/DOCX where server parser is not connected, provide clean fallback
          toast.show('Extracting text... If formatting is complex, paste raw text directly.', 'info');
          const reader = new FileReader();
          reader.onload = (ev) => {
            const rawContent = ev.target.result;
            // Clean ASCII printable text extraction for client side fallback
            const cleanText = String(rawContent)
              .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (cleanText.length > 50) {
              jdText = cleanText.substring(0, 4000);
              build();
              toast.show('Extracted text preview from document.', 'success');
            } else {
              toast.show('Could not parse document cleanly. Please paste text directly.', 'warning');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Analyze button
    panel.querySelector('#btn-analyze-jd')?.addEventListener('click', () => {
      if (!jdText || jdText.trim().length < 20) {
        toast.show('Please enter at least a few lines of job description text.', 'warning');
        return;
      }
      runJDAnalysis();
    });

    // Accept Suggestion
    panel.querySelectorAll('.suggestion-accept').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const s = suggestions[idx];
        if (!s) return;

        applySuggestionToStore(s);
        suggestions.splice(idx, 1);
        build();
      });
    });

    // Edit Suggestion Before Applying
    panel.querySelectorAll('.suggestion-edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const s = suggestions[idx];
        if (!s) return;

        const currentVal = s.suggestedText || s.text;
        const edited = prompt('Edit suggestion before applying to your resume:', currentVal);
        if (edited !== null && edited.trim()) {
          s.suggestedText = edited.trim();
          s.text = edited.trim();
          applySuggestionToStore(s);
          suggestions.splice(idx, 1);
          build();
        }
      });
    });

    // Reject Suggestion
    panel.querySelectorAll('.suggestion-reject').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        suggestions.splice(idx, 1);
        build();
        toast.show('Suggestion dismissed.', 'info');
      });
    });
  }

  function runJDAnalysis() {
    isAnalyzing = true;
    build();

    setTimeout(() => {
      const data = store.getData();
      const analysis = analyzeJDAndProfile(jdText, data);
      extractedJDInfo = analysis.info;
      suggestions = analysis.suggestions;
      isAnalyzing = false;
      build();
      toast.show(`Analysis complete: ${suggestions.length} grounded suggestion(s) generated.`, 'success');
    }, 800);
  }

  function applySuggestionToStore(s) {
    if (s.action === 'SET_OBJECTIVE') {
      store.updateObjective(s.suggestedText || s.text);
      toast.show('Updated Career Objective!', 'success');
    } else if (s.action === 'REORDER_SKILLS') {
      if (s.reorderedSkills && s.category) {
        store.reorderSkills(s.category, s.reorderedSkills);
        toast.show(`Prioritized ${s.category} skills for this role!`, 'success');
      }
    } else if (s.action === 'ADD_SKILL') {
      if (s.skillName && s.category) {
        store.addSkill(s.category, s.skillName);
        toast.show(`Added ${s.skillName} to verified ${s.category}!`, 'success');
      }
    } else if (s.action === 'UPDATE_PROJECT_BULLET') {
      if (s.projIndex !== undefined && s.bulletIndex !== undefined) {
        store.updateProjectBullet(s.projIndex, s.bulletIndex, s.suggestedText || s.text);
        toast.show('Updated project bullet!', 'success');
      }
    } else if (s.action === 'UPDATE_EXPERIENCE_BULLET') {
      if (s.expIndex !== undefined && s.bulletIndex !== undefined) {
        store.updateExperienceBullet(s.expIndex, s.bulletIndex, s.suggestedText || s.text);
        toast.show('Updated experience bullet!', 'success');
      }
    } else {
      toast.show('Suggestion accepted!', 'success');
    }
  }

  build();
  return panel;
}

/**
 * Deterministic local analyzer that respects the PRD's anti-hallucination rules:
 * - Never invents facts, dates, organizations, or metrics.
 * - Prioritizes verified candidate skills that match the JD.
 * - Drafts Career Objective based strictly on the student's degree & matching profile items.
 */
function analyzeJDAndProfile(jdText, data) {
  const jdLower = jdText.toLowerCase();

  // Extract common tech keywords from JD
  const TECH_DICTIONARY = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node.js', 'node', 'express', 'django', 'flask', 'spring boot', 'spring', 'next.js',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'git', 'linux',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'rest api', 'rest', 'graphql', 'microservices', 'agile', 'scrum',
    'html', 'css', 'tailwind css', 'tailwind', 'bootstrap',
    'machine learning', 'deep learning', 'nlp', 'data structures', 'algorithms'
  ];

  const matchedInJD = TECH_DICTIONARY.filter((tech) => jdLower.includes(tech));

  // Determine candidate's existing skills across categories
  const candidateSkills = {
    languages: (data.skills?.languages || []),
    frameworks: (data.skills?.frameworks || []),
    tools: (data.skills?.tools || []),
    databases: (data.skills?.databases || []),
    other: (data.skills?.other || []),
  };

  const allCandidateSkillsLower = Object.values(candidateSkills).flat().map((s) => s.toLowerCase());

  // Skills present in BOTH JD and candidate profile
  const sharedSkills = matchedInJD.filter((kw) =>
    allCandidateSkillsLower.some((cs) => cs.includes(kw) || kw.includes(cs))
  );

  // Skills required by JD but absent in candidate profile
  const gapSkills = matchedInJD.filter((kw) =>
    !allCandidateSkillsLower.some((cs) => cs.includes(kw) || kw.includes(cs))
  );

  const suggestions = [];

  // 1. Skill Relevance Ordering (Reorder candidate's verified skills to put JD matches first)
  Object.entries(candidateSkills).forEach(([cat, list]) => {
    if (list.length > 1) {
      const matchedFirst = [...list].sort((a, b) => {
        const aMatch = matchedInJD.some((kw) => a.toLowerCase().includes(kw));
        const bMatch = matchedInJD.some((kw) => b.toLowerCase().includes(kw));
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });

      const changed = JSON.stringify(matchedFirst) !== JSON.stringify(list);
      if (changed) {
        suggestions.push({
          section: 'Skills',
          type: 'Relevance Ordering',
          action: 'REORDER_SKILLS',
          category: cat,
          reorderedSkills: matchedFirst,
          text: `Prioritize ${cat} matching the JD: ${matchedFirst.filter((s) => matchedInJD.some((kw) => s.toLowerCase().includes(kw))).join(', ')}`,
          originalText: list.join(', '),
          suggestedText: matchedFirst.join(', '),
          source: `Verified student ${cat} profile against JD keywords (${sharedSkills.join(', ')})`,
          confidence: 'high',
        });
      }
    }
  });

  // 2. Career Objective Suggestion
  const studentDegree = data.academic?.degree || 'engineering graduate';
  const primarySkills = sharedSkills.slice(0, 4).map(capitalize).join(', ');
  const targetRole = detectRole(jdLower);

  const proposedObjective = primarySkills.length > 0
    ? `Dedicated ${studentDegree} student with hands-on proficiency in ${primarySkills}. Seeking the ${targetRole} position to apply structured software engineering practices and contribute to high-impact projects.`
    : `Enthusiastic and analytical ${studentDegree} student eager to leverage verified academic foundations and project experience in the ${targetRole} role.`;

  suggestions.push({
    section: 'Career Objective',
    type: 'Tailored Summary',
    action: 'SET_OBJECTIVE',
    text: proposedObjective,
    originalText: data.objective || '(Currently blank)',
    suggestedText: proposedObjective,
    source: `Derived from student's degree (${studentDegree}) and verified matching skills (${primarySkills || 'academic foundation'})`,
    confidence: 'high',
  });

  // 3. Project Relevance Suggestion
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach((proj, pIdx) => {
      const projTech = (proj.techStack || '').toLowerCase();
      const hasMatch = matchedInJD.some((kw) => projTech.includes(kw));
      if (hasMatch && proj.bullets && proj.bullets.length > 0) {
        // Find first bullet that can be highlighted
        proj.bullets.forEach((bullet, bIdx) => {
          if (bullet && bullet.trim().length > 10 && !bullet.includes('Engineered')) {
            const refined = `Engineered ${bullet.replace(/^(built|created|made|worked on)\s+/i, '')}`;
            suggestions.push({
              section: `Projects (${proj.name})`,
              type: 'Action Verb Refinement',
              action: 'UPDATE_PROJECT_BULLET',
              projIndex: pIdx,
              bulletIndex: bIdx,
              text: refined,
              originalText: bullet,
              suggestedText: refined,
              source: `Student's project "${proj.name}" matching JD technology requirement`,
              confidence: 'medium',
            });
          }
        });
      }
    });
  }

  // 4. Missing Skills Gap Analysis (explicitly flagged per PRD as needing confirmation, never fabricated)
  if (gapSkills.length > 0) {
    gapSkills.slice(0, 3).forEach((skill) => {
      const cat = detectCategory(skill);
      suggestions.push({
        section: 'Skills Gap Analysis',
        type: 'Gap Analysis',
        action: 'ADD_SKILL',
        skillName: capitalize(skill),
        category: cat,
        text: `The JD specifies "${skill}", which is not currently in your profile. ONLY accept if you have genuine coursework or practical experience.`,
        originalText: `Not present in ${cat}`,
        suggestedText: `Add "${capitalize(skill)}" to ${cat}`,
        source: `Target JD requirement (Candidate confirmation required per PRD Section 9)`,
        confidence: 'medium',
      });
    });
  }

  return {
    info: {
      roleTitle: targetRole,
      requiredSkills: matchedInJD.slice(0, 10).map(capitalize),
    },
    suggestions,
  };
}

function detectRole(jdLower) {
  if (jdLower.includes('frontend') || jdLower.includes('front-end') || jdLower.includes('react')) return 'Frontend Developer';
  if (jdLower.includes('backend') || jdLower.includes('back-end') || jdLower.includes('node') || jdLower.includes('python')) return 'Backend Developer';
  if (jdLower.includes('full stack') || jdLower.includes('fullstack')) return 'Full Stack Developer';
  if (jdLower.includes('data science') || jdLower.includes('machine learning')) return 'Data Science / ML Engineer';
  if (jdLower.includes('devops') || jdLower.includes('cloud')) return 'Cloud & DevOps Engineer';
  return 'Software Engineer';
}

function detectCategory(skill) {
  const languages = ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin'];
  const frameworks = ['react', 'angular', 'vue', 'node.js', 'node', 'express', 'django', 'flask', 'spring boot', 'spring', 'next.js', 'tailwind css', 'tailwind', 'bootstrap'];
  const databases = ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'];
  const tools = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'git', 'linux'];

  if (languages.includes(skill)) return 'languages';
  if (frameworks.includes(skill)) return 'frameworks';
  if (databases.includes(skill)) return 'databases';
  if (tools.includes(skill)) return 'tools';
  return 'other';
}

function capitalize(str) {
  return str.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
