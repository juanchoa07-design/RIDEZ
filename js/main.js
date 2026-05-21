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

  setTimeout(() => {
    logo.style.opacity   = '1';
    logo.style.transform = 'scale(1) translateY(0)';
  }, 300);

  setTimeout(() => {
    lineTop.style.width = '260px';
    lineBot.style.width = '260px';
  }, 500);

  finals.forEach((ch, i) => {
    setTimeout(() => scramble(letters[i], ch, 550), 800 + i * 180);
  });

  setTimeout(() => { sub.style.opacity = '1'; }, 2400);
  setTimeout(() => { enterBtn.style.opacity = '1'; }, 2800);
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
   CUSTOM CURSOR — solo en desktop (no touch)
═══════════════════════════════════════ */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (!isTouchDevice) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .portfolio-item, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(0)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
} else {
  dot.style.display  = 'none';
  ring.style.display = 'none';
}

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct   = (window.scrollY / total) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════
   HERO animations
═══════════════════════════════════════ */
function animateHero() {
  const ease = 'power3.out';
  gsap.to('.hero-tag',    { opacity: 1, y: 0, duration: 0.75, delay: 0.15, ease });
  gsap.to('.hero-title',  { opacity: 1, y: 0, duration: 1,    delay: 0.30, ease });
  gsap.to('.hero-desc',   { opacity: 1, y: 0, duration: 0.75, delay: 0.50, ease });
  gsap.to('.hero-scroll', { opacity: 1,       duration: 0.75, delay: 0.80 });

  window.addEventListener('scroll', () => {
    const sy   = window.scrollY;
    const hero = document.getElementById('hero');
    if (sy < hero.offsetHeight) {
      document.getElementById('hero-bg').style.transform =
        `scale(1.06) translateY(${sy * 0.28}px)`;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════
   NAVBAR scroll effect
═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════
   PORTFOLIO — inject labels + expand icon
═══════════════════════════════════════ */
const portfolioLabels = [
  'Escenario', 'Escándalo', 'Iluminación', 'Técnica',
  'Navidad', 'Phonetec', 'Producción', 'Bandeja',
  'Consola', 'Branding', 'Equipos', 'Packaging'
];
document.querySelectorAll('.portfolio-item').forEach((item, i) => {
  const label = document.createElement('span');
  label.className = 'p-label';
  label.textContent = portfolioLabels[i] || 'Ver';

  const expand = document.createElement('span');
  expand.className = 'p-expand';

  item.appendChild(label);
  item.appendChild(expand);
});

/* ═══════════════════════════════════════
   FEATURE STRIP — word-by-word reveal
═══════════════════════════════════════ */
function wrapWords(el) {
  const lines = el.innerHTML.split('<br>');
  el.innerHTML = lines.map(line =>
    line.trim().split(' ').map(word =>
      `<span class="word"><span>${word}</span></span>`
    ).join(' ')
  ).join('<br>');
}

const featureQuote = document.querySelector('.feature-quote');
const featureLogo  = document.querySelector('.feature-logo');
if (featureQuote) wrapWords(featureQuote);

const featureObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      if (featureLogo) featureLogo.classList.add('revealed');
      featureObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
if (featureQuote) featureObs.observe(featureQuote);

/* ═══════════════════════════════════════
   STATS — animated counter
═══════════════════════════════════════ */
function animateCounter(el, target, suffix, duration) {
  const isPlus   = suffix.startsWith('+');
  const cleanSuf = isPlus ? suffix.slice(1) : suffix;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = Math.floor(eased * target);
    el.textContent = (isPlus ? '+' : '') + value + cleanSuf;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statData = [
  { target: 100, suffix: '+', label: '' },
  { target: 5,   suffix: '+', label: '' },
  { target: 360, suffix: '°', label: '' },
  { target: 1,   suffix: '',  label: '' },
];

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const numbers = e.target.querySelectorAll('.stat-number');
    numbers.forEach((num, i) => {
      const d = statData[i];
      if (!d) return;
      animateCounter(num, d.target, d.suffix, 1800);
    });
    statsObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObs.observe(statsSection);

/* ═══════════════════════════════════════
   SERVICE CARDS — staggered reveal
═══════════════════════════════════════ */
function initServiceStagger() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.65s ${i * 0.1}s ease, transform 0.65s ${i * 0.1}s cubic-bezier(0.4,0,0.2,1)`;
  });

  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => cardObs.observe(card));
}

/* ═══════════════════════════════════════
   PORTFOLIO ITEMS — staggered reveal
═══════════════════════════════════════ */
function initPortfolioStagger() {
  const items = document.querySelectorAll('.portfolio-item');
  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'scale(0.94)';
    item.style.transition = `opacity 0.6s ${(i % 4) * 0.08}s ease, transform 0.6s ${(i % 4) * 0.08}s ease`;
  });

  const pObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'scale(1)';
        pObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  items.forEach(item => pObs.observe(item));
}

/* ═══════════════════════════════════════
   FEATURE STRIP — parallax background
═══════════════════════════════════════ */
function initFeatureParallax() {
  const strip = document.getElementById('feature-strip');
  const bg    = strip ? strip.querySelector('.feature-bg') : null;
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const rect = strip.getBoundingClientRect();
    const vy   = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vy) return;
    const ratio = (vy - rect.top) / (vy + rect.height);
    bg.style.transform = `scale(1.08) translateY(${(ratio - 0.5) * 40}px)`;
  }, { passive: true });
}

/* ═══════════════════════════════════════
   SCROLL REVEAL — generic .reveal elements
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

  initServiceStagger();
  initPortfolioStagger();
  initFeatureParallax();
}

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
  const img = document.getElementById('lightbox-img');
  const lb  = document.getElementById('lightbox');
  img.style.opacity   = '0';
  img.style.transform = 'scale(0.92)';
  img.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  img.onload = () => {
    img.style.transition = 'opacity 0.35s, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    img.style.opacity    = '1';
    img.style.transform  = 'scale(1)';
  };
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.id === 'lightbox-close') {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.style.opacity   = '0';
    img.style.transform = 'scale(0.92)';
    setTimeout(() => {
      lb.classList.remove('active');
      img.src = '';
      document.body.style.overflow = '';
    }, 300);
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
