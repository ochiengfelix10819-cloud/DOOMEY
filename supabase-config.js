// DOOMEY Supabase connection
// Only the public (publishable / anon) key goes here. NEVER the secret key.
const SUPABASE_URL = "https://qgkvfxaubkfbtwlogvzy.supabase.co";
const SUPABASE_KEY = "sb_publishable_dZrRrZw4V3HKUc4uoh3WsQ_yZQXKWLd";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
