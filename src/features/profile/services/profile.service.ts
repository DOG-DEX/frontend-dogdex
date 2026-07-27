import { apiFetch } from '@/lib/api';
import type { UserProfile } from "@/shared/types/auth";

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/user/profile', {}, true);
  },
};
