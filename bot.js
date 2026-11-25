// DOOMEY helper bot: free, rule-based. Answers common questions and searches live products.
(function () {
  if (document.getElementById('dmBot')) return;

  var CATS = [
    ['gates-and-doors', 'Gates and Doors', /gate|door/],
    ['windows-and-grills', 'Windows and Grills', /window|grill|burglar/],
    ['staircases-and-railings', 'Staircases and Railings', /stair|railing|balustrade|handrail/],
    ['carports-and-shades', 'Carports and Shades', /carport|shade|parking/],
    ['metal-furniture', 'Metal Furniture', /furniture|bed|table|chair|shelf|shelves/],
    ['structural-fabrication', 'Structural Fabrication', /structur|truss|frame/],
    ['custom-welding-and-repairs', 'Custom Welding and Repairs', /repair|custom|weld/],
    ['water-tanks-and-tank-stands', 'Water Tanks and Tank Stands', /tank/],
    ['metal-roofing', 'Metal Roofing', /roof|iron sheet/]
  ];

  var FAQ = [
    { re: /hello|hi\b|hey|good (morning|afternoon|evening)|habari|jambo/,
      a: 'Hello! I can help you find products, find a welder, or explain how DOOMEY works. What would you like to do?' },
    { re: /order|buy|purchase/,
      a: 'To order: open a product, tap "Order This Product", enter quantity, phone and delivery location, then submit. The fabricator accepts it and you can track progress under My Orders. You need a customer account to order.',
      links: [['Browse products', 'explore.html'], ['My Orders', 'my-orders.html']] },
    { re: /quot|estimate|custom|measure/,
      a: 'For custom work, open a fabricator\'s profile and tap "Request a Quotation". Describe the job, add measurements and up to 4 reference pictures. The fabricator replies with a price, and nothing is agreed until you accept it.',
      links: [['Find a welder', 'find-welder.html'], ['My Quotations', 'my-quotations.html']] },
    { re: /pay|mpesa|m-pesa|cash|bank|money|refund|deposit/,
      a: 'You pay the fabricator directly by M-Pesa, cash or bank transfer. DOOMEY does not collect or hold payments. A payment only counts as received once the fabricator confirms it, so keep your M-Pesa message as proof.',
      links: [['My Orders', 'my-orders.html']] },
    { re: /verif|badge|trust|genuine|scam|fraud|safe/,
      a: 'A VERIFIED badge means DOOMEY reviewed that fabricator\'s identity documents. It is not a guarantee of quality, so always check photos and reviews, agree the price in writing, and avoid paying everything upfront.',
      links: [['Find a welder', 'find-welder.html']] },
    { re: /fabricator|register|sign ?up|join|sell|post|advert|list my/,
      a: 'Welders can join free: register as a fabricator, complete your business profile with a map pin, then post products with photos. Every ad is reviewed by our team before it goes public. You can apply for a VERIFIED badge from your dashboard.',
      links: [['Become a Fabricator', 'register-fabricator.html'], ['Log in', 'login.html']] },
    { re: /account|login|log in|password|customer/,
      a: 'Customers can register free to order, request quotations and message fabricators.',
      links: [['Create customer account', 'register-customer.html'], ['Log in', 'login.html']] },
    { re: /near|location|county|town|nairobi|mombasa|kisumu|nakuru|eldoret|map|where/,
      a: 'Use Find a Welder to search by county and town, see workshops on a map, or tap "Near me" to sort by distance.',
      links: [['Find a Welder', 'find-welder.html']] },
    { re: /message|chat|whatsapp|call|phone|contact fabricator/,
      a: 'Log in, open a product or fabricator profile and you will see Call, WhatsApp and Message buttons. Phone numbers are only shown to logged-in users.',
      links: [['Log in', 'login.html'], ['Messages', 'messages.html']] },
    { re: /deliver|transport|install/,
      a: 'Delivery and installation are agreed directly with the fabricator. Ask them in a message or in your order notes, and confirm the cost and timeline before work starts.' },
    { re: /price|cost|cheap|how much/,
      a: 'Prices are set by each fabricator and shown in KES on every product. Compare several products, or request a quotation for custom work.',
      links: [['Browse products', 'explore.html']] },
    { re: /contact|support|help|email|complain|report/,
      a: 'You can reach the DOOMEY team on our contact page.',
      links: [['Contact us', 'contact.html']] },
    { re: /terms|privacy|policy|data/,
      a: 'You can read how we handle your data and the rules of using DOOMEY here.',
      links: [['Terms', 'terms.html'], ['Privacy Policy', 'privacy.html']] },
    { re: /how (does|do|is) (doomey|it|this|the (site|website|platform)).*(work)|how.*use (doomey|this|the (site|website))|get started|what is doomey|about doomey/,
      a: 'DOOMEY connects customers with welders and metal fabricators in Kenya. Search for a product or a welder near you, compare photos and prices, contact the fabricator, then order or ask for a quotation.',
      links: [['How it works', 'index.html#how'], ['About DOOMEY', 'about.html']] },
    { re: /thank|thanks|asante/, a: 'You are welcome! Anything else I can help with?' }
  ];

  var CHIPS = ['How does DOOMEY work?', 'Find a gate', 'How do payments work?', 'Become a fabricator'];

  // ---- Styles ----
  var css = document.createElement('style');
  css.textContent =
    '#dmBot{position:fixed;right:16px;bottom:16px;z-index:9999;font-family:Arial,Helvetica,sans-serif}' +
    '#dmBotBtn{width:58px;height:58px;border-radius:50%;border:0;background:#b85a1c;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.3);transition:transform .2s}' +
    '#dmBotBtn:hover{transform:scale(1.08)}' +
    '#dmBotWin{display:none;position:absolute;right:0;bottom:70px;width:340px;max-width:calc(100vw - 32px);height:460px;max-height:calc(100vh - 110px);background:#fff;color:#1c1c1e;border:1px solid #e4e1db;border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.25);overflow:hidden;flex-direction:column}' +
    '#dmBotWin.open{display:flex;animation:dmPop .25s ease}' +
    '@keyframes dmPop{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '#dmBotHead{background:#1c1c1e;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center}' +
    '#dmBotHead strong{color:#d9722b;letter-spacing:2px}#dmBotHead small{display:block;color:#b5b5b8;font-size:.72rem}' +
    '#dmBotClose{background:none;border:0;color:#fff;font-size:1.4rem;cursor:pointer}' +
    '#dmBotLog{flex:1;overflow-y:auto;padding:12px;background:#faf9f6}' +
    '.dmMsg{max-width:88%;margin-bottom:10px;padding:9px 12px;border-radius:12px;font-size:.92rem;line-height:1.45;overflow-wrap:anywhere}' +
    '.dmBot{background:#ece9e3;border-bottom-left-radius:4px}.dmMe{background:#b85a1c;color:#fff;margin-left:auto;border-bottom-right-radius:4px}' +
    '.dmLinks{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.dmLinks a,.dmChip{display:inline-block;padding:6px 12px;border:1px solid #d9722b;border-radius:20px;color:#b85a1c;background:#fff;font-size:.82rem;text-decoration:none;cursor:pointer}' +
    '.dmLinks a:hover,.dmChip:hover{background:#b85a1c;color:#fff}' +
    '.dmProd{display:flex;gap:10px;align-items:center;padding:8px;margin-bottom:8px;background:#fff;border:1px solid #e4e1db;border-radius:10px;text-decoration:none;color:#1c1c1e}' +
    '.dmProd img{width:48px;height:48px;object-fit:cover;border-radius:6px;background:#ddd}.dmProd b{display:block;font-size:.88rem}.dmProd span{color:#b85a1c;font-size:.82rem;font-weight:bold}' +
    '#dmBotForm{display:flex;gap:8px;padding:10px;border-top:1px solid #e4e1db;background:#fff}' +
    '#dmBotIn{flex:1;min-width:0;padding:10px;border:1px solid #cfcbc3;border-radius:8px;font-size:1rem;color:#1c1c1e;background:#fff}' +
    '#dmBotSend{padding:0 14px;border:0;border-radius:8px;background:#b85a1c;color:#fff;font-weight:bold;cursor:pointer}';
  document.head.appendChild(css);

  // ---- Markup ----
  var root = document.createElement('div');
  root.id = 'dmBot';
  root.innerHTML =
    '<div id="dmBotWin" role="dialog" aria-label="DOOMEY helper">' +
      '<div id="dmBotHead"><div><strong>DOOMEY</strong><small>Helper bot - answers common questions</small></div>' +
      '<button id="dmBotClose" type="button" aria-label="Close chat">&times;</button></div>' +
      '<div id="dmBotLog" aria-live="polite"></div>' +
      '<form id="dmBotForm"><input id="dmBotIn" aria-label="Ask DOOMEY helper" type="text" maxlength="200" placeholder="Ask a question or search..." autocomplete="off">' +
      '<button id="dmBotSend" type="submit">Send</button></form>' +
    '</div>' +
    '<button id="dmBotBtn" type="button" aria-label="Open helper chat"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg></button>';
  document.body.appendChild(root);

  var win = document.getElementById('dmBotWin');
  var log = document.getElementById('dmBotLog');
  var input = document.getElementById('dmBotIn');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function say(text, who) { log.appendChild(el('div', 'dmMsg ' + (who === 'me' ? 'dmMe' : 'dmBot'), text)); scroll(); }
  function links(list) {
    var box = el('div', 'dmLinks');
    list.forEach(function (l) { var a = el('a', '', l[0]); a.href = l[1]; box.appendChild(a); });
    log.appendChild(box); scroll();
  }
  function chips() {
    var box = el('div', 'dmLinks');
    CHIPS.forEach(function (c) {
      var b = el('span', 'dmChip', c);
      b.addEventListener('click', function () { handle(c); });
      box.appendChild(b);
    });
    log.appendChild(box); scroll();
  }

  async function searchProducts(text, label) {
    if (typeof supabaseClient === 'undefined') return false;
    var words = text.replace(/[,()%*]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 2; });
    if (!words.length) return false;
    var q = supabaseClient.from('products')
      .select('id, title, price_kes, product_images(image_url, sort_order)')
      .eq('status', 'approved').order('created_at', { ascending: false }).limit(3);
    q = q.or(words.slice(0, 4).map(function (w) { return 'title.ilike.%' + w + '%'; }).join(','));
    var r = await q;
    if (r.error || !r.data || !r.data.length) return false;
    say('Here ' + (r.data.length === 1 ? 'is a product' : 'are some products') + (label ? ' in ' + label : '') + ':');
    r.data.forEach(function (p) {
      var imgs = (p.product_images || []).sort(function (a, b) { return a.sort_order - b.sort_order; });
      var a = el('a', 'dmProd'); a.href = 'product.html?id=' + p.id;
      var im = el('img'); im.alt = ''; if (imgs.length) im.src = imgs[0].image_url;
      var t = el('div'); t.appendChild(el('b', '', p.title)); t.appendChild(el('span', '', 'KES ' + Number(p.price_kes).toLocaleString()));
      a.appendChild(im); a.appendChild(t); log.appendChild(a);
    });
    scroll();
    return true;
  }

  async function handle(text) {
    text = String(text).trim();
    if (!text) return;
    say(text, 'me');
    var t = text.toLowerCase();

    // 1. Product category searches
    var cat = null;
    CATS.forEach(function (c) { if (!cat && c[2].test(t) && /find|search|show|looking|need|want|buy|price|cost|make|build|\?/.test(t) || (!cat && c[2].test(t) && t.split(/\s+/).length <= 4)) cat = c; });
    if (cat) {
      var found = await searchProducts(t, null);
      if (!found) say('I could not find a matching product right now, but you can browse the ' + cat[1] + ' category.');
      links([['Browse ' + cat[1], 'explore.html?category=' + cat[0]], ['Request a quotation', 'find-welder.html']]);
      return;
    }

    // 2. FAQ topics
    for (var i = 0; i < FAQ.length; i++) {
      if (FAQ[i].re.test(t)) {
        var ans = FAQ[i].a;
        if (FAQ[i].re.test('contact') && typeof SITE !== 'undefined' && SITE.phone && /contact|support|help|email/.test(t)) {
          ans += ' Phone: ' + SITE.phone + '.';
        }
        say(ans);
        if (FAQ[i].links) links(FAQ[i].links);
        return;
      }
    }

    // 3. Anything else: try a live product search, then fall back
    var any = await searchProducts(t, null);
    if (any) { links([['See all products', 'explore.html']]); return; }
    say('I am not sure about that one. I can help with products, finding a welder, orders, quotations, payments and verification. For anything else, please contact our team.');
    links([['Contact us', 'contact.html'], ['Browse products', 'explore.html'], ['Find a welder', 'find-welder.html']]);
  }

  var started = false;
  function open() {
    win.classList.add('open');
    if (!started) {
      started = true;
      say('Hi, I am the DOOMEY helper. I can find products, point you to welders and explain how ordering, quotations and payments work. I am a simple bot, not a person.');
      chips();
    }
    setTimeout(function () { input.focus(); }, 100);
  }
  document.getElementById('dmBotBtn').addEventListener('click', function () {
    if (win.classList.contains('open')) win.classList.remove('open'); else open();
  });
  document.getElementById('dmBotClose').addEventListener('click', function () { win.classList.remove('open'); });
  document.getElementById('dmBotForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value; input.value = '';
    handle(v);
  });
})();
