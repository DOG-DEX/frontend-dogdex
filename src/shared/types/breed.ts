export type Breed = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  pokedexNumber?: number;
  origin?: string;
  group?: string;
  rarityLevel?: number;
};

export type BreedCollectionEntry = {
  breedId: string;
  discoveredAt: string;
  scanCount: number;
};

