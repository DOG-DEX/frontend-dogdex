import { env } from "@/lib/env";
import type { Breed } from "@/shared/types/breed";

export const dogsService = {
  async listBreeds(): Promise<Breed[]> {
    const response = await fetch(`${env.apiBaseUrl}/breeds`);
    return response.json();
  },
};
