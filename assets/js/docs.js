(function () {
  'use strict';

  // --- Mobile sidebar drawer -------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('sidebar-scrim');

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle) toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });
  if (sidebar) sidebar.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // --- Image lightbox ---------------------------------------------------------
  // Clicking an image in the page content shows it full size over the page.
  // Images that are already links are left alone. The images are focusable
  // and open with Enter or Space too; focus moves into the lightbox while
  // it's open and goes back to the image when it closes.
  var content = document.getElementById('main_content');
  if (content) {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Enlarged image, press Escape to close');
    lightbox.tabIndex = -1;
    var large = document.createElement('img');
    lightbox.appendChild(large);
    document.body.appendChild(lightbox);
    var opener = null;

    function openLightbox(img) {
      large.src = img.currentSrc || img.src;
      large.alt = img.alt;
      opener = img;
      document.body.classList.add('lightbox-open');
      lightbox.focus();
    }
    function closeLightbox() {
      if (!document.body.classList.contains('lightbox-open')) return;
      document.body.classList.remove('lightbox-open');
      large.removeAttribute('src');
      if (opener) opener.focus();
      opener = null;
    }
    lightbox.addEventListener('click', closeLightbox);
    lightbox.addEventListener('keydown', function (e) {
      // Nothing in the lightbox to tab to, so keep focus in it.
      if (e.key === 'Tab') e.preventDefault();
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    content.querySelectorAll('img').forEach(function (img) {
      if (img.closest('a')) return;
      img.classList.add('zoomable');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', (img.alt ? img.alt + ': ' : '') + 'enlarge image');
      img.addEventListener('click', function () { openLightbox(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); }
      });
    });
  }

  // --- "On this page" table of contents ------------------------------------
  var toc = document.getElementById('toc');
  var list = document.getElementById('toc-list');
  if (!content || !toc || !list) return;

  var headings = content.querySelectorAll('h2, h3');
  if (headings.length < 2) {
    toc.classList.add('is-empty');
    return;
  }

  var links = [];
  headings.forEach(function (h) {
    if (!h.id) return;
    var li = document.createElement('li');
    li.className = 'toc-' + h.tagName.toLowerCase();
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    links.push(a);
  });

  if (!links.length) {
    toc.classList.add('is-empty');
    return;
  }

  // Scroll-spy: highlight the heading nearest the top of the viewport.
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var current = null;
  function spy() {
    var top = null;
    headings.forEach(function (h) {
      var r = h.getBoundingClientRect();
      if (r.top <= 120) top = h;
    });
    var a = top ? byId[top.id] : links[0];
    if (a && a !== current) {
      if (current) current.classList.remove('active');
      a.classList.add('active');
      current = a;
    }
  }
  spy();
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { spy(); ticking = false; });
  }, { passive: true });
})();
