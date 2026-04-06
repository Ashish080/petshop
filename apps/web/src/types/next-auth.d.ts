import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin' | 'rider';
      image?: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: 'user' | 'admin' | 'rider';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'user' | 'admin' | 'rider';
  }
}
