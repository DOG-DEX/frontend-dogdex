export type UserProfile = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarPath?: string;
  city?: string;
  country?: string;
};

export type AuthSession = {
  user: UserProfile;
  accessToken: string;
};
