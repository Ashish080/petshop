import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './lib/auth.config';
import connectDB from './lib/mongoose';
import User from './models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn('[AUTH] Missing required fields');
          return null;
        }

        try {
          await connectDB();
          const email = (credentials.email as string).toLowerCase().trim();
          const user = await User.findOne({ email }).select('+password');

          if (!user) {
            console.warn(`[AUTH] Failure: User not found for email: ${email}`);
            return null;
          }

          if (!user.password) {
            console.error(`[AUTH] Critical: Password hash missing in database for user: ${email}`);
            return null;
          }

          const isCorrectPassword = await user.comparePassword(credentials.password as string);
          if (!isCorrectPassword) {
            console.warn(`[AUTH] Failure: Password mismatch for user: ${email}`);
            return null;
          }

          console.log(`[AUTH] Success: Verified user: ${email} (${user.role})`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Critical exception in authorize function:', error);
          return null;
        }
      },
    }),
  ],
});
