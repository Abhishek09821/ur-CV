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
    }, 0);
  }

  return header;
}
