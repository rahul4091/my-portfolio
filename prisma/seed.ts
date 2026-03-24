
import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const slugs = [
    "portfolio-website",
    "library-management-system",
    "todo-app",
    "blog-platform",
  ];

  for (const slug of slugs) {
    await prisma.project.upsert({
      where: { slug },
      update: {},
      create: { slug },
    });
    console.log(`✅ Seeded: ${slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
