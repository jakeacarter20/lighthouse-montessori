/* Lighthouse Montessori Academy
   Three small jobs: the mobile menu, scroll reveals, and form validation.
   No scroll event listeners anywhere: everything observable uses
   IntersectionObserver so nothing runs on the scroll frame. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('nav-links');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close after tapping a link, so the anchor jump is visible.
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------- nav shadow once the page has moved ----------
     A zero-height sentinel at the top of the document. When it leaves the
     viewport the nav has something scrolled underneath it, so it gains a
     shadow. Cheaper and smoother than watching scrollY. */
  var navWrap = document.querySelector('.nav-wrap');
  if (navWrap && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
      navWrap.classList.toggle('stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- scroll reveals ----------
     Purpose: sequence the programme blocks and the outcome grid so they
     arrive in reading order instead of all at once. One pass, then the
     observer lets each element go. */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- enquiry form ----------
     Client side only. There is no endpoint behind this yet: see the comment
     above the form in index.html for how to connect one. */
  var form = document.getElementById('enquiry');

  if (form) {
    var done = document.getElementById('form-done');

    var checks = [
      { input: 'f-name',    error: 'e-name',    test: function (v) { return v.trim().length > 0; } },
      { input: 'f-email',   error: 'e-email',   test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
      { input: 'f-message', error: 'e-message', hint: 'h-message', test: function (v) { return v.trim().length > 0; } }
    ];

    function validate(check, showError) {
      var input = document.getElementById(check.input);
      var error = document.getElementById(check.error);
      var ok = check.test(input.value);
      var shown = !ok && showError;

      input.setAttribute('aria-invalid', String(!ok));
      input.closest('.field').classList.toggle('invalid', shown);
      if (error) error.hidden = !shown;

      // Point the field at its hint and, while it is failing, its error too.
      // An empty aria-describedby is not the same as no aria-describedby, so
      // the attribute gets removed rather than blanked.
      var describedBy = [];
      if (check.hint) describedBy.push(check.hint);
      if (shown) describedBy.push(check.error);
      if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));
      else input.removeAttribute('aria-describedby');

      return ok;
    }

    checks.forEach(function (check) {
      var input = document.getElementById(check.input);
      // Only re-validate on blur once the field has been touched, so the user
      // is not scolded while they are still typing their first character.
      input.addEventListener('blur', function () {
        if (input.value !== '') validate(check, true);
      });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('invalid')) validate(check, true);
      });
    });

    form.addEventListener('submit', function (e) {
      var firstBad = null;
      var allOk = true;

      checks.forEach(function (check) {
        var ok = validate(check, true);
        if (!ok) {
          allOk = false;
          if (!firstBad) firstBad = document.getElementById(check.input);
        }
      });

      if (!allOk) {
        e.preventDefault();
        firstBad.focus();
        return;
      }

      // No server behind this page, so the enquiry is handed to the visitor's
      // own mail app with everything already filled in. It works anywhere, with
      // no account to set up. If the form is later pointed at Formspree or a
      // similar handler, delete this whole branch and let it post normally.
      e.preventDefault();

      var value = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };

      var lines = [
        'Name: ' + value('f-name'),
        'Email: ' + value('f-email'),
        'Phone: ' + (value('f-phone') || 'not given'),
        'Program of interest: ' + (value('f-program') || 'no preference yet'),
        '',
        value('f-message')
      ];

      var href = 'mailto:Hello@LighthouseMontessoriAcademy.com'
        + '?subject=' + encodeURIComponent('Enquiry from ' + value('f-name'))
        + '&body=' + encodeURIComponent(lines.join('\n'));

      if (done) done.hidden = false;
      window.location.href = href;
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
