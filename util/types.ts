export type User = {
  id: number;
  username: string;
  email: string;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
};
