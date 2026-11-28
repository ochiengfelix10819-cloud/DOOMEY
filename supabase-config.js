// DOOMEY Supabase connection
// Only the public (publishable / anon) key goes here. NEVER the secret key.
const SUPABASE_URL = "https://qgkvfxaubkfbtwlogvzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_dZrRrZw4V3HKUc4uoh3WsQ_yZQXKWLd";

// "Remember me": when unticked at login, the session lives only until the tab is closed.
// Existing sessions saved in localStorage keep working.
const dmAuthStorage = {
  getItem: function (key) {
    try { var v = window.sessionStorage.getItem(key); return v !== null ? v : window.localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: function (key, value) {
    try {
      var temp = window.localStorage.getItem('dm_remember') === '0';
      (temp ? window.sessionStorage : window.localStorage).setItem(key, value);
      (temp ? window.localStorage : window.sessionStorage).removeItem(key);
    } catch (e) {}
  },
  removeItem: function (key) {
    try { window.sessionStorage.removeItem(key); window.localStorage.removeItem(key); } catch (e) {}
  }
};

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { storage: dmAuthStorage } });

// Turns a database or storage error into a friendly message (never shows internal details).
// Messages from our own rules (code P0001, e.g. "You are sending messages too fast") are safe to show.
function dmErr(e) {
  if (!e) return 'Something went wrong. Please try again.';
  var m = String(e.message || '');
  try { console.warn('DOOMEY error', e.code || '', m); } catch (x) {}
  if (e.code === 'P0001') return m;
  if (e.code === '42501' || /row-level security|permission denied|not authorized/i.test(m)) return 'You are not allowed to do that.';
  if (e.code === '23505' || /duplicate key/i.test(m)) return 'That already exists.';
  if (e.code === '23514' || /check constraint/i.test(m)) return 'One of the values is too long or not valid. Please check and try again.';
  if (e.code === '23503') return 'That item is no longer available.';
  if (/exceeded the maximum|too large|payload/i.test(m)) return 'That file is too large.';
  if (/mime type|not supported|invalid.*type/i.test(m)) return 'That file type is not allowed.';
  if (/failed to fetch|network|load failed/i.test(m)) return 'Network problem. Check your internet and try again.';
  if (/jwt|expired|not authenticated/i.test(m)) return 'Your session expired. Please log in again.';
  return 'Something went wrong. Please try again.';
}
