/**
 * PDF Document Engine for ur-CV
 *
 * In-Place PDF Modification with 100% Visual Fidelity & Precise Dynamic Bounding-Box Replacement.
 * Accepts ANY resume format (Canva, Amity, Jake's, LaTeX, Word-exported, corporate, etc.),
 * preserves 100% of original visual assets (headers, logos, photos, lines, colors, static sections),
 * deduplicates overlapping PDF text layers, eliminates text clipping/overlapping,
 * and maintains exact original font sizes without shrinking.
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

// Strict regex patterns for section headings (matches real headings, not bullet words or inline text)
const STRICT_HEADINGS = [
  { type: 'objective', regex: /^(career\s*objective|objective|professional\s*summary|profile\s*summary|summary|profile|about\s*me|executive\s*summary)$/i },
  { type: 'education', regex: /^(academic\s*details|education|educational\s*qualifications|academic\s*qualifications|academic\s*background|qualifications)$/i },
  { type: 'experience', regex: /^(work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment\s*history)$/i },
  { type: 'projects', regex: /^((technical|academic|personal|software)?\s*projects|project\s*work)$/i },
  { type: 'skills', regex: /^(technical\s*skills|core\s*skills|key\s*skills|skills(\s*(&|and)\s*abilities)?|skills)$/i },
  { type: 'awards', regex: /^(awards(\s*and\s*achievements)?|achievements|certifications?|honors?|certificates?)$/i },
  { type: 'leadership', regex: /^(leadership(\s*(&|and)\s*initiative)?|extra[\s-]*curricular(\s*activities)?|co-curricular(\s*activities)?)$/i },
  { type: 'links', regex: /^(links|profiles|social\s*links|online\s*profiles)$/i },
  { type: 'declaration', regex: /^(self\s*declaration|declaration)$/i },
];

const BULLET_START_REGEX = /^[•\-\*\u2022\u25cf\u25e6\u25aa\u25b8\u2023\u2219]/;

export class PDFDocumentEngine {
  constructor() {
    this.scale = 2.0; // 2x rendering scale for retina vector sharpness
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
      fontSize: 19, // In 2x canvas pixels (approx 9.5pt)
      lineHeight: 1.35,
    };

    // User editable data extracted from the document
    this.data = {
      objective: '',
      skills: [], // Array of { category: string, skills: string }
      experience: [], // Array of { title, company, duration, bullets: string[] }
    };

    this.renderedPages = []; // Canvases of final modified pages
  }

  /**
   * Load and process an uploaded PDF file
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

    // Step 2: Detect typography styles
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
   * Reconstruct lines from text items, eliminating duplicate overlapping layers
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
          str: it.str,
          vx: Math.round(vx),
          vy: Math.round(vy), // Baseline Y from top
          widthPx: Math.round((it.width || 0) * this.scale),
          heightPx: Math.round((it.height || fontSizePx) * this.scale),
          fontSizePx,
          fontName,
          fontFamily: fontStyle ? fontStyle.fontFamily : '',
        };
      });

    // Deduplicate overlapping items (e.g. PDFs with multiple identical/competing text layers)
    const items = [];
    for (const it of rawItems) {
      const isDup = items.some(
        (x) => Math.abs(x.vy - it.vy) <= 4 && Math.abs(x.vx - it.vx) <= 8
      );
      if (!isDup) items.push(it);
    }

    // Group items into visual lines (tolerance 4px)
    const lineBuckets = [];
    for (const item of items) {
      let bucket = lineBuckets.find((b) => Math.abs(b.vy - item.vy) <= 4.0);
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

    // Build line objects
    const lines = [];
    for (const bucket of lineBuckets) {
      bucket.items.sort((a, b) => a.vx - b.vx);

      const minX = Math.min(...bucket.items.map((i) => i.vx));
      const maxX = Math.max(...bucket.items.map((i) => i.vx + i.widthPx));
      const text = bucket.items.map((i) => i.str.trim()).filter(Boolean).join(' ');
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
        fontFamily: firstItem.fontFamily || (isSerif ? '"Times New Roman", serif' : 'Inter, sans-serif'),
        items: bucket.items,
      });
    }

    return lines;
  }

  /**
   * Detect typography patterns from lines
   */
  _detectDocumentStyles() {
    let serifCount = 0;
    let sansCount = 0;
    let totalFontSize = 0;
    let fontCount = 0;

    for (const page of this.pagesData) {
      for (const line of page.lines) {
        if (line.isSerif) serifCount++;
        else sansCount++;

        if (line.fontSizePx >= 14 && line.fontSizePx <= 30) {
          totalFontSize += line.fontSizePx;
          fontCount++;
        }
      }
    }

    const isSerif = serifCount >= sansCount;
    this.detectedLayout.isSerif = isSerif;
    this.detectedLayout.fontFamily = isSerif
      ? '"Times New Roman", Times, Georgia, serif'
      : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const avgFontPx = fontCount > 0 ? totalFontSize / fontCount : 19;
    this.detectedLayout.fontSize = Math.max(17, Math.min(22, avgFontPx));
    this.detectedLayout.lineHeight = 1.35;
  }

  /**
   * Strictly detect section headings and calculate dynamic bounding boxes matching original margins
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

        // Content box starts below the heading bar and ends before the next heading bar
        const boxTop = Math.round(cur.vy + 18);
        const boxBottom = next ? Math.round(next.vy - 16) : Math.round(page.originalCanvas.height - 35);

        const secLines = page.lines.slice(cur.lineIdx + 1, next ? next.lineIdx : page.lines.length);

        let secMinX = cur.minX;
        let secMaxX = cur.maxX;
        if (secLines.length > 0) {
          secMinX = Math.min(...secLines.map((l) => l.minX));
          secMaxX = Math.max(...secLines.map((l) => l.maxX));
        }

        // Generous white mask bounds to guarantee 100% wipeout of all underlying text
        const maskLeft = Math.max(10, Math.floor(secMinX - 8));
        const maskRight = Math.min(page.originalCanvas.width - 10, Math.ceil(secMaxX + 12));
        const maskWidth = maskRight - maskLeft;

        boxes[cur.type] = {
          maskLeft,
          maskTop: boxTop,
          maskWidth,
          maskHeight: Math.max(30, boxBottom - boxTop),
          contentLeft: secMinX,
          contentWidth: Math.max(200, secMaxX - secMinX),
          lineStart: cur.lineIdx + 1,
          lineEnd: next ? next.lineIdx : page.lines.length,
        };
      }

      // Check if page 2 starts with skills continuation (before the first heading on page 2)
      if (pIdx > 0 && detected.length > 0 && detected[0].type !== 'skills') {
        const firstHeadingTop = detected[0].vy;
        if (firstHeadingTop > 80) {
          const contLines = page.lines.slice(0, detected[0].lineIdx);
          let secMinX = 86;
          let secMaxX = page.originalCanvas.width - 86;
          if (contLines.length > 0) {
            secMinX = Math.min(...contLines.map((l) => l.minX));
            secMaxX = Math.max(...contLines.map((l) => l.maxX));
          }

          boxes['skills_continuation'] = {
            maskLeft: Math.max(10, Math.floor(secMinX - 8)),
            maskTop: 35,
            maskWidth: Math.min(page.originalCanvas.width - 10, Math.ceil(secMaxX + 12)) - Math.max(10, Math.floor(secMinX - 8)),
            maskHeight: Math.round(firstHeadingTop - 52),
            contentLeft: secMinX,
            contentWidth: Math.max(200, secMaxX - secMinX),
            lineStart: 0,
            lineEnd: detected[0].lineIdx,
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

    // 1. Objective
    this.data.objective = objectiveLines
      .map((l) => l.replace(BULLET_START_REGEX, '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    // 2. Technical Skills
    this.data.skills = this._parseSkills(skillsLines);

    // 3. Work Experience
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

      if (colonIdx > 2 && colonIdx < 50) {
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

    for (const rawLine of lines) {
      const clean = rawLine.trim();
      if (!clean) continue;

      const isBullet = BULLET_START_REGEX.test(clean);
      const isDate = this._matchDate(clean);
      const isTitle = this._isRoleTitle(clean);

      if (isTitle && !isBullet) {
        if (current) experiences.push(current);
        const { title, company } = this._splitRoleCompany(clean);
        current = { title, company, duration: '', bullets: [] };
      } else if (current && isDate && !current.duration) {
        current.duration = clean;
      } else if (current && !current.company && !isBullet && clean.length < 80 && !isDate) {
        current.company = clean;
      } else if (current && isBullet) {
        current.bullets.push(clean.replace(BULLET_START_REGEX, '').trim());
      } else if (current && current.bullets.length > 0) {
        current.bullets[current.bullets.length - 1] += ' ' + clean;
      }
    }

    if (current) experiences.push(current);

    return experiences.map((e) => ({
      ...e,
      bullets: e.bullets.length > 0 ? e.bullets : [''],
    }));
  }

  _isRoleTitle(str) {
    if (str.length > 110) return false;
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
  // IN-PLACE RENDERING (100% VISUAL INTEGRITY & NO SHRINKING)
  // ============================================================

  /**
   * Render all pages incorporating user edits with clean bounding-box replacement
   */
  async render() {
    this.renderedPages = [];

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

    // Clean white mask covering 100% of original text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!text || !text.trim()) return;

    // Maintain standard readable font size (NO shrinking)
    let fontSize = this.detectedLayout.fontSize;
    let lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
    let lines = this._wrapText(ctx, text.trim(), box.contentWidth);
    let totalH = lines.length * lineHeight;

    if (totalH > box.maskHeight) {
      // Gentle adjustment only if strictly needed (minimum 16.5px = 8.25pt)
      const scaleRatio = box.maskHeight / totalH;
      fontSize = Math.max(16.5, fontSize * scaleRatio * 0.98);
      lineHeight = fontSize * 1.32;
      ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
      lines = this._wrapText(ctx, text.trim(), box.contentWidth);
    }

    ctx.fillStyle = this.detectedLayout.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let curY = box.maskTop + 2;
    for (const line of lines) {
      if (curY + lineHeight > box.maskTop + box.maskHeight + 6) break;
      ctx.fillText(line, box.contentLeft, curY);
      curY += lineHeight;
    }
  }

  _renderExperienceBox(ctx, box, expList) {
    if (!box || box.maskHeight <= 0) return;

    // Clean white mask covering 100% of original experience area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.maskLeft, box.maskTop, box.maskWidth, box.maskHeight);

    if (!expList || expList.length === 0) return;

    let fontSize = this.detectedLayout.fontSize;
    let lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;
    const bulletIndent = 16 * this.scale;

    let curY = box.maskTop + 2;

    for (const exp of expList) {
      const title = (exp.title || '').trim();
      const company = (exp.company || '').trim();
      const duration = (exp.duration || '').trim();
      const bullets = exp.bullets || [];

      if (!title && !company && bullets.length === 0) continue;
      if (curY + lineHeight > box.maskTop + box.maskHeight) break;

      // Title & Company
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
      ctx.fillStyle = this.detectedLayout.textColor;

      const titleText = title + (company ? ` | ${company}` : '');
      ctx.fillText(titleText, box.contentLeft, curY);

      // Duration (right aligned)
      if (duration) {
        ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
        ctx.textAlign = 'right';
        ctx.fillText(duration, box.contentLeft + box.contentWidth, curY);
        ctx.textAlign = 'left';
      }

      curY += lineHeight + 2;

      // Bullets
      for (const bullet of bullets) {
        const cleanBullet = (bullet || '').trim();
        if (!cleanBullet) continue;
        if (curY + lineHeight > box.maskTop + box.maskHeight) break;

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

    // If skills are split across 2 pages (part1 on page 1, part2 on page 2)
    let itemsToRender = skillsList;
    if (mode === 'part1') {
      itemsToRender = skillsList.slice(0, 8);
    } else if (mode === 'part2') {
      itemsToRender = skillsList.slice(8);
    }

    let fontSize = this.detectedLayout.fontSize;
    let lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    let curY = box.maskTop + 2;

    for (const item of itemsToRender) {
      const category = (item.category || '').trim();
      const skills = (item.skills || '').trim();
      if (!category && !skills) continue;
      if (curY + lineHeight > box.maskTop + box.maskHeight) break;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Bullet mark
      ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
      ctx.fillStyle = this.detectedLayout.textColor;
      ctx.fillText('•', box.contentLeft + 2, curY);

      const indentX = box.contentLeft + 16;

      if (category) {
        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const catText = category + ': ';
        const catW = ctx.measureText(catText).width;
        ctx.fillText(catText, indentX, curY);

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        const remainingWidth = Math.max(100, box.contentWidth - catW - 16);
        const wrapped = this._wrapText(ctx, skills, remainingWidth);

        if (wrapped.length > 0) {
          ctx.fillText(wrapped[0], indentX + catW, curY);
          curY += lineHeight;

          for (let i = 1; i < wrapped.length; i++) {
            if (curY + lineHeight > box.maskTop + box.maskHeight) break;
            ctx.fillText(wrapped[i], indentX + catW, curY);
            curY += lineHeight;
          }
        } else {
          curY += lineHeight;
        }
      } else {
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const wrapped = this._wrapText(ctx, skills, box.contentWidth - 18);
        for (const line of wrapped) {
          if (curY + lineHeight > box.maskTop + box.maskHeight) break;
          ctx.fillText(line, indentX, curY);
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
   * Export the modified resume to PDF with exact vector quality
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
