(() => {
  document.documentElement.classList.add('js');
  if (new URLSearchParams(location.search).has('noanim')) document.documentElement.classList.add('no-anim');
  const menu = document.querySelector('.jb-menu');
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

  // Navbaren følger tonen i sektionen under den (data-tone="light" på lyse sektioner).
  // Al scroll-logik samles i ÉN requestAnimationFrame med cachede mål, så der
  // ikke laves layout-læsninger (getBoundingClientRect/elementFromPoint) hver frame.
  const header = document.querySelector('.jb-header');
  const progress = document.createElement('div');
  progress.className = 'jb-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const heroName = document.querySelector('.s-hero h1');
  let headerBottom = 80;
  let lastTone = null;
  let lastToneAt = 0;
  const syncHeaderTone = now => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--progress', max > 0 ? `${(window.scrollY / max) * 100}%` : '0%');
    progress.style.setProperty('--header-height', `${headerBottom}px`);
    if (now - lastToneAt < 120) return;
    lastToneAt = now;
    const y = Math.min(window.innerHeight - 1, headerBottom + 2);
    const under = document.elementFromPoint(window.innerWidth / 2, y);
    const light = Boolean(under?.closest('[data-tone="light"]'));
    if (light !== lastTone) { lastTone = light; header.classList.toggle('is-light', light); }
    progress.classList.toggle('on-light', light);
  };
  const measure = () => { if (header) headerBottom = header.getBoundingClientRect().bottom; };
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(now => {
      frame = 0;
      syncHeaderTone(now);
      if (heroName && !reduceMotion) {
        const limit = Math.max(240, window.innerHeight * 0.55);
        const t = Math.min(1, Math.max(0, window.scrollY / limit));
        heroName.style.opacity = String(1 - t * 0.9);
        heroName.style.transform = `translateY(${t * -18}px)`;
      }
    });
  };
  measure();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); lastToneAt = 0; onScroll(); });

  const noAnim = document.documentElement.classList.contains('no-anim');

  // Togtavle-split-flap: tiderne klapper på plads som en gammel afgangstavle, én gang.
  const tavle = document.querySelector('.s-tavle');
  if (tavle && !reduceMotion && !noAnim && 'IntersectionObserver' in window) {
    const POOL = '0123456789KLUET';
    const flip = el => {
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((ch, i) => {
        const slot = document.createElement('span');
        slot.textContent = ch;
        el.appendChild(slot);
        if (!ch.trim()) return;
        let n = 0;
        const timer = setInterval(() => {
          n += 1;
          if (n > 2 + (i % 3)) { slot.textContent = ch; clearInterval(timer); }
          else slot.textContent = POOL[Math.floor(Math.random() * POOL.length)];
        }, 70);
      });
    };
    const tavleIO = new IntersectionObserver((entries, inst) => entries.forEach(entry => {
      if (entry.isIntersecting) { tavle.querySelectorAll('.tid').forEach(flip); inst.disconnect(); }
    }), { threshold: .4 });
    tavleIO.observe(tavle);
  }

  // 1877-ghosttallet glider langsommere end resten (diskret parallax, kun desktop).
  const ghost = document.querySelector('.jb-ghosttal');
  const desktopMedia = window.matchMedia('(min-width: 981px)');
  if (ghost && !reduceMotion && !noAnim) {
    let ghostMid = 0;
    const measureGhost = () => {
      ghost.style.transform = '';
      const r = ghost.getBoundingClientRect();
      ghostMid = r.top + window.scrollY + r.height / 2;
    };
    let ghostFrame = 0;
    const drift = () => {
      ghostFrame = 0;
      if (!desktopMedia.matches) { ghost.style.transform = ''; return; }
      const d = ghostMid - window.scrollY - window.innerHeight / 2;
      ghost.style.transform = `translateY(${(d * 0.12).toFixed(1)}px)`;
    };
    measureGhost();
    window.addEventListener('scroll', () => { if (!ghostFrame) ghostFrame = requestAnimationFrame(drift); }, { passive: true });
    window.addEventListener('resize', () => { measureGhost(); drift(); });
    drift();
  }

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

/* Ticket-form (runde hjørner + tick midt i hvert hjørne) på fyldte knapper og Tilvalg.
   SVG tegnes med viewBox = knappens faktiske pixelstørrelse, så hjørnerne altid er
   perfekte cirkler uanset størrelse. Fyld + 3px strok følger samme path => indre og
   ydre form er præcist ens (som på logoen). */
(() => {
  const M = 2.5;
  const F = p => p[0].toFixed(2) + ' ' + p[1].toFixed(2);
  // Billet-form = logoet: rent afrundet rektangel, radius 7,5 % af højden (målt på logoet).
  const ticketD = (w, h) => {
    const R = Math.max(3.5, h * 0.075);
    return [
    `M ${F([w - M - R, M])}`,
    `A ${R} ${R} 0 0 1 ${F([w - M, M + R])}`,
    `L ${w - M} ${h - M - R}`,
    `A ${R} ${R} 0 0 1 ${F([w - M - R, h - M])}`,
    `L ${M + R} ${h - M}`,
    `A ${R} ${R} 0 0 1 ${F([M, h - M - R])}`,
    `L ${M} ${M + R}`,
    `A ${R} ${R} 0 0 1 ${F([M + R, M])}`,
    'Z',
    ].join(' ');
  };
  const render = () => {
    document.querySelectorAll('.jb-button, .jb-tilvalg').forEach(el => {
      if (el.querySelector('.jb-ticket')) el.querySelector('.jb-ticket').remove();
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const w = r.width, h = r.height;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'jb-ticket');
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const d = ticketD(w, h);
      if (!el.classList.contains('jb-button-outline')) {
        const fill = document.createElementNS(NS, 'path');
        fill.setAttribute('class', 'fill');
        fill.setAttribute('d', d);
        svg.append(fill);
      }
      el.prepend(svg);
    });
  };
  let frame;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  };
  render();
  window.addEventListener('resize', schedule, { passive: true });
})();
