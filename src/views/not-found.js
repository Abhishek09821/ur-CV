/**
 * 404 Not Found View — Neo Brutalist Error Page
 */
export function renderNotFound({ onNavigateHome }) {
  const container = document.createElement('section');
  container.className = 'not-found-view';

  container.innerHTML = `
    <div class="not-found-card animate-in">
      <div class="not-found-badge">ERROR 404</div>
      <h1 class="not-found-title">PAGE NOT FOUND</h1>
      <p class="not-found-text">
        The requested URL does not match any route in ur-CV. You may have followed an outdated link or mistyped the address.
      </p>

      <div class="not-found-box">
        <div class="not-found-box-header">
          <span>STATUS: 404 NOT_FOUND</span>
          <span>LOCATION: ${window.location.pathname}</span>
        </div>
        <p class="not-found-box-body">
          Valid destinations: Home (/) or Resume Builder (/builder).
        </p>
      </div>

      <div class="not-found-actions">
        <button class="btn btn--yellow" id="btn-404-home">
          ← Return to Home
        </button>
        <button class="btn btn--purple" id="btn-404-builder">
          Open Resume Builder →
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    container.querySelector('#btn-404-home')?.addEventListener('click', () => {
      if (onNavigateHome) onNavigateHome('landing');
    });
    container.querySelector('#btn-404-builder')?.addEventListener('click', () => {
      if (onNavigateHome) onNavigateHome('builder');
    });
  }, 0);

  return container;
}
