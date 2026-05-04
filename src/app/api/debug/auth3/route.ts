import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "No Supabase config" });
  }

  // Get access token from cookie
  const accessToken = cookieStore.get("sb-access-token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" });
  }

  // Call Supabase REST API directly
  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?user_id=eq.f00ee358-88ac-44bc-afe9-cbb2a1f21c9e&select=*`,
    {
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json({
    profiles: data,
    status: response.status,
  });
}