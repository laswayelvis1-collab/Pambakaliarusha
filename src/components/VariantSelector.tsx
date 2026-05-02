"use client";

import classNames from "classnames";

interface SizeOption {
  value: string;
  label: string;
  available?: boolean;
}

interface ColorOption {
  value: string;
  label: string;
  hex: string;
  available?: boolean;
}

interface VariantSelectorProps {
  sizes?: SizeOption[];
  colors?: ColorOption[];
  selectedSize?: string;
  selectedColor?: string;
  onSizeChange?: (size: string) => void;
  onColorChange?: (color: string) => void;
}

export function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {sizes && sizes.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">
            <span aria-hidden="true">Size: </span>
            {selectedSize && (
              <span className="text-muted-foreground font-normal">
                {selectedSize}
              </span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => size.available !== false && onSizeChange?.(size.value)}
                disabled={size.available === false}
                className={classNames(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  selectedSize === size.value
                    ? "bg-primary text-primary-foreground premium-3d-button"
                    : "bg-card text-foreground premium-3d-elevated hover:bg-accent",
                  size.available === false
                    ? "opacity-40 cursor-not-allowed line-through"
                    : "cursor-pointer"
                )}
                aria-label={`Size ${size.label}${size.available === false ? ', unavailable' : ''}`}
                aria-pressed={selectedSize === size.value}
              >
                {size.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {colors && colors.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">
            <span aria-hidden="true">Color: </span>
            {selectedColor && (
              <span className="text-muted-foreground font-normal">
                {colors.find((c) => c.value === selectedColor)?.label}
              </span>
            )}
          </legend>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => color.available !== false && onColorChange?.(color.value)}
                disabled={color.available === false}
                className={classNames(
                  "relative w-10 h-10 rounded-full transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
                  selectedColor === color.value
                    ? "ring-2 ring-primary ring-offset-2 premium-3d-elevated"
                    : "premium-3d-light hover:premium-3d-elevated",
                  color.available === false
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={`Color ${color.label}${color.available === false ? ', unavailable' : ''}`}
                aria-pressed={selectedColor === color.value}
              >
                {selectedColor === color.value && (
                  <span
                    className={classNames(
                      "absolute inset-2 rounded-full",
                      color.hex === "#ffffff" || color.hex === "#fff" || color.hex === "#FFF"
                        ? "bg-primary"
                        : "bg-white"
                    )}
                  >
                    <span className="absolute inset-1 rounded-full bg-primary" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}