import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Verify against hardcoded leader credentials
        if (email === 'admin@example.com' && password === 'password123') {
          return {
            id: 'admin-1',
            name: 'Ward Leader',
            email: 'admin@example.com',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isMeetingsNew = nextUrl.pathname === '/meetings/new';
      const isMeetingsEdit = nextUrl.pathname.startsWith('/meetings/') && nextUrl.pathname.endsWith('/edit');

      if (isMeetingsNew || isMeetingsEdit) {
        return isLoggedIn; // Return false to trigger redirect to /login
      }

      return true;
    },
  },
  // Fallback secrets for local development
  secret: process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'dev_secret_wdd430_sacrament_meetings',
});
