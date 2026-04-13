(function () {
  'use strict';

  document.addEventListener('preloaderDone', init);
  // fallback if preloader already done
  if (!document.body.classList.contains('loading')) init();

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var section   = document.getElementById('jaggery-story');
    if (!section) return;

    var img       = section.querySelector('.js-img');
    var imgRing   = section.querySelector('.js-img-ring');
    var eyebrow   = section.querySelector('.js-eyebrow');
    var title     = section.querySelector('.js-title');
    var points    = section.querySelectorAll('.js-point');
    var gujarati  = section.querySelector('.js-gujarati-line');
    var gujCard   = section.querySelector('.js-guj-card');
    var cta       = section.querySelector('.js-cta');
    var badges    = section.querySelectorAll('.js-badge');

    // ── Image parallax + scale ──
    gsap.to(img, {
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Subtle ring float
    gsap.to(imgRing, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });

    // ── Main stagger timeline ──
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to(eyebrow, {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power3.out'
    })
    .to(title, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power3.out'
    }, '-=0.3')
    .to(points, {
      opacity: 1, y: 0,
      duration: 0.55, ease: 'power2.out',
      stagger: 0.15
    }, '-=0.3')
    .to(gujCard, {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out'
    }, '-=0.1')
    .to(gujarati, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.8, ease: 'back.out(1.4)'
    }, '-=0.1')
    .to(cta, {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out'
    }, '-=0.3');

    // Badges stagger separately
    gsap.to(badges, {
      opacity: 1, y: 0,
      duration: 0.5, ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section.querySelector('.js-trust-badges'),
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Set initial state for badges (CSS sets others via opacity:0)
    gsap.set(badges, { opacity: 0, y: 20 });
  }
})();
