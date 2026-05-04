import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  
  if (code) {
    // The code will be exchanged for a session automatically by Supabase
    // due to detectSessionInUrl being enabled in the client
  }
  
  redirect("/account");
}