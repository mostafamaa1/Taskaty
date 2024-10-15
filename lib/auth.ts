import { connectDB } from './db';
import { UserModel } from '@/lib/models/User';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';// Update with your server address

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email Address' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        const userFound = await UserModel.findOne({
          email: credentials?.email,
        }).select('+password');

        if (!userFound) throw new Error('Invalid Email');

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password,
        );

        if (!passwordMatch) throw new Error('Invalid Password');
        // Emit user:login event after successful login
        return userFound;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  logger: {
    error: (error) => console.error(error), // Use console.error for server-side logging
    log: (message: any) => console.log(message), // Use console.log for server-side logging
    // other logger methods
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If user is present, add additional user info to the token
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the JWT token to the session for use in the frontend
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET, // Use environment variable for secret
};
