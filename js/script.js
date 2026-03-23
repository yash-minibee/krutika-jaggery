/* ============================================
   KRUTIKA NATURAL JAGGERY - MAIN SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Progress Bar ----
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    });
  }

  // ---- Sticky Navbar ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---- Mobile Nav Toggle ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ---- Animated Counters ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }
  const counterEls = document.querySelectorAll('.counter-num');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ---- Lazy Loading Images ----
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (lazyImgs.length) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  // ---- Modal System ----
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  // Define openModal & closeModal on window FIRST so inline onclick handlers can call them
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal || !modalOverlay) return;
    // Hide any previously open modal
    document.querySelectorAll('.modal-content').forEach(m => {
      m.style.display = 'none';
      m.style.opacity = '0';
    });
    modalOverlay.style.display = 'flex';
    // Use grid for product-modal (matches CSS), block for others
    modal.style.display = modal.classList.contains('product-modal') ? 'grid' : 'block';
    document.body.style.overflow = 'hidden';
    // Trigger fade-in on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalOverlay.style.opacity = '1';
        modal.style.opacity = '1';
      });
    });
  };

  window.closeModal = function() {
    if (!modalOverlay) return;
    modalOverlay.style.opacity = '0';
    document.querySelectorAll('.modal-content').forEach(m => { m.style.opacity = '0'; });
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      document.querySelectorAll('.modal-content').forEach(m => { m.style.display = 'none'; });
      document.body.style.overflow = '';
    }, 300);
  };

  // Alias used by inline onclick="openProductModal(...)"
  window.openProductModal = window.openModal;

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeModal();
    });
  }
  if (modalClose) {
    modalClose.addEventListener('click', window.closeModal);
  }
  // Support data-modal attribute pattern too
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => window.openModal(btn.getAttribute('data-modal')));
  });

  // ---- Product Filter (products page) ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          const show = cat === 'all' || cardCat === cat;
          // Use visibility toggle via class — preserves grid layout
          if (show) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #2D6A2D, #3D8B3D)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ---- Testimonial Slider ----
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(n) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === n);
    });
    currentSlide = n;
  }

  if (slides.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(i);
        startSlider();
      });
    });
    function startSlider() {
      slideInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
      }, 4500);
    }
    goToSlide(0);
    startSlider();
  }

  // ---- Hero Parallax ----
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroBg = heroSection.querySelector('.hero-bg');
      if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
  }

});
