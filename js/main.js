/* ═══════════════════════════════════════
   INTRO — scramble effect
═══════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

function scramble(el, finalChar, durationMs) {
  el.style.opacity = '1';
  const end = performance.now() + durationMs;
  let raf;
  function frame(now) {
    if (now < end) {
      el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      raf = requestAnimationFrame(frame);
    } else {
      el.textContent = finalChar;
      cancelAnimationFrame(raf);
    }
  }
  raf = requestAnimationFrame(frame);
}

function runIntro() {
  const logo     = document.getElementById('intro-logo');
  const lineTop  = document.getElementById('intro-line-top');
  const lineBot  = document.getElementById('intro-line-bottom');
  const sub      = document.getElementById('intro-sub');
  const enterBtn = document.getElementById('intro-enter');
  const letters  = document.querySelectorAll('.intro-letter');
  const finals   = ['R','I','D','E','Z'];

  // 300ms — logo fades in
  setTimeout(() => {
    logo.style.opacity   = '1';
    logo.style.transform = 'scale(1) translateY(0)';
  }, 300);

  // 500ms — lines expand
  setTimeout(() => {
    lineTop.style.width = '260px';
    lineBot.style.width = '260px';
  }, 500);

  // 800ms — letters scramble in one by one
  finals.forEach((ch, i) => {
    setTimeout(() => scramble(letters[i], ch, 550), 800 + i * 180);
  });

  // 2400ms — subtitle
  setTimeout(() => { sub.style.opacity = '1'; }, 2400);

  // 2800ms — button
  setTimeout(() => { enterBtn.style.opacity = '1'; }, 2800);

  // 7000ms — auto-enter
  setTimeout(enterSite, 7000);
}

function enterSite() {
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main');
  if (intro.dataset.exited) return;
  intro.dataset.exited = '1';

  gsap.to(intro, {
    opacity: 0, duration: 0.75, ease: 'power2.inOut',
    onComplete() {
      intro.style.display = 'none';
      main.style.visibility = 'visible';
      gsap.to(main, {
        opacity: 1, duration: 0.55,
        onComplete: initScrollReveal
      });
      animateHero();
    }
  });
}

document.getElementById('intro-enter').addEventListener('click', enterSite);

/* ═══════════════════════════════════════
   HERO animations
═══════════════════════════════════════ */
function animateHero() {
  const ease = 'power3.out';
  gsap.to('.hero-tag',   { opacity: 1, y: 0, duration: 0.75, delay: 0.15, ease });
  gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1,    delay: 0.30, ease });
  gsap.to('.hero-desc',  { opacity: 1, y: 0, duration: 0.75, delay: 0.50, ease });
  gsap.to('.hero-scroll',{ opacity: 1,       duration: 0.75, delay: 0.80 });

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const hero = document.getElementById('hero');
    if (sy < hero.offsetHeight) {
      document.getElementById('hero-bg').style.transform =
        `scale(1.06) translateY(${sy * 0.28}px)`;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════
   NAVBAR scroll effect
═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════
   VIDEO toggle
═══════════════════════════════════════ */
function toggleVideo() {
  const vid     = document.getElementById('main-video');
  const overlay = document.getElementById('video-overlay');
  if (vid.paused) {
    vid.play();
    overlay.classList.add('hidden');
  } else {
    vid.pause();
    overlay.classList.remove('hidden');
  }
}

document.getElementById('main-video').addEventListener('click', () => {
  const vid     = document.getElementById('main-video');
  const overlay = document.getElementById('video-overlay');
  if (!vid.paused) {
    vid.pause();
    overlay.classList.remove('hidden');
  }
});

/* ═══════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════ */
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.id === 'lightbox-close') {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightbox-img').src = '';
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightbox-img').src = '';
    document.body.style.overflow = '';
  }
});

/* ─── start ─── */
runIntro();
