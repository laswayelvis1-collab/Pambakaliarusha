import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials not configured");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component
        }
      },
    },
  });
}

export const supabase = {
  async signInWithOAuth(options: Parameters<SupabaseClient["auth"]["signInWithOAuth"]>[0]) {
    const { createBrowserClient } = await import("@supabase/ssr");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: new Error("Supabase not configured") };
    }
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return client.auth.signInWithOAuth(options as never);
  },
  auth: {
    getSession: async () => {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: { session: null }, error: null };
      }
      const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
      return client.auth.getSession();
    },
  },
};