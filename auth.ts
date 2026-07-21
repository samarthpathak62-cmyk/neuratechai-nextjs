import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isConfiguredAdmin } from "@/lib/admin-config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT sessions — required for the Credentials provider to work alongside
  // Google/GitHub OAuth with the same adapter. OAuth accounts are still
  // persisted to the database via the adapter; only the session token
  // itself is a signed JWT rather than a DB-backed session row.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null; // OAuth-only account — no password to check

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      const email = (token.email as string | undefined) ?? undefined;

      if (isConfiguredAdmin(email) && token.role !== "ADMIN" && token.id) {
        // Email is on the ADMIN_EMAILS allowlist (see lib/admin-config.ts) —
        // promote them in the database the moment we notice, then cache it.
        await prisma.user
          .update({ where: { id: token.id as string }, data: { role: "ADMIN" } })
          .catch(() => {});
        token.role = "ADMIN";
      } else if (token.id && !token.role) {
        // Normal case: role wasn't in the token yet (e.g. OAuth sign-in) —
        // look it up once and cache it.
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        token.role = dbUser?.role ?? "USER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
});
