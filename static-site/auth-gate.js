/* DK FM access rules: browse publicly, sign in to listen, admin role for studio. */
(function () {
  'use strict';
  const wait = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  wait(function () {
    const db = window.dkfmSupabase;
    if (!db) return;
    const $ = (id) => document.getElementById(id);
    let currentUser = null;
    let currentRole = 'user';
    const ADMIN_EMAIL = 'onlineking206@gmail.com';
    let pendingPlay = null;

    const modal = document.createElement('div');
    modal.id = 'dkfm-auth-modal';
    modal.hidden = true;
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000b;display:none;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = '<div style="background:var(--panel,#171923);color:var(--text,#fff);padding:24px;border-radius:18px;max-width:420px;width:100%;box-shadow:0 20px 80px #0008"><button id="dkfm-auth-close" type="button" style="float:right;background:transparent;color:inherit;border:0;font-size:24px">×</button><h2 id="dkfm-auth-title">Sign in to listen</h2><p id="dkfm-auth-copy">Browse stories freely. Sign in with Google to play episodes and sync your account.</p><button id="dkfm-google-login" type="button" class="btn" style="width:100%">Continue with Google</button><p id="dkfm-auth-status" role="status" style="font-size:13px;margin-top:12px"></p></div>';
    document.body.appendChild(modal);
    const status = $('dkfm-auth-status');

    function openLogin(reason) {
      pendingPlay = reason || null;
      $('dkfm-auth-title').textContent = 'Sign in to listen';
      $('dkfm-auth-copy').textContent = 'Browse stories freely. Sign in with Google to play episodes and sync your account.';
      status.textContent = '';
      modal.hidden = false;
      modal.style.display = 'flex';
    }
    function closeLogin() {
      modal.hidden = true;
      modal.style.display = 'none';
    }
    $('dkfm-auth-close').addEventListener('click', closeLogin);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeLogin(); });

    $('dkfm-google-login').addEventListener('click', async function () {
      status.textContent = 'Opening Google sign-in…';
      const { error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href.split('#')[0] }
      });
      if (error) status.textContent = error.message;
    });

    function setProfile() {
      const name = currentUser ? (currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email || 'DK FM Listener') : 'DK FM Listener';
      const el = $('profile-name');
      if (el) el.textContent = name;
      const subtitle = el?.parentElement?.querySelector('.small-note');
      if (subtitle) subtitle.textContent = currentUser ? currentUser.email : 'Guest · sign in to listen';
    }

    async function refreshAuth() {
      const { data } = await db.auth.getUser();
      currentUser = data?.user || null;
      currentRole = 'user';
      if (currentUser) {
        const { data: profile } = await db.from('profiles').select('role').eq('id', currentUser.id).maybeSingle();
        currentRole = profile?.role || 'user';
      }
      setProfile();
      applyAdminGate();
    }

    function applyAdminGate() {
      const admin = $('screen-admin');
      if (!admin) return;
      if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL && currentRole === 'admin') {
        admin.querySelectorAll('[data-dkfm-admin-gate]').forEach((n) => n.remove());
        Array.from(admin.children).forEach((n) => { if (!n.hasAttribute('data-dkfm-admin-gate')) n.hidden = false; });
        return;
      }
      Array.from(admin.children).forEach((n) => { n.hidden = true; });
      let gate = admin.querySelector('[data-dkfm-admin-gate]');
      if (!gate) {
        gate = document.createElement('div');
        gate.setAttribute('data-dkfm-admin-gate', 'true');
        gate.className = 'panel';
        gate.innerHTML = '<h2>Admin access only</h2><p>Sign in with the authorized Google account. Only an account with the admin role in Supabase can manage DK FM.</p><button type="button" class="btn" id="dkfm-admin-google">Sign in with Google</button><p id="dkfm-admin-status" class="small-note"></p>';
        admin.prepend(gate);
        $('dkfm-admin-google').addEventListener('click', async () => {
          const { error } = await db.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href.split('#')[0] } });
          if (error) $('dkfm-admin-status').textContent = error.message;
        });
      }
      gate.hidden = false;
    }

    const originalPlay = window.playEpisode;
    if (typeof originalPlay === 'function') {
      window.playEpisode = function (sid, eid) {
        const story = typeof window.findStory === 'function' ? window.findStory(sid) : null;
        const episode = story && typeof window.findEpisode === 'function' ? window.findEpisode(story, eid) : null;
        if (!currentUser) { openLogin({ sid, eid }); return; }
        if (episode && episode.access === 'paid' && (currentRole !== 'admin' || currentUser.email?.toLowerCase() !== ADMIN_EMAIL)) {
          window.alert('This is a premium episode. Premium payments and secure access are not set up yet, so this episode is locked for now.');
          return;
        }
        return originalPlay(sid, eid);
      };
    }

    // Pause audio if the session disappears while a track is playing.
    db.auth.onAuthStateChange(function (_event, session) {
      if (!session && $('audio')) {
        $('audio').pause();
        $('audio').removeAttribute('src');
      }
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
          } else openLogin(null);
        });
        const updateButton = () => {
          action.textContent = currentUser ? 'Sign out' : 'Sign in with Google';
        };
        updateButton();
        db.auth.onAuthStateChange(() => setTimeout(() => { refreshAuth().then(updateButton).catch(console.error); }, 0));
      }
    }

    db.auth.onAuthStateChange(() => { setTimeout(() => refreshAuth().catch(console.error), 0); });
    refreshAuth().catch((error) => console.error('DK FM auth check failed:', error));
  });
})();
