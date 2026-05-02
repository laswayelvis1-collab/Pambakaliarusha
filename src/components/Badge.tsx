"use client";

import classNames from "classnames";

type BadgeVariant = "new" | "sale" | "soldout" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  sale: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  soldout: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  default: "bg-accent text-foreground",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        "premium-3d-light",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}