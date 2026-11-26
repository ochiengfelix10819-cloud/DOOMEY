// Photo viewer: tap a photo to see it full size, with next/previous, swipe and keyboard support
function dmLightbox(urls, startIndex, altText) {
  if (!urls || !urls.length) return;
  var index = startIndex || 0;
  var opener = document.activeElement;
  var startX = null;

  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');

  var img = document.createElement('img');
  img.className = 'lb-img';
  box.appendChild(img);

  var count = document.createElement('div');
  count.className = 'lb-count';
  count.setAttribute('aria-live', 'polite');
  box.appendChild(count);

  function button(cls, label, text, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lb-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.textContent = text;
    b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
    box.appendChild(b);
    return b;
  }

  function show() {
    img.src = urls[index];
    img.alt = (altText || 'Photo') + ' (photo ' + (index + 1) + ' of ' + urls.length + ')';
    count.textContent = urls.length > 1 ? (index + 1) + ' / ' + urls.length : '';
  }
  function step(d) { index = (index + d + urls.length) % urls.length; show(); }
  function close() {
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = prevOverflow;
    if (box.parentNode) box.parentNode.removeChild(box);
    if (opener && opener.focus) opener.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight' && urls.length > 1) step(1);
    else if (e.key === 'ArrowLeft' && urls.length > 1) step(-1);
  }

  var closeBtn = button('lb-close', 'Close photo viewer', '×', close);
  if (urls.length > 1) {
    button('lb-prev', 'Previous photo', '‹', function () { step(-1); });
    button('lb-next', 'Next photo', '›', function () { step(1); });
  }

  box.addEventListener('click', function (e) { if (e.target !== img) close(); });
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null || urls.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  var prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
  show();
  document.body.appendChild(box);
  closeBtn.focus();
}
