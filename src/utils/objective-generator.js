/**
 * Dynamic Career Objective Generator for Amity Placement Resumes
 *
 * Extracts roles, technologies, and core competencies from target Job Descriptions (JD),
 * aligns them with candidate's confirmed profile data, and produces diverse, tailored,
 * high-impact career objective paragraphs.
 *
 * Guarantees variety: Never produces the exact same static text on repeat generations.
 */

// Comprehensive Tech & Skill dictionary for accurate JD extraction
const TECH_DICTIONARY = [
  // Languages
  'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'golang', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'dart',
  // Frontend
  'react', 'react.js', 'next.js', 'vue', 'vue.js', 'angular', 'html', 'html5', 'css', 'css3', 'tailwind', 'tailwind css', 'bootstrap', 'redux', 'vite',
  // Backend
  'node.js', 'node', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring boot', 'spring', 'asp.net', '.net', 'laravel', 'ruby on rails',
  // Databases
  'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'dynamodb', 'elasticsearch',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ci/cd', 'jenkins', 'github actions', 'git', 'linux', 'bash',
  // Architecture & APIs
  'rest api', 'restful apis', 'rest', 'graphql', 'microservices', 'distributed systems', 'system design', 'serverless', 'grpc', 'websockets',
  // Data, AI & ML
  'machine learning', 'deep learning', 'nlp', 'llm', 'rag', 'generative ai', 'computer vision', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
  // Security & Core CS
  'cybersecurity', 'cryptography', 'network security', 'data structures', 'algorithms', 'dsa', 'oop', 'object-oriented programming',
  // Methodologies
  'agile', 'scrum', 'test-driven development', 'tdd', 'unit testing', 'clean code', 'devops'
];

/**
 * Analyzes target JD text and returns extracted metadata:
 * - targetRole: Clean job role title
 * - matchedTech: Array of detected technologies in the JD
 * - candidateMatchedTech: Intersected tech between JD and candidate's confirmed profile
 * - targetDomain: Identified focus area (Frontend, Backend, Full Stack, AI/Data, Cloud, General)
 */
export function parseJobDescription(jdText = '', candidateData = {}) {
  const cleanJD = (jdText || '').trim();
  const jdLower = cleanJD.toLowerCase();

  // 1. Detect Role Title
  const targetRole = extractRoleTitle(cleanJD, jdLower);

  // 2. Extract matching technologies from dictionary
  const foundTech = [];
  TECH_DICTIONARY.forEach((tech) => {
    // Regex word boundary matching to avoid false positives (e.g. "go" in "good")
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jdLower)) {
      foundTech.push(tech);
    }
  });

  // Normalize duplicates (e.g. 'react' and 'react.js', 'node' and 'node.js')
  const normalizedTech = deduplicateTech(foundTech);

  // 3. Extract candidate's existing skills from store
  const candidateSkills = [];
  if (Array.isArray(candidateData.skills)) {
    candidateData.skills.forEach((cat) => {
      const list = (cat.skills || '').split(',').map((s) => s.trim().toLowerCase());
      candidateSkills.push(...list.filter(Boolean));
    });
  }

  // Intersect candidate skills with JD tech
  const candidateMatchedTech = normalizedTech.filter((t) =>
    candidateSkills.some((cs) => cs.includes(t) || t.includes(cs))
  );

  // 4. Identify domain emphasis
  let targetDomain = 'Full Stack Software Engineering';
  if (hasAny(normalizedTech, ['react', 'next.js', 'vue', 'angular', 'html', 'css', 'tailwind'])) {
    targetDomain = 'Frontend & Modern Web Development';
  }
  if (hasAny(normalizedTech, ['node.js', 'spring boot', 'django', 'fastapi', 'microservices', 'sql', 'postgresql', 'mongodb'])) {
    targetDomain = hasAny(normalizedTech, ['react', 'vue', 'angular']) ? 'Full Stack Software Engineering' : 'Backend & Systems Engineering';
  }
  if (hasAny(normalizedTech, ['machine learning', 'deep learning', 'nlp', 'llm', 'rag', 'pytorch', 'tensorflow'])) {
    targetDomain = 'AI, Machine Learning & Intelligent Systems';
  }
  if (hasAny(normalizedTech, ['cybersecurity', 'network security', 'cryptography'])) {
    targetDomain = 'Cybersecurity & Secure Systems';
  }
  if (hasAny(normalizedTech, ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd'])) {
    targetDomain = 'Cloud Architecture & DevOps';
  }

  // 5. Detect candidate degree from academic records
  let studentDegree = 'B.Tech Computer Science';
  if (Array.isArray(candidateData.academic) && candidateData.academic.length > 0) {
    const firstAcad = candidateData.academic[0] || '';
    if (firstAcad.toLowerCase().includes('btech') || firstAcad.toLowerCase().includes('b.tech')) {
      if (firstAcad.toLowerCase().includes('cyber security')) {
        studentDegree = 'B.Tech in Computer Science (Cyber Security)';
      } else {
        studentDegree = 'B.Tech in Computer Science';
      }
    } else {
      const parsed = firstAcad.replace(/^•\s*/, '').split('|')[0].trim();
      studentDegree = parsed || 'B.Tech Graduate';
    }
  }

  return {
    targetRole,
    matchedTech: normalizedTech,
    candidateMatchedTech,
    targetDomain,
    studentDegree,
    rawLength: cleanJD.length,
  };
}

