import { authOptions } from '@/lib/nextauth';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
