/**
 * Header Component — Neo Brutalist navigation bar
 */
export function renderHeader({ currentView, onBack, onSave, onDelete }) {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
    <div class="header-logo">
      <span class="logo-accent">ur</span>-CV
    </div>
    <div class="header-actions" id="header-actions">
      ${
        currentView === 'builder'
          ? `
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to start">← Back</button>
        <button class="btn btn--sm btn--blue" id="btn-header-pdf" title="Download PDF file">📄 PDF</button>
        <button class="btn btn--sm btn--yellow" id="btn-header-print" title="Print or save as 100% Vector PDF">🖨️ Print</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft">💾 Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Delete draft">🗑 Delete</button>
      `
          : `<span class="tag tag--green">Free & Open Source</span>`
      }
    </div>
  `;

  // Event listeners
  if (currentView === 'builder') {
    setTimeout(() => {
      document.getElementById('btn-back')?.addEventListener('click', onBack);
      document.getElementById('btn-save')?.addEventListener('click', onSave);
      document.getElementById('btn-delete')?.addEventListener('click', onDelete);
      document.getElementById('btn-header-print')?.addEventListener('click', () => window.print());
      document.getElementById('btn-header-pdf')?.addEventListener('click', () => {
        document.getElementById('btn-export-pdf')?.click();
      });
    }, 0);
  }

  return header;
}
