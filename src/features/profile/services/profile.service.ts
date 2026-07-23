import { env } from "@/lib/env";
import type { UserProfile } from "@/shared/types/auth";

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${env.apiBaseUrl}/profile`);
    return response.json();
  },
};
