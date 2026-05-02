import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  const user = await getAuthedUser();

  if (!user || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const body = await request.json();

  const { product_id, size, color, qty, unit_price_cents } = body;

  if (!product_id || !size || !color || !qty || !unit_price_cents) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, qty")
    .eq("cart_user_id", user.user_id)
    .eq("product_id", product_id)
    .eq("size", size)
    .eq("color", color)
    .single();

  if (existingItem) {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ qty: existingItem.qty + qty })
      .eq("id", existingItem.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  } else {
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_user_id: user.user_id,
      product_id,
      size,
      color,
      qty,
      unit_price_cents,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}