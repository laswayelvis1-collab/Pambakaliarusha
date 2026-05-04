import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export interface AuthUser {
  user_id: string;
  role: "CUSTOMER" | "ADMIN";
  full_name: string | null;
  whatsapp_number: string | null;
}

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}&select=user_id,role,full_name,whatsapp_number`,
    {
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as AuthUser;
  }
  return null;
}

export async function getAuthedUser(): Promise<AuthUser | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return null;
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const profile = await fetchProfile(user.id);

    if (profile) {
      return profile;
    }

    return {
      user_id: user.id,
      role: "CUSTOMER" as const,
      full_name: user.user_metadata?.full_name ?? null,
      whatsapp_number: user.user_metadata?.phone ?? null,
    };
  } catch {
    return null;
  }
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