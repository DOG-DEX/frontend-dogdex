'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { dogsService } from '../services/dogs.service';
import type { Breed } from '@/shared/types/breed';

export function DexView() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadBreeds = async () => {
      try {
        const result = await dogsService.listBreeds();
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="card-brutal bg-[#85E0C0] p-6 md:p-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#232B26]">
          DogDex field guide
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#232B26] md:text-5xl">
          Breed Dex
        </h1>
        <p className="mt-3 max-w-2xl font-semibold text-[#4B5750]">
          Browse dog breeds from the DogDex knowledge base. Your collection and
          scan history will connect here next.
        </p>
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

        {!isLoading && !error && breeds.length === 0 && (
          <DexMessage
            title="No breeds are available yet"
            detail="Add Dog Wiki data in the backend, then refresh this page."
            tone="bg-white"
          />
        )}

        {!isLoading && !error && breeds.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {breeds.map((breed) => (
              <article
                key={breed.id}
                className="card-brutal overflow-hidden bg-white p-5"
              >
                <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] text-5xl">
                  {breed.imageUrl ? (
                    <Image
                      src={breed.imageUrl}
                      alt={breed.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    '🐾'
                  )}
                </div>
                <p className="mt-4 font-mono text-[11px] font-black uppercase tracking-wider text-[#FF6B00]">
                  #{breed.slug}
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#232B26]">
                  {breed.name}
                </h2>
                {breed.description && (
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-[#4B5750]">
                    {breed.description}
                  </p>
                )}
              </article>
            ))}
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
