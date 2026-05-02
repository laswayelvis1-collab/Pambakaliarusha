import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not configured");
    return null;
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = {
  get client() {
    return getSupabaseClient();
  },
  async signInWithOAuth(options: Parameters<SupabaseClient["auth"]["signInWithOAuth"]>[0]) {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase not configured") };
    }
    return client.auth.signInWithOAuth(options as never);
  },
  auth: {
    getSession: async () => {
      const client = getSupabaseClient();
      if (!client) return { data: { session: null }, error: null };
      return client.auth.getSession();
    },
  },
};