/* DK FM Google-only sign-in. The login screen is the first full-screen interface. */
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
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(ellipse at 50% 0%,#30263a 0%,#171722 48%,#0c0c12 100%);display:none;align-items:center;justify-content:center;padding:18px;overflow:auto;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
    modal.innerHTML = '<div style="position:relative;background:linear-gradient(160deg,#171722,#101018);color:#f8f6ff;padding:26px 24px 28px;border:1px solid #ffffff12;border-radius:30px;max-width:440px;width:100%;min-height:min(690px,calc(100dvh - 36px));display:flex;flex-direction:column;justify-content:center;overflow:hidden;box-shadow:0 28px 90px #0009;text-align:center"><div style="position:absolute;inset:0 0 auto;height:270px;pointer-events:none;background:radial-gradient(ellipse at 50% 70%,#f0783526,transparent 65%)"></div><div style="position:relative;margin:0 auto 8px;width:100%;max-width:340px"><svg viewBox="0 0 320 210" role="img" aria-label="DK FM Audio Stories" style="width:100%;height:auto;max-height:220px"><defs><linearGradient id="dkfm-orange" x1="0" x2="1"><stop offset="0" stop-color="#ff9b52"/><stop offset="1" stop-color="#ff653b"/></linearGradient></defs><g fill="none" stroke="url(#dkfm-orange)" stroke-width="2.5" stroke-linecap="round"><path d="M142 40a18 18 0 0 1 36 0"/><path d="M136 40a24 24 0 0 1 48 0"/><path d="M130 40a30 30 0 0 1 60 0"/></g><circle cx="160" cy="40" r="5" fill="#ff8848"/><text x="160" y="94" text-anchor="middle" font-size="46" font-weight="850" letter-spacing="-2" fill="#f5eee9">DK <tspan fill="url(#dkfm-orange)">FM</tspan></text><text x="160" y="119" text-anchor="middle" font-size="17" fill="#c9c3cf">A u d i o   S t o r i e s</text><path d="M10 167 Q35 135 58 167 T105 164 T150 168 T195 160 T240 168 T310 157" fill="none" stroke="#ff8a4b" stroke-opacity=".32" stroke-width="2"/><g><circle cx="223" cy="151" r="26" fill="#5b4a64" opacity=".45"/><circle cx="267" cy="145" r="30" fill="#39415b" opacity=".4"/><rect x="235" y="133" width="14" height="41" rx="7" fill="#777080"/><path d="M232 150v8a10 10 0 0 0 20 0v-8" fill="none" stroke="#ff9b52" stroke-width="2"/><path d="M242 169v9m-8 0h16" stroke="#b5a9bf" stroke-width="2" stroke-linecap="round"/><circle cx="207" cy="173" r="8" fill="#ff9450"/><circle cx="281" cy="174" r="8" fill="#ff9450"/></g><g fill="#ff8848"><path d="M290 113h4v-5h4v5h5v4h-5v5h-4v-5h-4z"/><circle cx="35" cy="185" r="2"/><circle cx="43" cy="178" r="1.5"/></g></svg></div><div style="position:relative;background:linear-gradient(145deg,#252631,#20212b);border:1px solid #ffffff0c;border-radius:26px;padding:25px 22px 22px;text-align:left;box-shadow:0 12px 35px #0003"><h2 id="dkfm-auth-title" style="font-size:clamp(23px,5vw,28px);font-weight:650;letter-spacing:-.7px;margin:0 0 10px;text-align:center;line-height:1.2">Sign in to your world of stories</h2><p id="dkfm-auth-copy" style="color:#bdbbc8;line-height:1.5;margin:0 0 22px;text-align:center">Continue securely with your Google account.</p><button id="dkfm-google-login" type="button" style="width:100%;min-height:60px;padding:15px 12px;border-radius:15px;background:#fff;color:#202124;font-size:17px;font-weight:700;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;gap:13px;box-shadow:0 5px 18px #0002"><svg width="25" height="25" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44z"/><path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7.1v-5.3H5.8a20 20 0 0 0 0 17.7z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12z"/></svg><span>Continue with Google</span></button><p id="dkfm-auth-status" role="status" style="color:#ffb28a;font-size:13px;line-height:1.4;margin:14px 0 0;text-align:center;overflow-wrap:anywhere"></p><button id="dkfm-auth-continue" type="button" style="display:none;width:100%;margin-top:12px;padding:14px;border-radius:13px;background:linear-gradient(90deg,#ff8a45,#ff633e);border:0;font-weight:700;color:white">Continue to DK FM</button><button id="dkfm-auth-signout" type="button" style="display:none;width:100%;margin-top:10px;padding:12px;border-radius:13px;background:#ffffff10;border:1px solid #ffffff20;color:white">Sign out</button><div style="display:none"><button id="dkfm-tab-login" type="button">Login</button><button id="dkfm-tab-signup" type="button">Sign up</button><form id="dkfm-email-form"><input id="dkfm-email" type="email"><input id="dkfm-password" type="password"><button id="dkfm-submit" type="submit">Login</button></form><button id="dkfm-forgot" type="button">Forgot password</button></div></div><p style="position:relative;color:#898697;font-size:12px;margin:17px 0 0;text-align:center">Your next favourite story starts here.</p></div>';
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
      if (el) el.textContent = currentUser ? name.toUpperCase() : 'DK FM LISTENER';
      const avatar = $('profile-avatar');
      if (avatar) {
        const photo = currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture;
        avatar.innerHTML = photo ? '<img alt="Profile photo" src="' + photo.replace(/&/g, '&amp;').replace(/\"/g, '&quot;') + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">' : (currentUser?.email?.charAt(0).toUpperCase() || 'D');
      }
      const logout = $('dkfm-profile-logout');
      if (logout && !logout.dataset.bound) {
        logout.dataset.bound = 'true';
        logout.addEventListener('click', async () => {
          if (!currentUser) { showAuth(true); return; }
          const { error } = await db.auth.signOut();
          if (error) { window.alert('Could not log out. Please try again.'); return; }
          await refreshAuth();
          showAuth(true);
        });
      }

      const subtitle = el?.parentElement?.querySelector('.small-note');
      if (subtitle) subtitle.textContent = currentUser ? currentUser.email : 'Guest · log in to listen';
      $('dkfm-email-form').style.display = 'none';
      $('dkfm-tab-login').style.display = 'none';
      $('dkfm-tab-signup').style.display = 'none';
      const forgot = $('dkfm-forgot');
      if (forgot) forgot.style.display = 'none';
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
      const adminShortcut = $('dkfm-admin-open');
      if (adminShortcut) { adminShortcut.hidden = !allowed; adminShortcut.style.display = allowed ? '' : 'none'; }
      Array.from(admin.children).forEach((node) => {
        if (node.hasAttribute('data-dkfm-admin-gate')) node.remove();
        else { node.hidden = !allowed; node.style.display = allowed ? '' : 'none'; }
      });
      if (!allowed) {
        const gate = document.createElement('div');
        gate.setAttribute('data-dkfm-admin-gate', 'true');
        gate.className = 'panel';
        gate.innerHTML = '<h2>Admin access unavailable</h2><p>This page has no separate admin login. Sign in with your authorized Google account first.</p>';
        gate.style.display = 'block';
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
