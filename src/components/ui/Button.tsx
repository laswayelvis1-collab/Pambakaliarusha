"use client";

import { forwardRef } from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary/90 text-primary-foreground border-primary/40 hover:bg-primary active:bg-primary/80",
  secondary:
    "dark:bg-secondary/40 dark:bg-secondary/30 dark:text-secondary-foreground bg-secondary/60 text-secondary-foreground border-secondary/30 hover:bg-secondary/80 active:bg-secondary/70",
  outline:
    "bg-transparent/20 dark:bg-transparent/10 text-foreground dark:text-foreground border-border/40 dark:border-border/60 hover:bg-white/20 dark:hover:bg-white/10 hover:border-foreground/30 active:bg-white/30 dark:active:bg-white/5",
  ghost:
    "bg-transparent/20 dark:bg-transparent/10 text-foreground dark:text-foreground border-transparent hover:bg-white/20 dark:hover:bg-white/10 hover:border-border/30 active:bg-white/30 dark:active:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "relative inline-flex items-center justify-center font-medium rounded-2xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible-ring-primary/30 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "backdrop-blur-xl saturate-150",
          "border shadow-lg",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/20 before:to-transparent dark:before:from-white/10 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          "after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
          "active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 0 rgba(255,255,255,0.15)",
        }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";