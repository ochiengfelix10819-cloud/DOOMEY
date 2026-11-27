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
