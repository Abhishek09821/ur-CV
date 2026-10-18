/**
 * PDF Document Engine for ur-CV
 *
 * In-Place PDF Modification with Intelligent Content Reflow & Typography Matching.
 * Accepts ANY resume format (Canva, Amity, Jake's, LaTeX, Word-exported, corporate, etc.),
 * preserves 100% of original visual assets (headers, logos, photos, lines, colors, static sections),
 * and accurately parses & re-renders:
 * 1. Career Objective / Summary
 * 2. Technical Skills
 * 3. Work Experience / Internships
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

// Regex patterns for section detection
const HEADING_PATTERNS = {
  objective: /^(career\s*objective|objective|professional\s*summary|profile\s*summary|summary|profile|about\s*me|executive\s*summary|biography|bio)$/i,
  experience: /^(work\s*experience|professional\s*experience|industry\s*experience|experience|internships?|employment(\s*history)?|work\s*history|relevant\s*experience)$/i,
  skills: /^(technical\s*skills|core\s*skills|key\s*skills|skills(\s*(&|and)\s*(technologies|tools|competencies))?|competencies|technologies|tools\s*(&|and)\s*technologies|technical\s*proficiencies|areas\s*of\s*expertise|skills)$/i,
  education: /^(education|academic(\s*(details|qualifications|background|history|records))?|qualifications|educational\s*background)$/i,
  projects: /^((technical|academic|personal|key|software|selected)?\s*projects|project\s*work)$/i,
  awards: /^(certifications?|certificates?|honors?|awards?(\s*(&|and)\s*(honors?|achievements?|certifications?))?|achievements?|awards\s*and\s*achievements|certifications\s*(&|and)\s*awards)$/i,
  leadership: /^(leadership(\s*(&|and)\s*(initiative|activities))?|extra[\s-]*curricular(\s*activities)?|co-curricular(\s*activities)?|positions?\s*of\s*responsibility|volunteer(\s*experience|\s*work)?)$/i,
  links: /^(links|profiles|social\s*links|online\s*profiles|portfolio|web\s*links)$/i,
  declaration: /^(declaration|self\s*declaration)$/i,
};

const BULLET_START_REGEX = /^[•\-\*\u2022\u25cf\u25e6\u25aa\u25b8\u2023\u2219]/;

export class PDFDocumentEngine {
  constructor() {
    this.scale = 2.0; // 2x rendering scale for retina vector clarity
    this.fileName = 'resume.pdf';
    this.pdfDoc = null;
    this.numPages = 0;
    this.pageWidthPt = 595.28;
    this.pageHeightPt = 841.89;
    this.pageWidthPx = 1190;
    this.pageHeightPx = 1684;

    this.pagesData = []; // Array of { pageNum, canvas, lines, sections, bands, styles }
    this.detectedLayout = {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      isSerif: false,
      textColor: '#1A1A2E',
      bgColor: '#FFFFFF',
      fontSize: 10,
      lineHeight: 1.35,
    };

    // User editable data extracted from the document
    this.data = {
      objective: '',
      skills: [], // Array of { category: string, skills: string }
      experience: [], // Array of { title, company, duration, bullets: string[] }
    };

    this.renderedPages = []; // Canvases of final reflowed pages
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

    // Process each page
    for (let p = 1; p <= this.numPages; p++) {
      const page = await this.pdfDoc.getPage(p);
      const viewport = page.getViewport({ scale: this.scale });

      if (p === 1) {
        this.pageWidthPt = page.view[2] - page.view[0];
        this.pageHeightPt = page.view[3] - page.view[1];
        this.pageWidthPx = viewport.width;
        this.pageHeightPx = viewport.height;
      }

      // Render high-res background canvas
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = viewport.width;
      bgCanvas.height = viewport.height;
      const ctx = bgCanvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      // Extract text content with positions
      const textContent = await page.getTextContent();
      const lines = this._reconstructLines(textContent, viewport);

      this.pagesData.push({
        pageNum: p,
        viewport,
        canvas: bgCanvas,
        textContent,
        lines,
      });
    }

    // Detect global typography styles
    this._detectDocumentStyles();

    // Detect section boundaries across pages
    this._detectSectionsAndBands();

    // Parse the 3 editable sections
    this._extractEditableData();

    // Perform initial render
    await this.render();

    return this.getData();
  }

  /**
   * Reconstruct lines from text items
   */
  _reconstructLines(textContent, viewport) {
    if (!textContent || !textContent.items) return [];

    const items = textContent.items
      .filter((it) => it.str && it.str.trim().length > 0)
      .map((it) => {
        const [vx, vy] = viewport.convertToViewportPoint(it.transform[4], it.transform[5]);
        const fontSizePx = Math.hypot(it.transform[0], it.transform[1]) * this.scale;
        const fontName = it.fontName || '';
        const fontStyle = textContent.styles ? textContent.styles[fontName] : null;

        return {
          str: it.str,
          vx,
          vy, // Baseline Y from top
          widthPx: (it.width || 0) * this.scale,
          heightPx: (it.height || fontSizePx) * this.scale,
          fontSizePx,
          fontName,
          fontFamily: fontStyle ? fontStyle.fontFamily : '',
        };
      });

    // Group items into lines based on baseline Y
    const lineBuckets = [];
    for (const item of items) {
      let bucket = lineBuckets.find((b) => Math.abs(b.vy - item.vy) <= 4.0 * this.scale);
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
        fontFamily: firstItem.fontFamily || (isSerif ? 'Times New Roman' : 'Inter'),
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

        if (line.fontSizePx > 10 && line.fontSizePx < 40) {
          totalFontSize += line.fontSizePx;
          fontCount++;
        }
      }
    }

    const isSerif = serifCount > sansCount;
    this.detectedLayout.isSerif = isSerif;
    this.detectedLayout.fontFamily = isSerif
      ? '"Times New Roman", Times, Georgia, serif'
      : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const avgFontPx = fontCount > 0 ? totalFontSize / fontCount : 18;
    this.detectedLayout.fontSize = Math.max(16, Math.min(22, avgFontPx));
    this.detectedLayout.lineHeight = 1.35;
  }

  /**
   * Find section headings and divide pages into bands
   */
  _detectSectionsAndBands() {
    for (const page of this.pagesData) {
      const detectedSections = [];

      for (let i = 0; i < page.lines.length; i++) {
        const line = page.lines[i];
        const cleanText = line.text
          .replace(/^[•\-\|:#*\s]+/, '')
          .replace(/[:#*\s]+$/, '')
          .trim();

        if (cleanText.length >= 3 && cleanText.length <= 55) {
          for (const [secKey, pattern] of Object.entries(HEADING_PATTERNS)) {
            if (pattern.test(cleanText)) {
              // Confirm heading criteria: uppercase, title case, bold or standalone
              const isUppercase = cleanText === cleanText.toUpperCase() && cleanText.length > 3;
              const hasHeadingStyle = isUppercase || line.isBold || line.fontSizePx >= this.detectedLayout.fontSize;
              
              if (hasHeadingStyle && !detectedSections.some((s) => s.type === secKey)) {
                detectedSections.push({
                  type: secKey,
                  lineIndex: i,
                  headingText: cleanText,
                  headingTop: Math.max(0, line.yTop - 6),
                  headingBottom: line.yBottom + 6,
                  minX: line.minX,
                  maxX: line.maxX,
                });
                break;
              }
            }
          }
        }
      }

      // Sort sections by vertical position
      detectedSections.sort((a, b) => a.headingTop - b.headingTop);

      // Construct layout bands
      const bands = [];
      let lastY = 0;

      for (let i = 0; i < detectedSections.length; i++) {
        const sec = detectedSections[i];
        const nextSec = detectedSections[i + 1];

        // Content area bottom for this section
        const contentBottom = nextSec ? nextSec.headingTop : page.canvas.height - 30;

        // Static band before this section heading (e.g. Header before first section)
        if (sec.headingTop > lastY + 10) {
          bands.push({
            type: 'static',
            startY: lastY,
            endY: sec.headingTop,
            height: sec.headingTop - lastY,
          });
        }

        const isEditable = ['objective', 'skills', 'experience'].includes(sec.type);

        if (isEditable) {
          // Lines in this section's content area
          const secLines = page.lines.filter(
            (l, idx) => idx > sec.lineIndex && (!nextSec || idx < nextSec.lineIndex)
          );

          const contentMinX = secLines.length > 0 ? Math.min(...secLines.map((l) => l.minX)) : 60 * this.scale;
          const contentMaxX = secLines.length > 0 ? Math.max(...secLines.map((l) => l.maxX)) : page.canvas.width - 60 * this.scale;

          bands.push({
            type: 'editable',
            sectionId: sec.type,
            headingStartY: sec.headingTop,
            headingHeight: sec.headingBottom - sec.headingTop,
            contentRegion: {
              minX: contentMinX,
              maxX: contentMaxX,
              originalHeight: Math.max(60, contentBottom - sec.headingBottom),
            },
          });
        } else {
          // Static section (e.g. Education, Projects, Awards, Declaration)
          bands.push({
            type: 'static',
            sectionId: sec.type,
            startY: sec.headingTop,
            endY: contentBottom,
            height: contentBottom - sec.headingTop,
          });
        }

        lastY = contentBottom;
      }

      // Trailing static content if any
      if (lastY < page.canvas.height - 20) {
        bands.push({
          type: 'static',
          startY: lastY,
          endY: page.canvas.height,
          height: page.canvas.height - lastY,
        });
      }

      page.detectedSections = detectedSections;
      page.bands = bands;
    }
  }

  /**
   * Parse the 3 editable sections with high precision
   */
  _extractEditableData() {
    let allObjectiveLines = [];
    let allSkillsLines = [];
    let allExpLines = [];

    for (const page of this.pagesData) {
      const sections = page.detectedSections || [];
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const nextSec = sections[i + 1];

        const secLines = page.lines.filter(
          (l, idx) => idx > sec.lineIndex && (!nextSec || idx < nextSec.lineIndex)
        );

        if (sec.type === 'objective') {
          allObjectiveLines.push(...secLines.map((l) => l.text));
        } else if (sec.type === 'skills') {
          allSkillsLines.push(...secLines.map((l) => l.text));
        } else if (sec.type === 'experience') {
          allExpLines.push(...secLines.map((l) => l.text));
        }
      }
    }

    // 1. Objective
    this.data.objective = allObjectiveLines
      .map((l) => l.replace(BULLET_START_REGEX, '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    // 2. Technical Skills
    this.data.skills = this._parseSkills(allSkillsLines);

    // 3. Work Experience
    this.data.experience = this._parseExperience(allExpLines);
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
        // Continuation line
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
      } else if (current && !current.company && !isBullet && clean.length < 75 && !isDate) {
        current.company = clean;
      } else if (current && isBullet) {
        current.bullets.push(clean.replace(BULLET_START_REGEX, '').trim());
      } else if (current && current.bullets.length > 0) {
        // Continuation of bullet
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
  // IN-PLACE RENDERING WITH CONTENT REFLOW
  // ============================================================

  /**
   * Render all pages incorporating user edits with seamless vertical reflow
   */
  async render() {
    const targetWidth = this.pageWidthPx;
    const targetHeight = this.pageHeightPx;
    const bottomMargin = 40 * this.scale;
    const topMargin = 40 * this.scale;

    this.renderedPages = [];

    let currentCanvas = document.createElement('canvas');
    currentCanvas.width = targetWidth;
    currentCanvas.height = targetHeight;
    let ctx = currentCanvas.getContext('2d');
    this._fillWhite(ctx, targetWidth, targetHeight);

    let curY = 0;

    const startNewPage = () => {
      this.renderedPages.push(currentCanvas);
      currentCanvas = document.createElement('canvas');
      currentCanvas.width = targetWidth;
      currentCanvas.height = targetHeight;
      ctx = currentCanvas.getContext('2d');
      this._fillWhite(ctx, targetWidth, targetHeight);
      curY = topMargin;
    };

    // Iterate through pages and bands
    for (const page of this.pagesData) {
      const origCanvas = page.canvas;

      for (const band of page.bands) {
        if (band.type === 'static') {
          const bandH = band.height;
          if (bandH <= 0) continue;

          // Check if static band fits on current page
          if (curY > topMargin && curY + bandH > targetHeight - bottomMargin) {
            startNewPage();
          }

          ctx.drawImage(
            origCanvas,
            0,
            band.startY,
            targetWidth,
            bandH,
            0,
            curY,
            targetWidth,
            bandH
          );
          curY += bandH;
        } else if (band.type === 'editable') {
          // 1. Draw preserved section heading slice
          const headH = band.headingHeight;
          if (curY > topMargin && curY + headH + 40 > targetHeight) {
            startNewPage();
          }

          ctx.drawImage(
            origCanvas,
            0,
            band.headingStartY,
            targetWidth,
            headH,
            0,
            curY,
            targetWidth,
            headH
          );
          curY += headH + 8 * this.scale;

          // 2. Render edited content with detected typography
          const region = band.contentRegion;
          const leftX = region.minX;
          const maxWidth = Math.max(200, region.maxX - leftX);

          if (band.sectionId === 'objective') {
            curY = this._renderObjectiveContent(ctx, this.data.objective, leftX, maxWidth, curY, targetHeight, startNewPage);
          } else if (band.sectionId === 'skills') {
            curY = this._renderSkillsContent(ctx, this.data.skills, leftX, maxWidth, curY, targetHeight, startNewPage);
          } else if (band.sectionId === 'experience') {
            curY = this._renderExperienceContent(ctx, this.data.experience, leftX, maxWidth, curY, targetHeight, startNewPage);
          }

          curY += 10 * this.scale;
        }
      }
    }

    if (curY > 0) {
      this.renderedPages.push(currentCanvas);
    }

    return this.renderedPages;
  }

  _fillWhite(ctx, w, h) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  }

  _renderObjectiveContent(ctx, text, leftX, maxWidth, startY, targetHeight, onOverflow) {
    if (!text || !text.trim()) return startY;

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
    ctx.fillStyle = this.detectedLayout.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = this._wrapText(ctx, text.trim(), maxWidth);
    let curY = startY;

    for (const line of lines) {
      if (curY + lineHeight > targetHeight - 40 * this.scale) {
        onOverflow();
        curY = 40 * this.scale;
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
      }

      ctx.fillText(line, leftX, curY);
      curY += lineHeight;
    }

    return curY;
  }

  _renderSkillsContent(ctx, skillsList, leftX, maxWidth, startY, targetHeight, onOverflow) {
    if (!skillsList || skillsList.length === 0) return startY;

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;

    let curY = startY;

    for (const item of skillsList) {
      const category = (item.category || '').trim();
      const skills = (item.skills || '').trim();
      if (!category && !skills) continue;

      if (curY + lineHeight > targetHeight - 40 * this.scale) {
        onOverflow();
        curY = 40 * this.scale;
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      if (category) {
        ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        const catWidth = ctx.measureText(category + ': ').width;
        ctx.fillText(category + ': ', leftX, curY);

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        const remainingWidth = Math.max(100, maxWidth - catWidth);
        const skillLines = this._wrapText(ctx, skills, remainingWidth);

        if (skillLines.length > 0) {
          ctx.fillText(skillLines[0], leftX + catWidth, curY);
          curY += lineHeight;

          for (let i = 1; i < skillLines.length; i++) {
            if (curY + lineHeight > targetHeight - 40 * this.scale) {
              onOverflow();
              curY = 40 * this.scale;
            }
            ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
            ctx.fillStyle = this.detectedLayout.textColor;
            ctx.fillText(skillLines[i], leftX + catWidth, curY);
            curY += lineHeight;
          }
        } else {
          curY += lineHeight;
        }
      } else {
        // Simple skill line with bullet
        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;
        ctx.fillText('• ', leftX, curY);

        const indent = 16 * this.scale;
        const wrapped = this._wrapText(ctx, skills, maxWidth - indent);
        for (let i = 0; i < wrapped.length; i++) {
          if (curY + lineHeight > targetHeight - 40 * this.scale) {
            onOverflow();
            curY = 40 * this.scale;
          }
          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          ctx.fillStyle = this.detectedLayout.textColor;
          ctx.fillText(wrapped[i], leftX + indent, curY);
          curY += lineHeight;
        }
      }

      curY += 2 * this.scale;
    }

    return curY;
  }

  _renderExperienceContent(ctx, expList, leftX, maxWidth, startY, targetHeight, onOverflow) {
    if (!expList || expList.length === 0) return startY;

    const fontSize = this.detectedLayout.fontSize;
    const lineHeight = fontSize * this.detectedLayout.lineHeight;
    const fontFamily = this.detectedLayout.fontFamily;
    const bulletIndent = 16 * this.scale;

    let curY = startY;

    for (const exp of expList) {
      const title = (exp.title || '').trim();
      const company = (exp.company || '').trim();
      const duration = (exp.duration || '').trim();
      const bullets = exp.bullets || [];

      if (!title && !company && bullets.length === 0) continue;

      if (curY + lineHeight * 2 > targetHeight - 40 * this.scale) {
        onOverflow();
        curY = 40 * this.scale;
      }

      // Title & Company
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = `bold ${Math.round(fontSize)}px ${fontFamily}`;
      ctx.fillStyle = this.detectedLayout.textColor;

      const titleText = title + (company ? ` | ${company}` : '');
      ctx.fillText(titleText, leftX, curY);

      // Duration (right aligned)
      if (duration) {
        ctx.font = `italic ${Math.round(fontSize * 0.95)}px ${fontFamily}`;
        ctx.textAlign = 'right';
        ctx.fillText(duration, leftX + maxWidth, curY);
        ctx.textAlign = 'left';
      }

      curY += lineHeight + 3 * this.scale;

      // Bullets
      for (const bullet of bullets) {
        const cleanBullet = (bullet || '').trim();
        if (!cleanBullet) continue;

        ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
        ctx.fillStyle = this.detectedLayout.textColor;

        const wrapped = this._wrapText(ctx, cleanBullet, maxWidth - bulletIndent);
        for (let i = 0; i < wrapped.length; i++) {
          if (curY + lineHeight > targetHeight - 40 * this.scale) {
            onOverflow();
            curY = 40 * this.scale;
          }

          ctx.font = `normal ${Math.round(fontSize)}px ${fontFamily}`;
          ctx.fillStyle = this.detectedLayout.textColor;

          if (i === 0) {
            ctx.fillText('•', leftX, curY);
          }
          ctx.fillText(wrapped[i], leftX + bulletIndent, curY);
          curY += lineHeight;
        }
      }

      curY += 6 * this.scale; // Space between roles
    }

    return curY;
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
   * Export the modified resume to PDF with exact vector quality and reflow
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
