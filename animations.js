
(function () {
  const selectors = [
    '.panel','.cards-shell','.course-card','.skill-card','.contact-card',
    '.about-card','.hero-card','.thesis-card','.thesis-intro','.summary-item',
    '.thesis-point','.course-media','.contact-item','.stat-card','.timeline-item'
  ];
  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  elements.forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => io.observe(el));
})();


(function () {
  const page = document.querySelector('.page');
  if (page && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let raf = null;
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 8;
      my = (e.clientY / window.innerHeight - 0.5) * 8;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.querySelectorAll('.panel, .cards-shell, .metrics-card, .thesis-card, .thesis-intro').forEach((el) => {
          const depth = Number(el.dataset.depth || 1);
          el.style.transform = `translate3d(${mx * depth * 0.35}px, ${my * depth * 0.35}px, 0)`;
        });
        raf = null;
      });
    }, { passive: true });
  }

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('is-loaded'));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    overlay.classList.remove('is-loaded');
    setTimeout(() => { window.location.href = a.href; }, 280);
  });
})();
