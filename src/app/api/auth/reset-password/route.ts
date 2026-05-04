import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Delete existing user if exists
    const { data: existingUser } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // Create new user with the specified password
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: { full_name: "Elvis" },
    });

    if (createError) {
      console.error("Create user error:", createError);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Create profile with ADMIN role
    if (userData.user) {
      await supabase.from("profiles").upsert({
        user_id: userData.user.id,
        role: "ADMIN",
        full_name: "Elvis",
      });
    }

    return NextResponse.json({ success: true, user: userData.user });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}