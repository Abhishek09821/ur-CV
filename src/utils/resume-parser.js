/**
 * Resume Parser Utility
 *
 * High-accuracy, coordinate-preserving resume parser for PDF & text formats.
 * Designed to accurately extract candidate details without losing multi-line bullets,
 * mangling project structures, or leaking default placeholder data.
 *
 * Accuracy targets:
 * - 95-100% extraction precision on official Amity and Jake's Resume formats
 * - Bullet-point continuation unwrapping (prevents splitting sentences across bullets)
 * - Intelligent header parsing (excludes image alt tags like [Logo], [Photo], university titles)
 * - Multi-project boundary detection (cleanly associates tech stacks and bullet points)
 * - Declaration extraction (Date, Place, statement)
 * - Direct hyperlink annotation extraction from PDF objects
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker safely (browser only)
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker initialization:', e);
  }
}

// ============================================================
// SECTION HEADING REGEX PATTERNS
// ============================================================

const SECTION_PATTERNS = {
  objective: /^(career\s*objective|objective|professional\s*summary|summary|profile|about\s*me|profile\s*summary|executive\s*summary)$/i,
  academic: /^(education|academic(\s*(details|qualifications|background|history|records))?|qualifications|educational\s*background)$/i,
  experience: /^(work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment(\s*history)?|work\s*history)$/i,
  projects: /^((technical|academic|personal|key|software|selected)?\s*projects|project\s*work)$/i,
  skills: /^(technical\s*skills|core\s*skills|key\s*skills|skills(\s*(&|and)\s*(technologies|tools|competencies))?|competencies|technologies|tools\s*(&|and)\s*technologies)$/i,
  awards: /^(certifications?|certificates?|honors?|awards?(\s*(&|and)\s*(honors?|achievements?|certifications?))?|achievements?|awards\s*and\s*achievements|certifications\s*(&|and)\s*awards)$/i,
  leadership: /^(leadership(\s*(&|and)\s*(initiative|activities))?|extra[\s-]*curricular(\s*activities)?|co-curricular(\s*activities)?|positions?\s*of\s*responsibility|volunteer(\s*experience|\s*work)?)$/i,
  links: /^(links|profiles|social\s*links|online\s*profiles|portfolio|web\s*links)$/i,
  declaration: /^(declaration|self\s*declaration)$/i,
};

// Bullet character regex
const BULLET_START_REGEX = /^[•\-\*\u2022\u25cf\u25e6\u25aa\u25b8\u2023\u2219]/;

// ============================================================
// PDF TEXT EXTRACTION WITH COORDINATE PRESERVATION & ANNOTATIONS
// ============================================================

/**
 * Extract structured text lines and hyperlink annotations from a PDF.
 * Uses Y-coordinates to reconstruct visual reading lines without flattening.
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;

  const allLines = [];
  const allAnnotations = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Extract link annotations
    try {
      const annots = await page.getAnnotations();
      if (annots && annots.length > 0) {
        annots.forEach((a) => {
          if (a && a.url) allAnnotations.push(a.url);
        });
      }
    } catch {}

    const textContent = await page.getTextContent();
    const items = textContent.items;
    if (!items || items.length === 0) continue;

    const textItems = items.filter((it) => it.str && it.str.trim().length > 0);
    const linesMap = [];

    for (const item of textItems) {
      const text = item.str;
      const x = item.transform ? item.transform[4] : 0;
      const y = item.transform ? item.transform[5] : 0;

      let targetLine = linesMap.find((l) => Math.abs(l.y - y) <= 4.5);
      if (!targetLine) {
        targetLine = { y, items: [] };
        linesMap.push(targetLine);
      }
      targetLine.items.push({ x, text });
    }

    // Sort lines top to bottom (descending Y)
    linesMap.sort((a, b) => b.y - a.y);

    // Sort items within each line left to right (ascending X)
    for (const lineObj of linesMap) {
      lineObj.items.sort((a, b) => a.x - b.x);
      const lineText = lineObj.items
        .map((it) => it.text.trim())
        .filter(Boolean)
        .join(' ');
      if (lineText.trim()) {
        allLines.push(lineText.trim());
      }
    }

    allLines.push(''); // Page separator
  }

  return {
    rawText: allLines.join('\n'),
    annotations: allAnnotations,
  };
}

/**
 * Extract text from plain text or markdown file
 */
