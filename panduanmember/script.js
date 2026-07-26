/* ===================================================================
   NYVORA DIGITAL — PANDUAN MEMBER
   Vanilla JS: TOC generation + active highlighting, scroll progress,
   reading progress, mobile menu, reveal animation, ripple, back-to-top.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. ICONS
  ----------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  } else {
    const iconInterval = setInterval(() => {
      if (window.lucide) {
        lucide.createIcons();
        clearInterval(iconInterval);
      }
    }, 60);
    setTimeout(() => clearInterval(iconInterval), 3000);
  }

  /* -----------------------------------------------------------
     2. STICKY NAVBAR STATE
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const updateNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* -----------------------------------------------------------
     3. MOBILE MENU TOGGLE
  ----------------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------
     4. BUILD TABLE OF CONTENTS FROM DOC SECTIONS
  ----------------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('.doc-card[id]'));
  const tocList = document.getElementById('tocList');
  const tocLinks = [];

  if (tocList && sections.length) {
    sections.forEach((section) => {
      const title = section.dataset.title || section.querySelector('h2')?.textContent || section.id;

      const li = document.createElement('li');
      const link = document.createElement('a');

      link.href = `#${section.id}`;
      link.className = 'toc__link';
      link.textContent = title;

      li.appendChild(link);
      tocList.appendChild(li);
      tocLinks.push(link);
    });
  }

  /* -----------------------------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS (TOC + navbar)
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -----------------------------------------------------------
     6. ACTIVE TOC LINK ON SCROLL
  ----------------------------------------------------------- */
  if ('IntersectionObserver' in window && sections.length && tocLinks.length) {
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          tocLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => tocObserver.observe(section));
  }

  /* -----------------------------------------------------------
     7. SCROLL PROGRESS BAR + READING PROGRESS (TOC)
  ----------------------------------------------------------- */
  const progressBar = document.getElementById('progressBar');
  const tocProgressFill = document.getElementById('tocProgressFill');
  const tocProgressLabel = document.getElementById('tocProgressLabel');

  const updateProgress = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    const clamped = Math.min(100, Math.max(0, scrolled));

    if (progressBar) progressBar.style.width = `${clamped}%`;
    if (tocProgressFill) tocProgressFill.style.width = `${clamped}%`;
    if (tocProgressLabel) tocProgressLabel.textContent = `${Math.round(clamped)}% dibaca`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  /* -----------------------------------------------------------
     8. SCROLL REVEAL (fade-in + section reveal)
  ----------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------
     9. RIPPLE BUTTON ANIMATION
  ----------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const circle = document.createElement('span');

      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  });

  /* -----------------------------------------------------------
     10. BACK TO TOP BUTTON
  ----------------------------------------------------------- */
  const toTopBtn = document.getElementById('toTop');

  if (toTopBtn) {
    const toggleToTop = () => {
      toTopBtn.classList.toggle('is-visible', window.scrollY > 480);
    };
    toggleToTop();
    window.addEventListener('scroll', toggleToTop, { passive: true });

    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});