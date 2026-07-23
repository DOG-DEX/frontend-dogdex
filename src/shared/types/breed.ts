export type Breed = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export type BreedCollectionEntry = {
  breedId: string;
  discoveredAt: string;
  scanCount: number;
};
