/**
 * ur-CV — Amity Placement Resume Builder
 * Main Application Entry Point with History API Routing & Back-Button Support
 */

import { ResumeStore } from './store.js';
import { renderLanding } from './views/landing.js';
import { renderBuilder } from './views/builder.js';
import { renderNotFound } from './views/not-found.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { ToastManager } from './components/toast.js';
import { openTemplateModal } from './components/template-modal.js';
import { openPreviewModal } from './components/preview-modal.js';
import { openUploadModal } from './components/upload-modal.js';
import { renderUploadEditor } from './views/upload-editor.js';
import { AMITY_DEFAULT_PHOTO_DATA_URL } from './assets/amity-assets.js';

class App {
  constructor() {
    this.store = new ResumeStore();
    this.toast = new ToastManager();
    this.uploadedEngine = null;
    this.currentView = this.resolveRoute();
    this.root = document.getElementById('app');

    this.init();
  }

  resolveRoute() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const hash = window.location.hash.replace(/^#\/?/, '');

    if (hash === 'upload-editor' || path === '/upload-editor' || path === '/edit-resume') {
      return 'upload-editor';
    }
    if (hash === 'builder' || path === '/builder' || path === '/editor') {
      return 'builder';
    }
    if ((path === '/' || path === '/index.html' || path === '/home') && (hash === '' || hash === 'landing')) {
      return 'landing';
    }
    return '404';
  }

  init() {
    // Listen to browser Back/Forward navigation
    window.addEventListener('popstate', (e) => {
      const targetView = (e.state && e.state.view) || this.resolveRoute();
      this.currentView = targetView;
      this.render();
      window.scrollTo(0, 0);
    });

    // Ensure initial state has history record
    const initialView = this.resolveRoute();
    const initialPath = initialView === 'builder' ? '/builder' : initialView === 'landing' ? '/' : window.location.pathname;
    window.history.replaceState({ view: initialView }, '', initialPath);

    // Suppress browser default title during print to eliminate watermarks/headers
    window.addEventListener('beforeprint', () => {
      this._prevDocTitle = document.title;
      document.title = '';
    });
    window.addEventListener('afterprint', () => {
      if (this._prevDocTitle) document.title = this._prevDocTitle;
    });

    this.render();
    this.loadDraft();
  }

