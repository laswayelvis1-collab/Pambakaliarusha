import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function AdminSettingsPage() {
  const user = await getAuthedUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">Settings</h1>
        <p className="text-muted-foreground">Store settings coming soon...</p>
      </div>
    </div>
  );
}