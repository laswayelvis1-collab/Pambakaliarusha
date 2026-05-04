import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function OrdersPage() {
  const user = await getAuthedUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">My Orders</h1>
        <div className="p-6 rounded-xl bg-card premium-3d-elevated">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      </div>
    </div>
  );
}