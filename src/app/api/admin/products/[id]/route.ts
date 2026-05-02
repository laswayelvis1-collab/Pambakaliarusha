import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/getAuthedUser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { id } = await params;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const body = await request.json();

  const { title, slug, description, price_cents, stock, is_active, sizes, colors, image_urls, category } = body;

  const { data, error } = await supabase
    .from("products")
    .update({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(price_cents !== undefined && { price_cents }),
      ...(stock !== undefined && { stock }),
      ...(is_active !== undefined && { is_active }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
      ...(image_urls && { image_urls }),
      ...(category !== undefined && { category }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}