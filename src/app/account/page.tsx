import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function AccountPage() {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  // If admin, redirect to admin page
  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let profile = { name: "User", email: "Not set", joinedAt: "N/A" };
  let orders: any[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("user_id, full_name, whatsapp_number, created_at")
      .eq("user_id", user.user_id)
      .maybeSingle();

    if (profileData) {
      profile = {
        name: profileData.full_name || "User",
        email: profileData.whatsapp_number || "No email",
        joinedAt: profileData.created_at
          ? new Date(profileData.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "N/A",
      };
    }

    const { data: ordersData } = await supabase
      .from("orders")
      .select("id, status, total_cents, created_at")
      .eq("user_id", user.user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    orders = (ordersData || []).map((o: any) => ({
      id: o.id,
      date: new Date(o.created_at).toLocaleDateString("en-CA"),
      status: o.status,
      total: o.total_cents / 100,
    }));
  }

  const { AccountClient } = await import("./AccountClient");
  
  return <AccountClient user={user} profile={profile} orders={orders} error={null} />;
}