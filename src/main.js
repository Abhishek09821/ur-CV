/**
 * ur-CV — Amity Resume Builder
 * Main Application Entry Point
 *
 * Neo Brutalism design, mobile-first resume builder
 * with Manual Mode and JD Assist Mode.
 */

import { ResumeStore } from './store.js';
import { renderLanding } from './views/landing.js';
import { renderBuilder } from './views/builder.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { ToastManager } from './components/toast.js';

class App {
  constructor() {
    this.store = new ResumeStore();
    this.toast = new ToastManager();
    this.currentView = 'landing'; // 'landing' | 'builder'
    this.mode = null; // 'manual' | 'jd-assist'
    this.root = document.getElementById('app');

    this.init();
  }

  init() {
    this.render();
    this.loadDraft();
  }

  loadDraft() {
    const saved = localStorage.getItem('ur-cv-draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.store.loadData(data);
      } catch (e) {
        console.warn('Failed to load draft:', e);
      }
    }
  }

  saveDraft() {
    try {
      localStorage.setItem('ur-cv-draft', JSON.stringify(this.store.getData()));
      this.toast.show('Draft saved!', 'success');
    } catch (e) {
      this.toast.show('Failed to save draft', 'error');
    }
  }

  deleteDraft() {
    localStorage.removeItem('ur-cv-draft');
    this.store.reset();
    this.toast.show('Draft deleted!', 'info');
    this.navigateTo('landing');
  }

  navigateTo(view, mode = null) {
    this.currentView = view;
    if (mode) this.mode = mode;
    this.render();
  }

  render() {
    this.root.innerHTML = '';

    // Header
    const header = renderHeader({
      currentView: this.currentView,
      onBack: () => this.navigateTo('landing'),
      onSave: () => this.saveDraft(),
      onDelete: () => {
        if (confirm('Are you sure you want to delete your draft? This cannot be undone.')) {
          this.deleteDraft();
        }
      },
    });
    this.root.appendChild(header);

    // Ticker (neo-brutalist decorative element)
    if (this.currentView === 'landing') {
      const ticker = document.createElement('div');
      ticker.className = 'ticker';
      ticker.innerHTML = `
        <div class="ticker-inner">
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
          ★ FREE RESUME BUILDER ★ MOBILE FIRST ★ AMITY UNIVERSITY APPROVED TEMPLATE ★ AI POWERED JD ASSIST ★ PDF EXPORT ★ PRIVACY FIRST ★ NO ACCOUNT NEEDED ★
        </div>
      `;
      this.root.appendChild(ticker);
    }

    // Main Content
    if (this.currentView === 'landing') {
      const landing = renderLanding({
        onSelectMode: (mode) => this.navigateTo('builder', mode),
      });
      this.root.appendChild(landing);
    } else if (this.currentView === 'builder') {
      const builder = renderBuilder({
        store: this.store,
        mode: this.mode,
        toast: this.toast,
        onSave: () => this.saveDraft(),
        onBack: () => this.navigateTo('landing'),
      });
      this.root.appendChild(builder);
    }

    // Footer
    const footer = renderFooter();
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
window.app = app; // For debugging
