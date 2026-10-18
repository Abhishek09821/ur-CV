/**
 * Bullet Point Generator for Experience & Projects
 *
 * Generates professional, resume-ready bullet points for:
 * - Experience/Internship entries (based on role, company, tech used)
 * - Project entries (based on project name, tech stack, description)
 *
 * Similar to the career objective generator — uses intelligent template
 * composition with action verbs, tech alignment, and outcome phrasing.
 *
 * Generates 4 diverse bullet point suggestions per entry.
 */

// ============================================================
// ACTION VERB POOLS
// ============================================================

const EXPERIENCE_ACTION_VERBS = [
  'Developed', 'Built', 'Designed', 'Implemented', 'Engineered',
  'Architected', 'Deployed', 'Optimized', 'Streamlined', 'Automated',
  'Configured', 'Integrated', 'Maintained', 'Debugged', 'Refactored',
  'Collaborated', 'Led', 'Spearheaded', 'Delivered', 'Executed',
  'Created', 'Established', 'Enhanced', 'Improved', 'Resolved',
  'Contributed', 'Coordinated', 'Facilitated', 'Monitored', 'Strengthened',
];

const PROJECT_ACTION_VERBS = [
  'Built', 'Developed', 'Designed', 'Created', 'Engineered',
  'Implemented', 'Architected', 'Constructed', 'Crafted', 'Produced',
  'Programmed', 'Coded', 'Deployed', 'Launched', 'Released',
  'Integrated', 'Applied', 'Utilized', 'Leveraged', 'Incorporated',
  'Achieved', 'Delivered', 'Generated', 'Enabled', 'Transformed',
  'Secured', 'Encrypted', 'Processed', 'Analyzed', 'Visualized',
];

// ============================================================
// OUTCOME / IMPACT PHRASES
// ============================================================

const OUTCOME_PHRASES = [
  'improving overall performance and user experience',
  'resulting in enhanced system reliability and maintainability',
  'achieving measurable improvements in efficiency',
  'reducing manual effort and increasing automation coverage',
  'enabling scalable and modular code architecture',
  'ensuring clean, reusable, and well-documented code',
  'improving data accuracy and processing speed',
  'enhancing security posture and compliance standards',
  'delivering a seamless and responsive user interface',
  'streamlining development workflows and CI/CD pipelines',
  'facilitating real-time data processing and visualization',
  'increasing code coverage and reducing production defects',
  'enabling seamless third-party API integration',
  'supporting concurrent users with optimized backend performance',
  'providing actionable insights through data-driven dashboards',
];

// ============================================================
// TECH-SPECIFIC CONTEXT PHRASES
// ============================================================

