'use client';

import { useEffect, useMemo, useState } from 'react';
import { dogsService } from '../services/dogs.service';
import { BreedDetailPanel } from '../components/BreedDetailPanel';
import { BreedFilterBar, FilterStatus, SortOption } from '../components/BreedFilterBar';
import { BreedGridCard } from '../components/BreedGridCard';
import type { Breed } from '@/shared/types/breed';

// Enhanced defaults mapping for rich visual metadata
const BREED_METADATA_PRESETS: Record<
  string,
  Partial<Breed>
> = {
  'golden-retriever': {
    number: '066',
    group: 'SPORTING DOG GROUP',
    origin: 'SCOTLAND',
    lifeSpan: '10-12 YRS',
    weight: '25-34 KG',
    height: '51-61 CM',
    temperament: ['FRIENDLY', 'INTELLIGENT', 'FAMILY'],
    stats: { friendliness: 5, energy: 4, intelligence: 5 },
    isLegendary: true,
  },
  pug: {
    number: '067',
    group: 'TOY DOG GROUP',
    origin: 'CHINA',
    lifeSpan: '12-15 YRS',
    weight: '6-8 KG',
    height: '25-30 CM',
    temperament: ['PLAYFUL', 'CHARMING', 'LOVING'],
    stats: { friendliness: 5, energy: 3, intelligence: 3 },
  },
  'welsh-corgi': {
    number: '069',
    group: 'HERDING DOG GROUP',
    origin: 'WALES',
    lifeSpan: '12-15 YRS',
    weight: '10-14 KG',
    height: '25-30 CM',
    temperament: ['ALERT', 'AFFECTIONATE', 'BOLD'],
    stats: { friendliness: 4, energy: 5, intelligence: 5 },
  },
  'shiba-inu': {
    number: '070',
    group: 'NON-SPORTING GROUP',
    origin: 'JAPAN',
    lifeSpan: '12-16 YRS',
    weight: '8-11 KG',
    height: '35-43 CM',
    temperament: ['ALERT', 'INDEPENDENT', 'CONFIDENT'],
    stats: { friendliness: 3, energy: 4, intelligence: 4 },
  },
};

const ITEMS_PER_PAGE = 8;

