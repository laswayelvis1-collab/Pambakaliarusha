"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";

interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  slug?: string;
}

interface CartClientProps {
  initialItems: CartItem[];
  error: string | null;
}

export function CartClient({ initialItems, error }: CartClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: quantity }),
      });
      if (res.ok) {
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 10000 ? 0 : 999;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/shop">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={classNames(
                  "flex gap-4 p-4 rounded-xl",
                  "bg-card premium-3d-elevated"
                )}
              >
                <Link
                  href={`/product/${item.slug || item.productId}`}
                  className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden premium-3d-light"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <Link
                      href={`/product/${item.slug || item.productId}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={classNames(
                        "p-1.5 rounded-lg text-muted-foreground",
                        "hover:text-destructive hover:bg-destructive/10",
                        "transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/20"
                      )}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Size: {item.size}</span>
                    <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.color === 'White' ? '#fff' : '#1e3a5f' }} />
                    <span>Color: {item.color}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                      min={1}
                      max={10}
                      label=""
                    />
                    <span className="text-base font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card premium-3d-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "FREE" : `$${(shipping / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-foreground">${(tax / 100).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {subtotal < 10000 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Add ${((10000 - subtotal) / 100).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button variant="primary" size="lg" className="w-full mt-6" disabled={isLoading}>
                Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}