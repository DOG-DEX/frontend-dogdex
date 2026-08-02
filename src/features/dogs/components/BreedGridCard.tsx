"use client";

import Image from "next/image";
import type { Breed } from "@/shared/types/breed";

interface BreedGridCardProps {
  breed: Breed;
  isSelected?: boolean;
  isCollected?: boolean;
  onSelect: (breed: Breed) => void;
}

export function BreedGridCard({
  breed,
  isSelected = false,
  isCollected = false,
  onSelect,
}: BreedGridCardProps) {
  const isLegendary = breed.isLegendary || false;
  const isMissing = !isCollected;

  // Background tone mapping
  let bgTone = "bg-[#DCE5DD]";
  if (isCollected) {
    bgTone = isLegendary ? "bg-[#FFDBCC]" : "bg-[#99F4D3]";
  }

  const numberDisplay = breed.number || (breed.slug ? breed.slug.slice(0, 3).toUpperCase() : "000");
  const shortName = breed.name.length > 12 ? `${breed.name.slice(0, 11)}.` : breed.name;

  return (
    <div
      onClick={() => onSelect(breed)}
      className={`group relative flex flex-col items-center justify-between rounded-xl border-4 border-[#232B26] p-2.5 transition-all duration-150 cursor-pointer select-none ${bgTone} ${
        isSelected
          ? "ring-4 ring-[#FF6B00] shadow-[6px_6px_0px_#232B26] -translate-y-1"
          : "shadow-[4px_4px_0px_#232B26] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#232B26]"
      } ${isMissing ? "opacity-75 hover:opacity-100" : ""}`}
    >
      {/* Top Number Badge */}
      <div className="flex w-full justify-between items-center px-1 font-mono text-[10px] font-black text-[#232B26]">
        <span>#{numberDisplay}</span>
        {isCollected && (
          <span className="h-2 w-2 rounded-full border border-[#232B26] bg-[#00A170]" />
        )}
      </div>

      {/* Image Thumbnail Frame */}
      <div className="relative my-2 aspect-square w-full overflow-hidden rounded-lg border-2 border-[#232B26]/30 bg-white/60">
        {breed.imageUrl ? (
          <Image
            src={breed.imageUrl}
            alt={breed.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 33vw, 150px"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              isMissing ? "filter grayscale brightness-90" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🐾
          </div>
        )}

        {/* Locked Overlay for Missing Breed */}
        {isMissing && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#232B26]/30 backdrop-blur-[1px]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#232B26] bg-white font-mono text-xs font-black text-[#232B26]">
              ?
            </div>
          </div>
        )}
      </div>

      {/* Name Footer Tag */}
      <div className="w-full rounded border border-[#232B26]/20 bg-white/80 py-1 text-center font-mono text-[11px] font-black uppercase text-[#232B26] truncate px-1">
        {isMissing ? "???" : shortName}
      </div>
    </div>
  );
}
