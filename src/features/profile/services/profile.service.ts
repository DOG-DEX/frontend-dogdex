import { apiFetch } from '@/lib/api';
import type { UserProfile } from '@/shared/types/auth';

export type UpdateProfilePayload = {
  username?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  phoneNumber?: string;
  avatarPath?: string;
};

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/user/profile', {}, true);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const updated = await apiFetch<UserProfile>(
      '/api/user/profile',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      true,
    );

    // Sync updated user data to localStorage & trigger global auth update event
    if (typeof window !== 'undefined' && updated) {
      try {
        const stored = localStorage.getItem('user');
        const currentUser = stored ? JSON.parse(stored) : {};
        const mergedUser = {
          ...currentUser,
          ...updated,
          id: updated.id || currentUser.id,
          username: updated.username || currentUser.username,
          email: updated.email || currentUser.email,
        };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        window.dispatchEvent(new Event('auth-change'));
      } catch {
        // Ignore JSON parse errors
      }
    }

    return updated;
  },
};
