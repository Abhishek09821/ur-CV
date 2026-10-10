/**
 * ResumeStore — Central data store for the resume
 * Manages all resume fields with validation.
 */

const EMPTY_RESUME = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    photo: null, // base64 string
  },
  academic: {
    degree: '',
    university: 'Amity University',
    graduationYear: '',
    cgpa: '',
    specialization: '',
    relevantCoursework: '',
  },
  experience: [
    // { title, company, location, startDate, endDate, current, bullets: [''] }
  ],
  projects: [
    // { name, techStack, startDate, endDate, bullets: [''], link }
  ],
  skills: {
    languages: [],
    frameworks: [],
    tools: [],
    databases: [],
    other: [],
  },
  achievements: [
    // { title, description, date }
  ],
  leadership: [
    // { role, organization, description, date }
  ],
  links: {
    github: '',
    linkedin: '',
    leetcode: '',
    portfolio: '',
    other: '',
  },
  declaration: {
    text: 'I hereby declare that all the information furnished above is true to the best of my knowledge and belief.',
    place: '',
    date: new Date().toISOString().split('T')[0],
  },
};

export class ResumeStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(EMPTY_RESUME));
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
    this.data = { ...JSON.parse(JSON.stringify(EMPTY_RESUME)), ...data };
    this.notify();
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(EMPTY_RESUME));
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

  // Academic
  updateAcademic(field, value) {
    this.data.academic[field] = value;
    this.notify();
  }

  // Experience
  addExperience() {
    this.data.experience.push({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
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
    this.data.experience[expIndex].bullets.push('');
    this.notify();
  }

  updateExperienceBullet(expIndex, bulletIndex, value) {
    this.data.experience[expIndex].bullets[bulletIndex] = value;
    this.notify();
  }

  removeExperienceBullet(expIndex, bulletIndex) {
    this.data.experience[expIndex].bullets.splice(bulletIndex, 1);
    this.notify();
  }

  // Projects
  addProject() {
    this.data.projects.push({
      name: '',
      techStack: '',
      startDate: '',
      endDate: '',
      bullets: [''],
      link: '',
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
    this.data.projects[projIndex].bullets.push('');
    this.notify();
  }

  updateProjectBullet(projIndex, bulletIndex, value) {
    this.data.projects[projIndex].bullets[bulletIndex] = value;
    this.notify();
  }

  removeProjectBullet(projIndex, bulletIndex) {
    this.data.projects[projIndex].bullets.splice(bulletIndex, 1);
    this.notify();
  }

  // Skills
  addSkill(category, skill) {
    if (!this.data.skills[category].includes(skill)) {
      this.data.skills[category].push(skill);
      this.notify();
    }
  }

  removeSkill(category, skill) {
    this.data.skills[category] = this.data.skills[category].filter((s) => s !== skill);
    this.notify();
  }

  // Achievements
  addAchievement() {
    this.data.achievements.push({ title: '', description: '', date: '' });
    this.notify();
  }

  updateAchievement(index, field, value) {
    if (this.data.achievements[index]) {
      this.data.achievements[index][field] = value;
      this.notify();
    }
  }

  removeAchievement(index) {
    this.data.achievements.splice(index, 1);
    this.notify();
  }

  // Leadership
  addLeadership() {
    this.data.leadership.push({ role: '', organization: '', description: '', date: '' });
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
  updateLink(platform, value) {
    this.data.links[platform] = value;
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

    if (!this.data.personal.fullName.trim()) errors.push({ section: 'personal', field: 'fullName', message: 'Full name is required' });
    if (!this.data.personal.email.trim()) errors.push({ section: 'personal', field: 'email', message: 'Email is required' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.personal.email)) errors.push({ section: 'personal', field: 'email', message: 'Invalid email format' });
    if (!this.data.personal.phone.trim()) errors.push({ section: 'personal', field: 'phone', message: 'Phone number is required' });
    else if (!/^[\d\+\-\(\)\s]{7,15}$/.test(this.data.personal.phone)) errors.push({ section: 'personal', field: 'phone', message: 'Invalid phone format' });

    if (!this.data.academic.degree.trim()) errors.push({ section: 'academic', field: 'degree', message: 'Degree is required' });
    if (!this.data.academic.graduationYear.trim()) errors.push({ section: 'academic', field: 'graduationYear', message: 'Graduation year is required' });
    if (this.data.academic.cgpa && (isNaN(this.data.academic.cgpa) || this.data.academic.cgpa < 0 || this.data.academic.cgpa > 10)) {
      errors.push({ section: 'academic', field: 'cgpa', message: 'CGPA must be between 0 and 10' });
    }

    // URL validations
    Object.entries(this.data.links).forEach(([platform, url]) => {
      if (url && !isValidUrl(url)) {
        errors.push({ section: 'links', field: platform, message: `Invalid ${platform} URL` });
      }
    });

    return errors;
  }

  getCompletionStatus() {
    const d = this.data;
    return {
      personal: !!(d.personal.fullName && d.personal.email && d.personal.phone),
      academic: !!(d.academic.degree && d.academic.graduationYear),
      experience: d.experience.length > 0,
      projects: d.projects.length > 0,
      skills: Object.values(d.skills).some((arr) => arr.length > 0),
      achievements: true, // optional
      leadership: true, // optional
      links: !!(d.links.github || d.links.linkedin),
      declaration: !!(d.declaration.place),
    };
  }
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}
