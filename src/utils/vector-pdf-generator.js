/**
 * Vector PDF Generator for Amity Placement Resume & Jake's Resume
 * 
 * Features:
 * - 100% Searchable, Selectable Vector Text (Times New Roman)
 * - Zero Cutoff: Symmetrical margins (Left: 56pt, Right: 56.28pt, Width: 483pt on 595.28pt A4)
 * - High-Resolution Visuals: Official Amity shield logo + candidate photo with sharp borders
 * - Exact Amity Placement Styling: #2C2E30 charcoal bars, white bold headings, justified typography
 * - Equal Upper & Lower Spacing: Section bars have strictly equal top and bottom gaps
 * - Interactive Vector Links: Clickable email mailto and professional profile links
 * - Multi-Page Smart Pagination: Prevents orphaned headings and splits cleanly across A4 pages
 * - Jake's Single-Page Layout: Overleaf/LaTeX style with equal title and horizontal rule margins
 */

import { jsPDF } from 'jspdf';
import { AMITY_OFFICIAL_LOGO_DATA_URL } from '../assets/amity-assets.js';
import { parseEducationItem } from '../views/jakes-preview.js';

export function generateVectorPDF(data) {
  if (data && data.template === 'jakes') {
    return generateJakesVectorPDF(data);
  }
  return generateAmityVectorPDF(data);
}

/**
 * Official Amity University Placement Resume Vector PDF
 */
