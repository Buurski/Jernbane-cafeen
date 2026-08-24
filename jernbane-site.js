(() => {
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.jb-menu');
  const nav = document.querySelector('.jb-nav');
  const drawer = document.querySelector('.jb-mobile');
  const close = document.querySelector('.jb-close');
  const focusables = () => [...(drawer?.querySelectorAll('a, button, input, textarea, select') || [])].filter(item => !item.hasAttribute('disabled'));
  const setMenu = open => { drawer?.classList.toggle('is-open', open); menu?.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; if (open) focusables()[0]?.focus(); else menu?.focus(); };
  menu?.addEventListener('click', () => setMenu(!drawer?.classList.contains('is-open')));
  close?.addEventListener('click', () => setMenu(false));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (!drawer?.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
    if (e.key !== 'Tab') return;
    const items = focusables(); if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.jb-header');
  const headerLogo = header?.querySelector('.jb-logo img');
  const lightAreas = '.jb-choice, .jb-today, .jb-story, .jb-service, .jb-menu-section, .jb-facts';
  const syncHeaderTone = () => {
    if (!header) return;
    const y = Math.min(window.innerHeight - 1, header.getBoundingClientRect().bottom + 2);
    const under = document.elementFromPoint(window.innerWidth / 2, y);
    const light = Boolean(under?.closest(lightAreas));
    header.classList.toggle('is-light', light);
    if (headerLogo) headerLogo.src = light ? 'billeder/jernbane-logo-lys.png' : 'billeder/jernbane-logo-creme.png';
  };
  let toneFrame = 0;
  const scheduleTone = () => { if (toneFrame) return; toneFrame = requestAnimationFrame(() => { toneFrame = 0; syncHeaderTone(); }); };
  syncHeaderTone();
  window.addEventListener('scroll', scheduleTone, { passive: true });
  window.addEventListener('resize', scheduleTone);
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries, instance) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } }), { threshold: .1, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  }
  const form = document.querySelector('#jb-contact-form');
  if (!form) return;
  const feedback = form.querySelector('.jb-feedback');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) return;
    button.disabled = true;
    feedback.textContent = 'Tak for oplysningerne. Previewet er valideret lokalt, men ikke sendt.';
    button.disabled = false;
  });
})();
