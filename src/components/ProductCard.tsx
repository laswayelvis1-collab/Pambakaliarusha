"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Badge } from "./Badge";
import classNames from "classnames";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isSale?: boolean;
  isSoldOut?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
  isSale,
  isSoldOut,
}: ProductCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <article className="group relative">
      <div
        className={classNames(
          "relative overflow-hidden rounded-xl premium-3d-elevated",
          "bg-card transition-all duration-300",
          "hover:premium-3d-hover hover:-translate-y-1"
        )}
      >
        <Link href={`/product/${id}`} className="block relative aspect-[4/5]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && <Badge variant="new">New</Badge>}
          {isSale && hasDiscount && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
          {isSoldOut && <Badge variant="soldout">Sold Out</Badge>}
        </div>

        <div
          className={classNames(
            "absolute top-3 right-3 flex flex-col gap-2",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "translate-x-4 group-hover:translate-x-0"
          )}
        >
          <button
            type="button"
            className={classNames(
              "p-2.5 rounded-lg premium-3d-button transition-all duration-200",
              "bg-background/90 backdrop-blur hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-foreground" />
          </button>
          <button
            type="button"
            className={classNames(
              "p-2.5 rounded-lg premium-3d-button transition-all duration-200",
              "bg-background/90 backdrop-blur hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {!isSoldOut && (
          <button
            type="button"
            className={classNames(
              "absolute bottom-4 left-4 right-4 py-3 px-4",
              "bg-primary text-primary-foreground font-medium rounded-lg",
              "premium-3d-button flex items-center justify-center gap-2",
              "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
              "transition-all duration-300",
              "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>

      <div className="mt-4 space-y-1">
        {category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </p>
        )}
        <Link href={`/product/${id}`}>
          <h3 className="text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}