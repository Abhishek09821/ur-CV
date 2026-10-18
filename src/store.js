import { AMITY_DEFAULT_PHOTO_DATA_URL } from './assets/amity-assets.js';

export const UNIVERSAL_DEFAULT_RESUME = {
  template: 'amity', // 'amity' | 'jakes'
  personal: {
    fullName: 'Abhishek Tiwari',
    address: 'Gayatri Vihar Colony, Pinto Park Rd, Gwalior 474005',
    phone: '+919691966023',
    email: 'abhishek.tiwarii9821@gmail.com',
    photo: AMITY_DEFAULT_PHOTO_DATA_URL, // Official candidate photo pre-loaded
  },
  objective: 'Motivated final-year B.Tech Computer Science student with a strong foundation in software architecture, full-stack development, and AI/ML-driven solutions. Adept at writing clean, reusable code, integrating APIs, and quickly adapting to new frameworks. Seeking a Trainee Software Engineer role to design and deliver scalable, end-to-end features using core programming skills in Java and Python.',
  academic: [
    'BTech- CGPA 7.79 | Minor in Cyber Security',
    'Senior Secondary (12th), CBSE – 69.8%',
    'Secondary (10th), CBSE – 70.8%',
  ],
  experience: [
    {
      title: 'Web Development Internship',
      company: 'Edunet Foundation – AICTE Collaboration',
      duration: 'Aug 21, 2025 – Sep 30, 2025 (6 weeks, Virtual)',
      bullets: [
        'Built and debugged responsive, user-friendly web interfaces using HTML, CSS, and JavaScript',
        'Strengthened UI/UX understanding and applied modern front-end web development practices',
        'Collaborated with virtual team members and consistently delivered tasks within set timelines',
      ],
    },
    {
      title: 'Palo Alto Networks Cybersecurity Virtual Internship',
      company: 'EduSkills Collaboration',
      duration: 'Oct 2025 – Dec 2025 (3 months, Virtual)',
      bullets: [
        'Completed structured cybersecurity training covering network security, threat detection, and security operations fundamentals under the Palo Alto Networks curriculum',
        'Gained hands-on exposure to firewall configurations, threat prevention techniques, and security frameworks through guided virtual labs',
        'Strengthened understanding of enterprise cybersecurity practices and industry-standard security tools',
      ],
    },
  ],
  projects: [
    {
      name: 'FINMATE AI',
      techStack: 'Python, Flask, MySQL, LLM, RAG, React.js',
      bullets: [
        'Built an AI-powered financial intelligence platform that analyses financial data and generates structured, actionable insights for informed decision-making.',
        'Implemented Retrieval-Augmented Generation (RAG) pipelines and intelligent document processing to extract and contextualise information from unstructured financial documents.',
        'Engineered efficient backend data workflows in Python & Flask to transform raw outputs into decision-support systems. and a powerful AI Advisor that can tackle any money related issue',
        'Applied statistical analysis and AI-driven techniques to deliver personalised financial recommendations, improving information accessibility and decision quality.',
      ],
    },
    {
      name: 'CANARY-WORKSPACE AI FILE',
      techStack: 'Python, Flask, SQLite, Fernet Encryption, Telegram and multichannel API',
      bullets: [
        'Built a lightweight file-monitoring and managing tool to manage and detect unauthorized file access in real time.',
        'Implemented webcam snapshot capture, IP chat for managing files and multi-channel API integrations that use access events.',
        'Designed a dark-themed monitoring dashboard for real-time visibility into access events and system activity.',
        'Secured sensitive logs and captured evidence using Fernet encryption to protect against tampering.',
      ],
    },
  ],
  skills: [
    {
      category: 'Web Development and Backend',
      skills: 'React.js, JavaScript (ES6+), HTML5, CSS3, Responsive Web Design, DOM Manipulation, REST APIs, Node.js, NPM.',
    },
    {
      category: 'Frameworks & Technologies',
      skills: 'Next.js (App Router), Node.js, Express.js, Flask, Tailwind CSS',
    },
    {
      category: 'Programming & Core Skills',
      skills: 'Python, SQL, Java, C++, Object-Oriented Programming (OOP), Data Structures & Algorithms, Software Architecture.',
    },
    {
      category: 'AI & Machine Learning',
      skills: 'LLM Applications, Prompt Engineering, RAG Systems, AI APIs, Machine Learning',
    },
    {
      category: 'Databases',
      skills: 'MySQL, Relational Database Design, Database Query Optimization, JSON-based Storage',
    },
    {
      category: 'Cybersecurity Tools',
      skills: 'Digital Forensics Tools, Cyber Law Frameworks, Threat Analysis Tools',
    },
    {
      category: 'Integrations',
      skills: 'Razorpay (Payments), PDF Generation, Messaging APIs, Third-Party API Integration',
    },
    {
      category: 'Data & Analytics',
      skills: 'Microsoft Excel',
    },
    {
      category: 'Operating Systems',
      skills: 'Windows, Unix/Linux',
    },
    {
      category: 'Developer & Analytics Tools',
      skills: 'Git, GitHub, VS Code, OpenCV, Claude, Cursor, Excel, Firebase, Supabase, Kiro, Antigravity',
    },
  ],
  awards: [
    'Tata Cybersecurity Analyst Certification',
    'Google Generative AI Certification',
    'Oracle Networking Professional Certification',
    'IBM Web Development Certification',
    'Palo Alto Cybersecurity Certification',
    '3x Hackathon Participation Experience (Including 1x Winner)',
  ],
  leadership: [
    {
      title: 'End-to-End Application Delivery',
      description: 'Independently conceptualized, engineered, and deployed scalable AI and web software projects from scratch.',
    },
    {
      title: '',
      description: 'Collaborated with peers during hackathons and academic projects to build and ship full-stack solutions under tight timelines.',
    },
    {
      title: '',
      description: 'Demonstrated ownership by identifying real-world problems and building responsive, user-focused web solutions to address them.',
    },
  ],
  links: [
    { label: 'Linkedin', url: 'https://www.linkedin.com/in/abhishektiwarii/' },
    { label: 'Github', url: 'https://github.com/Abhishek09821' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/abhishektiwarii9821/' },
  ],
  declaration: {
    text: 'I hereby declare that all the above information is true to the best of my knowledge and belief.',
    date: '23rd July 2026',
    place: 'Gwalior',
  },
};

export const JAKES_DEFAULT_RESUME = {
  template: 'jakes',
  personal: {
    fullName: 'Abhishek Tiwari',
    address: 'Gwalior, Madhya Pradesh',
    phone: '+91 96919 66023',
    email: 'abhishek.tiwarii9821@gmail.com',
  },
  objective: 'B.Tech Computer Science student focused on Software Development and Full-Stack Engineering, with hands-on experience delivering responsive web applications, Python backends, REST APIs, AI-enabled products, real-time multiplayer features, and low-code business applications. Experienced with React, Next.js, Flask, TypeScript, PostgreSQL, MongoDB, Firebase, Docker, Supabase, and Pega App Studio, with a focus on scalable application architecture, clean implementation, API integration, and end-to-end feature delivery.',
  academic: [
    {
      institution: 'Amity University Madhya Pradesh',
      details: 'B.Tech in Computer Science Engineering | Minor in Cyber Security | CGPA: 7.79 | Final Year',
    },
    {
      institution: 'Senior Secondary (12th), CBSE',
      details: '69.8%',
    },
    {
      institution: 'Secondary (10th), CBSE',
      details: '70.8%',
    },
  ],
  experience: [
    {
      title: 'Application Development Intern - Pega National Internship Program (NIP)',
      company: 'Pega Platform',
      duration: 'Aug 4, 2026 - Sep 4, 2026',
      bullets: [
        'Developed a Movie Ticket Management application on Pega App Studio using Pega Blueprint, modeling an end-to-end booking workflow.',
        'Implemented show availability, seat management, ticket requests, booking cost calculation, approvals, booking execution, and ticket/seat allocation.',
        'Configured confirmation email notifications, SLA goals and deadlines, and show-type-based work-queue routing within the Pega low-code environment.',
      ],
    },
    {
      title: 'Web Development Intern',
      company: '| Edunet Foundation - AICTE Collaboration',
      duration: 'Aug 21, 2025 - Sep 30, 2025 6 weeks, Virtual',
      bullets: [
        'Developed and debugged responsive web interfaces using HTML, CSS, and JavaScript while applying modern front-end and UI/UX practices.',
        'Collaborated with virtual team members and delivered assigned development tasks within defined internship timelines.',
      ],
    },
  ],
  projects: [
    {
      name: 'FINMATE AI',
      techStack: 'Python, Flask, React.js, MySQL, LLMs, RAG',
      bullets: [
        'Created an AI-powered financial intelligence platform that transforms financial data and documents into structured, actionable insights.',
        'Integrated Retrieval-Augmented Generation (RAG) and intelligent document processing for contextual analysis of unstructured financial information.',
        'Engineered Python and Flask backend workflows and an AI Advisor for personalized, decision-oriented financial guidance and data-driven recommendations.',
      ],
    },
    {
      name: 'ARENA - Sports Quiz Platform',
      techStack: 'Next.js, React, TypeScript, Supabase Postgres, Realtime, Zustand, AI APIs',
      bullets: [
        'Designed a sports quiz platform spanning 8 sports with solo, sprint, challenge, admin, and real-time multiplayer modes.',
        'Implemented Supabase Postgres with row-level security, Realtime broadcast/presence, synchronized multiplayer rooms, scoring, timers, and persistent game state using Zustand.',
        'Integrated multi-provider AI question synthesis and schema validation, supported by a 45-assertion automated test suite covering scoring, validation, timers, and data integrity.',
        'Engineered real-time voice/chat capabilities using Socket.IO, WebRTC, and Web Audio API for interactive multiplayer sessions.',
      ],
    },
    {
      name: 'Movie Ticket Management System',
      techStack: 'Pega Platform, Pega App Studio, Pega Blueprint, Low-Code',
      bullets: [
        'Designed a Pega case workflow covering ticket requests, show availability, approval, booking execution, and resolution.',
        'Automated seat and ticket handling, booking IDs, cost calculation, confirmation emails, SLA targets/deadlines, and queue routing within the Pega platform.',
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      skills: 'Python, C, C++, JavaScript, TypeScript, SQL',
    },
    {
      category: 'Core CS',
      skills: 'Data Structures & Algorithms, Object-Oriented Programming, Software Architecture, Operating Systems, Computer Networks',
    },
    {
      category: 'Web & Frameworks',
      skills: 'HTML5, CSS3, Bootstrap, React.js, Next.js, Flask, Express.js, Tailwind CSS, REST APIs',
    },
    {
      category: 'Backend & Databases',
      skills: 'PostgreSQL, MySQL, MongoDB, Firebase, Supabase, Database Design, Query Optimization',
    },
    {
      category: 'AI Applications',
      skills: 'LLM Applications, RAG Systems, AI APIs, Prompt Engineering, Intelligent Document Processing',
    },
    {
      category: 'Low-Code Development',
      skills: 'Pega Platform, Pega App Studio, Pega Blueprint, Pega Environment, Low-Code Application Development',
    },
    {
      category: 'Realtime & Libraries',
      skills: 'Socket.IO, WebSockets, WebRTC, Web Audio API, Supabase Realtime, Zustand, Framer Motion',
    },
    {
      category: 'Tools & Deployment',
      skills: 'Docker, Git, GitHub, Vercel, Render, Railway, Netlify, NPM, Postman, Pega App Studio',
    },
  ],
  awards: [
    'IBM Web Development Certification - IBM SkillsBuild (2025)',
    'Google Generative AI Certification - Simplilearn (2025)',
    'Tata Cybersecurity Analyst - Forage (2025)',
    'VOIS Data Analytics Certification - VOIS (2026)',
  ],
  achievements: [
    'Participated in 4 hackathons: Smart India Hackathon (SIH) - 2023, 2025, and 2026',
    'Winner, Amity Zync Hackathon - 2026 with FINMATE AI',
  ],
  links: [
    { label: 'GitHub', url: 'https://github.com/Abhishek09821' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/abhishektiwarii/' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/abhishektiwarii9821/' },
  ],
};

export class ResumeStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME));
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l(this.data));
  }

  getData() {
    return JSON.parse(JSON.stringify(this.data));
  }

  loadData(data, replace = false) {
    if (data && typeof data === 'object') {
      if (data.academic && !Array.isArray(data.academic)) {
        delete data.academic;
      }
      if (data.skills && !Array.isArray(data.skills)) {
        delete data.skills;
      }
      if (replace) {
        // For parsed resume uploads: start from clean empty structure
        // Populate all extracted fields and leave unprovided fields blank
        const template = data.template || 'amity';
        this.data = {
          template,
          personal: {
            fullName: data.personal?.fullName || '',
            address: data.personal?.address || '',
            phone: data.personal?.phone || '',
            email: data.personal?.email || '',
            photo: data.personal?.photo || null,
          },
          objective: data.objective || '',
          academic: Array.isArray(data.academic) ? data.academic : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          awards: Array.isArray(data.awards) ? data.awards : [],
          links: Array.isArray(data.links) ? data.links : [],
          leadership: Array.isArray(data.leadership) ? data.leadership : [],
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          declaration: data.declaration || (template === 'jakes' ? {} : {
            text: 'I hereby declare that all the above information is true to the best of my knowledge and belief.',
            date: '',
            place: '',
          }),
        };
      } else {
        this.data = { ...JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME)), ...data };
      }
      this.notify();
    }
  }

  reset(targetTemplate) {
    const tpl = targetTemplate || this.data.template || 'amity';
    if (tpl === 'jakes') {
      this.data = JSON.parse(JSON.stringify(JAKES_DEFAULT_RESUME));
    } else {
      this.data = JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME));
    }
    this.notify();
  }

  getTemplate() {
    return this.data.template || 'amity';
  }

  setTemplate(template) {
    const prevTemplate = this.data.template || 'amity';
    this.data.template = template;

    if (template === 'jakes' && prevTemplate !== 'jakes') {
      // If current resume still has the default Amity template data, upgrade cleanly to Jake's default data
      const isAmityDefault = 
        this.data.personal?.address?.includes('Gayatri Vihar') || 
        this.data.projects?.some((p) => p.name === 'CANARY-WORKSPACE AI FILE');
      
      if (isAmityDefault) {
        this.data = JSON.parse(JSON.stringify(JAKES_DEFAULT_RESUME));
      } else {
        // User has customized data: preserve user fields, ensure achievements array exists
        if (!this.data.achievements) {
          this.data.achievements = JSON.parse(JSON.stringify(JAKES_DEFAULT_RESUME.achievements));
        }
      }
    } else if (template === 'amity' && prevTemplate !== 'amity') {
      const isJakesDefault = 
        this.data.projects?.some((p) => p.name === 'Movie Ticket Management System') ||
        this.data.experience?.some((e) => e.company === 'Pega Platform');
      if (isJakesDefault) {
        this.data = JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME));
      }
    }

    this.notify();
  }

  // Personal
  updatePersonal(field, value) {
    this.data.personal[field] = value;
    this.notify();
  }

  setPhoto(base64) {
    this.data.personal.photo = base64;
    this.notify();
  }

  // Career Objective
  updateObjective(text) {
    this.data.objective = text;
    this.notify();
  }

  // Academic Details (Array of bullet strings)
  setAcademic(academicList) {
    this.data.academic = academicList;
    this.notify();
  }

  addAcademicBullet(text = '') {
    this.data.academic.push(text);
    this.notify();
  }

  updateAcademicBullet(index, text) {
    if (this.data.academic[index] !== undefined) {
      this.data.academic[index] = text;
      this.notify();
    }
  }

  removeAcademicBullet(index) {
    this.data.academic.splice(index, 1);
    this.notify();
  }

  addAcademicEntry(institution = '', details = '') {
    this.data.academic.push({ institution, details });
    this.notify();
  }

  updateAcademicEntry(index, field, value) {
    if (this.data.academic[index]) {
      if (typeof this.data.academic[index] === 'string') {
        const str = this.data.academic[index];
        this.data.academic[index] = { institution: str, details: '' };
      }
      this.data.academic[index][field] = value;
      this.notify();
    }
  }

  // Experience
  addExperience() {
    this.data.experience.push({
      title: '',
      company: '',
      duration: '',
      bullets: [''],
    });
    this.notify();
  }

  updateExperience(index, field, value) {
    if (this.data.experience[index]) {
      this.data.experience[index][field] = value;
      this.notify();
    }
  }

  removeExperience(index) {
    this.data.experience.splice(index, 1);
    this.notify();
  }

  addExperienceBullet(expIndex) {
    if (this.data.experience[expIndex]) {
      this.data.experience[expIndex].bullets.push('');
      this.notify();
    }
  }

  updateExperienceBullet(expIndex, bulletIndex, value) {
    if (this.data.experience[expIndex] && this.data.experience[expIndex].bullets) {
      this.data.experience[expIndex].bullets[bulletIndex] = value;
      this.notify();
    }
  }

  removeExperienceBullet(expIndex, bulletIndex) {
    if (this.data.experience[expIndex] && this.data.experience[expIndex].bullets) {
      this.data.experience[expIndex].bullets.splice(bulletIndex, 1);
      this.notify();
    }
  }

  // Projects
  addProject() {
    this.data.projects.push({
      name: '',
      techStack: '',
      bullets: [''],
    });
    this.notify();
  }

  updateProject(index, field, value) {
    if (this.data.projects[index]) {
      this.data.projects[index][field] = value;
      this.notify();
    }
  }

  removeProject(index) {
    this.data.projects.splice(index, 1);
    this.notify();
  }

  addProjectBullet(projIndex) {
    if (this.data.projects[projIndex]) {
      this.data.projects[projIndex].bullets.push('');
      this.notify();
    }
  }

  updateProjectBullet(projIndex, bulletIndex, value) {
    if (this.data.projects[projIndex] && this.data.projects[projIndex].bullets) {
      this.data.projects[projIndex].bullets[bulletIndex] = value;
      this.notify();
    }
  }

  removeProjectBullet(projIndex, bulletIndex) {
    if (this.data.projects[projIndex] && this.data.projects[projIndex].bullets) {
      this.data.projects[projIndex].bullets.splice(bulletIndex, 1);
      this.notify();
    }
  }

  // Skills Categories
  addSkillCategory(category = '', skills = '') {
    this.data.skills.push({ category, skills });
    this.notify();
  }

  updateSkillCategory(index, field, value) {
    if (this.data.skills[index]) {
      this.data.skills[index][field] = value;
      this.notify();
    }
  }

  removeSkillCategory(index) {
    this.data.skills.splice(index, 1);
    this.notify();
  }

  // Awards & Certifications
  addAward(text = '') {
    this.data.awards.push(text);
    this.notify();
  }

  updateAward(index, text) {
    if (this.data.awards[index] !== undefined) {
      this.data.awards[index] = text;
      this.notify();
    }
  }

  removeAward(index) {
    this.data.awards.splice(index, 1);
    this.notify();
  }

  // Achievements
  addAchievement(text = '') {
    if (!this.data.achievements) this.data.achievements = [];
    this.data.achievements.push(text);
    this.notify();
  }

  updateAchievement(index, text) {
    if (!this.data.achievements) this.data.achievements = [];
    if (this.data.achievements[index] !== undefined) {
      this.data.achievements[index] = text;
      this.notify();
    }
  }

  removeAchievement(index) {
    if (this.data.achievements && this.data.achievements[index] !== undefined) {
      this.data.achievements.splice(index, 1);
      this.notify();
    }
  }

  // Leadership & Initiative
  addLeadership(title = '', description = '') {
    this.data.leadership.push({ title, description });
    this.notify();
  }

  updateLeadership(index, field, value) {
    if (this.data.leadership[index]) {
      this.data.leadership[index][field] = value;
      this.notify();
    }
  }

  removeLeadership(index) {
    this.data.leadership.splice(index, 1);
    this.notify();
  }

  // Links
  addLink(label = '', url = '') {
    this.data.links.push({ label, url });
    this.notify();
  }

  updateLink(index, field, value) {
    if (this.data.links[index]) {
      this.data.links[index][field] = value;
      this.notify();
    }
  }

  removeLink(index) {
    this.data.links.splice(index, 1);
    this.notify();
  }

  // Declaration
  updateDeclaration(field, value) {
    this.data.declaration[field] = value;
    this.notify();
  }

  // Validation
  validate() {
    const errors = [];
    const p = this.data.personal;
    if (!p.fullName.trim()) errors.push({ section: 'personal', field: 'fullName', message: 'Full name is required' });
    if (!p.email.trim()) errors.push({ section: 'personal', field: 'email', message: 'Email is required' });
    if (!p.phone.trim()) errors.push({ section: 'personal', field: 'phone', message: 'Phone number is required' });
    return errors;
  }

  getCompletionStatus() {
    const d = this.data;
    const isJakes = d.template === 'jakes';
    return {
      personal: !!(d.personal.fullName && d.personal.email && d.personal.phone),
      objective: !!(d.objective && d.objective.trim()),
      academic: Boolean(d.academic && d.academic.length > 0),
      experience: Boolean(d.experience && d.experience.length > 0),
      projects: Boolean(d.projects && d.projects.length > 0),
      skills: Boolean(d.skills && d.skills.length > 0),
      awards: Boolean((d.awards && d.awards.length > 0) || (d.achievements && d.achievements.length > 0)),
      leadership: isJakes ? true : Boolean(d.leadership && d.leadership.length > 0),
      links: isJakes ? true : Boolean(d.links && d.links.length > 0),
      declaration: isJakes ? true : !!(d.declaration && d.declaration.place && d.declaration.date),
    };
  }
}
