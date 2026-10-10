(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const S={personal:{fullName:"",email:"",phone:"",address:"",city:"",state:"",photo:null},academic:{degree:"",university:"Amity University",graduationYear:"",cgpa:"",specialization:"",relevantCoursework:""},experience:[],projects:[],skills:{languages:[],frameworks:[],tools:[],databases:[],other:[]},achievements:[],leadership:[],links:{github:"",linkedin:"",leetcode:"",portfolio:"",other:""},declaration:{text:"I hereby declare that all the information furnished above is true to the best of my knowledge and belief.",place:"",date:new Date().toISOString().split("T")[0]}};class N{constructor(){this.data=JSON.parse(JSON.stringify(S)),this.listeners=[]}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(){this.listeners.forEach(e=>e(this.data))}getData(){return JSON.parse(JSON.stringify(this.data))}loadData(e){this.data={...JSON.parse(JSON.stringify(S)),...e},this.notify()}reset(){this.data=JSON.parse(JSON.stringify(S)),this.notify()}updatePersonal(e,t){this.data.personal[e]=t,this.notify()}setPhoto(e){this.data.personal.photo=e,this.notify()}updateAcademic(e,t){this.data.academic[e]=t,this.notify()}addExperience(){this.data.experience.push({title:"",company:"",location:"",startDate:"",endDate:"",current:!1,bullets:[""]}),this.notify()}updateExperience(e,t,a){this.data.experience[e]&&(this.data.experience[e][t]=a,this.notify())}removeExperience(e){this.data.experience.splice(e,1),this.notify()}addExperienceBullet(e){this.data.experience[e].bullets.push(""),this.notify()}updateExperienceBullet(e,t,a){this.data.experience[e].bullets[t]=a,this.notify()}removeExperienceBullet(e,t){this.data.experience[e].bullets.splice(t,1),this.notify()}addProject(){this.data.projects.push({name:"",techStack:"",startDate:"",endDate:"",bullets:[""],link:""}),this.notify()}updateProject(e,t,a){this.data.projects[e]&&(this.data.projects[e][t]=a,this.notify())}removeProject(e){this.data.projects.splice(e,1),this.notify()}addProjectBullet(e){this.data.projects[e].bullets.push(""),this.notify()}updateProjectBullet(e,t,a){this.data.projects[e].bullets[t]=a,this.notify()}removeProjectBullet(e,t){this.data.projects[e].bullets.splice(t,1),this.notify()}addSkill(e,t){this.data.skills[e].includes(t)||(this.data.skills[e].push(t),this.notify())}removeSkill(e,t){this.data.skills[e]=this.data.skills[e].filter(a=>a!==t),this.notify()}addAchievement(){this.data.achievements.push({title:"",description:"",date:""}),this.notify()}updateAchievement(e,t,a){this.data.achievements[e]&&(this.data.achievements[e][t]=a,this.notify())}removeAchievement(e){this.data.achievements.splice(e,1),this.notify()}addLeadership(){this.data.leadership.push({role:"",organization:"",description:"",date:""}),this.notify()}updateLeadership(e,t,a){this.data.leadership[e]&&(this.data.leadership[e][t]=a,this.notify())}removeLeadership(e){this.data.leadership.splice(e,1),this.notify()}updateLink(e,t){this.data.links[e]=t,this.notify()}updateDeclaration(e,t){this.data.declaration[e]=t,this.notify()}validate(){const e=[];return this.data.personal.fullName.trim()||e.push({section:"personal",field:"fullName",message:"Full name is required"}),this.data.personal.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.personal.email)||e.push({section:"personal",field:"email",message:"Invalid email format"}):e.push({section:"personal",field:"email",message:"Email is required"}),this.data.personal.phone.trim()?/^[\d\+\-\(\)\s]{7,15}$/.test(this.data.personal.phone)||e.push({section:"personal",field:"phone",message:"Invalid phone format"}):e.push({section:"personal",field:"phone",message:"Phone number is required"}),this.data.academic.degree.trim()||e.push({section:"academic",field:"degree",message:"Degree is required"}),this.data.academic.graduationYear.trim()||e.push({section:"academic",field:"graduationYear",message:"Graduation year is required"}),this.data.academic.cgpa&&(isNaN(this.data.academic.cgpa)||this.data.academic.cgpa<0||this.data.academic.cgpa>10)&&e.push({section:"academic",field:"cgpa",message:"CGPA must be between 0 and 10"}),Object.entries(this.data.links).forEach(([t,a])=>{a&&!R(a)&&e.push({section:"links",field:t,message:`Invalid ${t} URL`})}),e}getCompletionStatus(){const e=this.data;return{personal:!!(e.personal.fullName&&e.personal.email&&e.personal.phone),academic:!!(e.academic.degree&&e.academic.graduationYear),experience:e.experience.length>0,projects:e.projects.length>0,skills:Object.values(e.skills).some(t=>t.length>0),achievements:!0,leadership:!0,links:!!(e.links.github||e.links.linkedin),declaration:!!e.declaration.place}}}function R(i){try{const e=new URL(i);return["http:","https:"].includes(e.protocol)}catch{return!1}}function O({onSelectMode:i}){const e=document.createElement("section");return e.className="landing",e.innerHTML=`
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
  `,setTimeout(()=>{const t=document.getElementById("landing-modes");t&&t.addEventListener("click",a=>{const r=a.target.closest(".mode-card");if(r){const n=r.dataset.mode;r.style.transform="scale(0.95)",setTimeout(()=>{i(n)},150)}})},0),e}const q="modulepreload",F=function(i){return"/"+i},A={},M=function(e,t,a){let r=Promise.resolve();if(t&&t.length>0){let c=function(f){return Promise.all(f.map(m=>Promise.resolve(m).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=c(t.map(f=>{if(f=F(f),f in A)return;A[f]=!0;const m=f.endsWith(".css"),v=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${v}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":q,m||(u.as="script"),u.crossOrigin="",u.href=f,d&&u.setAttribute("nonce",d),document.head.appendChild(u),m)return new Promise((g,k)=>{u.addEventListener("load",g),u.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${f}`)))})}))}function n(c){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=c,window.dispatchEvent(o),!o.defaultPrevented)throw c}return r.then(c=>{for(const o of c||[])o.status==="rejected"&&n(o.reason);return e().catch(n)})};function C(i){const e=i.personal,t=i.academic,a=i.links;if(!(e.fullName||e.email||t.degree))return`
      <div class="resume-preview" style="display:flex;align-items:center;justify-content:center;">
        <div class="preview-placeholder">
          <span class="placeholder-icon">📄</span>
          <h3>Your Resume Preview</h3>
          <p style="color:var(--text-muted);font-family:var(--font-body);">Start filling in your details on the left panel and watch your resume come alive here!</p>
        </div>
      </div>
    `;const n=[];a.github&&n.push(`<a href="${p(a.github)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">GitHub</a>`),a.linkedin&&n.push(`<a href="${p(a.linkedin)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">LinkedIn</a>`),a.leetcode&&n.push(`<a href="${p(a.leetcode)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">LeetCode</a>`),a.portfolio&&n.push(`<a href="${p(a.portfolio)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">Portfolio</a>`),a.other&&n.push(`<a href="${p(a.other)}" target="_blank" style="color:#0066CC;text-decoration:none;font-size:9pt;">Other</a>`);const c=[e.email,e.phone,[e.city,e.state].filter(Boolean).join(", ")].filter(Boolean);return`
    <div class="resume-preview">
      <!-- ===== HEADER ===== -->
      <div class="resume-header" style="position:relative;">
        ${e.photo?`<img src="${e.photo}" class="resume-photo" alt="Profile photo" />`:""}
        <div class="resume-name">${p(e.fullName)||"Your Name"}</div>
        <div class="resume-contact">
          ${c.map(o=>`<span>${p(o)}</span>`).join('<span style="color:#999;">|</span>')}
        </div>
        ${n.length>0?`
          <div class="resume-links">
            ${n.join('<span style="color:#999;font-size:9pt;"> | </span>')}
          </div>
        `:""}
      </div>

      <!-- ===== EDUCATION ===== -->
      ${t.degree?`
        <div class="resume-section">
          <div class="resume-section-title">Education</div>
          <div class="resume-entry">
            <div class="resume-entry-header">
              <span>${p(t.degree)}${t.specialization?` — ${p(t.specialization)}`:""}</span>
              <span style="font-size:10pt;">${p(t.graduationYear)}</span>
            </div>
            <div class="resume-entry-sub">
              ${p(t.university)}${t.cgpa?` | CGPA: ${p(t.cgpa)}`:""}
            </div>
            ${t.relevantCoursework?`<div style="font-size:9pt;margin-top:3px;"><strong>Coursework:</strong> ${p(t.relevantCoursework)}</div>`:""}
          </div>
        </div>
      `:""}

      <!-- ===== EXPERIENCE ===== -->
      ${i.experience.length>0?`
        <div class="resume-section">
          <div class="resume-section-title">Experience</div>
          ${i.experience.map(o=>`
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${p(o.title)}</span>
                <span style="font-size:9pt;">${T(o.startDate,o.endDate,o.current)}</span>
              </div>
              <div class="resume-entry-sub">${p(o.company)}${o.location?`, ${p(o.location)}`:""}</div>
              ${o.bullets.filter(Boolean).length>0?`
                <ul class="resume-entry-bullets">
                  ${o.bullets.filter(Boolean).map(d=>`<li>${p(d)}</li>`).join("")}
                </ul>
              `:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- ===== PROJECTS ===== -->
      ${i.projects.length>0?`
        <div class="resume-section">
          <div class="resume-section-title">Projects</div>
          ${i.projects.map(o=>`
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${p(o.name)}${o.techStack?` <span style="font-weight:400;font-size:9pt;">[${p(o.techStack)}]</span>`:""}</span>
                <span style="font-size:9pt;">${T(o.startDate,o.endDate)}</span>
              </div>
              ${o.link?`<div style="font-size:9pt;"><a href="${p(o.link)}" target="_blank" style="color:#0066CC;">${p(o.link)}</a></div>`:""}
              ${o.bullets.filter(Boolean).length>0?`
                <ul class="resume-entry-bullets">
                  ${o.bullets.filter(Boolean).map(d=>`<li>${p(d)}</li>`).join("")}
                </ul>
              `:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- ===== SKILLS ===== -->
      ${Object.values(i.skills).some(o=>o.length>0)?`
        <div class="resume-section">
          <div class="resume-section-title">Technical Skills</div>
          <table style="width:100%;font-size:10pt;border-collapse:collapse;">
            ${i.skills.languages.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Languages:</td><td>${i.skills.languages.map(p).join(", ")}</td></tr>`:""}
            ${i.skills.frameworks.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Frameworks:</td><td>${i.skills.frameworks.map(p).join(", ")}</td></tr>`:""}
            ${i.skills.tools.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Tools:</td><td>${i.skills.tools.map(p).join(", ")}</td></tr>`:""}
            ${i.skills.databases.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Databases:</td><td>${i.skills.databases.map(p).join(", ")}</td></tr>`:""}
            ${i.skills.other.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Other:</td><td>${i.skills.other.map(p).join(", ")}</td></tr>`:""}
          </table>
        </div>
      `:""}

      <!-- ===== ACHIEVEMENTS ===== -->
      ${i.achievements.length>0?`
        <div class="resume-section">
          <div class="resume-section-title">Achievements & Certifications</div>
          <ul class="resume-entry-bullets">
            ${i.achievements.map(o=>`
              <li><strong>${p(o.title)}</strong>${o.date?` (${p(o.date)})`:""}${o.description?` — ${p(o.description)}`:""}</li>
            `).join("")}
          </ul>
        </div>
      `:""}

      <!-- ===== LEADERSHIP ===== -->
      ${i.leadership.length>0?`
        <div class="resume-section">
          <div class="resume-section-title">Leadership & Initiatives</div>
          ${i.leadership.map(o=>`
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span>${p(o.role)}${o.organization?` — ${p(o.organization)}`:""}</span>
                <span style="font-size:9pt;">${p(o.date)}</span>
              </div>
              ${o.description?`<div style="font-size:10pt;">${p(o.description)}</div>`:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- ===== DECLARATION ===== -->
      ${i.declaration.text?`
        <div class="resume-declaration">
          <strong style="font-style:normal;">Declaration</strong><br>
          ${p(i.declaration.text)}
          <div style="margin-top:8px;">
            ${i.declaration.place?`Place: ${p(i.declaration.place)}<br>`:""}
            ${i.declaration.date?`Date: ${p(i.declaration.date)}`:""}
          </div>
        </div>
      `:""}
    </div>
  `}function p(i){if(!i)return"";const e=document.createElement("div");return e.textContent=String(i),e.innerHTML}function T(i,e,t=!1){const a=[];return i&&a.push(z(i)),t?a.push("Present"):e&&a.push(z(e)),a.join(" – ")}function z(i){if(!i)return"";const[e,t]=i.split("-");return t?`${["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(t)]} ${e}`:e}function J({store:i,toast:e}){const t=document.createElement("div");t.className="jd-panel active";let a="",r=!1,n=[],c=!1;function o(){t.innerHTML=`
      <!-- Privacy Consent -->
      ${c?`
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
              >${D(a)}</textarea>
            </div>

            <div style="text-align:center;margin:var(--space-md) 0;font-family:var(--font-display);font-size:0.8rem;color:var(--text-muted);">— OR —</div>

            <div class="jd-upload-area" id="jd-upload-area">
              <span class="upload-icon">📁</span>
              <p><strong>Drop a file or click to upload</strong></p>
              <p class="form-hint">Supported: PDF, DOCX, TXT (max 2MB)</p>
              <input type="file" id="jd-file-input" accept=".pdf,.docx,.txt" style="display:none;" />
            </div>

            <button class="btn btn--purple btn--block mt-lg" id="btn-analyze-jd" ${r?"disabled":""}>
              ${r?"⏳ Analyzing...":"🔍 Analyze Job Description"}
            </button>
          </div>
        </div>

        <!-- Suggestions -->
        ${n.length>0?`
          <div class="mt-lg">
            <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:1rem;margin-bottom:var(--space-md);">
              ✨ AI Suggestions <span class="tag tag--green" style="font-size:0.65rem;">${n.length} found</span>
            </h3>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-lg);">
              Suggestions are based only on your profile data. Accept, edit, or reject each one. 
              No claims are fabricated.
            </p>
            ${n.map((m,v)=>`
              <div class="suggestion-card">
                <div class="suggestion-header">
                  <span>${m.section} — ${m.type}</span>
                  <span class="tag tag--${m.confidence==="high"?"green":m.confidence==="medium"?"":"pink"}" style="font-size:0.6rem;">
                    ${m.confidence} confidence
                  </span>
                </div>
                <div class="suggestion-body">
                  <p style="font-size:0.9rem;">${D(m.text)}</p>
                  <div class="suggestion-source">
                    📌 Source: ${D(m.source)}
                  </div>
                </div>
                <div class="suggestion-actions">
                  <button class="btn btn--sm btn--green suggestion-accept" data-index="${v}">✓ Accept</button>
                  <button class="btn btn--sm btn--white suggestion-edit" data-index="${v}">✏ Edit</button>
                  <button class="btn btn--sm btn--red suggestion-reject" data-index="${v}">✕ Reject</button>
                </div>
              </div>
            `).join("")}
          </div>
        `:""}
      `:`
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
      `}
    `,d()}function d(){var g,k,b,P;(g=document.getElementById("btn-consent-accept"))==null||g.addEventListener("click",()=>{c=!0,o()}),(k=document.getElementById("btn-consent-decline"))==null||k.addEventListener("click",()=>{e.show("Switched to Manual Mode. JD Assist is disabled.","info"),t.className="jd-panel"});const m=document.getElementById("jd-textarea");m&&m.addEventListener("input",()=>{a=m.value});const v=document.getElementById("jd-upload-area"),u=document.getElementById("jd-file-input");v&&u&&(v.addEventListener("click",()=>u.click()),u.addEventListener("change",$=>{const y=$.target.files[0];if(y){if(y.size>2*1024*1024){e.show("File too large. Max 2MB.","error");return}if(y.type==="text/plain"||y.name.endsWith(".txt")){const E=new FileReader;E.onload=w=>{a=w.target.result,o(),e.show("JD text loaded from file!","success")},E.readAsText(y)}else e.show("In this demo, only .txt files can be read directly. Please paste the JD text instead.","warning")}})),(b=document.getElementById("jd-accordion-header"))==null||b.addEventListener("click",()=>{var y;const $=(y=document.getElementById("jd-accordion-header"))==null?void 0:y.closest(".accordion");$&&$.classList.toggle("open")}),(P=document.getElementById("btn-analyze-jd"))==null||P.addEventListener("click",()=>{if(!a.trim()){e.show("Please paste or upload a job description first.","warning");return}f()}),t.querySelectorAll(".suggestion-accept").forEach($=>{$.addEventListener("click",()=>{const y=parseInt($.dataset.index),E=n[y];e.show(`Accepted: "${E.text.substring(0,40)}..."`,"success"),n.splice(y,1),o()})}),t.querySelectorAll(".suggestion-reject").forEach($=>{$.addEventListener("click",()=>{const y=parseInt($.dataset.index);e.show("Suggestion rejected.","info"),n.splice(y,1),o()})}),t.querySelectorAll(".suggestion-edit").forEach($=>{$.addEventListener("click",()=>{const y=parseInt($.dataset.index),E=n[y],w=prompt("Edit suggestion:",E.text);w!==null&&(n[y].text=w,o())})})}function f(){r=!0,o(),setTimeout(()=>{const m=i.getData();n=U(a,m),r=!1,o(),e.show(`Found ${n.length} suggestions based on your profile!`,"success")},2e3)}return o(),t}function U(i,e){const t=[],a=i.toLowerCase(),r=Y(a),n=[...e.skills.languages,...e.skills.frameworks,...e.skills.tools,...e.skills.databases,...e.skills.other].map(d=>d.toLowerCase()),c=r.filter(d=>n.some(f=>f.includes(d)||d.includes(f))),o=r.filter(d=>!n.some(f=>f.includes(d)||d.includes(f)));return c.length>0&&t.push({section:"Skills",type:"Relevance Ordering",text:`Consider listing these matching skills first: ${c.join(", ")}. They appear in the job description and are already in your profile.`,source:"Your skills profile + JD keyword analysis",confidence:"high"}),o.length>0&&o.length<=5&&t.push({section:"Skills",type:"Gap Analysis",text:`The JD mentions: ${o.join(", ")}. These are not in your current profile. Add them only if you have genuine experience.`,source:"JD keyword analysis (not found in your profile)",confidence:"medium"}),e.experience.forEach(d=>{d.title&&d.company&&d.bullets.filter(m=>m&&r.some(v=>m.toLowerCase().includes(v))).length>0&&t.push({section:"Experience",type:"Highlight",text:`Your role at ${d.company} mentions relevant technologies. Consider expanding on these specific points for this application.`,source:`Your experience at ${d.company}`,confidence:"high"})}),e.projects.forEach(d=>{if(d.name&&d.techStack){const f=d.techStack.toLowerCase(),m=r.filter(v=>f.includes(v));m.length>0&&t.push({section:"Projects",type:"Relevance",text:`Your project "${d.name}" uses ${m.join(", ")} which the JD requires. Consider moving it higher in your projects list.`,source:`Your project: ${d.name}`,confidence:"high"})}}),(a.includes("team")||a.includes("collaborat")||a.includes("leadership"))&&e.leadership.length>0&&t.push({section:"Leadership",type:"Emphasis",text:"The JD emphasizes teamwork/leadership. Your leadership section is relevant — ensure it highlights collaboration and impact.",source:"JD mentions team/collaboration + your leadership entries",confidence:"medium"}),t}function Y(i){return["python","java","javascript","typescript","c++","c#","go","rust","ruby","php","swift","kotlin","react","angular","vue","node","express","django","flask","spring","nextjs","next.js","aws","azure","gcp","docker","kubernetes","terraform","ci/cd","jenkins","git","linux","sql","nosql","mongodb","postgresql","mysql","redis","elasticsearch","machine learning","deep learning","ai","nlp","computer vision","tensorflow","pytorch","rest","graphql","microservices","agile","scrum","html","css","sass","tailwind","bootstrap","firebase","supabase","vercel","netlify"].filter(t=>i.includes(t))}function D(i){if(!i)return"";const e=document.createElement("div");return e.textContent=String(i),e.innerHTML}const j=[{id:"personal",label:"Personal Info",icon:"👤",required:!0},{id:"academic",label:"Education",icon:"🎓",required:!0},{id:"experience",label:"Experience",icon:"💼",required:!1},{id:"projects",label:"Projects",icon:"🚀",required:!1},{id:"skills",label:"Skills",icon:"⚡",required:!0},{id:"achievements",label:"Achievements",icon:"🏆",required:!1},{id:"leadership",label:"Leadership",icon:"👑",required:!1},{id:"links",label:"Profile Links",icon:"🔗",required:!1},{id:"declaration",label:"Declaration",icon:"📝",required:!0}];function H({store:i,mode:e,toast:t,onSave:a,onBack:r}){const n=document.createElement("div");let c="personal",o="form";function d(){const g=i.getData(),k=i.getCompletionStatus();n.innerHTML=`
      ${e==="jd-assist"?'<div id="jd-panel-mount"></div>':""}
      
      <!-- Mobile Toggle -->
      <div class="builder-mobile-toggle">
        <button class="toggle-btn ${o==="form"?"active":""}" data-view="form">✏️ Edit</button>
        <button class="toggle-btn ${o==="preview"?"active":""}" data-view="preview">👁 Preview</button>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        ${j.map(b=>`
          <div class="progress-step ${b.id===c?"active":""} ${k[b.id]?"completed":""}" data-section="${b.id}">
            <span class="step-number">${b.icon}</span>
            <span class="step-label">${b.label}</span>
          </div>
        `).join("")}
      </div>

      <div class="builder active">
        <!-- Sidebar: Section Nav + Form -->
        <div class="builder-sidebar ${o==="preview"?"mobile-hidden":""}">
          <nav class="section-nav">
            ${j.map(b=>`
              <div class="section-nav-item ${b.id===c?"active":""} ${k[b.id]?"completed":""}" data-section="${b.id}">
                <span class="nav-icon">${b.icon}</span>
                <span>${b.label}</span>
                ${b.required?'<span class="required" style="font-size:0.7rem;">REQ</span>':""}
                <span class="nav-status">${k[b.id]?"✓":"○"}</span>
              </div>
            `).join("")}
          </nav>

          <!-- Form Sections -->
          ${V(g,c==="personal")}
          ${G(g,c==="academic")}
          ${_(g,c==="experience")}
          ${W(g,c==="projects")}
          ${X(g,c==="skills")}
          ${K(g,c==="achievements")}
          ${Q(g,c==="leadership")}
          ${Z(g,c==="links")}
          ${ee(g,c==="declaration")}

          <!-- Navigation buttons -->
          <div style="padding: var(--space-lg); display: flex; gap: var(--space-md); flex-wrap: wrap;">
            ${c!=="personal"?'<button class="btn btn--white btn--sm" id="btn-prev-section">← Previous</button>':""}
            ${c!=="declaration"?'<button class="btn btn--blue btn--sm" id="btn-next-section">Next →</button>':""}
            <button class="btn btn--green" id="btn-export-pdf" style="margin-left: auto;">📄 Export PDF</button>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="builder-preview ${o==="form"?"mobile-hidden":""}" id="preview-panel">
          ${C(g)}
        </div>
      </div>
    `,f()}function f(){var b,P,$,y,E,w,I,L;n.querySelectorAll("[data-section]").forEach(s=>{s.addEventListener("click",()=>{c=s.dataset.section,d()})}),n.querySelectorAll(".toggle-btn").forEach(s=>{s.addEventListener("click",()=>{o=s.dataset.view,d()})}),(b=document.getElementById("btn-prev-section"))==null||b.addEventListener("click",()=>{const s=j.findIndex(h=>h.id===c);s>0&&(c=j[s-1].id,d())}),(P=document.getElementById("btn-next-section"))==null||P.addEventListener("click",()=>{const s=j.findIndex(h=>h.id===c);s<j.length-1&&(c=j[s+1].id,d())}),($=document.getElementById("btn-export-pdf"))==null||$.addEventListener("click",()=>{te(i,t)}),u("input-fullname",s=>i.updatePersonal("fullName",s)),u("input-email",s=>i.updatePersonal("email",s)),u("input-phone",s=>i.updatePersonal("phone",s)),u("input-address",s=>i.updatePersonal("address",s)),u("input-city",s=>i.updatePersonal("city",s)),u("input-state",s=>i.updatePersonal("state",s));const g=document.getElementById("input-photo");if(g&&g.addEventListener("change",s=>{const h=s.target.files[0];if(h){if(h.size>5*1024*1024){t.show("Photo must be under 5MB","error");return}if(!["image/jpeg","image/png"].includes(h.type)){t.show("Only JPEG and PNG photos are supported","error");return}const x=new FileReader;x.onload=B=>{i.setPhoto(B.target.result),d(),t.show("Photo uploaded!","success")},x.readAsDataURL(h)}}),(y=document.getElementById("btn-remove-photo"))==null||y.addEventListener("click",()=>{i.setPhoto(null),d(),t.show("Photo removed","info")}),u("input-degree",s=>i.updateAcademic("degree",s)),u("input-university",s=>i.updateAcademic("university",s)),u("input-grad-year",s=>i.updateAcademic("graduationYear",s)),u("input-cgpa",s=>i.updateAcademic("cgpa",s)),u("input-specialization",s=>i.updateAcademic("specialization",s)),u("input-coursework",s=>i.updateAcademic("relevantCoursework",s)),(E=document.getElementById("btn-add-experience"))==null||E.addEventListener("click",()=>{i.addExperience(),d()}),n.querySelectorAll(".exp-delete").forEach(s=>{s.addEventListener("click",()=>{i.removeExperience(parseInt(s.dataset.index)),d()})}),n.querySelectorAll("[data-exp-field]").forEach(s=>{const h=parseInt(s.dataset.expIndex),x=s.dataset.expField;s.addEventListener("input",()=>{i.updateExperience(h,x,s.type==="checkbox"?s.checked:s.value),v()})}),n.querySelectorAll("[data-exp-bullet]").forEach(s=>{const h=parseInt(s.dataset.expIndex),x=parseInt(s.dataset.bulletIndex);s.addEventListener("input",()=>{i.updateExperienceBullet(h,x,s.value),v()})}),n.querySelectorAll(".exp-add-bullet").forEach(s=>{s.addEventListener("click",()=>{i.addExperienceBullet(parseInt(s.dataset.expIndex)),d()})}),n.querySelectorAll(".exp-remove-bullet").forEach(s=>{s.addEventListener("click",()=>{i.removeExperienceBullet(parseInt(s.dataset.expIndex),parseInt(s.dataset.bulletIndex)),d()})}),(w=document.getElementById("btn-add-project"))==null||w.addEventListener("click",()=>{i.addProject(),d()}),n.querySelectorAll(".proj-delete").forEach(s=>{s.addEventListener("click",()=>{i.removeProject(parseInt(s.dataset.index)),d()})}),n.querySelectorAll("[data-proj-field]").forEach(s=>{const h=parseInt(s.dataset.projIndex),x=s.dataset.projField;s.addEventListener("input",()=>{i.updateProject(h,x,s.value),v()})}),n.querySelectorAll("[data-proj-bullet]").forEach(s=>{const h=parseInt(s.dataset.projIndex),x=parseInt(s.dataset.bulletIndex);s.addEventListener("input",()=>{i.updateProjectBullet(h,x,s.value),v()})}),n.querySelectorAll(".proj-add-bullet").forEach(s=>{s.addEventListener("click",()=>{i.addProjectBullet(parseInt(s.dataset.projIndex)),d()})}),n.querySelectorAll(".proj-remove-bullet").forEach(s=>{s.addEventListener("click",()=>{i.removeProjectBullet(parseInt(s.dataset.projIndex),parseInt(s.dataset.bulletIndex)),d()})}),["languages","frameworks","tools","databases","other"].forEach(s=>{const h=document.getElementById(`skill-input-${s}`);h&&h.addEventListener("keydown",x=>{x.key==="Enter"&&h.value.trim()&&(x.preventDefault(),i.addSkill(s,h.value.trim()),d())})}),n.querySelectorAll(".skill-remove").forEach(s=>{s.addEventListener("click",()=>{i.removeSkill(s.dataset.category,s.dataset.skill),d()})}),(I=document.getElementById("btn-add-achievement"))==null||I.addEventListener("click",()=>{i.addAchievement(),d()}),n.querySelectorAll(".ach-delete").forEach(s=>{s.addEventListener("click",()=>{i.removeAchievement(parseInt(s.dataset.index)),d()})}),n.querySelectorAll("[data-ach-field]").forEach(s=>{const h=parseInt(s.dataset.achIndex),x=s.dataset.achField;s.addEventListener("input",()=>{i.updateAchievement(h,x,s.value),v()})}),(L=document.getElementById("btn-add-leadership"))==null||L.addEventListener("click",()=>{i.addLeadership(),d()}),n.querySelectorAll(".lead-delete").forEach(s=>{s.addEventListener("click",()=>{i.removeLeadership(parseInt(s.dataset.index)),d()})}),n.querySelectorAll("[data-lead-field]").forEach(s=>{const h=parseInt(s.dataset.leadIndex),x=s.dataset.leadField;s.addEventListener("input",()=>{i.updateLeadership(h,x,s.value),v()})}),u("input-github",s=>i.updateLink("github",s)),u("input-linkedin",s=>i.updateLink("linkedin",s)),u("input-leetcode",s=>i.updateLink("leetcode",s)),u("input-portfolio",s=>i.updateLink("portfolio",s)),u("input-other-link",s=>i.updateLink("other",s)),u("input-decl-text",s=>i.updateDeclaration("text",s)),u("input-decl-place",s=>i.updateDeclaration("place",s)),u("input-decl-date",s=>i.updateDeclaration("date",s)),e==="jd-assist"){const s=document.getElementById("jd-panel-mount");s&&(s.innerHTML="",s.appendChild(J({store:i,toast:t})))}}let m=null;function v(){clearTimeout(m),m=setTimeout(()=>{const g=document.getElementById("preview-panel");g&&(g.innerHTML=C(i.getData()))},300)}function u(g,k){const b=document.getElementById(g);b&&b.addEventListener("input",()=>{k(b.value),v()})}return d(),i.subscribe(()=>{d()}),n}function V(i,e){const t=i.personal;return`
    <div class="form-section ${e?"active":""}" data-form="personal">
      <h2 class="form-section-title">👤 Personal Information</h2>
      <p class="form-section-desc">Basic contact information for your resume header.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-fullname" value="${l(t.fullName)}" placeholder="e.g. Abhishek Tiwari" />
        </div>
        <div class="form-group">
          <label class="form-label">Email <span class="required">*</span></label>
          <input type="email" class="form-input" id="input-email" value="${l(t.email)}" placeholder="e.g. abhishek@amity.edu" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phone <span class="required">*</span></label>
          <input type="tel" class="form-input" id="input-phone" value="${l(t.phone)}" placeholder="e.g. +91 98765 43210" />
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input type="text" class="form-input" id="input-city" value="${l(t.city)}" placeholder="e.g. Noida" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" class="form-input" id="input-state" value="${l(t.state)}" placeholder="e.g. Uttar Pradesh" />
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <input type="text" class="form-input" id="input-address" value="${l(t.address)}" placeholder="e.g. Sector 125" />
        </div>
      </div>

      <!-- Photo Upload -->
      <div class="form-group">
        <label class="form-label">Profile Photo</label>
        <div class="photo-upload">
          <div class="photo-preview">
            ${t.photo?`<img src="${t.photo}" alt="Profile photo" />`:'<span class="photo-placeholder">📷</span>'}
          </div>
          <div class="flex gap-sm">
            <label class="btn btn--sm btn--blue" style="cursor:pointer;">
              📁 Upload Photo
              <input type="file" id="input-photo" accept="image/jpeg,image/png" style="display:none;" />
            </label>
            ${t.photo?'<button class="btn btn--sm btn--red" id="btn-remove-photo">Remove</button>':""}
          </div>
          <p class="form-hint">JPEG or PNG, max 5MB. Will be cropped to passport size.</p>
        </div>
      </div>
    </div>
  `}function G(i,e){const t=i.academic;return`
    <div class="form-section ${e?"active":""}" data-form="academic">
      <h2 class="form-section-title">🎓 Education</h2>
      <p class="form-section-desc">Your academic background and qualifications.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-degree" value="${l(t.degree)}" placeholder="e.g. B.Tech in Computer Science" />
        </div>
        <div class="form-group">
          <label class="form-label">University</label>
          <input type="text" class="form-input" id="input-university" value="${l(t.university)}" placeholder="e.g. Amity University" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Graduation Year <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-grad-year" value="${l(t.graduationYear)}" placeholder="e.g. 2026" />
        </div>
        <div class="form-group">
          <label class="form-label">CGPA</label>
          <input type="text" class="form-input" id="input-cgpa" value="${l(t.cgpa)}" placeholder="e.g. 8.5" />
          <p class="form-hint">Scale of 0–10</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Specialization</label>
        <input type="text" class="form-input" id="input-specialization" value="${l(t.specialization)}" placeholder="e.g. Machine Learning & AI" />
      </div>

      <div class="form-group">
        <label class="form-label">Relevant Coursework</label>
        <textarea class="form-textarea" id="input-coursework" placeholder="e.g. Data Structures, Algorithms, Operating Systems, DBMS">${l(t.relevantCoursework)}</textarea>
      </div>
    </div>
  `}function _(i,e){return`
    <div class="form-section ${e?"active":""}" data-form="experience">
      <h2 class="form-section-title">💼 Work Experience</h2>
      <p class="form-section-desc">Internships, part-time roles, or full-time positions. Leave empty if not applicable.</p>

      ${i.experience.map((t,a)=>`
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Experience #${a+1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn exp-delete" data-index="${a}" title="Remove">✕</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input type="text" class="form-input" data-exp-field="title" data-exp-index="${a}" value="${l(t.title)}" placeholder="e.g. Software Engineering Intern" />
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <input type="text" class="form-input" data-exp-field="company" data-exp-index="${a}" value="${l(t.company)}" placeholder="e.g. Google" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="month" class="form-input" data-exp-field="startDate" data-exp-index="${a}" value="${l(t.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="month" class="form-input" data-exp-field="endDate" data-exp-index="${a}" value="${l(t.endDate)}" ${t.current?"disabled":""} />
              <label style="margin-top:4px;display:flex;align-items:center;gap:4px;font-size:0.8rem;">
                <input type="checkbox" data-exp-field="current" data-exp-index="${a}" ${t.current?"checked":""} /> Currently working here
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Key Responsibilities / Achievements</label>
            ${t.bullets.map((r,n)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-exp-bullet data-exp-index="${a}" data-bullet-index="${n}" value="${l(r)}" placeholder="Describe what you did..." style="flex:1;" />
                ${t.bullets.length>1?`<button class="btn btn--sm btn--red exp-remove-bullet" data-exp-index="${a}" data-bullet-index="${n}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn exp-add-bullet" data-exp-index="${a}" style="margin-top:4px;padding:8px;">+ Add Bullet Point</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-experience">+ Add Experience</button>
    </div>
  `}function W(i,e){return`
    <div class="form-section ${e?"active":""}" data-form="projects">
      <h2 class="form-section-title">🚀 Projects</h2>
      <p class="form-section-desc">Academic projects, personal projects, or hackathon entries.</p>

      ${i.projects.map((t,a)=>`
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Project #${a+1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn proj-delete" data-index="${a}" title="Remove">✕</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project Name</label>
              <input type="text" class="form-input" data-proj-field="name" data-proj-index="${a}" value="${l(t.name)}" placeholder="e.g. Real-time Chat Application" />
            </div>
            <div class="form-group">
              <label class="form-label">Tech Stack</label>
              <input type="text" class="form-input" data-proj-field="techStack" data-proj-index="${a}" value="${l(t.techStack)}" placeholder="e.g. React, Node.js, Socket.io" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Duration Start</label>
              <input type="month" class="form-input" data-proj-field="startDate" data-proj-index="${a}" value="${l(t.startDate)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Duration End</label>
              <input type="month" class="form-input" data-proj-field="endDate" data-proj-index="${a}" value="${l(t.endDate)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Project Link</label>
            <input type="url" class="form-input" data-proj-field="link" data-proj-index="${a}" value="${l(t.link)}" placeholder="https://github.com/..." />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            ${t.bullets.map((r,n)=>`
              <div class="flex gap-sm items-center mb-sm">
                <span style="font-family:var(--font-mono);color:var(--text-muted);">•</span>
                <input type="text" class="form-input" data-proj-bullet data-proj-index="${a}" data-bullet-index="${n}" value="${l(r)}" placeholder="Describe what you built..." style="flex:1;" />
                ${t.bullets.length>1?`<button class="btn btn--sm btn--red proj-remove-bullet" data-proj-index="${a}" data-bullet-index="${n}" style="padding:4px 8px;">✕</button>`:""}
              </div>
            `).join("")}
            <button class="add-entry-btn proj-add-bullet" data-proj-index="${a}" style="margin-top:4px;padding:8px;">+ Add Bullet Point</button>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-project">+ Add Project</button>
    </div>
  `}function X(i,e){return`
    <div class="form-section ${e?"active":""}" data-form="skills">
      <h2 class="form-section-title">⚡ Technical Skills</h2>
      <p class="form-section-desc">Add skills by category. Press Enter to add each skill.</p>

      ${[{key:"languages",label:"Programming Languages",placeholder:"e.g. Python",color:"tag--blue"},{key:"frameworks",label:"Frameworks & Libraries",placeholder:"e.g. React",color:"tag--pink"},{key:"tools",label:"Tools & Technologies",placeholder:"e.g. Git",color:"tag--green"},{key:"databases",label:"Databases",placeholder:"e.g. MongoDB",color:"tag--purple"},{key:"other",label:"Other Skills",placeholder:"e.g. Agile",color:""}].map(a=>`
        <div class="form-group">
          <label class="form-label">${a.label}</label>
          <div class="skills-input-wrapper">
            ${i.skills[a.key].map(r=>`
              <span class="tag ${a.color}">
                ${l(r)}
                <span class="tag-remove skill-remove" data-category="${a.key}" data-skill="${l(r)}">✕</span>
              </span>
            `).join("")}
            <input type="text" id="skill-input-${a.key}" placeholder="${a.placeholder}" />
          </div>
          <p class="form-hint">Type a skill and press Enter to add</p>
        </div>
      `).join("")}
    </div>
  `}function K(i,e){return`
    <div class="form-section ${e?"active":""}" data-form="achievements">
      <h2 class="form-section-title">🏆 Achievements & Certifications</h2>
      <p class="form-section-desc">Awards, certifications, or notable accomplishments. Optional section.</p>

      ${i.achievements.map((t,a)=>`
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Achievement #${a+1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn ach-delete" data-index="${a}" title="Remove">✕</button>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-input" data-ach-field="title" data-ach-index="${a}" value="${l(t.title)}" placeholder="e.g. AWS Certified Solutions Architect" />
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input type="text" class="form-input" data-ach-field="date" data-ach-index="${a}" value="${l(t.date)}" placeholder="e.g. March 2025" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" data-ach-field="description" data-ach-index="${a}" value="${l(t.description)}" placeholder="Brief description..." />
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-achievement">+ Add Achievement</button>
    </div>
  `}function Q(i,e){return`
    <div class="form-section ${e?"active":""}" data-form="leadership">
      <h2 class="form-section-title">👑 Leadership & Initiatives</h2>
      <p class="form-section-desc">Club activities, volunteer work, or leadership roles. Optional section.</p>

      ${i.leadership.map((t,a)=>`
        <div class="entry-card">
          <div class="entry-card-header">
            <span class="entry-card-title">Role #${a+1}</span>
            <div class="entry-card-actions">
              <button class="delete-btn lead-delete" data-index="${a}" title="Remove">✕</button>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Role</label>
              <input type="text" class="form-input" data-lead-field="role" data-lead-index="${a}" value="${l(t.role)}" placeholder="e.g. Technical Lead" />
            </div>
            <div class="form-group">
              <label class="form-label">Organization</label>
              <input type="text" class="form-input" data-lead-field="organization" data-lead-index="${a}" value="${l(t.organization)}" placeholder="e.g. Amity Coding Club" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" class="form-input" data-lead-field="description" data-lead-index="${a}" value="${l(t.description)}" placeholder="What did you do?" />
            </div>
            <div class="form-group">
              <label class="form-label">Date / Duration</label>
              <input type="text" class="form-input" data-lead-field="date" data-lead-index="${a}" value="${l(t.date)}" placeholder="e.g. Jan 2024 – Present" />
            </div>
          </div>
        </div>
      `).join("")}

      <button class="add-entry-btn" id="btn-add-leadership">+ Add Leadership Role</button>
    </div>
  `}function Z(i,e){const t=i.links;return`
    <div class="form-section ${e?"active":""}" data-form="links">
      <h2 class="form-section-title">🔗 Profile Links</h2>
      <p class="form-section-desc">Add your professional profile URLs. These will be clickable in the PDF.</p>

      <div class="form-group">
        <label class="form-label">GitHub</label>
        <input type="url" class="form-input" id="input-github" value="${l(t.github)}" placeholder="https://github.com/yourusername" />
        <p class="form-hint">Copy the full URL from your browser address bar</p>
      </div>

      <div class="form-group">
        <label class="form-label">LinkedIn</label>
        <input type="url" class="form-input" id="input-linkedin" value="${l(t.linkedin)}" placeholder="https://linkedin.com/in/yourusername" />
      </div>

      <div class="form-group">
        <label class="form-label">LeetCode</label>
        <input type="url" class="form-input" id="input-leetcode" value="${l(t.leetcode)}" placeholder="https://leetcode.com/yourusername" />
      </div>

      <div class="form-group">
        <label class="form-label">Portfolio Website</label>
        <input type="url" class="form-input" id="input-portfolio" value="${l(t.portfolio)}" placeholder="https://yourportfolio.com" />
      </div>

      <div class="form-group">
        <label class="form-label">Other Link</label>
        <input type="url" class="form-input" id="input-other-link" value="${l(t.other)}" placeholder="https://..." />
      </div>
    </div>
  `}function ee(i,e){const t=i.declaration;return`
    <div class="form-section ${e?"active":""}" data-form="declaration">
      <h2 class="form-section-title">📝 Declaration</h2>
      <p class="form-section-desc">Standard declaration for your resume. Only approved wording should be used.</p>

      <div class="form-group">
        <label class="form-label">Declaration Text</label>
        <textarea class="form-textarea" id="input-decl-text">${l(t.text)}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Place <span class="required">*</span></label>
          <input type="text" class="form-input" id="input-decl-place" value="${l(t.place)}" placeholder="e.g. Noida" />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="input-decl-date" value="${l(t.date)}" />
        </div>
      </div>

      <!-- Validation Checklist -->
      <div class="card card--yellow mt-xl">
        <h3 style="font-family:var(--font-display);text-transform:uppercase;font-size:0.9rem;margin-bottom:var(--space-md);">📋 Pre-Export Checklist</h3>
        <ul class="checklist" id="validation-checklist"></ul>
      </div>
    </div>
  `}async function te(i,e){const t=i.validate();if(t.length>0){e.show(`Please fix ${t.length} error(s) before exporting`,"error");return}e.show("Generating PDF...","info");try{const{default:a}=await M(async()=>{const{default:d}=await import("./html2pdf-DSIILl47.js").then(f=>f.h);return{default:d}},[]),r=i.getData(),n=document.createElement("div");n.style.cssText="position:absolute;left:-9999px;top:0;",n.innerHTML=ie(r),document.body.appendChild(n);const c=n.querySelector(".pdf-resume"),o={margin:0,filename:`${r.personal.fullName||"Resume"}_ur-CV.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};await a().set(o).from(c).save(),document.body.removeChild(n),e.show("PDF exported successfully!","success")}catch(a){console.error("PDF export error:",a),e.show("PDF export failed. Please try again.","error")}}function ie(i){const e=i.personal,t=i.academic,a=i.links,r=[];return a.github&&r.push(`<a href="${l(a.github)}" style="color:#0066CC;">GitHub</a>`),a.linkedin&&r.push(`<a href="${l(a.linkedin)}" style="color:#0066CC;">LinkedIn</a>`),a.leetcode&&r.push(`<a href="${l(a.leetcode)}" style="color:#0066CC;">LeetCode</a>`),a.portfolio&&r.push(`<a href="${l(a.portfolio)}" style="color:#0066CC;">Portfolio</a>`),a.other&&r.push(`<a href="${l(a.other)}" style="color:#0066CC;">Other</a>`),`
    <div class="pdf-resume" style="width:210mm;min-height:297mm;padding:15mm 20mm;font-family:'Times New Roman',Times,serif;font-size:11pt;color:#000;background:#fff;line-height:1.4;">
      <!-- Header -->
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:12px;position:relative;">
        ${e.photo?`<img src="${e.photo}" style="width:80px;height:100px;object-fit:cover;border:1px solid #000;position:absolute;right:0;top:0;" />`:""}
        <div style="font-size:20pt;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${l(e.fullName||"Your Name")}</div>
        <div style="font-size:9pt;color:#333;">
          ${[e.email,e.phone,[e.city,e.state].filter(Boolean).join(", ")].filter(Boolean).join(" | ")}
        </div>
        ${r.length>0?`<div style="margin-top:4px;font-size:9pt;">${r.join(" | ")}</div>`:""}
      </div>

      <!-- Education -->
      ${t.degree?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Education</div>
          <div style="display:flex;justify-content:space-between;font-weight:700;">
            <span>${l(t.degree)}${t.specialization?` — ${l(t.specialization)}`:""}</span>
            <span>${l(t.graduationYear)}</span>
          </div>
          <div style="font-style:italic;color:#444;font-size:10pt;">
            ${l(t.university)}${t.cgpa?` | CGPA: ${l(t.cgpa)}`:""}
          </div>
          ${t.relevantCoursework?`<div style="font-size:9pt;margin-top:3px;"><strong>Coursework:</strong> ${l(t.relevantCoursework)}</div>`:""}
        </div>
      `:""}

      <!-- Experience -->
      ${i.experience.length>0?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Experience</div>
          ${i.experience.map(n=>`
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>${l(n.title)}</span>
                <span style="font-size:9pt;">${l(n.startDate)}${n.endDate?` – ${l(n.endDate)}`:n.current?" – Present":""}</span>
              </div>
              <div style="font-style:italic;color:#444;font-size:10pt;">${l(n.company)}${n.location?`, ${l(n.location)}`:""}</div>
              ${n.bullets.filter(Boolean).length>0?`
                <ul style="list-style:disc;padding-left:18px;font-size:10pt;margin-top:3px;">
                  ${n.bullets.filter(Boolean).map(c=>`<li>${l(c)}</li>`).join("")}
                </ul>
              `:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- Projects -->
      ${i.projects.length>0?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Projects</div>
          ${i.projects.map(n=>`
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>${l(n.name)}${n.techStack?` <span style="font-weight:400;font-size:9pt;">[${l(n.techStack)}]</span>`:""}</span>
                <span style="font-size:9pt;">${l(n.startDate)}${n.endDate?` – ${l(n.endDate)}`:""}</span>
              </div>
              ${n.link?`<div style="font-size:9pt;"><a href="${l(n.link)}" style="color:#0066CC;">${l(n.link)}</a></div>`:""}
              ${n.bullets.filter(Boolean).length>0?`
                <ul style="list-style:disc;padding-left:18px;font-size:10pt;margin-top:3px;">
                  ${n.bullets.filter(Boolean).map(c=>`<li>${l(c)}</li>`).join("")}
                </ul>
              `:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- Skills -->
      ${Object.values(i.skills).some(n=>n.length>0)?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Technical Skills</div>
          <table style="width:100%;font-size:10pt;">
            ${i.skills.languages.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Languages:</td><td>${i.skills.languages.map(l).join(", ")}</td></tr>`:""}
            ${i.skills.frameworks.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Frameworks:</td><td>${i.skills.frameworks.map(l).join(", ")}</td></tr>`:""}
            ${i.skills.tools.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Tools:</td><td>${i.skills.tools.map(l).join(", ")}</td></tr>`:""}
            ${i.skills.databases.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Databases:</td><td>${i.skills.databases.map(l).join(", ")}</td></tr>`:""}
            ${i.skills.other.length>0?`<tr><td style="font-weight:700;padding:2px 8px 2px 0;vertical-align:top;white-space:nowrap;">Other:</td><td>${i.skills.other.map(l).join(", ")}</td></tr>`:""}
          </table>
        </div>
      `:""}

      <!-- Achievements -->
      ${i.achievements.length>0?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Achievements & Certifications</div>
          <ul style="list-style:disc;padding-left:18px;font-size:10pt;">
            ${i.achievements.map(n=>`
              <li><strong>${l(n.title)}</strong>${n.date?` (${l(n.date)})`:""}${n.description?` — ${l(n.description)}`:""}</li>
            `).join("")}
          </ul>
        </div>
      `:""}

      <!-- Leadership -->
      ${i.leadership.length>0?`
        <div style="margin-bottom:12px;">
          <div style="font-size:12pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:6px;">Leadership & Initiatives</div>
          ${i.leadership.map(n=>`
            <div style="margin-bottom:6px;">
              <div style="display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                <span>${l(n.role)}${n.organization?` — ${l(n.organization)}`:""}</span>
                <span>${l(n.date)}</span>
              </div>
              ${n.description?`<div style="font-size:10pt;">${l(n.description)}</div>`:""}
            </div>
          `).join("")}
        </div>
      `:""}

      <!-- Declaration -->
      ${i.declaration.text?`
        <div style="margin-top:20px;font-size:9pt;font-style:italic;color:#555;">
          <div style="font-weight:700;font-style:normal;margin-bottom:4px;">Declaration</div>
          <p>${l(i.declaration.text)}</p>
          <div style="margin-top:10px;">
            ${i.declaration.place?`<div>Place: ${l(i.declaration.place)}</div>`:""}
            ${i.declaration.date?`<div>Date: ${l(i.declaration.date)}</div>`:""}
          </div>
        </div>
      `:""}
    </div>
  `}function l(i){if(!i)return"";const e=document.createElement("div");return e.textContent=String(i),e.innerHTML}function ae({currentView:i,onBack:e,onSave:t,onDelete:a}){const r=document.createElement("header");return r.className="header",r.innerHTML=`
    <div class="header-logo">
      <span class="logo-accent">ur</span>-CV
    </div>
    <div class="header-actions" id="header-actions">
      ${i==="builder"?`
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to start">← Back</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft">💾 Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Delete draft">🗑 Delete</button>
      `:'<span class="tag tag--green">Free & Open Source</span>'}
    </div>
  `,i==="builder"&&setTimeout(()=>{var n,c,o;(n=document.getElementById("btn-back"))==null||n.addEventListener("click",e),(c=document.getElementById("btn-save"))==null||c.addEventListener("click",t),(o=document.getElementById("btn-delete"))==null||o.addEventListener("click",a)},0),r}function se(){const i=document.createElement("footer");return i.className="footer",i.innerHTML=`
    <p>
      <strong>ur-CV</strong> — Amity Resume Builder &copy; ${new Date().getFullYear()}<br>
      Built with ❤ for Amity University students. 
      <a href="https://github.com/Abhishek09821/ur-CV" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p style="margin-top: 8px; font-size: 0.7rem; opacity: 0.7;">
      This tool does not guarantee ATS success or interview selection. 
      AI suggestions are based on your profile only — no claims are fabricated.
    </p>
  `,i}class ne{show(e,t="info",a=3e3){const r=document.getElementById("toast-container")||this.createContainer(),n=document.createElement("div");n.className=`toast toast--${t}`,n.innerHTML=`
      <span>${this.getIcon(t)}</span>
      <span>${e}</span>
    `,r.appendChild(n),setTimeout(()=>{n.style.transition="all 0.3s ease",n.style.opacity="0",n.style.transform="translateX(100px)",setTimeout(()=>n.remove(),300)},a)}createContainer(){const e=document.createElement("div");return e.className="toast-container",e.id="toast-container",document.body.appendChild(e),e}getIcon(e){const t={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};return t[e]||t.info}}class le{constructor(){this.store=new N,this.toast=new ne,this.currentView="landing",this.mode=null,this.root=document.getElementById("app"),this.init()}init(){this.render(),this.loadDraft()}loadDraft(){const e=localStorage.getItem("ur-cv-draft");if(e)try{const t=JSON.parse(e);this.store.loadData(t)}catch(t){console.warn("Failed to load draft:",t)}}saveDraft(){try{localStorage.setItem("ur-cv-draft",JSON.stringify(this.store.getData())),this.toast.show("Draft saved!","success")}catch{this.toast.show("Failed to save draft","error")}}deleteDraft(){localStorage.removeItem("ur-cv-draft"),this.store.reset(),this.toast.show("Draft deleted!","info"),this.navigateTo("landing")}navigateTo(e,t=null){this.currentView=e,t&&(this.mode=t),this.render()}render(){this.root.innerHTML="";const e=ae({currentView:this.currentView,onBack:()=>this.navigateTo("landing"),onSave:()=>this.saveDraft(),onDelete:()=>{confirm("Are you sure you want to delete your draft? This cannot be undone.")&&this.deleteDraft()}});if(this.root.appendChild(e),this.currentView==="landing"){const a=document.createElement("div");a.className="ticker",a.innerHTML=`
        <div class="ticker-inner">
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
        </div>
      `,this.root.appendChild(a)}if(this.currentView==="landing"){const a=O({onSelectMode:r=>this.navigateTo("builder",r)});this.root.appendChild(a)}else if(this.currentView==="builder"){const a=H({store:this.store,mode:this.mode,toast:this.toast,onSave:()=>this.saveDraft(),onBack:()=>this.navigateTo("landing")});this.root.appendChild(a)}const t=se();if(this.root.appendChild(t),!document.querySelector(".toast-container")){const a=document.createElement("div");a.className="toast-container",a.id="toast-container",document.body.appendChild(a)}}}const oe=new le;window.app=oe;export{M as _};
