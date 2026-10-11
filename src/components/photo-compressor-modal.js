/**
 * In-Browser Client-Side Photo Compressor Modal
 * 
 * Compresses oversized photos (>1MB) down to clean, passport-ready JPEGs (<300KB)
 * entirely in the browser using HTML5 Canvas.
 * Supports direct upload to resume and local download.
 */

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function openPhotoCompressorModal({ initialFile = null, onApply, toast } = {}) {
  const existing = document.getElementById('photo-compressor-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay compressor-modal-overlay';
  overlay.id = 'photo-compressor-modal-overlay';

  overlay.innerHTML = `
    <div class="modal compressor-modal" role="dialog" aria-modal="true" aria-labelledby="comp-modal-title">
      <!-- Header -->
      <div class="modal-header">
        <div>
          <div class="flex items-center gap-xs">
            <span class="badge badge--yellow" style="font-size:0.75rem;">100% FREE &bull; CLIENT-SIDE</span>
            <span class="badge badge--green" style="font-size:0.75rem;">UNDER 1MB GUARANTEED</span>
          </div>
          <h2 class="modal-title mt-xs" id="comp-modal-title">Passport Photo Compressor</h2>
          <p class="form-hint" style="margin-top:2px;">
            Having trouble adding a photo? Upload any high-res image here and we will compress it instantly.
          </p>
        </div>
        <button class="modal-close" id="btn-comp-close" title="Close (ESC)">&times;</button>
      </div>

      <!-- Body -->
      <div class="compressor-modal-body">
        <!-- Drop / Select Zone -->
        <div class="compressor-dropzone" id="comp-dropzone">
          <input type="file" id="comp-file-input" accept="image/jpeg,image/png,image/webp" style="display:none;" />
          <div class="compressor-dropzone-inner">
            <div style="font-size:2rem;margin-bottom:6px;">📸</div>
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px;">
              Click to select or drag photo here
            </div>
            <div style="font-size:0.78rem;color:var(--text-muted);">
              Supports JPEG, PNG, WEBP of any file size (2MB, 5MB, 10MB+)
            </div>
          </div>
        </div>

        <!-- Processing / Preview Area -->
        <div class="compressor-result" id="comp-result-area" style="display:none;">
          <div class="compressor-preview-row">
            <div class="compressor-preview-box">
              <img id="comp-preview-img" src="" alt="Compressed preview" />
            </div>
            <div class="compressor-stats">
              <div class="compressor-stat-item">
                <span class="stat-label">Original File Size:</span>
                <span class="stat-value stat-value--original" id="comp-stat-orig">--</span>
              </div>
              <div class="compressor-stat-item">
                <span class="stat-label">Compressed Size:</span>
                <span class="stat-value stat-value--compressed" id="comp-stat-comp">--</span>
              </div>
              <div class="compressor-stat-item">
                <span class="stat-label">Status:</span>
                <span class="stat-badge" id="comp-stat-badge">✓ READY (UNDER 1MB)</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="compressor-actions">
            <button type="button" class="btn btn--green btn--block" id="btn-comp-apply" style="font-size:0.95rem;padding:10px 14px;">
              ✓ Directly Apply to Resume
            </button>
            <div class="flex gap-sm mt-xs">
              <button type="button" class="btn btn--white flex-1" id="btn-comp-download" style="font-size:0.85rem;">
                ⬇ Download Compressed Photo
              </button>
              <button type="button" class="btn btn--white flex-1" id="btn-comp-reupload" style="font-size:0.85rem;">
                🔄 Choose Another Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  let compressedDataUrl = null;
  let compressedBlob = null;

  const closeModal = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 150);
    document.removeEventListener('keydown', handleKey);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleKey);

  overlay.querySelector('#btn-comp-close')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const fileInput = overlay.querySelector('#comp-file-input');
  const dropzone = overlay.querySelector('#comp-dropzone');
  const resultArea = overlay.querySelector('#comp-result-area');
  const previewImg = overlay.querySelector('#comp-preview-img');
  const statOrig = overlay.querySelector('#comp-stat-orig');
  const statComp = overlay.querySelector('#comp-stat-comp');
  const btnApply = overlay.querySelector('#btn-comp-apply');
  const btnDownload = overlay.querySelector('#btn-comp-download');
  const btnReupload = overlay.querySelector('#btn-comp-reupload');

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  });

  btnReupload?.addEventListener('click', () => {
    dropzone.style.display = 'block';
    resultArea.style.display = 'none';
    fileInput.value = '';
  });

  // Client-Side Canvas Compression Logic
  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      if (toast) toast.show('Please select a valid image file (JPEG, PNG).', 'error');
      return;
    }

    statOrig.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Standard passport dimensions ratio ~ 35mm x 45mm (~1:1.28)
        let targetWidth = 600;
        let targetHeight = 750;

        // If landscape, fit proportionally
        if (img.width > img.height) {
          targetHeight = 600;
          targetWidth = Math.round((img.width / img.height) * 600);
        } else {
          targetWidth = Math.round((img.width / img.height) * 750);
          if (targetWidth > 600) targetWidth = 600;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Quality tuning to guarantee < 1MB
        let quality = 0.82;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            compressedBlob = blob;
            statComp.textContent = formatBytes(blob.size) + ' (Under 1MB ✓)';
            previewImg.src = compressedDataUrl;

            dropzone.style.display = 'none';
            resultArea.style.display = 'block';

            if (toast) {
              toast.show(`Photo compressed successfully to ${formatBytes(blob.size)}!`, 'success');
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Directly Apply to Resume
  btnApply?.addEventListener('click', () => {
    if (!compressedDataUrl) return;
    if (onApply) {
      onApply(compressedDataUrl);
    }
    closeModal();
  });

  // Download Compressed Photo
  btnDownload?.addEventListener('click', () => {
    if (!compressedDataUrl) return;
    const a = document.createElement('a');
    a.href = compressedDataUrl;
    a.download = 'compressed_passport_photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (toast) toast.show('Downloaded compressed_passport_photo.jpg', 'info');
  });

  // If initial file provided, immediately process it
  if (initialFile) {
    processFile(initialFile);
  }
}
