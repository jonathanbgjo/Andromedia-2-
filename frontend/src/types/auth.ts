export type AuthResponse = {
  token: string;
  userId: number;
  email: string;
  displayName: string;
};

export type User = {
  id: number;
  email: string;
  displayName: string;
};