export async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ rawText: e.target.result || '', annotations: [] });
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ============================================================
// MAIN RESUME PARSER
// ============================================================

export function parseResumeText(rawText, targetTemplate = 'amity', annotations = []) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty resume content.');
  }

  const rawLines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Identify sections
  const sections = identifySections(rawLines);

  // 2. Personal Info & Contact
  const personal = extractPersonalInfo(sections.header || [], rawText);

  // 3. Career Objective / Summary
  const objective = extractObjective(sections.objective || []);

  // 4. Academic Details / Education
  const academic = extractAcademic(sections.academic || [], targetTemplate);

  // 5. Experience / Internships
  const experience = extractExperience(sections.experience || []);

  // 6. Projects
  const projects = extractProjects(sections.projects || []);

  // 7. Technical Skills
  const skills = extractSkills(sections.skills || []);

  // 8. Awards & Certifications
  const awards = extractAwards(sections.awards || []);

  // 9. Leadership & Extra-Curricular
  const leadership = extractLeadership(sections.leadership || []);

  // 10. Links (LinkedIn, GitHub, Portfolio)
  const links = extractLinks(rawText, sections.links || [], annotations);

  // 11. Self Declaration (for Amity format)
  const defaultPlace = personal.address ? personal.address.split(',')[0].trim() : '';
  const declaration = extractDeclaration(sections.declaration || [], defaultPlace);

  // Construct structured result
  const result = {
    template: targetTemplate,
    personal: {
      fullName: personal.fullName || '',
      address: personal.address || '',
      phone: personal.phone || '',
      email: personal.email || '',
      photo: null, // Always empty so uploaded resumes never show Abhishek's photo
    },
    objective: objective || '',
    academic: academic || [],
    experience: experience || [],
    projects: projects || [],
    skills: skills || [],
    awards: awards || [],
    links: links || [],
  };

  if (targetTemplate === 'amity') {
    result.leadership = leadership || [];
    result.declaration = declaration;
  } else {
    // Jake's format
    result.achievements = [];
  }

  return result;
}

// ============================================================
// SECTION IDENTIFICATION
// ============================================================

