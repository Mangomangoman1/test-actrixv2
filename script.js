(() => {
  const nav = document.querySelector('.topbar');
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const revealTargets = document.querySelectorAll('.section, .ticker, .cta, footer');

  if (!nav) return;

  let lastConstricted = false;
  let ticking = false;

  const updateNav = () => {
    const constricted = window.scrollY > 16;
    if (constricted !== lastConstricted) {
      nav.classList.toggle('is-constricted', constricted);
      nav.classList.remove('nav-pulse');
      void nav.offsetWidth;
      nav.classList.add('nav-pulse');
      lastConstricted = constricted;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
  updateNav();

  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -52% 0px', threshold: 0.01 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }
})();
