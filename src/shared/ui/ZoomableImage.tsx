"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { VariantSelector } from "@/features/home/components/VariantSelector";
import {
  PRODUCT_VARIANTS,
  ProductVariant,
} from "@/features/home/constants/variants";

interface ZoomableImageProps {
  src?: string;
  alt?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * ZoomableImage Component
 * High-performance reusable image component with custom Apple Glassmorphism modal
 * and integrated True-Color Glassmorphism VariantSelector INSIDE the modal.
 * Features 4-stop step-by-step click zoom and zero-flicker live variant switching.
 */
export function ZoomableImage({
  alt = "Dog Dex Smart QR Tag Showcase",
  fill = true,
  priority = false,
  className = "object-cover object-center",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    PRODUCT_VARIANTS[0],
  );

  return (
    <>
      {/* Clickable Image Container */}
      <div
        onClick={() => setIsOpen(true)}
        className="group/zoom relative h-full w-full cursor-zoom-in overflow-hidden"
        title="Click to inspect photo in high resolution"
      >
        <Image
          src={selectedVariant.tagImage}
          alt={`${alt} - ${selectedVariant.name}`}
          fill={fill}
          priority={priority}
          className={`${className} transition-transform duration-300 group-hover/zoom:scale-105`}
          sizes={sizes}
        />

        {/* Hover Inspect Indicator Badge */}
        <div className="absolute bottom-3 right-3 z-10 rounded-full border-2 border-[#1A1C1B] bg-white/95 px-3 py-1 font-mono text-[10px] font-black uppercase text-[#1A1C1B] opacity-0 shadow-[2px_2px_0px_#1A1C1B] backdrop-blur-sm transition-opacity duration-200 group-hover/zoom:opacity-100">
          CLICK TO ZOOM
        </div>
      </div>

      {/* Apple Glassmorphism Lightbox Modal with True-Color VariantSelector */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[
            {
              src: selectedVariant.tagImage,
              alt: `${alt} - ${selectedVariant.name}`,
            },
          ]}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3.5,
            zoomInMultiplier: 1.4,
            doubleClickMaxStops: 4,
            doubleClickDelay: 300,
            doubleTapDelay: 300,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: true,
          }}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
            slideFooter: () => (
              <div
                className="absolute bottom-6 right-6 z-[99999] max-w-xs pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <VariantSelector
                  selectedVariant={selectedVariant}
                  onSelectVariant={(variant) => setSelectedVariant(variant)}
                />
              </div>
            ),
          }}
        />
      )}
    </>
  );
}