export function DexView() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('NUMBER');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileTab, setMobileTab] = useState<'grid' | 'detail'>('grid');

  // Load breeds and collection status
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Run listBreeds and listMyDogs concurrently
        const [breedsResult, myDogsResult] = await Promise.allSettled([
          dogsService.listBreeds(),
          dogsService.listMyDogs(),
        ]);

        const fetchedBreeds = breedsResult.status === 'fulfilled' ? breedsResult.value : [];
        const myDogs = myDogsResult.status === 'fulfilled' ? myDogsResult.value : [];

        // Check if user has local collection storage
        let initialCollected = new Set<string>();
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('dogdex_collected_ids');
          if (stored) {
            try {
              initialCollected = new Set(JSON.parse(stored));
            } catch {
              // ignore JSON parse error
            }
          }
        }

        // Auto-mark collected breeds from myDogs
        myDogs.forEach((dog) => {
          const match = fetchedBreeds.find(
            (b) => b.name.toLowerCase() === dog.breed.toLowerCase() || b.id === dog.breed,
          );
          if (match) initialCollected.add(match.id);
        });

        // Default collection sample if empty for rich showcase
        if (initialCollected.size === 0 && fetchedBreeds.length > 0) {
          initialCollected.add(fetchedBreeds[0].id);
          if (fetchedBreeds.length > 1) initialCollected.add(fetchedBreeds[1].id);
        }

        // Enhance breed list with preset metadata
        const enhancedBreeds: Breed[] = fetchedBreeds.map((breed, index) => {
          const preset = BREED_METADATA_PRESETS[breed.slug.toLowerCase()] || {};
          const numStr = (index + 1).toString().padStart(3, '0');
          return {
            ...breed,
            number: preset.number || numStr,
            group: preset.group || 'CANINE SPECIES GROUP',
            origin: preset.origin || 'GLOBAL',
            lifeSpan: preset.lifeSpan || '10-14 YRS',
            weight: preset.weight || '12-28 KG',
            height: preset.height || '35-55 CM',
            temperament: preset.temperament || ['FRIENDLY', 'ACTIVE', 'SMART'],
            stats: preset.stats || {
              friendliness: 4,
              energy: 4,
              intelligence: 4,
            },
            isLegendary: preset.isLegendary || index % 5 === 4,
          };
        });

        if (isActive) {
          setBreeds(enhancedBreeds);
          setCollectedIds(initialCollected);
          if (enhancedBreeds.length > 0) {
            setSelectedBreed(enhancedBreeds[0]);
          }
          if (breedsResult.status === 'rejected') {
            setError(
              breedsResult.reason instanceof Error
                ? breedsResult.reason.message
                : 'Unable to load the breed dex.',
            );
          }
        }
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

    void loadData();

    return () => {
      isActive = false;
    };
  }, []);

  // Toggle collection handler
  const handleToggleCollect = (breedId: string) => {
    setCollectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(breedId)) {
        next.delete(breedId);
      } else {
        next.add(breedId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('dogdex_collected_ids', JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  // Filtered & Sorted breeds
  const filteredBreeds = useMemo(() => {
    return breeds
      .filter((breed) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        if (query) {
          const matchesName = breed.name.toLowerCase().includes(query);
          const matchesSlug = breed.slug.toLowerCase().includes(query);
          const matchesGroup = breed.group?.toLowerCase().includes(query);
          if (!matchesName && !matchesSlug && !matchesGroup) return false;
        }

        // Status filter
        const isCollected = collectedIds.has(breed.id);
        if (statusFilter === 'COLLECTED' && !isCollected) return false;
        if (statusFilter === 'MISSING' && isCollected) return false;
        if (statusFilter === 'LEGENDARY' && !breed.isLegendary) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME') return a.name.localeCompare(b.name);
        if (sortBy === 'GROUP') return (a.group || '').localeCompare(b.group || '');
        // Default NUMBER sort
        return (a.number || '').localeCompare(b.number || '');
      });
  }, [breeds, searchQuery, statusFilter, sortBy, collectedIds]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBreeds.length / ITEMS_PER_PAGE));
  const currentBreeds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBreeds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBreeds, currentPage]);

  const handleSelectBreed = (breed: Breed) => {
    setSelectedBreed(breed);
    setMobileTab('detail');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Hero Field Guide Banner */}
      <header className="relative overflow-hidden rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-[#232B26] bg-[#232B26] px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#232B26]">
              <span>🐾</span> DOGDEX FIELD GUIDE
            </div>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-[#232B26] md:text-5xl">
              Breed Collection
            </h1>
            <p className="mt-2 max-w-xl font-medium text-[#232B26]/80">
              Discover and collect canine species. Track your collection progress, view stats, and inspect detailed field guides.
            </p>
          </div>

          {/* Collection Progress Counter Badge */}
          <div className="flex items-center gap-3 rounded-xl border-4 border-[#232B26] bg-white p-3.5 shadow-[4px_4px_0px_#232B26]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-lg font-black text-[#232B26]">
              🏆
            </div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase text-[#4B5750]">
                DISCOVERED PROGRESS
              </p>
              <p className="font-mono text-lg font-black text-[#232B26]">
                {collectedIds.size} / {breeds.length} BREEDS
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="mt-6 flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('grid')}
          className={`flex-1 rounded-xl border-4 border-[#232B26] py-2.5 font-mono text-xs font-black uppercase shadow-[4px_4px_0px_#232B26] ${
            mobileTab === 'grid' ? 'bg-[#FF6B00] text-white' : 'bg-white text-[#232B26]'
          }`}
        >
          COLLECTION BROWSER ({filteredBreeds.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('detail')}
          className={`flex-1 rounded-xl border-4 border-[#232B26] py-2.5 font-mono text-xs font-black uppercase shadow-[4px_4px_0px_#232B26] ${
            mobileTab === 'detail' ? 'bg-[#FF6B00] text-white' : 'bg-white text-[#232B26]'
          }`}
        >
          DOG DETAILS
        </button>
      </div>

      {/* Main Split Workstation */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Panel: Selected Dog Info (5 cols / 40%) */}
        <div className={`lg:col-span-5 ${mobileTab === 'detail' ? 'block' : 'hidden lg:block'}`}>
          <BreedDetailPanel
            breed={selectedBreed}
            isCollected={selectedBreed ? collectedIds.has(selectedBreed.id) : false}
            onToggleCollect={handleToggleCollect}
          />
        </div>

        {/* Right Panel: Collection Browser & Grid (7 cols / 60%) */}
        <div className={`flex flex-col gap-6 lg:col-span-7 ${mobileTab === 'grid' ? 'block' : 'hidden lg:block'}`}>
          {/* Top Filter & Search Bar */}
          <BreedFilterBar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(s) => {
              setStatusFilter(s);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalCount={breeds.length}
          />

          {/* Grid Content */}
          <div className="min-h-[420px] flex-1">
            {isLoading && (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border-4 border-[#232B26] bg-white p-6 text-center shadow-[6px_6px_0px_#232B26]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#232B26] border-t-[#FF6B00]" />
                <p className="mt-4 font-mono text-sm font-black text-[#232B26]">
                  LOADING BREED COLLECTION...
                </p>
              </div>
            )}

            {error && (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] p-6 text-center shadow-[6px_6px_0px_#232B26]">
                <p className="text-xl font-black text-[#232B26]">Dex Unavailable</p>
                <p className="mt-2 text-sm font-medium text-[#4B5750]">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn-brutal mt-4 bg-white px-4 py-2 font-mono text-xs text-[#232B26]"
                >
                  RETRY CONNECTION
                </button>
              </div>
            )}

            {!isLoading && !error && currentBreeds.length === 0 && (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border-4 border-[#232B26] bg-white p-6 text-center shadow-[6px_6px_0px_#232B26]">
                <span className="text-4xl">🔍</span>
                <p className="mt-3 font-mono text-lg font-black text-[#232B26]">
                  NO MATCHING BREEDS FOUND
                </p>
                <p className="mt-1 text-sm font-medium text-[#4B5750]">
                  Try clearing your search query or changing status filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="btn-brutal mt-4 bg-[#85E0C0] px-4 py-2 font-mono text-xs text-[#232B26]"
                >
                  RESET FILTERS
                </button>
              </div>
            )}

            {!isLoading && !error && currentBreeds.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {currentBreeds.map((breed) => (
                  <BreedGridCard
                    key={breed.id}
                    breed={breed}
                    isSelected={selectedBreed?.id === breed.id}
                    isCollected={collectedIds.has(breed.id)}
                    onSelect={handleSelectBreed}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Browser Footer / Pagination Controls */}
          {!isLoading && !error && filteredBreeds.length > 0 && (
            <div className="flex items-center justify-between rounded-2xl border-4 border-[#232B26] bg-[#E7F0E8] p-4 shadow-[6px_6px_0px_#232B26]">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn-brutal h-10 w-24 rounded-full bg-[#D4DCD4] font-mono text-xs text-[#232B26] disabled:opacity-40"
              >
                ◀ PREV
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-3 w-3 rounded-full border-2 border-[#232B26] transition-all ${
                        isActive ? 'bg-[#FF6B00] scale-125' : 'bg-white'
                      }`}
                      title={`Page ${pageNum}`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="btn-brutal h-10 w-24 rounded-full bg-[#D4DCD4] font-mono text-xs text-[#232B26] disabled:opacity-40"
              >
                NEXT ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
