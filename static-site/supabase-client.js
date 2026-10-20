/* DK FM Supabase client.
 * This module uses only the public publishable key.
 * Row Level Security must remain enabled in Supabase.
 */
(function (window) {
  'use strict';
  const SUPABASE_URL = 'https://eunotnidpilgbcyxbhsz.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8LEDyATzZjaHWO5MZLcZog_xQReNfX6';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('DK FM: Supabase SDK did not load.');
    return;
  }

  window.dkfmSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
})(window);
