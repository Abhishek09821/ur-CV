(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();const C={personal:{fullName:"",email:"",phone:"",address:"",city:"",state:"",photo:null},objective:"",academic:{degree:"",university:"Amity University",graduationYear:"",cgpa:"",specialization:"",relevantCoursework:"",twelfthSchool:"",twelfthBoard:"",twelfthYear:"",twelfthPercentage:"",tenthSchool:"",tenthBoard:"",tenthYear:"",tenthPercentage:""},experience:[],projects:[],skills:{languages:[],frameworks:[],tools:[],databases:[],other:[]},achievements:[],leadership:[],links:{github:"",linkedin:"",leetcode:"",portfolio:"",other:""},declaration:{text:"I hereby declare that all the information furnished above is true to the best of my knowledge and belief.",place:"",date:new Date().toISOString().split("T")[0]}};class M{constructor(){this.data=JSON.parse(JSON.stringify(C)),this.listeners=[]}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(){this.listeners.forEach(e=>e(this.data))}getData(){return JSON.parse(JSON.stringify(this.data))}loadData(e){this.data={...JSON.parse(JSON.stringify(C)),...e},this.notify()}reset(){this.data=JSON.parse(JSON.stringify(C)),this.notify()}updatePersonal(e,t){this.data.personal[e]=t,this.notify()}setPhoto(e){this.data.personal.photo=e,this.notify()}updateObjective(e){this.data.objective=e,this.notify()}updateAcademic(e,t){this.data.academic[e]=t,this.notify()}addExperience(){this.data.experience.push({title:"",company:"",location:"",startDate:"",endDate:"",current:!1,bullets:[""]}),this.notify()}updateExperience(e,t,s){this.data.experience[e]&&(this.data.experience[e][t]=s,this.notify())}removeExperience(e){this.data.experience.splice(e,1),this.notify()}addExperienceBullet(e){this.data.experience[e].bullets.push(""),this.notify()}updateExperienceBullet(e,t,s){this.data.experience[e].bullets[t]=s,this.notify()}removeExperienceBullet(e,t){this.data.experience[e].bullets.splice(t,1),this.notify()}addProject(){this.data.projects.push({name:"",techStack:"",startDate:"",endDate:"",bullets:[""],link:""}),this.notify()}updateProject(e,t,s){this.data.projects[e]&&(this.data.projects[e][t]=s,this.notify())}removeProject(e){this.data.projects.splice(e,1),this.notify()}addProjectBullet(e){this.data.projects[e].bullets.push(""),this.notify()}updateProjectBullet(e,t,s){this.data.projects[e].bullets[t]=s,this.notify()}removeProjectBullet(e,t){this.data.projects[e].bullets.splice(t,1),this.notify()}addSkill(e,t){this.data.skills[e].includes(t)||(this.data.skills[e].push(t),this.notify())}removeSkill(e,t){this.data.skills[e]=this.data.skills[e].filter(s=>s!==t),this.notify()}setSkills(e,t){this.data.skills[e]=t,this.notify()}reorderSkills(e,t){this.data.skills[e]&&(this.data.skills[e]=t,this.notify())}addAchievement(){this.data.achievements.push({title:"",description:"",date:""}),this.notify()}updateAchievement(e,t,s){this.data.achievements[e]&&(this.data.achievements[e][t]=s,this.notify())}removeAchievement(e){this.data.achievements.splice(e,1),this.notify()}addLeadership(){this.data.leadership.push({role:"",organization:"",description:"",date:""}),this.notify()}updateLeadership(e,t,s){this.data.leadership[e]&&(this.data.leadership[e][t]=s,this.notify())}removeLeadership(e){this.data.leadership.splice(e,1),this.notify()}updateLink(e,t){this.data.links[e]=t,this.notify()}updateDeclaration(e,t){this.data.declaration[e]=t,this.notify()}validate(){const e=[];return this.data.personal.fullName.trim()||e.push({section:"personal",field:"fullName",message:"Full name is required"}),this.data.personal.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.personal.email)||e.push({section:"personal",field:"email",message:"Invalid email format"}):e.push({section:"personal",field:"email",message:"Email is required"}),this.data.personal.phone.trim()?/^[\d\+\-\(\)\s]{7,15}$/.test(this.data.personal.phone)||e.push({section:"personal",field:"phone",message:"Invalid phone format"}):e.push({section:"personal",field:"phone",message:"Phone number is required"}),this.data.academic.degree.trim()||e.push({section:"academic",field:"degree",message:"Degree is required"}),this.data.academic.graduationYear.trim()||e.push({section:"academic",field:"graduationYear",message:"Graduation year is required"}),this.data.academic.cgpa&&(isNaN(this.data.academic.cgpa)||this.data.academic.cgpa<0||this.data.academic.cgpa>10)&&e.push({section:"academic",field:"cgpa",message:"CGPA must be between 0 and 10"}),Object.entries(this.data.links).forEach(([t,s])=>{s&&!U(s)&&e.push({section:"links",field:t,message:`Invalid ${t} URL`})}),e}getCompletionStatus(){const e=this.data;return{personal:!!(e.personal.fullName&&e.personal.email&&e.personal.phone),academic:!!(e.academic.degree&&e.academic.graduationYear),experience:e.experience.length>0,projects:e.projects.length>0,skills:Object.values(e.skills).some(t=>t.length>0),achievements:!0,leadership:!0,links:!!(e.links.github||e.links.linkedin),declaration:!!e.declaration.place}}}function U(a){try{const e=new URL(a);return["http:","https:"].includes(e.protocol)}catch{return!1}}function J({onSelectMode:a}){const e=document.createElement("section");return e.className="landing",e.innerHTML=`
    <div class="landing-content animate-in">
      <div class="landing-badge">🎓 Amity University Approved</div>
      
      <h1>
        Build Your<br>
        <span class="highlight">Placement-Ready</span><br>
        Resume
      </h1>
      
      <p class="landing-subtitle">
        Free, mobile-first resume builder with the official Amity template. 
        Fill in your details, preview live, and download a professional PDF — no account needed.
      </p>

      <div class="landing-modes" id="landing-modes">
        <div class="card card--yellow mode-card" data-mode="manual" id="mode-manual">
          <span class="mode-icon">✏️</span>
          <div class="mode-title">Build Manually</div>
          <p class="mode-desc">Complete control over every section. No AI processing — your data stays on your device.</p>
        </div>
        
        <div class="card card--purple mode-card" data-mode="jd-assist" id="mode-jd-assist">
          <span class="mode-icon">🤖</span>
          <div class="mode-title">JD Assist</div>
          <p class="mode-desc">Paste a job description and get AI-tailored suggestions based on your actual profile.</p>
        </div>
      </div>

      <div class="landing-features">
        <div class="feature-chip">📱 Mobile First</div>
        <div class="feature-chip">📄 PDF Export</div>
        <div class="feature-chip">🔗 Clickable Links</div>
        <div class="feature-chip">🖼 Photo Upload</div>
        <div class="feature-chip">🔒 Privacy First</div>
        <div class="feature-chip">⚡ Live Preview</div>
      </div>
    </div>
  `,setTimeout(()=>{const t=document.getElementById("landing-modes");t&&t.addEventListener("click",s=>{const o=s.target.closest(".mode-card");if(o){const l=o.dataset.mode;o.style.transform="scale(0.95)",setTimeout(()=>{a(l)},150)}})},0),e}const H="modulepreload",z=function(a){return"/"+a},N={},Y=function(e,t,s){let o=Promise.resolve();if(t&&t.length>0){let u=function(b){return Promise.all(b.map(E=>Promise.resolve(E).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),m=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));o=u(t.map(b=>{if(b=z(b),b in N)return;N[b]=!0;const E=b.endsWith(".css"),v=E?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${b}"]${v}`))return;const n=document.createElement("link");if(n.rel=E?"stylesheet":H,E||(n.as="script"),n.crossOrigin="",n.href=b,m&&n.setAttribute("nonce",m),document.head.appendChild(n),E)return new Promise((y,g)=>{n.addEventListener("load",y),n.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${b}`)))})}))}function l(u){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=u,window.dispatchEvent(r),!r.defaultPrevented)throw u}return o.then(u=>{for(const r of u||[])r.status==="rejected"&&l(r.reason);return e().catch(l)})};function O(a){const e=a.personal||{},t=a.academic||{};return!(e.fullName||e.email||t.degree||a.objective)?`
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
    `:`
    <div class="resume-preview" id="rendered-resume-preview">
      ${F(a)}
    </div>
  `}function F(a){const e=a.personal||{},t=a.academic||{},s=a.links||{},o=[];s.github&&o.push(`<a href="${d(s.github)}" target="_blank" class="cv-link"><strong>GitHub</strong></a>`),s.linkedin&&o.push(`<a href="${d(s.linkedin)}" target="_blank" class="cv-link"><strong>LinkedIn</strong></a>`),s.leetcode&&o.push(`<a href="${d(s.leetcode)}" target="_blank" class="cv-link"><strong>LeetCode</strong></a>`),s.portfolio&&o.push(`<a href="${d(s.portfolio)}" target="_blank" class="cv-link"><strong>Portfolio</strong></a>`),s.other&&o.push(`<a href="${d(s.other)}" target="_blank" class="cv-link"><strong>Website</strong></a>`);const l=[];e.email&&l.push(`<a href="mailto:${d(e.email)}" class="cv-contact-link">${d(e.email)}</a>`),e.phone&&l.push(`<span>${d(e.phone)}</span>`);const u=[e.city,e.state].filter(Boolean).join(", ")||e.address;return u&&l.push(`<span>${d(u)}</span>`),`
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
          <h1 class="amity-candidate-name">${d(e.fullName)||"STUDENT NAME"}</h1>
          ${t.degree?`<div class="amity-candidate-degree">${d(t.degree)}${t.specialization?` (${d(t.specialization)})`:""}</div>`:""}
          <div class="amity-candidate-contact">
            ${l.join('<span class="cv-sep">•</span>')}
          </div>
          ${o.length>0?`
            <div class="amity-candidate-links">
              ${o.join('<span class="cv-sep">|</span>')}
            </div>
          `:""}
        </div>

        <div class="amity-photo-container">
          ${e.photo?`
            <img src="${e.photo}" class="amity-passport-photo" alt="Passport Photo" />
          `:`
            <div class="amity-photo-placeholder">
              <span>PHOTO</span>
            </div>
          `}
        </div>
      </div>

      <!-- ===== CAREER OBJECTIVE ===== -->
      ${a.objective?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>CAREER OBJECTIVE</span>
          </div>
          <div class="amity-section-body amity-objective-text">
            ${d(a.objective)}
          </div>
        </div>
      `:""}

      <!-- ===== ACADEMIC QUALIFICATIONS ===== -->
      ${t.degree||t.twelfthSchool||t.tenthSchool?`
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
                ${t.degree?`
                  <tr>
                    <td><strong>${d(t.degree)}</strong>${t.specialization?`<br><small>${d(t.specialization)}</small>`:""}</td>
                    <td>${d(t.university||"Amity University")}</td>
                    <td>Amity University</td>
                    <td>${d(t.graduationYear)||"—"}</td>
                    <td><strong>${d(t.cgpa)||"—"}</strong></td>
                  </tr>
                `:""}
                ${t.twelfthSchool?`
                  <tr>
                    <td>Class XII (Senior Secondary)</td>
                    <td>${d(t.twelfthSchool)}</td>
                    <td>${d(t.twelfthBoard||"CBSE")}</td>
                    <td>${d(t.twelfthYear||"—")}</td>
                    <td><strong>${d(t.twelfthPercentage||"—")}</strong></td>
                  </tr>
                `:""}
                ${t.tenthSchool?`
                  <tr>
                    <td>Class X (Secondary)</td>
                    <td>${d(t.tenthSchool)}</td>
                    <td>${d(t.tenthBoard||"CBSE")}</td>
                    <td>${d(t.tenthYear||"—")}</td>
                    <td><strong>${d(t.tenthPercentage||"—")}</strong></td>
                  </tr>
                `:""}
              </tbody>
            </table>
            ${t.relevantCoursework?`
              <div class="amity-coursework">
                <strong>Relevant Coursework:</strong> ${d(t.relevantCoursework)}
              </div>
            `:""}
          </div>
        </div>
      `:""}

      <!-- ===== TECHNICAL SKILLS ===== -->
      ${Object.values(a.skills||{}).some(r=>r&&r.length>0)?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>TECHNICAL SKILLS</span>
          </div>
          <div class="amity-section-body">
            <table class="amity-skills-table">
              ${a.skills.languages&&a.skills.languages.length>0?`
                <tr>
                  <td class="skills-cat">Languages:</td>
                  <td class="skills-val">${a.skills.languages.map(d).join(", ")}</td>
                </tr>
              `:""}
              ${a.skills.frameworks&&a.skills.frameworks.length>0?`
                <tr>
                  <td class="skills-cat">Frameworks & Libraries:</td>
                  <td class="skills-val">${a.skills.frameworks.map(d).join(", ")}</td>
                </tr>
              `:""}
              ${a.skills.tools&&a.skills.tools.length>0?`
                <tr>
                  <td class="skills-cat">Developer Tools & Platforms:</td>
                  <td class="skills-val">${a.skills.tools.map(d).join(", ")}</td>
                </tr>
              `:""}
              ${a.skills.databases&&a.skills.databases.length>0?`
                <tr>
                  <td class="skills-cat">Databases:</td>
                  <td class="skills-val">${a.skills.databases.map(d).join(", ")}</td>
                </tr>
              `:""}
              ${a.skills.other&&a.skills.other.length>0?`
                <tr>
                  <td class="skills-cat">Areas of Interest / Other:</td>
                  <td class="skills-val">${a.skills.other.map(d).join(", ")}</td>
                </tr>
              `:""}
            </table>
          </div>
        </div>
      `:""}

      <!-- ===== WORK EXPERIENCE & INTERNSHIPS ===== -->
      ${a.experience&&a.experience.length>0?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>WORK EXPERIENCE / INTERNSHIPS</span>
          </div>
          <div class="amity-section-body">
            ${a.experience.map(r=>`
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title">${d(r.title||"Role")} — <em>${d(r.company||"Company")}</em>${r.location?`, ${d(r.location)}`:""}</span>
                  <span class="amity-entry-date">${q(r.startDate,r.endDate,r.current)}</span>
                </div>
                ${r.bullets&&r.bullets.filter(Boolean).length>0?`
                  <ul class="amity-entry-bullets">
                    ${r.bullets.filter(Boolean).map(m=>`<li>${d(m)}</li>`).join("")}
                  </ul>
                `:""}
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      <!-- ===== PROJECTS ===== -->
      ${a.projects&&a.projects.length>0?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>PROJECTS</span>
          </div>
          <div class="amity-section-body">
            ${a.projects.map(r=>`
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title">
                    <strong>${d(r.name||"Project Name")}</strong>
                    ${r.techStack?`<span class="amity-tech-badge"> [${d(r.techStack)}]</span>`:""}
                  </span>
                  <span class="amity-entry-date">${q(r.startDate,r.endDate)}</span>
                </div>
                ${r.link?`
                  <div class="amity-proj-link">
                    <a href="${d(r.link)}" target="_blank" class="cv-link">🔗 ${d(r.link)}</a>
                  </div>
                `:""}
                ${r.bullets&&r.bullets.filter(Boolean).length>0?`
                  <ul class="amity-entry-bullets">
                    ${r.bullets.filter(Boolean).map(m=>`<li>${d(m)}</li>`).join("")}
                  </ul>
                `:""}
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      <!-- ===== ACHIEVEMENTS & CERTIFICATIONS ===== -->
      ${a.achievements&&a.achievements.length>0?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>AWARDS & ACHIEVEMENTS</span>
          </div>
          <div class="amity-section-body">
            <ul class="amity-entry-bullets">
              ${a.achievements.map(r=>`
                <li>
                  <strong>${d(r.title)}</strong>
                  ${r.date?` (${d(r.date)})`:""}
                  ${r.description?` — ${d(r.description)}`:""}
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      `:""}

      <!-- ===== LEADERSHIP & INITIATIVES ===== -->
      ${a.leadership&&a.leadership.length>0?`
        <div class="amity-section">
          <div class="amity-section-bar">
            <span>LEADERSHIP & POSITIONS OF RESPONSIBILITY</span>
          </div>
          <div class="amity-section-body">
            ${a.leadership.map(r=>`
              <div class="amity-entry">
                <div class="amity-entry-header">
                  <span class="amity-entry-title"><strong>${d(r.role)}</strong>${r.organization?` — ${d(r.organization)}`:""}</span>
                  <span class="amity-entry-date">${d(r.date||"")}</span>
                </div>
                ${r.description?`<div class="amity-entry-desc">${d(r.description)}</div>`:""}
              </div>
            `).join("")}
          </div>
        </div>
      `:""}

      <!-- ===== SELF DECLARATION ===== -->
      ${a.declaration&&a.declaration.text?`
        <div class="amity-section amity-declaration-section">
          <div class="amity-section-bar">
            <span>DECLARATION</span>
          </div>
          <div class="amity-section-body">
            <p class="amity-decl-text">${d(a.declaration.text)}</p>
            <div class="amity-decl-footer">
              <div class="amity-decl-left">
                ${a.declaration.place?`<div><strong>Place:</strong> ${d(a.declaration.place)}</div>`:""}
                ${a.declaration.date?`<div><strong>Date:</strong> ${d(a.declaration.date)}</div>`:""}
              </div>
              <div class="amity-decl-right">
                <div class="amity-signature-line"></div>
                <div class="amity-signature-name">${d(e.fullName)||"Candidate Signature"}</div>
              </div>
            </div>
          </div>
        </div>
      `:""}
    </div>
  `}function d(a){if(!a)return"";const e=document.createElement("div");return e.textContent=String(a),e.innerHTML}function q(a,e,t=!1){const s=[];return a&&s.push(B(a)),t?s.push("Present"):e&&s.push(B(e)),s.join(" – ")}function B(a){if(!a)return"";const[e,t]=a.split("-");return t?`${["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(t,10)]} ${e}`:e}function V({store:a,toast:e}){const t=document.createElement("div");t.className="jd-panel active";let s="",o=!1,l=[],u=!1,r=null;function m(){t.innerHTML=`
      <!-- Privacy Consent Banner -->
      ${u?`
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
              >${D(s)}</textarea>
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

            <button class="btn btn--purple btn--block mt-lg" id="btn-analyze-jd" ${o?"disabled":""}>
              ${o?"⏳ Analyzing JD & Matching Profile...":"⚡ Analyze JD & Generate Grounded Suggestions"}
            </button>
          </div>

          <!-- Extracted JD Analysis Summary -->
          ${r?`
            <div class="jd-extracted-summary mt-lg">
              <div class="summary-header">
                <span class="badge badge--green">EXTRACTED JD REQUIREMENTS</span>
                <span style="font-size:0.8rem;color:var(--text-muted);">Confidence: High</span>
              </div>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Target Role:</span>
                  <strong>${D(r.roleTitle||"Software Engineer / Technology Role")}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Key Requirements Found:</span>
                  <div class="tag-cloud">
                    ${r.requiredSkills.map(n=>`<span class="tag tag--yellow">${D(n)}</span>`).join(" ")}
                  </div>
                </div>
              </div>
            </div>
          `:""}

          <!-- Suggestions List -->
          ${l.length>0?`
            <div class="mt-xl">
              <div class="flex items-center justify-between mb-md">
                <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1.05rem;">
                  ✨ Grounded Suggestions <span class="tag tag--green">${l.length} available</span>
                </h3>
                <span class="form-hint">Per PRD: Only verified profile facts are used</span>
              </div>

              <div class="suggestions-list">
                ${l.map((n,y)=>`
                  <div class="suggestion-card ${n.type==="Gap Analysis"?"suggestion-card--warning":""}" data-sug-index="${y}">
                    <div class="suggestion-header">
                      <div class="flex items-center gap-sm">
                        <span class="tag tag--dark">${D(n.section)}</span>
                        <span>${D(n.type)}</span>
                      </div>
                      <span class="tag tag--${n.confidence==="high"?"green":n.confidence==="medium"?"blue":"pink"}">
                        ${n.confidence} confidence
                      </span>
                    </div>

                    <div class="suggestion-body">
                      <!-- Diff or Comparison -->
                      ${n.originalText?`
                        <div class="suggestion-diff">
                          <div class="diff-block diff-original">
                            <span class="diff-label">CURRENT PROFILE:</span>
                            <p>${D(n.originalText)}</p>
                          </div>
                          <div class="diff-block diff-suggested">
                            <span class="diff-label">RECOMMENDED EDIT:</span>
                            <p>${D(n.suggestedText)}</p>
                          </div>
                        </div>
                      `:`
                        <div class="suggestion-text">
                          <p><strong>${D(n.text)}</strong></p>
                        </div>
                      `}

                      <div class="suggestion-source">
                        📌 <strong>Profile Provenance:</strong> ${D(n.source)}
                      </div>
                    </div>

                    <div class="suggestion-actions">
                      <button class="btn btn--sm btn--green suggestion-accept" data-index="${y}">✓ Accept & Apply</button>
                      <button class="btn btn--sm btn--white suggestion-edit" data-index="${y}">✏️ Edit Before Applying</button>
                      <button class="btn btn--sm btn--red suggestion-reject" data-index="${y}">✕ Dismiss</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `:r&&!o?`
            <div class="alert alert--info mt-lg">
              <strong>All caught up!</strong> All suggestions have been reviewed or your profile already aligns closely with this JD.
            </div>
          `:""}
        </div>
      `:`
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
      `}
    `,b()}function b(){var S,w,P,A;(S=t.querySelector("#btn-consent-accept"))==null||S.addEventListener("click",()=>{u=!0,m(),e.show("Privacy consent recorded. You can now analyze your JD.","success")}),(w=t.querySelector("#btn-consent-decline"))==null||w.addEventListener("click",()=>{e.show("Switched to Manual Mode.","info"),t.classList.remove("active")}),(P=t.querySelector("#jd-accordion-toggle"))==null||P.addEventListener("click",()=>{const x=t.querySelector("#jd-accordion-body"),p=t.querySelector("#jd-accordion-icon");if(x){const h=x.style.display==="none";x.style.display=h?"block":"none",p&&(p.textContent=h?"▼":"►")}});const n=t.querySelector("#jd-textarea");n&&n.addEventListener("input",x=>{s=x.target.value});const y=t.querySelector("#jd-upload-area"),g=t.querySelector("#jd-file-input");y&&g&&(y.addEventListener("click",()=>g.click()),g.addEventListener("change",x=>{const p=x.target.files[0];if(p){if(p.size>2*1024*1024){e.show("File exceeds 2MB limit. Please paste text instead.","error");return}if(p.name.endsWith(".txt")||p.type==="text/plain"){const h=new FileReader;h.onload=k=>{s=k.target.result,m(),e.show("Loaded JD text from file!","success")},h.readAsText(p)}else{e.show("Extracting text... If formatting is complex, paste raw text directly.","info");const h=new FileReader;h.onload=k=>{const i=k.target.result,f=String(i).replace(/[^\x20-\x7E\t\n\r]/g," ").replace(/\s+/g," ").trim();f.length>50?(s=f.substring(0,4e3),m(),e.show("Extracted text preview from document.","success")):e.show("Could not parse document cleanly. Please paste text directly.","warning")},h.readAsText(p)}}})),(A=t.querySelector("#btn-analyze-jd"))==null||A.addEventListener("click",()=>{if(!s||s.trim().length<20){e.show("Please enter at least a few lines of job description text.","warning");return}E()}),t.querySelectorAll(".suggestion-accept").forEach(x=>{x.addEventListener("click",()=>{const p=parseInt(x.dataset.index,10),h=l[p];h&&(v(h),l.splice(p,1),m())})}),t.querySelectorAll(".suggestion-edit").forEach(x=>{x.addEventListener("click",()=>{const p=parseInt(x.dataset.index,10),h=l[p];if(!h)return;const k=h.suggestedText||h.text,i=prompt("Edit suggestion before applying to your resume:",k);i!==null&&i.trim()&&(h.suggestedText=i.trim(),h.text=i.trim(),v(h),l.splice(p,1),m())})}),t.querySelectorAll(".suggestion-reject").forEach(x=>{x.addEventListener("click",()=>{const p=parseInt(x.dataset.index,10);l.splice(p,1),m(),e.show("Suggestion dismissed.","info")})})}function E(){o=!0,m(),setTimeout(()=>{const n=a.getData(),y=_(s,n);r=y.info,l=y.suggestions,o=!1,m(),e.show(`Analysis complete: ${l.length} grounded suggestion(s) generated.`,"success")},800)}function v(n){n.action==="SET_OBJECTIVE"?(a.updateObjective(n.suggestedText||n.text),e.show("Updated Career Objective!","success")):n.action==="REORDER_SKILLS"?n.reorderedSkills&&n.category&&(a.reorderSkills(n.category,n.reorderedSkills),e.show(`Prioritized ${n.category} skills for this role!`,"success")):n.action==="ADD_SKILL"?n.skillName&&n.category&&(a.addSkill(n.category,n.skillName),e.show(`Added ${n.skillName} to verified ${n.category}!`,"success")):n.action==="UPDATE_PROJECT_BULLET"?n.projIndex!==void 0&&n.bulletIndex!==void 0&&(a.updateProjectBullet(n.projIndex,n.bulletIndex,n.suggestedText||n.text),e.show("Updated project bullet!","success")):n.action==="UPDATE_EXPERIENCE_BULLET"?n.expIndex!==void 0&&n.bulletIndex!==void 0&&(a.updateExperienceBullet(n.expIndex,n.bulletIndex,n.suggestedText||n.text),e.show("Updated experience bullet!","success")):e.show("Suggestion accepted!","success")}return m(),t}function _(a,e){var g,S,w,P,A,x;const t=a.toLowerCase(),o=["python","java","javascript","typescript","c++","c#","golang","rust","ruby","php","swift","kotlin","react","angular","vue","node.js","node","express","django","flask","spring boot","spring","next.js","aws","azure","gcp","docker","kubernetes","terraform","ci/cd","jenkins","git","linux","sql","postgresql","mysql","mongodb","redis","elasticsearch","rest api","rest","graphql","microservices","agile","scrum","html","css","tailwind css","tailwind","bootstrap","machine learning","deep learning","nlp","data structures","algorithms"].filter(p=>t.includes(p)),l={languages:((g=e.skills)==null?void 0:g.languages)||[],frameworks:((S=e.skills)==null?void 0:S.frameworks)||[],tools:((w=e.skills)==null?void 0:w.tools)||[],databases:((P=e.skills)==null?void 0:P.databases)||[],other:((A=e.skills)==null?void 0:A.other)||[]},u=Object.values(l).flat().map(p=>p.toLowerCase()),r=o.filter(p=>u.some(h=>h.includes(p)||p.includes(h))),m=o.filter(p=>!u.some(h=>h.includes(p)||p.includes(h))),b=[];Object.entries(l).forEach(([p,h])=>{if(h.length>1){const k=[...h].sort((f,$)=>{const j=o.some(L=>f.toLowerCase().includes(L)),R=o.some(L=>$.toLowerCase().includes(L));return j&&!R?-1:!j&&R?1:0});JSON.stringify(k)!==JSON.stringify(h)&&b.push({section:"Skills",type:"Relevance Ordering",action:"REORDER_SKILLS",category:p,reorderedSkills:k,text:`Prioritize ${p} matching the JD: ${k.filter(f=>o.some($=>f.toLowerCase().includes($))).join(", ")}`,originalText:h.join(", "),suggestedText:k.join(", "),source:`Verified student ${p} profile against JD keywords (${r.join(", ")})`,confidence:"high"})}});const E=((x=e.academic)==null?void 0:x.degree)||"engineering graduate",v=r.slice(0,4).map(T).join(", "),n=G(t),y=v.length>0?`Dedicated ${E} student with hands-on proficiency in ${v}. Seeking the ${n} position to apply structured software engineering practices and contribute to high-impact projects.`:`Enthusiastic and analytical ${E} student eager to leverage verified academic foundations and project experience in the ${n} role.`;return b.push({section:"Career Objective",type:"Tailored Summary",action:"SET_OBJECTIVE",text:y,originalText:e.objective||"(Currently blank)",suggestedText:y,source:`Derived from student's degree (${E}) and verified matching skills (${v||"academic foundation"})`,confidence:"high"}),e.projects&&e.projects.length>0&&e.projects.forEach((p,h)=>{const k=(p.techStack||"").toLowerCase();o.some(f=>k.includes(f))&&p.bullets&&p.bullets.length>0&&p.bullets.forEach((f,$)=>{if(f&&f.trim().length>10&&!f.includes("Engineered")){const j=`Engineered ${f.replace(/^(built|created|made|worked on)\s+/i,"")}`;b.push({section:`Projects (${p.name})`,type:"Action Verb Refinement",action:"UPDATE_PROJECT_BULLET",projIndex:h,bulletIndex:$,text:j,originalText:f,suggestedText:j,source:`Student's project "${p.name}" matching JD technology requirement`,confidence:"medium"})}})}),m.length>0&&m.slice(0,3).forEach(p=>{const h=W(p);b.push({section:"Skills Gap Analysis",type:"Gap Analysis",action:"ADD_SKILL",skillName:T(p),category:h,text:`The JD specifies "${p}", which is not currently in your profile. ONLY accept if you have genuine coursework or practical experience.`,originalText:`Not present in ${h}`,suggestedText:`Add "${T(p)}" to ${h}`,source:"Target JD requirement (Candidate confirmation required per PRD Section 9)",confidence:"medium"})}),{info:{roleTitle:n,requiredSkills:o.slice(0,10).map(T)},suggestions:b}}function G(a){return a.includes("frontend")||a.includes("front-end")||a.includes("react")?"Frontend Developer":a.includes("backend")||a.includes("back-end")||a.includes("node")||a.includes("python")?"Backend Developer":a.includes("full stack")||a.includes("fullstack")?"Full Stack Developer":a.includes("data science")||a.includes("machine learning")?"Data Science / ML Engineer":a.includes("devops")||a.includes("cloud")?"Cloud & DevOps Engineer":"Software Engineer"}function W(a){const e=["python","java","javascript","typescript","c++","c#","golang","rust","ruby","php","swift","kotlin"],t=["react","angular","vue","node.js","node","express","django","flask","spring boot","spring","next.js","tailwind css","tailwind","bootstrap"],s=["sql","postgresql","mysql","mongodb","redis","elasticsearch"],o=["aws","azure","gcp","docker","kubernetes","terraform","ci/cd","jenkins","git","linux"];return e.includes(a)?"languages":t.includes(a)?"frameworks":s.includes(a)?"databases":o.includes(a)?"tools":"other"}function T(a){return a.split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function D(a){if(!a)return"";const e=document.createElement("div");return e.textContent=String(a),e.innerHTML}const I=[{id:"personal",label:"Personal Info",icon:"👤",required:!0},{id:"objective",label:"Career Objective",icon:"🎯",required:!1},{id:"academic",label:"Education",icon:"🎓",required:!0},{id:"skills",label:"Technical Skills",icon:"⚡",required:!0},{id:"experience",label:"Work Experience",icon:"💼",required:!1},{id:"projects",label:"Projects",icon:"🚀",required:!1},{id:"achievements",label:"Achievements",icon:"🏆",required:!1},{id:"leadership",label:"Leadership",icon:"👑",required:!1},{id:"links",label:"Profile Links",icon:"🔗",required:!1},{id:"declaration",label:"Declaration",icon:"📝",required:!0}];function X({store:a,mode:e,toast:t,onSave:s,onBack:o}){const l=document.createElement("div");l.className="builder-wrapper";let u="personal",r="form";function m(){const n=a.getData(),y=a.getCompletionStatus();l.innerHTML=`
      ${e==="jd-assist"?'<div id="jd-panel-mount"></div>':""}
      
      <!-- Mobile View Switcher -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${r==="form"?"active":""}" data-view="form">✏️ Edit Form</button>
        <button class="toggle-btn ${r==="preview"?"active":""}" data-view="preview">👁 Live Preview</button>
      </div>

      <!-- Top Progress Navigation Bar -->
      <div class="progress-bar">
        ${I.map(g=>`
          <div class="progress-step ${g.id===u?"active":""} ${y[g.id]?"completed":""}" data-section="${g.id}">
            <span class="step-number">${g.icon}</span>
            <span class="step-label">${g.label}</span>
          </div>
        `).join("")}
      </div>

      <div class="builder active">
        <!-- Sidebar Form & Navigation -->
        <div class="builder-sidebar ${r==="preview"?"mobile-hidden":""}">
          <nav class="section-nav">
            ${I.map(g=>`
              <div class="section-nav-item ${g.id===u?"active":""} ${y[g.id]?"completed":""}" data-section="${g.id}">
                <span class="nav-icon">${g.icon}</span>
                <span class="nav-text">${g.label}</span>
                ${g.required?'<span class="required" style="font-size:0.65rem;margin-left:auto;">REQ</span>':""}
                <span class="nav-status">${y[g.id]?"✓":"○"}</span>
              </div>
            `).join("")}
          </nav>

          <!-- Form Panels -->
          <div class="form-container">
            ${K(n,u==="personal")}
            ${Q(n,u==="objective")}
            ${Z(n,u==="academic")}
            ${ee(n,u==="skills")}
            ${te(n,u==="experience")}
            ${ae(n,u==="projects")}
            ${ie(n,u==="achievements")}
            ${se(n,u==="leadership")}
            ${le(n,u==="links")}
            ${ne(n,u==="declaration")}
          </div>

          <!-- Bottom Action Toolbar -->
          <div class="builder-actions-toolbar">
            ${u!=="personal"?'<button class="btn btn--white btn--sm" id="btn-prev-section">← Prev</button>':""}
            ${u!=="declaration"?'<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>':""}
            
            <div class="export-btn-group">
              <button class="btn btn--green btn--sm" id="btn-export-pdf" title="Download PDF using html2pdf">
                📄 Download PDF
              </button>
              <button class="btn btn--yellow btn--sm" id="btn-print-pdf" title="Open Browser Native Print dialog for 100% Vector PDF">
                🖨️ Native Print
              </button>
            </div>
          </div>
        </div>

        <!-- Live Resume Preview Panel -->
        <div class="builder-preview ${r==="form"?"mobile-hidden":""}" id="preview-panel">
          ${O(n)}
        </div>
      </div>
    `,E()}function b(){const n=l.querySelector("#preview-panel");n&&(n.innerHTML=O(a.getData()));const y=a.getCompletionStatus();I.forEach(g=>{const S=y[g.id],w=l.querySelector(`.section-nav-item[data-section="${g.id}"]`);if(w){w.classList.toggle("completed",!!S);const A=w.querySelector(".nav-status");A&&(A.textContent=S?"✓":"○")}const P=l.querySelector(`.progress-step[data-section="${g.id}"]`);P&&P.classList.toggle("completed",!!S)})}function E(){var g,S,w,P,A,x,p,h,k;l.querySelectorAll("[data-section]").forEach(i=>{i.addEventListener("click",()=>{u=i.dataset.section,m()})}),l.querySelectorAll(".toggle-btn").forEach(i=>{i.addEventListener("click",()=>{r=i.dataset.view,m()})}),(g=l.querySelector("#btn-prev-section"))==null||g.addEventListener("click",()=>{const i=I.findIndex(f=>f.id===u);i>0&&(u=I[i-1].id,m())}),(S=l.querySelector("#btn-next-section"))==null||S.addEventListener("click",()=>{const i=I.findIndex(f=>f.id===u);i<I.length-1&&(u=I[i+1].id,m())}),(w=l.querySelector("#btn-export-pdf"))==null||w.addEventListener("click",()=>{re(a,t)}),(P=l.querySelector("#btn-print-pdf"))==null||P.addEventListener("click",()=>{window.print()}),v("input-fullname",i=>a.updatePersonal("fullName",i)),v("input-email",i=>a.updatePersonal("email",i)),v("input-phone",i=>a.updatePersonal("phone",i)),v("input-address",i=>a.updatePersonal("address",i)),v("input-city",i=>a.updatePersonal("city",i)),v("input-state",i=>a.updatePersonal("state",i));const n=l.querySelector("#input-photo");if(n&&n.addEventListener("change",i=>{const f=i.target.files[0];if(f){if(f.size>5*1024*1024){t.show("Photo must be under 5MB","error");return}if(!["image/jpeg","image/png"].includes(f.type)){t.show("Only JPEG and PNG photos are supported","error");return}const $=new FileReader;$.onload=j=>{a.setPhoto(j.target.result),m(),t.show("Passport photo uploaded!","success")},$.readAsDataURL(f)}}),(A=l.querySelector("#btn-remove-photo"))==null||A.addEventListener("click",()=>{a.setPhoto(null),m(),t.show("Photo removed","info")}),v("input-objective",i=>a.updateObjective(i)),v("input-degree",i=>a.updateAcademic("degree",i)),v("input-university",i=>a.updateAcademic("university",i)),v("input-grad-year",i=>a.updateAcademic("graduationYear",i)),v("input-cgpa",i=>a.updateAcademic("cgpa",i)),v("input-specialization",i=>a.updateAcademic("specialization",i)),v("input-coursework",i=>a.updateAcademic("relevantCoursework",i)),v("input-12-school",i=>a.updateAcademic("twelfthSchool",i)),v("input-12-board",i=>a.updateAcademic("twelfthBoard",i)),v("input-12-year",i=>a.updateAcademic("twelfthYear",i)),v("input-12-pct",i=>a.updateAcademic("twelfthPercentage",i)),v("input-10-school",i=>a.updateAcademic("tenthSchool",i)),v("input-10-board",i=>a.updateAcademic("tenthBoard",i)),v("input-10-year",i=>a.updateAcademic("tenthYear",i)),v("input-10-pct",i=>a.updateAcademic("tenthPercentage",i)),["languages","frameworks","tools","databases","other"].forEach(i=>{const f=l.querySelector(`#skill-input-${i}`);f&&f.addEventListener("keydown",$=>{$.key==="Enter"&&f.value.trim()&&($.preventDefault(),a.addSkill(i,f.value.trim()),m())})}),l.querySelectorAll(".skill-remove").forEach(i=>{i.addEventListener("click",()=>{a.removeSkill(i.dataset.category,i.dataset.skill),m()})}),(x=l.querySelector("#btn-add-experience"))==null||x.addEventListener("click",()=>{a.addExperience(),m()}),l.querySelectorAll(".exp-delete").forEach(i=>{i.addEventListener("click",()=>{a.removeExperience(parseInt(i.dataset.index,10)),m()})}),l.querySelectorAll("[data-exp-field]").forEach(i=>{const f=parseInt(i.dataset.expIndex,10),$=i.dataset.expField;i.addEventListener("input",()=>{a.updateExperience(f,$,i.type==="checkbox"?i.checked:i.value),b()})}),l.querySelectorAll("[data-exp-bullet]").forEach(i=>{const f=parseInt(i.dataset.expIndex,10),$=parseInt(i.dataset.bulletIndex,10);i.addEventListener("input",()=>{a.updateExperienceBullet(f,$,i.value),b()})}),l.querySelectorAll(".exp-add-bullet").forEach(i=>{i.addEventListener("click",()=>{a.addExperienceBullet(parseInt(i.dataset.expIndex,10)),m()})}),l.querySelectorAll(".exp-remove-bullet").forEach(i=>{i.addEventListener("click",()=>{a.removeExperienceBullet(parseInt(i.dataset.expIndex,10),parseInt(i.dataset.bulletIndex,10)),m()})}),(p=l.querySelector("#btn-add-project"))==null||p.addEventListener("click",()=>{a.addProject(),m()}),l.querySelectorAll(".proj-delete").forEach(i=>{i.addEventListener("click",()=>{a.removeProject(parseInt(i.dataset.index,10)),m()})}),l.querySelectorAll("[data-proj-field]").forEach(i=>{const f=parseInt(i.dataset.projIndex,10),$=i.dataset.projField;i.addEventListener("input",()=>{a.updateProject(f,$,i.value),b()})}),l.querySelectorAll("[data-proj-bullet]").forEach(i=>{const f=parseInt(i.dataset.projIndex,10),$=parseInt(i.dataset.bulletIndex,10);i.addEventListener("input",()=>{a.updateProjectBullet(f,$,i.value),b()})}),l.querySelectorAll(".proj-add-bullet").forEach(i=>{i.addEventListener("click",()=>{a.addProjectBullet(parseInt(i.dataset.projIndex,10)),m()})}),l.querySelectorAll(".proj-remove-bullet").forEach(i=>{i.addEventListener("click",()=>{a.removeProjectBullet(parseInt(i.dataset.projIndex,10),parseInt(i.dataset.bulletIndex,10)),m()})}),(h=l.querySelector("#btn-add-achievement"))==null||h.addEventListener("click",()=>{a.addAchievement(),m()}),l.querySelectorAll(".ach-delete").forEach(i=>{i.addEventListener("click",()=>{a.removeAchievement(parseInt(i.dataset.index,10)),m()})}),l.querySelectorAll("[data-ach-field]").forEach(i=>{const f=parseInt(i.dataset.achIndex,10),$=i.dataset.achField;i.addEventListener("input",()=>{a.updateAchievement(f,$,i.value),b()})}),(k=l.querySelector("#btn-add-leadership"))==null||k.addEventListener("click",()=>{a.addLeadership(),m()}),l.querySelectorAll(".lead-delete").forEach(i=>{i.addEventListener("click",()=>{a.removeLeadership(parseInt(i.dataset.index,10)),m()})}),l.querySelectorAll("[data-lead-field]").forEach(i=>{const f=parseInt(i.dataset.leadIndex,10),$=i.dataset.leadField;i.addEventListener("input",()=>{a.updateLeadership(f,$,i.value),b()})}),v("input-github",i=>a.updateLink("github",i)),v("input-linkedin",i=>a.updateLink("linkedin",i)),v("input-leetcode",i=>a.updateLink("leetcode",i)),v("input-portfolio",i=>a.updateLink("portfolio",i)),v("input-other-link",i=>a.updateLink("other",i)),v("input-decl-text",i=>a.updateDeclaration("text",i)),v("input-decl-place",i=>a.updateDeclaration("place",i)),v("input-decl-date",i=>a.updateDeclaration("date",i)),e==="jd-assist"){const i=l.querySelector("#jd-panel-mount");i&&(i.innerHTML="",i.appendChild(V({store:a,toast:t})))}}function v(n,y){const g=l.querySelector(`#${n}`);g&&g.addEventListener("input",()=>{y(g.value),b()})}return m(),l}function K(a,e){const t=a.personal||{};return`
    <div class="form-section ${e?"active":""}" data-form="personal">
      <h2 class="form-section-title">👤 Personal Details</h2>
      <p class="form-section-desc">Basic candidate details for the Amity resume header.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-fullname" value="${c(t.fullName)}" placeholder="e.g. Abhishek Tiwari" />
        </div>
        <div class="form-group">
          <label class="form-label">Official Email <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${c(t.email)}" placeholder="e.g. abhishek@amity.edu" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Mobile Number <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${c(t.phone)}" placeholder="e.g. +91 98765 43210" />
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input type="text" class="form-input" id="input-city" value="${c(t.city)}" placeholder="e.g. Noida / New Delhi" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" class="form-input" id="input-state" value="${c(t.state)}" placeholder="e.g. Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Residential Address</label>
          <input type="text" class="form-input" id="input-address" value="${c(t.address)}" placeholder="e.g. Sector 125, Amity Campus" />
        </div>
      </div>

      <!-- Passport Photo Upload -->
      <div class="form-group">
        <label class="form-label">Passport Photo (Standard Amity Template)</label>
        <div class="photo-upload">
          <div class="photo-preview">
            ${t.photo?`<img src="${t.photo}" alt="Passport photo" style="width:100%;height:100%;object-fit:cover;" />`:'<span class="photo-placeholder">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${t.photo?'<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>':""}
          </div>
          <p class="form-hint">JPEG/PNG format, passport ratio. Automatically fitted to template header.</p>
        </div>
      </div>
    </div>
  `}function Q(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="objective">
      <h2 class="form-section-title">🎯 Career Objective / Summary</h2>
      <p class="form-section-desc">A concise 2-3 sentence summary of your career aspirations and core strengths.</p>

      <div class="form-group">
        <label class="form-label">Career Objective Statement</label>
        <textarea class="form-textarea" id="input-objective" rows="5" placeholder="e.g. Dedicated Computer Science student with strong foundations in Data Structures, Algorithms, and Full-Stack Web Development. Seeking a software development engineer role to build scalable systems.">${c(a.objective||"")}</textarea>
        <p class="form-hint">Tip: If you use JD Assist, this can be automatically tailored to your target job description.</p>
      </div>
    </div>
  `}function Z(a,e){const t=a.academic||{};return`
    <div class="form-section ${e?"active":""}" data-form="academic">
      <h2 class="form-section-title">🎓 Academic Qualifications</h2>
      <p class="form-section-desc">University program and secondary school records formatted in the official Amity table.</p>

      <!-- University Degree -->
      <div class="entry-card mb-lg">
        <div class="entry-card-header">
          <span class="entry-card-title">1. Current / Graduation Program</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Degree / Program <span class="required">*</span></label>
            <input type="text" class="form-input" id="input-degree" value="${c(t.degree)}" placeholder="e.g. B.Tech in Computer Science & Engineering" />
          </div>
          <div class="form-group">
            <label class="form-label">University / Institute</label>
            <input type="text" class="form-input" id="input-university" value="${c(t.university)}" placeholder="e.g. Amity University Uttar Pradesh" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Graduation Year <span class="required">*</span></label>
            <input type="text" class="form-input" id="input-grad-year" value="${c(t.graduationYear)}" placeholder="e.g. 2026" />
          </div>
          <div class="form-group">
            <label class="form-label">CGPA / Percentage</label>
            <input type="text" class="form-input" id="input-cgpa" value="${c(t.cgpa)}" placeholder="e.g. 8.75" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Specialization / Minor (Optional)</label>
          <input type="text" class="form-input" id="input-specialization" value="${c(t.specialization)}" placeholder="e.g. Cloud Computing & DevOps" />
        </div>

        <div class="form-group">
          <label class="form-label">Relevant Coursework</label>
          <input type="text" class="form-input" id="input-coursework" value="${c(t.relevantCoursework)}" placeholder="e.g. Data Structures & Algorithms, OS, DBMS, Computer Networks, Software Engineering" />
        </div>
      </div>

      <!-- Senior Secondary (12th) -->
      <div class="entry-card mb-lg">
        <div class="entry-card-header">
          <span class="entry-card-title">2. Class XII / Senior Secondary</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" class="form-input" id="input-12-school" value="${c(t.twelfthSchool)}" placeholder="e.g. Delhi Public School, R.K. Puram" />
          </div>
          <div class="form-group">
            <label class="form-label">Board</label>
            <input type="text" class="form-input" id="input-12-board" value="${c(t.twelfthBoard)}" placeholder="e.g. CBSE / ISC / State Board" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Passing Year</label>
            <input type="text" class="form-input" id="input-12-year" value="${c(t.twelfthYear)}" placeholder="e.g. 2022" />
          </div>
          <div class="form-group">
            <label class="form-label">Percentage / Marks</label>
            <input type="text" class="form-input" id="input-12-pct" value="${c(t.twelfthPercentage)}" placeholder="e.g. 94.2%" />
          </div>
        </div>
      </div>

      <!-- Secondary (10th) -->
      <div class="entry-card">
        <div class="entry-card-header">
          <span class="entry-card-title">3. Class X / Secondary</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" class="form-input" id="input-10-school" value="${c(t.tenthSchool)}" placeholder="e.g. St. Xavier's High School" />
          </div>
          <div class="form-group">
            <label class="form-label">Board</label>
            <input type="text" class="form-input" id="input-10-board" value="${c(t.tenthBoard)}" placeholder="e.g. CBSE / ICSE / State Board" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Passing Year</label>
            <input type="text" class="form-input" id="input-10-year" value="${c(t.tenthYear)}" placeholder="e.g. 2020" />
          </div>
          <div class="form-group">
            <label class="form-label">Percentage / CGPA</label>
            <input type="text" class="form-input" id="input-10-pct" value="${c(t.tenthPercentage)}" placeholder="e.g. 96.0%" />
          </div>
        </div>
      </div>
    </div>
  `}function ee(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Categorized technical competencies. Type a skill and press <strong>Enter</strong> to add.</p>

      ${[{key:"languages",label:"Programming Languages",placeholder:"e.g. C++, Java, Python, JavaScript",color:"tag--blue"},{key:"frameworks",label:"Frameworks & Libraries",placeholder:"e.g. React, Node.js, Express, Spring Boot",color:"tag--pink"},{key:"tools",label:"Developer Tools & Platforms",placeholder:"e.g. Git, Docker, AWS, Postman, Linux",color:"tag--green"},{key:"databases",label:"Databases",placeholder:"e.g. PostgreSQL, MongoDB, MySQL, Redis",color:"tag--purple"},{key:"other",label:"Areas of Interest / Core Concepts",placeholder:"e.g. OOPs, System Design, REST APIs",color:"tag--yellow"}].map(s=>`
        <div class="form-group mb-md">
          <label class="form-label">${s.label}</label>
          <div class="skills-input-wrapper">
            ${(a.skills[s.key]||[]).map(o=>`
              <span class="tag ${s.color}">
                ${c(o)}
                <span class="tag-remove skill-remove" data-category="${s.key}" data-skill="${c(o)}">✕</span>
              </span>
            `).join("")}
            <input type="text" id="skill-input-${s.key}" placeholder="${s.placeholder}" />
          </div>
        </div>
      `).join("")}
    </div>
  `}function te(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="experience">
      <h2 class="form-section-title">💼 Work Experience / Internships</h2>
      <p class="form-section-desc">Industry internships, research roles, or corporate experience. Optional section.</p>

      ${a.experience.map((t,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${s+1}</span>
            <button class="delete-btn exp-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role / Designation</label>
              <input type="text" class="form-input" data-exp-field="title" data-exp-index="${s}" value="${c(t.title)}" placeholder="e.g. Software Engineering Intern" />
            </div>
            <div class="form-group">
              <label class="form-label">Company / Organization</label>
              <input type="text" class="form-input" data-exp-field="company" data-exp-index="${s}" value="${c(t.company)}" placeholder="e.g. Microsoft" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="month" class="form-input" data-exp-field="startDate" data-exp-index="${s}" value="${c(t.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="month" class="form-input" data-exp-field="endDate" data-exp-index="${s}" value="${c(t.endDate)}" ${t.current?"disabled":""} />
              <label style="margin-top:4px;display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer;">
                <input type="checkbox" data-exp-field="current" data-exp-index="${s}" ${t.current?"checked":""} /> Currently Working Here
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" data-exp-field="location" data-exp-index="${s}" value="${c(t.location)}" placeholder="e.g. Bengaluru, India (Remote)" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Achievements</label>
            ${(t.bullets||[""]).map((o,l)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">▪</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${s}" data-bullet-index="${l}" value="${c(o)}" placeholder="Action verb + context + measurable impact..." style="flex:1;" />
                ${t.bullets.length>1?`<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${s}" data-bullet-index="${l}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${s}">+ Add Bullet Point</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience / Internship</button>
    </div>
  `}function ae(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="projects">
      <h2 class="form-section-title">🚀 Academic & Personal Projects</h2>
      <p class="form-section-desc">Key technical projects with technology stack and working repository link.</p>

      ${a.projects.map((t,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${s+1}</span>
            <button class="delete-btn proj-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project Title</label>
              <input type="text" class="form-input" data-proj-field="name" data-proj-index="${s}" value="${c(t.name)}" placeholder="e.g. Distributed Task Orchestrator" />
            </div>
            <div class="form-group">
              <label class="form-label">Tech Stack (in brackets)</label>
              <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${s}" value="${c(t.techStack)}" placeholder="e.g. React, Node.js, Redis, Docker" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="month" class="form-input" data-proj-field="startDate" data-proj-index="${s}" value="${c(t.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="month" class="form-input" data-proj-field="endDate" data-proj-index="${s}" value="${c(t.endDate)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Repository / Live Demo URL</label>
            <input type="url" class="form-input" data-proj-field="link" data-proj-index="${s}" value="${c(t.link)}" placeholder="https://github.com/username/project" />
          </div>

          <div class="form-group">
            <label class="form-label">Project Description & Bullets</label>
            ${(t.bullets||[""]).map((o,l)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">▪</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${s}" data-bullet-index="${l}" value="${c(o)}" placeholder="Describe problem solved, technical complexity..." style="flex:1;" />
                ${t.bullets.length>1?`<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${s}" data-bullet-index="${l}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${s}">+ Add Bullet Point</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project</button>
    </div>
  `}function ie(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="achievements">
      <h2 class="form-section-title">🏆 Awards & Certifications</h2>
      <p class="form-section-desc">Competitive coding achievements, hackathons, certifications, or scholarships.</p>

      ${a.achievements.map((t,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Achievement #${s+1}</span>
            <button class="delete-btn ach-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Title / Recognition</label>
              <input type="text" class="form-input" data-ach-field="title" data-ach-index="${s}" value="${c(t.title)}" placeholder="e.g. Winner - Smart India Hackathon 2024" />
            </div>
            <div class="form-group">
              <label class="form-label">Date / Year</label>
              <input type="text" class="form-input" data-ach-field="date" data-ach-index="${s}" value="${c(t.date)}" placeholder="e.g. Dec 2024" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Brief Description / Issuing Body</label>
            <input type="text" class="form-input" data-ach-field="description" data-ach-index="${s}" value="${c(t.description)}" placeholder="e.g. Awarded 1st place out of 500+ national teams." />
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-achievement">+ Add Achievement / Certification</button>
    </div>
  `}function se(a,e){return`
    <div class="form-section ${e?"active":""}" data-form="leadership">
      <h2 class="form-section-title">👑 Leadership & Initiatives</h2>
      <p class="form-section-desc">Positions of responsibility, club coordination, or student council roles.</p>

      ${a.leadership.map((t,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Position #${s+1}</span>
            <button class="delete-btn lead-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role</label>
              <input type="text" class="form-input" data-lead-field="role" data-lead-index="${s}" value="${c(t.role)}" placeholder="e.g. Lead Organizer" />
            </div>
            <div class="form-group">
              <label class="form-label">Society / Organization</label>
              <input type="text" class="form-input" data-lead-field="organization" data-lead-index="${s}" value="${c(t.organization)}" placeholder="e.g. Amity ACM Student Chapter" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Duration</label>
              <input type="text" class="form-input" data-lead-field="date" data-lead-index="${s}" value="${c(t.date)}" placeholder="e.g. Aug 2023 – Present" />
            </div>
            <div class="form-group">
              <label class="form-label">Contribution</label>
              <input type="text" class="form-input" data-lead-field="description" data-lead-index="${s}" value="${c(t.description)}" placeholder="e.g. Led a team of 15 students to host annual hackathon with 800+ attendees." />
            </div>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-leadership">+ Add Leadership Role</button>
    </div>
  `}function le(a,e){const t=a.links||{};return`
    <div class="form-section ${e?"active":""}" data-form="links">
      <h2 class="form-section-title">🔗 Professional Profile Links</h2>
      <p class="form-section-desc">Per PRD Section 8: URLs will be formatted as clean, clickable labels (e.g. <strong>GitHub</strong>, <strong>LinkedIn</strong>) in the PDF.</p>

      <div class="form-group">
        <label class="form-label">GitHub Profile URL</label>
        <input type="url" class="form-input" id="input-github" value="${c(t.github)}" placeholder="https://github.com/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">LinkedIn Profile URL</label>
        <input type="url" class="form-input" id="input-linkedin" value="${c(t.linkedin)}" placeholder="https://linkedin.com/in/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">LeetCode Profile URL</label>
        <input type="url" class="form-input" id="input-leetcode" value="${c(t.leetcode)}" placeholder="https://leetcode.com/your-username" />
      </div>

      <div class="form-group">
        <label class="form-label">Portfolio / Personal Website</label>
        <input type="url" class="form-input" id="input-portfolio" value="${c(t.portfolio)}" placeholder="https://yourportfolio.dev" />
      </div>

      <div class="form-group">
        <label class="form-label">Other Allowed Profile Link</label>
        <input type="url" class="form-input" id="input-other-link" value="${c(t.other)}" placeholder="https://codeforces.com/profile/username" />
      </div>
    </div>
  `}function ne(a,e){const t=a.declaration||{};return`
    <div class="form-section ${e?"active":""}" data-form="declaration">
      <h2 class="form-section-title">📝 Self Declaration</h2>
      <p class="form-section-desc">Authorized self-declaration wording per Amity placement cell template.</p>

      <div class="form-group">
        <label class="form-label">Declaration Statement</label>
        <textarea class="form-textarea" id="input-decl-text" rows="3">${c(t.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Place <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-decl-place" value="${c(t.place)}" placeholder="e.g. Noida, Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="input-decl-date" value="${c(t.date)}" />
        </div>
      </div>
    </div>
  `}async function re(a,e){const t=a.validate();if(t.length>0){const s=t.map(o=>o.message).join(`
• `);e.show(`Please complete required fields:
• ${s}`,"error");return}e.show("Preparing high-resolution PDF download...","info");try{const{default:s}=await Y(async()=>{const{default:b}=await import("./html2pdf-CBnKDYSq.js").then(E=>E.h);return{default:b}},[]),o=a.getData(),l=document.createElement("div");l.style.cssText="position:absolute;left:-9999px;top:0;width:210mm;background:#fff;",l.innerHTML=`
      <div class="resume-preview" style="width:210mm;min-height:297mm;box-shadow:none;border:none;padding:12mm 15mm;">
        ${F(o)}
      </div>
    `,document.body.appendChild(l);const u=l.querySelector(".resume-preview"),m={margin:0,filename:`${(o.personal.fullName||"Student").replace(/\s+/g,"_")}_Amity_Resume.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},enableLinks:!0};await s().set(m).from(u).save(),document.body.removeChild(l),e.show("PDF downloaded successfully! (You can also use Native Print for vector PDF)","success")}catch(s){console.error("PDF export error:",s),e.show('Download failed. Please click "Native Print" to save as PDF directly.',"error")}}function c(a){if(!a)return"";const e=document.createElement("div");return e.textContent=String(a),e.innerHTML}function oe({currentView:a,onBack:e,onSave:t,onDelete:s}){const o=document.createElement("header");return o.className="header",o.innerHTML=`
    <div class="header-logo">
      <span class="logo-accent">ur</span>-CV
    </div>
    <div class="header-actions" id="header-actions">
      ${a==="builder"?`
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to start">← Back</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft">💾 Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Delete draft">🗑 Delete</button>
      `:'<span class="tag tag--green">Free & Open Source</span>'}
    </div>
  `,a==="builder"&&setTimeout(()=>{var l,u,r;(l=document.getElementById("btn-back"))==null||l.addEventListener("click",e),(u=document.getElementById("btn-save"))==null||u.addEventListener("click",t),(r=document.getElementById("btn-delete"))==null||r.addEventListener("click",s)},0),o}function de(){const a=document.createElement("footer");return a.className="footer",a.innerHTML=`
    <p>
      <strong>ur-CV</strong> — Amity Resume Builder &copy; ${new Date().getFullYear()}<br>
      Built with ❤ for Amity University students. 
      <a href="https://github.com/Abhishek09821/ur-CV" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p style="margin-top: 8px; font-size: 0.7rem; opacity: 0.7;">
      This tool does not guarantee ATS success or interview selection. 
      AI suggestions are based on your profile only — no claims are fabricated.
    </p>
  `,a}class ce{show(e,t="info",s=3e3){const o=document.getElementById("toast-container")||this.createContainer(),l=document.createElement("div");l.className=`toast toast--${t}`,l.innerHTML=`
      <span>${this.getIcon(t)}</span>
      <span>${e}</span>
    `,o.appendChild(l),setTimeout(()=>{l.style.transition="all 0.3s ease",l.style.opacity="0",l.style.transform="translateX(100px)",setTimeout(()=>l.remove(),300)},s)}createContainer(){const e=document.createElement("div");return e.className="toast-container",e.id="toast-container",document.body.appendChild(e),e}getIcon(e){const t={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};return t[e]||t.info}}class pe{constructor(){this.store=new M,this.toast=new ce,this.currentView="landing",this.mode=null,this.root=document.getElementById("app"),this.init()}init(){this.render(),this.loadDraft()}loadDraft(){const e=localStorage.getItem("ur-cv-draft");if(e)try{const t=JSON.parse(e);this.store.loadData(t)}catch(t){console.warn("Failed to load draft:",t)}}saveDraft(){try{localStorage.setItem("ur-cv-draft",JSON.stringify(this.store.getData())),this.toast.show("Draft saved!","success")}catch{this.toast.show("Failed to save draft","error")}}deleteDraft(){localStorage.removeItem("ur-cv-draft"),this.store.reset(),this.toast.show("Draft deleted!","info"),this.navigateTo("landing")}navigateTo(e,t=null){this.currentView=e,t&&(this.mode=t),this.render()}render(){this.root.innerHTML="";const e=oe({currentView:this.currentView,onBack:()=>this.navigateTo("landing"),onSave:()=>this.saveDraft(),onDelete:()=>{confirm("Are you sure you want to delete your draft? This cannot be undone.")&&this.deleteDraft()}});if(this.root.appendChild(e),this.currentView==="landing"){const s=document.createElement("div");s.className="ticker",s.innerHTML=`
        <div class="ticker-inner">
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
        </div>
      `,this.root.appendChild(s)}if(this.currentView==="landing"){const s=J({onSelectMode:o=>this.navigateTo("builder",o)});this.root.appendChild(s)}else if(this.currentView==="builder"){const s=X({store:this.store,mode:this.mode,toast:this.toast,onSave:()=>this.saveDraft(),onBack:()=>this.navigateTo("landing")});this.root.appendChild(s)}const t=de();if(this.root.appendChild(t),!document.querySelector(".toast-container")){const s=document.createElement("div");s.className="toast-container",s.id="toast-container",document.body.appendChild(s)}}}const ue=new pe;window.app=ue;export{Y as _};
