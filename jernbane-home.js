(() => {
  document.documentElement.classList.add('js');
  const nav = document.querySelector('.jb-nav');
  const logo = document.querySelector('.jb-logo img');
  const menu = document.querySelector('.jb-menu');
  const drawer = document.querySelector('.jb-mobile-nav');
  const close = document.querySelector('.jb-close');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkLogo = 'billeder/jernbane-logo-creme.png';
  const lightLogo = 'billeder/jernbane-logo-lys.png';

  const setMenu = open => {
    drawer?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menu?.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
  close?.addEventListener('click', () => setMenu(false));
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  const sections = [...document.querySelectorAll('[data-nav]')];
  const theme = tone => {
    const actual = tone === 'signal' ? 'signal' : tone === 'light' || tone === 'paper' ? 'light' : 'dark';
    nav?.classList.remove('nav-dark', 'nav-light', 'nav-signal');
    nav?.classList.add(`nav-${actual}`);
    if (logo) logo.src = actual === 'dark' ? darkLogo : lightLogo;
  };
  if ('IntersectionObserver' in window) {
    const toneObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) theme(entry.target.dataset.nav); }), { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => toneObserver.observe(section));
  } else theme('dark');

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(item => item.classList.add('is-visible'));
  else {
    const revealObserver = new IntersectionObserver((entries, instance) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } }), { threshold: .1, rootMargin: '0px 0px -40px' });
    reveals.forEach(item => revealObserver.observe(item));
  }

  const form = document.querySelector('#buur-kontaktform');
  if (!form) return;
  const feedback = form.querySelector('.jb-feedback');
  const submit = form.querySelector('button[type="submit"]');
  const original = submit.textContent;
  let renderedAt = Date.now();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) return;
    const details = [`Telefon: ${String(data.get('telefon') || '').trim() || 'Ikke oplyst'}`, `Dato: ${String(data.get('dato') || '').trim() || 'Ikke oplyst'}`, `Antal gæster: ${String(data.get('antal') || '').trim() || 'Ikke oplyst'}`, '', String(data.get('besked') || '').trim()].join('\n');
    const endpoint = form.dataset.endpoint || `https://kinly-cms.vercel.app/api/inbox/${encodeURIComponent(form.dataset.slug || '')}`;
    submit.disabled = true;
    submit.textContent = 'Sender...';
    feedback.textContent = '';
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('navn') || '', email: data.get('email') || '', message: details, honeypot: '', ts: renderedAt }) })
      .then(response => response.json().catch(() => ({})).then(body => ({ response, body })))
      .then(({ response, body }) => {
        if (response.ok && body.ok) { form.reset(); renderedAt = Date.now(); feedback.textContent = 'Tak for din besked. Vi vender tilbage hurtigst muligt.'; }
        else feedback.textContent = body.error || 'Kunne ikke sende lige nu. Prøv igen om lidt.';
      })
      .catch(() => { feedback.textContent = 'Kunne ikke sende lige nu. Prøv igen om lidt.'; })
      .finally(() => { submit.disabled = false; submit.textContent = original; });
  });
})();