'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { dogsService } from '../services/dogs.service';
import type { Breed } from '@/shared/types/breed';

export function DexView() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isActive = true;

    const loadBreeds = async () => {
      try {
        const result = await dogsService.listBreeds(200);
        if (isActive) setBreeds(result);
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load the breed dex.',
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadBreeds();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredBreeds = breeds.filter((breed) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      breed.name.toLowerCase().includes(query) ||
      breed.slug.toLowerCase().includes(query) ||
      (breed.origin && breed.origin.toLowerCase().includes(query)) ||
      (breed.group && breed.group.toLowerCase().includes(query))
    );
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="card-brutal bg-[#85E0C0] p-6 md:p-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#232B26]">
          DogDex field guide
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#232B26] md:text-5xl">
          Breed Dex ({breeds.length})
        </h1>
        <p className="mt-3 max-w-2xl font-semibold text-[#4B5750]">
          Browse dog breeds from the DogDex knowledge base. Explore origins, traits, and details.
        </p>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search breed, origin or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md rounded-xl border-2 border-[#232B26] bg-white px-4 py-3 font-medium text-[#232B26] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF6B00]"
          />
        </div>
      </header>

      <div className="mt-8">
        {isLoading && <DexMessage title="Loading the field guide…" />}

        {error && (
          <DexMessage
            title="The Breed Dex is unavailable"
            detail={error}
            tone="bg-[#FFD6A5]"
          />
        )}

        {!isLoading && !error && filteredBreeds.length === 0 && (
          <DexMessage
            title="No breeds found"
            detail={searchQuery ? `No results matching "${searchQuery}"` : "Add Dog Wiki data in the backend, then refresh this page."}
            tone="bg-white"
          />
        )}

        {!isLoading && !error && filteredBreeds.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBreeds.map((breed, index) => {
              const dexNum = breed.pokedexNumber
                ? `#${String(breed.pokedexNumber).padStart(3, '0')}`
                : `#${String(index + 1).padStart(3, '0')}`;
              const hasImage = breed.imageUrl && !failedImages[breed.id];

              return (
                <article
                  key={breed.id}
                  className="card-brutal overflow-hidden bg-white p-5 transition-transform hover:-translate-y-1"
                >
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl border-2 border-[#232B26] bg-[#F0EDE6]">
                    {hasImage ? (
                      <Image
                        src={breed.imageUrl!}
                        alt={breed.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [breed.id]: true }))
                        }
                      />
                    ) : (
                      <div className="text-center font-mono text-sm font-bold text-[#8A978F]">
                        {breed.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-[#FF6B00]">
                      {dexNum}
                    </span>
                    {breed.group && (
                      <span className="rounded-md border border-[#232B26] bg-[#F0EDE6] px-2 py-0.5 font-mono text-[10px] font-bold text-[#232B26]">
                        {breed.group}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-[#232B26]">
                    {breed.name}
                  </h2>
                  {breed.origin && (
                    <p className="font-mono text-xs font-semibold text-[#6C7770]">
                      Origin: {breed.origin}
                    </p>
                  )}
                  {breed.description && (
                    <p className="mt-2 line-clamp-2 text-sm font-medium text-[#4B5750]">
                      {breed.description}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function DexMessage({
  title,
  detail,
  tone = 'bg-white',
}: {
  title: string;
  detail?: string;
  tone?: string;
}) {
  return (
    <div className={`card-brutal ${tone} p-6 text-center`} role="status">
      <p className="text-xl font-black text-[#232B26]">{title}</p>
      {detail && <p className="mt-2 font-medium text-[#4B5750]">{detail}</p>}
    </div>
  );
}
