/* Priyam Jaiswal — Portfolio interactions
   Sections: smooth scroll, hero video scrub, custom cursor, nav, reveals, contact */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover:none), (pointer:coarse)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reduceMotion) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- scroll progress bar ---------------- */
  const progress = document.querySelector('.scroll-progress');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => { progress.style.transform = `scaleX(${self.progress})`; }
  });

  /* ---------------- custom cursor ---------------- */
  if (!isTouch && !reduceMotion) {
    document.body.classList.add('has-cursor');
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
    const lerp = (a, b, n) => a + (b - a) * n;
    const loop = () => {
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('link'));
      el.addEventListener('mouseleave', () => ring.classList.remove('link'));
    });
    document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
      el.addEventListener('mouseenter', () => { ring.classList.add('view'); ring.innerHTML = '<span>View</span>'; });
      el.addEventListener('mouseleave', () => { ring.classList.remove('view'); ring.innerHTML = ''; });
    });
  }

  /* ---------------- nav: mobile toggle + active section ---------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      navToggle.classList.remove('open'); navLinks.classList.remove('open');
    }));
  }

  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top center', end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          navItems.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`));
        }
      }
    });
  });

  /* ---------------- hero: pinned scroll-scrubbed video ---------------- */
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('.hero-video');
  const heroTitle = document.querySelector('.hero-name');
  const heroCopy = document.querySelector('.hero-copy');
  const heroMeta = document.querySelector('.hero-meta');

  const setupHero = () => {
    const duration = video.duration || 0;
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=140%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (duration && video.readyState >= 1) {
            video.currentTime = Math.min(duration - 0.02, Math.max(0, self.progress * duration));
          }
        }
      }
    });
    heroTl.to(heroTitle, { y: -40, opacity: 0.15, ease: 'none' }, 0)
          .to(heroCopy, { y: -20, opacity: 0, ease: 'none' }, 0)
          .to(heroMeta, { opacity: 0, ease: 'none' }, 0)
          .to('.hero-overlay', { opacity: 0.92, ease: 'none' }, 0);
  };

  if (video) {
    if (video.readyState >= 1) setupHero();
    else video.addEventListener('loadedmetadata', setupHero, { once: true });
  }

  /* ---------------- reveal on scroll (single, restrained pattern) ---------------- */
  gsap.utils.toArray('.reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => el.classList.add('in'),
      once: true
    });
  });

  /* ---------------- contact: copy email ---------------- */
  const copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const value = copyBtn.getAttribute('data-copy');
      try { await navigator.clipboard.writeText(value); } catch (e) { /* clipboard unavailable */ }
      const flag = copyBtn.querySelector('.copy-flag');
      flag.classList.add('show');
      setTimeout(() => flag.classList.remove('show'), 1600);
    });
  }
});
