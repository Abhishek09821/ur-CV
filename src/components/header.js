/**
 * Header Component — Neo Brutalist navigation bar
 */
export function renderHeader({ currentView, onHome, onBack, onSave, onDelete }) {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
    <div class="header-logo" id="header-logo-btn" title="ur-CV Homepage" style="cursor:pointer;">
      <span class="logo-accent">ur</span>-CV
    </div>
    <div class="header-actions" id="header-actions">
      ${
        currentView === 'builder'
          ? `
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to overview">&larr; Back</button>
        <button class="btn btn--sm btn--blue" id="btn-header-pdf" title="Download 100% Vector PDF">Download PDF</button>
        <button class="btn btn--sm btn--yellow" id="btn-header-print" title="Open Browser Native Print Dialog">Print</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft to local storage">Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Reset to official Amity defaults">Reset</button>
      `
          : `<span class="tag tag--green">Free &bull; Open Source</span>`
      }
    </div>
  `;

  setTimeout(() => {
    header.querySelector('#header-logo-btn')?.addEventListener('click', () => {
      if (onHome) onHome();
    });

    if (currentView === 'builder') {
      header.querySelector('#btn-back')?.addEventListener('click', onBack);
      header.querySelector('#btn-save')?.addEventListener('click', onSave);
      header.querySelector('#btn-delete')?.addEventListener('click', onDelete);
      header.querySelector('#btn-header-print')?.addEventListener('click', () => window.print());
      header.querySelector('#btn-header-pdf')?.addEventListener('click', () => {
        document.getElementById('btn-export-pdf')?.click();
      });
    }
  }, 0);

  return header;
}
