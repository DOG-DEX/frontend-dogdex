import { apiFetch } from '@/lib/api';
import { env } from '@/lib/env';
import { getCloudinaryUrl } from '@/lib/media';
import type { Breed } from '@/shared/types/breed';

type BreedListItem = {
  _id: string;
  breed: string;
  slug: string;
  description?: string;
  mediaPath?: string;
  pokedexNumber?: number;
  origin?: string;
  group?: string;
  rarity_level?: number;
};

export function mediaUrl(mediaPath?: string) {
  return getCloudinaryUrl(mediaPath);
}

export type CreateDogPayload = {
  name: string;
  breed: string;
  birthday?: string;
  gender: 'male' | 'female';
  avatarPath?: string;
  sterilized?: boolean;
  attributes?: {
    color?: string;
    pattern?: string;
    size?: string;
  };
};

export type BackendDogDoc = {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  birthday?: string;
  gender: 'male' | 'female';
  avatarPath?: string;
  sterilized?: boolean;
  attributes?: {
    color?: string;
    pattern?: string;
    size?: string;
  };
  createdAt?: string;
};

type PredictionResult = {
  data: {
    breed?: string;
    topBreeds?: Array<{ breed: string; confidence: number }>;
  };
};

export const dogsService = {
  async listBreeds(limit = 500, lang = 'en'): Promise<Breed[]> {
    const result = await apiFetch<{ data: BreedListItem[]; pagination?: { total: number; totalPages: number } }>(
      `/api/wiki/dogs?limit=${limit}&lang=${lang}`,
    );
    return result.data.map((breed) => ({
      id: breed._id,
      name: breed.breed,
      slug: breed.slug,
      description: breed.description,
      imageUrl: mediaUrl(breed.mediaPath),
      pokedexNumber: breed.pokedexNumber,
      origin: breed.origin,
      group: breed.group,
      rarityLevel: breed.rarity_level,
    }));
  },

  async createDog(payload: CreateDogPayload): Promise<BackendDogDoc> {
    const result = await apiFetch<any>('/api/dog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, true);
    return result?.data ?? result;
  },

  async listMyDogs(): Promise<BackendDogDoc[]> {
    const result = await apiFetch<any>('/api/dog/my-dogs', {}, true);
    if (Array.isArray(result)) return result;
    return result?.data || [];
  },

  async predictBreed(file: File): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    const result = await apiFetch<PredictionResult>('/api/predictions/predict', {
      method: 'POST',
      body: formData,
    });

    return result.data?.breed || result.data?.topBreeds?.[0]?.breed;
  },

  async deleteDog(id: string): Promise<void> {
    await apiFetch(`/api/dog/${id}`, {
      method: 'DELETE',
    }, true);
  },

  async uploadImage(file: File, folder = 'uploads/dog'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    formData.append('folder', folder);

    const result = await apiFetch<any>('/api/medias/upload', {
      method: 'POST',
      body: formData,
    }, true);

    return result?.media?.mediaPath || result?.mediaPath || result?.data?.mediaPath || '';
  },

  async updateDog(id: string, payload: Partial<CreateDogPayload>): Promise<BackendDogDoc> {
    const result = await apiFetch<any>(`/api/dog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, true);
    return result?.data ?? result;
  },

  mediaUrl(mediaPath?: string): string | undefined {
    return mediaUrl(mediaPath);
  },
};
