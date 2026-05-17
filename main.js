// ===== NAV INDLÆSNING =====
setTimeout(() => {
  document.querySelector('.nav')?.classList.add('is-loaded');
}, 150);

// ===== NAV MØRK/LYS =====
const nav = document.querySelector('.nav');
const toneSections = document.querySelectorAll('[data-tone]');

function updateNav() {
  if (!nav) return;
  const navBottom = nav.getBoundingClientRect().bottom;
  let isDark = false;
  toneSections.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top <= navBottom && r.bottom >= navBottom) {
      if (s.dataset.tone === 'dark') isDark = true;
    }
  });
  nav.classList.toggle('is-dark', isDark);
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.src = isDark
      ? 'billeder/jernbane-logo-creme.png'
      : 'billeder/jernbane-logo-lys.png';
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav, { passive: true });
updateNav();

// ===== SCROLL-REVEAL (reveal, reveal-left, reveal-right, reveal-clip) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-clip')
  .forEach(el => io.observe(el));

// ===== PARALLAX =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const parallaxEls = document.querySelectorAll('[data-parallax]');
let ticking = false;

function doParallax() {
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    const r = el.getBoundingClientRect();
    const offset = -r.top * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  ticking = false;
}

if (parallaxEls.length && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(doParallax);
      ticking = true;
    }
  }, { passive: true });
  doParallax();
}

// ===== MOBIL-DRAWER =====
const burger = document.querySelector('.burger');
let drawer = null;

if (burger) {
  burger.addEventListener('click', () => {
    if (drawer) return;
    burger.setAttribute('aria-expanded', 'true');
    drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Navigation');
    // Determine if we're on the landing page or a subpage.
    // On subpages, in-page anchors must point back to index.html.
    const onLanding = !!document.querySelector('main#top .hero');
    const homeHref = onLanding ? '' : 'index.html';
    drawer.innerHTML = `
      <button class="drawer-close" aria-label="Luk menu">&times;</button>
      <a href="menu.html">Menukort</a>
      <a href="catering.html">Catering</a>
      <a href="om-os.html">Om os</a>
      <a href="${homeHref}#kontakt">Kontakt</a>
      <a href="${homeHref}#kontakt" class="btn-solid">Book bord</a>
    `;
    document.body.appendChild(drawer);
    requestAnimationFrame(() => drawer.classList.add('is-open'));

    function closeDrawer() {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      setTimeout(() => { drawer?.remove(); drawer = null; }, 400);
    }

    drawer.querySelector('.drawer-close').addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    drawer.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  });
}

// ===== COUNTER ANIMATION =====
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion) { el.textContent = target; counterIO.unobserve(el); return; }
    const duration = 2000;
    el.textContent = '0';
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter-num').forEach(el => counterIO.observe(el));

// ===== MARQUEE ANMELDELSER =====
const reviewsData = [
  {
    text: 'Super lækkert sted, god mad med masser af smag og gode priser. Hyggeligt sted og god service.',
    author: 'Lene Møller Østergaard',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'En fantastisk hyggelig café — bestemt et besøg værd. Maden var frisk og fuld af smag og alt var hjemmelavet. Dejlig atmosfære og venlig betjening.',
    author: 'Jimmi Feldbak',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Super god mad. Hurtigt serveret. Stedet har charme og en rigtig hyggelig stemning — man mærker, at det er lavet med kærlighed.',
    author: 'Flemming Munk Jensen',
    platform: 'Google · 4/5',
    stars: 4
  },
  {
    text: 'Rigtig god frokost i hyggelige omgivelser. Maden var varm, velsmagende og hurtig — præcis hvad man håber på.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Cafeens beliggenhed i den gamle stationsbygning giver en unik og hyggelig stemning. Maden levede til fulde op til forventningerne.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Altid en fornøjelse at komme her. Venligt personale, god mad og priser man kan leve med. Vores go-to i Ikast.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Maden er altid frisklavet og fuld af smag. Vi er kommet her i mange år og det skuffer aldrig.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Hyggelig café tæt på stationen. Perfekt til en frokostpause. Personalet er imødekommende og servicen i top.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  },
  {
    text: 'Bestilte catering til vores firmajulefrokost. Alt var perfekt — maden, servicen og stemningen. Alle gæster var begejstrede.',
    author: 'Google-anmelder',
    platform: 'Google · 5/5',
    stars: 5
  }
];

function buildMarquee() {
  const marquee = document.getElementById('reviewsMarquee');
  if (!marquee) return;

  function makeCard(r) {
    const stars = Array(r.stars).fill('<div class="review-star"></div>').join('');
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-inner">
        <div class="review-stars">${stars}</div>
        <p class="review-text">${r.text}</p>
        <div class="review-sep"></div>
        <p class="review-author">${r.author}</p>
        <p class="review-platform">${r.platform}</p>
      </div>
    `;
    return card;
  }

  // Build original + duplicate for seamless loop
  reviewsData.forEach(r => marquee.appendChild(makeCard(r)));
  reviewsData.forEach(r => marquee.appendChild(makeCard(r)));
}

buildMarquee();

// ===== MARQUEE TOUCH PAUSE =====
const marqueeEl = document.getElementById('reviewsMarquee');
if (marqueeEl) {
  marqueeEl.addEventListener('touchstart', () => {
    marqueeEl.style.animationPlayState = 'paused';
  }, { passive: true });
  marqueeEl.addEventListener('touchend', () => {
    marqueeEl.style.animationPlayState = 'running';
  }, { passive: true });
}

// ===== LOGO PRELOAD =====
const logoLight = new Image();
logoLight.src = 'billeder/jernbane-logo-lys.png';
const logoDark = new Image();
logoDark.src = 'billeder/jernbane-logo-creme.png';
