/* DK FM email/password auth. Supabase verifies passwords; admin access also requires the database admin role. */
(function () {
  'use strict';
  const wait = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  wait(function () {
    const db = window.dkfmSupabase;
    if (!db) return;
    const $ = (id) => document.getElementById(id);
    const ADMIN_EMAIL = 'onlineking206@gmail.com';
    let currentUser = null;
    let currentRole = 'user';

    const modal = document.createElement('div');
    modal.id = 'dkfm-auth-modal';
    modal.hidden = true;
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,10,18,.72);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);display:none;align-items:center;justify-content:center;padding:20px;overflow:auto';
    modal.innerHTML = '<div style="background:var(--panel,#171923);color:var(--text,#fff);padding:24px;border-radius:18px;max-width:420px;width:100%;box-shadow:0 20px 80px #0008"><h2 id="dkfm-auth-title">Welcome to DK FM</h2><p id="dkfm-auth-copy">Your companion for audio stories</p><button id="dkfm-google-login" type="button" style="width:100%;padding:15px;border-radius:14px;background:#fff;color:#111;font-size:16px;font-weight:700;border:1px solid #ddd;margin:10px 0 16px">🌐 Continue with Google</button><div style="display:flex;align-items:center;gap:12px;color:#aaa;margin:0 0 14px"><span style="height:1px;background:#444;flex:1"></span>OR<span style="height:1px;background:#444;flex:1"></span></div><div style="display:flex;gap:8px;margin:16px 0"><button id="dkfm-tab-login" type="button" class="btn" style="flex:1">Login</button><button id="dkfm-tab-signup" type="button" class="btn" style="flex:1">Sign up</button></div><form id="dkfm-email-form"><label for="dkfm-email">Gmail / Email</label><input id="dkfm-email" type="email" autocomplete="email" required placeholder="you@gmail.com" style="display:block;box-sizing:border-box;width:100%;margin:6px 0 14px;padding:12px;border-radius:10px"><label for="dkfm-password">Password</label><input id="dkfm-password" type="password" autocomplete="current-password" minlength="6" required placeholder="At least 6 characters" style="display:block;box-sizing:border-box;width:100%;margin:6px 0 14px;padding:12px;border-radius:10px"><button id="dkfm-submit" type="submit" class="btn" style="width:100%">Login</button></form><p id="dkfm-auth-status" role="status" style="font-size:13px;margin-top:12px;overflow-wrap:anywhere"></p><button id="dkfm-auth-continue" type="button" class="btn" style="display:none;width:100%;margin-top:8px">Continue to DK FM</button><button id="dkfm-auth-signout" type="button" class="btn" style="display:none;width:100%;margin-top:8px">Sign out</button></div>';
    document.body.appendChild(modal);
    const status = $('dkfm-auth-status');
    let mode = 'login';

    function showAuth(force) {
      if (currentUser && !force) return;
      modal.hidden = false;
      modal.style.display = 'flex';
    }
    function hideAuth() { modal.hidden = true; modal.style.display = 'none'; }
    function setMode(next) {
      mode = next;
      $('dkfm-auth-title').textContent = next === 'signup' ? 'Create your DK FM account' : 'Welcome to DK FM';
      $('dkfm-auth-copy').textContent = next === 'signup' ? 'Sign up with your email and password. Verify your email if confirmation is enabled.' : 'Log in with the email and password registered in Supabase.';
      $('dkfm-submit').textContent = next === 'signup' ? 'Create account' : 'Login';
      $('dkfm-password').autocomplete = next === 'signup' ? 'new-password' : 'current-password';
      status.textContent = '';
    }
    $('dkfm-google-login').addEventListener('click', async () => {
      status.textContent = 'Opening Google sign-in…';
      const { error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href.split('#')[0] }
      });
      if (error) status.textContent = error.message;
    });
    $('dkfm-tab-login').addEventListener('click', () => setMode('login'));
    $('dkfm-tab-signup').addEventListener('click', () => setMode('signup'));

    $('dkfm-email-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = $('dkfm-email').value.trim().toLowerCase();
      const password = $('dkfm-password').value;
      const submit = $('dkfm-submit');
      submit.disabled = true;
      status.textContent = mode === 'signup' ? 'Creating account…' : 'Checking login…';
      try {
        if (mode === 'signup') {
          const { data, error } = await db.auth.signUp({ email, password, options: { emailRedirectTo: window.location.href.split('#')[0] } });
          if (error) throw error;
          if (data.session) {
            status.textContent = 'Account created. Signed in successfully.';
            await refreshAuth();
          } else {
            status.textContent = 'Account created. Check your email and verify it before logging in.';
            setMode('login');
          }
        } else {
          const { error } = await db.auth.signInWithPassword({ email, password });
          if (error) throw error;
          await refreshAuth();
          status.textContent = 'Login successful.';
          hideAuth();
        }
      } catch (error) {
        status.textContent = error?.message || 'Could not authenticate. Check your details and try again.';
      } finally { submit.disabled = false; }
    });

    function setProfile() {
      const name = currentUser ? (currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email || 'DK FM Listener') : 'DK FM Listener';
      const el = $('profile-name');
      if (el) el.textContent = name;
      const subtitle = el?.parentElement?.querySelector('.small-note');
      if (subtitle) subtitle.textContent = currentUser ? currentUser.email : 'Guest · log in to listen';
      const signout = $('dkfm-auth-signout');
      if (signout) signout.style.display = currentUser ? 'block' : 'none';
      const continueButton = $('dkfm-auth-continue');
      if (continueButton) continueButton.style.display = currentUser ? 'block' : 'none';
      if (currentUser) {
        $('dkfm-auth-copy').textContent = 'Signed in as ' + currentUser.email + '. Continue to DK FM, or sign out to use another account.';
        $('dkfm-email-form').style.display = 'none';
        $('dkfm-tab-login').style.display = 'none';
        $('dkfm-tab-signup').style.display = 'none';
      } else {
        $('dkfm-email-form').style.display = 'block';
        $('dkfm-tab-login').style.display = 'block';
        $('dkfm-tab-signup').style.display = 'block';
      }
    }

    async function refreshAuth() {
      const { data, error } = await db.auth.getUser();
      if (error && error.name !== 'AuthSessionMissingError') console.warn(error);
      currentUser = data?.user || null;
      currentRole = 'user';
      if (currentUser) {
        const { data: profile } = await db.from('profiles').select('role').eq('id', currentUser.id).maybeSingle();
        currentRole = profile?.role || 'user';
      }
      setProfile();
      applyAdminGate();
      return currentUser;
    }

    function applyAdminGate() {
      const admin = $('screen-admin');
      if (!admin) return;
      const allowed = !!currentUser &&
        currentUser.email?.toLowerCase() === ADMIN_EMAIL &&
        currentRole === 'admin';
      Array.from(admin.children).forEach((node) => {
        if (node.hasAttribute('data-dkfm-admin-gate')) node.remove();
        else node.hidden = !allowed;
      });
      if (!allowed) {
        const gate = document.createElement('div');
        gate.setAttribute('data-dkfm-admin-gate', 'true');
        gate.className = 'panel';
        gate.innerHTML = '<h2>Admin access unavailable</h2><p>This page has no admin login or signup option. Sign in with your authorized account using the regular login form.</p>';
        admin.prepend(gate);
      }
    }

    const originalPlay = window.playEpisode;
    if (typeof originalPlay === 'function') {
      window.playEpisode = function (sid, eid) {
        if (!currentUser) { showAuth(true); return; }
        const story = typeof window.findStory === 'function' ? window.findStory(sid) : null;
        const episode = story && typeof window.findEpisode === 'function' ? window.findEpisode(story, eid) : null;
        if (episode && episode.access === 'paid' && !(currentUser.email?.toLowerCase() === ADMIN_EMAIL && currentRole === 'admin')) {
          window.alert('This premium episode is locked until secure payments are implemented.');
          return;
        }
        return originalPlay(sid, eid);
      };
    }

    $('dkfm-auth-continue').addEventListener('click', () => hideAuth());
    $('dkfm-auth-signout').addEventListener('click', async () => {
      await db.auth.signOut();
      await refreshAuth();
      setMode('login');
      showAuth(true);
    });

    const profilePanel = $('screen-profile');
    if (profilePanel) {
      const box = profilePanel.querySelector('.profile-card');
      if (box) {
        const action = document.createElement('button');
        action.type = 'button';
        action.id = 'dkfm-profile-auth';
        action.className = 'btn';
        action.style.marginTop = '12px';
        box.insertAdjacentElement('afterend', action);
        action.addEventListener('click', async () => {
          if (currentUser) {
            await db.auth.signOut();
            await refreshAuth();
            setMode('login');
            showAuth(true);
          } else showAuth(true);
        });
        const updateButton = () => { action.textContent = currentUser ? 'Sign out' : 'Login / Sign up'; };
        updateButton();
        db.auth.onAuthStateChange(() => { setTimeout(() => refreshAuth().then(updateButton).catch(console.error), 0); });
      }
    }

    db.auth.onAuthStateChange((_event, session) => {
      if (!session && $('audio')) {
        $('audio').pause();
        $('audio').removeAttribute('src');
      }
      setTimeout(() => refreshAuth().catch(console.error), 0);
    });
    refreshAuth().then(() => { showAuth(true); }).catch((error) => { console.error('DK FM auth check failed:', error); showAuth(true); });
  });
})();
