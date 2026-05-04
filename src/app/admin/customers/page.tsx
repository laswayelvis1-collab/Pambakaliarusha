import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function AdminCustomersPage() {
  const user = await getAuthedUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">Customers</h1>
        <p className="text-muted-foreground">Customer management coming soon...</p>
      </div>
    </div>
  );
}