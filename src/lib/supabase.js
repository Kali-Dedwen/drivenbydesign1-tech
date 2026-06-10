import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Surface a clear error in dev rather than failing silently inside the SDK.
  console.error(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Add them to .env.local (dev) and Vercel project env (prod)."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "m2m-portal-auth",
  },
});

export const SUPABASE_URL_PUBLIC = SUPABASE_URL;
export const SUPABASE_ANON_KEY_PUBLIC = SUPABASE_ANON_KEY;
