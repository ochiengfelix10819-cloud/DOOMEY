// Call, WhatsApp and Message buttons. Numbers are only revealed to logged-in users.

function toIntl(n) {
  n = String(n).replace(/[\s\-()]/g, '');
  if (n.indexOf('+') === 0) return n.substring(1);
  if (n.indexOf('254') === 0) return n;
  if (n.indexOf('0') === 0) return '254' + n.substring(1);
  return '254' + n;
}

async function addContactButtons(container, fabId) {
  var box = document.createElement('div');
  box.style.marginTop = '12px';
  container.appendChild(box);

  var s = await supabaseClient.auth.getSession();
  if (!s.data.session) {
    var p = document.createElement('p');
    p.className = 'auth-sub';
    var a = document.createElement('a');
    a.href = 'login.html';
    a.textContent = 'Log in';
    a.style.color = 'var(--copper)';
    p.appendChild(a);
    p.appendChild(document.createTextNode(' to call, WhatsApp or message this fabricator.'));
    box.appendChild(p);
    return;
  }

  var r = await supabaseClient.rpc('get_fabricator_contact', { fab: fabId });
  var c = r.data && r.data[0];
  if (r.error || !c) {
    var e = document.createElement('p');
    e.className = 'auth-sub';
    e.textContent = 'Contact details are not available.';
    box.appendChild(e);
    return;
  }

  if (c.phone) {
    var call = document.createElement('a');
    call.className = 'btn btn-outline';
    call.href = 'tel:+' + toIntl(c.phone);
    call.textContent = 'Call';
    call.style.margin = '0 8px 8px 0';
    box.appendChild(call);
  }
  if (c.whatsapp) {
    var wa = document.createElement('a');
    wa.className = 'btn';
    wa.href = 'https://wa.me/' + toIntl(c.whatsapp) +
      '?text=' + encodeURIComponent('Hello, I found you on DOOMEY and I am interested in your work.');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.textContent = 'WhatsApp';
    wa.style.margin = '0 8px 8px 0';
    box.appendChild(wa);
  }

  var msg = document.createElement('a');
  msg.className = 'btn btn-outline';
  msg.href = 'messages.html?to=' + encodeURIComponent(fabId);
  msg.textContent = 'Message';
  msg.style.marginBottom = '8px';
  box.appendChild(msg);
}
