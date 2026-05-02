import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.warn("Twilio credentials not configured. WhatsApp OTP will not work.");
}

export const twilioClient = accountSid && authToken
  ? twilio(accountSid, authToken)
  : null;

export const VERIFY_SERVICE_SID = verifyServiceSid;

export function normalizeToWhatsAppE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  
  if (digits.startsWith("255")) {
    return `whatsapp:+${digits}`;
  }
  
  if (digits.startsWith("0")) {
    return `whatsapp:+255${digits.slice(1)}`;
  }
  
  if (digits.length === 9) {
    return `whatsapp:+255${digits}`;
  }
  
  if (digits.length === 10 && digits.startsWith("0")) {
    return `whatsapp:+255${digits.slice(1)}`;
  }
  
  return `whatsapp:+${digits}`;
}

export async function startWhatsAppVerification(phone: string) {
  if (!twilioClient || !VERIFY_SERVICE_SID) {
    throw new Error("Twilio not configured");
  }

  const to = normalizeToWhatsAppE164(phone);

  const verification = await twilioClient.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({
      to,
      channel: "whatsapp",
    });

  return verification;
}

export async function checkWhatsAppVerification(phone: string, code: string) {
  if (!twilioClient || !VERIFY_SERVICE_SID) {
    throw new Error("Twilio not configured");
  }

  const to = normalizeToWhatsAppE164(phone);

  const verificationCheck = await twilioClient.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to,
      code,
    });

  return verificationCheck;
}