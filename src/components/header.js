/**
 * Header Component — Neo Brutalist navigation bar
 */
export function renderHeader({ currentView, template = 'amity', onHome, onBack, onUpload, onSwitchTemplate, onSave, onDelete }) {
  const header = document.createElement('header');
  header.className = `header ${currentView === 'builder' ? 'header--builder' : ''}`;
  const templateLabel = template === 'jakes' ? "Jake's" : 'Amity';

  header.innerHTML = `
    <div class="header-left">
      ${
        currentView === 'builder'
          ? `<button class="btn btn--sm btn--white header-mobile-back" id="btn-mobile-back" title="Back to home">&larr; Back</button>`
          : ''
      }
      <div class="header-logo ${currentView === 'builder' ? 'header-logo--builder' : ''}" id="header-logo-btn" title="ur-CV Homepage" style="cursor:pointer;">
        <span class="logo-accent">ur</span>-CV
      </div>
    </div>
    <div class="header-actions" id="header-actions">
      ${
        currentView === 'builder'
          ? `
        <button class="btn btn--sm btn--white" id="btn-back" title="Back to overview">&larr; Back</button>
        <button class="btn btn--sm btn--purple" id="btn-header-upload" title="Upload an existing resume to auto-fill fields">&#x2B06; Upload</button>
        <button class="btn btn--sm btn--white" id="btn-header-format" title="Switch Resume Template (Amity vs Jake's)">
          Format: <strong>${templateLabel}</strong>
        </button>
        <button class="btn btn--sm btn--blue" id="btn-header-pdf" title="Download 100% Vector PDF">Download PDF</button>
        <button class="btn btn--sm btn--yellow" id="btn-header-print" title="Open Browser Native Print Dialog">Print</button>
        <button class="btn btn--sm btn--green" id="btn-save" title="Save draft to local storage">Save</button>
        <button class="btn btn--sm btn--red" id="btn-delete" title="Reset template">Reset</button>
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
      header.querySelector('#btn-mobile-back')?.addEventListener('click', onBack);
      header.querySelector('#btn-back')?.addEventListener('click', onBack);
      header.querySelector('#btn-header-upload')?.addEventListener('click', onUpload);
      header.querySelector('#btn-header-format')?.addEventListener('click', onSwitchTemplate);
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
