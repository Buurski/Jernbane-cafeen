// ===== NAV INDLÆSNING =====
setTimeout(() => {
  document.querySelector('.nav')?.classList.add('is-loaded');
}, 150);

// ===== NAV MØRK/LYS =====
const nav = document.querySelector('.nav');
const toneSections = document.querySelectorAll('[data-tone]');
let toneObserver = null;

function setNavTone(isDark) {
  if (!nav) return;
  nav.classList.toggle('is-dark', isDark);
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.src = isDark
      ? 'billeder/jernbane-logo-creme.png'
      : 'billeder/jernbane-logo-lys.png';
  }
}

function observeNavTone() {
  if (!nav || !toneSections.length) return;
  toneObserver?.disconnect();
  const navHeight = nav.getBoundingClientRect().height;
  const bandHeight = Math.max(window.innerHeight - navHeight - 1, 0);
  toneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setNavTone(entry.target.dataset.tone === 'dark');
    });
  }, {
    rootMargin: `-${navHeight}px 0px -${bandHeight}px 0px`,
    threshold: 0,
  });
  toneSections.forEach(section => toneObserver.observe(section));
}

observeNavTone();
window.addEventListener('resize', observeNavTone, { passive: true });

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
    // På undersider peger ankre tilbage til index.html.
    const onLanding = !!document.querySelector('main#top .hero');
    const homeHref = onLanding ? '' : 'index.html';
    drawer.innerHTML = `
      <button class="drawer-close" aria-label="Luk menu">&times;</button>
      <a href="${onLanding ? '' : 'index.html'}">Forside</a>
      <a href="dagens-ret.html">Dagens ret</a>
      <a href="menu.html">Menukort</a>
      <a href="catering.html">Catering</a>
      <a href="om-os.html">Om os</a>
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
