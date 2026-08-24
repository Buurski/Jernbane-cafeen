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
  const original = button.textContent;
  let renderedAt = Date.now();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) return;
    const details = [`Telefon: ${String(data.get('telefon') || '').trim() || 'Ikke oplyst'}`, `Dato: ${String(data.get('dato') || '').trim() || 'Ikke oplyst'}`, `Antal gæster: ${String(data.get('antal') || '').trim() || 'Ikke oplyst'}`, '', String(data.get('besked') || '').trim()].join('\n');
    const endpoint = form.dataset.endpoint || `https://kinly-cms.vercel.app/api/inbox/${encodeURIComponent(form.dataset.slug || '')}`;
    button.disabled = true; button.textContent = 'Sender...'; feedback.textContent = '';
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('navn') || '', email: data.get('email') || '', message: details, honeypot: '', ts: renderedAt }) })
      .then(response => response.json().catch(() => ({})).then(body => ({ response, body })))
      .then(({ response, body }) => { if (response.ok && body.ok) { form.reset(); renderedAt = Date.now(); feedback.textContent = 'Tak for din besked. Vi vender tilbage hurtigst muligt.'; } else feedback.textContent = body.error || 'Kunne ikke sende lige nu. Prøv igen om lidt.'; })
      .catch(() => { feedback.textContent = 'Kunne ikke sende lige nu. Prøv igen om lidt.'; })
      .finally(() => { button.disabled = false; button.textContent = original; });
  });
})();
