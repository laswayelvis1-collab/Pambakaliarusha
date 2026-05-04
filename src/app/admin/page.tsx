import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, Users, Settings } from "lucide-react";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";

export default async function AdminPage() {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    { icon: Package, label: "Products", href: "/admin/products", desc: "Manage your product catalog" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders", desc: "View and manage orders" },
    { icon: Users, label: "Customers", href: "/admin/customers", desc: "View customer information" },
    { icon: Settings, label: "Settings", href: "/admin/settings", desc: "Store configuration" },
  ];

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user.full_name || "Admin"}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="p-6 rounded-xl bg-card premium-3d-elevated hover:bg-accent transition-colors group"
            >
              <item.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}