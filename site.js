// Shared footer and clickable contact links

function intlPhone(n) {
  n = String(n).replace(/[\s\-()]/g, '');
  if (n.indexOf('+') === 0) return n;
  if (n.indexOf('254') === 0) return '+' + n;
  if (n.indexOf('0') === 0) return '+254' + n.substring(1);
  return '+254' + n;
}

function renderFooter() {
  var f = document.getElementById('siteFooter');
  if (!f) return;
  f.innerHTML =
    '<footer><div class="container">' +
      '<div class="footer-grid">' +
        '<div><h4>DOOMEY</h4><p style="color:#b5b5b8">Discover Skilled Hands. Build Great Things.</p></div>' +
        '<div><h4>Explore</h4><a href="explore.html">Products</a><a href="find-welder.html">Find a Welder</a><a href="register-fabricator.html">Become a Fabricator</a></div>' +
        '<div><h4>Company</h4><a href="about.html">About DOOMEY</a><a href="contact.html">Contact Us</a></div>' +
        '<div><h4>Legal</h4><a href="terms.html">Terms and Conditions</a><a href="privacy.html">Privacy Policy</a></div>' +
      '</div>' +
      '<div class="footer-bottom">&copy; 2026 DOOMEY. All rights reserved.</div>' +
    '</div></footer>';
}

function fillContactLinks() {
  if (typeof SITE === 'undefined') return;
  document.querySelectorAll('[data-contact="email"]').forEach(function (a) {
    a.href = 'mailto:' + SITE.email;
    a.textContent = SITE.email;
  });
  document.querySelectorAll('[data-contact="phone"]').forEach(function (a) {
    a.href = 'tel:' + intlPhone(SITE.phone);
    a.textContent = SITE.phone;
  });
  document.querySelectorAll('[data-contact="whatsapp"]').forEach(function (a) {
    a.href = 'https://wa.me/' + intlPhone(SITE.whatsapp).replace('+', '');
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

renderFooter();
fillContactLinks();