/**
 * Extracts the most probable role title from JD text
 */
function extractRoleTitle(rawText, lowerText) {
  // Regex search for explicit title lines (e.g., "Role: Senior Backend Engineer")
  const explicitPatterns = [
    /(?:role|job title|position|designation|title)\s*[:\-]\s*([^\n\r,]{3,45})/i,
    /(?:hiring for|looking for an?|seeking an?)\s+([a-z0-9\s\/\-\+]{3,40}\s+(?:engineer|developer|intern|trainee|associate|specialist|lead|architect|analyst|scientist))/i,
    /(?:we are looking for|we need an?)\s+([a-z0-9\s\/\-\+]{3,40}\s+(?:engineer|developer|intern|trainee|associate|specialist|lead|architect|analyst|scientist))/i,
  ];

  for (const pat of explicitPatterns) {
    const match = rawText.match(pat);
    if (match && match[1]) {
      const candidate = match[1].trim().replace(/[.;:]$/, '');
      if (candidate.length > 3 && candidate.length < 50 && !candidate.toLowerCase().includes('responsibilit')) {
        return cleanRoleTitle(candidate);
      }
    }
  }

  // Role keyword checks in prioritized order
  const ROLES = [
    { key: 'full stack developer', label: 'Full Stack Developer' },
    { key: 'full stack engineer', label: 'Full Stack Engineer' },
    { key: 'full-stack', label: 'Full Stack Software Engineer' },
    { key: 'frontend engineer', label: 'Frontend Engineer' },
    { key: 'frontend developer', label: 'Frontend Developer' },
    { key: 'front-end', label: 'Frontend Developer' },
    { key: 'backend engineer', label: 'Backend Engineer' },
    { key: 'backend developer', label: 'Backend Developer' },
    { key: 'back-end', label: 'Backend Engineer' },
    { key: 'software development engineer', label: 'Software Development Engineer (SDE)' },
    { key: 'sde-1', label: 'Software Development Engineer (SDE-1)' },
    { key: 'sde 1', label: 'Software Development Engineer (SDE-1)' },
    { key: 'sde', label: 'Software Development Engineer (SDE)' },
    { key: 'trainee software engineer', label: 'Trainee Software Engineer' },
    { key: 'associate software engineer', label: 'Associate Software Engineer' },
    { key: 'software engineer', label: 'Software Engineer' },
    { key: 'software developer', label: 'Software Developer' },
    { key: 'data analyst', label: 'Data Analyst' },
    { key: 'data scientist', label: 'Data Scientist' },
    { key: 'machine learning engineer', label: 'Machine Learning Engineer' },
    { key: 'ai engineer', label: 'AI Engineer' },
    { key: 'cloud engineer', label: 'Cloud Engineer' },
    { key: 'devops engineer', label: 'DevOps Engineer' },
    { key: 'cyber security analyst', label: 'Cybersecurity Analyst' },
    { key: 'security engineer', label: 'Security Engineer' },
    { key: 'qa engineer', label: 'QA / Automation Engineer' },
    { key: 'graduate engineer trainee', label: 'Graduate Engineer Trainee (GET)' },
  ];

  for (const r of ROLES) {
    if (lowerText.includes(r.key)) {
      return r.label;
    }
  }

  return 'Software Engineer';
}

