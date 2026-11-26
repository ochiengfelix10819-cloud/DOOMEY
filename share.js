// Share buttons: WhatsApp, Facebook, copy link and the phone's own share menu
function dmAddShare(container, title) {
  var url = window.location.href.split('#')[0];
  var text = 'Check out ' + title + ' on DOOMEY: ' + url;

  var row = document.createElement('div');
  row.className = 'share-row';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Share this page');

  var label = document.createElement('span');
  label.className = 'share-label';
  label.textContent = 'Share';
  row.appendChild(label);

  function link(name, href) {
    var a = document.createElement('a');
    a.className = 'share-btn';
    a.textContent = name;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    row.appendChild(a);
  }
  link('WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(text));
  link('Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url));

  var copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'share-btn';
  copy.textContent = 'Copy link';
  copy.addEventListener('click', function () {
    function done(ok) {
      copy.textContent = ok ? 'Link copied' : 'Press and hold the address bar to copy';
      setTimeout(function () { copy.textContent = 'Copy link'; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });
  row.appendChild(copy);

  if (navigator.share) {
    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'share-btn';
    more.textContent = 'More...';
    more.addEventListener('click', function () {
      navigator.share({ title: title + ' | DOOMEY', text: 'Check out ' + title + ' on DOOMEY', url: url }).catch(function () {});
    });
    row.appendChild(more);
  }

  container.appendChild(row);
}
