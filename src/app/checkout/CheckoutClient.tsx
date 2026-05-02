"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Truck,
  CreditCard,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
  unit_price_cents: number;
  slug: string;
}

interface CheckoutClientProps {
  user: { user_id: string; full_name: string | null; whatsapp_number: string | null };
  initialItems: CartItem[];
  error: string | null;
}

type Step = "shipping" | "payment" | "confirm";

const steps = [
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirm", label: "Confirm", icon: CheckCircle2 },
];

export function CheckoutClient({ user, initialItems, error }: CheckoutClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [shippingForm, setShippingForm] = useState({
    name: user.full_name || "",
    phone: user.whatsapp_number || "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
  });

  const subtotal = initialItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 10000 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.address) {
      setFormError("Please fill in all required shipping details");
      return;
    }
    setFormError(null);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = () => {
    setFormError(null);
    setCurrentStep("confirm");
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_name: shippingForm.name,
          shipping_phone: shippingForm.phone,
          shipping_address: {
            street: shippingForm.address,
            city: shippingForm.city,
            postal_code: shippingForm.postal_code,
            notes: shippingForm.notes,
          },
          cart_items: initialItems.map((item) => ({
            product_id: item.productId,
            title: item.title,
            image: item.image,
            size: item.size,
            color: item.color,
            qty: item.quantity,
            unit_price_cents: item.unit_price_cents,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to create order");
        return;
      }

      router.push(`/order/${data.order_id}`);
    } catch (err) {
      setFormError("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/cart">
            <Button variant="primary">Return to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={classNames(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "border-2 transition-all duration-200",
                    index <= currentStepIndex
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-transparent border-border text-muted-foreground"
                  )}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={classNames(
                    "text-sm mt-2 font-medium",
                    index <= currentStepIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={classNames(
                    "w-16 lg:w-24 h-0.5 mx-2",
                    index < currentStepIndex
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="p-6 rounded-xl bg-card premium-3d-elevated">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </h2>

                  {formError && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      placeholder="+255 XXX XXX XXX"
                      required
                    />

                    <Input
                      label="Street Address"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      placeholder="123 Main Street"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        placeholder="Arusha"
                      />

                      <Input
                        label="Postal Code"
                        value={shippingForm.postal_code}
                        onChange={(e) => setShippingForm({ ...shippingForm, postal_code: e.target.value })}
                        placeholder="12345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Order Notes (optional)
                      </label>
                      <textarea
                        value={shippingForm.notes}
                        onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                        rows={2}
                        placeholder="Any special instructions..."
                        className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none premium-3d-elevated resize-none"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            )}

            {currentStep === "payment" && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-card premium-3d-elevated">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded" />
                        <div>
                          <p className="font-medium text-foreground">Snippe Payment</p>
                          <p className="text-sm text-muted-foreground">Pay securely with Snippe</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      You will be redirected to Snippe to complete your payment after confirming the order.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handlePaymentSubmit}
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "confirm" && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-card premium-3d-elevated">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Order Review
                  </h2>

                  {formError && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="pb-4 border-b border-border/50">
                      <h3 className="font-medium text-foreground mb-2">Shipping To:</h3>
                      <p className="text-muted-foreground">
                        {shippingForm.name}<br />
                        {shippingForm.phone}<br />
                        {shippingForm.address}<br />
                        {shippingForm.city && `${shippingForm.city}, `}
                        {shippingForm.postal_code}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-foreground mb-2">Items ({initialItems.length}):</h3>
                      <div className="space-y-3">
                        {initialItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 premium-3d-light">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.size} / {item.color} × {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("payment")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order (${(total / 100).toFixed(2)})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card premium-3d-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {initialItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 premium-3d-light">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {initialItems.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{initialItems.length - 3} more items
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-border/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "FREE" : `$${(shipping).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-foreground">${(tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border/50">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}