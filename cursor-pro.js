
(function () {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let visible = false;
  let lastTrail = 0;

  function animate() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    if (visible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    visible = true;

    const now = performance.now();
    if (now - lastTrail > 28) {
      lastTrail = now;
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = mouseX + 'px';
      trail.style.top = mouseY + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 550);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    visible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  const hoverSelectors = 'a, button, [role="button"], input, textarea, select, .course-card, .course-media, .page-arrow, .home-float, .thesis-preview, .thesis-btn, .course-btn, .nav-fixed a';
  function bindHoverStates() {
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }
  bindHoverStates();

  document.addEventListener('mousedown', () => {
    ring.classList.add('is-click');
    playClick(180, 0.018, 'triangle', 0.04);
  });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('is-click');
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      playHover();
    }
  });

  let audioCtx = null;
  let lastHoverSound = 0;

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function envelope(gainNode, now, peak, duration) {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  }

  function playClick(freq = 180, duration = 0.02, type = 'triangle', peak = 0.04) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, now + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    envelope(gain, now, peak, duration + 0.03);
    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  function playHover() {
    const nowPerf = performance.now();
    if (nowPerf - lastHoverSound < 90) return;
    lastHoverSound = nowPerf;

    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.2;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.035);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.015, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    }
  });
})();
