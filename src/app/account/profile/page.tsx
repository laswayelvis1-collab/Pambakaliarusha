import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function ProfilePage() {
  const user = await getAuthedUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">My Profile</h1>
        <div className="p-6 rounded-xl bg-card premium-3d-elevated">
          <p className="text-foreground">Name: {user.full_name || "Not set"}</p>
          <p className="text-muted-foreground mt-2">Email: {user.user_id}</p>
          <p className="text-muted-foreground mt-2">Role: {user.role}</p>
        </div>
      </div>
    </div>
  );
}