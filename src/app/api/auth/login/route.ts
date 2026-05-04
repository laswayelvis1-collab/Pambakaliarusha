import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Use anon key for regular authentication
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!authData.session) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }

    // Create response with user data
    const response = NextResponse.json({ 
      success: true,
      user: { id: authData.user?.id, email: authData.user?.email }
    });

    // Set the session cookies
    response.cookies.set("sb-access-token", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: authData.session.expires_in,
      path: "/",
    });

    response.cookies.set("sb-refresh-token", authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}