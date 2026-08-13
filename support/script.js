/* ===================================================================
   NYVORA DIGITAL — PUSAT BANTUAN (SUPPORT)
   Vanilla JS: page loader, sticky nav, mobile menu, search panel +
   live FAQ filtering, accordion toggle, reveal animation, ripple,
   back-to-top.
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
     2. PAGE LOADER
  ----------------------------------------------------------- */
  const loader = document.getElementById('loader');

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 600);
  };

  const MIN_LOAD_MS = 450;
  const start = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    setTimeout(hideLoader, Math.max(0, MIN_LOAD_MS - elapsed));
  });
  // Jaring pengaman: paksa sembunyikan walau event 'load' gagal terpicu
  setTimeout(hideLoader, 2500);

  /* -----------------------------------------------------------
     3. STICKY NAVBAR STATE
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

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------
     5. SEARCH PANEL — toggle + live filter product cards
  ----------------------------------------------------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const faqItems = document.querySelectorAll('.faq-item');
  const faqEmpty = document.getElementById('faqEmpty');

  const openSearch = () => {
    searchPanel.classList.add('is-open');
    searchToggle.classList.add('is-active');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 200);
  };

  const closeSearch = () => {
    searchPanel.classList.remove('is-open');
    searchToggle.classList.remove('is-active');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    filterFaq('');
  };

  const filterFaq = (query) => {
    const term = query.trim().toLowerCase();
    let visibleCount = 0;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-item__question span')?.textContent.toLowerCase() || '';
      const answer = item.querySelector('.faq-item__answer')?.textContent.toLowerCase() || '';
      const matches = term === '' || question.includes(term) || answer.includes(term);

      item.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    if (faqEmpty) {
      faqEmpty.hidden = visibleCount !== 0;
    }
  };

  if (searchToggle && searchPanel && searchInput && searchClose) {
    searchToggle.addEventListener('click', () => {
      const isOpen = searchPanel.classList.contains('is-open');
      isOpen ? closeSearch() : openSearch();
    });

    searchClose.addEventListener('click', closeSearch);

    searchInput.addEventListener('input', (e) => filterFaq(e.target.value));

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });
  }

  /* -----------------------------------------------------------
     6. SCROLL REVEAL (fade-up)
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------
     6b. FAQ ACCORDION — smooth expand/collapse, one open at a time
  ----------------------------------------------------------- */
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Tutup semua item lain supaya hanya satu jawaban terbuka sekaligus
      faqItems.forEach((other) => {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
        const otherAnswer = other.querySelector('.faq-item__answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /* -----------------------------------------------------------
     6c. FORM KRITIK & SARAN — susun pesan lalu buka Gmail
     (situs statis tanpa backend, jadi pengiriman akhir tetap
     lewat Gmail; form ini hanya membantu menyusun emailnya)
  ----------------------------------------------------------- */
  const feedbackForm = document.getElementById('feedbackForm');

  if (feedbackForm) {
    const nameInput = document.getElementById('feedbackName');
    const messageInput = document.getElementById('feedbackMessage');
    const messageRow = messageInput.closest('.feedback-form__row');
    const errorEl = document.getElementById('feedbackError');
    const successEl = document.getElementById('feedbackSuccess');
    const FEEDBACK_EMAIL = 'nyvoradigital@gmail.com'; // email tujuan kritik & saran

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (!message) {
        messageRow.classList.add('has-error');
        errorEl.hidden = false;
        messageInput.focus();
        successEl.hidden = true;
        return;
      }

      messageRow.classList.remove('has-error');
      errorEl.hidden = true;

      const subject = 'Kritik & Saran — Member Area Nyvora Digital';
      const bodyParts = [
        'Halo admin Nyvora Digital, saya ingin memberikan kritik/saran:',
        '',
        message,
        '',
        name ? `Dari: ${name}` : 'Dari: Member (tanpa nama)',
      ];

      const subjectParam = encodeURIComponent(subject);
      const bodyParam = encodeURIComponent(bodyParts.join('\n'));
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${FEEDBACK_EMAIL}&su=${subjectParam}&body=${bodyParam}`;

      window.open(gmailUrl, '_blank', 'noopener,noreferrer');

      successEl.hidden = false;
      feedbackForm.reset();
    });

    // Sembunyikan pesan error/sukses begitu user mulai mengetik ulang
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim()) {
        messageRow.classList.remove('has-error');
        errorEl.hidden = true;
      }
      successEl.hidden = true;
    });
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
     8. BACK TO TOP BUTTON
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