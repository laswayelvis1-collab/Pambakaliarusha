import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthedUser();

  if (!user || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id)
    .eq("cart_user_id", user.user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthedUser();

  if (!user || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { qty } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("cart_items")
    .update({ qty })
    .eq("id", id)
    .eq("cart_user_id", user.user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}