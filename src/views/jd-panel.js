/**
 * JD Assist Panel — Job Description AI-powered suggestions
 * Per PRD: AI is an assistant, not an authority.
 * All suggestions must be grounded in the student's profile data.
 */

export function renderJDPanel({ store, toast }) {
  const panel = document.createElement('div');
  panel.className = 'jd-panel active';

  let jdText = '';
  let isAnalyzing = false;
  let suggestions = [];
  let consentGiven = false;

  function build() {
    panel.innerHTML = `
      <!-- Privacy Consent -->
      ${!consentGiven ? `
        <div class="privacy-banner">
          <h3>🔒 Privacy Notice — JD Assist</h3>
          <p>
            JD Assist will analyze the job description alongside your profile data to generate
            tailored suggestions. Your resume content will be processed locally for matching.
            No data is sent to external AI services in this demo version.
          </p>
          <p style="font-size:0.8rem;color:var(--text-secondary);">
            In a production version, this would require explicit consent before sending data 
            to an AI provider. You can switch to Manual Mode at any time.
          </p>
          <div class="flex gap-md">
            <button class="btn btn--green" id="btn-consent-accept">✓ I Understand, Continue</button>
            <button class="btn btn--white" id="btn-consent-decline">Use Manual Mode</button>
          </div>
        </div>
      ` : `
        <div class="accordion open">
          <div class="accordion-header" id="jd-accordion-header">
            <span>📋 Job Description Input</span>
            <span class="accordion-icon">+</span>
          </div>
          <div class="accordion-body">
            <!-- Upload or paste JD -->
            <div class="form-group">
              <label class="form-label">Paste Job Description</label>
              <textarea class="form-textarea" id="jd-textarea" rows="8" 
                placeholder="Paste the full job description here...&#10;&#10;e.g. We are looking for a Software Engineer with experience in React, Node.js..."
              >${escapeHtml(jdText)}</textarea>
            </div>

            <div style="text-align:center;margin:var(--space-md) 0;font-family:var(--font-display);font-size:0.8rem;color:var(--text-muted);">— OR —</div>

            <div class="jd-upload-area" id="jd-upload-area">
              <span class="upload-icon">📁</span>
              <p><strong>Drop a file or click to upload</strong></p>
              <p class="form-hint">Supported: PDF, DOCX, TXT (max 2MB)</p>
              <input type="file" id="jd-file-input" accept=".pdf,.docx,.txt" style="display:none;" />
            </div>

            <button class="btn btn--purple btn--block mt-lg" id="btn-analyze-jd" ${isAnalyzing ? 'disabled' : ''}>
              ${isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Job Description'}
            </button>
          </div>
        </div>

        <!-- Suggestions -->
        ${suggestions.length > 0 ? `
          <div class="mt-lg">
            <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1rem;margin-bottom:var(--space-md);">
              ✨ AI Suggestions <span class="tag tag--green" style="font-size:0.65rem;">${suggestions.length} found</span>
            </h3>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-lg);">
              Suggestions are based only on your profile data. Accept, edit, or reject each one. 
              No claims are fabricated.
            </p>
            ${suggestions.map((s, i) => `
              <div class="suggestion-card">
                <div class="suggestion-header">
                  <span>${s.section} — ${s.type}</span>
                  <span class="tag tag--${s.confidence === 'high' ? 'green' : s.confidence === 'medium' ? '' : 'pink'}" style="font-size:0.6rem;">
                    ${s.confidence} confidence
                  </span>
                </div>
                <div class="suggestion-body">
                  <p style="font-size:0.9rem;">${escapeHtml(s.text)}</p>
                  <div class="suggestion-source">
                    📌 Source: ${escapeHtml(s.source)}
                  </div>
                </div>
                <div class="suggestion-actions">
                  <button class="btn btn--sm btn--green suggestion-accept" data-index="${i}">✓ Accept</button>
                  <button class="btn btn--sm btn--white suggestion-edit" data-index="${i}">✏ Edit</button>
                  <button class="btn btn--sm btn--red suggestion-reject" data-index="${i}">✕ Reject</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `}
    `;

    attachJDEvents();
  }

  function attachJDEvents() {
    // Consent
    document.getElementById('btn-consent-accept')?.addEventListener('click', () => {
      consentGiven = true;
      build();
    });

    document.getElementById('btn-consent-decline')?.addEventListener('click', () => {
      toast.show('Switched to Manual Mode. JD Assist is disabled.', 'info');
      panel.className = 'jd-panel'; // hide
    });

    // JD Text
    const jdTextarea = document.getElementById('jd-textarea');
    if (jdTextarea) {
      jdTextarea.addEventListener('input', () => {
        jdText = jdTextarea.value;
      });
    }

    // Upload area click
    const uploadArea = document.getElementById('jd-upload-area');
    const fileInput = document.getElementById('jd-file-input');
    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            toast.show('File too large. Max 2MB.', 'error');
            return;
          }
          if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              jdText = ev.target.result;
              build();
              toast.show('JD text loaded from file!', 'success');
            };
            reader.readAsText(file);
          } else {
            toast.show('In this demo, only .txt files can be read directly. Please paste the JD text instead.', 'warning');
          }
        }
      });
    }

    // Accordion toggle
    document.getElementById('jd-accordion-header')?.addEventListener('click', () => {
      const accordion = document.getElementById('jd-accordion-header')?.closest('.accordion');
      if (accordion) accordion.classList.toggle('open');
    });

    // Analyze button
    document.getElementById('btn-analyze-jd')?.addEventListener('click', () => {
      if (!jdText.trim()) {
        toast.show('Please paste or upload a job description first.', 'warning');
        return;
      }
      analyzeJD();
    });

    // Suggestion actions
    panel.querySelectorAll('.suggestion-accept').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const s = suggestions[idx];
        toast.show(`Accepted: "${s.text.substring(0, 40)}..."`, 'success');
        suggestions.splice(idx, 1);
        build();
      });
    });

    panel.querySelectorAll('.suggestion-reject').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        toast.show('Suggestion rejected.', 'info');
        suggestions.splice(idx, 1);
        build();
      });
    });

    panel.querySelectorAll('.suggestion-edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const s = suggestions[idx];
        const newText = prompt('Edit suggestion:', s.text);
        if (newText !== null) {
          suggestions[idx].text = newText;
          build();
        }
      });
    });
  }

  function analyzeJD() {
    isAnalyzing = true;
    build();

    // Simulate AI analysis (in production, this would call an AI service)
    setTimeout(() => {
      const data = store.getData();
      suggestions = generateLocalSuggestions(jdText, data);
      isAnalyzing = false;
      build();
      toast.show(`Found ${suggestions.length} suggestions based on your profile!`, 'success');
    }, 2000);
  }

  build();
  return panel;
}

