
(function () {
  const page = document.querySelector('.skills-wrap');
  if (!page) return;

  const items = document.querySelectorAll('.skill-item');

  function animateCounter(el, target) {
    const start = performance.now();
    const duration = 1450;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '%';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const fill = item.querySelector('.skill-fill');
      const num = item.querySelector('.skill-head span');
      if (fill && !fill.classList.contains('is-animated')) {
        const target = Number(fill.dataset.level || 0);
        fill.style.setProperty('--target', target + '%');
        fill.classList.add('is-animated');
        item.classList.add('is-active');
        if (num) {
          num.textContent = '0%';
          animateCounter(num, target);
        }
      }
      io.unobserve(item);
    });
  }, { threshold: 0.22 });

  items.forEach(item => io.observe(item));
})();
