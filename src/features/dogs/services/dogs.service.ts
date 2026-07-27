import { apiFetch } from '@/lib/api';
import { env } from '@/lib/env';
import type { Breed } from '@/shared/types/breed';

type BreedListItem = {
  _id: string;
  breed: string;
  slug: string;
  description?: string;
  mediaPath?: string;
};

function mediaUrl(mediaPath?: string) {
  if (!mediaPath) return undefined;
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalizedPath = mediaPath.startsWith('/')
    ? mediaPath
    : mediaPath.startsWith('uploads/')
      ? `/public/${mediaPath}`
      : `/public/uploads/${mediaPath}`;
  return `${env.apiBaseUrl}${normalizedPath}`;
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
  async listBreeds(): Promise<Breed[]> {
    const result = await apiFetch<{ data: BreedListItem[] }>(
      '/api/wiki/dogs',
    );
    return result.data.map((breed) => ({
      id: breed._id,
      name: breed.breed,
      slug: breed.slug,
      description: breed.description,
      imageUrl: mediaUrl(breed.mediaPath),
    }));
  },

  async createDog(payload: CreateDogPayload): Promise<BackendDogDoc> {
    const result = await apiFetch<{ data: BackendDogDoc }>('/api/dog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return result.data;
  },

  async listMyDogs(): Promise<BackendDogDoc[]> {
    const result = await apiFetch<{ data: BackendDogDoc[] }>('/api/dog/my-dogs');
    return result.data || [];
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
};
