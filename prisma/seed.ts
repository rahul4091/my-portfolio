import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const projects = [
    {
      slug: "portfolio-website",
      githubUrl: "https://github.com/rahul4091/my-portfolio",
    },
    {
      slug: "library-management-system",
      githubUrl: "https://github.com/rahul4091/library-management-system-",
    },
    {
      slug: "todo-app",
      githubUrl: "https://github.com/rahul4091/my-portfolio",
    },
    {
      slug: "blog-platform",
      githubUrl: "https://github.com/rahul4091/my-portfolio",
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { githubUrl: p.githubUrl },
      create: { slug: p.slug, githubUrl: p.githubUrl },
    });
    console.log(`✅ Seeded: ${p.slug} → ${p.githubUrl}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
