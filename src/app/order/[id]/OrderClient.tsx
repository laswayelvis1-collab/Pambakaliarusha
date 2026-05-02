"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle, Clock, Truck, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";

interface OrderItem {
  id: string;
  title: string;
  image_url: string | null;
  size: string;
  color: string;
  qty: number;
  unit_price_cents: number;
}

interface Order {
  id: string;
  status: string;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: any;
  created_at: string;
  items: OrderItem[];
}

interface OrderClientProps {
  order: Order;
}

const statusSteps = [
  { key: "CREATED", label: "Order Created", icon: Clock, description: "Your order has been placed" },
  { key: "PAID", label: "Payment Confirmed", icon: CheckCircle2, description: "Payment has been received" },
  { key: "PROCESSING", label: "Processing", icon: Package, description: "We are preparing your order" },
  { key: "SHIPPED", label: "Shipped", icon: Truck, description: "Your order is on its way" },
  { key: "DELIVERED", label: "Delivered", icon: Home, description: "Order has been delivered" },
];

function getStepIndex(status: string): number {
  const statusMap: Record<string, number> = {
    CREATED: 0,
    PAID: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: -1,
  };
  return statusMap[status] ?? 0;
}

export function OrderClient({ order }: OrderClientProps) {
  const currentStepIndex = getStepIndex(order.status);
  const isCancelled = order.status === "CANCELLED";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order ID is{" "}
            <span className="font-medium text-foreground">{order.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {/* Status Timeline */}
        <div className="p-6 rounded-xl bg-card premium-3d-elevated mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Order Status
          </h2>

          {isCancelled ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium">This order has been cancelled</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div
                        className={classNames(
                          "relative z-10 w-10 h-10 rounded-full flex items-center justify-center",
                          "border-2 transition-all duration-200",
                          isCompleted || isCurrent
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className={classNames(
                        "flex-1 pb-2",
                        isPending && "opacity-50"
                      )}>
                        <p className={classNames(
                          "font-medium",
                          isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-primary mt-1">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{order.shipping_name}</p>
              <p className="text-muted-foreground">{order.shipping_phone}</p>
              {order.shipping_address && (
                <>
                  <p className="text-muted-foreground">
                    {order.shipping_address.street}
                  </p>
                  {order.shipping_address.city && (
                    <p className="text-muted-foreground">
                      {order.shipping_address.city}
                      {order.shipping_address.postal_code && `, ${order.shipping_address.postal_code}`}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card premium-3d-elevated">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${(order.subtotal_cents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shipping_cents === 0 ? "FREE" : `$${(order.shipping_cents / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${(order.tax_cents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/50">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-foreground">${(order.total_cents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 p-6 rounded-xl bg-card premium-3d-elevated">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ordered Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 premium-3d-light">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.size} / {item.color} × {item.qty}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    ${((item.unit_price_cents * item.qty) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/orders">
            <Button variant="outline" size="lg">
              View All Orders
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}