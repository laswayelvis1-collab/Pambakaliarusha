"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Truck, RefreshCcw, Shield, Heart, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { QuantityStepper } from "@/components/QuantityStepper";
import { VariantSelector } from "@/components/VariantSelector";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  original_price_cents: number | null;
  stock: number;
  sizes: string[] | null;
  colors: { value: string; label: string; hex: string }[] | null;
  image_urls: string[] | null;
  category: string | null;
}

interface RelatedProduct {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  original_price_cents: number | null;
  image_urls: string[] | null;
  category: string | null;
}

interface ProductClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount = product.original_price_cents && product.original_price_cents > product.price_cents;
  const imageUrls = product.image_urls || [];
  const currentImage = imageUrls[selectedImageIndex] || imageUrls[0] || "/placeholder.jpg";

  const handleAddToCart = async () => {
    const cartItem = {
      product_id: product.id,
      title: product.title,
      size: selectedSize || "Default",
      color: selectedColor || "Default",
      qty: quantity,
      price: product.price_cents / 100,
      image: product.image_urls?.[0] || "/placeholder.jpg",
    };

    try {
      const existing = localStorage.getItem("cart");
      const cart = existing ? JSON.parse(existing) : [];
      const existingIndex = cart.findIndex(
        (item: any) => 
          item.product_id === cartItem.product_id && 
          item.size === cartItem.size && 
          item.color === cartItem.color
      );

      if (existingIndex >= 0) {
        cart[existingIndex].qty += quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "/cart";
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const sizes = (product.sizes || []).map((size) => ({
    value: size,
    label: size,
    available: product.stock > 0,
  }));

  const colors = (product.colors || []).map((c) => ({
    value: c.value,
    label: c.label,
    hex: c.hex,
    available: product.stock > 0,
  }));

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden premium-3d-elevated">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={classNames(
                      "relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0",
                      "premium-3d-light transition-all",
                      selectedImageIndex === index
                        ? "ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {product.category && (
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.category}
              </p>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {product.title}
            </h1>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-foreground">
                ${(product.price_cents / 100).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${(product.original_price_cents! / 100).toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-1 bg-rose-100 text-rose-800 text-sm font-medium rounded dark:bg-rose-900/30 dark:text-rose-400">
                  {Math.round(((product.original_price_cents! - product.price_cents) / product.original_price_cents!) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="py-4 border-y border-border/50">
              <VariantSelector
                sizes={sizes}
                colors={colors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />
            </div>

            <div className="space-y-4">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
              />

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={isAdding}
                  onClick={handleAddToCart}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border/50">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.title}
                  price={p.price_cents / 100}
                  originalPrice={p.original_price_cents ? p.original_price_cents / 100 : undefined}
                  image={p.image_urls?.[0] || "/placeholder.jpg"}
                  category={p.category || undefined}
                  isSale={!!p.original_price_cents}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}