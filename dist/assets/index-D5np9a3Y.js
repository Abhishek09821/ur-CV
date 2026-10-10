(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const C="data:image/jpeg;base64,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",H="data:image/jpeg;base64,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",L={personal:{fullName:"Abhishek Tiwari",address:"Gayatri Vihar Colony, Pinto Park Rd, Gwalior 474005",phone:"+919691966023",email:"abhishek.tiwarii9821@gmail.com",photo:H},objective:"Motivated final-year B.Tech Computer Science student with a strong foundation in software architecture, full-stack development, and AI/ML-driven solutions. Adept at writing clean, reusable code, integrating APIs, and quickly adapting to new frameworks. Seeking a Trainee Software Engineer role to design and deliver scalable, end-to-end features using core programming skills in Java and Python.",academic:["BTech- CGPA 7.79 | Minor in Cyber Security","Senior Secondary (12th), CBSE – 69.8%","Secondary (10th), CBSE – 70.8%"],experience:[{title:"Web Development Internship",company:"Edunet Foundation – AICTE Collaboration",duration:"Aug 21, 2025 – Sep 30, 2025 (6 weeks, Virtual)",bullets:["Built and debugged responsive, user-friendly web interfaces using HTML, CSS, and JavaScript","Strengthened UI/UX understanding and applied modern front-end web development practices","Collaborated with virtual team members and consistently delivered tasks within set timelines"]},{title:"Palo Alto Networks Cybersecurity Virtual Internship",company:"EduSkills Collaboration",duration:"Oct 2025 – Dec 2025 (3 months, Virtual)",bullets:["Completed structured cybersecurity training covering network security, threat detection, and security operations fundamentals under the Palo Alto Networks curriculum","Gained hands-on exposure to firewall configurations, threat prevention techniques, and security frameworks through guided virtual labs","Strengthened understanding of enterprise cybersecurity practices and industry-standard security tools"]}],projects:[{name:"FINMATE AI",techStack:"Python, Flask, MySQL, LLM, RAG, React.js",bullets:["Built an AI-powered financial intelligence platform that analyses financial data and generates structured, actionable insights for informed decision-making.","Implemented Retrieval-Augmented Generation (RAG) pipelines and intelligent document processing to extract and contextualise information from unstructured financial documents.","Engineered efficient backend data workflows in Python & Flask to transform raw outputs into decision-support systems. and a powerful AI Advisor that can tackle any money related issue","Applied statistical analysis and AI-driven techniques to deliver personalised financial recommendations, improving information accessibility and decision quality."]},{name:"CANARY-WORKSPACE AI FILE",techStack:"Python, Flask, SQLite, Fernet Encryption, Telegram and multichannel API",bullets:["Built a lightweight file-monitoring and managing tool to manage and detect unauthorized file access in real time.","Implemented webcam snapshot capture, IP chat for managing files and multi-channel API integrations that use access events.","Designed a dark-themed monitoring dashboard for real-time visibility into access events and system activity.","Secured sensitive logs and captured evidence using Fernet encryption to protect against tampering."]}],skills:[{category:"Web Development and Backend",skills:"React.js, JavaScript (ES6+), HTML5, CSS3, Responsive Web Design, DOM Manipulation, REST APIs, Node.js, NPM."},{category:"Frameworks & Technologies",skills:"Next.js (App Router), Node.js, Express.js, Flask, Tailwind CSS"},{category:"Programming & Core Skills",skills:"Python, SQL, Java, C++, Object-Oriented Programming (OOP), Data Structures & Algorithms, Software Architecture."},{category:"AI & Machine Learning",skills:"LLM Applications, Prompt Engineering, RAG Systems, AI APIs, Machine Learning"},{category:"Databases",skills:"MySQL, Relational Database Design, Database Query Optimization, JSON-based Storage"},{category:"Cybersecurity Tools",skills:"Digital Forensics Tools, Cyber Law Frameworks, Threat Analysis Tools"},{category:"Integrations",skills:"Razorpay (Payments), PDF Generation, Messaging APIs, Third-Party API Integration"},{category:"Data & Analytics",skills:"Microsoft Excel"},{category:"Operating Systems",skills:"Windows, Unix/Linux"},{category:"Developer & Analytics Tools",skills:"Git, GitHub, VS Code, OpenCV, Claude, Cursor, Excel, Firebase, Supabase, Kiro, Antigravity"}],awards:["Tata Cybersecurity Analyst Certification","Google Generative AI Certification","Oracle Networking Professional Certification","IBM Web Development Certification","Palo Alto Cybersecurity Certification","3x Hackathon Participation Experience (Including 1x Winner)"],leadership:[{title:"End-to-End Application Delivery",description:"Independently conceptualized, engineered, and deployed scalable AI and web software projects from scratch."},{title:"",description:"Collaborated with peers during hackathons and academic projects to build and ship full-stack solutions under tight timelines."},{title:"",description:"Demonstrated ownership by identifying real-world problems and building responsive, user-focused web solutions to address them."}],links:[{label:"Linkedin",url:"https://www.linkedin.com/in/abhishektiwarii/"},{label:"Github",url:"https://github.com/Abhishek09821"},{label:"LeetCode",url:"https://leetcode.com/u/abhishektiwarii9821/"}],declaration:{text:"I hereby declare that all the above information is true to the best of my knowledge and belief.",date:"23rd July 2026",place:"Gwalior"}};class N{constructor(){this.data=JSON.parse(JSON.stringify(L)),this.listeners=[]}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(a=>a!==e)}}notify(){this.listeners.forEach(e=>e(this.data))}getData(){return JSON.parse(JSON.stringify(this.data))}loadData(e){e&&typeof e=="object"&&(e.academic&&!Array.isArray(e.academic)&&delete e.academic,e.skills&&!Array.isArray(e.skills)&&delete e.skills,this.data={...JSON.parse(JSON.stringify(L)),...e},this.notify())}reset(){this.data=JSON.parse(JSON.stringify(L)),this.notify()}updatePersonal(e,a){this.data.personal[e]=a,this.notify()}setPhoto(e){this.data.personal.photo=e,this.notify()}updateObjective(e){this.data.objective=e,this.notify()}setAcademic(e){this.data.academic=e,this.notify()}addAcademicBullet(e=""){this.data.academic.push(e),this.notify()}updateAcademicBullet(e,a){this.data.academic[e]!==void 0&&(this.data.academic[e]=a,this.notify())}removeAcademicBullet(e){this.data.academic.splice(e,1),this.notify()}addExperience(){this.data.experience.push({title:"",company:"",duration:"",bullets:[""]}),this.notify()}updateExperience(e,a,r){this.data.experience[e]&&(this.data.experience[e][a]=r,this.notify())}removeExperience(e){this.data.experience.splice(e,1),this.notify()}addExperienceBullet(e){this.data.experience[e]&&(this.data.experience[e].bullets.push(""),this.notify())}updateExperienceBullet(e,a,r){this.data.experience[e]&&this.data.experience[e].bullets&&(this.data.experience[e].bullets[a]=r,this.notify())}removeExperienceBullet(e,a){this.data.experience[e]&&this.data.experience[e].bullets&&(this.data.experience[e].bullets.splice(a,1),this.notify())}addProject(){this.data.projects.push({name:"",techStack:"",bullets:[""]}),this.notify()}updateProject(e,a,r){this.data.projects[e]&&(this.data.projects[e][a]=r,this.notify())}removeProject(e){this.data.projects.splice(e,1),this.notify()}addProjectBullet(e){this.data.projects[e]&&(this.data.projects[e].bullets.push(""),this.notify())}updateProjectBullet(e,a,r){this.data.projects[e]&&this.data.projects[e].bullets&&(this.data.projects[e].bullets[a]=r,this.notify())}removeProjectBullet(e,a){this.data.projects[e]&&this.data.projects[e].bullets&&(this.data.projects[e].bullets.splice(a,1),this.notify())}addSkillCategory(e="",a=""){this.data.skills.push({category:e,skills:a}),this.notify()}updateSkillCategory(e,a,r){this.data.skills[e]&&(this.data.skills[e][a]=r,this.notify())}removeSkillCategory(e){this.data.skills.splice(e,1),this.notify()}addAward(e=""){this.data.awards.push(e),this.notify()}updateAward(e,a){this.data.awards[e]!==void 0&&(this.data.awards[e]=a,this.notify())}removeAward(e){this.data.awards.splice(e,1),this.notify()}addLeadership(e="",a=""){this.data.leadership.push({title:e,description:a}),this.notify()}updateLeadership(e,a,r){this.data.leadership[e]&&(this.data.leadership[e][a]=r,this.notify())}removeLeadership(e){this.data.leadership.splice(e,1),this.notify()}addLink(e="",a=""){this.data.links.push({label:e,url:a}),this.notify()}updateLink(e,a,r){this.data.links[e]&&(this.data.links[e][a]=r,this.notify())}removeLink(e){this.data.links.splice(e,1),this.notify()}updateDeclaration(e,a){this.data.declaration[e]=a,this.notify()}validate(){const e=[],a=this.data.personal;return a.fullName.trim()||e.push({section:"personal",field:"fullName",message:"Full name is required"}),a.email.trim()||e.push({section:"personal",field:"email",message:"Email is required"}),a.phone.trim()||e.push({section:"personal",field:"phone",message:"Phone number is required"}),e}getCompletionStatus(){const e=this.data;return{personal:!!(e.personal.fullName&&e.personal.email&&e.personal.phone),objective:!!(e.objective&&e.objective.trim()),academic:e.academic.length>0,experience:e.experience.length>0,projects:e.projects.length>0,skills:e.skills.length>0,awards:e.awards.length>0,leadership:e.leadership.length>0,links:e.links.length>0,declaration:!!(e.declaration.place&&e.declaration.date)}}}function O({onSelectMode:t}){const e=document.createElement("section");return e.className="landing",e.innerHTML=`
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
  `,setTimeout(()=>{const a=document.getElementById("landing-modes");a&&a.addEventListener("click",r=>{const s=r.target.closest(".mode-card");if(s){const n=s.dataset.mode;s.style.transform="scale(0.95)",setTimeout(()=>{t(n)},150)}})},0),e}const M="modulepreload",V=function(t){return"/"+t},q={},G=function(e,a,r){let s=Promise.resolve();if(a&&a.length>0){let o=function(f){return Promise.all(f.map(d=>Promise.resolve(d).then(y=>({status:"fulfilled",value:y}),y=>({status:"rejected",reason:y}))))};document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),c=(p==null?void 0:p.nonce)||(p==null?void 0:p.getAttribute("nonce"));s=o(a.map(f=>{if(f=V(f),f in q)return;q[f]=!0;const d=f.endsWith(".css"),y=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${y}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":M,d||(l.as="script"),l.crossOrigin="",l.href=f,c&&l.setAttribute("nonce",c),document.head.appendChild(l),d)return new Promise((h,m)=>{l.addEventListener("load",h),l.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${f}`)))})}))}function n(o){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=o,window.dispatchEvent(p),!p.defaultPrevented)throw o}return s.then(o=>{for(const p of o||[])p.status==="rejected"&&n(p.reason);return e().catch(n)})};function K(t){return t?`
    <div class="amity-resume-wrapper">
      <div class="amity-resume-sheet" id="amity-sheet-preview">
        ${F(t)}
      </div>
    </div>
  `:""}function F(t){const e=t.personal||{},a=t.academic||[],r=t.experience||[],s=t.projects||[],n=t.skills||[],o=t.awards||[],p=t.leadership||[],c=t.links||[],f=t.declaration||{};return`
    <div class="amity-resume-container">
      <!-- ================= HEADER ================= -->
      <header class="amity-header">
        <div class="amity-header-left">
          <img src="${C}" class="amity-shield-logo" alt="Amity University Logo" />
        </div>

        <div class="amity-header-center">
          <h1 class="amity-candidate-name">${w(e.fullName)||"Abhishek Tiwari"}</h1>
          <div class="amity-candidate-contact-line"><strong>Address:</strong> ${w(e.address||"")}</div>
          <div class="amity-candidate-contact-line"><strong>Phone:</strong> ${w(e.phone||"")}</div>
          <div class="amity-candidate-contact-line">
            <strong>Email:</strong> ${e.email?`<a href="mailto:${w(e.email)}" class="amity-link-blue">${w(e.email)}</a>`:""}
          </div>
        </div>

        <div class="amity-header-right">
          ${e.photo?`
            <img src="${e.photo}" class="amity-photo-box" alt="Candidate Photo" />
          `:`
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
      ${t.objective?`
        <section class="amity-section">
          <div class="amity-bar">CAREER OBJECTIVE</div>
          <div class="amity-content">
            <p class="amity-text-justified">${w(t.objective)}</p>
          </div>
        </section>
      `:""}

      <!-- ================= ACADEMIC DETAILS ================= -->
      ${a.length>0?`
        <section class="amity-section">
          <div class="amity-bar">ACADEMIC DETAILS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${a.map(d=>`<li>${w(String(d).replace(/^[•\-\*]\s*/,""))}</li>`).join("")}
            </ul>
          </div>
        </section>
      `:""}

      <!-- ================= EXPERIENCE ================= -->
      ${r.length>0?`
        <section class="amity-section">
          <div class="amity-bar">EXPERIENCE</div>
          <div class="amity-content">
            ${r.map(d=>`
              <div class="amity-item">
                <div class="amity-item-title">
                  <strong>${w(d.title||"")}${d.company?` | ${w(d.company)}`:""}</strong>
                </div>
                ${d.duration?`<div class="amity-item-sub"><em>${w(d.duration)}</em></div>`:""}
                ${d.bullets&&d.bullets.filter(Boolean).length>0?`
                  <ul class="amity-bullet-list">
                    ${d.bullets.filter(Boolean).map(y=>`<li>${w(y)}</li>`).join("")}
                  </ul>
                `:""}
              </div>
            `).join("")}
          </div>
        </section>
      `:""}

      <!-- ================= PROJECTS ================= -->
      ${s.length>0?`
        <section class="amity-section">
          <div class="amity-bar">PROJECTS</div>
          <div class="amity-content">
            ${s.map(d=>`
              <div class="amity-item">
                <div class="amity-item-title">
                  <strong>${w(d.name||"")}</strong>
                </div>
                ${d.techStack?`
                  <div class="amity-item-tech">
                    <strong>Tech Stack:</strong> ${w(d.techStack)}
                  </div>
                `:""}
                ${d.bullets&&d.bullets.filter(Boolean).length>0?`
                  <ul class="amity-bullet-list">
                    ${d.bullets.filter(Boolean).map(y=>`<li>${w(y)}</li>`).join("")}
                  </ul>
                `:""}
              </div>
            `).join("")}
          </div>
        </section>
      `:""}

      <!-- ================= TECHNICAL SKILLS ================= -->
      ${n.length>0?`
        <section class="amity-section">
          <div class="amity-bar">TECHNICAL SKILLS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${n.map(d=>`
                <li><strong>${w(d.category)}:</strong> ${w(d.skills)}</li>
              `).join("")}
            </ul>
          </div>
        </section>
      `:""}

      <!-- ================= AWARDS AND ACHIEVEMENTS ================= -->
      ${o.length>0?`
        <section class="amity-section">
          <div class="amity-bar">AWARDS AND ACHIEVEMENTS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${o.map(d=>`<li>${w(String(d).replace(/^[•\-\*]\s*/,""))}</li>`).join("")}
            </ul>
          </div>
        </section>
      `:""}

      <!-- ================= LEADERSHIP & INITIATIVE ================= -->
      ${p.length>0?`
        <section class="amity-section">
          <div class="amity-bar">LEADERSHIP & INITIATIVE</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${p.map(d=>`
                <li>${d.title?`<strong>${w(d.title)}:</strong> `:""}${w(d.description||"")}</li>
              `).join("")}
            </ul>
          </div>
        </section>
      `:""}

      <!-- ================= LINKS ================= -->
      ${c.length>0?`
        <section class="amity-section">
          <div class="amity-bar">LINKS</div>
          <div class="amity-content">
            <ul class="amity-bullet-list">
              ${c.map(d=>`
                <li><a href="${w(d.url)}" target="_blank" class="amity-link-blue">${w(d.label||d.url)}</a></li>
              `).join("")}
            </ul>
          </div>
        </section>
      `:""}

      <!-- ================= SELF DECLARATION ================= -->
      ${f.text?`
        <section class="amity-section amity-declaration-section">
          <div class="amity-bar">SELF DECLARATION</div>
          <div class="amity-content">
            <p class="amity-text-justified">${w(f.text)}</p>
            <div class="amity-declaration-footer">
              <div class="amity-decl-left">
                ${f.date?`<div><strong>Date:</strong> ${w(f.date)}</div>`:""}
                ${f.place?`<div><strong>Place:</strong> ${w(f.place)}</div>`:""}
              </div>
              <div class="amity-decl-center-bar"></div>
              <div class="amity-decl-right">
                <strong>${w(e.fullName||"Abhishek Tiwari")}</strong>
              </div>
            </div>
          </div>
        </section>
      `:""}
    </div>
  `}function w(t){if(!t)return"";const e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function W({store:t,toast:e}){const a=document.createElement("div");a.className="jd-panel active";let r="",s=!1,n=[],o=!1,p=null;function c(){a.innerHTML=`
      <!-- Privacy Consent Banner -->
      ${o?`
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
              >${I(r)}</textarea>
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

            <button class="btn btn--purple btn--block mt-lg" id="btn-analyze-jd" ${s?"disabled":""}>
              ${s?"⏳ Analyzing JD & Matching Profile...":"⚡ Analyze JD & Generate Grounded Suggestions"}
            </button>
          </div>

          <!-- Extracted JD Analysis Summary -->
          ${p?`
            <div class="jd-extracted-summary mt-lg">
              <div class="summary-header">
                <span class="badge badge--green">EXTRACTED JD REQUIREMENTS</span>
                <span style="font-size:0.8rem;color:var(--text-muted);">Confidence: High</span>
              </div>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Target Role:</span>
                  <strong>${I(p.roleTitle||"Software Engineer / Technology Role")}</strong>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Key Requirements Found:</span>
                  <div class="tag-cloud">
                    ${p.requiredSkills.map(l=>`<span class="tag tag--yellow">${I(l)}</span>`).join(" ")}
                  </div>
                </div>
              </div>
            </div>
          `:""}

          <!-- Suggestions List -->
          ${n.length>0?`
            <div class="mt-xl">
              <div class="flex items-center justify-between mb-md">
                <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1.05rem;">
                  ✨ Grounded Suggestions <span class="tag tag--green">${n.length} available</span>
                </h3>
                <span class="form-hint">Per PRD: Only verified profile facts are used</span>
              </div>

              <div class="suggestions-list">
                ${n.map((l,h)=>`
                  <div class="suggestion-card ${l.type==="Gap Analysis"?"suggestion-card--warning":""}" data-sug-index="${h}">
                    <div class="suggestion-header">
                      <div class="flex items-center gap-sm">
                        <span class="tag tag--dark">${I(l.section)}</span>
                        <span>${I(l.type)}</span>
                      </div>
                      <span class="tag tag--${l.confidence==="high"?"green":l.confidence==="medium"?"blue":"pink"}">
                        ${l.confidence} confidence
                      </span>
                    </div>

                    <div class="suggestion-body">
                      <!-- Diff or Comparison -->
                      ${l.originalText?`
                        <div class="suggestion-diff">
                          <div class="diff-block diff-original">
                            <span class="diff-label">CURRENT PROFILE:</span>
                            <p>${I(l.originalText)}</p>
                          </div>
                          <div class="diff-block diff-suggested">
                            <span class="diff-label">RECOMMENDED EDIT:</span>
                            <p>${I(l.suggestedText)}</p>
                          </div>
                        </div>
                      `:`
                        <div class="suggestion-text">
                          <p><strong>${I(l.text)}</strong></p>
                        </div>
                      `}

                      <div class="suggestion-source">
                        📌 <strong>Profile Provenance:</strong> ${I(l.source)}
                      </div>
                    </div>

                    <div class="suggestion-actions">
                      <button class="btn btn--sm btn--green suggestion-accept" data-index="${h}">✓ Accept & Apply</button>
                      <button class="btn btn--sm btn--white suggestion-edit" data-index="${h}">✏️ Edit Before Applying</button>
                      <button class="btn btn--sm btn--red suggestion-reject" data-index="${h}">✕ Dismiss</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `:p&&!s?`
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
    `,f()}function f(){var u,b,j,S;(u=a.querySelector("#btn-consent-accept"))==null||u.addEventListener("click",()=>{o=!0,c(),e.show("Privacy consent recorded. You can now analyze your JD.","success")}),(b=a.querySelector("#btn-consent-decline"))==null||b.addEventListener("click",()=>{e.show("Switched to Manual Mode.","info"),a.classList.remove("active")}),(j=a.querySelector("#jd-accordion-toggle"))==null||j.addEventListener("click",()=>{const g=a.querySelector("#jd-accordion-body"),x=a.querySelector("#jd-accordion-icon");if(g){const A=g.style.display==="none";g.style.display=A?"block":"none",x&&(x.textContent=A?"▼":"►")}});const l=a.querySelector("#jd-textarea");l&&l.addEventListener("input",g=>{r=g.target.value});const h=a.querySelector("#jd-upload-area"),m=a.querySelector("#jd-file-input");h&&m&&(h.addEventListener("click",()=>m.click()),m.addEventListener("change",g=>{const x=g.target.files[0];if(x){if(x.size>2*1024*1024){e.show("File exceeds 2MB limit. Please paste text instead.","error");return}if(x.name.endsWith(".txt")||x.type==="text/plain"){const A=new FileReader;A.onload=R=>{r=R.target.result,c(),e.show("Loaded JD text from file!","success")},A.readAsText(x)}else{e.show("Extracting text... If formatting is complex, paste raw text directly.","info");const A=new FileReader;A.onload=R=>{const P=R.target.result,T=String(P).replace(/[^\x20-\x7E\t\n\r]/g," ").replace(/\s+/g," ").trim();T.length>50?(r=T.substring(0,4e3),c(),e.show("Extracted text preview from document.","success")):e.show("Could not parse document cleanly. Please paste text directly.","warning")},A.readAsText(x)}}})),(S=a.querySelector("#btn-analyze-jd"))==null||S.addEventListener("click",()=>{if(!r||r.trim().length<20){e.show("Please enter at least a few lines of job description text.","warning");return}d()}),a.querySelectorAll(".suggestion-accept").forEach(g=>{g.addEventListener("click",()=>{const x=parseInt(g.dataset.index,10),A=n[x];A&&(y(A),n.splice(x,1),c())})}),a.querySelectorAll(".suggestion-edit").forEach(g=>{g.addEventListener("click",()=>{const x=parseInt(g.dataset.index,10),A=n[x];if(!A)return;const R=A.suggestedText||A.text,P=prompt("Edit suggestion before applying to your resume:",R);P!==null&&P.trim()&&(A.suggestedText=P.trim(),A.text=P.trim(),y(A),n.splice(x,1),c())})}),a.querySelectorAll(".suggestion-reject").forEach(g=>{g.addEventListener("click",()=>{const x=parseInt(g.dataset.index,10);n.splice(x,1),c(),e.show("Suggestion dismissed.","info")})})}function d(){s=!0,c(),setTimeout(()=>{const l=t.getData(),h=z(r,l);p=h.info,n=h.suggestions,s=!1,c(),e.show(`Analysis complete: ${n.length} grounded suggestion(s) generated.`,"success")},800)}function y(l){var h;if(l.action==="SET_OBJECTIVE")t.updateObjective(l.suggestedText||l.text),e.show("Updated Career Objective!","success");else if(l.action==="REORDER_SKILLS")l.catIndex!==void 0&&l.suggestedText&&(t.updateSkillCategory(l.catIndex,"skills",l.suggestedText),e.show(`Prioritized ${l.category} skills for this role!`,"success"));else if(l.action==="ADD_SKILL")if(l.catIndex!==void 0){const m=((h=t.getData().skills[l.catIndex])==null?void 0:h.skills)||"",u=m?`${m}, ${l.skillName}`:l.skillName;t.updateSkillCategory(l.catIndex,"skills",u),e.show(`Added ${l.skillName} to verified ${l.category}!`,"success")}else t.addSkillCategory(l.category||"Technical Skills",l.skillName),e.show(`Added ${l.skillName} category!`,"success");else l.action==="UPDATE_PROJECT_BULLET"?l.projIndex!==void 0&&l.bulletIndex!==void 0&&(t.updateProjectBullet(l.projIndex,l.bulletIndex,l.suggestedText||l.text),e.show("Updated project bullet!","success")):l.action==="UPDATE_EXPERIENCE_BULLET"?l.expIndex!==void 0&&l.bulletIndex!==void 0&&(t.updateExperienceBullet(l.expIndex,l.bulletIndex,l.suggestedText||l.text),e.show("Updated experience bullet!","success")):e.show("Suggestion accepted!","success")}return c(),a}function z(t,e){const a=t.toLowerCase(),s=["python","java","javascript","typescript","c++","c#","golang","rust","ruby","php","swift","kotlin","react","angular","vue","node.js","node","express","django","flask","spring boot","spring","next.js","aws","azure","gcp","docker","kubernetes","terraform","ci/cd","jenkins","git","linux","sql","postgresql","mysql","mongodb","redis","elasticsearch","rest api","rest","graphql","microservices","agile","scrum","html","css","tailwind css","tailwind","bootstrap","machine learning","deep learning","nlp","data structures","algorithms"].filter(u=>a.includes(u)),n=Array.isArray(e.skills)?e.skills:[],o=[];n.forEach(u=>{const j=(u.skills||"").split(",").map(S=>S.trim()).filter(Boolean);o.push(...j)});const p=o.map(u=>u.toLowerCase()),c=s.filter(u=>p.some(b=>b.includes(u)||u.includes(b))),f=s.filter(u=>!p.some(b=>b.includes(u)||u.includes(b))),d=[];n.forEach((u,b)=>{const S=(u.skills||"").split(",").map(g=>g.trim()).filter(Boolean);if(S.length>1){const g=[...S].sort((R,P)=>{const T=s.some(v=>R.toLowerCase().includes(v)),i=s.some(v=>P.toLowerCase().includes(v));return T&&!i?-1:!T&&i?1:0}),x=S.join(", "),A=g.join(", ");x!==A&&d.push({section:"Skills",type:"Relevance Ordering",action:"REORDER_SKILLS",catIndex:b,category:u.category,text:`Prioritize ${u.category} matching the JD: ${g.filter(R=>s.some(P=>R.toLowerCase().includes(P))).join(", ")}`,originalText:x,suggestedText:A,source:`Verified student ${u.category} profile against JD keywords (${c.join(", ")})`,confidence:"high"})}});let y="B.Tech Computer Science";if(Array.isArray(e.academic)&&e.academic.length>0){const u=e.academic[0]||"";u.toLowerCase().includes("btech")||u.toLowerCase().includes("b.tech")?y="B.Tech Computer Science":y=u.replace(/^•\s*/,"").split("|")[0].trim()||"graduate"}const l=c.slice(0,4).map(D).join(", "),h=J(a),m=l.length>0?`Motivated final-year ${y} student with a strong foundation in ${l}. Seeking a ${h} role to design and deliver scalable, end-to-end features using clean and reliable code.`:`Motivated final-year ${y} student with a strong foundation in software architecture, web development, and data-driven solutions. Seeking a ${h} role to contribute to scalable engineering projects.`;return d.push({section:"Career Objective",type:"Tailored Summary",action:"SET_OBJECTIVE",text:m,originalText:e.objective||"(Currently blank)",suggestedText:m,source:`Derived from student's degree (${y}) and verified matching skills (${l||"academic foundation"})`,confidence:"high"}),e.projects&&e.projects.length>0&&e.projects.forEach((u,b)=>{const j=(u.techStack||"").toLowerCase();s.some(g=>j.includes(g))&&u.bullets&&u.bullets.length>0&&u.bullets.forEach((g,x)=>{if(g&&g.trim().length>10&&!g.includes("Engineered")){const A=`Engineered ${g.replace(/^(built|created|made|worked on)\s+/i,"")}`;d.push({section:`Projects (${u.name})`,type:"Action Verb Refinement",action:"UPDATE_PROJECT_BULLET",projIndex:b,bulletIndex:x,text:A,originalText:g,suggestedText:A,source:`Student's project "${u.name}" matching JD technology requirement`,confidence:"medium"})}})}),f.length>0&&f.slice(0,3).forEach(u=>{const b=X(u),j=n.findIndex(S=>S.category.toLowerCase().includes(b.toLowerCase()));d.push({section:"Skills Gap Analysis",type:"Gap Analysis",action:"ADD_SKILL",skillName:D(u),catIndex:j!==-1?j:void 0,category:j!==-1?n[j].category:D(b),text:`The JD specifies "${u}", which is not currently in your profile. ONLY accept if you have genuine coursework or practical experience.`,originalText:`Not present in ${b}`,suggestedText:`Add "${D(u)}" to ${b}`,source:"Target JD requirement (Candidate confirmation required per PRD Section 9)",confidence:"medium"})}),{info:{roleTitle:h,requiredSkills:s.slice(0,10).map(D)},suggestions:d}}function J(t){return t.includes("frontend")||t.includes("front-end")||t.includes("react")?"Frontend Developer":t.includes("backend")||t.includes("back-end")||t.includes("node")||t.includes("python")?"Backend Developer":t.includes("full stack")||t.includes("fullstack")?"Full Stack Developer":t.includes("data science")||t.includes("machine learning")?"Data Science / ML Engineer":t.includes("devops")||t.includes("cloud")?"Cloud & DevOps Engineer":"Software Engineer"}function X(t){const e=["python","java","javascript","typescript","c++","c#","golang","rust","ruby","php","swift","kotlin"],a=["react","angular","vue","node.js","node","express","django","flask","spring boot","spring","next.js","tailwind css","tailwind","bootstrap"],r=["sql","postgresql","mysql","mongodb","redis","elasticsearch"],s=["aws","azure","gcp","docker","kubernetes","terraform","ci/cd","jenkins","git","linux"];return e.includes(t)?"languages":a.includes(t)?"frameworks":r.includes(t)?"databases":s.includes(t)?"tools":"other"}function D(t){return t.split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function I(t){if(!t)return"";const e=document.createElement("div");return e.textContent=String(t),e.innerHTML}const B=[{id:"personal",label:"Header & Contact",icon:"👤",required:!0},{id:"objective",label:"Career Objective",icon:"🎯",required:!0},{id:"academic",label:"Academic Details",icon:"🎓",required:!0},{id:"experience",label:"Experience",icon:"💼",required:!1},{id:"projects",label:"Projects",icon:"🚀",required:!1},{id:"skills",label:"Technical Skills",icon:"⚡",required:!0},{id:"awards",label:"Awards & Achievements",icon:"🏆",required:!1},{id:"leadership",label:"Leadership & Initiative",icon:"👑",required:!1},{id:"links",label:"Links",icon:"🔗",required:!1},{id:"declaration",label:"Self Declaration",icon:"📝",required:!0}];function Q({store:t,mode:e,toast:a,onSave:r,onBack:s}){const n=document.createElement("div");n.className="builder-wrapper";let o="personal",p="form";function c(){const l=t.getData(),h=t.getCompletionStatus();n.innerHTML=`
      ${e==="jd-assist"?'<div id="jd-panel-mount"></div>':""}
      
      <!-- Mobile View Switcher -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${p==="form"?"active":""}" data-view="form">✏️ Edit Form</button>
        <button class="toggle-btn ${p==="preview"?"active":""}" data-view="preview">👁 Live Preview</button>
      </div>

      <!-- Top Progress Navigation Bar -->
      <div class="progress-bar">
        ${B.map(m=>`
          <div class="progress-step ${m.id===o?"active":""} ${h[m.id]?"completed":""}" data-section="${m.id}">
            <span class="step-number">${m.icon}</span>
            <span class="step-label">${m.label}</span>
          </div>
        `).join("")}
      </div>

      <div class="builder active">
        <!-- Sidebar Form & Navigation -->
        <div class="builder-sidebar ${p==="preview"?"mobile-hidden":""}">
          <nav class="section-nav">
            ${B.map(m=>`
              <div class="section-nav-item ${m.id===o?"active":""} ${h[m.id]?"completed":""}" data-section="${m.id}">
                <span class="nav-icon">${m.icon}</span>
                <span class="nav-text">${m.label}</span>
                ${m.required?'<span class="required" style="font-size:0.65rem;margin-left:auto;">REQ</span>':""}
                <span class="nav-status">${h[m.id]?"✓":"○"}</span>
              </div>
            `).join("")}
          </nav>

          <!-- Form Panels -->
          <div class="form-container">
            ${Z(l,o==="personal")}
            ${Y(l,o==="objective")}
            ${$(l,o==="academic")}
            ${_(l,o==="experience")}
            ${ee(l,o==="projects")}
            ${te(l,o==="skills")}
            ${ae(l,o==="awards")}
            ${ie(l,o==="leadership")}
            ${ne(l,o==="links")}
            ${se(l,o==="declaration")}
          </div>

          <!-- Bottom Action Toolbar -->
          <div class="builder-actions-toolbar">
            ${o!=="personal"?'<button class="btn btn--white btn--sm" id="btn-prev-section">← Prev</button>':""}
            ${o!=="declaration"?'<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>':""}
            
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
        <div class="builder-preview ${p==="form"?"mobile-hidden":""}" id="preview-panel">
          ${K(l)}
        </div>
      </div>
    `,d()}function f(){const l=n.querySelector("#preview-panel");l&&(l.innerHTML=K(t.getData()));const h=t.getCompletionStatus();B.forEach(m=>{const u=h[m.id],b=n.querySelector(`.section-nav-item[data-section="${m.id}"]`);if(b){b.classList.toggle("completed",!!u);const S=b.querySelector(".nav-status");S&&(S.textContent=u?"✓":"○")}const j=n.querySelector(`.progress-step[data-section="${m.id}"]`);j&&j.classList.toggle("completed",!!u)})}function d(){var h,m,u,b,j,S,g,x,A,R,P,T;n.querySelectorAll("[data-section]").forEach(i=>{i.addEventListener("click",()=>{o=i.dataset.section,c()})}),n.querySelectorAll(".toggle-btn").forEach(i=>{i.addEventListener("click",()=>{p=i.dataset.view,c()})}),(h=n.querySelector("#btn-prev-section"))==null||h.addEventListener("click",()=>{const i=B.findIndex(v=>v.id===o);i>0&&(o=B[i-1].id,c())}),(m=n.querySelector("#btn-next-section"))==null||m.addEventListener("click",()=>{const i=B.findIndex(v=>v.id===o);i<B.length-1&&(o=B[i+1].id,c())}),(u=n.querySelector("#btn-export-pdf"))==null||u.addEventListener("click",()=>{le(t,a)}),(b=n.querySelector("#btn-print-pdf"))==null||b.addEventListener("click",()=>{window.print()}),y("input-fullname",i=>t.updatePersonal("fullName",i)),y("input-address",i=>t.updatePersonal("address",i)),y("input-phone",i=>t.updatePersonal("phone",i)),y("input-email",i=>t.updatePersonal("email",i));const l=n.querySelector("#input-photo");if(l&&l.addEventListener("change",i=>{const v=i.target.files[0];if(v){if(v.size>1*1024*1024){a.show("Photo size must be under 1MB!","error"),l.value="";return}if(!["image/jpeg","image/png"].includes(v.type)){a.show("Only JPEG and PNG photos are supported.","error"),l.value="";return}const E=new FileReader;E.onload=U=>{t.setPhoto(U.target.result),c(),a.show("Passport photo updated (under 1MB).","success")},E.readAsDataURL(v)}}),(j=n.querySelector("#btn-remove-photo"))==null||j.addEventListener("click",()=>{t.setPhoto(null),c(),a.show("Photo removed.","info")}),y("input-objective",i=>t.updateObjective(i)),(S=n.querySelector("#btn-add-academic"))==null||S.addEventListener("click",()=>{t.addAcademicBullet(""),c()}),n.querySelectorAll(".academic-input").forEach(i=>{const v=parseInt(i.dataset.index,10);i.addEventListener("input",()=>{t.updateAcademicBullet(v,i.value),f()})}),n.querySelectorAll(".academic-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeAcademicBullet(parseInt(i.dataset.index,10)),c()})}),(g=n.querySelector("#btn-add-experience"))==null||g.addEventListener("click",()=>{t.addExperience(),c()}),n.querySelectorAll(".exp-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeExperience(parseInt(i.dataset.index,10)),c()})}),n.querySelectorAll("[data-exp-field]").forEach(i=>{const v=parseInt(i.dataset.expIndex,10),E=i.dataset.expField;i.addEventListener("input",()=>{t.updateExperience(v,E,i.value),f()})}),n.querySelectorAll("[data-exp-bullet]").forEach(i=>{const v=parseInt(i.dataset.expIndex,10),E=parseInt(i.dataset.bulletIndex,10);i.addEventListener("input",()=>{t.updateExperienceBullet(v,E,i.value),f()})}),n.querySelectorAll(".exp-add-bullet").forEach(i=>{i.addEventListener("click",()=>{t.addExperienceBullet(parseInt(i.dataset.expIndex,10)),c()})}),n.querySelectorAll(".exp-remove-bullet").forEach(i=>{i.addEventListener("click",()=>{t.removeExperienceBullet(parseInt(i.dataset.expIndex,10),parseInt(i.dataset.bulletIndex,10)),c()})}),(x=n.querySelector("#btn-add-project"))==null||x.addEventListener("click",()=>{t.addProject(),c()}),n.querySelectorAll(".proj-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeProject(parseInt(i.dataset.index,10)),c()})}),n.querySelectorAll("[data-proj-field]").forEach(i=>{const v=parseInt(i.dataset.projIndex,10),E=i.dataset.projField;i.addEventListener("input",()=>{t.updateProject(v,E,i.value),f()})}),n.querySelectorAll("[data-proj-bullet]").forEach(i=>{const v=parseInt(i.dataset.projIndex,10),E=parseInt(i.dataset.bulletIndex,10);i.addEventListener("input",()=>{t.updateProjectBullet(v,E,i.value),f()})}),n.querySelectorAll(".proj-add-bullet").forEach(i=>{i.addEventListener("click",()=>{t.addProjectBullet(parseInt(i.dataset.projIndex,10)),c()})}),n.querySelectorAll(".proj-remove-bullet").forEach(i=>{i.addEventListener("click",()=>{t.removeProjectBullet(parseInt(i.dataset.projIndex,10),parseInt(i.dataset.bulletIndex,10)),c()})}),(A=n.querySelector("#btn-add-skill-cat"))==null||A.addEventListener("click",()=>{t.addSkillCategory("",""),c()}),n.querySelectorAll("[data-skill-field]").forEach(i=>{const v=parseInt(i.dataset.skillIndex,10),E=i.dataset.skillField;i.addEventListener("input",()=>{t.updateSkillCategory(v,E,i.value),f()})}),n.querySelectorAll(".skill-cat-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeSkillCategory(parseInt(i.dataset.index,10)),c()})}),(R=n.querySelector("#btn-add-award"))==null||R.addEventListener("click",()=>{t.addAward(""),c()}),n.querySelectorAll(".award-input").forEach(i=>{const v=parseInt(i.dataset.index,10);i.addEventListener("input",()=>{t.updateAward(v,i.value),f()})}),n.querySelectorAll(".award-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeAward(parseInt(i.dataset.index,10)),c()})}),(P=n.querySelector("#btn-add-leadership"))==null||P.addEventListener("click",()=>{t.addLeadership("",""),c()}),n.querySelectorAll("[data-lead-field]").forEach(i=>{const v=parseInt(i.dataset.leadIndex,10),E=i.dataset.leadField;i.addEventListener("input",()=>{t.updateLeadership(v,E,i.value),f()})}),n.querySelectorAll(".lead-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeLeadership(parseInt(i.dataset.index,10)),c()})}),(T=n.querySelector("#btn-add-link"))==null||T.addEventListener("click",()=>{t.addLink("",""),c()}),n.querySelectorAll("[data-link-field]").forEach(i=>{const v=parseInt(i.dataset.linkIndex,10),E=i.dataset.linkField;i.addEventListener("input",()=>{t.updateLink(v,E,i.value),f()})}),n.querySelectorAll(".link-delete").forEach(i=>{i.addEventListener("click",()=>{t.removeLink(parseInt(i.dataset.index,10)),c()})}),y("input-decl-text",i=>t.updateDeclaration("text",i)),y("input-decl-date",i=>t.updateDeclaration("date",i)),y("input-decl-place",i=>t.updateDeclaration("place",i)),e==="jd-assist"){const i=n.querySelector("#jd-panel-mount");i&&(i.innerHTML="",i.appendChild(W({store:t,toast:a})))}}function y(l,h){const m=n.querySelector(`#${l}`);m&&m.addEventListener("input",()=>{h(m.value),f()})}return c(),n}function Z(t,e){const a=t.personal||{};return`
    <div class="form-section ${e?"active":""}" data-form="personal">
      <h2 class="form-section-title">👤 Header & Contact Info</h2>
      <p class="form-section-desc">Universal Amity Header. The official university logo is permanently embedded on top-left.</p>

      <div class="form-group">
        <label class="form-label">Full Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="input-fullname" value="${k(a.fullName)}" placeholder="e.g. Abhishek Tiwari" />
      </div>

      <div class="form-group">
        <label class="form-label">Full Address <span class="required">*</span></label>
        <input type="text" class="form-input" id="input-address" value="${k(a.address)}" placeholder="e.g. Gayatri Vihar Colony, Pinto Park Rd, Gwalior 474005" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phone Number <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${k(a.phone)}" placeholder="e.g. +919691966023" />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${k(a.email)}" placeholder="e.g. abhishek.tiwarii9821@gmail.com" />
        </div>
      </div>

      <!-- Passport Photo Upload (Limit: 1MB) -->
      <div class="form-group">
        <label class="form-label">Candidate Passport Photo (Max 1MB) <span class="required">*</span></label>
        <div class="photo-upload">
          <div class="photo-preview" style="width:80px;height:100px;">
            ${a.photo?`<img src="${a.photo}" alt="Passport photo" style="width:100%;height:100%;object-fit:cover;" />`:'<span style="font-size:1.8rem;">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${a.photo?'<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>':""}
          </div>
          <p class="form-hint">JPEG or PNG. Strictly max 1MB limit. Cropped to passport proportions on the top-right.</p>
        </div>
      </div>
    </div>
  `}function Y(t,e){return`
    <div class="form-section ${e?"active":""}" data-form="objective">
      <h2 class="form-section-title">🎯 Career Objective</h2>
      <p class="form-section-desc">Full paragraph summary. Formatted with justified text alignment in the PDF.</p>

      <div class="form-group">
        <label class="form-label">Career Objective Text</label>
        <textarea class="form-textarea" id="input-objective" rows="5" placeholder="Motivated final-year B.Tech Computer Science student...">${k(t.objective||"")}</textarea>
        <p class="form-hint">All text is automatically justified per Amity placement standards.</p>
      </div>
    </div>
  `}function $(t,e){const a=t.academic||[];return`
    <div class="form-section ${e?"active":""}" data-form="academic">
      <h2 class="form-section-title">🎓 Academic Details</h2>
      <p class="form-section-desc">Bulleted educational qualifications (BTech CGPA/Minor, 12th CBSE, 10th CBSE).</p>

      ${a.map((r,s)=>`
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">•</span>
          <input type="text" class="form-input academic-input" data-index="${s}" value="${k(r)}" placeholder="e.g. BTech- CGPA 7.79 | Minor in Cyber Security" style="flex:1;" />
          <button class="btn btn--sm btn--red academic-delete" data-index="${s}" title="Delete bullet">✕</button>
        </div>
      `).join("")}

      <button class="add-entry-btn mt-sm" id="btn-add-academic">+ Add Academic Bullet</button>
    </div>
  `}function _(t,e){const a=t.experience||[];return`
    <div class="form-section ${e?"active":""}" data-form="experience">
      <h2 class="form-section-title">💼 Experience / Internships</h2>
      <p class="form-section-desc">Internships, virtual training, or industry experience with bulleted achievements.</p>

      ${a.map((r,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${s+1}</span>
            <button class="delete-btn exp-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>

          <div class="form-group">
            <label class="form-label">Role / Internship Title</label>
            <input type="text" class="form-input" data-exp-field="title" data-exp-index="${s}" value="${k(r.title)}" placeholder="e.g. Web Development Internship" />
          </div>

          <div class="form-group">
            <label class="form-label">Organization / Collaboration</label>
            <input type="text" class="form-input" data-exp-field="company" data-exp-index="${s}" value="${k(r.company)}" placeholder="e.g. Edunet Foundation – AICTE Collaboration" />
          </div>

          <div class="form-group">
            <label class="form-label">Duration & Modality (Italic Line)</label>
            <input type="text" class="form-input" data-exp-field="duration" data-exp-index="${s}" value="${k(r.duration)}" placeholder="e.g. Aug 21, 2025 – Sep 30, 2025 (6 weeks, Virtual)" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(r.bullets||[""]).map((n,o)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${s}" data-bullet-index="${o}" value="${k(n)}" placeholder="Action verb + technical achievement..." style="flex:1;" />
                ${r.bullets.length>1?`<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${s}" data-bullet-index="${o}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${s}">+ Add Bullet</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience Entry</button>
    </div>
  `}function ee(t,e){const a=t.projects||[];return`
    <div class="form-section ${e?"active":""}" data-form="projects">
      <h2 class="form-section-title">🚀 Projects</h2>
      <p class="form-section-desc">Technical projects with Project Name, Tech Stack, and justified bullet points.</p>

      ${a.map((r,s)=>`
        <div class="entry-card mb-md">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${s+1}</span>
            <button class="delete-btn proj-delete" data-index="${s}" title="Remove entry">✕</button>
          </div>

          <div class="form-group">
            <label class="form-label">Project Title (e.g. FINMATE AI)</label>
            <input type="text" class="form-input" data-proj-field="name" data-proj-index="${s}" value="${k(r.name)}" placeholder="e.g. FINMATE AI" />
          </div>

          <div class="form-group">
            <label class="form-label">Tech Stack</label>
            <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${s}" value="${k(r.techStack)}" placeholder="e.g. Python, Flask, MySQL, LLM, RAG, React.js" />
          </div>

          <div class="form-group">
            <label class="form-label">Bullet Points (Justified text)</label>
            ${(r.bullets||[""]).map((n,o)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${s}" data-bullet-index="${o}" value="${k(n)}" placeholder="Describe feature, architectural design, outcome..." style="flex:1;" />
                ${r.bullets.length>1?`<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${s}" data-bullet-index="${o}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${s}">+ Add Bullet</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project Entry</button>
    </div>
  `}function te(t,e){const a=t.skills||[];return`
    <div class="form-section ${e?"active":""}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Bullet format with bold category prefix (e.g. Web Development and Backend: React.js, Node.js...).</p>

      ${a.map((r,s)=>`
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Skill Category #${s+1}</span>
            <button class="btn btn--sm btn--red skill-cat-delete" data-index="${s}">✕</button>
          </div>
          <div class="form-group mb-xs">
            <input type="text" class="form-input" data-skill-field="category" data-skill-index="${s}" value="${k(r.category)}" placeholder="Category Name (e.g. Programming & Core Skills)" />
          </div>
          <div class="form-group mb-xs">
            <textarea class="form-textarea" data-skill-field="skills" data-skill-index="${s}" rows="2" placeholder="Skills list (e.g. Python, SQL, Java, C++, OOP, DSA)">${k(r.skills)}</textarea>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn mt-sm" id="btn-add-skill-cat">+ Add Skill Category</button>
    </div>
  `}function ae(t,e){const a=t.awards||[];return`
    <div class="form-section ${e?"active":""}" data-form="awards">
      <h2 class="form-section-title">🏆 Awards and Achievements</h2>
      <p class="form-section-desc">Certifications, hackathon wins, and professional achievements.</p>

      ${a.map((r,s)=>`
        <div class="flex gap-sm items-center mb-sm">
          <span style="font-family:var(--font-mono);font-size:1.2rem;">•</span>
          <input type="text" class="form-input award-input" data-index="${s}" value="${k(r)}" placeholder="e.g. Tata Cybersecurity Analyst Certification" style="flex:1;" />
          <button class="btn btn--sm btn--red award-delete" data-index="${s}">✕</button>
        </div>
      `).join("")}

      <button class="add-entry-btn mt-sm" id="btn-add-award">+ Add Award / Certification</button>
    </div>
  `}function ie(t,e){const a=t.leadership||[];return`
    <div class="form-section ${e?"active":""}" data-form="leadership">
      <h2 class="form-section-title">👑 Leadership & Initiative</h2>
      <p class="form-section-desc">Student initiatives, hackathon leadership, and problem-solving contributions.</p>

      ${a.map((r,s)=>`
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Initiative #${s+1}</span>
            <button class="btn btn--sm btn--red lead-delete" data-index="${s}">✕</button>
          </div>
          <div class="form-group mb-xs">
            <input type="text" class="form-input" data-lead-field="title" data-lead-index="${s}" value="${k(r.title)}" placeholder="Bold Prefix (Optional, e.g. End-to-End Application Delivery)" />
          </div>
          <div class="form-group mb-xs">
            <textarea class="form-textarea" data-lead-field="description" data-lead-index="${s}" rows="2" placeholder="Description of leadership or initiative...">${k(r.description)}</textarea>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn mt-sm" id="btn-add-leadership">+ Add Leadership Initiative</button>
    </div>
  `}function ne(t,e){const a=t.links||[];return`
    <div class="form-section ${e?"active":""}" data-form="links">
      <h2 class="form-section-title">🔗 Links</h2>
      <p class="form-section-desc">Professional profiles rendered as clean, clickable blue links in the PDF.</p>

      ${a.map((r,s)=>`
        <div class="entry-card mb-sm">
          <div class="flex justify-between items-center mb-xs">
            <span style="font-weight:700;font-size:0.85rem;">Link #${s+1}</span>
            <button class="btn btn--sm btn--red link-delete" data-index="${s}">✕</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Display Label (e.g. Linkedin)</label>
              <input type="text" class="form-input" data-link-field="label" data-link-index="${s}" value="${k(r.label)}" placeholder="Linkedin / Github / LeetCode" />
            </div>
            <div class="form-group">
              <label class="form-label">Full Target URL</label>
              <input type="url" class="form-input" data-link-field="url" data-link-index="${s}" value="${k(r.url)}" placeholder="https://..." />
            </div>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn mt-sm" id="btn-add-link">+ Add Profile Link</button>
    </div>
  `}function se(t,e){const a=t.declaration||{};return`
    <div class="form-section ${e?"active":""}" data-form="declaration">
      <h2 class="form-section-title">📝 Self Declaration</h2>
      <p class="form-section-desc">Standard placement cell declaration with Date, Place, divider, and Candidate Name.</p>

      <div class="form-group">
        <label class="form-label">Declaration Statement</label>
        <textarea class="form-textarea" id="input-decl-text" rows="3">${k(a.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date (e.g. 23rd July 2026)</label>
          <input type="text" class="form-input" id="input-decl-date" value="${k(a.date)}" placeholder="23rd July 2026" />
        </div>
        <div class="form-group">
          <label class="form-label">Place (e.g. Gwalior / Noida)</label>
          <input type="text" class="form-input" id="input-decl-place" value="${k(a.place)}" placeholder="Gwalior" />
        </div>
      </div>
    </div>
  `}async function le(t,e){const a=t.validate();if(a.length>0){const r=a.map(s=>s.message).join(`
• `);e.show(`Please fill required fields:
• ${r}`,"error");return}e.show("Generating high-resolution Amity PDF...","info");try{const{default:r}=await G(async()=>{const{default:f}=await import("./html2pdf-CNDS6-O6.js").then(d=>d.h);return{default:f}},[]),s=t.getData(),n=document.createElement("div");n.style.cssText="position:absolute;left:-9999px;top:0;width:210mm;background:#fff;",n.innerHTML=`
      <div class="amity-resume-sheet" style="box-shadow:none;border:none;padding:12mm 15mm;width:210mm;">
        ${F(s)}
      </div>
    `,document.body.appendChild(n);const o=n.querySelector(".amity-resume-sheet"),p=(s.personal.fullName||"Student").replace(/\s+/g,"_"),c={margin:[10,12,10,12],filename:`${p}_Amity_Resume.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["avoid-all","css","legacy"]},enableLinks:!0};await r().set(c).from(o).save(),document.body.removeChild(n),e.show("Amity Resume PDF downloaded! (Or use Native Print for vector PDF)","success")}catch(r){console.error("PDF export error:",r),e.show('Download failed. Click "Native Print" to save as PDF directly.',"error")}}function k(t){if(!t)return"";const e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function re({currentView:t,onBack:e,onSave:a,onDelete:r}){const s=document.createElement("header");return s.className="header",s.innerHTML=`
    <div class="header-logo">
      <span class="logo-accent">ur</span>-CV
    </div>
    <div class="header-actions" id="header-actions">
      ${t==="builder"?`
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to start">← Back</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft">💾 Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Delete draft">🗑 Delete</button>
      `:'<span class="tag tag--green">Free & Open Source</span>'}
    </div>
  `,t==="builder"&&setTimeout(()=>{var n,o,p;(n=document.getElementById("btn-back"))==null||n.addEventListener("click",e),(o=document.getElementById("btn-save"))==null||o.addEventListener("click",a),(p=document.getElementById("btn-delete"))==null||p.addEventListener("click",r)},0),s}function oe(){const t=document.createElement("footer");return t.className="footer",t.innerHTML=`
    <p>
      <strong>ur-CV</strong> — Amity Resume Builder &copy; ${new Date().getFullYear()}<br>
      Built with ❤ for Amity University students. 
      <a href="https://github.com/Abhishek09821/ur-CV" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p style="margin-top: 8px; font-size: 0.7rem; opacity: 0.7;">
      This tool does not guarantee ATS success or interview selection. 
      AI suggestions are based on your profile only — no claims are fabricated.
    </p>
  `,t}class de{show(e,a="info",r=3e3){const s=document.getElementById("toast-container")||this.createContainer(),n=document.createElement("div");n.className=`toast toast--${a}`,n.innerHTML=`
      <span>${this.getIcon(a)}</span>
      <span>${e}</span>
    `,s.appendChild(n),setTimeout(()=>{n.style.transition="all 0.3s ease",n.style.opacity="0",n.style.transform="translateX(100px)",setTimeout(()=>n.remove(),300)},r)}createContainer(){const e=document.createElement("div");return e.className="toast-container",e.id="toast-container",document.body.appendChild(e),e}getIcon(e){const a={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};return a[e]||a.info}}class ce{constructor(){this.store=new N,this.toast=new de,this.currentView="landing",this.mode=null,this.root=document.getElementById("app"),this.init()}init(){this.render(),this.loadDraft()}loadDraft(){const e=localStorage.getItem("ur-cv-draft");if(e)try{const a=JSON.parse(e);this.store.loadData(a)}catch(a){console.warn("Failed to load draft:",a)}}saveDraft(){try{localStorage.setItem("ur-cv-draft",JSON.stringify(this.store.getData())),this.toast.show("Draft saved!","success")}catch{this.toast.show("Failed to save draft","error")}}deleteDraft(){localStorage.removeItem("ur-cv-draft"),this.store.reset(),this.toast.show("Draft deleted!","info"),this.navigateTo("landing")}navigateTo(e,a=null){this.currentView=e,a&&(this.mode=a),this.render()}render(){this.root.innerHTML="";const e=re({currentView:this.currentView,onBack:()=>this.navigateTo("landing"),onSave:()=>this.saveDraft(),onDelete:()=>{confirm("Are you sure you want to delete your draft? This cannot be undone.")&&this.deleteDraft()}});if(this.root.appendChild(e),this.currentView==="landing"){const r=document.createElement("div");r.className="ticker",r.innerHTML=`
        <div class="ticker-inner">
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
        </div>
      `,this.root.appendChild(r)}if(this.currentView==="landing"){const r=O({onSelectMode:s=>this.navigateTo("builder",s)});this.root.appendChild(r)}else if(this.currentView==="builder"){const r=Q({store:this.store,mode:this.mode,toast:this.toast,onSave:()=>this.saveDraft(),onBack:()=>this.navigateTo("landing")});this.root.appendChild(r)}const a=oe();if(this.root.appendChild(a),!document.querySelector(".toast-container")){const r=document.createElement("div");r.className="toast-container",r.id="toast-container",document.body.appendChild(r)}}}const ue=new ce;window.app=ue;export{G as _};
