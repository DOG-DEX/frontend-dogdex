export type UserProfile = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarPath?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
};

export type AuthSession = {
  user: UserProfile;
  accessToken: string;
};
