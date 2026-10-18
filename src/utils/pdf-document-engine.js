/**
 * PDF Document Engine for ur-CV
 *
 * Universal In-Place PDF Modification Engine for ANY Resume Format
 * - Accepts ANY resume format (ATS LaTeX, Amity, Harvard, Canva, Word-exported, corporate, etc.)
 * - Preserves 100% of original visual assets (headers, photos, logos, lines, tables, static sections)
 * - Intelligent layout detection: Serif vs Sans-serif, date alignments, bullet styles, margins
 * - Greedy interval deduplication eliminates duplicate/competing PDF text layers
 * - Non-destructive: Untouched sections remain 100% original PDF vector pixels (DITTO)
 * - Surgical wide-masking on edit eliminates text clipping and edge bleed (no leftover letters)
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

// Strict headings for the 3 editable sections
const EDITABLE_HEADINGS = [
  { type: 'objective', regex: /^(career\s*objective|objective|professional\s*summary|profile\s*summary|summary|profile|about\s*me|executive\s*summary|career\s*profile|personal\s*summary)$/i },
  { type: 'experience', regex: /^(work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment\s*history|relevant\s*experience)$/i },
  { type: 'skills', regex: /^(technical\s*skills|core\s*skills|key\s*skills|skills(\s*(&|and)\s*abilities)?|skills|technical\s*competencies|technologies)$/i },
];

// Any standard resume section heading to determine section boundaries
const ANY_HEADING_REGEX = /^(career\s*objective|objective|professional\s*summary|profile\s*summary|summary|profile|about\s*me|academic\s*details|education|educational\s*qualifications|academic\s*qualifications|academic\s*background|qualifications|work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment\s*history|relevant\s*experience|projects?|project\s*work|technical\s*skills|core\s*skills|key\s*skills|skills|technologies|awards?|certifications?|achievements?|honors?|certificates?|leadership|co-curricular|extra[\s-]*curricular|links|profiles|social\s*links|declaration|self\s*declaration|publications?|coursework|involvement|volunteering?|organizations?|references?|interests?)$/i;

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      isSerif: false,
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
      skillsText: '',
      experienceText: '',
    };

    // Track user modifications: only modified sections are masked & re-rendered
    this.isModified = {
      objective: false,
      skills: false,
      experience: false,
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
        headings: [],
        boxes: {},
      });
    }

    // Step 2: Detect typography styles and layout patterns
    this._detectDocumentStyles();

    // Step 3: Strictly detect section headings and calculate precise bounding boxes
    this._detectSectionsAndBoxes();

    // Step 4: Extract editable content from lines
    this._extractEditableData();

    // Reset modification flags on initial load
    this.isModified = {
      objective: false,
      skills: false,
      experience: false,
    };

    // Step 5: Render initial preview (100% pristine canvas clone with zero modifications)
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

    // Greedy Interval Selection to eliminate competing/overlapping duplicate text layers
    for (const b of lineBuckets) {
      b.items.sort((a, b) => a.vx - b.vx);
      const cleanItems = [];
      let currentRight = -1;

      for (const it of b.items) {
        const itLeft = it.vx;
        const itRight = it.vx + it.widthPx;

        // If an item starts well inside an already occupied interval (> 20px overlap), skip shadow duplicate
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
      const styleFamily = (firstItem.fontFamily || '').toLowerCase();

      const isSans = styleFamily.includes('sans') || fontName.includes('sans') || fontName.includes('arial') || fontName.includes('calibri') || fontName.includes('helvetica');
      const isSerif = !isSans && (styleFamily === 'serif' || fontName.includes('times') || fontName.includes('roman') || fontName.includes('cambria') || fontName.includes('georgia') || fontName.includes('garamond') || fontName.includes('cmr'));
      const isBold = /bold|black|heavy|medium|600|700|800/.test(fontName);

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
        isSans,
        fontFamily: isSerif
          ? '"Times New Roman", Times, Georgia, "Liberation Serif", serif'
          : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
        else if (line.isSans) sansCount++;

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

    const isSerif = serifCount > sansCount;
    this.detectedLayout.isSerif = isSerif;
    this.detectedLayout.fontFamily = isSerif
      ? '"Times New Roman", Times, Georgia, "Liberation Serif", serif'
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
      const headings = [];

      for (let i = 0; i < page.lines.length; i++) {
        const line = page.lines[i];
        const cleanText = line.text
          .replace(/^[•\-\|:#*\s]+/, '')
          .replace(/[:#*\s]+$/, '')
          .trim();

        if (cleanText.length >= 3 && cleanText.length <= 48 && !line.text.startsWith('•') && ANY_HEADING_REGEX.test(cleanText)) {
          const editMatch = EDITABLE_HEADINGS.find((h) => h.regex.test(cleanText));
          headings.push({
            type: editMatch ? editMatch.type : 'other',
            text: cleanText,
            lineIdx: i,
            vy: line.vy,
            yTop: line.yTop,
            yBottom: line.yBottom,
            minX: line.minX,
            maxX: line.maxX,
            fontSizePx: line.fontSizePx,
          });
        }
      }

      headings.sort((a, b) => a.vy - b.vy);
      page.headings = headings;

      // Calculate dynamic bounding boxes for the 3 editable sections on this page
      const boxes = {};

      for (let i = 0; i < headings.length; i++) {
        const cur = headings[i];
        if (cur.type === 'other') continue; // Only compute boxes for the 3 target sections

        const next = headings[i + 1];
        const secLines = page.lines.slice(cur.lineIdx + 1, next ? next.lineIdx : page.lines.length);

        const secMinX = secLines.length > 0 ? Math.min(...secLines.map((l) => l.minX)) : cur.minX;
        const secMaxX = secLines.length > 0 ? Math.max(...secLines.map((l) => l.maxX)) : cur.maxX;
        const firstLineY = secLines.length > 0 ? secLines[0].vy : cur.vy + 25;
        const lastLineY = secLines.length > 0 ? secLines[secLines.length - 1].vy : cur.vy + 60;

        // Wide mask bounds: guaranteed 100% whiteout covering entire text margin to margin
        const maskLeft = Math.max(10, Math.min(cur.minX, secMinX) - 20);
        const maskRight = Math.min(page.originalCanvas.width - 15, Math.max(cur.maxX, secMaxX) + 25);
        const maskTop = Math.min(Math.round(cur.vy + 6), Math.round(firstLineY - 16));
        const maskBottom = next ? Math.round(next.vy - 12) : Math.round(Math.min(page.originalCanvas.height - 25, lastLineY + 25));

        const maskWidth = maskRight - maskLeft;
        const maskHeight = Math.max(30, maskBottom - maskTop);

        const lineHeight = this.detectedLayout.fontSize * this.detectedLayout.lineHeight;
        const capacityLines = Math.floor(maskHeight / lineHeight);

        boxes[cur.type] = {
          maskLeft,
          maskTop,
          maskWidth,
          maskHeight,
          maskBottom,
          contentLeft: secMinX,
          contentWidth: Math.max(200, secMaxX - secMinX),
          capacityLines,
          lineStart: cur.lineIdx + 1,
          lineEnd: next ? next.lineIdx : page.lines.length,
          originalLinesCount: secLines.length,
        };
      }

      // Check if page 2 starts with skills continuation (before the first heading on page 2)
      if (pIdx > 0 && headings.length > 0 && headings[0].type !== 'skills') {
        const firstHeadingTop = headings[0].vy;
        if (firstHeadingTop > 70) {
          const contLines = page.lines.slice(0, headings[0].lineIdx);
          let secMinX = 86;
          let secMaxX = page.originalCanvas.width - 86;
          if (contLines.length > 0) {
            secMinX = Math.min(...contLines.map((l) => l.minX));
            secMaxX = Math.max(...contLines.map((l) => l.maxX));
          }

          const maskLeft = Math.max(10, Math.min(secMinX - 20, 75));
          const maskRight = Math.min(page.originalCanvas.width - 15, secMaxX + 25);
          const maskTop = 25;
          const maskBottom = Math.round(firstHeadingTop - 14);
          const maskHeight = Math.max(30, maskBottom - maskTop);

          const lineHeight = this.detectedLayout.fontSize * this.detectedLayout.lineHeight;

          boxes['skills_continuation'] = {
            maskLeft,
            maskTop,
            maskWidth: maskRight - maskLeft,
            maskHeight,
            maskBottom,
            contentLeft: secMinX,
            contentWidth: Math.max(200, secMaxX - secMinX),
            capacityLines: Math.floor(maskHeight / lineHeight),
            lineStart: 0,
            lineEnd: headings[0].lineIdx,
            originalLinesCount: contLines.length,
          };
        }
      }

      page.boxes = boxes;
    }
  }

  /**
   * Extract Objective, Skills, and Experience with high fidelity
   * Keeps lines as readable formatted text blocks
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

    // 2. Technical Skills: clean text lines
    this.detectedLayout.skillsHasBullets = skillsLines.some((l) => BULLET_START_REGEX.test(l.trim()));
    this.data.skillsText = skillsLines.filter(Boolean).join('\n');

    // 3. Work Experience: clean text lines
    this.data.experienceText = experienceLines.filter(Boolean).join('\n');
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
      skillsText: this.data.skillsText,
      experienceText: this.data.experienceText,
      isModified: { ...this.isModified },
    };
  }

  updateObjective(text) {
    this.data.objective = text || '';
    this.isModified.objective = true;
  }

  updateSkillsText(text) {
    this.data.skillsText = text || '';
    this.isModified.skills = true;
  }

  updateExperienceText(text) {
    this.data.experienceText = text || '';
    this.isModified.experience = true;
  }

  // Backwards compatibility helpers
  updateSkills(skillsList) {
    if (Array.isArray(skillsList)) {
      this.data.skillsText = skillsList
        .map((s) => (s.category ? `${s.category}: ${s.skills}` : s.skills || ''))
        .filter(Boolean)
        .join('\n');
    } else {
      this.data.skillsText = String(skillsList || '');
    }
    this.isModified.skills = true;
  }

  updateExperience(expList) {
    if (Array.isArray(expList)) {
      const lines = [];
      for (const e of expList) {
        if (e.title || e.company || e.duration) {
          const header = [e.title, e.company, e.duration].filter(Boolean).join(' | ');
          lines.push(header);
        }
        for (const b of e.bullets || []) {
          if (b.trim()) lines.push(`• ${b.trim()}`);
        }
        lines.push('');
      }
      this.data.experienceText = lines.join('\n').trim();
    } else {
      this.data.experienceText = String(expList || '');
    }
    this.isModified.experience = true;
  }

  // ============================================================
  // SPACE CAPACITY & 1-PAGE LIMIT ENGINE
  // ============================================================

  /**
   * Get exact line budget & space limit warning for any section
   */
  getSectionCapacity(sectionType) {
    let totalMaxLines = 0;
    let totalContentWidth = 800;

    for (const page of this.pagesData) {
      const box = page.boxes ? page.boxes[sectionType] : null;
      if (box && box.maskHeight > 0) {
        const fontSize = this.detectedLayout.fontSize;
        const lineHeight = fontSize * this.detectedLayout.lineHeight;
        const calculatedCapacity = Math.floor((box.maskHeight - 4) / lineHeight);
        const boxMax = Math.max(calculatedCapacity, box.originalLinesCount || 0);
        totalMaxLines += boxMax;
        totalContentWidth = box.contentWidth;
      }
      if (sectionType === 'skills' && page.boxes && page.boxes.skills_continuation) {
        const contBox = page.boxes.skills_continuation;
        const fontSize = this.detectedLayout.fontSize;
        const lineHeight = fontSize * this.detectedLayout.lineHeight;
        const calculatedCapacity = Math.floor((contBox.maskHeight - 4) / lineHeight);
        const contMax = Math.max(calculatedCapacity, contBox.originalLinesCount || 0);
        totalMaxLines += contMax;
      }
    }

    if (totalMaxLines === 0) totalMaxLines = 8;

    let currentLines = 0;
    const testCanvas = document.createElement('canvas');
    const ctx = testCanvas.getContext('2d');
    const fontSize = this.detectedLayout.fontSize;
    const fontFamily = this.detectedLayout.fontFamily;

    if (sectionType === 'objective') {
      const text = (this.data.objective || '').trim();
      if (text) {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        currentLines = this._wrapText(ctx, text, totalContentWidth).length;
      }
    } else if (sectionType === 'skills') {
      const rawLines = (this.data.skillsText || '').split('\n').map((l) => l.trim()).filter(Boolean);
      for (const line of rawLines) {
        const hasBullet = BULLET_START_REGEX.test(line);
        const textWithoutBullet = line.replace(BULLET_START_REGEX, '').trim();
        const colonIdx = textWithoutBullet.indexOf(':');

        if (colonIdx > 0 && colonIdx < 50) {
          const cat = textWithoutBullet.substring(0, colonIdx + 1);
          const rest = textWithoutBullet.substring(colonIdx + 1).trim();
          ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
          const catW = ctx.measureText(cat + ' ').width;
          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          const availW = Math.max(100, totalContentWidth - (hasBullet ? 16 : 0) - catW);
          const wrapped = this._wrapText(ctx, rest, availW);
          currentLines += Math.max(1, wrapped.length);
        } else {
          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          const availW = hasBullet ? totalContentWidth - 16 : totalContentWidth;
          const wrapped = this._wrapText(ctx, textWithoutBullet, availW);
          currentLines += Math.max(1, wrapped.length);
        }
      }
    } else if (sectionType === 'experience') {
      const rawLines = (this.data.experienceText || '').split('\n');
      for (const line of rawLines) {
        const trimmed = line.trim();
        if (!trimmed) {
          currentLines += 0.5;
          continue;
        }
        if (BULLET_START_REGEX.test(trimmed)) {
          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          const bulletText = trimmed.replace(BULLET_START_REGEX, '').trim();
          const wrapped = this._wrapText(ctx, bulletText, totalContentWidth - 18);
          currentLines += Math.max(1, wrapped.length);
        } else {
          currentLines += 1;
        }
      }
      currentLines = Math.round(currentLines);
    }

    // Only mark isExceeded if the section was modified by the user
    const isMod = Boolean(this.isModified && this.isModified[sectionType]);
    const isExceeded = isMod && currentLines > totalMaxLines;
    const excessLines = isExceeded ? Math.max(0, currentLines - totalMaxLines) : 0;
    const excessWords = Math.round(excessLines * 12);
    const displayCurrentLines = isMod ? currentLines : Math.min(currentLines, totalMaxLines);
    const percentUsed = totalMaxLines > 0 ? Math.min(isExceeded ? 150 : 100, Math.round((displayCurrentLines / totalMaxLines) * 100)) : 100;

    return {
      sectionType,
      maxLines: totalMaxLines,
      currentLines: displayCurrentLines,
      contentWidth: totalContentWidth,
      isExceeded,
      excessLines,
      excessWords,
      percentUsed,
    };
  }

  // ============================================================
  // IN-PLACE RENDERING (100% VISUAL INTEGRITY & DITTO FIDELITY)
  // ============================================================

  /**
   * Render all pages incorporating user edits with clean bounding-box replacement
   * If a section has NOT been modified by the user, it remains 100% original PDF vector pixels!
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

      // 1. Career Objective Box: ONLY re-render if user actually modified it
      if (this.isModified.objective && boxes.objective) {
        this._renderObjectiveBox(ctx, boxes.objective, this.data.objective);
      }

      // 2. Experience Box: ONLY re-render if user actually modified it
      if (this.isModified.experience && boxes.experience) {
        this._renderExperienceBox(ctx, boxes.experience, this.data.experienceText);
      }

      // 3. Technical Skills Box: ONLY re-render if user actually modified it
      if (this.isModified.skills) {
        if (boxes.skills) {
          this._renderSkillsBox(ctx, boxes.skills, this.data.skillsText, boxes.skills_continuation ? 'part1' : 'all');
        }
        if (boxes.skills_continuation) {
          this._renderSkillsBox(ctx, boxes.skills_continuation, this.data.skillsText, 'part2');
        }
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
      if (curY + lineHeight > box.maskBottom) {
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

  _renderExperienceBox(ctx, box, experienceText) {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original experience area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!experienceText || !experienceText.trim()) return;

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;
    const bulletIndent = 16 * this.scale;
    const hasRightDates = this.detectedLayout.hasRightAlignedDates;

    const DATE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:\d{1,2},?\s*)?\d{4}|\d{4})\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(?:\d{1,2},?\s*)?\d{4}|\d{4}|present)/i;

    let curY = box.maskTop + 2;
    const rawLines = experienceText.split('\n');

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    for (const rawLine of rawLines) {
      const cleanLine = rawLine.trim();

      if (!cleanLine) {
        curY += 6;
        continue;
      }

      if (curY + lineHeight > box.maskBottom) {
        this.overflowWarnings.push({ section: 'Experience', clipped: true });
        break;
      }

      if (BULLET_START_REGEX.test(cleanLine)) {
        // Bullet point
        const cleanBullet = cleanLine.replace(BULLET_START_REGEX, '').trim();
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;

        const wrapped = this._wrapText(ctx, cleanBullet, box.contentWidth - bulletIndent);
        for (let i = 0; i < wrapped.length; i++) {
          if (curY + lineHeight > box.maskBottom) break;

          if (i === 0) {
            ctx.fillText('•', box.contentLeft + 2, curY);
          }
          ctx.fillText(wrapped[i], box.contentLeft + bulletIndent, curY);
          curY += lineHeight;
        }
      } else {
        // Header line (Job title, Company, Dates)
        const dateMatch = cleanLine.match(DATE_REGEX);

        if (hasRightDates && dateMatch) {
          const dateStr = dateMatch[0].trim();
          const titleStr = cleanLine.replace(dateMatch[0], '').replace(/[-–—|]+$/, '').trim();

          ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
          ctx.fillStyle = this.detectedLayout.textColor;
          ctx.fillText(titleStr, box.contentLeft, curY);

          ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
          ctx.textAlign = 'right';
          ctx.fillText(dateStr, box.contentLeft + box.contentWidth, curY);
          ctx.textAlign = 'left';
          curY += lineHeight;
        } else if (hasRightDates && cleanLine.endsWith('Remote')) {
          const mainPart = cleanLine.replace(/Remote$/, '').trim();
          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          ctx.fillStyle = this.detectedLayout.textColor;
          ctx.fillText(mainPart, box.contentLeft, curY);

          ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
          ctx.textAlign = 'right';
          ctx.fillText('Remote', box.contentLeft + box.contentWidth, curY);
          ctx.textAlign = 'left';
          curY += lineHeight;
        } else {
          // Standard title / company line
          const isRole = this._isRoleTitle(cleanLine) || cleanLine.includes('|');
          ctx.font = `${isRole ? 'bold' : 'normal'} ${Math.round(fontSize)}px ${fontFamily}`;
          ctx.fillStyle = this.detectedLayout.textColor;
          ctx.fillText(cleanLine, box.contentLeft, curY);
          curY += lineHeight;
        }
      }
    }
  }

  _isRoleTitle(str) {
    if (str.length > 115) return false;
    return Boolean(
      str.match(/(intern|engineer|developer|analyst|associate|trainee|manager|lead|architect|consultant|coordinator|founder|specialist|assistant)/i) ||
      str.match(/(software|frontend|backend|full[\s-]*stack|machine\s*learning|data\s*science|web\s*dev)/i)
    );
  }

  _renderSkillsBox(ctx, box, skillsText, mode = 'all') {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original skills area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!skillsText || !skillsText.trim()) return;

    const allLines = skillsText.split('\n').map((l) => l.trim()).filter(Boolean);
    let itemsToRender = allLines;
    if (mode === 'part1') {
      itemsToRender = allLines.slice(0, 8);
    } else if (mode === 'part2') {
      itemsToRender = allLines.slice(8);
    }

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    let curY = box.maskTop + 2;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    for (const rawLine of itemsToRender) {
      if (curY + lineHeight > box.maskBottom) {
        this.overflowWarnings.push({ section: 'Technical Skills', clipped: true });
        break;
      }

      const hasBullet = BULLET_START_REGEX.test(rawLine);
      const textWithoutBullet = rawLine.replace(BULLET_START_REGEX, '').trim();
      let startX = box.contentLeft;

      if (hasBullet) {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.fillText('•', box.contentLeft, curY);
        startX = box.contentLeft + 16;
      }

      const colonIdx = textWithoutBullet.indexOf(':');

      if (colonIdx > 0 && colonIdx < 55) {
        const category = textWithoutBullet.substring(0, colonIdx + 1);
        const rest = textWithoutBullet.substring(colonIdx + 1).trim();

        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.fillText(category, startX, curY);
        const catW = ctx.measureText(category + ' ').width;

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        const availW = Math.max(100, box.contentWidth - (startX - box.contentLeft) - catW);
        const wrapped = this._wrapText(ctx, rest, availW);

        if (wrapped.length > 0) {
          ctx.fillText(wrapped[0], startX + catW, curY);
          curY += lineHeight;

          for (let i = 1; i < wrapped.length; i++) {
            if (curY + lineHeight > box.maskBottom) break;
            ctx.fillText(wrapped[i], startX + (hasBullet ? 0 : catW), curY);
            curY += lineHeight;
          }
        } else {
          curY += lineHeight;
        }
      } else {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const wrapped = this._wrapText(ctx, textWithoutBullet, box.contentWidth - (startX - box.contentLeft));
        for (const line of wrapped) {
          if (curY + lineHeight > box.maskBottom) break;
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