const TECH_CONTEXT = {
  // Frontend
  'react': ['responsive React.js components', 'reusable UI component library', 'state management with hooks and context'],
  'next.js': ['server-side rendered pages with Next.js', 'App Router architecture with dynamic routing', 'optimized SEO and page performance'],
  'html': ['semantic HTML5 markup', 'accessible web interfaces', 'clean HTML structure following W3C standards'],
  'css': ['responsive layouts using CSS3 Flexbox and Grid', 'custom CSS animations and transitions', 'mobile-first responsive design'],
  'tailwind': ['utility-first styling with Tailwind CSS', 'responsive design system using Tailwind', 'custom design tokens and theme configuration'],
  'javascript': ['modern JavaScript (ES6+) patterns', 'asynchronous data fetching and DOM manipulation', 'event-driven architecture in JavaScript'],
  'typescript': ['type-safe TypeScript interfaces and generics', 'strict TypeScript configuration for code quality', 'TypeScript-first architecture'],

  // Backend
  'python': ['Python backend services', 'data processing pipelines in Python', 'Python-based automation scripts'],
  'flask': ['Flask REST API endpoints', 'lightweight Flask microservice', 'Flask application with Jinja2 templates'],
  'django': ['Django MVC application architecture', 'Django REST Framework API layer', 'Django ORM with efficient query patterns'],
  'node.js': ['Node.js server-side logic', 'Express.js middleware and route handlers', 'Node.js event-driven architecture'],
  'express': ['RESTful Express.js API', 'Express middleware chain for authentication', 'Express route controllers'],
  'java': ['Java-based backend services', 'object-oriented Java architecture', 'multithreaded Java applications'],
  'spring boot': ['Spring Boot microservices', 'Spring Security authentication flow', 'Spring Data JPA repositories'],

  // Databases
  'mysql': ['MySQL relational schema design', 'optimized SQL queries for MySQL', 'normalized MySQL database architecture'],
  'postgresql': ['PostgreSQL database with complex queries', 'PostgreSQL with row-level security', 'advanced PostgreSQL indexing strategies'],
  'mongodb': ['MongoDB document storage', 'NoSQL data modeling with MongoDB', 'MongoDB aggregation pipelines'],
  'firebase': ['Firebase Realtime Database', 'Firebase Authentication integration', 'Firestore document collections'],
  'supabase': ['Supabase Postgres database', 'Supabase Realtime subscriptions', 'Supabase row-level security policies'],
  'sqlite': ['lightweight SQLite storage', 'embedded SQLite database', 'local SQLite data persistence'],

  // AI/ML
  'llm': ['LLM-powered intelligent features', 'large language model integration', 'AI-driven natural language processing'],
  'rag': ['Retrieval-Augmented Generation pipeline', 'RAG-based contextual document search', 'intelligent document retrieval and synthesis'],
  'machine learning': ['machine learning model training and evaluation', 'ML classification and prediction pipelines', 'feature engineering for ML models'],
  'ai': ['AI-powered recommendation engine', 'artificial intelligence integration', 'intelligent automation features'],

  // DevOps & Cloud
  'docker': ['Docker containerization', 'multi-container Docker Compose setup', 'containerized deployment pipeline'],
  'aws': ['AWS cloud infrastructure', 'AWS Lambda serverless functions', 'S3 storage and CloudFront CDN'],
  'git': ['Git version control workflow', 'branching strategy and pull request reviews', 'Git-based collaborative development'],

  // Security
  'encryption': ['data encryption at rest and in transit', 'Fernet/AES encryption for sensitive data', 'end-to-end encryption implementation'],
  'cybersecurity': ['cybersecurity best practices', 'vulnerability assessment and remediation', 'security audit and compliance checks'],

  // APIs
  'rest api': ['RESTful API design and implementation', 'API endpoint documentation and versioning', 'HTTP request handling and response formatting'],
  'api': ['third-party API integration', 'custom API development and testing', 'API authentication and rate limiting'],
};

// ============================================================
// GENERATION ENGINE
// ============================================================

/**
 * Generate bullet point suggestions for an experience entry.
 *
 * @param {Object} params
 * @param {string} params.title - Role/internship title
 * @param {string} params.company - Company/organization name
 * @param {string} params.duration - Duration string
 * @param {string[]} params.existingBullets - Already written bullets (to avoid duplicates)
 * @returns {Object} { suggestions: string[] } - 4 suggested bullet points
 */
export function generateExperienceBullets({ title = '', company = '', duration = '', existingBullets = [] }) {
  const context = `${title} ${company} ${duration}`.toLowerCase();
  const suggestions = [];
  const usedVerbs = new Set();

  // Identify relevant technologies from the context
  const relevantTech = findRelevantTech(context);

  for (let i = 0; i < 4; i++) {
    const bullet = composeExperienceBullet(relevantTech, title, company, usedVerbs, i);
    suggestions.push(bullet);
  }

  return { suggestions };
}

/**
 * Generate bullet point suggestions for a project entry.
 *
 * @param {Object} params
 * @param {string} params.name - Project name
 * @param {string} params.techStack - Technologies used
 * @param {string[]} params.existingBullets - Already written bullets
 * @returns {Object} { suggestions: string[] } - 4 suggested bullet points
 */
