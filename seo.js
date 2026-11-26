// Sets the canonical address, share address, description and structured data (JSON-LD) for pages built from the database
function dmSetSeo(opts) {
  var head = document.head;
  function meta(selector, create) {
    var el = head.querySelector(selector);
    if (!el) { el = create(); head.appendChild(el); }
    return el;
  }
  var url = opts.url;
  var canonical = meta('link[rel="canonical"]', function () { var l = document.createElement('link'); l.rel = 'canonical'; return l; });
  canonical.href = url;
  var ogUrl = head.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', url);
  if (opts.title) {
    var ogTitle = head.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', opts.title);
  }
  if (opts.description) {
    var d = String(opts.description).replace(/\s+/g, ' ').trim().slice(0, 160);
    var desc = head.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', d);
    var ogDesc = head.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', d);
  }
  if (opts.jsonld) {
    var old = head.querySelector('script[data-dm-jsonld]');
    if (old) old.remove();
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-dm-jsonld', '1');
    s.text = JSON.stringify(opts.jsonld).replace(/</g, '\\u003c');
    head.appendChild(s);
  }
}
