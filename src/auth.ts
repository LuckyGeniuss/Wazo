import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    // ─── Google OAuth ────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // ─── Email + Password ────────────────────────────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = (credentials.email as string).toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (user.isBanned) {
          throw new Error("Account is banned");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = (token.impersonatedRole || token.role) as Role;
        session.user.originalRole = token.role as Role;
        session.user.isBanned = token.isBanned as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        // Отримуємо роль з БД для Google користувачів (вони можуть не мати role в user object)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, isBanned: true },
        });
        token.role = dbUser?.role ?? user.role ?? ("USER" as Role);
        token.isBanned = dbUser?.isBanned ?? user.isBanned ?? false;
        token.lastChecked = Date.now();
      } else if (
        Date.now() - ((token.lastChecked as number) ?? 0) >
        5 * 60 * 1000
      ) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { isBanned: true, role: true },
        });
        token.isBanned = freshUser?.isBanned ?? false;
        token.role = freshUser?.role ?? token.role;
        token.lastChecked = Date.now();
      }

      if (trigger === "update" && session?.impersonatedRole) {
        token.impersonatedRole = session.impersonatedRole;
      } else if (trigger === "update" && session?.clearImpersonation) {
        delete token.impersonatedRole;
      }

      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  events: {
    // При першому вході через Google — встановлюємо роль USER
    async createUser({ user }) {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "USER" },
        });
      }
    },
    // При першому вході через Google — отримуємо роль з БД після створення
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        // Перевіряємо чи користувач вже має роль, якщо ні — встановлюємо USER
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        if (!dbUser?.role) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "USER" },
          });
        }
      }
    },
  },
});
