/* Require a verified Supabase session before opening story details. */
(function () {
  function setup() {
    var db = window.dkfmSupabase;
    if (!db) return;
    var original = window.openStory;
    if (typeof original !== 'function') return;
    window.openStory = async function (id) {
      var result = await db.auth.getUser();
      var user = result.data && result.data.user || null;
      if (!user || !user.email_confirmed_at) {
        var modal = document.getElementById('dkfm-auth-modal');
        if (modal) {
          var title = document.getElementById('dkfm-auth-title');
          var copy = document.getElementById('dkfm-auth-copy');
          var status = document.getElementById('dkfm-auth-status');
          if (title) title.textContent = 'Login or sign up to open this story';
          if (copy) copy.textContent = 'Browse the catalogue freely. Create an account or log in with your email and password to open stories and listen.';
          if (status) status.textContent = user ? 'Please verify your email before continuing.' : '';
          modal.hidden = false;
          modal.style.display = 'flex';
        } else {
          alert('Please log in or sign up to open this story.');
        }
        return;
      }
      return original(id);
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();