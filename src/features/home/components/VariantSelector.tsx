"use client";

import { PRODUCT_VARIANTS, ProductVariant } from "../constants/variants";

interface VariantSelectorProps {
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

/**
 * VariantSelector Component
 * Minimalist Apple Glassmorphism Product Color Variant Cards.
 * Each card displays the true physical variant color background with frosted glass backdrop,
 * specular glowing borders, and zero outer chrome.
 * Strictly complies with ZERO ICONS rule.
 */
export function VariantSelector({
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {PRODUCT_VARIANTS.map((variant) => {
        const isSelected = selectedVariant.id === variant.id;

        return (
          <button
            key={variant.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectVariant(variant);
            }}
            type="button"
            className={`group relative flex items-center justify-between gap-4 rounded-2xl p-3 text-left backdrop-blur-xl transition-all duration-300 ${variant.cardBg} ${variant.cardText} ${
              isSelected
                ? "scale-105 border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                : "border border-white/60 hover:scale-102 hover:border-white hover:shadow-[0_8px_24px_rgba(255,255,255,0.4)] opacity-85 hover:opacity-100"
            }`}
            style={{
              boxShadow: isSelected
                ? `0 10px 30px ${variant.glowColor}, 0 0 20px ${variant.glowColor}`
                : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Color Swatch Badge Circle */}
              <span
                className="h-6 w-6 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: variant.colorHex }}
              />

              <div className="flex flex-col">
                <span className="text-xs font-black tracking-wide">
                  {variant.name}
                </span>
                <span className="text-[10px] font-medium opacity-80">
                  {variant.subtitle}
                </span>
              </div>
            </div>

            {/* Active Indicator Badge */}
            {isSelected && (
              <span className="rounded-full border border-white bg-white/30 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] font-black uppercase text-white shadow-sm">
                SELECTED
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
