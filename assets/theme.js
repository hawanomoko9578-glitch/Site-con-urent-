(function () {
  'use strict';

  /* ---------- Compte à rebours ---------- */
  function initCountdowns(root) {
    root.querySelectorAll('[data-countdown]').forEach(function (el) {
      if (el._cdInit) return;
      el._cdInit = true;
      var endAttr = el.getAttribute('data-end');
      var loopMs = (parseInt(el.getAttribute('data-hours'), 10) || 2) * 3600 * 1000;
      var end = endAttr ? new Date(endAttr).getTime() : NaN;
      var h = el.querySelector('[data-h]'), m = el.querySelector('[data-m]'), s = el.querySelector('[data-s]');
      function pad(n) { return String(n).padStart(2, '0'); }
      function tick() {
        var now = Date.now();
        var left;
        if (!isNaN(end)) {
          left = Math.max(0, end - now);
        } else {
          // Boucle : se relance automatiquement à chaque fin de période.
          left = loopMs - (now % loopMs);
        }
        var total = Math.floor(left / 1000);
        h.textContent = pad(Math.floor(total / 3600));
        m.textContent = pad(Math.floor((total % 3600) / 60));
        s.textContent = pad(total % 60);
      }
      tick();
      setInterval(tick, 1000);
    });
  }

  /* ---------- En-tête (transparent -> plein au scroll) + menu ---------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (header && header.classList.contains('site-header--transparent')) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    var drawer = document.querySelector('[data-drawer]');
    if (!drawer) return;
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-drawer-open]')) {
        drawer.hidden = false;
        document.body.style.overflow = 'hidden';
      } else if (e.target.closest('[data-drawer-close]')) {
        drawer.hidden = true;
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) {
        drawer.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Avant / après ---------- */
  function initBeforeAfter(root) {
    root.querySelectorAll('[data-before-after]').forEach(function (el) {
      var range = el.querySelector('.ba__range');
      if (!range || range._init) return;
      range._init = true;
      range.addEventListener('input', function () { el.style.setProperty('--pos', range.value + '%'); });
    });
  }

  /* ---------- Sliders génériques ---------- */
  function initSliders(root) {
    root.querySelectorAll('[data-slider]').forEach(function (slider) {
      var track = slider.querySelector('[data-slider-track]');
      if (!track || track._init) return;
      track._init = true;
      var prev = slider.querySelector('[data-slider-prev]');
      var next = slider.querySelector('[data-slider-next]');
      var count = slider.querySelector('[data-slider-count]');
      var progress = slider.querySelector('[data-slider-progress]');

      function step() {
        var item = track.firstElementChild;
        if (!item) return track.clientWidth;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return item.getBoundingClientRect().width + gap;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth;
        var ratio = max > 0 ? track.scrollLeft / max : 0;
        var visible = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
        if (progress) {
          progress.style.width = (visible * 100) + '%';
          progress.style.left = (ratio * (1 - visible) * 100) + '%';
        }
        if (count) {
          var pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
          var page = Math.min(pages, Math.round(ratio * (pages - 1)) + 1);
          count.textContent = page + ' / ' + pages;
        }
      }
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Vidéos clients ---------- */
  function initVideos(root) {
    root.querySelectorAll('[data-video-card]').forEach(function (card) {
      if (card._init) return;
      card._init = true;
      var video = card.querySelector('video');
      var btn = card.querySelector('.vid-card__play');
      if (!video || !btn) return;
      video.removeAttribute('controls');
      function toggle() {
        if (video.paused) {
          document.querySelectorAll('[data-video-card] video').forEach(function (v) { if (v !== video) v.pause(); });
          video.play();
        } else {
          video.pause();
        }
      }
      btn.addEventListener('click', toggle);
      video.addEventListener('click', toggle);
      video.addEventListener('play', function () { card.classList.add('is-playing'); });
      video.addEventListener('pause', function () { card.classList.remove('is-playing'); });
    });
  }

  /* ---------- Page produit ---------- */
  function initProduct(root) {
    root.querySelectorAll('[data-product-section]').forEach(function (section) {
      if (section._init) return;
      section._init = true;

      // Galerie
      var track = section.querySelector('[data-gallery-track]');
      var thumbs = Array.prototype.slice.call(section.querySelectorAll('.gallery__thumb'));
      function goTo(i) {
        if (!track) return;
        i = Math.max(0, Math.min(i, track.children.length - 1));
        track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
      }
      function currentIndex() { return track ? Math.round(track.scrollLeft / Math.max(1, track.clientWidth)) : 0; }
      thumbs.forEach(function (t) {
        t.addEventListener('click', function () { goTo(parseInt(t.getAttribute('data-index'), 10)); });
      });
      if (track) {
        track.addEventListener('scroll', function () {
          var idx = currentIndex();
          thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === idx); });
          var active = thumbs[idx];
          if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }, { passive: true });
      }
      var gp = section.querySelector('[data-gallery-prev]');
      var gn = section.querySelector('[data-gallery-next]');
      if (gp) gp.addEventListener('click', function () { goTo(currentIndex() - 1); });
      if (gn) gn.addEventListener('click', function () { goTo(currentIndex() + 1); });

      // Variantes
      var idInput = section.querySelector('[data-variant-id]');
      var addBtn = section.querySelector('[data-add-button]');
      var addLabel = section.querySelector('[data-add-label]');
      var defaultLabel = addLabel ? addLabel.textContent : '';
      var priceEl = section.querySelector('[data-price-current]');
      var compareEl = section.querySelector('[data-price-compare]');
      var titleEl = section.querySelector('[data-variant-title]');
      section.querySelectorAll('.variant-card input[type="radio"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          if (idInput) idInput.value = radio.value;
          if (titleEl) titleEl.textContent = radio.getAttribute('data-title');
          if (priceEl) priceEl.textContent = radio.getAttribute('data-price');
          if (compareEl) {
            var c = radio.getAttribute('data-compare');
            compareEl.textContent = c;
            compareEl.hidden = !c;
          }
          var available = radio.getAttribute('data-available') === 'true';
          if (addBtn) addBtn.disabled = !available;
          if (addLabel) addLabel.textContent = available ? defaultLabel : 'Épuisé';
          var mediaId = radio.getAttribute('data-media-id');
          if (mediaId && track) {
            var slides = Array.prototype.slice.call(track.children);
            var idx = slides.findIndex(function (s) { return s.getAttribute('data-media-id') === mediaId; });
            if (idx > -1) goTo(idx);
          }
          var url = new URL(window.location.href);
          url.searchParams.set('variant', radio.value);
          window.history.replaceState({}, '', url.toString());
        });
      });

      // Ajout au panier (AJAX, puis redirection panier ou mise à jour du compteur)
      var form = section.querySelector('[data-product-form]');
      var errorEl = section.querySelector('[data-form-error]');
      if (form && window.fetch) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (addBtn) addBtn.disabled = true;
          if (errorEl) errorEl.hidden = true;
          fetch(window.Shopify && Shopify.routes ? Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
          })
            .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
            .then(function (res) {
              if (!res.ok) throw new Error(res.data.description || res.data.message || 'Erreur');
              if (document.body.getAttribute('data-cart-redirect') !== 'false') {
                window.location.href = (window.Shopify && Shopify.routes ? Shopify.routes.root : '/') + 'cart';
                return;
              }
              return fetch('/cart.js').then(function (r) { return r.json(); }).then(function (cart) {
                document.querySelectorAll('[data-cart-count]').forEach(function (c) {
                  c.textContent = cart.item_count;
                  c.hidden = cart.item_count === 0;
                });
                if (addBtn) addBtn.disabled = false;
                if (addLabel) {
                  addLabel.textContent = '✓';
                  setTimeout(function () { addLabel.textContent = defaultLabel; }, 1500);
                }
              });
            })
            .catch(function (err) {
              if (errorEl) { errorEl.textContent = err.message; errorEl.hidden = false; }
              if (addBtn) addBtn.disabled = false;
            });
        });
      }

      // Barre d'achat collante
      var sticky = document.querySelector('[data-sticky-atc]');
      var anchor = section.querySelector('[data-buy-anchor]');
      if (sticky && anchor && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            sticky.hidden = en.isIntersecting || en.boundingClientRect.top > 0;
          });
        });
        io.observe(anchor);
        var go = sticky.querySelector('[data-sticky-go]');
        if (go) go.addEventListener('click', function () {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    });
  }

  /* ---------- Liens « #MainContent » : remonter vers le bouton d'achat s'il existe ---------- */
  function initBuyLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="#MainContent"]');
      if (!a) return;
      var anchor = document.querySelector('[data-buy-anchor]');
      if (anchor) {
        e.preventDefault();
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function initAll(root) {
    initCountdowns(root);
    initBeforeAfter(root);
    initSliders(root);
    initVideos(root);
    initProduct(root);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initBuyLinks();
    initAll(document);
  });

  // Éditeur de thème Shopify : réinitialiser une section rechargée
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