/**
 * Local suggestion generator — analyzes JD keywords against profile data.
 * In production, this would be replaced by an AI service call with proper
 * consent, source mapping, and no fabrication.
 */
function generateLocalSuggestions(jdText, data) {
  const suggestions = [];
  const jdLower = jdText.toLowerCase();

  // Extract keywords from JD
  const techKeywords = extractTechKeywords(jdLower);
  const allSkills = [
    ...data.skills.languages,
    ...data.skills.frameworks,
    ...data.skills.tools,
    ...data.skills.databases,
    ...data.skills.other,
  ].map((s) => s.toLowerCase());

  // Find matching skills
  const matchedSkills = techKeywords.filter((kw) =>
    allSkills.some((s) => s.includes(kw) || kw.includes(s))
  );

  const missingSkills = techKeywords.filter((kw) =>
    !allSkills.some((s) => s.includes(kw) || kw.includes(s))
  );

  // Skill-based suggestions
  if (matchedSkills.length > 0) {
    suggestions.push({
      section: 'Skills',
      type: 'Relevance Ordering',
      text: `Consider listing these matching skills first: ${matchedSkills.join(', ')}. They appear in the job description and are already in your profile.`,
      source: 'Your skills profile + JD keyword analysis',
      confidence: 'high',
    });
  }

  if (missingSkills.length > 0 && missingSkills.length <= 5) {
    suggestions.push({
      section: 'Skills',
      type: 'Gap Analysis',
      text: `The JD mentions: ${missingSkills.join(', ')}. These are not in your current profile. Add them only if you have genuine experience.`,
      source: 'JD keyword analysis (not found in your profile)',
      confidence: 'medium',
    });
  }

  // Experience-based suggestions
  data.experience.forEach((exp) => {
    if (exp.title && exp.company) {
      const relevantBullets = exp.bullets.filter((b) =>
        b && techKeywords.some((kw) => b.toLowerCase().includes(kw))
      );
      if (relevantBullets.length > 0) {
        suggestions.push({
          section: 'Experience',
          type: 'Highlight',
          text: `Your role at ${exp.company} mentions relevant technologies. Consider expanding on these specific points for this application.`,
          source: `Your experience at ${exp.company}`,
          confidence: 'high',
        });
      }
    }
  });

  // Project-based suggestions
  data.projects.forEach((proj) => {
    if (proj.name && proj.techStack) {
      const projTech = proj.techStack.toLowerCase();
      const relevant = techKeywords.filter((kw) => projTech.includes(kw));
      if (relevant.length > 0) {
        suggestions.push({
          section: 'Projects',
          type: 'Relevance',
          text: `Your project "${proj.name}" uses ${relevant.join(', ')} which the JD requires. Consider moving it higher in your projects list.`,
          source: `Your project: ${proj.name}`,
          confidence: 'high',
        });
      }
    }
  });

  // Generic structural suggestion
  if (jdLower.includes('team') || jdLower.includes('collaborat') || jdLower.includes('leadership')) {
    if (data.leadership.length > 0) {
      suggestions.push({
        section: 'Leadership',
        type: 'Emphasis',
        text: 'The JD emphasizes teamwork/leadership. Your leadership section is relevant — ensure it highlights collaboration and impact.',
        source: 'JD mentions team/collaboration + your leadership entries',
        confidence: 'medium',
      });
    }
  }

  return suggestions;
}

function extractTechKeywords(text) {
  const commonTech = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'nextjs', 'next.js',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'git', 'linux',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'machine learning', 'deep learning', 'ai', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
    'rest', 'graphql', 'microservices', 'agile', 'scrum',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'firebase', 'supabase', 'vercel', 'netlify',
  ];

  return commonTech.filter((tech) => text.includes(tech));
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
