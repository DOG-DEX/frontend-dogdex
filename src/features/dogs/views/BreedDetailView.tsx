"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dogsService } from "@/features/dogs/services/dogs.service";
import type { Breed } from "@/shared/types/breed";

type BreedDetailViewProps = {
  slug: string;
};

type UserEncounterPhoto = {
  id: string;
  photoUrl: string;
  nickname?: string;
  location?: string;
  encounteredAt: string;
};

function getDemoBreed(s: string): Breed {
  return {
    id: "b-golden",
    name: s.replace(/-/g, " ").toUpperCase(),
    slug: s,
    description:
      "The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name.",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    pokedexNumber: 1,
    origin: "Scotland",
    group: "Sporting Dog Group",
    rarityLevel: 1,
  };
}

export function BreedDetailView({ slug }: BreedDetailViewProps) {
  const [breed, setBreed] = useState<Breed | null>(null);
  const [userEncounters] = useState<UserEncounterPhoto[]>([
    {
      id: "enc-1",
      photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      nickname: "Mochi's First Scan",
      location: "West Lake Park, Hanoi",
      encounteredAt: "2026-08-10",
    },
    {
      id: "enc-2",
      photoUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      nickname: "Encountered in Neighborhood",
      location: "Hoan Kiem, Hanoi",
      encounteredAt: "2026-08-05",
    },
  ]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    dogsService
      .getBreedBySlug(slug)
      .then((data) => {
        if (!isSubscribed) return;
        const b = data || getDemoBreed(slug);
        setBreed(b);
        setSelectedPhotoUrl(b.imageUrl || null);
      })
      .catch(() => {
        if (!isSubscribed) return;
        const b = getDemoBreed(slug);
        setBreed(b);
        setSelectedPhotoUrl(b.imageUrl || null);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [slug]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-[#85E0C0]/40" />
          <p className="font-mono text-xs text-[#232B26]/60">Loading Dog Breed Wiki: {slug}...</p>
        </div>
      </div>
    );
  }

  if (!breed) return null;

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dex"
          className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-[#232B26] hover:underline mb-6"
        >
          <span>← Back to DogDex Collection</span>
        </Link>

        {/* Main Breed Card */}
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-white p-6 md:p-8 shadow-[12px_12px_0px_#232B26]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Primary Featured Image Display */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-[#232B26] bg-[#FFD6A5] shadow-[6px_6px_0px_#232B26]">
                {selectedPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhotoUrl}
                    alt={breed.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center font-mono text-5xl font-black text-[#232B26]">
                    {breed.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Breed Info & Stats */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-[#D97706]">
                    POKEDEX NO. #{breed.pokedexNumber || "001"}
                  </span>
                  {breed.group && (
                    <span className="rounded-full border border-[#232B26] bg-[#85E0C0] px-3 py-0.5 font-mono text-[10px] font-black text-[#232B26]">
                      {breed.group}
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-[#232B26]">
                  {breed.name}
                </h1>

                <p className="mt-4 text-xs md:text-sm font-medium text-[#232B26]/80 leading-relaxed">
                  {breed.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t-2 border-dashed border-[#232B26]/20 pt-4 font-mono text-xs">
                <div className="rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] p-3">
                  <span className="text-[10px] uppercase text-[#232B26]/50 block">Origin</span>
                  <span className="font-bold text-[#232B26]">{breed.origin || "International"}</span>
                </div>
                <div className="rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] p-3">
                  <span className="text-[10px] uppercase text-[#232B26]/50 block">Rarity Level</span>
                  <span className="font-bold text-[#232B26]">Level {breed.rarityLevel || 1} ★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multimodal Photo Gallery (1 Official Image + User Encounter Gallery) */}
          <div className="mt-10 border-t-4 border-[#232B26] pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-mono text-lg font-black uppercase text-[#232B26]">
                  📸 BỘ SƯU TẬP ẢNH CỦA BẠN (USER ENCOUNTERS)
                </h3>
                <p className="text-xs text-[#232B26]/70">
                  Select thumbnails to view stock vs. real user-collected photos.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Official Stock Photo Badge */}
              <button
                type="button"
                onClick={() => setSelectedPhotoUrl(breed.imageUrl || null)}
                className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#232B26] p-1 transition ${
                  selectedPhotoUrl === breed.imageUrl
                    ? "ring-4 ring-[#85E0C0] -translate-y-1 bg-[#85E0C0]"
                    : "bg-white"
                }`}
              >
                {breed.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={breed.imageUrl} alt="Official Stock" className="h-full w-full rounded-xl object-cover" />
                )}
                <span className="absolute bottom-1 left-1 rounded bg-[#232B26]/80 px-1 font-mono text-[8px] text-white font-bold">
                  Stock
                </span>
              </button>

              {/* User Encounter Photos */}
              {userEncounters.map((enc) => (
                <button
                  key={enc.id}
                  type="button"
                  onClick={() => setSelectedPhotoUrl(enc.photoUrl)}
                  className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#232B26] p-1 transition ${
                    selectedPhotoUrl === enc.photoUrl
                      ? "ring-4 ring-[#D97706] -translate-y-1 bg-[#FFD6A5]"
                      : "bg-white"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={enc.photoUrl} alt={enc.nickname} className="h-full w-full rounded-xl object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-[#D97706]/90 px-1 font-mono text-[8px] text-white font-bold">
                    Captured
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
