export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type AuthSession = {
  user: UserProfile;
  accessToken: string;
};