function generateAmityVectorPDF(data) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const X_LEFT = 56;
  const CONTENT_WIDTH = 483;
  const PAGE_BOTTOM = 804;
  const TOP_MARGIN_P2 = 42;

  let curY = 36;
  let lastContentBottomY = 36;
  let isFirstSection = true;

  const BAR_MARGIN = 5.5; // Strictly equal 5.5pt gap above and below the charcoal section bar
  const BAR_HEIGHT = 13.0; // Bar height matching preview padding and line-height

  function checkBreak(neededHeight) {
    if (curY + neededHeight > PAGE_BOTTOM) {
      doc.addPage();
      curY = TOP_MARGIN_P2;
      lastContentBottomY = TOP_MARGIN_P2;
      return true;
    }
    return false;
  }

  function renderSectionBar(title) {
    if (checkBreak(BAR_HEIGHT + BAR_MARGIN * 2 + 18)) {
      const barY = TOP_MARGIN_P2;
      doc.setFillColor(44, 46, 48); // Official Amity #2C2E30 charcoal bar
      doc.rect(X_LEFT, barY, CONTENT_WIDTH, BAR_HEIGHT, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), X_LEFT + 4, barY + 9.5);
      // Space BELOW bar: strictly BAR_MARGIN (5.5pt) to top of text (baseline = barBottom + BAR_MARGIN + 7.2)
      curY = barY + BAR_HEIGHT + BAR_MARGIN + 7.2;
      lastContentBottomY = curY + 2.2;
      return;
    }

    // Space ABOVE bar: strictly BAR_MARGIN (5.5pt) from visual bottom of preceding text
    const barY = isFirstSection ? lastContentBottomY + 7.0 : lastContentBottomY + BAR_MARGIN;
    isFirstSection = false;

    doc.setFillColor(44, 46, 48); // Official Amity #2C2E30 charcoal bar
    doc.rect(X_LEFT, barY, CONTENT_WIDTH, BAR_HEIGHT, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), X_LEFT + 4, barY + 9.5);

    // Space BELOW bar: strictly BAR_MARGIN (5.5pt) to top of text (baseline = barBottom + BAR_MARGIN + 7.2)
    curY = barY + BAR_HEIGHT + BAR_MARGIN + 7.2;
    lastContentBottomY = curY + 2.2;
  }

  function measureTokens(tokens, maxWidth) {
    const words = [];
    tokens.forEach((tok) => {
      const isBold = !!tok.bold;
      const isItalic = !!tok.italic;
      const fontStyle = isBold && isItalic ? 'bolditalic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal';
      doc.setFont('times', fontStyle);
      doc.setFontSize(tok.fontSize || 9.5);
      const rawWords = String(tok.text || '').split(/(\s+)/);
      rawWords.forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) {
          if (words.length > 0) words[words.length - 1].hasTrailingSpace = true;
        } else {
          const defaultSpace = Math.max(doc.getTextWidth(' '), (tok.fontSize || 9.5) * 0.32);
          words.push({
            word: w,
            fontStyle,
            fontSize: tok.fontSize || 9.5,
            color: tok.color || [0, 0, 0],
            link: tok.link || null,
            width: doc.getTextWidth(w),
            spaceWidth: defaultSpace,
          });
        }
      });
    });

    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;
    words.forEach((w) => {
      const addedWidth = (currentLine.length > 0 ? currentLine[currentLine.length - 1].spaceWidth : 0) + w.width;
      if (currentLine.length > 0 && currentLineWidth + addedWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = [w];
        currentLineWidth = w.width;
      } else {
        currentLine.push(w);
        currentLineWidth += addedWidth;
      }
    });
    if (currentLine.length > 0) lines.push(currentLine);
    return lines;
  }

  function drawLines(lines, startX, maxWidth, lineHeight, options = {}) {
    lines.forEach((line, lineIdx) => {
      const isLastLine = lineIdx === lines.length - 1;
      let curX = startX;
      let extraSpace = 0;
      if (options.justify && !isLastLine && line.length > 1) {
        let totalWordsW = 0;
        line.forEach((item) => (totalWordsW += item.width));
        const slots = line.length - 1;
        const remainingW = maxWidth - totalWordsW;
        extraSpace = remainingW / slots - line[0].spaceWidth;
        if (extraSpace < 0) extraSpace = 0;
      }

      line.forEach((item, itemIdx) => {
        doc.setFont('times', item.fontStyle);
        doc.setFontSize(item.fontSize);
        doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        doc.text(item.word, curX, curY);

        if (item.link) {
          doc.link(curX, curY - item.fontSize + 1, item.width, item.fontSize + 1, { url: item.link });
          doc.setDrawColor(item.color[0], item.color[1], item.color[2]);
          doc.setLineWidth(0.5);
          doc.line(curX, curY + 1, curX + item.width, curY + 1);
        }

        const isPipe = item.word === '|' || (line[itemIdx + 1] && line[itemIdx + 1].word === '|');
        const defaultSpace = Math.max(item.spaceWidth, item.fontSize * 0.32);
        const baseSpace = isPipe ? item.fontSize * 0.55 : defaultSpace;
        const sp = baseSpace + (options.justify && !isLastLine ? extraSpace : 0);
        curX += item.width + (itemIdx < line.length - 1 ? sp : 0);
      });

      lastContentBottomY = curY + 2.2;

      if (lineIdx < lines.length - 1) {
        curY += lineHeight;
      }
    });
  }

  function renderParagraph(tokens, startX, maxWidth, lineHeight, options = {}) {
    const lines = measureTokens(tokens, maxWidth);
    checkBreak(lines.length * lineHeight + 4);
    drawLines(lines, startX, maxWidth, lineHeight, options);
    curY += lineHeight;
  }

  function renderBullet(tokens, options = {}) {
    const bulletX = X_LEFT + 15;
    const textX = X_LEFT + 25;
    const maxWidth = CONTENT_WIDTH - 25;
    const lineHeight = 11.5;

    const lines = measureTokens(tokens, maxWidth);
    checkBreak(lines.length * lineHeight + 4);

    // Draw bullet symbol at first line baseline
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    doc.text('•', bulletX, curY);

    drawLines(lines, textX, maxWidth, lineHeight, options);
    curY += lineHeight + 1.5; // advance past bullet for next bullet item
  }

  // ================= 1. HEADER =================
  const p = data.personal || {};

  // Amity Logo on Left (matches photo dimensions: 60 x 69 pt)
  const logoW = 60;
  const logoH = 69;
  try {
    if (AMITY_OFFICIAL_LOGO_DATA_URL) {
      doc.addImage(AMITY_OFFICIAL_LOGO_DATA_URL, 'JPEG', X_LEFT, curY, logoW, logoH);
    }
  } catch (e) {
    console.warn('Amity logo add warning:', e);
  }

  // Photo on Right (Enforces strict 1MB size limit checked at upload)
  const photoW = 60;
  const photoH = 69;
  const photoX = X_LEFT + CONTENT_WIDTH - photoW;
  if (p.photo) {
    try {
      const format = p.photo.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(p.photo, format, photoX, curY, photoW, photoH);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.75);
      doc.rect(photoX, curY, photoW, photoH, 'S');
    } catch (e) {
      console.warn('Photo add warning:', e);
    }
  } else {
    doc.setDrawColor(180, 180, 180);
    doc.rect(photoX, curY, photoW, photoH, 'S');
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('PHOTO', photoX + photoW / 2, curY + photoH / 2, { align: 'center' });
  }

  // Centered Candidate Details
  const centerX = PAGE_WIDTH / 2;
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text((p.fullName || '').toUpperCase(), centerX, curY + 16, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  let contactY = curY + 30;

  if (p.address) {
    const addrTokens = [
      { text: 'Address: ', bold: true, fontSize: 9 },
      { text: p.address, bold: false, fontSize: 9 },
    ];
    const addrLines = measureTokens(addrTokens, 360);
    addrLines.forEach((l) => {
      let lineW = 0;
      l.forEach((w) => (lineW += w.width + w.spaceWidth));
      lineW -= l[l.length - 1].spaceWidth;
      let startX = centerX - lineW / 2;
      l.forEach((item) => {
        doc.setFont('times', item.fontStyle);
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(item.word, startX, contactY);
        startX += item.width + item.spaceWidth;
      });
      contactY += 11;
    });
  }

  if (p.phone) {
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    const prefixW = doc.getTextWidth('Phone: ');
    doc.setFont('times', 'normal');
    const valW = doc.getTextWidth(p.phone);
    const totalW = prefixW + valW;
    const startX = centerX - totalW / 2;

    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Phone: ', startX, contactY);

    doc.setFont('times', 'normal');
    doc.text(p.phone, startX + prefixW, contactY);
    contactY += 11;
  }

  if (p.email) {
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    const prefixW = doc.getTextWidth('Email: ');
    doc.setFont('times', 'normal');
    const emailW = doc.getTextWidth(p.email);
    const totalW = prefixW + emailW;
    const startX = centerX - totalW / 2;

    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Email: ', startX, contactY);

    doc.setFont('times', 'normal');
    doc.setTextColor(0, 68, 204);
    doc.text(p.email, startX + prefixW, contactY);

    doc.link(startX + prefixW, contactY - 8, emailW, 10, { url: 'mailto:' + p.email });
    doc.setDrawColor(0, 68, 204);
    doc.setLineWidth(0.5);
    doc.line(startX + prefixW, contactY + 1, startX + prefixW + emailW, contactY + 1);
  }

  curY = Math.max(curY + photoH + 8, contactY + 10);
  lastContentBottomY = curY;

  // ================= 2. CAREER OBJECTIVE =================
  if (data.objective) {
    renderSectionBar('CAREER OBJECTIVE');
    renderParagraph([{ text: data.objective }], X_LEFT, CONTENT_WIDTH, 11.5, { justify: true });
  }

  // ================= 3. ACADEMIC DETAILS =================
  if (data.academic && data.academic.length > 0) {
    renderSectionBar('ACADEMIC DETAILS');
    data.academic.forEach((item) => {
      const text = typeof item === 'object' && item !== null
        ? [item.institution, item.details].filter(Boolean).join(' | ')
        : String(item);
      const clean = text.replace(/^[•\-\*]\s*/, '');
      if (clean.trim()) {
        renderBullet([{ text: clean }], { justify: false });
      }
    });
  }

  // ================= 4. EXPERIENCE =================
  if (data.experience && data.experience.length > 0) {
    renderSectionBar('EXPERIENCE');
    data.experience.forEach((exp, idx) => {
      checkBreak(32);
      // Title | Company
      const titleCompany = (exp.title || '') + (exp.company ? ' | ' + exp.company : '');
      if (titleCompany.trim()) {
        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text(titleCompany, X_LEFT, curY);
        lastContentBottomY = curY + 2.2;
        curY += 11.5;
      }

      // Duration in italics
      if (exp.duration && exp.duration.trim()) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.duration, X_LEFT, curY);
        lastContentBottomY = curY + 2.2;
        curY += 11.5;
      }

      // Bullets
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.filter(Boolean).forEach((b) => {
          if (b.trim()) {
            renderBullet([{ text: b }], { justify: true });
          }
        });
      }
      if (idx < data.experience.length - 1) curY += 2;
    });
  }

  // ================= 5. PROJECTS =================
  if (data.projects && data.projects.length > 0) {
    renderSectionBar('PROJECTS');
    data.projects.forEach((proj, idx) => {
      checkBreak(32);
      // Project name
      if (proj.name && proj.name.trim()) {
        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text(proj.name, X_LEFT, curY);
        lastContentBottomY = curY + 2.2;
        curY += 11.5;
      }

      // Tech Stack
      if (proj.techStack && proj.techStack.trim()) {
        renderParagraph(
          [
            { text: 'Tech Stack: ', bold: true },
            { text: proj.techStack, bold: false },
          ],
          X_LEFT,
          CONTENT_WIDTH,
          11
        );
      }

      // Bullets
      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.filter(Boolean).forEach((b) => {
          if (b.trim()) {
            renderBullet([{ text: b }], { justify: true });
          }
        });
      }
      if (idx < data.projects.length - 1) curY += 2;
    });
  }

  // ================= 6. TECHNICAL SKILLS =================
  if (data.skills && data.skills.length > 0) {
    renderSectionBar('TECHNICAL SKILLS');
    data.skills.forEach((s) => {
      if ((s.category && s.category.trim()) || (s.skills && s.skills.trim())) {
        renderBullet(
          [
            { text: (s.category || '') + ': ', bold: true },
            { text: s.skills || '', bold: false },
          ],
          { justify: true }
        );
      }
    });
  }

  // ================= 7. AWARDS AND ACHIEVEMENTS =================
  if (data.awards && data.awards.length > 0) {
    renderSectionBar('AWARDS AND ACHIEVEMENTS');
    data.awards.forEach((item) => {
      const clean = String(item).replace(/^[•\-\*]\s*/, '');
      if (clean.trim()) {
        renderBullet([{ text: clean }], { justify: true });
      }
    });
  }

  // ================= 8. LEADERSHIP & INITIATIVE =================
  if (data.leadership && data.leadership.length > 0) {
    renderSectionBar('LEADERSHIP & INITIATIVE');
    data.leadership.forEach((item) => {
      const tokens = [];
      if (item.title && item.title.trim()) tokens.push({ text: item.title + ': ', bold: true });
      if (item.description && item.description.trim()) tokens.push({ text: item.description, bold: false });
      if (tokens.length > 0) {
        renderBullet(tokens, { justify: true });
      }
    });
  }

  // ================= 9. LINKS =================
  if (data.links && data.links.length > 0) {
    renderSectionBar('LINKS');
    data.links.forEach((l) => {
      if (l.url && l.url.trim()) {
        renderBullet(
          [
            { text: l.label || l.url, link: l.url, color: [0, 68, 204] },
          ],
          { justify: false }
        );
      }
    });
  }

  // ================= 10. SELF DECLARATION =================
  const decl = data.declaration || {};
  if (decl.text && decl.text.trim()) {
    renderSectionBar('SELF DECLARATION');
    renderParagraph([{ text: decl.text }], X_LEFT, CONTENT_WIDTH, 11.5, { justify: true });
    curY += 8;

    // Footer with Date/Place (left), vertical bar, Candidate Name (right)
    checkBreak(40);
    const footerStartY = curY;
    let leftY = footerStartY;

    if (decl.date) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      const labelW = doc.getTextWidth('Date: ');
      doc.text('Date: ', X_LEFT, leftY);
      doc.setFont('times', 'normal');
      doc.text(decl.date, X_LEFT + labelW + 2, leftY);
      leftY += 12;
    }
    if (decl.place) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      const labelW = doc.getTextWidth('Place: ');
      doc.text('Place: ', X_LEFT, leftY);
      doc.setFont('times', 'normal');
      doc.text(decl.place, X_LEFT + labelW + 2, leftY);
      leftY += 12;
    }

    // Divider bar
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.75);
    doc.line(PAGE_WIDTH / 2, footerStartY - 8, PAGE_WIDTH / 2, Math.max(leftY, footerStartY + 18));

    // Right Candidate Name
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    const candName = p.fullName || '';
    if (candName) {
      doc.text(candName, X_LEFT + CONTENT_WIDTH, footerStartY + 6, { align: 'right' });
    }
  }

  return doc;
}

