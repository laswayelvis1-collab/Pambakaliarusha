import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { createSnippeSession } from "@/lib/snippe/snippe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  const user = await getAuthedUser();

  if (!user || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const body = await request.json();

  const { shipping_address, shipping_name, shipping_phone, cart_items } = body;

  if (!cart_items || cart_items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (!shipping_name || !shipping_phone || !shipping_address) {
    return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
  }

  const subtotal = cart_items.reduce(
    (sum: number, item: any) => sum + (item.unit_price_cents * item.qty),
    0
  );
  const shipping_cents = subtotal > 10000 ? 0 : 999;
  const tax_cents = Math.round(subtotal * 0.08);
  const total_cents = subtotal + shipping_cents + tax_cents;

  // TODO: Replace stub with actual Snippe session creation
  // const snippeSession = await createSnippeSession({
  //   amount: total_cents,
  //   currency: "TZS",
  //   order_id: "", // Will be set after order creation
  //   customer_name: shipping_name,
  //   customer_phone: shipping_phone,
  //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/{order_id}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  // });

  // Stub: Get mock session for now
  const snippeSession = await createSnippeSession({
    amount: total_cents,
    currency: "TZS",
    order_id: "", // placeholder
    customer_name: shipping_name,
    customer_phone: shipping_phone,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order/PLACEHOLDER`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
  });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.user_id,
      status: "CREATED",
      subtotal_cents: subtotal,
      shipping_cents,
      tax_cents,
      total_cents,
      shipping_name,
      shipping_phone,
      shipping_address,
      snippe_payment_ref: snippeSession.session_id, // Store Snippe session ID
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // Update order with correct success/cancel URLs now that we have order ID
  // TODO: Uncomment when actual Snippe API supports updating session
  // await supabase.from("orders").update({
  //   snippe_payment_ref: snippeSession.checkout_url
  // }).eq("id", order.id);

  const orderItems = cart_items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    title: item.title || "Product",
    image_url: item.image || null,
    size: item.size,
    color: item.color,
    qty: item.qty,
    unit_price_cents: item.unit_price_cents,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_user_id", user.user_id);

  if (clearCartError) {
    console.error("Failed to clear cart:", clearCartError);
  }

  return NextResponse.json({
    order_id: order.id,
    total_cents,
    snippe_session_id: snippeSession.session_id,
    snippe_checkout_url: snippeSession.checkout_url,
  });
}