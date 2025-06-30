import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Session, User } from "next-auth";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Otros providers aquí
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }): Promise<Session> {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Puedes agregar secret, etc.
};
