/**
 * Footer Component
 */
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <p>
      <strong>ur-CV</strong> — Amity Resume Builder &copy; ${new Date().getFullYear()}<br>
      Built with ❤ for Amity University students. 
      <a href="https://github.com/Abhishek09821/ur-CV" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p style="margin-top: 8px; font-size: 0.7rem; opacity: 0.7;">
      This tool does not guarantee ATS success or interview selection. 
      AI suggestions are based on your profile only — no claims are fabricated.
    </p>
  `;
  return footer;
}
