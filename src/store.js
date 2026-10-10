import { AMITY_DEFAULT_PHOTO_DATA_URL } from './assets/amity-assets.js';

export const UNIVERSAL_DEFAULT_RESUME = {
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

  loadData(data) {
    if (data && typeof data === 'object') {
      if (data.academic && !Array.isArray(data.academic)) {
        delete data.academic;
      }
      if (data.skills && !Array.isArray(data.skills)) {
        delete data.skills;
      }
      this.data = { ...JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME)), ...data };
      this.notify();
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(UNIVERSAL_DEFAULT_RESUME));
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

  // Awards & Achievements
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
    return {
      personal: !!(d.personal.fullName && d.personal.email && d.personal.phone),
      objective: !!(d.objective && d.objective.trim()),
      academic: d.academic.length > 0,
      experience: d.experience.length > 0,
      projects: d.projects.length > 0,
      skills: d.skills.length > 0,
      awards: d.awards.length > 0,
      leadership: d.leadership.length > 0,
      links: d.links.length > 0,
      declaration: !!(d.declaration.place && d.declaration.date),
    };
  }
}