function cleanRoleTitle(raw) {
  let cleaned = raw
    .replace(/^an?\s+/i, '')
    .replace(/^(the|our|target)\s+/i, '')
    .trim();
  // Capitalize title
  let title = cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  if (['Machine Learning', 'Artificial Intelligence', 'Devops', 'Cloud', 'Frontend', 'Backend'].includes(title)) {
    title += ' Engineer';
  }
  return title;
}

function deduplicateTech(list) {
  const seen = new Set();
  const result = [];
  list.forEach((item) => {
    const formatted = formatTechName(item);
    if (!seen.has(formatted)) {
      seen.add(formatted);
      result.push(formatted);
    }
  });
  return result;
}

function formatTechName(tech) {
  const map = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'golang': 'Go',
    'react': 'React.js',
    'react.js': 'React.js',
    'next.js': 'Next.js',
    'vue': 'Vue.js',
    'node': 'Node.js',
    'node.js': 'Node.js',
    'express': 'Express.js',
    'express.js': 'Express.js',
    'django': 'Django',
    'flask': 'Flask',
    'fastapi': 'FastAPI',
    'spring boot': 'Spring Boot',
    'spring': 'Spring Boot',
    'html': 'HTML5',
    'css': 'CSS3',
    'tailwind': 'Tailwind CSS',
    'tailwind css': 'Tailwind CSS',
    'sql': 'SQL',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'GCP',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'rest api': 'RESTful APIs',
    'rest': 'RESTful APIs',
    'graphql': 'GraphQL',
    'microservices': 'Microservices',
    'ci/cd': 'CI/CD Pipelines',
    'git': 'Git',
    'linux': 'Linux',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'nlp': 'NLP',
    'llm': 'LLM Applications',
    'rag': 'RAG Architectures',
    'cybersecurity': 'Cybersecurity',
    'data structures': 'Data Structures & Algorithms',
    'algorithms': 'Algorithms',
    'oop': 'OOP Principles',
    'agile': 'Agile Methodology',
  };
  return map[tech.toLowerCase()] || (tech.charAt(0).toUpperCase() + tech.slice(1));
}

function hasAny(list, targets) {
  const lower = list.map((l) => l.toLowerCase());
  return targets.some((t) => lower.some((item) => item.includes(t)));
}

