"use client";

import { forwardRef, useId } from "react";
import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={classNames(
            "w-full px-4 py-3.5 rounded-lg text-base min-h-[48px]",
            "bg-card text-foreground placeholder:text-muted-foreground",
            "border-2 border-transparent",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
            "premium-3d-elevated",
            error
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              : "hover:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";