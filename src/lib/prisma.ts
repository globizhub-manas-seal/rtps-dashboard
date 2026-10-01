import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use a Proxy to lazily instantiate the Prisma client ONLY when it is first queried.
// This completely avoids Next.js build-time instantiation crashes in Vercel.
export const prisma = globalForPrisma.prisma || new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
