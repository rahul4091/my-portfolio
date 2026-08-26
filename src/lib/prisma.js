import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — the Prisma client cannot connect to PostgreSQL."
    );
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

let client = globalForPrisma.prisma ?? null;

function getPrismaClient() {
  if (!client) {
    client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
  }
  return client;
}

// The client is created on first use so a missing DATABASE_URL surfaces as a
// query-time error instead of crashing at import time (which breaks builds).
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getPrismaClient();
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  }
);
