/* ── PRESENTATION RUNTIME ─────────────────────────────────────────────
 * Extracted from build.cjs's navScript template literal.
 * Loaded via <script src> in the generated presentation HTML.
 * Must be placed AFTER <script>impress().init();</script>.
 * ────────────────────────────────────────────────────────────────────*/

(() => {
  'use strict';

  // ── SVG icon constants ─────────────────────────────────────────────
  const SVG_HOME = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  const SVG_PREV = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  const SVG_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  const SVG_DOWNLOAD = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

  // ── Slide navigation bar ───────────────────────────────────────────
  const nav = Object.assign(document.createElement('nav'), {
    className: 'slide-nav',
    ariaLabel: 'Slide navigation',
    innerHTML: `
      <button class="slide-nav-btn" id="nav-home" type="button" title="Home">${SVG_HOME}Home</button>
      <button class="slide-nav-btn" id="nav-prev" type="button" title="Previous slide">${SVG_PREV}Previous</button>
      <button class="slide-nav-btn" id="nav-next" type="button" title="Next slide">Next${SVG_NEXT}</button>
    `,
  });
  document.body.append(nav);

  // ── PDF download button ────────────────────────────────────────────
  const pdfFilename = window.__PDF_FILENAME__ || 'presentation.pdf';
  document.body.append(Object.assign(document.createElement('a'), {
    id: 'pdf-download',
    href: pdfFilename,
    download: pdfFilename,
    title: 'Download PDF',
    innerHTML: `${SVG_DOWNLOAD}PDF`,
  }));

  // ── Navigate to current slide on first step to ensure overlay shows ─
  document.querySelector('#nav-home')?.addEventListener('click', () => {
    const first = document.querySelector('.step');
    if (first) impress().goto(first.id);
  });
  document.querySelector('#nav-prev')?.addEventListener('click', () => impress().prev());
  document.querySelector('#nav-next')?.addEventListener('click', () => impress().next());

  // ── Keyboard shortcuts ─────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { impress().prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { impress().next(); e.preventDefault(); }
    if (e.key === 'Home') {
      const first = document.querySelector('.step');
      if (first) { impress().goto(first.id); e.preventDefault(); }
    }
  });

  // ── Touch swipe support for mobile ────────────────────────────────
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) impress().next();
      else impress().prev();
    }
  }, { passive: true });
})();
