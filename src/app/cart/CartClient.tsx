"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";

interface CartItem {
  id?: string;
  product_id: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  slug?: string;
}

export function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const removeItem = (productId: string, size: string, color: string) => {
    const updated = cartItems.filter(
      (item) => !(item.product_id === productId && item.size === size && item.color === color)
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQuantity = (productId: string, size: string, color: string, qty: number) => {
    const updated = cartItems.map((item) =>
      item.product_id === productId && item.size === size && item.color === color
        ? { ...item, qty }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started</p>
        <Link href="/shop">
          <Button variant="primary">
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.product_id}-${item.size}-${item.color}-${index}`}
                className="flex gap-4 p-4 rounded-xl bg-card premium-3d-elevated"
              >
                <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 premium-3d-light">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="font-medium text-foreground mt-2">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product_id, item.size, item.color)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <QuantityStepper
                    value={item.qty}
                    onChange={(qty) => updateQuantity(item.product_id, item.size, item.color, qty)}
                    max={99}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card premium-3d-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="pt-3 border-t border-border/50 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button variant="primary" size="lg" className="w-full mt-6">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}