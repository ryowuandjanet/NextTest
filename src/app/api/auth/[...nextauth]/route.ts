import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (!credentials?.email || !credentials?.password) {
            throw new Error('請提供電子郵件和密碼');
          }

          const user = await User.findOne({ email: credentials.email });
          console.log('找到的用戶:', user);

          if (!user) {
            throw new Error('找不到用戶');
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordMatch) {
            throw new Error('密碼錯誤');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('認證錯誤:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user) {
        console.log('登入回調 - 用戶:', user);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session回調 - Token:', token);
      if (session.user) {
        session.user.id = token.sub;
        console.log('設置後的 session:', {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
          },
        });
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
