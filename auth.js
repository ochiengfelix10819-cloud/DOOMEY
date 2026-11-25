// DOOMEY authentication helpers

function showMessage(text, isError) {
  var box = document.getElementById('message');
  box.textContent = text;
  box.className = 'message ' + (isError ? 'error' : 'success');
  box.style.display = 'block';
}

function setLoading(button, loading, label) {
  button.disabled = loading;
  button.textContent = loading ? 'Please wait...' : label;
}

async function registerUser(role) {
  var form = document.getElementById('authForm');
  var button = form.querySelector('button[type="submit"]');
  var fullName = document.getElementById('fullName').value.trim();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;

  if (fullName.length < 2) { showMessage('Please enter your full name.', true); return; }
  if (password.length < 8) { showMessage('Password must be at least 8 characters.', true); return; }

  setLoading(button, true, 'Create Account');

  var result = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: { data: { full_name: fullName, role: role } }
  });

  setLoading(button, false, 'Create Account');

  if (result.error) { showMessage(result.error.message, true); return; }

  // When "Confirm email" is ON in Supabase there is no session yet: ask the person to check their email.
  if (!result.data || !result.data.session) {
    showMessage('Account created! Please check your email (and the spam folder) and click the confirmation link, then log in.', false);
    return;
  }

  showMessage('Account created! Redirecting...', false);
  setTimeout(function () { window.location.href = 'dashboard.html'; }, 1200);
}

async function loginUser() {
  var form = document.getElementById('authForm');
  var button = form.querySelector('button[type="submit"]');
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;

  setLoading(button, true, 'Log In');

  var result = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  setLoading(button, false, 'Log In');

  if (result.error) {
    var msg = /not confirmed/i.test(result.error.message)
      ? 'Please confirm your email first. Check your inbox (and spam folder) for the link we sent.'
      : 'Login failed: ' + result.error.message;
    showMessage(msg, true);
    return;
  }

  showMessage('Logged in! Redirecting...', false);
  setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}