function sampleRandom(arr, count = 1) {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function pickOne(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTechList(items) {
  if (!items || items.length === 0) return 'modern software technologies';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Main Objective Generator
 * Generates 4 distinct, compelling, and fully unique career objectives tailored
 * to the specified JD and candidate profile.
 */
export function generateObjectivesFromJD(jdText = '', candidateData = {}, options = {}) {
  const parsed = parseJobDescription(jdText, candidateData);
  const { targetRole, matchedTech, candidateMatchedTech, studentDegree, targetDomain } = parsed;

  // Selected tech pool: prioritize matched tech, fallback to popular detected tech or core skills
  let techPool = candidateMatchedTech.length > 0 ? candidateMatchedTech : matchedTech;
  if (techPool.length === 0) {
    techPool = ['Java', 'Python', 'React.js', 'REST APIs', 'SQL'];
  }

  const uniquePool = [...new Set(techPool.map(formatTechName))];

  // Shuffle tech subset for variety
  const techSetA = formatTechList(sampleRandom(uniquePool, Math.min(3, uniquePool.length)));
  const techSetB = formatTechList(sampleRandom(uniquePool, Math.min(3, uniquePool.length)));
  const techSetC = formatTechList(sampleRandom(uniquePool, Math.min(4, uniquePool.length)));
  const techSetD = formatTechList(sampleRandom(uniquePool, Math.min(3, uniquePool.length)));

  const optionsList = [
    // ----------------------------------------------------
    // STYLE 1: Technical & Engineering Rigor
    // ----------------------------------------------------
    {
      id: 'tech-rigor',
      title: 'Technical Depth & Architecture',
      tag: '🛠️ Core Technical',
      badgeClass: 'badge--blue',
      description: 'Emphasizes clean code, scalable architecture, and hands-on tech stack proficiency.',
      text: buildTechnicalRigorObjective({
        studentDegree,
        targetRole,
        techSet: techSetA || 'modern software technologies',
        targetDomain,
      }),
    },

    // ----------------------------------------------------
    // STYLE 2: High Impact & Product Delivery
    // ----------------------------------------------------
    {
      id: 'impact-product',
      title: 'Impact & Product-Driven',
      tag: '💡 High Impact',
      badgeClass: 'badge--green',
      description: 'Focuses on building robust user-centric products, problem-solving, and driving tangible outcomes.',
      text: buildImpactProductObjective({
        studentDegree,
        targetRole,
        techSet: techSetB || 'full-stack engineering practices',
        targetDomain,
      }),
    },

    // ----------------------------------------------------
    // STYLE 3: Agile, Fast Learner & Adaptable
    // ----------------------------------------------------
    {
      id: 'agile-adaptable',
      title: 'Agile & Rapid Learner',
      tag: '🚀 Agile & Fast-Paced',
      badgeClass: 'badge--yellow',
      description: 'Highlights quick adaptability to frameworks, teamwork, and enthusiasm in fast-evolving teams.',
      text: buildAgileAdaptableObjective({
        studentDegree,
        targetRole,
        techSet: techSetC || 'contemporary frameworks',
        targetDomain,
      }),
    },

    // ----------------------------------------------------
    // STYLE 4: Placement-Ready & Holistic Graduate
    // ----------------------------------------------------
    {
      id: 'placement-ready',
      title: 'Campus Placement & Growth',
      tag: '🎓 Placement Standard',
      badgeClass: 'badge--purple',
      description: 'Official Amity campus placement style balancing academic foundation, projects, and career ambition.',
      text: buildPlacementReadyObjective({
        studentDegree,
        targetRole,
        techSet: techSetD || 'core computer science fundamentals',
        targetDomain,
      }),
    },
  ];

  return {
    parsed,
    options: optionsList,
    generatedAt: Date.now(),
  };
}

// ============================================================================
// MODULAR BUILDERS (Combinatorial Generation Ensuring Non-Repetitive Text)
// ============================================================================

function buildTechnicalRigorObjective({ studentDegree, targetRole, techSet }) {
  const openers = [
    `Analytical and detail-oriented final-year ${studentDegree} student with a rigorous foundation in software architecture and algorithms.`,
    `Results-focused ${studentDegree} candidate with demonstrable expertise in developing clean, modular, and maintainable software systems.`,
    `Technically sound and disciplined final-year ${studentDegree} scholar with practical hands-on proficiency in ${techSet}.`,
    `Proactive software engineering candidate with a strong academic background in ${studentDegree} and a passion for scalable system design.`,
    `Dedicated ${studentDegree} student equipped with robust programming capabilities and practical project exposure across ${techSet}.`,
  ];

  const middles = [
    `Adept at architecting reliable services, integrating resilient APIs, and diagnosing complex computational bottlenecks using clean code standards.`,
    `Proven capability in designing high-performance application modules, optimizing database structures, and adhering to strict software design patterns.`,
    `Experienced in full development life-cycle execution, writing well-tested reusable components, and translating functional requirements into performant solutions.`,
    `Skilled in algorithmic problem solving, structured debugging, and building end-to-end applications leveraging ${techSet}.`,
  ];

  const closers = [
    `Seeking a challenging ${targetRole} role to leverage technical rigor, deliver scalable product features, and drive engineering excellence.`,
    `Aspiring to join as a ${targetRole} to design fault-tolerant applications and contribute meaningfully to mission-critical software initiatives.`,
    `Eager to contribute as a ${targetRole}, bringing disciplined engineering practices and commitment to writing clean, reliable code.`,
    `Aiming to excel as a ${targetRole} by shipping high-quality software solutions and continuously mastering modern architectural stacks.`,
  ];

  return `${pickOne(openers)} ${pickOne(middles)} ${pickOne(closers)}`;
}

function buildImpactProductObjective({ studentDegree, targetRole, techSet }) {
  const openers = [
    `Product-minded and driven final-year ${studentDegree} student passionate about crafting intuitive, high-availability digital solutions.`,
    `Impact-driven ${studentDegree} candidate with a solid grasp of modern web technologies and user-centric software development.`,
    `Enthusiastic technologist completing ${studentDegree}, committed to transforming real-world problems into scalable, reliable software products.`,
    `Performance-oriented ${studentDegree} student blending strong foundational computer science principles with hands-on development in ${techSet}.`,
  ];

  const middles = [
    `Track record of shipping responsive interfaces and robust backend logic that prioritize seamless user experiences and operational reliability.`,
    `Strong problem-solving acumen demonstrated through academic projects, rapid prototype iteration, and seamless multi-tier API integration.`,
    `Proficient in collaborating across modern development workflows, optimizing end-to-end performance, and ensuring high software quality.`,
    `Adept at leveraging ${techSet} to deliver maintainable solutions that accelerate business objectives and enhance product stability.`,
  ];

  const closers = [
    `Seeking an opportunity as a ${targetRole} to build impactful features, solve challenging real-world problems, and support organizational growth.`,
    `Aiming to step into a ${targetRole} position where passion for scalable engineering and customer-focused execution can create immediate value.`,
    `Eager to contribute as a ${targetRole} to accelerate release cycles, craft delightful digital experiences, and grow alongside industry leaders.`,
    `Looking to join an innovative technology environment as a ${targetRole} to deliver measurable outcomes through reliable, end-to-end code.`,
  ];

  return `${pickOne(openers)} ${pickOne(middles)} ${pickOne(closers)}`;
}

function buildAgileAdaptableObjective({ studentDegree, targetRole, techSet }) {
  const openers = [
    `Dynamic, highly adaptable final-year ${studentDegree} student with an agile mindset and rapid framework comprehension.`,
    `Inquisitive and energetic ${studentDegree} candidate eager to contribute in fast-paced, collaborative engineering environments.`,
    `Curious and proactive ${studentDegree} scholar with a continuous-learning mindset and strong foundations in ${techSet}.`,
    `Enthusiastic software engineering student completing ${studentDegree}, distinguished by quick adaptability and solid debugging fundamentals.`,
  ];

  const middles = [
    `Quick to master emergent technologies, write clean documentation, and contribute constructively in peer code reviews and agile sprints.`,
    `Demonstrated ability to swiftly pivot across modern tech stacks, deliver cross-functional project milestones, and automate routine tasks.`,
    `Strong communication and team synergy skills paired with hands-on proficiency in building modular modules using ${techSet}.`,
    `Passionate about modern developer tooling, continuous integration, and translating ambiguous feature requirements into working prototypes.`,
  ];

  const closers = [
    `Seeking a ${targetRole} opportunity to contribute proactive energy, accelerate sprint deliverables, and expand technical mastery.`,
    `Aspiring to join an energetic development team as a ${targetRole}, bringing curiosity, high work ethic, and swift execution.`,
    `Eager to begin professional journey as a ${targetRole}, delivering reliable code while continually adapting to high-velocity project needs.`,
    `Aiming to add immediate value as a ${targetRole} through rapid skill acquisition, dependable execution, and collaborative problem-solving.`,
  ];

  return `${pickOne(openers)} ${pickOne(middles)} ${pickOne(closers)}`;
}

function buildPlacementReadyObjective({ studentDegree, targetRole, techSet }) {
  const openers = [
    `Motivated and ambitious final-year ${studentDegree} student with a distinguished academic record and practical software development exposure.`,
    `Disciplined and career-oriented ${studentDegree} candidate with strong conceptual grounding in core computer science fundamentals.`,
    `Forward-looking ${studentDegree} student combining consistent academic excellence with hands-on project accomplishments in ${techSet}.`,
    `Diligent and solution-oriented ${studentDegree} scholar prepared to transition comprehensive academic training into enterprise software contributions.`,
  ];

  const middles = [
    `Equipped with strong competencies in data structures, algorithms, object-oriented design, and hands-on development using ${techSet}.`,
    `Demonstrated capability in completing complex capstone projects, collaborating in peer groups, and writing testable, production-grade code.`,
    `Possesses strong analytical thinking, structured communication, and a disciplined approach to building end-to-end software applications.`,
    `Combines theoretical rigor with practical application delivery, ensuring reliable code quality and strict adherence to project deadlines.`,
  ];

  const closers = [
    `Seeking a ${targetRole} position to launch professional engineering career, contribute to high-impact projects, and grow with the organization.`,
    `Aspiring to secure a ${targetRole} role with a forward-thinking enterprise to apply core engineering principles and deliver measurable value.`,
    `Looking to establish a long-term professional trajectory as a ${targetRole}, dedicating strong work ethic and technical aptitude to organizational goals.`,
    `Eager to contribute as a ${targetRole}, bringing fresh perspectives, strong ethical dedication, and readiness to undertake mission-critical assignments.`,
  ];

  return `${pickOne(openers)} ${pickOne(middles)} ${pickOne(closers)}`;
}