function identifySections(lines) {
  const sections = { header: [] };
  let currentSection = 'header';

  for (const line of lines) {
    const cleanHeading = line
      .replace(/^[•\-\|:#*\s]+/, '')
      .replace(/[:#*\s]+$/, '')
      .trim();

    let matched = false;
    if (cleanHeading.length >= 3 && cleanHeading.length <= 55) {
      for (const [sectionKey, pattern] of Object.entries(SECTION_PATTERNS)) {
        if (pattern.test(cleanHeading)) {
          currentSection = sectionKey;
          if (!sections[currentSection]) sections[currentSection] = [];
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  return sections;
}

// ============================================================
// PERSONAL INFO EXTRACTION
// ============================================================

function extractPersonalInfo(headerLines, fullText) {
  let fullName = '';
  let address = '';
  let phone = '';
  let email = '';

  // 1. Scan for explicitly labeled fields in header
  for (const rawLine of headerLines) {
    const clean = rawLine.trim();
    const addrMatch = clean.match(/^(?:Address|Location|Residential Address|Permanent Address)\s*[:|-]\s*(.+)$/i);
    const phoneMatch = clean.match(/^(?:Phone|Mobile|Tel|Contact|Cell)\s*[:|-]\s*(.+)$/i);
    const emailMatch = clean.match(/^(?:Email|Mail|E-mail)\s*[:|-]\s*(.+)$/i);
    const nameMatch = clean.match(/^(?:Name|Full Name|Candidate Name)\s*[:|-]\s*(.+)$/i);

    if (addrMatch && !address) address = addrMatch[1].trim();
    if (phoneMatch && !phone) phone = phoneMatch[1].trim();
    if (emailMatch && !email) email = emailMatch[1].trim();
    if (nameMatch && !fullName) fullName = nameMatch[1].trim();
  }

  // 2. Email extraction
  if (!email) {
    const scanArea = headerLines.join(' ') + ' ' + fullText.substring(0, 1000);
    const emMatch = scanArea.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emMatch) email = emMatch[1].trim();
  }

  // 3. Phone extraction
  if (!phone) {
    const scanArea = headerLines.join(' ') + ' ' + fullText.substring(0, 1000);
    // Explicit phone label in text
    const labelMatch = scanArea.match(/(?:phone|mobile|tel|contact)\s*[:|-]?\s*([+\d\s().-]{10,20})/i);
    if (labelMatch) {
      phone = labelMatch[1].trim();
    } else {
      const allPhoneMatches = scanArea.match(/(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}(?:[\s.-]?\d{2,4})?/g) || [];
      for (const cand of allPhoneMatches) {
        const digits = cand.replace(/\D/g, '');
        if (digits.length >= 10 && digits.length <= 13) {
          phone = cand.trim();
          break;
        }
      }
    }
  }

  // 4. Address extraction
  if (!address) {
    for (const rawLine of headerLines) {
      // Check compound lines separated by | or •
      const parts = rawLine.split(/[|•]/).map((p) => p.trim());
      for (const part of parts) {
        if (part.includes('@') || part.match(/^(https?:\/\/|www\.|linkedin|github)/i)) continue;
        if (part.match(/^[+]?\d[\d\s-]{8,}\d$/)) continue; // Pure phone
        if (
          part.match(/\b\d{5,6}\b/) || // Pincode
          part.match(/(colony|nagar|vihar|road|rd|street|st|lane|sector|avenue|cross|city|district|state|delhi|mumbai|bangalore|bengaluru|pune|hyderabad|chennai|noida|gurugram|kolkata|jaipur|lucknow|gwalior|india)/i) ||
          part.match(/^[a-zA-Z\s]{3,},\s*[a-zA-Z\s]{3,}$/)
        ) {
          address = part.replace(/^(address|location|city)\s*[:|-]\s*/i, '').trim();
          break;
        }
      }
      if (address) break;
    }
  }

  // 5. Full Name extraction
  if (!fullName) {
    for (const rawLine of headerLines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Strictly ignore brackets and placeholders like [Logo], [Photo], etc.
      if (line.includes('[') || line.includes(']') || line.includes('{') || line.includes('}')) continue;
      if (/logo|photo|photograph|image|amity|university|college|school|curriculum|vitae|resume|biodata|page/i.test(line)) continue;
      if (line.includes('@') || line.match(/^(https?:\/\/|www\.|linkedin|github)/i)) continue;
      if (line.match(/^(address|phone|email|contact|mobile|tel|date|place|objective|education)/i)) continue;

      const candidate = line.split(/[|•–—]/)[0].trim().replace(/^(name|full\s*name|candidate\s*name)\s*[:|-]\s*/i, '').trim();
      const words = candidate.split(/\s+/).filter(Boolean);

      // A real candidate name: 1 to 4 words, alphabetic, 2 to 40 chars, no numbers
      if (words.length >= 1 && words.length <= 4 && candidate.length >= 2 && candidate.length <= 40 && !/\d/.test(candidate)) {
        // If candidate is ALL CAPS, convert to clean Title Case
        if (candidate === candidate.toUpperCase() && candidate.length > 3) {
          fullName = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        } else {
          fullName = candidate;
        }
        break;
      }
    }
  }

  return { fullName, address, phone, email };
}

// ============================================================
// OBJECTIVE EXTRACTION
// ============================================================

function extractObjective(lines) {
  if (!lines || lines.length === 0) return '';
  return lines
    .map((l) => l.replace(BULLET_START_REGEX, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

// ============================================================
// ACADEMIC EXTRACTION
// ============================================================

function extractAcademic(lines, targetTemplate) {
  if (!lines || lines.length === 0) return [];

  // Unwrap multi-line wrapped entries
  const items = [];
  for (const rawLine of lines) {
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    const textWithoutBullet = clean.replace(BULLET_START_REGEX, '').trim();

    if (isBullet || items.length === 0) {
      items.push(textWithoutBullet);
    } else {
      // Continuation line
      items[items.length - 1] += ' ' + clean;
    }
  }

  if (targetTemplate === 'jakes') {
    return items.map((entry) => {
      const parts = entry.split(/\s*\|\s*/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const instIdx = parts.findIndex((p) =>
          p.match(/(university|college|institute|school|academy|board|cbse|icse|dps|dtu|iit|nit|iiit|bits)/i)
        );
        if (instIdx >= 0) {
          const institution = parts[instIdx];
          const rest = parts.filter((_, i) => i !== instIdx).join(' | ');
          return { institution, details: rest };
        }
        return { institution: parts[0], details: parts.slice(1).join(' | ') };
      }
      return { institution: entry, details: '' };
    });
  }

  return items;
}

// ============================================================
// EXPERIENCE EXTRACTION
// ============================================================

function extractExperience(lines) {
  if (!lines || lines.length === 0) return [];

  const experiences = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    const isDate = matchDatePattern(clean);
    const isTitle = isExperienceTitleLine(clean);

    if (isTitle && !isBullet) {
      if (current) experiences.push(current);
      const { title, company } = splitRoleAndCompany(clean);
      current = { title, company, duration: '', bullets: [] };
    } else if (current && isDate && !current.duration) {
      current.duration = clean;
    } else if (current && !current.company && !isBullet && clean.length < 80 && !isDate) {
      current.company = clean;
    } else if (current && isBullet) {
      current.bullets.push(clean.replace(BULLET_START_REGEX, '').trim());
    } else if (current && current.bullets.length > 0) {
      // Continuation of previous bullet!
      current.bullets[current.bullets.length - 1] += ' ' + clean;
    }
  }

  if (current) experiences.push(current);

  return experiences.map((e) => ({
    ...e,
    bullets: e.bullets.length > 0 ? e.bullets : [''],
  }));
}

function splitRoleAndCompany(str) {
  const sepMatch = str.match(/^(.+?)\s*[|]\s*(.+)$/);
  if (sepMatch) return { title: sepMatch[1].trim(), company: sepMatch[2].trim() };
  const atMatch = str.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) return { title: atMatch[1].trim(), company: atMatch[2].trim() };
  return { title: str, company: '' };
}

function isExperienceTitleLine(line) {
  if (line.length > 110) return false;
  return Boolean(
    line.match(/(intern|engineer|developer|analyst|associate|trainee|manager|lead|architect|consultant|coordinator|founder|co-founder|specialist|assistant)/i) ||
    line.match(/(internship|software\s*dev|frontend|backend|full[\s-]*stack|machine\s*learning|data\s*science)/i)
  );
}

function matchDatePattern(line) {
  return Boolean(
    (line.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i) && line.match(/\d{4}/)) ||
    line.match(/\d{1,2}\s*\/\s*\d{4}/) ||
    line.match(/\b(present|current|ongoing)\b/i) ||
    line.match(/\d{4}\s*[-–—]\s*(\d{4}|present)/i)
  );
}

// ============================================================
// PROJECTS EXTRACTION
// ============================================================

function extractProjects(lines) {
  if (!lines || lines.length === 0) return [];

  const projects = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    const techStackMatch = clean.match(/^(tech\s*stack|technologies(\s*used)?|built\s*with|tools(\s*used)?)\s*[:|-]\s*(.+)$/i);
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
    const nextIsTechStack = /^(tech\s*stack|technologies(\s*used)?|built\s*with|tools(\s*used)?)\s*[:|-]/i.test(nextLine);

    if (techStackMatch && current) {
      current.techStack = techStackMatch[4].trim();
      continue;
    }

    const pipeMatch = clean.match(/^(.+?)\s*[|]\s*(.+)$/);
    const parenMatch = clean.match(/^(.+?)\s*\((.+)\)$/);
    const isExplicitTitle =
      nextIsTechStack ||
      (!isBullet &&
        (!current || current.bullets.length > 0) &&
        !/^[a-z]/.test(clean) &&
        !clean.endsWith(',') &&
        !clean.endsWith('and') &&
        clean.length < 80);

    if (isExplicitTitle && !isBullet) {
      if (current) projects.push(current);
      if (pipeMatch) {
        current = { name: pipeMatch[1].trim(), techStack: pipeMatch[2].trim(), bullets: [] };
      } else if (parenMatch) {
        current = { name: parenMatch[1].trim(), techStack: parenMatch[2].trim(), bullets: [] };
      } else {
        current = { name: clean, techStack: '', bullets: [] };
      }
    } else if (isBullet && current) {
      current.bullets.push(clean.replace(BULLET_START_REGEX, '').trim());
    } else if (current && current.bullets.length > 0) {
      // Continuation of previous bullet!
      current.bullets[current.bullets.length - 1] += ' ' + clean;
    }
  }

  if (current) projects.push(current);

  return projects.map((p) => ({
    ...p,
    bullets: p.bullets.length > 0 ? p.bullets : [''],
  }));
}

// ============================================================
// SKILLS EXTRACTION
// ============================================================

function extractSkills(lines) {
  if (!lines || lines.length === 0) return [];

  const categories = [];

  for (const rawLine of lines) {
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    const textWithoutBullet = clean.replace(BULLET_START_REGEX, '').trim();

    const colonIdx = textWithoutBullet.indexOf(':');
    if (colonIdx > 2 && colonIdx < 50) {
      categories.push({
        category: textWithoutBullet.substring(0, colonIdx).trim(),
        skills: textWithoutBullet.substring(colonIdx + 1).trim(),
      });
    } else if (categories.length > 0 && !isBullet) {
      // Continuation of previous category!
      categories[categories.length - 1].skills += ' ' + clean;
    } else if (textWithoutBullet.length > 3) {
      categories.push({ category: 'Technical Skills', skills: textWithoutBullet });
    }
  }

  return categories;
}

// ============================================================
// AWARDS EXTRACTION
// ============================================================

function extractAwards(lines) {
  if (!lines || lines.length === 0) return [];

  const items = [];

  for (const rawLine of lines) {
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    const textWithoutBullet = clean
      .replace(/^(\d+[\.\)\-]\s*|\(\d+\)\s*|[•\-\*\u2022\u25cf\u25e6\u25aa\u25b8\u2023\u2219]\s*)/, '')
      .trim();

    if (isBullet || items.length === 0) {
      items.push(textWithoutBullet);
    } else {
      // Continuation line
      items[items.length - 1] += ' ' + clean;
    }
  }

  return items.filter((a) => a.length >= 3);
}

// ============================================================
// LEADERSHIP EXTRACTION
// ============================================================

function extractLeadership(lines) {
  if (!lines || lines.length === 0) return [];

  // Step 1: Unwrap lines
  const items = [];
  for (const rawLine of lines) {
    const clean = rawLine.trim();
    if (!clean) continue;

    const isBullet = BULLET_START_REGEX.test(clean);
    if (isBullet || items.length === 0) {
      items.push(clean.replace(BULLET_START_REGEX, '').trim());
    } else {
      items[items.length - 1] += ' ' + clean;
    }
  }

  // Step 2: Split title and description
  return items.map((item) => {
    // Only split on colon (:) or spaced separator ( - or | ) so we don't break hyphens like End-to-End
    const colonIdx = item.indexOf(':');
    if (colonIdx > 2 && colonIdx < 60) {
      return {
        title: item.substring(0, colonIdx).trim(),
        description: item.substring(colonIdx + 1).trim(),
      };
    }
    const dashIdx = item.indexOf(' - ');
    if (dashIdx > 2 && dashIdx < 60) {
      return {
        title: item.substring(0, dashIdx).trim(),
        description: item.substring(dashIdx + 3).trim(),
      };
    }
    return { title: '', description: item };
  });
}

// ============================================================
// DECLARATION EXTRACTION
// ============================================================

function extractDeclaration(lines, defaultPlace = '') {
  let text = 'I hereby declare that all the above information is true to the best of my knowledge and belief.';
  let date = '';
  let place = defaultPlace;

  if (lines && lines.length > 0) {
    for (const rawLine of lines) {
      const clean = rawLine.trim();
      if (!clean) continue;

      const dateMatch = clean.match(/^(?:date|dated)\s*[:|-]?\s*(.+)$/i);
      const placeMatch = clean.match(/^(?:place|location|city)\s*[:|-]?\s*(.+)$/i);
      const isDeclareStatement = /declare|information\s*is\s*true|knowledge\s*and\s*belief/i.test(clean);

      if (dateMatch) {
        date = dateMatch[1].trim();
      } else if (placeMatch) {
        place = placeMatch[1].trim();
      } else if (isDeclareStatement) {
        text = clean;
      }
    }
  }

  return { text, date, place };
}

// ============================================================
// LINKS EXTRACTION
// ============================================================

function extractLinks(fullText, linkLines, pdfAnnotations = []) {
  const links = [];
  const textToScan = (linkLines.length > 0 ? linkLines.join(' ') : '') + ' ' + fullText;

  // 1. Process from pdfAnnotations
  for (const annotUrl of pdfAnnotations) {
    if (!annotUrl || annotUrl.startsWith('mailto:')) continue;
    let label = 'Portfolio';
    if (/linkedin\.com/i.test(annotUrl)) label = 'LinkedIn';
    else if (/github\.com/i.test(annotUrl)) label = 'GitHub';
    else if (/leetcode\.com/i.test(annotUrl)) label = 'LeetCode';
    else if (/codeforces\.com/i.test(annotUrl)) label = 'Codeforces';
    else if (/codechef\.com/i.test(annotUrl)) label = 'CodeChef';

    if (!links.some((l) => l.url.toLowerCase() === annotUrl.toLowerCase())) {
      links.push({ label, url: annotUrl });
    }
  }

  // 2. Scan text for profile links
  const patterns = [
    { label: 'LinkedIn', regex: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi },
    { label: 'GitHub', regex: /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi },
    { label: 'LeetCode', regex: /(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/gi },
    { label: 'Codeforces', regex: /(?:https?:\/\/)?(?:www\.)?codeforces\.com\/profile\/([a-zA-Z0-9_-]+)/gi },
    { label: 'CodeChef', regex: /(?:https?:\/\/)?(?:www\.)?codechef\.com\/users\/([a-zA-Z0-9_-]+)/gi },
    { label: 'Portfolio', regex: /(?:https?:\/\/)?([a-zA-Z0-9_-]+\.(?:vercel\.app|netlify\.app|github\.io)|(?:https?:\/\/)[a-zA-Z0-9_.-]+\.(?:me|dev|tech|site|online))/gi },
  ];

  for (const p of patterns) {
    const matches = [...textToScan.matchAll(p.regex)];
    for (const match of matches) {
      let url = match[0].trim();
      if (/^[bm]\.tech/i.test(url) || url.toLowerCase().includes('b.tech') || url.toLowerCase().includes('m.tech')) continue;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      if (!links.some((l) => l.url.toLowerCase() === url.toLowerCase())) {
        links.push({ label: p.label, url });
      }
    }
  }

  return links;
}

// ============================================================
// PARSE UPLOADED RESUME FILE (PDF / TXT)
// ============================================================

export async function parseUploadedResume(file, targetTemplate = 'amity') {
  let rawText = '';
  let annotations = [];

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const res = await extractTextFromPDF(file);
    rawText = res.rawText;
    annotations = res.annotations;
  } else {
    const res = await extractTextFromFile(file);
    rawText = res.rawText;
    annotations = res.annotations;
  }

  if (!rawText || rawText.trim().length < 15) {
    throw new Error('Unable to extract readable text from the uploaded file. Please ensure the file has selectable text.');
  }

  return parseResumeText(rawText, targetTemplate, annotations);
}
