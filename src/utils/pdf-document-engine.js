/**
 * PDF Document Engine for ur-CV
 *
 * Universal In-Place PDF Modification Engine for ANY Resume Format
 * - Accepts ANY resume format (ATS LaTeX, Amity, Harvard, Canva, Word-exported, corporate, etc.)
 * - Preserves 100% of original visual assets (headers, photos, logos, lines, tables, static sections)
 * - Intelligent layout detection: Serif vs Sans-serif, date alignments, bullet styles, margins
 * - Greedy interval deduplication eliminates duplicate/competing PDF text layers
 * - Surgical wide-masking eliminates text clipping and edge bleed (no leftover letters)
 * - Strict font size preservation: NEVER auto-shrinks fonts to tiny unreadable ants
 * - Live 1-Page Space Budget & Capacity Warnings prevent overflow
 */

import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Safe worker initialization
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker setup:', e);
  }
}

// Strict regex patterns for section headings across arbitrary resume styles
const STRICT_HEADINGS = [
  { type: 'objective', regex: /^(career\s*objective|objective|professional\s*summary|profile\s*summary|summary|profile|about\s*me|executive\s*summary|career\s*profile|personal\s*summary)$/i },
  { type: 'education', regex: /^(academic\s*details|education|educational\s*qualifications|academic\s*qualifications|academic\s*background|qualifications)$/i },
  { type: 'experience', regex: /^(work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment\s*history|relevant\s*experience)$/i },
  { type: 'projects', regex: /^((technical|academic|personal|software)?\s*projects|project\s*work)$/i },
  { type: 'skills', regex: /^(technical\s*skills|core\s*skills|key\s*skills|skills(\s*(&|and)\s*abilities)?|skills|technical\s*competencies|technologies)$/i },
  { type: 'awards', regex: /^(awards(\s*(&|and)\s*achievements)?|certifications?(\s*(&|and)\s*achievements)?|achievements|certifications?|honors?|certificates?)$/i },
  { type: 'leadership', regex: /^(leadership(\s*(&|and)\s*initiative)?|extra[\s-]*curricular(\s*activities)?|co-curricular(\s*activities)?)$/i },
  { type: 'links', regex: /^(links|profiles|social\s*links|online\s*profiles)$/i },
  { type: 'declaration', regex: /^(self\s*declaration|declaration)$/i },
];

const BULLET_START_REGEX = /^[•\-\*\u2022\u25cf\u25e6\u25aa\u25b8\u2023\u2219]/;

export class PDFDocumentEngine {
  constructor() {
    this.scale = 2.0; // 2x rendering scale for crisp vector-like canvas clarity
    this.fileName = 'resume.pdf';
    this.pdfDoc = null;
    this.numPages = 0;
    this.pageWidthPt = 595.28;
    this.pageHeightPt = 841.89;
    this.pageWidthPx = 1190;
    this.pageHeightPx = 1684;

    this.pagesData = [];
    this.detectedLayout = {
      fontFamily: '"Times New Roman", Times, Georgia, serif',
      isSerif: true,
      textColor: '#1A1A2E',
      fontSize: 19, // Canvas pixels (approx 9.5pt)
      lineHeight: 1.35,
      skillsHasBullets: false,
      hasRightAlignedDates: false,
      formatStyle: 'standard', // 'ats_latex', 'corporate', 'standard'
    };

    // User editable data extracted from the document
    this.data = {
      objective: '',
      skills: [], // Array of { category: string, skills: string }
      experience: [], // Array of { title, company, duration, bullets: string[] }
    };

    this.renderedPages = []; // Canvases of final modified pages
    this.overflowWarnings = []; // Any section that exceeded boundary
  }

