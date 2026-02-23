/* Clean Leaf Microgreens — Optimized JavaScript */
(function(){
  'use strict';

  // Use requestIdleCallback for non-critical setup
  var ric = window.requestIdleCallback || function(cb){ setTimeout(cb, 1); };

  // --- Navbar Scroll Effect (passive, throttled) ---
  var navbar = document.querySelector('.navbar');
  var backToTop = document.querySelector('.back-to-top');
  var ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        backToTop.classList.toggle('visible', y > 500);
        ticking = false;
      });
    }
  }, { passive: true });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile Navigation ---
  var mobileToggle = document.querySelector('.mobile-toggle');
  var navMobile = document.querySelector('.nav-mobile-overlay');

  if (mobileToggle && navMobile) {
    mobileToggle.addEventListener('click', function() {
      var active = navMobile.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = active ? 'hidden' : '';
      mobileToggle.setAttribute('aria-expanded', active);
    });

    var links = navMobile.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // --- Scroll Reveal (IntersectionObserver, no delay computation) ---
  ric(function() {
    var fadeEls = document.querySelectorAll('.fade-up');
    if (!fadeEls.length) return;

    var observer = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < fadeEls.length; i++) {
      observer.observe(fadeEls[i]);
    }
  });

  // --- Smooth Scroll for Anchor Links ---
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      var offset = navbar.offsetHeight + 20;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });

  // --- CTA Form Handler ---
  var ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = ctaForm.querySelector('input[type="email"]');
      if (input && input.value) {
        var btn = ctaForm.querySelector('button');
        var orig = btn.innerHTML;
        btn.textContent = 'Thank you!';
        btn.style.background = '#4a7c28';
        input.value = '';
        setTimeout(function() {
          btn.innerHTML = orig;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  // --- Counter Animation (deferred, only when visible) ---
  ric(function() {
    var stats = document.querySelectorAll('.stat-number[data-target]');
    if (!stats.length) return;

    var cobs = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animateCounter(entries[i].target);
          cobs.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.5 });

    for (var i = 0; i < stats.length; i++) {
      cobs.observe(stats[i]);
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1500;
      var start = performance.now();

      function update(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  });

})();
