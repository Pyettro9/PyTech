/* ============================================================
   CLÍNICA LUMIÈRE — Interações
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Ano dinâmico no footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: sombra ao rolar ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    // Fecha ao clicar em um link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ: abre apenas um por vez ---------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Comparador Antes & Depois ---------- */
  var compare = document.getElementById('compare');
  var before = document.getElementById('compareBefore');
  var handle = document.getElementById('compareHandle');

  if (compare && before && handle) {
    var dragging = false;

    function setPosition(clientX) {
      var rect = compare.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    function startDrag(e) {
      dragging = true;
      compare.style.cursor = 'ew-resize';
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
      e.preventDefault();
    }
    function moveDrag(e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    }
    function endDrag() {
      dragging = false;
      compare.style.cursor = '';
    }

    handle.addEventListener('mousedown', startDrag);
    compare.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    handle.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('touchend', endDrag);

    // Acessibilidade por teclado
    handle.addEventListener('keydown', function (e) {
      var current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') current -= 4;
      else if (e.key === 'ArrowRight') current += 4;
      else return;
      current = Math.max(0, Math.min(100, current));
      before.style.clipPath = 'inset(0 ' + (100 - current) + '% 0 0)';
      handle.style.left = current + '%';
      handle.setAttribute('aria-valuenow', Math.round(current));
      e.preventDefault();
    });
  }
})();
