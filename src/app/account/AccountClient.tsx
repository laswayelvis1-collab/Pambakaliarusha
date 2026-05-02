"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";
import type { AuthUser } from "@/lib/auth/getAuthedUser";

interface Profile {
  name: string;
  email: string;
  joinedAt: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
}

interface AccountClientProps {
  user: AuthUser;
  profile: Profile;
  orders: Order[];
  error: string | null;
}

const menuItems = [
  { icon: User, label: "Profile", href: "/account/profile" },
  { icon: Package, label: "Orders", href: "/account/orders" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/account/payment" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

export function AccountClient({ user, profile, orders, error }: AccountClientProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          {user.role === "ADMIN" && (
            <Link
              href="/admin/products"
              className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium premium-3d-button"
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="p-6 rounded-xl bg-card premium-3d-elevated">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Orders
                </h2>
                <Link
                  href="/account/orders"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background border border-border/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {order.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          ${order.total.toFixed(2)}
                        </p>
                        <span
                          className={classNames(
                            "inline-block px-2 py-0.5 rounded text-xs font-medium",
                            order.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : order.status === "PAID" || order.status === "PROCESSING"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          )}
                        >
                          {order.status.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="p-6 rounded-xl bg-card premium-3d-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Account Menu
              </h2>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={classNames(
                      "flex items-center justify-between p-3 rounded-lg",
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      "transition-colors group"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="p-6 rounded-xl bg-card premium-3d-elevated">
                <h3 className="font-semibold text-foreground mb-3">
                  Account Info
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Member since</dt>
                    <dd className="text-foreground">{profile.joinedAt}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Orders</dt>
                    <dd className="text-foreground">{orders.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="text-foreground">{user.role}</dd>
                  </div>
                </dl>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}