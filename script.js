/* ============================================================
   PORTFOLIO — INTERACTIVE SCRIPTS
   MD Zahin Uddin Nirob
   ============================================================ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────
     CUSTOM CURSOR
  ──────────────────────────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animFollower() {
    fx += (mouseX - fx) * 0.11;
    fy += (mouseY - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  /* Hover expand */
  const hoverEls = document.querySelectorAll(
    'a, button, .skill-tag, .project-card, .hobby-card, .service-item, .building-card, .ps-card, .flow-step'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hov');
      follower.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hov');
      follower.classList.remove('hov');
    });
  });

  /* Hide cursor when outside window */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });

  /* ────────────────────────────────────────────────────────
     HERO LOAD ANIMATION
  ──────────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');

    const animEls = document.querySelectorAll('.animate-in');
    animEls.forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('loaded');
      }, 200 + delay * 130);
    });
  });

  /* ────────────────────────────────────────────────────────
     NAVIGATION — scroll hide/show + background blur
  ──────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastY = 0, ticking = false;

  function updateNav() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    nav.classList.toggle('hidden',   y > lastY && y > 220);
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + nav.offsetHeight + 40;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ────────────────────────────────────────────────────────
     HAMBURGER MENU
  ──────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden',  String(!open));
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  /* ────────────────────────────────────────────────────────
     SCROLL REVEAL — Intersection Observer
  ──────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      /* Stagger sibling reveals slightly */
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx, 4) * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  /* ────────────────────────────────────────────────────────
     SMOOTH SCROLL (for all anchor links)
  ──────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────────────────────────
     PHOTO PLACEHOLDER
  ──────────────────────────────────────────────────────── */
  const photo       = document.getElementById('profile-photo');
  const placeholder = document.getElementById('photo-placeholder');

  if (photo && placeholder) {
    photo.addEventListener('load',  () => { placeholder.style.display = 'none'; });
    photo.addEventListener('error', () => {
      photo.style.display = 'none';
      placeholder.style.display = 'flex';
    });
    /* If already cached and loaded */
    if (photo.complete && photo.naturalWidth > 0) {
      placeholder.style.display = 'none';
    }
  }

  /* ────────────────────────────────────────────────────────
     FOOTER YEAR
  ──────────────────────────────────────────────────────── */
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ────────────────────────────────────────────────────────
     PROCESS FLOW — scroll hint on mobile
  ──────────────────────────────────────────────────────── */
  const processWrap = document.querySelector('.process-scroll-wrap');
  if (processWrap) {
    let isDragging = false, startX = 0, scrollLeft = 0;

    processWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX     = e.pageX - processWrap.offsetLeft;
      scrollLeft = processWrap.scrollLeft;
      processWrap.style.cursor = 'grabbing';
    });
    processWrap.addEventListener('mouseleave', () => { isDragging = false; processWrap.style.cursor = 'grab'; });
    processWrap.addEventListener('mouseup',    () => { isDragging = false; processWrap.style.cursor = 'grab'; });
    processWrap.addEventListener('mousemove',  (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - processWrap.offsetLeft;
      const walk = (x - startX) * 1.2;
      processWrap.scrollLeft = scrollLeft - walk;
    });
  }

  /* ────────────────────────────────────────────────────────
     SKILL TAG — subtle ripple on click
  ──────────────────────────────────────────────────────── */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(0.93)';
      setTimeout(() => { tag.style.transform = ''; }, 180);
    });
  });

  /* ────────────────────────────────────────────────────────
     RESEARCH FLOW — auto-pulse highlight loop
  ──────────────────────────────────────────────────────── */
  const flowSteps = document.querySelectorAll('.flow-step');
  if (flowSteps.length > 0) {
    let current = 0;
    function pulseFlow() {
      flowSteps.forEach((s, i) => {
        s.style.background = i === current ? 'var(--bg)' : '';
      });
      current = (current + 1) % flowSteps.length;
    }
    setInterval(pulseFlow, 1600);
  }

})();
