(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.matches('a')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Privacy-first outbound tracking hook. Sends events only if analytics is configured.
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var url;
    try {
      url = new URL(link.href, window.location.origin);
    } catch (e) {
      return;
    }

    if (url.origin === window.location.origin) return;

    var label = link.getAttribute('data-outbound') || 'outbound-link';

    if (typeof window.plausible === 'function') {
      window.plausible('Outbound Click', { props: { label: label, href: url.href } });
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'outbound_click',
        label: label,
        href: url.href
      });
    }
  });
})();
