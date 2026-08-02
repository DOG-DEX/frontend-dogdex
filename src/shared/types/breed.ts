export type BreedStats = {
  friendliness?: number; // 1 - 5
  energy?: number;       // 1 - 5
  intelligence?: number; // 1 - 5
};

export type Breed = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  pokedexNumber?: number;
  number?: string;
  group?: string;
  origin?: string;
  rarityLevel?: number;
  lifeSpan?: string;
  weight?: string;
  height?: string;
  temperament?: string[];
  stats?: BreedStats;
  isCollected?: boolean;
  isLegendary?: boolean;
  discoveredAt?: string;
};

export type BreedCollectionEntry = {
  breedId: string;
  discoveredAt: string;
  scanCount: number;
};

