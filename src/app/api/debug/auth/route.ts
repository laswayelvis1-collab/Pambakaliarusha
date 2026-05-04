import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "No Supabase config" });
  }

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

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated", userError });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, role, full_name, whatsapp_number")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    userId: user.id,
    profile,
    profileError: profileError?.message || null,
    cookies: {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    }
  });
}