/**
 * Jake's Resume Vector PDF Generator
 * Replicates Overleaf / LaTeX Software Engineer Single-Page Standard
 */
function generateJakesVectorPDF(data) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const X_LEFT = 42;
  const CONTENT_WIDTH = 511.28;
  const PAGE_BOTTOM = 812;
  const TOP_MARGIN_P2 = 36;

  let curY = 36;
  let lastContentBottomY = 36;
  let isFirstSection = true;

  const SECTION_MARGIN = 3.5; // Strictly equal 3.5pt gap above title and below horizontal rule

  function checkBreak(neededHeight) {
    if (curY + neededHeight > PAGE_BOTTOM) {
      doc.addPage();
      curY = TOP_MARGIN_P2;
      lastContentBottomY = TOP_MARGIN_P2;
      return true;
    }
    return false;
  }

  function renderJakesSectionHeader(title) {
    if (checkBreak(22)) {
      const titleY = TOP_MARGIN_P2 + 7.2;
      doc.setFont('times', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), X_LEFT, titleY);
      const lineY = titleY + 2.0;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.65);
      doc.line(X_LEFT, lineY, X_LEFT + CONTENT_WIDTH, lineY);
      curY = lineY + SECTION_MARGIN + 6.8;
      lastContentBottomY = curY + 2.0;
      return;
    }

    // Space ABOVE title: strictly equal to SECTION_MARGIN from bottom of previous content
    const titleY = (isFirstSection ? curY : lastContentBottomY + SECTION_MARGIN) + 7.2;
    isFirstSection = false;

    doc.setFont('times', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), X_LEFT, titleY);

    const lineY = titleY + 2.0;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.65);
    doc.line(X_LEFT, lineY, X_LEFT + CONTENT_WIDTH, lineY);

    // Space BELOW horizontal rule: strictly equal to SECTION_MARGIN to top of text (baseline = lineY + SECTION_MARGIN + 6.8)
    curY = lineY + SECTION_MARGIN + 6.8;
    lastContentBottomY = curY + 2.0;
  }

  function measureTokens(tokens, maxWidth) {
    const words = [];
    tokens.forEach((tok) => {
      const isBold = !!tok.bold;
      const isItalic = !!tok.italic;
      const fontStyle = isBold && isItalic ? 'bolditalic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal';
      doc.setFont('times', fontStyle);
      doc.setFontSize(tok.fontSize || 9.0);
      const rawWords = String(tok.text || '').split(/(\s+)/);
      rawWords.forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) {
          if (words.length > 0) words[words.length - 1].hasTrailingSpace = true;
        } else {
          const defaultSpace = Math.max(doc.getTextWidth(' '), (tok.fontSize || 9.0) * 0.32);
          words.push({
            word: w,
            fontStyle,
            fontSize: tok.fontSize || 9.0,
            color: tok.color || [0, 0, 0],
            link: tok.link || null,
            width: doc.getTextWidth(w),
            spaceWidth: defaultSpace,
          });
        }
      });
    });

    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;
    words.forEach((w) => {
      const addedWidth = (currentLine.length > 0 ? currentLine[currentLine.length - 1].spaceWidth : 0) + w.width;
      if (currentLine.length > 0 && currentLineWidth + addedWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = [w];
        currentLineWidth = w.width;
      } else {
        currentLine.push(w);
        currentLineWidth += addedWidth;
      }
    });
    if (currentLine.length > 0) lines.push(currentLine);
    return lines;
  }

  function drawLines(lines, startX, maxWidth, lineHeight, options = {}) {
    lines.forEach((line, lineIdx) => {
      const isLastLine = lineIdx === lines.length - 1;
      let curX = startX;
      let extraSpace = 0;
      if (options.justify && !isLastLine && line.length > 1) {
        let totalWordsW = 0;
        line.forEach((item) => (totalWordsW += item.width));
        const slots = line.length - 1;
        const remainingW = maxWidth - totalWordsW;
        extraSpace = remainingW / slots - line[0].spaceWidth;
        if (extraSpace < 0) extraSpace = 0;
      }

      line.forEach((item, itemIdx) => {
        doc.setFont('times', item.fontStyle);
        doc.setFontSize(item.fontSize);
        doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        doc.text(item.word, curX, curY);

        if (item.link) {
          doc.link(curX, curY - item.fontSize + 1, item.width, item.fontSize + 1, { url: item.link });
        }

        const isPipeSep = item.word === '|' || (line[itemIdx + 1] && line[itemIdx + 1].word === '|');
        const baseSpace = isPipeSep ? item.spaceWidth * 1.8 : item.spaceWidth;
        const sp = baseSpace + (options.justify && !isLastLine ? extraSpace : 0);
        curX += item.width + (itemIdx < line.length - 1 ? sp : 0);
      });

      lastContentBottomY = curY + 2.0;

      if (lineIdx < lines.length - 1) {
        curY += lineHeight;
      }
    });
  }

  function renderParagraph(tokens, startX, maxWidth, lineHeight, options = {}) {
    const lines = measureTokens(tokens, maxWidth);
    checkBreak(lines.length * lineHeight + 3);
    drawLines(lines, startX, maxWidth, lineHeight, options);
    curY += lineHeight;
  }

  function renderBullet(tokens, options = {}) {
    const bulletX = X_LEFT + 8;
    const textX = X_LEFT + 18;
    const maxWidth = CONTENT_WIDTH - 18;
    const lineHeight = 11.0;

    const lines = measureTokens(tokens, maxWidth);
    checkBreak(lines.length * lineHeight + 3);

    doc.setFont('times', 'normal');
    doc.setFontSize(9.0);
    doc.setTextColor(0, 0, 0);
    doc.text('•', bulletX, curY);

    drawLines(lines, textX, maxWidth, lineHeight, options);
    curY += lineHeight + 0.8;
  }

  // ================= 1. HEADER =================
  const p = data.personal || {};
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  const candName = p.fullName || '';
  if (candName) {
    doc.text(candName, PAGE_WIDTH / 2, curY, { align: 'center' });
    curY += 12;
  }

  // Contact line: Address | Phone | Email
  const contactParts = [];
  if (p.address) contactParts.push(p.address);
  if (p.phone) contactParts.push(p.phone);
  if (p.email) contactParts.push(p.email);

  if (contactParts.length > 0) {
    doc.setFont('times', 'normal');
    doc.setFontSize(9.0);
    doc.setTextColor(0, 0, 0);
    const contactStr = contactParts.join(' | ');
    doc.text(contactStr, PAGE_WIDTH / 2, curY, { align: 'center' });
    curY += 10.5;
  }

  // Links line: GitHub | LinkedIn | LeetCode
  const links = data.links || [];
  if (links.length > 0) {
    const linkTokens = [];
    links.forEach((l, idx) => {
      linkTokens.push({ text: l.label || l.url, link: l.url, color: [0, 0, 0], fontSize: 9.0 });
      if (idx < links.length - 1) {
        linkTokens.push({ text: ' | ', color: [0, 0, 0], fontSize: 9.0 });
      }
    });

    let totalW = 0;
    linkTokens.forEach((t) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(9.0);
      totalW += doc.getTextWidth(t.text);
    });
    let linkCurX = (PAGE_WIDTH - totalW) / 2;
    linkTokens.forEach((t) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(9.0);
      doc.setTextColor(t.color[0], t.color[1], t.color[2]);
      doc.text(t.text, linkCurX, curY);
      const w = doc.getTextWidth(t.text);
      if (t.link) {
        doc.link(linkCurX, curY - 7.5, w, 8.5, { url: t.link });
      }
      linkCurX += w;
    });
    curY += 10.5;
  }
  lastContentBottomY = curY - 10.5 + 2.0;

  // ================= 2. PROFESSIONAL SUMMARY =================
  if (data.objective) {
    renderJakesSectionHeader('PROFESSIONAL SUMMARY');
    renderParagraph(
      [{ text: data.objective, fontSize: 9.0 }],
      X_LEFT,
      CONTENT_WIDTH,
      11.0,
      { justify: true }
    );
  }

  // ================= 3. EDUCATION =================
  const academic = data.academic || [];
  if (academic.length > 0) {
    renderJakesSectionHeader('EDUCATION');
    academic.forEach((raw) => {
      const item = parseEducationItem(raw);
      const tokens = [
        { text: item.institution + (item.details ? ' ' : ''), bold: true, fontSize: 9.0 },
      ];
      if (item.details) {
        tokens.push({ text: item.details, fontSize: 9.0 });
      }
      renderParagraph(tokens, X_LEFT, CONTENT_WIDTH, 11.0, { justify: true });
    });
  }

  // ================= 4. PROFESSIONAL EXPERIENCE =================
  const experience = data.experience || [];
  if (experience.length > 0) {
    renderJakesSectionHeader('PROFESSIONAL EXPERIENCE');
    experience.forEach((exp, idx) => {
      checkBreak(24);
      const titleTokens = [
        { text: exp.title || '', bold: true, fontSize: 9.5 },
      ];
      if (exp.company) {
        const cleanComp = String(exp.company).replace(/^[\|\s–—\-]+/, '');
        titleTokens.push({ text: ' | ' + cleanComp, fontSize: 9.0 });
      }

      if (exp.duration) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.0);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.duration, X_LEFT + CONTENT_WIDTH, curY, { align: 'right' });
      }

      const durWidth = exp.duration ? doc.getTextWidth(exp.duration) + 12 : 0;
      renderParagraph(titleTokens, X_LEFT, CONTENT_WIDTH - durWidth, 11.0, { justify: false });

      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.filter(Boolean).forEach((b) => {
          const cleanB = String(b).replace(/^[•\-\*]\s*/, '');
          renderBullet([{ text: cleanB, fontSize: 9.0 }], { justify: true });
        });
      }
      if (idx < experience.length - 1) curY += 1.5;
    });
  }

  // ================= 5. PROJECTS =================
  const projects = data.projects || [];
  if (projects.length > 0) {
    renderJakesSectionHeader('PROJECTS');
    projects.forEach((proj, idx) => {
      checkBreak(24);
      const projTokens = [
        { text: proj.name || '', bold: true, fontSize: 9.5 },
      ];
      if (proj.techStack) {
        const cleanStack = String(proj.techStack).replace(/^[\|\s–—\-]+/, '');
        projTokens.push({ text: ' | ' + cleanStack, fontSize: 9.0 });
      }

      renderParagraph(projTokens, X_LEFT, CONTENT_WIDTH, 11.0, { justify: false });

      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.filter(Boolean).forEach((b) => {
          const cleanB = String(b).replace(/^[•\-\*]\s*/, '');
          renderBullet([{ text: cleanB, fontSize: 9.0 }], { justify: true });
        });
      }
      if (idx < projects.length - 1) curY += 1.5;
    });
  }

  // ================= 6. TECHNICAL SKILLS =================
  const skills = data.skills || [];
  if (skills.length > 0) {
    renderJakesSectionHeader('TECHNICAL SKILLS');
    skills.forEach((s) => {
      const tokens = [
        { text: (s.category || '') + ': ', bold: true, fontSize: 9.0 },
        { text: s.skills || '', fontSize: 9.0 },
      ];
      renderParagraph(tokens, X_LEFT, CONTENT_WIDTH, 11.0, { justify: true });
    });
  }

  // ================= 7. CERTIFICATIONS & ACHIEVEMENTS =================
  const awards = data.awards || [];
  const achievements = data.achievements || [];
  const leadership = data.leadership || [];
  if (awards.length > 0 || achievements.length > 0 || leadership.length > 0) {
    renderJakesSectionHeader('CERTIFICATIONS & ACHIEVEMENTS');
    if (awards.length > 0) {
      const certText = awards.map((a) => String(a).replace(/^[•\-\*]\s*/, '')).join('; ') + '.';
      renderParagraph(
        [
          { text: 'Certifications: ', bold: true, fontSize: 9.0 },
          { text: certText, fontSize: 9.0 },
        ],
        X_LEFT,
        CONTENT_WIDTH,
        11.0,
        { justify: true }
      );
    }
    if (achievements.length > 0) {
      const achText = achievements.map((a) => String(a).replace(/^[•\-\*]\s*/, '')).join('; ') + '.';
      renderParagraph(
        [
          { text: 'Achievements: ', bold: true, fontSize: 9.0 },
          { text: achText, fontSize: 9.0 },
        ],
        X_LEFT,
        CONTENT_WIDTH,
        11.0,
        { justify: true }
      );
    } else if (leadership.length > 0) {
      const leadTokens = [{ text: 'Achievements: ', bold: true, fontSize: 9.0 }];
      leadership.forEach((lead, idx) => {
        if (lead.title) {
          leadTokens.push({ text: lead.title.replace(/[:\s]+$/, '') + ': ', bold: true, fontSize: 9.0 });
        }
        const cleanDesc = String(lead.description || '').replace(/[\s\.;]+$/, '');
        const suffix = (idx < leadership.length - 1 ? '; ' : '.');
        leadTokens.push({ text: cleanDesc + suffix, fontSize: 9.0 });
      });
      renderParagraph(leadTokens, X_LEFT, CONTENT_WIDTH, 11.0, { justify: true });
    }
  }

  return doc;
}

/**
 * Downloads the 100% Vector & Searchable PDF directly
 */
export async function downloadVectorPDF(data, fileName, toast) {
  try {
    const isJakes = data && data.template === 'jakes';
    const candName = (data?.personal?.fullName || 'Resume').replace(/\s+/g, '_');
    const defaultName = `${candName}_${isJakes ? 'Jakes_Resume' : 'Amity_Resume'}.pdf`;
    const finalFileName = fileName || defaultName;

    if (toast) toast.show('Generating 100% Searchable Vector PDF...', 'info');

    const doc = generateVectorPDF(data);
    const pdfBlob = doc.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 20000);

    if (toast) toast.show(`Downloaded: ${finalFileName} (Searchable Vector PDF)`, 'success');
  } catch (err) {
    console.error('Vector PDF generation error:', err);
    if (toast) toast.show('Download issue. Opening Native Print for Vector PDF...', 'warning');
    window.print();
  }
}
