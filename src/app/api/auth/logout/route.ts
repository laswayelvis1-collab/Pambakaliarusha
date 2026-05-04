import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Delete all possible Supabase auth cookies
  cookieStore.delete("wa_session");
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  cookieStore.delete("sb-");
  cookieStore.delete("supabase.auth.token");

  // Also clear on client side by setting expired cookies
  const response = NextResponse.json({ success: true });
  
  // Set expired cookies to clear them
  response.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });
  
  return response;
}