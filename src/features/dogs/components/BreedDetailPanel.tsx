"use client";

import Image from "next/image";
import { useState } from "react";
import type { Breed } from "@/shared/types/breed";
import { StatBar } from "@/shared/ui/StatBar";

interface BreedDetailPanelProps {
  breed: Breed | null;
  onToggleCollect?: (breedId: string) => void;
  isCollected?: boolean;
}

export function BreedDetailPanel({
  breed,
  onToggleCollect,
  isCollected = false,
}: BreedDetailPanelProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!breed) {
    return (
      <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center rounded-2xl border-4 border-[#232B26] bg-white p-8 text-center shadow-[8px_8px_0px_#232B26]">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] text-4xl shadow-[4px_4px_0px_#232B26]">
          🐶
        </div>
        <h3 className="mt-4 font-mono text-xl font-black text-[#232B26]">
          SELECT A BREED
        </h3>
        <p className="mt-2 max-w-xs text-sm font-medium text-[#4B5750]">
          Click any dog entry in the collection browser to view full field specs, stats, and origins.
        </p>
      </div>
    );
  }

  const numberStr = breed.number || (breed.slug ? `NO.${breed.slug.slice(0, 4).toUpperCase()}` : "NO.001");
  const groupStr = breed.group || "CANINE SPECIES GROUP";
  const temperamentTags = breed.temperament && breed.temperament.length > 0
    ? breed.temperament
    : ["FRIENDLY", "INTELLIGENT", "FAMILY"];

  const stats = {
    friendliness: breed.stats?.friendliness ?? 4,
    energy: breed.stats?.energy ?? 4,
    intelligence: breed.stats?.intelligence ?? 5,
  };

  const origin = breed.origin || "GLOBAL";
  const lifeSpan = breed.lifeSpan || "10 - 14 YRS";
  const weight = breed.weight || "15 - 30 KG";
  const height = breed.height || "40 - 60 CM";

  return (
    <article className="flex w-full flex-col gap-6 rounded-2xl border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] lg:p-8">
      {/* Top Header Badge Row */}
      <div className="flex items-center justify-between">
        <div className="inline-flex -rotate-1 items-center rounded-lg border-2 border-[#232B26] bg-[#232B26] px-4 py-1 font-mono text-sm font-black tracking-widest text-white shadow-[2px_2px_0px_#232B26]">
          {numberStr}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#85E0C0] font-mono text-lg font-black text-[#232B26] shadow-[2px_2px_0px_#232B26]"
          title="DogDex Verified Guide"
        >
          ?
        </div>
      </div>

      {/* Main Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] shadow-[6px_6px_0px_#232B26]">
        {breed.imageUrl ? (
          <Image
            src={breed.imageUrl}
            alt={breed.name}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-7xl select-none">
            🐾
          </div>
        )}
        {isCollected && (
          <span className="absolute top-3 left-3 rounded-full border-2 border-[#232B26] bg-[#85E0C0] px-3 py-1 font-mono text-xs font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
            ✓ COLLECTED
          </span>
        )}
      </div>

      {/* Title & Group */}
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#FF6B00] md:text-3xl">
          {breed.name}
        </h2>
        <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-[#4B5750]">
          {groupStr}
        </p>
      </div>

      {/* Temperament Tags */}
      <div className="flex flex-wrap gap-2">
        {temperamentTags.map((tag, idx) => {
          const colors = [
            "bg-[#85E0C0] text-[#00392B]",
            "bg-[#4DA98C] text-[#00392B]",
            "bg-[#FFD6A5] text-[#351000]",
          ];
          const colorClass = colors[idx % colors.length];
          return (
            <span
              key={idx}
              className={`rounded-lg border-2 border-[#232B26] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_#232B26] ${colorClass}`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* Stat Bars Section */}
      <div className="flex flex-col gap-3 rounded-xl border-4 border-[#232B26] bg-[#FAF9F7] p-4 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
        <StatBar
          label="FRIENDLINESS"
          value={stats.friendliness}
          activeColor="#F87171"
          icon={
            <svg width="14" height="13" viewBox="0 0 12 11" fill="#EF4444">
              <path d="M5.83 10.7L4.98 9.94C4 9.06 3.19 8.3 2.55 7.65C1.91 7.01 1.4 6.44 1.02 5.93C0.64 5.42 0.38 4.95 0.23 4.52C0.08 4.09 0 3.65 0 3.21C0 2.3 0.31 1.53 0.92 0.92C1.53 0.31 2.29 0 3.21 0C3.71 0 4.2 0.11 4.65 0.32C5.11 0.53 5.5 0.84 5.83 1.23C6.16 0.84 6.56 0.53 7.01 0.32C7.47 0.11 7.95 0 8.46 0C9.37 0 10.13 0.31 10.75 0.92C11.36 1.53 11.67 2.3 11.67 3.21C11.67 3.65 11.59 4.09 11.44 4.52C11.29 4.95 11.02 5.42 10.65 5.93C10.27 6.44 9.76 7.01 9.11 7.65C8.47 8.3 7.66 9.06 6.68 9.94L5.83 10.7Z" />
            </svg>
          }
        />
        <StatBar
          label="ENERGY"
          value={stats.energy}
          activeColor="#FACC15"
          icon={
            <svg width="12" height="13" viewBox="0 0 10 12" fill="#EAB308">
              <path d="M2.33 11.67L2.92 7.58H0L5.25 0H6.42L5.83 4.67H9.33L3.5 11.67H2.33Z" />
            </svg>
          }
        />
        <StatBar
          label="INTELLECT"
          value={stats.intelligence}
          activeColor="#60A5FA"
          icon={
            <svg width="14" height="13" viewBox="0 0 12 12" fill="#3B82F6">
              <path d="M4.67 7.58H5.83L5.92 6.85C6 6.83 6.07 6.79 6.13 6.75C6.2 6.71 6.25 6.67 6.3 6.62L6.97 6.91L7.55 5.92L6.97 5.48C6.99 5.4 7 5.33 7 5.25C7 5.17 6.99 5.09 6.97 5.02L7.55 4.58L6.97 3.59L6.3 3.88C6.25 3.83 6.2 3.79 6.13 3.75C6.07 3.71 6 3.68 5.92 3.65L5.83 2.92H4.67L4.58 3.65C4.5 3.68 4.43 3.71 4.37 3.75C4.3 3.79 4.25 3.83 4.2 3.88L3.53 3.59L2.95 4.58L3.53 5.02C3.51 5.09 3.5 5.17 3.5 5.25C3.5 5.33 3.51 5.4 3.53 5.48L2.95 5.92L3.53 6.91L4.2 6.62C4.25 6.67 4.3 6.71 4.37 6.75C4.43 6.79 4.5 6.83 4.58 6.85L4.67 7.58ZM5.25 6.13C5.01 6.13 4.8 6.04 4.63 5.87C4.46 5.7 4.38 5.49 4.38 5.25C4.38 5.01 4.46 4.8 4.63 4.63C4.8 4.46 5.01 4.38 5.25 4.38C5.49 4.38 5.7 4.46 5.87 4.63C6.04 4.8 6.13 5.01 6.13 5.25C6.13 5.49 6.04 5.7 5.87 5.87C5.7 6.04 5.49 6.13 5.25 6.13Z" />
            </svg>
          }
        />
      </div>

      {/* Details 2x2 Specs Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col rounded-xl border-2 border-[#232B26] bg-[#E2EAE2] p-3 shadow-[2px_2px_0px_#232B26]">
          <span className="font-mono text-[10px] font-extrabold uppercase text-[#5A4136]">
            ORIGIN
          </span>
          <span className="font-mono text-sm font-bold uppercase text-[#232B26] truncate">
            {origin}
          </span>
        </div>
        <div className="flex flex-col rounded-xl border-2 border-[#232B26] bg-[#E2EAE2] p-3 shadow-[2px_2px_0px_#232B26]">
          <span className="font-mono text-[10px] font-extrabold uppercase text-[#5A4136]">
            LIFE SPAN
          </span>
          <span className="font-mono text-sm font-bold uppercase text-[#232B26] truncate">
            {lifeSpan}
          </span>
        </div>
        <div className="flex flex-col rounded-xl border-2 border-[#232B26] bg-[#E2EAE2] p-3 shadow-[2px_2px_0px_#232B26]">
          <span className="font-mono text-[10px] font-extrabold uppercase text-[#5A4136]">
            WEIGHT
          </span>
          <span className="font-mono text-sm font-bold uppercase text-[#232B26] truncate">
            {weight}
          </span>
        </div>
        <div className="flex flex-col rounded-xl border-2 border-[#232B26] bg-[#E2EAE2] p-3 shadow-[2px_2px_0px_#232B26]">
          <span className="font-mono text-[10px] font-extrabold uppercase text-[#5A4136]">
            HEIGHT
          </span>
          <span className="font-mono text-sm font-bold uppercase text-[#232B26] truncate">
            {height}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggleCollect?.(breed.id)}
          className={`flex h-14 flex-1 items-center justify-center rounded-xl border-4 border-[#232B26] font-mono text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_#232B26] transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
            isCollected
              ? "bg-[#00A170] hover:bg-[#00875D]"
              : "bg-[#FF6B00] hover:bg-[#E05E00]"
          }`}
        >
          {isCollected ? "✓ IN COLLECTION" : "COLLECT ENTRY"}
        </button>

        <button
          type="button"
          onClick={() => setIsFavorite((prev) => !prev)}
          className={`flex h-14 w-14 items-center justify-center rounded-xl border-4 border-[#232B26] bg-white text-xl shadow-[4px_4px_0px_#232B26] transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
            isFavorite ? "text-[#EF4444] bg-[#FFE5E5]" : "text-[#232B26]"
          }`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </article>
  );
}