  /**
   * Load and process any uploaded PDF file
   */
  async loadFile(file) {
    this.fileName = file.name || 'resume.pdf';
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
    });

    this.pdfDoc = await loadingTask.promise;
    this.numPages = this.pdfDoc.numPages;
    this.pagesData = [];

    // Step 1: Render each page to an unmolested original canvas and extract text lines
    for (let p = 1; p <= this.numPages; p++) {
      const page = await this.pdfDoc.getPage(p);
      const viewport = page.getViewport({ scale: this.scale });

      if (p === 1) {
        this.pageWidthPt = page.view[2] - page.view[0];
        this.pageHeightPt = page.view[3] - page.view[1];
        this.pageWidthPx = viewport.width;
        this.pageHeightPx = viewport.height;
      }

      // Render high-res pristine background canvas
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = viewport.width;
      bgCanvas.height = viewport.height;
      const ctx = bgCanvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      // Extract text items with positions
      const textContent = await page.getTextContent();
      const lines = this._reconstructLines(textContent, viewport);

      this.pagesData.push({
        pageNum: p,
        viewport,
        originalCanvas: bgCanvas,
        textContent,
        lines,
        sections: [],
        boxes: {},
      });
    }

    // Step 2: Detect typography styles and layout patterns
    this._detectDocumentStyles();

    // Step 3: Strictly detect section headings and calculate precise bounding boxes
    this._detectSectionsAndBoxes();

    // Step 4: Extract editable content from lines
    this._extractEditableData();

    // Step 5: Render initial preview
    await this.render();

    return this.getData();
  }

  /**
   * Reconstruct lines from text items with Greedy Interval Deduplication
   * Eliminates duplicate overlapping text layers commonly found in complex PDFs
   */
  _reconstructLines(textContent, viewport) {
    if (!textContent || !textContent.items) return [];

    const rawItems = textContent.items
      .filter((it) => it.str && it.str.trim().length > 0)
      .map((it) => {
        const [vx, vy] = viewport.convertToViewportPoint(it.transform[4], it.transform[5]);
        const fontSizePx = Math.hypot(it.transform[0], it.transform[1]) * this.scale;
        const fontName = it.fontName || '';
        const fontStyle = textContent.styles ? textContent.styles[fontName] : null;

        return {
          str: it.str.trim(),
          vx: Math.round(vx),
          vy: Math.round(vy), // Baseline Y from top
          widthPx: Math.round((it.width || 0) * this.scale),
          heightPx: Math.round((it.height || fontSizePx) * this.scale),
          fontSizePx,
          fontName,
          fontFamily: fontStyle ? fontStyle.fontFamily : '',
        };
      });

    // Group items into visual lines (tolerance 3.5px)
    const lineBuckets = [];
    for (const item of rawItems) {
      let bucket = lineBuckets.find((b) => Math.abs(b.vy - item.vy) <= 3.5);
      if (!bucket) {
        bucket = {
          vy: item.vy,
          items: [],
        };
        lineBuckets.push(bucket);
      }
      bucket.items.push(item);
    }

    // Sort lines top to bottom
    lineBuckets.sort((a, b) => a.vy - b.vy);

    // Greedy Interval Selection to eliminate competing/overlapping text layers
    for (const b of lineBuckets) {
      b.items.sort((a, b) => a.vx - b.vx);
      const cleanItems = [];
      let currentRight = -1;

      for (const it of b.items) {
        const itLeft = it.vx;
        const itRight = it.vx + it.widthPx;

        // If an item starts well inside an already occupied interval (> 20px overlap), it belongs to a shadow/duplicate layer
        if (itLeft < currentRight - 20) {
          continue;
        }

        cleanItems.push(it);
        currentRight = Math.max(currentRight, itRight);
      }
      b.items = cleanItems;
    }

    // Build line objects
    const lines = [];
    for (const bucket of lineBuckets) {
      if (bucket.items.length === 0) continue;

      const minX = Math.min(...bucket.items.map((i) => i.vx));
      const maxX = Math.max(...bucket.items.map((i) => i.vx + i.widthPx));
      const text = bucket.items.map((i) => i.str).filter(Boolean).join(' ');
      const maxFontSize = Math.max(...bucket.items.map((i) => i.fontSizePx));
      const yTop = Math.max(0, bucket.vy - maxFontSize * 0.9);
      const yBottom = bucket.vy + maxFontSize * 0.3;

      const firstItem = bucket.items[0];
      const fontName = (firstItem.fontName || '').toLowerCase();
      const isBold = /bold|black|heavy|medium|600|700|800/.test(fontName);
      const isSerif = /times|roman|georgia|cambria|garamond|serif/.test(fontName) || /serif/i.test(firstItem.fontFamily);

      lines.push({
        text,
        minX,
        maxX,
        vy: bucket.vy,
        yTop,
        yBottom,
        heightPx: yBottom - yTop,
        fontSizePx: maxFontSize,
        isBold,
        isSerif,
        fontFamily: firstItem.fontFamily || (isSerif ? '"Times New Roman", Times, Georgia, serif' : 'system-ui, -apple-system, sans-serif'),
        items: bucket.items,
      });
    }

    return lines;
  }

  /**
   * Detect typography patterns, font families, and alignment styles from lines
   */
  _detectDocumentStyles() {
    let serifCount = 0;
    let sansCount = 0;
    let totalFontSize = 0;
    let fontCount = 0;
    let rightAlignedDatesCount = 0;

    for (const page of this.pagesData) {
      for (const line of page.lines) {
        if (line.isSerif) serifCount++;
        else sansCount++;

        if (line.fontSizePx >= 14 && line.fontSizePx <= 28) {
          totalFontSize += line.fontSizePx;
          fontCount++;
        }

        // Check if any date item in the line is aligned far right
        for (const it of line.items) {
          if (it.vx > 720 && this._matchDate(it.str)) {
            rightAlignedDatesCount++;
          }
        }
      }
    }

    const isSerif = serifCount >= sansCount;
    this.detectedLayout.isSerif = isSerif;
    this.detectedLayout.fontFamily = isSerif
      ? '"Times New Roman", Times, Georgia, serif'
      : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const avgFontPx = fontCount > 0 ? totalFontSize / fontCount : 19;
    this.detectedLayout.fontSize = Math.max(18, Math.min(21, avgFontPx));
    this.detectedLayout.lineHeight = 1.35;
    this.detectedLayout.hasRightAlignedDates = rightAlignedDatesCount >= 2;
    this.detectedLayout.formatStyle = this.detectedLayout.hasRightAlignedDates ? 'ats_latex' : 'standard';
  }

  /**
   * Strictly detect section headings and calculate precise wide-mask bounding boxes
   */
  _detectSectionsAndBoxes() {
    for (let pIdx = 0; pIdx < this.pagesData.length; pIdx++) {
      const page = this.pagesData[pIdx];
      const detected = [];

      for (let i = 0; i < page.lines.length; i++) {
        const line = page.lines[i];
        const cleanText = line.text
          .replace(/^[•\-\|:#*\s]+/, '')
          .replace(/[:#*\s]+$/, '')
          .trim();

        if (cleanText.length >= 3 && cleanText.length <= 45 && !line.text.startsWith('•')) {
          for (const h of STRICT_HEADINGS) {
            if (h.regex.test(cleanText) && !detected.some((s) => s.type === h.type)) {
              detected.push({
                type: h.type,
                text: cleanText,
                lineIdx: i,
                vy: line.vy,
                yTop: line.yTop,
                yBottom: line.yBottom,
                minX: line.minX,
                maxX: line.maxX,
                fontSizePx: line.fontSizePx,
              });
              break;
            }
          }
        }
      }

      detected.sort((a, b) => a.vy - b.vy);
      page.sections = detected;

      // Calculate dynamic bounding boxes for sections on this page
      const boxes = {};

      for (let i = 0; i < detected.length; i++) {
        const cur = detected[i];
        const next = detected[i + 1];

        const secLines = page.lines.slice(cur.lineIdx + 1, next ? next.lineIdx : page.lines.length);

        const secMinX = secLines.length > 0 ? Math.min(...secLines.map((l) => l.minX)) : cur.minX;
        const secMaxX = secLines.length > 0 ? Math.max(...secLines.map((l) => l.maxX)) : cur.maxX;
        const firstLineY = secLines.length > 0 ? secLines[0].vy : cur.vy + 25;
        const lastLineY = secLines.length > 0 ? secLines[secLines.length - 1].vy : cur.vy + 60;

        // Wide mask bounds: guaranteed 100% whiteout covering entire text margin to margin
        const maskLeft = Math.max(15, Math.min(cur.minX, secMinX) - 15);
        const maskRight = Math.min(page.originalCanvas.width - 15, Math.max(cur.maxX, secMaxX) + 16);
        const maskTop = Math.min(Math.round(cur.vy + 8), Math.round(firstLineY - 18));
        const maskBottom = next ? Math.round(next.vy - 14) : Math.round(Math.min(page.originalCanvas.height - 30, lastLineY + 25));

        const maskWidth = maskRight - maskLeft;
        const maskHeight = Math.max(30, maskBottom - maskTop);

        const lineHeight = this.detectedLayout.fontSize * this.detectedLayout.lineHeight;
        const capacityLines = Math.floor(maskHeight / lineHeight);

        boxes[cur.type] = {
          maskLeft,
          maskTop,
          maskWidth,
          maskHeight,
          contentLeft: secMinX,
          contentWidth: Math.max(200, secMaxX - secMinX),
          capacityLines,
          lineStart: cur.lineIdx + 1,
          lineEnd: next ? next.lineIdx : page.lines.length,
          originalLinesCount: secLines.length,
        };
      }

      // Check if page 2 starts with skills continuation (before the first heading on page 2)
      if (pIdx > 0 && detected.length > 0 && detected[0].type !== 'skills') {
        const firstHeadingTop = detected[0].vy;
        if (firstHeadingTop > 70) {
          const contLines = page.lines.slice(0, detected[0].lineIdx);
          let secMinX = 86;
          let secMaxX = page.originalCanvas.width - 86;
          if (contLines.length > 0) {
            secMinX = Math.min(...contLines.map((l) => l.minX));
            secMaxX = Math.max(...contLines.map((l) => l.maxX));
          }

          const maskLeft = Math.max(15, Math.min(secMinX - 15, 75));
          const maskRight = Math.min(page.originalCanvas.width - 15, secMaxX + 16);
          const maskTop = 30;
          const maskBottom = Math.round(firstHeadingTop - 18);
          const maskHeight = Math.max(30, maskBottom - maskTop);

          const lineHeight = this.detectedLayout.fontSize * this.detectedLayout.lineHeight;

          boxes['skills_continuation'] = {
            maskLeft,
            maskTop,
            maskWidth: maskRight - maskLeft,
            maskHeight,
            contentLeft: secMinX,
            contentWidth: Math.max(200, secMaxX - secMinX),
            capacityLines: Math.floor(maskHeight / lineHeight),
            lineStart: 0,
            lineEnd: detected[0].lineIdx,
            originalLinesCount: contLines.length,
          };
        }
      }

      page.boxes = boxes;
    }
  }

  /**
   * Extract Objective, Skills, and Experience with high accuracy
   */
  _extractEditableData() {
    let objectiveLines = [];
    let skillsLines = [];
    let experienceLines = [];

    for (let pIdx = 0; pIdx < this.pagesData.length; pIdx++) {
      const page = this.pagesData[pIdx];
      const boxes = page.boxes || {};

      if (boxes.objective) {
        const slice = page.lines.slice(boxes.objective.lineStart, boxes.objective.lineEnd);
        objectiveLines.push(...slice.map((l) => l.text));
      }

      if (boxes.experience) {
        const slice = page.lines.slice(boxes.experience.lineStart, boxes.experience.lineEnd);
        experienceLines.push(...slice.map((l) => l.text));
      }

      if (boxes.skills) {
        const slice = page.lines.slice(boxes.skills.lineStart, boxes.skills.lineEnd);
        skillsLines.push(...slice.map((l) => l.text));
      }

      if (boxes.skills_continuation) {
        const slice = page.lines.slice(boxes.skills_continuation.lineStart, boxes.skills_continuation.lineEnd);
        skillsLines.push(...slice.map((l) => l.text));
      }
    }

    // 1. Objective: clean single cohesive paragraph
    this.data.objective = objectiveLines
      .map((l) => l.replace(BULLET_START_REGEX, '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    // 2. Check if skills in the original document had bullets
    this.detectedLayout.skillsHasBullets = skillsLines.some((l) => BULLET_START_REGEX.test(l.trim()));

    // 3. Technical Skills
    this.data.skills = this._parseSkills(skillsLines);

    // 4. Work Experience
    this.data.experience = this._parseExperience(experienceLines);
  }

  _parseSkills(lines) {
    if (!lines || lines.length === 0) return [];
    const result = [];

    for (const rawLine of lines) {
      const clean = rawLine.trim();
      if (!clean) continue;

      const text = clean.replace(BULLET_START_REGEX, '').trim();
      const colonIdx = text.indexOf(':');

      if (colonIdx > 2 && colonIdx < 55) {
        result.push({
          category: text.substring(0, colonIdx).trim(),
          skills: text.substring(colonIdx + 1).trim(),
        });
      } else if (result.length > 0 && !BULLET_START_REGEX.test(clean)) {
        result[result.length - 1].skills += ' ' + clean;
      } else if (text.length > 2) {
        result.push({
          category: 'Skills',
          skills: text,
        });
      }
    }

    return result;
  }

  _parseExperience(lines) {
    if (!lines || lines.length === 0) return [];
    const experiences = [];
    let current = null;

    const DATE_REGEX = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:\d{1,2},?\s*)?\d{4}\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:\d{1,2},?\s*)?)?(?:\d{4}|present)/i;

    for (const rawLine of lines) {
      const clean = rawLine.trim();
      if (!clean) continue;

      const isBullet = BULLET_START_REGEX.test(clean);
      const dateMatch = clean.match(DATE_REGEX);
      const hasPipe = clean.includes('|');

      if (isBullet) {
        if (!current) {
          current = { title: 'Role', company: '', duration: '', bullets: [] };
        }
        current.bullets.push(clean.replace(BULLET_START_REGEX, '').trim());
      } else {
        const startsNewRole = (!current || current.bullets.length > 0) && (
          Boolean(dateMatch) || hasPipe || this._isRoleTitle(clean)
        );

        if (startsNewRole) {
          if (current) experiences.push(current);
          if (dateMatch) {
            const duration = dateMatch[0].trim();
            const title = clean.replace(dateMatch[0], '').replace(/[-–—|]+$/, '').trim();
            current = { title, company: '', duration, bullets: [] };
          } else if (hasPipe) {
            const parts = clean.split('|');
            current = { title: parts[0].trim(), company: parts[1].trim(), duration: '', bullets: [] };
          } else {
            current = { title: clean, company: '', duration: '', bullets: [] };
          }
        } else if (current) {
          if (dateMatch && !current.duration) {
            current.duration = dateMatch[0].trim();
            const remaining = clean.replace(dateMatch[0], '').replace(/[()]/g, '').trim();
            if (remaining && !current.company) current.company = remaining;
          } else if (!current.company && current.bullets.length === 0) {
            current.company = clean;
          } else if (current.bullets.length > 0) {
            current.bullets[current.bullets.length - 1] += ' ' + clean;
          }
        }
      }
    }

    if (current) experiences.push(current);

    return experiences.map((e) => ({
      ...e,
      bullets: e.bullets.length > 0 ? e.bullets : [''],
    }));
  }

  _isRoleTitle(str) {
    if (str.length > 115) return false;
    return Boolean(
      str.match(/(intern|engineer|developer|analyst|associate|trainee|manager|lead|architect|consultant|coordinator|founder|specialist|assistant)/i) ||
      str.match(/(software|frontend|backend|full[\s-]*stack|machine\s*learning|data\s*science|web\s*dev)/i)
    );
  }

  _splitRoleCompany(str) {
    const pipeMatch = str.match(/^(.+?)\s*[|]\s*(.+)$/);
    if (pipeMatch) return { title: pipeMatch[1].trim(), company: pipeMatch[2].trim() };
    const atMatch = str.match(/^(.+?)\s+at\s+(.+)$/i);
    if (atMatch) return { title: atMatch[1].trim(), company: atMatch[2].trim() };
    return { title: str, company: '' };
  }

  _matchDate(str) {
    return Boolean(
      (str.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i) && str.match(/\d{4}/)) ||
      str.match(/\d{1,2}\s*\/\s*\d{4}/) ||
      str.match(/\b(present|current|ongoing)\b/i) ||
      str.match(/\d{4}\s*[-–—]\s*(\d{4}|present)/i)
    );
  }

  // ============================================================
  // PUBLIC GETTER & SETTER METHODS FOR THE QUICK EDITOR
  // ============================================================

  getData() {
    return {
      fileName: this.fileName,
      numPages: this.numPages,
      detectedLayout: { ...this.detectedLayout },
      objective: this.data.objective,
      skills: JSON.parse(JSON.stringify(this.data.skills)),
      experience: JSON.parse(JSON.stringify(this.data.experience)),
    };
  }

  updateObjective(text) {
    this.data.objective = text || '';
  }

  updateSkills(skillsList) {
    this.data.skills = skillsList || [];
  }

  updateExperience(expList) {
    this.data.experience = expList || [];
  }

  // ============================================================
  // SPACE CAPACITY & 1-PAGE LIMIT ENGINE
  // ============================================================

  /**
   * Get exact line budget & space limit warning for any section
   */
  getSectionCapacity(sectionType) {
    for (const page of this.pagesData) {
      const box = page.boxes ? page.boxes[sectionType] : null;
      if (box && box.maskHeight > 0) {
        const fontSize = this.detectedLayout.fontSize;
        const lineHeight = fontSize * this.detectedLayout.lineHeight;
        const maxLines = Math.floor((box.maskHeight - 4) / lineHeight);
        const contentWidth = box.contentWidth;

        let currentLines = 0;
        const ctx = page.originalCanvas.getContext('2d');

        if (sectionType === 'objective') {
          const text = (this.data.objective || '').trim();
          if (text) {
            ctx.font = `normal ${Math.round(fontSize)}px ${this.detectedLayout.fontFamily}`;
            currentLines = this._wrapText(ctx, text, contentWidth).length;
          }
        } else if (sectionType === 'skills') {
          ctx.font = `bold ${Math.round(fontSize)}px ${this.detectedLayout.fontFamily}`;
          for (const item of this.data.skills || []) {
            const cat = (item.category || '').trim();
            const sk = (item.skills || '').trim();
            if (!cat && !sk) continue;
            const catW = cat ? ctx.measureText(cat + ': ').width : 0;
            ctx.font = `normal ${Math.round(fontSize)}px ${this.detectedLayout.fontFamily}`;
            const wrapped = this._wrapText(ctx, sk, Math.max(100, contentWidth - catW - 16));
            currentLines += Math.max(1, wrapped.length);
            ctx.font = `bold ${Math.round(fontSize)}px ${this.detectedLayout.fontFamily}`;
          }
        } else if (sectionType === 'experience') {
          const bulletIndent = 16 * this.scale;
          for (const exp of this.data.experience || []) {
            const hasHeader = Boolean(exp.title || exp.company || exp.duration);
            if (hasHeader) {
              currentLines += (exp.title && exp.company && !this.detectedLayout.hasRightAlignedDates) ? 2 : 1;
            }
            for (const b of exp.bullets || []) {
              if (b.trim()) {
                ctx.font = `normal ${Math.round(fontSize)}px ${this.detectedLayout.fontFamily}`;
                const wrapped = this._wrapText(ctx, b.trim(), contentWidth - bulletIndent);
                currentLines += Math.max(1, wrapped.length);
              }
            }
          }
        }

        const isExceeded = currentLines > maxLines;
        const excessLines = Math.max(0, currentLines - maxLines);
        const excessWords = Math.round(excessLines * 12);
        const percentUsed = maxLines > 0 ? Math.round((currentLines / maxLines) * 100) : 100;

        return {
          sectionType,
          maxLines,
          currentLines,
          contentWidth,
          isExceeded,
          excessLines,
          excessWords,
          percentUsed,
        };
      }
    }

    return {
      sectionType,
      maxLines: 6,
      currentLines: 0,
      contentWidth: 800,
      isExceeded: false,
      excessLines: 0,
      excessWords: 0,
      percentUsed: 0,
    };
  }

  // ============================================================
  // IN-PLACE RENDERING (100% VISUAL INTEGRITY & NO SHRINKING)
  // ============================================================

  /**
   * Render all pages incorporating user edits with clean bounding-box replacement
   */
  async render() {
    this.renderedPages = [];
    this.overflowWarnings = [];

    // Process each page: clone original canvas and replace ONLY the edited bounding boxes
    for (let pIdx = 0; pIdx < this.pagesData.length; pIdx++) {
      const page = this.pagesData[pIdx];
      const origCanvas = page.originalCanvas;

      // Clone original canvas
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = origCanvas.width;
      pageCanvas.height = origCanvas.height;
      const ctx = pageCanvas.getContext('2d');

      // Draw 100% of the pristine original page (header, logos, photo, fonts, static sections)
      ctx.drawImage(origCanvas, 0, 0);

      const boxes = page.boxes || {};

      // 1. Career Objective Box
      if (boxes.objective) {
        this._renderObjectiveBox(ctx, boxes.objective, this.data.objective);
      }

      // 2. Experience Box
      if (boxes.experience) {
        this._renderExperienceBox(ctx, boxes.experience, this.data.experience);
      }

      // 3. Technical Skills Box
      if (boxes.skills) {
        this._renderSkillsBox(ctx, boxes.skills, this.data.skills, boxes.skills_continuation ? 'part1' : 'all');
      }

      // 4. Skills Continuation Box (if page 2 continues skills)
      if (boxes.skills_continuation) {
        this._renderSkillsBox(ctx, boxes.skills_continuation, this.data.skills, 'part2');
      }

      this.renderedPages.push(pageCanvas);
    }

    return this.renderedPages;
  }

  _renderObjectiveBox(ctx, box, text) {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original text (wide margin to margin)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!text || !text.trim()) return;

    // Maintain standard readable font size (NEVER shrink font to tiny ants)
    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
    const lines = this._wrapText(ctx, text.trim(), box.contentWidth);

    ctx.fillStyle = this.detectedLayout.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let curY = box.maskTop + 2;
    for (let i = 0; i < lines.length; i++) {
      // Prevent overflowing into the next section heading
      if (curY + lineHeight > box.maskTop + box.maskHeight) {
        this.overflowWarnings.push({
          section: 'Career Objective',
          clippedLines: lines.length - i,
        });
        break;
      }
      ctx.fillText(lines[i], box.contentLeft, curY);
      curY += lineHeight;
    }
  }

  _renderExperienceBox(ctx, box, expList) {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original experience area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!expList || expList.length === 0) return;

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;
    const bulletIndent = 16 * this.scale;
    const hasRightDates = this.detectedLayout.hasRightAlignedDates;

    let curY = box.maskTop + 2;

    for (const exp of expList) {
      const title = (exp.title || '').trim();
      const company = (exp.company || '').trim();
      const duration = (exp.duration || '').trim();
      const bullets = exp.bullets || [];

      if (!title && !company && bullets.length === 0) continue;
      if (curY + lineHeight > box.maskTop + box.maskHeight) {
        this.overflowWarnings.push({ section: 'Experience', clipped: true });
        break;
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      if (hasRightDates && duration) {
        // ATS / LaTeX style: Title left, Duration right
        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.fillText(title, box.contentLeft, curY);

        ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
        ctx.textAlign = 'right';
        ctx.fillText(duration, box.contentLeft + box.contentWidth, curY);
        ctx.textAlign = 'left';
        curY += lineHeight;

        if (company) {
          ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
          ctx.fillText(company, box.contentLeft, curY);
          curY += lineHeight;
        }
      } else {
        // Standard / Corporate style: Title | Company
        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const titleText = title + (company ? ` | ${company}` : '');
        ctx.fillText(titleText, box.contentLeft, curY);
        curY += lineHeight;

        if (duration) {
          ctx.font = `italic ${Math.round(fontSize * 0.92)}px ${fontFamily}`;
          ctx.fillText(duration, box.contentLeft, curY);
          curY += lineHeight;
        }
      }

      // Bullets
      for (const bullet of bullets) {
        const cleanBullet = (bullet || '').trim();
        if (!cleanBullet) continue;
        if (curY + lineHeight > box.maskTop + box.maskHeight) {
          this.overflowWarnings.push({ section: 'Experience', clipped: true });
          break;
        }

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;

        const wrapped = this._wrapText(ctx, cleanBullet, box.contentWidth - bulletIndent);
        for (let i = 0; i < wrapped.length; i++) {
          if (curY + lineHeight > box.maskTop + box.maskHeight) break;

          if (i === 0) {
            ctx.fillText('•', box.contentLeft + 2, curY);
          }
          ctx.fillText(wrapped[i], box.contentLeft + bulletIndent, curY);
          curY += lineHeight;
        }
      }

      curY += 4; // Space between roles
    }
  }

  _renderSkillsBox(ctx, box, skillsList, mode = 'all') {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original skills area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!skillsList || skillsList.length === 0) return;

    let itemsToRender = skillsList;
    if (mode === 'part1') {
      itemsToRender = skillsList.slice(0, 8);
    } else if (mode === 'part2') {
      itemsToRender = skillsList.slice(8);
    }

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;
    const hasBullets = Boolean(this.detectedLayout.skillsHasBullets);

    let curY = box.maskTop + 2;

    for (const item of itemsToRender) {
      const category = (item.category || '').trim();
      const skills = (item.skills || '').trim();
      if (!category && !skills) continue;
      if (curY + lineHeight > box.maskTop + box.maskHeight) {
        this.overflowWarnings.push({ section: 'Technical Skills', clipped: true });
        break;
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      let startX = box.contentLeft;

      if (hasBullets) {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.fillText('•', box.contentLeft, curY);
        startX = box.contentLeft + 16;
      }

      if (category) {
        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const catText = category + ': ';
        ctx.fillText(catText, startX, curY);
        const catW = ctx.measureText(catText).width;

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        const remainingWidth = Math.max(100, box.contentWidth - (startX - box.contentLeft) - catW);
        const wrapped = this._wrapText(ctx, skills, remainingWidth);

        if (wrapped.length > 0) {
          ctx.fillText(wrapped[0], startX + catW, curY);
          curY += lineHeight;

          for (let i = 1; i < wrapped.length; i++) {
            if (curY + lineHeight > box.maskTop + box.maskHeight) break;
            ctx.fillText(wrapped[i], startX + (hasBullets ? 0 : catW), curY);
            curY += lineHeight;
          }
        } else {
          curY += lineHeight;
        }
      } else {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const wrapped = this._wrapText(ctx, skills, box.contentWidth - (startX - box.contentLeft));
        for (const line of wrapped) {
          if (curY + lineHeight > box.maskTop + box.maskHeight) break;
          ctx.fillText(line, startX, curY);
          curY += lineHeight;
        }
      }
    }
  }

  _wrapText(ctx, text, maxWidth) {
    if (!text) return [];
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // ============================================================
  // PDF EXPORT
  // ============================================================

  /**
   * Export the modified resume to PDF with exact vector dimensions
   */
  async exportPDF(customFileName) {
    await this.render();

    if (!this.renderedPages || this.renderedPages.length === 0) {
      throw new Error('No pages available to export.');
    }

    const doc = new jsPDF({
      unit: 'pt',
      format: [this.pageWidthPt, this.pageHeightPt],
      orientation: 'portrait',
    });

    for (let i = 0; i < this.renderedPages.length; i++) {
      if (i > 0) {
        doc.addPage([this.pageWidthPt, this.pageHeightPt]);
      }
      const pageCanvas = this.renderedPages[i];
      doc.addImage(
        pageCanvas,
        'PNG',
        0,
        0,
        this.pageWidthPt,
        this.pageHeightPt,
        undefined,
        'FAST'
      );
    }

    const saveName = customFileName || this.fileName.replace(/\.pdf$/i, '') + '_edited.pdf';
    doc.save(saveName);
  }
}
