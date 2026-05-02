import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySnippeSignature, type SnippeWebhookPayload } from "@/lib/snippe/snippe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Snippe Webhook Handler
 * 
 * TODO: Implement when Snippe credentials are provided
 * 
 * This endpoint receives payment status updates from Snippe.
 * It verifies the webhook signature and updates the order status accordingly.
 * 
 * Expected events:
 * - payment.completed: Update order status to PAID
 * - payment.failed: Update order status to FAILED
 * - payment.expired: Update order status to EXPIRED
 * - payment.pending: Update order status to PENDING
 */
export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("x-snippe-signature") || "";

  // Verify signature (stub always returns true for development)
  // TODO: Implement actual verification in production
  const isValid = verifySnippeSignature(body, signature);

  if (!isValid) {
    console.error("[Snippe Webhook] Invalid signature");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  const payload: SnippeWebhookPayload = JSON.parse(body);

  console.log("[Snippe Webhook] Received:", payload);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Map Snippe status to order status
  const statusMap: Record<string, string> = {
    completed: "PAID",
    failed: "FAILED",
    expired: "EXPIRED",
    pending: "PENDING",
  };

  const orderStatus = statusMap[payload.status] || "CREATED";

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: orderStatus,
      updated_at: new Date().toISOString(),
      ...(payload.status === "completed" && {
        paid_at: new Date().toISOString(),
      }),
    })
    .eq("id", payload.order_id);

  if (updateError) {
    console.error("[Snippe Webhook] Failed to update order:", updateError);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  console.log(`[Snippe Webhook] Order ${payload.order_id} updated to ${orderStatus}`);

  return NextResponse.json({ success: true });
}