/* Pure Source — JavaScript du thème (sans dépendance) */
(function () {
  'use strict';

  var theme = window.theme || {};

  /* ---------- Utilitaires ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || theme.moneyFormat || '{{amount}} €';
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = precision == null ? 2 : precision;
      thousands = thousands || ',';
      decimal = decimal || '.';
      if (isNaN(number) || number == null) return 0;
      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsPart = parts[1] ? decimal + parts[1] : '';
      return dollars + centsPart;
    }
    var match = formatString.match(placeholderRegex);
    switch (match ? match[1] : 'amount') {
      case 'amount': value = formatWithDelimiters(cents, 2); break;
      case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
      case 'amount_with_space_separator': value = formatWithDelimiters(cents, 2, ' ', ','); break;
      case 'amount_no_decimals_with_space_separator': value = formatWithDelimiters(cents, 0, ' ', ','); break;
      case 'amount_with_apostrophe_separator': value = formatWithDelimiters(cents, 2, "'", '.'); break;
      default: value = formatWithDelimiters(cents, 2);
    }
    return formatString.replace(placeholderRegex, value);
  }

  /* ---------- Apparition au scroll ---------- */
  function initReveal(ctx) {
    var items = qsa('.reveal:not(.is-visible)', ctx);
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Barre d'annonces ---------- */
  function initAnnouncements(ctx) {
    qsa('[data-announcement-bar]', ctx).forEach(function (bar) {
      if (bar._timer) clearInterval(bar._timer);
      var slides = qsa('.announcement-bar__slide', bar);
      if (slides.length < 2) return;
      var speed = parseInt(bar.getAttribute('data-speed'), 10) || 5;
      var i = 0;
      bar._timer = setInterval(function () {
        if (window.matchMedia('(min-width: 990px)').matches && bar.classList.contains('announcement-bar--inline')) return;
        slides[i].classList.remove('is-active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('is-active');
      }, speed * 1000);
    });
  }

  /* ---------- Comptes à rebours ---------- */
  function initCountdowns(ctx) {
    qsa('[data-countdown]', ctx).forEach(function (el) {
      if (el._timer) clearInterval(el._timer);
      var mode = el.getAttribute('data-mode');
      var end;
      if (mode === 'date') {
        end = new Date(el.getAttribute('data-end')).getTime();
      } else {
        // Minuit (heure locale du visiteur) : compte à rebours quotidien
        var d = new Date(); d.setHours(24, 0, 0, 0); end = d.getTime();
      }
      function tick() {
        var diff = Math.max(0, end - Date.now());
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        var parts = el.querySelectorAll('span');
        if (parts.length === 3) {
          parts[0].textContent = String(h).padStart(2, '0') + 'h';
          parts[1].textContent = String(m).padStart(2, '0') + 'm';
          parts[2].textContent = String(s).padStart(2, '0') + 's';
        }
        if (diff === 0 && mode === 'date') {
          var wrapper = el.closest('[data-countdown-wrapper]');
          if (wrapper && wrapper.getAttribute('data-hide-on-end') === 'true') wrapper.hidden = true;
          clearInterval(el._timer);
        }
      }
      tick();
      el._timer = setInterval(tick, 1000);
    });
  }

  /* ---------- Header ---------- */
  function initHeader() {
    var header = qs('.site-header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Tiroirs (menu mobile, panier) ---------- */
  var lastFocus = null;
  function openDrawer(drawer) {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    var focusable = qs('button, a, input', qs('.drawer__panel', drawer));
    if (focusable) setTimeout(function () { focusable.focus(); }, 50);
  }
  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-drawer-open]');
    if (opener) {
      var target = document.getElementById(opener.getAttribute('data-drawer-open'));
      if (target) { e.preventDefault(); openDrawer(target); }
      return;
    }
    var closer = e.target.closest('[data-drawer-close]');
    if (closer) { e.preventDefault(); closeDrawer(closer.closest('.drawer')); return; }

    var searchToggle = e.target.closest('[data-search-toggle]');
    if (searchToggle) {
      var bar = document.getElementById('HeaderSearch');
      if (bar) {
        e.preventDefault();
        bar.hidden = !bar.hidden;
        if (!bar.hidden) { var input = qs('input', bar); if (input) input.focus(); }
      }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') qsa('.drawer.is-open').forEach(closeDrawer);
  });

  /* ---------- Panier (AJAX) ---------- */
  function cartSections() {
    return qs('#CartDrawer') ? 'cart-drawer' : '';
  }

  function renderCartDrawer(sections) {
    if (!sections || !sections['cart-drawer']) return;
    var html = new DOMParser().parseFromString(sections['cart-drawer'], 'text/html');
    var fresh = html.querySelector('#CartDrawer [data-cart-drawer-inner]');
    var current = qs('#CartDrawer [data-cart-drawer-inner]');
    if (fresh && current) current.innerHTML = fresh.innerHTML;
    var countEl = html.querySelector('[data-cart-count-value]');
    if (countEl) updateCartCount(parseInt(countEl.getAttribute('data-cart-count-value'), 10));
  }

  function updateCartCount(count) {
    qsa('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  function refreshCartCount() {
    fetch(theme.routes.cart + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { updateCartCount(cart.item_count); })
      .catch(function () {});
  }

  function addToCart(form) {
    var button = qs('[type="submit"]', form);
    var errorEl = qs('[data-form-error]', form.closest('[data-product-section]') || form);
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
    if (button) { button.classList.add('loading'); button.setAttribute('aria-disabled', 'true'); }

    var formData = new FormData(form);
    var sections = cartSections();
    if (sections) {
      formData.append('sections', sections);
      formData.append('sections_url', window.location.pathname);
    }

    return fetch(theme.routes.cartAdd + '.js', {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: formData
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.status) {
          if (errorEl) { errorEl.textContent = res.description || res.message || theme.strings.error; errorEl.hidden = false; }
          return;
        }
        if (theme.cartType === 'drawer' && qs('#CartDrawer')) {
          renderCartDrawer(res.sections);
          openDrawer(qs('#CartDrawer'));
        } else {
          window.location = theme.routes.cart;
        }
      })
      .catch(function () {
        if (errorEl) { errorEl.textContent = theme.strings.error; errorEl.hidden = false; }
      })
      .finally(function () {
        if (button) { button.classList.remove('loading'); button.removeAttribute('aria-disabled'); }
      });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-product-form]');
    if (!form) return;
    if (!window.fetch) return;
    e.preventDefault();
    addToCart(form);
  });

  function changeLine(line, quantity) {
    var drawer = qs('#CartDrawer');
    if (drawer) drawer.classList.add('is-loading');
    return fetch(theme.routes.cartChange + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity, sections: cartSections(), sections_url: window.location.pathname })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.status) { alert(res.description || res.message); return; }
        renderCartDrawer(res.sections);
      })
      .finally(function () { if (drawer) drawer.classList.remove('is-loading'); });
  }

  document.addEventListener('click', function (e) {
    var remove = e.target.closest('[data-cart-remove]');
    if (remove && remove.closest('#CartDrawer')) {
      e.preventDefault();
      changeLine(parseInt(remove.getAttribute('data-line'), 10), 0);
    }
  });

  /* ---------- Sélecteurs de quantité ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty-btn]');
    if (!btn) return;
    e.preventDefault();
    var wrapper = btn.closest('.quantity');
    var input = qs('input', wrapper);
    var min = parseInt(input.min, 10) || 0;
    var val = parseInt(input.value, 10) || 0;
    val = btn.getAttribute('data-qty-btn') === 'plus' ? val + 1 : Math.max(min, val - 1);
    input.value = val;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.addEventListener('change', function (e) {
    var input = e.target;
    if (input.matches && input.matches('[data-cart-line-qty]')) {
      if (input.closest('#CartDrawer')) {
        changeLine(parseInt(input.getAttribute('data-line'), 10), parseInt(input.value, 10));
      } else {
        var form = input.closest('form');
        if (form) form.submit();
      }
    }
  });

  /* ---------- Page produit : variantes ---------- */
  function initProduct(section) {
    var jsonEl = qs('[data-product-json]', section);
    if (!jsonEl) return;
    var product = JSON.parse(jsonEl.textContent);
    var form = qs('form[data-product-form]', section);
    var idInput = form ? qs('input[name="id"]', form) : null;
    var picker = qs('[data-variant-picker]', section);

    function currentOptions() {
      if (!picker) return [];
      return qsa('[data-option-index]', picker).map(function (group) {
        var checked = qs('input:checked', group);
        var select = qs('select', group);
        return checked ? checked.value : (select ? select.value : null);
      });
    }

    function findVariant(options) {
      return product.variants.find(function (v) {
        return v.options.every(function (opt, i) { return opt === options[i]; });
      });
    }

    function updateAvailability(options) {
      if (!picker) return;
      qsa('[data-option-index]', picker).forEach(function (group) {
        var index = parseInt(group.getAttribute('data-option-index'), 10);
        qsa('input', group).forEach(function (input) {
          var test = options.slice();
          test[index] = input.value;
          var v = findVariant(test);
          input.classList.toggle('is-unavailable', !v || !v.available);
        });
      });
    }

    function updateBundles(variant) {
      qsa('[data-bundle-option]', section).forEach(function (opt) {
        var qty = parseInt(opt.getAttribute('data-qty'), 10) || 1;
        var discount = parseFloat(opt.getAttribute('data-discount')) || 0;
        var full = variant.price * qty;
        var discounted = Math.round(full * (1 - discount / 100));
        var priceEl = qs('[data-bundle-price]', opt);
        var compareEl = qs('[data-bundle-compare]', opt);
        var compareBase = variant.compare_at_price && variant.compare_at_price > variant.price ? variant.compare_at_price * qty : full;
        if (priceEl) priceEl.textContent = formatMoney(discounted);
        if (compareEl) {
          compareEl.textContent = compareBase > discounted ? formatMoney(compareBase) : '';
        }
      });
    }

    function updateVariant(variant) {
      var buttons = qsa('[data-add-button]', section);
      if (!variant) {
        buttons.forEach(function (b) { b.disabled = true; qs('[data-add-text]', b).textContent = theme.strings.unavailable; });
        return;
      }
      if (idInput) idInput.value = variant.id;
      qsa('[data-sticky-variant-id]').forEach(function (i) { i.value = variant.id; });

      qsa('[data-price-wrapper]', section).forEach(function (wrap) {
        var onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
        wrap.classList.toggle('price--on-sale', !!onSale);
        var p = qs('[data-price]', wrap); if (p) p.textContent = formatMoney(variant.price);
        var c = qs('[data-compare-price]', wrap);
        if (c) { c.textContent = onSale ? formatMoney(variant.compare_at_price) : ''; c.hidden = !onSale; }
        var b = qs('[data-sale-badge]', wrap);
        if (b) {
          b.hidden = !onSale;
          if (onSale) {
            var style = b.getAttribute('data-style') || wrap.getAttribute('data-badge-style');
            if (style === 'percent' || !style) {
              b.textContent = '-' + Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price) + '%';
            } else if (style === 'amount') {
              b.textContent = '-' + formatMoney(variant.compare_at_price - variant.price);
            } else {
              b.textContent = wrap.getAttribute('data-sale-text') || '';
            }
          }
        }
      });

      buttons.forEach(function (b) {
        b.disabled = !variant.available;
        var t = qs('[data-add-text]', b);
        if (t) t.textContent = variant.available ? (b.getAttribute('data-label') || theme.strings.addToCart) : theme.strings.soldOut;
      });

      updateBundles(variant);

      // Image de la variante
      if (variant.featured_media) {
        var slide = qs('[data-media-id="' + variant.featured_media.id + '"]', section);
        if (slide) goToSlide(section, slide);
      }

      // Libellés d'option sélectionnée
      qsa('[data-selected-value]', section).forEach(function (el) {
        var idx = parseInt(el.getAttribute('data-selected-value'), 10);
        el.textContent = variant.options[idx];
      });

      if (section.hasAttribute('data-update-url') && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
      }
    }

    if (picker) {
      picker.addEventListener('change', function () {
        var opts = currentOptions();
        updateAvailability(opts);
        updateVariant(findVariant(opts));
      });
      updateAvailability(currentOptions());
    }

    // Offres groupées (quantité)
    var qtyInput = form ? qs('input[name="quantity"]', form) : null;
    qsa('[data-bundle-option] input', section).forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (qtyInput) qtyInput.value = radio.value;
        var visibleQty = qs('[data-main-qty]', section);
        if (visibleQty) visibleQty.value = radio.value;
      });
    });
    var visibleQty = qs('[data-main-qty]', section);
    if (visibleQty && qtyInput && visibleQty !== qtyInput) {
      visibleQty.addEventListener('change', function () { qtyInput.value = visibleQty.value; });
    }

    var initial = product.variants.find(function (v) { return idInput && String(v.id) === String(idInput.value); }) || product.variants[0];
    if (initial) updateBundles(initial);

    // Barre d'ajout collante
    var sticky = qs('[data-sticky-atc]');
    var mainBtn = qs('[data-add-button]', section);
    if (sticky && mainBtn && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        sticky.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
      }).observe(mainBtn);
    }
  }

  /* ---------- Galerie produit ---------- */
  function goToSlide(ctx, slide) {
    var track = slide.parentElement;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    var id = slide.getAttribute('data-media-id');
    qsa('[data-thumb]', ctx).forEach(function (t) {
      t.setAttribute('aria-current', t.getAttribute('data-thumb') === id ? 'true' : 'false');
    });
  }

  function initGallery(ctx) {
    qsa('[data-gallery]', ctx).forEach(function (gallery) {
      var track = qs('.product-gallery__slides', gallery);
      if (!track) return;
      var slides = qsa('.product-gallery__slide', track);
      qsa('[data-thumb]', gallery).forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var slide = qs('[data-media-id="' + thumb.getAttribute('data-thumb') + '"]', track);
          if (slide) goToSlide(gallery, slide);
        });
      });
      function currentIndex() {
        return Math.round(track.scrollLeft / track.clientWidth);
      }
      var prev = qs('[data-gallery-prev]', gallery);
      var next = qs('[data-gallery-next]', gallery);
      if (prev) prev.addEventListener('click', function () { var i = Math.max(0, currentIndex() - 1); goToSlide(gallery, slides[i]); });
      if (next) next.addEventListener('click', function () { var i = (currentIndex() + 1) % slides.length; goToSlide(gallery, slides[i]); });
      track.addEventListener('scroll', function () {
        clearTimeout(track._t);
        track._t = setTimeout(function () {
          var s = slides[currentIndex()];
          if (!s) return;
          var id = s.getAttribute('data-media-id');
          qsa('[data-thumb]', gallery).forEach(function (t) {
            t.setAttribute('aria-current', t.getAttribute('data-thumb') === id ? 'true' : 'false');
          });
        }, 100);
      }, { passive: true });
    });
  }

  /* ---------- Carrousels génériques ---------- */
  function initSliders(ctx) {
    qsa('[data-slider]', ctx).forEach(function (slider) {
      var track = qs('.slider__track', slider);
      if (!track) return;
      var step = function () {
        var item = track.firstElementChild;
        return item ? item.getBoundingClientRect().width + 24 : track.clientWidth;
      };
      var prev = qs('[data-slider-prev]', slider);
      var next = qs('[data-slider-next]', slider);
      if (prev) prev.onclick = function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); };
      if (next) next.onclick = function () {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: step(), behavior: 'smooth' });
      };
      var autoplay = parseInt(slider.getAttribute('data-autoplay'), 10);
      if (slider._auto) clearInterval(slider._auto);
      if (autoplay > 0 && next) {
        slider._auto = setInterval(function () {
          if (!slider.matches(':hover')) next.onclick();
        }, autoplay * 1000);
      }
    });
  }

  /* ---------- Vidéos différées ---------- */
  document.addEventListener('click', function (e) {
    var poster = e.target.closest('[data-video-poster]');
    if (!poster) return;
    var tpl = poster.parentElement.querySelector('template');
    if (!tpl) return;
    var content = tpl.content.cloneNode(true);
    poster.parentElement.appendChild(content);
    poster.remove();
    var v = poster.parentElement && poster.parentElement.querySelector('video');
    if (v) v.play();
  });

  /* ---------- Initialisation ---------- */
  function initAll(ctx) {
    initReveal(ctx);
    initAnnouncements(ctx);
    initCountdowns(ctx);
    initGallery(ctx);
    initSliders(ctx);
    qsa('[data-product-section]', ctx).forEach(initProduct);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initAll(document);
  });

  // Rechargement dans l'éditeur de thème Shopify
  document.addEventListener('shopify:section:load', function (e) {
    initAll(e.target);
    if (e.target.querySelector('.site-header')) initHeader();
  });
  document.addEventListener('shopify:section:select', function (e) {
    var drawer = e.target.querySelector('#CartDrawer');
    if (drawer) openDrawer(drawer);
  });
  document.addEventListener('shopify:section:deselect', function (e) {
    var drawer = e.target.querySelector('#CartDrawer');
    if (drawer) closeDrawer(drawer);
  });
  document.addEventListener('shopify:block:select', function (e) {
    var bar = e.target.closest('[data-announcement-bar]');
    if (bar) {
      qsa('.announcement-bar__slide', bar).forEach(function (s) { s.classList.remove('is-active'); });
      e.target.classList.add('is-active');
    }
    var details = e.target.closest('details') || (e.target.tagName === 'DETAILS' ? e.target : null);
    if (details) details.open = true;
  });

  window.addEventListener('pageshow', function (e) { if (e.persisted) refreshCartCount(); });

  theme.formatMoney = formatMoney;
  theme.openDrawer = openDrawer;
  theme.closeDrawer = closeDrawer;
  window.theme = theme;
})();
