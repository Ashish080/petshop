export type UserRole = 'ADMIN' | 'RIDER' | 'USER';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  image?: string;
  createdAt: Date;
}

export interface AuthSession {
  user: User;
  expires: string;
}
