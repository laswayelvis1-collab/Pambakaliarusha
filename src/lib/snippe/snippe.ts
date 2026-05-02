/**
 * Snippe Payment Integration Stub
 * 
 * TODO: Implement actual Snippe integration when credentials are provided
 * 
 * Required env vars:
 * - SNIPPE_API_KEY: Your Snippe API key
 * - SNIPPE_STORE_ID: Your Snippe store ID
 * - SNIPPE_WEBHOOK_SECRET: Webhook signature verification secret
 * 
 * Snippe API docs: https://snippe.com/docs
 */

export interface SnippeSessionRequest {
  amount: number; // Amount in smallest currency unit (cents)
  currency: string; // e.g., "TZS", "USD"
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  description?: string;
  success_url: string;
  cancel_url: string;
}

export interface SnippeSessionResponse {
  session_id: string;
  checkout_url: string;
  expires_at: string;
}

export interface SnippeWebhookPayload {
  event: string;
  session_id: string;
  order_id: string;
  status: "completed" | "failed" | "expired" | "pending";
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

/**
 * Creates a payment session with Snippe
 * 
 * TODO: Replace stub with actual API call
 * Example implementation:
 * ```
 * const response = await fetch('https://api.snippe.com/v1/checkout/sessions', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${SNIPPE_API_KEY}`,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(request),
 * });
 * return response.json();
 * ```
 */
export async function createSnippeSession(
  request: SnippeSessionRequest
): Promise<SnippeSessionResponse> {
  console.log("[Snippe Stub] createSnippeSession called with:", request);
  
  // TODO: Replace with actual Snippe API call
  // const response = await fetch('https://api.snippe.com/v1/checkout/sessions', { ... });
  
  // Stub response for development
  const stubSessionId = `snippe_sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    session_id: stubSessionId,
    checkout_url: `https://checkout.snippe.com/${stubSessionId}`,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
  };
}

/**
 * Verifies Snippe webhook signature
 * 
 * TODO: Replace stub with actual signature verification
 * Example implementation:
 * ```
 * import crypto from 'crypto';
 * 
 * const signature = req.headers.get('x-snippe-signature');
 * const payload = JSON.stringify(req.body);
 * const expected = crypto
 *   .createHmac('sha256', SNIPPE_WEBHOOK_SECRET)
 *   .update(payload)
 *   .digest('hex');
 * 
 * return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
 * ```
 */
export function verifySnippeSignature(
  payload: string,
  signature: string
): boolean {
  console.log("[Snippe Stub] verifySnippeSignature called");
  
  // TODO: Replace with actual signature verification
  // const expected = crypto.createHmac('sha256', SNIPPE_WEBHOOK_SECRET).update(payload).digest('hex');
  // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  
  // Stub: always return true for development
  // TODO: Remove this in production!
  return true;
}

/**
 * Retrieves payment session status from Snippe
 */
export async function getSnippeSessionStatus(
  sessionId: string
): Promise<{ status: string; amount: number }> {
  console.log("[Snippe Stub] getSnippeSessionStatus called for:", sessionId);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`https://api.snippe.com/v1/checkout/sessions/${sessionId}`, { ... });
  
  // Stub response
  return {
    status: "pending",
    amount: 0,
  };
}