  loadDraft() {
    const saved = localStorage.getItem('ur-cv-draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Migrate away from personal photo to neutral default photo
        if (data.personal && data.personal.photo && (data.personal.photo.includes('/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL') || data.personal.photo.length > 50000)) {
          data.personal.photo = AMITY_DEFAULT_PHOTO_DATA_URL;
        }
        this.store.loadData(data);
      } catch (e) {
        console.warn('Failed to load draft:', e);
      }
    }
  }

  saveDraft() {
    try {
      localStorage.setItem('ur-cv-draft', JSON.stringify(this.store.getData()));
      this.toast.show('Draft saved to local storage.', 'success');
    } catch (e) {
      this.toast.show('Failed to save draft.', 'error');
    }
  }

  resetDraft() {
    const currentTemplate = this.store.getTemplate ? this.store.getTemplate() : 'amity';
    const templateName = currentTemplate === 'jakes' ? "Jake's Resume" : "Amity Official Format";

    this.store.reset(currentTemplate);
    try {
      localStorage.setItem('ur-cv-draft', JSON.stringify(this.store.getData()));
    } catch (e) {}

    this.toast.show(`Draft reset to original ${templateName}.`, 'info');
    this.render();
  }

  navigateTo(view, push = true) {
    if (this.currentView === view && !push) return;
    this.currentView = view;

    if (push) {
      const targetPath =
        view === 'builder'
          ? '/builder'
          : view === 'upload-editor'
          ? '/edit-resume'
          : view === 'landing'
          ? '/'
          : '/404';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }

    this.render();
    window.scrollTo(0, 0);
  }

  render() {
    this.root.innerHTML = '';

    // If on upload-editor, we use dedicated streamlined layout
    if (this.currentView === 'upload-editor') {
      if (this.uploadedEngine) {
        const uploadEditor = renderUploadEditor({
          engine: this.uploadedEngine,
          toast: this.toast,
          onBack: () => this.navigateTo('landing'),
        });
        this.root.appendChild(uploadEditor);

        if (!document.querySelector('.toast-container')) {
          const toastContainer = document.createElement('div');
          toastContainer.className = 'toast-container';
          toastContainer.id = 'toast-container';
          document.body.appendChild(toastContainer);
        }
        return;
      } else {
        // Auto-load sample resume if directly navigated to /edit-resume
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'container py-xl text-center';
        loadingDiv.innerHTML = `
          <div class="card p-xl mx-auto" style="max-width: 500px; margin-top: 60px;">
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase;">Loading Resume Editor...</h2>
            <p class="text-sm mt-sm" style="color: var(--text-secondary);">Initializing universal in-place resume engine...</p>
          </div>
        `;
        this.root.appendChild(loadingDiv);

        import('./utils/pdf-document-engine.js').then(async ({ PDFDocumentEngine }) => {
          try {
            const res = await fetch('/Abhishek_Tiwari_Resume_Updated.pdf');
            const blob = await res.blob();
            const file = new File([blob], 'Abhishek_Tiwari_Resume_Updated.pdf', { type: 'application/pdf' });
            const engine = new PDFDocumentEngine();
            await engine.loadFile(file);
            this.uploadedEngine = engine;
            this.render();
          } catch (e) {
            console.error('Error auto-loading resume:', e);
            this.navigateTo('landing');
          }
        });
        return;
      }
    }

    // Header
    const header = renderHeader({
      currentView: this.currentView,
      template: this.store.getTemplate ? this.store.getTemplate() : 'amity',
      onHome: () => this.navigateTo('landing'),
      onBack: () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          this.navigateTo('landing');
        }
      },
      onUpload: () => {
        openUploadModal({
          toast: this.toast,
          onComplete: (engine) => {
            this.uploadedEngine = engine;
            this.navigateTo('upload-editor');
          },
        });
      },
      onSwitchTemplate: () => {
        openTemplateModal({
          store: this.store,
          toast: this.toast,
          onSelect: () => {
            this.render();
          },
        });
      },
      onSave: () => this.saveDraft(),
      onDelete: () => {
        const currentTemplate = this.store.getTemplate ? this.store.getTemplate() : 'amity';
        const templateName = currentTemplate === 'jakes' ? "Jake's Resume" : "Amity Official Format";
        if (confirm(`Reset draft to original ${templateName}? This will replace your local edits with the clean template data.`)) {
          this.resetDraft();
        }
      },
    });
    this.root.appendChild(header);

    // Clean Neo-Brutalist Ticker
    if (this.currentView === 'landing') {
      const ticker = document.createElement('div');
      ticker.className = 'ticker';
      ticker.innerHTML = `
        <div class="ticker-inner">
          OFFICIAL AMITY UNIVERSITY RESUME FORMAT &nbsp;&bull;&nbsp; CLIENT-SIDE PDF COMPILATION &nbsp;&bull;&nbsp; ZERO DATA RETENTION &nbsp;&bull;&nbsp; FREE & OPEN SOURCE &nbsp;&bull;&nbsp;
          OFFICIAL AMITY UNIVERSITY RESUME FORMAT &nbsp;&bull;&nbsp; CLIENT-SIDE PDF COMPILATION &nbsp;&bull;&nbsp; ZERO DATA RETENTION &nbsp;&bull;&nbsp; FREE & OPEN SOURCE &nbsp;&bull;&nbsp;
        </div>
      `;
      this.root.appendChild(ticker);
    }

    // Main Content
    if (this.currentView === 'landing') {
      const landing = renderLanding({
        onSelectMode: () => {
          openTemplateModal({
            store: this.store,
            toast: this.toast,
            onSelect: () => {
              this.navigateTo('builder');
            },
          });
        },
        onUploadMode: () => {
          openUploadModal({
            toast: this.toast,
            onComplete: (engine) => {
              this.uploadedEngine = engine;
              this.navigateTo('upload-editor');
            },
          });
        },
      });
      this.root.appendChild(landing);
    } else if (this.currentView === 'builder') {
      const builder = renderBuilder({
        store: this.store,
        toast: this.toast,
        onSave: () => this.saveDraft(),
        onBack: () => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            this.navigateTo('landing');
          }
        },
      });
      this.root.appendChild(builder);
    } else {
      // 404 View
      const notFound = renderNotFound({
        onNavigateHome: (dest) => this.navigateTo(dest || 'landing'),
      });
      this.root.appendChild(notFound);
    }

    // Structured Footer
    const footer = renderFooter({
      onNavigate: (view) => this.navigateTo(view),
      onShowPreview: () => {
        openPreviewModal({
          store: this.store,
          toast: this.toast,
          onSelect: () => {
            if (this.currentView === 'builder') {
              this.render();
            } else {
              this.navigateTo('builder');
            }
          },
        });
      },
    });
    this.root.appendChild(footer);

    // Toast container
    if (!document.querySelector('.toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
}

// Boot the app
const app = new App();
window.app = app;
