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
  // Images that are already links are left alone.
  var content = document.getElementById('main_content');
  if (content) {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Enlarged image');
    var large = document.createElement('img');
    lightbox.appendChild(large);
    document.body.appendChild(lightbox);

    function closeLightbox() {
      document.body.classList.remove('lightbox-open');
      large.removeAttribute('src');
    }
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    content.querySelectorAll('img').forEach(function (img) {
      if (img.closest('a')) return;
      img.classList.add('zoomable');
      img.addEventListener('click', function () {
        large.src = img.currentSrc || img.src;
        large.alt = img.alt;
        document.body.classList.add('lightbox-open');
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