export function generateProjectBullets({ name = '', techStack = '', existingBullets = [] }) {
  const context = `${name} ${techStack}`.toLowerCase();
  const suggestions = [];
  const usedVerbs = new Set();

  // Identify relevant technologies
  const relevantTech = findRelevantTech(context);

  for (let i = 0; i < 4; i++) {
    const bullet = composeProjectBullet(relevantTech, name, techStack, usedVerbs, i);
    suggestions.push(bullet);
  }

  return { suggestions };
}

// ============================================================
// COMPOSITION HELPERS
// ============================================================

function findRelevantTech(context) {
  const found = [];
  for (const tech of Object.keys(TECH_CONTEXT)) {
    if (context.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }
  return found.length > 0 ? found : ['general'];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUniqueVerb(verbs, usedVerbs) {
  const available = verbs.filter((v) => !usedVerbs.has(v));
  const chosen = available.length > 0 ? pickRandom(available) : pickRandom(verbs);
  usedVerbs.add(chosen);
  return chosen;
}

function composeExperienceBullet(relevantTech, title, company, usedVerbs, variant) {
  const verb = pickUniqueVerb(EXPERIENCE_ACTION_VERBS, usedVerbs);
  const outcome = pickRandom(OUTCOME_PHRASES);

  if (relevantTech.includes('general') || relevantTech.length === 0) {
    const templates = [
      `${verb} and maintained key features for ${company || 'the organization'}, ${outcome}.`,
      `${verb} production-quality deliverables as part of the ${title || 'role'}, ensuring timely completion and adherence to specifications.`,
      `${verb} collaborative solutions with cross-functional teams, ${outcome}.`,
      `${verb} technical documentation and participated in code reviews to maintain project quality standards.`,
    ];
    return templates[variant % templates.length];
  }

  const techKey = relevantTech[variant % relevantTech.length];
  const techPhrases = TECH_CONTEXT[techKey] || ['production-ready features'];
  const techPhrase = pickRandom(techPhrases);

  const templates = [
    `${verb} ${techPhrase} for ${company || 'the team'}, ${outcome}.`,
    `${verb} and delivered ${techPhrase}, contributing to the ${title || 'project'} deliverables.`,
    `${verb} ${techPhrase}, ${outcome}.`,
    `${verb} scalable ${techPhrase} as part of ${title || 'the development team'}, focusing on code quality and best practices.`,
  ];

  return templates[variant % templates.length];
}

function composeProjectBullet(relevantTech, name, techStack, usedVerbs, variant) {
  const verb = pickUniqueVerb(PROJECT_ACTION_VERBS, usedVerbs);
  const outcome = pickRandom(OUTCOME_PHRASES);

  if (relevantTech.includes('general') || relevantTech.length === 0) {
    const projectName = name || 'the project';
    const templates = [
      `${verb} ${projectName}, a comprehensive application addressing real-world requirements with clean, modular architecture.`,
      `${verb} core features and functionality, ${outcome}.`,
      `${verb} end-to-end system design from concept to deployment, ensuring scalability and maintainability.`,
      `${verb} automated testing and documentation for ${projectName}, ${outcome}.`,
    ];
    return templates[variant % templates.length];
  }

  const techKey = relevantTech[variant % relevantTech.length];
  const techPhrases = TECH_CONTEXT[techKey] || ['production-ready modules'];
  const techPhrase = pickRandom(techPhrases);

  const projectName = name || 'the application';
  const templates = [
    `${verb} ${projectName} featuring ${techPhrase}, ${outcome}.`,
    `${verb} ${techPhrase} as part of ${projectName}, delivering a full-featured solution.`,
    `${verb} ${techPhrase} within ${projectName}, ${outcome}.`,
    `${verb} and integrated ${techPhrase} to power ${projectName}'s core functionality, ${outcome}.`,
  ];

  return templates[variant % templates.length];
}
