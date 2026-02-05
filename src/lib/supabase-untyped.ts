import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (() => {
  const raw = import.meta.env.VITE_SUPABASE_URL;
  if (!raw) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
})();
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Untyped client for tables not yet in generated types
export const supabaseUntyped = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
