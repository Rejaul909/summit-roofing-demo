/* Summit Roofing Co. — demo site interactions (no dependencies) */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero load-in ---------- */
  function startHero() { requestAnimationFrame(function () { doc.classList.add('is-loaded'); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startHero);
  else startHero();

  /* ---------- Hero loop video (progressive enhancement) ---------- */
  var heroVideo = document.querySelector('.hero__video');
  var saveData = navigator.connection && navigator.connection.saveData;
  if (heroVideo && !reduceMotion && !saveData) {
    var addSource = function (src, type) {
      if (!src) return;
      var s = document.createElement('source');
      s.src = src; s.type = type;
      heroVideo.appendChild(s);
    };
    heroVideo.muted = true; // required for autoplay on iOS/Chrome
    heroVideo.addEventListener('playing', function () { heroVideo.classList.add('is-playing'); }, { once: true });
    var startVideo = function () {
      // Sources are attached only now (after window load), so the video never
      // competes with the page's critical resources.
      addSource(heroVideo.dataset.srcWebm, 'video/webm');
      addSource(heroVideo.dataset.srcMp4, 'video/mp4');
      heroVideo.load();
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked or file missing: keep the photo */ });
    };
    // Wait until the page has loaded so the video never competes with the hero photo / CSS.
    if (document.readyState === 'complete') startVideo();
    else window.addEventListener('load', startVideo, { once: true });
    // Pause when the hero is off-screen to save battery.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (!heroVideo.classList.contains('is-playing')) return;
        entries[0].isIntersecting ? heroVideo.play().catch(function () {}) : heroVideo.pause();
      }).observe(heroVideo);
    }
  }

  /* ---------- Image fallback ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    function fail() { if (img.parentElement) img.parentElement.classList.add('img-failed'); }
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener('error', fail, { once: true });
  });

  /* ---------- Header state ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScrollHeader();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    var first = menu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(restoreFocus) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    setTimeout(function () { menu.hidden = true; }, reduceMotion ? 0 : 300);
    if (restoreFocus !== false && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', function () {
    toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    // Simple focus trap inside the open menu (+ toggle button)
    if (e.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
      var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) {
    if (mq.matches && toggle.getAttribute('aria-expanded') === 'true') closeMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // light stagger for siblings revealed together
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }) : [];
        var idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll('.nav__link');
  var linkMap = {};
  navLinks.forEach(function (a) { linkMap[a.getAttribute('href').slice(1)] = a; });
  var spySections = Object.keys(linkMap).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function updateSpy() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    spySections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    // the FAQ link stays active through contact
    navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
    if (current && linkMap[current]) { linkMap[current].classList.add('is-active'); linkMap[current].setAttribute('aria-current', 'true'); }
  }

  /* ---------- Process progress rail ---------- */
  var process = document.querySelector('.process');
  var fill = document.querySelector('.process__fill');
  function updateRail() {
    if (!process || !fill) return;
    var r = process.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (r.height * 0.75);
    p = Math.max(0, Math.min(1, p));
    fill.style.setProperty('--progress', p.toFixed(3));
  }

  /* ---------- Mobile sticky CTA ---------- */
  var mobileCta = document.querySelector('.mobile-cta');
  var hero = document.querySelector('.hero');
  var contact = document.getElementById('contact');
  function updateCta() {
    if (!mobileCta) return;
    var pastHero = hero.getBoundingClientRect().bottom < 0;
    var cr = contact.getBoundingClientRect();
    var atContact = cr.top < window.innerHeight && cr.bottom > 0;
    var show = pastHero && !atContact && !document.body.classList.contains('menu-open');
    mobileCta.classList.toggle('is-visible', show);
    mobileCta.setAttribute('aria-hidden', show ? 'false' : 'true');
    mobileCta.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
  }

  /* ---------- Scroll loop (rAF-throttled) ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader(); updateSpy(); updateRail(); updateCta();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Before / after slider ---------- */
  var stage = document.querySelector('.ba__stage');
  var range = document.getElementById('ba-range');
  if (stage && range) {
    var setPos = function () { stage.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', setPos);
    setPos();
    range.setAttribute('aria-valuetext', 'Showing ' + range.value + '% before');
    range.addEventListener('change', function () { range.setAttribute('aria-valuetext', 'Showing ' + range.value + '% before'); });
  }

  /* ---------- Testimonials ---------- */
  var quotesRoot = document.querySelector('[data-quotes]');
  if (quotesRoot) {
    var quotes = quotesRoot.querySelectorAll('.quote');
    var counter = quotesRoot.querySelector('[data-quote-current]');
    var current = 0;
    var timer = null;
    var show = function (i) {
      current = (i + quotes.length) % quotes.length;
      quotes.forEach(function (q, n) {
        q.classList.toggle('is-active', n === current);
        q.setAttribute('aria-hidden', n === current ? 'false' : 'true');
      });
      counter.textContent = String(current + 1).padStart(2, '0');
    };
    var restart = function () {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { show(current + 1); }, 7000);
    };
    quotesRoot.querySelector('[data-quote-prev]').addEventListener('click', function () { show(current - 1); restart(); });
    quotesRoot.querySelector('[data-quote-next]').addEventListener('click', function () { show(current + 1); restart(); });
    quotesRoot.addEventListener('mouseenter', function () { clearInterval(timer); });
    quotesRoot.addEventListener('mouseleave', restart);
    quotesRoot.addEventListener('focusin', function () { clearInterval(timer); });
    show(0); restart();
  }

  /* ---------- FAQ: one open at a time + smooth height ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var summary = item.querySelector('summary');
    var body = item.querySelector('.faq-item__body');
    summary.addEventListener('click', function (e) {
      if (reduceMotion || !body.animate) return; // native behaviour
      e.preventDefault();
      if (item.open) {
        var h = body.offsetHeight;
        body.animate([{ height: h + 'px' }, { height: '0px' }], { duration: 280, easing: 'ease' }).onfinish = function () { item.open = false; };
      } else {
        faqItems.forEach(function (other) { if (other !== item && other.open) other.open = false; });
        item.open = true;
        var h2 = body.offsetHeight;
        body.animate([{ height: '0px' }, { height: h2 + 'px' }], { duration: 320, easing: 'ease' });
      }
    });
  });

  /* ---------- Service rows preselect the form ---------- */
  var serviceSelect = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (serviceSelect) serviceSelect.value = link.getAttribute('data-service');
    });
  });

  /* ---------- Estimate form: validation + real submission (Web3Forms) ---------- */
  var form = document.getElementById('estimate-form');
  var success = document.getElementById('form-success');
  if (form) {
    var cfg = window.SUMMIT_CONFIG || {};
    var statusBox = document.getElementById('form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.querySelector('.btn__label');
    var defaultLabel = submitLabel.textContent;
    var submitting = false;

    var fields = {
      name: { el: form.querySelector('#f-name'), err: form.querySelector('#f-name-err') },
      phone: { el: form.querySelector('#f-phone'), err: form.querySelector('#f-phone-err') },
      email: { el: form.querySelector('#f-email'), err: form.querySelector('#f-email-err') },
      zip: { el: form.querySelector('#f-zip'), err: form.querySelector('#f-zip-err') },
      service: { el: form.querySelector('#f-service'), err: form.querySelector('#f-service-err') }
    };

    var rules = {
      name: function (v) {
        v = v.trim();
        if (!v) return 'Please enter your name.';
        if (v.length < 2) return 'Name looks too short.';
        return '';
      },
      phone: function (v) {
        var d = v.replace(/\D/g, '');
        if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
        if (!d) return 'Please enter a phone number.';
        if (d.length !== 10) return 'Enter a 10-digit US phone number.';
        if (/^[01]/.test(d)) return 'US area codes can’t start with 0 or 1.';
        return '';
      },
      email: function (v) {
        v = v.trim();
        if (!v) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, like name@example.com.';
        return '';
      },
      zip: function (v) {
        v = v.trim();
        if (!v) return 'Please enter your ZIP code.';
        if (!/^\d{5}(-\d{4})?$/.test(v)) return 'Enter a 5-digit US ZIP code.';
        return '';
      },
      service: function (v) { return v ? '' : 'Choose the service you need.'; }
    };

    var validate = function (key) {
      var f = fields[key];
      var msg = rules[key](f.el.value, f.el);
      f.err.textContent = msg;
      f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    // Format phone as user types: (555) 555-5555
    fields.phone.el.addEventListener('input', function (e) {
      var el = e.target;
      var d = el.value.replace(/\D/g, '');
      if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
      d = d.slice(0, 10);
      var out = d;
      if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
      else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
      else if (d.length > 0) out = '(' + d;
      if (e.inputType && e.inputType.indexOf('delete') === 0 && el.value.length < out.length) return;
      el.value = out;
    });
    fields.zip.el.addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/[^\d-]/g, '');
    });

    Object.keys(fields).forEach(function (key) {
      var el = fields[key].el;
      var evt = el.tagName === 'SELECT' ? 'change' : 'blur';
      el.addEventListener(evt, function () { validate(key); });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validate(key);
      });
    });

    // Status messages are built from fixed text only (never from server responses).
    var phoneLink = function () {
      var a = document.createElement('a');
      a.href = cfg.businessPhoneHref || 'tel:+15550107700';
      a.textContent = cfg.businessPhoneDisplay || '(555) 010-7700';
      return a;
    };
    var showStatus = function (title, text, ownerNote) {
      statusBox.textContent = '';
      var strong = document.createElement('strong');
      strong.textContent = title;
      statusBox.appendChild(strong);
      statusBox.appendChild(document.createTextNode(' ' + text + ' '));
      statusBox.appendChild(phoneLink());
      statusBox.appendChild(document.createTextNode('.'));
      if (ownerNote) {
        var note = document.createElement('span');
        note.className = 'form__status-note';
        note.textContent = ownerNote;
        statusBox.appendChild(note);
      }
      statusBox.hidden = false;
    };
    var clearStatus = function () { statusBox.hidden = true; statusBox.textContent = ''; };

    var setLoading = function (on) {
      submitting = on;
      submitBtn.disabled = on;
      submitBtn.classList.toggle('is-loading', on);
      form.setAttribute('aria-busy', on ? 'true' : 'false');
      submitLabel.textContent = on ? 'Sending your request…' : defaultLabel;
    };

    var showSuccess = function () {
      form.reset();
      Object.keys(fields).forEach(function (k) { fields[k].el.removeAttribute('aria-invalid'); fields[k].err.textContent = ''; });
      form.hidden = true;
      success.hidden = false;
      success.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return; // prevent duplicate submissions

      var firstBad = null;
      Object.keys(fields).forEach(function (key) {
        if (!validate(key) && !firstBad) firstBad = fields[key].el;
      });
      if (firstBad) { firstBad.focus(); return; }
      clearStatus();

      var key = String(cfg.web3formsAccessKey || '').trim();
      if (!key) {
        showStatus('This form isn’t connected yet, so your request was not sent.',
          'Please call us instead at', 'Site owner: add your Web3Forms Access Key in assets/js/config.js (see README).');
        return;
      }
      if (navigator.onLine === false) {
        showStatus('You appear to be offline, so your request was not sent.', 'Check your connection and try again, or call us at');
        return;
      }

      var payload = {};
      new FormData(form).forEach(function (value, name) { payload[name] = typeof value === 'string' ? value.trim() : value; });
      payload.access_key = key;
      payload.replyto = payload.email;

      setLoading(true);
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, cfg.requestTimeoutMs || 15000);

      fetch(cfg.formEndpoint || form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            // Only a confirmed success from the form service counts as success.
            if (res.ok && data && data.success === true) return true;
            throw new Error('Form service rejected the submission (' + res.status + ')');
          });
        })
        .then(function () {
          clearTimeout(timer);
          setLoading(false);
          showSuccess();
        })
        .catch(function (err) {
          clearTimeout(timer);
          setLoading(false);
          var timedOut = err && err.name === 'AbortError';
          showStatus(timedOut ? 'The request timed out, so it may not have been sent.' : 'Sorry, your request could not be sent.',
            'Please try again in a moment, or call us at');
          if (window.console) console.warn('[estimate form]', err);
        });
    });

    document.getElementById('form-reset').addEventListener('click', function () {
      clearStatus();
      success.hidden = true;
      form.hidden = false;
      fields.name.el.focus();
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
