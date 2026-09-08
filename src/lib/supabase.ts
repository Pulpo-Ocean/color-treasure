import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Color Treasure: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required for server gameplay.');
}

export const supabase = createClient(
  supabaseUrl ?? 'https://invalid.supabase.co',
  supabaseAnonKey ?? 'missing-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);

export async function requireSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(`AUTH_SESSION_ERROR:${error.message}`);
  if (data.session) return data.session;

  const anonymous = await supabase.auth.signInAnonymously();
  if (anonymous.error || !anonymous.data.session) {
    throw new Error(
      `AUTH_REQUIRED:${anonymous.error?.message ?? 'No authenticated session available.'}`,
    );
  }
  return anonymous.data.session;
}
