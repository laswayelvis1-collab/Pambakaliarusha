import { redirect } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, Bell, Lock, Trash2 } from "lucide-react";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function SettingsPage() {
  const user = await getAuthedUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">Account Settings</h1>
        
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <Moon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle theme</p>
                </div>
              </div>
              <Link href="/" className="text-primary text-sm">Toggle</Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <Bell className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Manage alerts</p>
                </div>
              </div>
              <Link href="/" className="text-primary text-sm">Manage</Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent">
                  <Lock className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">Change password</p>
                </div>
              </div>
              <Link href="/" className="text-primary text-sm">Update</Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently remove</p>
                </div>
              </div>
              <button className="text-destructive text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}