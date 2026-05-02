import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export interface AuthUser {
  user_id: string;
  role: "CUSTOMER" | "ADMIN";
  full_name: string | null;
  whatsapp_number: string | null;
}

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function getAuthedUser(): Promise<AuthUser | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();
  const waSessionCookie = cookieStore.get("wa_session");

  const supabase = getSupabaseClient();

  const { data: { session: oauthSession } } = await supabase.auth.getSession();

  if (oauthSession?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, role, full_name, whatsapp_number")
      .eq("user_id", oauthSession.user.id)
      .single();

    if (profile) {
      return profile as AuthUser;
    }

    return {
      user_id: oauthSession.user.id,
      role: "CUSTOMER" as const,
      full_name: oauthSession.user.user_metadata?.full_name ?? null,
      whatsapp_number: oauthSession.user.user_metadata?.phone ?? null,
    };
  }

  if (waSessionCookie?.value) {
    const { data: waSession } = await supabase
      .from("wa_sessions")
      .select("user_id, expires_at")
      .eq("token", waSessionCookie.value)
      .single();

    if (waSession && new Date(waSession.expires_at) > new Date()) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, role, full_name, whatsapp_number")
        .eq("user_id", waSession.user_id)
        .single();

      if (profile) {
        return profile as AuthUser;
      }
    }
  }

  return null;
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin only");
  }
  return user;
}