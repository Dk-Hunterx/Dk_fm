/* DK FM admin sign-in foundation. Catalogue writes are added separately. */
(function () {
  'use strict';
  const start = function () {
    const client = window.dkfmSupabase;
    const screen = document.getElementById('screen-admin');
    if (!client || !screen) return;

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'dkfm-backend-auth';
    panel.innerHTML =
      '<h2>Backend admin sign-in</h2>' +
      '<p class="page-sub">Sign in with the email and password created in Supabase Authentication.</p>' +
      '<form id="dkfm-backend-login" class="form-grid">' +
      '<div class="field full"><label for="dkfm-backend-email">Email</label><input id="dkfm-backend-email" type="email" autocomplete="username" required></div>' +
      '<div class="field full"><label for="dkfm-backend-password">Password</label><input id="dkfm-backend-password" type="password" autocomplete="current-password" required></div>' +
      '<div class="field full"><button class="btn" type="submit">Sign in</button></div>' +
      '<p id="dkfm-backend-message" class="small-note" role="status"></p></form>' +
      '<button id="dkfm-backend-signout" class="btn secondary small" hidden>Sign out</button>' +
      '<p class="small-note">This verifies your role in public.profiles. Database policies remain the real security boundary.</p>';
    screen.prepend(panel);

    const form = document.getElementById('dkfm-backend-login');
    const message = document.getElementById('dkfm-backend-message');
    const signOut = document.getElementById('dkfm-backend-signout');
    const say = (text) => { message.textContent = text; };

    async function refresh() {
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        form.hidden = false;
        signOut.hidden = true;
        say('Not signed in.');
        return;
      }
      const { data, error } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (error || !data || data.role !== 'admin') {
        await client.auth.signOut();
        form.hidden = false;
        signOut.hidden = true;
        say('This account is not an admin. Check the profiles table and the UUID you promoted.');
        return;
      }
      form.hidden = true;
      signOut.hidden = false;
      say('Signed in as DK FM admin. The catalogue editor is not connected yet.');
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      say('Signing in…');
      const { error } = await client.auth.signInWithPassword({
        email: document.getElementById('dkfm-backend-email').value.trim(),
        password: document.getElementById('dkfm-backend-password').value
      });
      button.disabled = false;
      if (error) { say(error.message); return; }
      await refresh();
    });

    signOut.addEventListener('click', async function () {
      const { error } = await client.auth.signOut();
      say(error ? error.message : 'Signed out.');
      await refresh();
    });

    client.auth.onAuthStateChange(function () { refresh().catch(console.error); });
    refresh().catch(function (error) { say(error.message || 'Could not check admin session.'); });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
