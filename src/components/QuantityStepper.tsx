"use client";

import { Minus, Plus } from "lucide-react";
import classNames from "classnames";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div
        className={classNames(
          "inline-flex items-center gap-0",
          "rounded-lg premium-3d-elevated overflow-hidden",
          "bg-card"
        )}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={classNames(
            "p-3 transition-all duration-200",
            "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:z-10"
          )}
          aria-label={`Decrease quantity, currently ${value}`}
        >
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={classNames(
            "w-14 py-3 text-center text-base font-medium",
            "bg-transparent border-none outline-none",
            "text-foreground [-moz-appearance:textfield]",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus-visible:z-10",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none"
          )}
          aria-label={label}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={classNames(
            "p-3 transition-all duration-200",
            "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:z-10"
          )}
          aria-label={`Increase quantity, currently ${value}`}
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}