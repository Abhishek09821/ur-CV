/**
 * Draft Storage Utilities
 * Provides resilient, automatic local persistence across page reloads and direct URL refreshes:
 * - Resume Builder state in localStorage ('ur-cv-draft')
 * - Quick Resume Editor edits in localStorage ('ur-cv-upload-draft')
 * - Uploaded PDF document file in IndexedDB ('ur_cv_db')
 */

const DB_NAME = 'ur_cv_db';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_storage';
const BUILDER_DRAFT_KEY = 'ur-cv-draft';
const UPLOAD_DRAFT_KEY = 'ur-cv-upload-draft';

/**
 * Open or upgrade native IndexedDB
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Store uploaded PDF file in IndexedDB
 */
export async function saveUploadedPdfFile(file) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put({ file, name: file.name, type: file.type, lastModified: file.lastModified }, 'active_pdf');
      putReq.onsuccess = () => resolve(true);
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.warn('Could not cache PDF in IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieve uploaded PDF file from IndexedDB
 */
export async function getUploadedPdfFile() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get('active_pdf');
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result && result.file) {
          resolve(result.file);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Clear cached PDF from IndexedDB
 */
export async function clearUploadedPdfFile() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete('active_pdf');
      delReq.onsuccess = () => resolve(true);
      delReq.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

/**
 * Save Quick Editor edits to localStorage
 */
export function saveUploadDraft(data) {
  try {
    localStorage.setItem(UPLOAD_DRAFT_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Failed to save upload draft to localStorage:', e);
    return false;
  }
}

/**
 * Get Quick Editor edits from localStorage
 */
export function getUploadDraft() {
  try {
    const item = localStorage.getItem(UPLOAD_DRAFT_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear Quick Editor edits from localStorage
 */
export function clearUploadDraft() {
  try {
    localStorage.removeItem(UPLOAD_DRAFT_KEY);
  } catch (e) {}
}

/**
 * Save Builder draft to localStorage
 */
export function saveBuilderDraft(data) {
  try {
    localStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Failed to save builder draft to localStorage:', e);
    return false;
  }
}

/**
 * Get Builder draft from localStorage
 */
export function getBuilderDraft() {
  try {
    const item = localStorage.getItem(BUILDER_DRAFT_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}
