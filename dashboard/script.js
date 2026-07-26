/* ===================================================================
   NYVORA DIGITAL — MEMBER DASHBOARD
   Vanilla JS: page loader, sticky nav state, mobile menu,
   scroll-reveal (fade-up), ripple buttons, back-to-top.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. ICONS — render Lucide icons once the library is ready
  ----------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  } else {
    // lucide script uses `defer`; poll briefly in case it loads late
    const iconInterval = setInterval(() => {
      if (window.lucide) {
        lucide.createIcons();
        clearInterval(iconInterval);
      }
    }, 60);
    setTimeout(() => clearInterval(iconInterval), 3000);
  }

  /* -----------------------------------------------------------
     2. PAGE LOADER — hide once content is ready
  ----------------------------------------------------------- */
  const loader = document.getElementById('loader');

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 600);
  };

  // Minimum display time keeps the loader from flashing/looking glitchy
  const MIN_LOAD_MS = 450;
  const start = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    setTimeout(hideLoader, Math.max(0, MIN_LOAD_MS - elapsed));
  });
  // Safety net in case 'load' never fires as expected
  setTimeout(hideLoader, 2500);

  /* -----------------------------------------------------------
     3. STICKY NAVBAR — add shadow/border once page is scrolled
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const updateNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* -----------------------------------------------------------
     4. MOBILE MENU TOGGLE
  ----------------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------
     5. DARK MODE TOGGLE — prepared for future implementation
     (No theme is applied yet; this only stores intent + gives
     the user visual feedback that the control is alive.)
  ----------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const icon = themeToggle.querySelector('i');
      const isDark = document.body.classList.toggle('theme-dark-pending');

      // Swap icon between moon/sun purely as a visual affordance.
      if (icon) {
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
      }

      themeToggle.animate(
        [{ transform: 'scale(0.85) rotate(0deg)' }, { transform: 'scale(1) rotate(0deg)' }],
        { duration: 260, easing: 'cubic-bezier(0.16,1,0.3,1)' }
      );
    });
  }

  /* -----------------------------------------------------------
     6. SCROLL REVEAL — fade-up elements as they enter viewport
  ----------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.fade-up');

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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------
     7. RIPPLE BUTTON ANIMATION
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
     8. ACTIVE NAV LINK ON SCROLL (Dashboard vs Support)
  ----------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* -----------------------------------------------------------
     9. BACK TO TOP BUTTON
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