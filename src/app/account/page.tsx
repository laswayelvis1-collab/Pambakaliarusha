import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { AccountClient } from "./AccountClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getAccountData(userId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      profile: { name: "Guest User", email: "Not configured", joinedAt: "N/A" },
      orders: [],
      error: "Database not configured",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, full_name, whatsapp_number, created_at")
    .eq("user_id", userId)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    profile: {
      name: profile?.full_name || "User",
      email: profile?.whatsapp_number ? `+${profile.whatsapp_number}` : "No email",
      joinedAt: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "N/A",
    },
    orders:
      orders?.map((o) => ({
        id: o.id,
        date: new Date(o.created_at).toLocaleDateString("en-CA"),
        status: o.status,
        total: o.total_cents / 100,
      })) || [],
    error: null,
  };
}

export default async function AccountPage() {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, orders, error } = await getAccountData(user.user_id);

  return (
    <AccountClient
      user={user}
      profile={profile}
      orders={orders}
      error={error}
    />
  );
}