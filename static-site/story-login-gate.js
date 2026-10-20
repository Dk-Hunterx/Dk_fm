(function () {
  function setup() {
    var db = window.dkfmSupabase;
    if (!db) return;
    var user = null;
    db.auth.getUser().then(function (result) { user = result.data && result.data.user || null; });
    db.auth.onAuthStateChange(function (_event, session) { user = session && session.user || null; });

    var original = window.openStory;
    if (typeof original !== 'function') return;
    window.openStory = function (id) {
      if (!user) {
        var modal = document.getElementById('dkfm-auth-modal');
        if (modal) {
          var title = document.getElementById('dkfm-auth-title');
          var copy = document.getElementById('dkfm-auth-copy');
          var status = document.getElementById('dkfm-auth-status');
          if (title) title.textContent = 'Sign in to open this story';
          if (copy) copy.textContent = 'Browse the story catalogue freely. Sign in with Google to open stories and listen to episodes.';
          if (status) status.textContent = '';
          modal.hidden = false;
          modal.style.display = 'flex';
        } else {
          alert('Please sign in with Google to open this story.');
        }
        return;
      }
      return original(id);
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();