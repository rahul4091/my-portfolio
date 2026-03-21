import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Delete existing projects to avoid duplicates
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        slug: "portfolio-website",
        name: "Portfolio Website",
        desc: "A personal portfolio built with Next.js and Tailwind CSS showcasing my skills and projects.",
        longDesc:
          "A fully responsive personal portfolio built from scratch using Next.js App Router, Tailwind CSS and Framer Motion. Features dark mode, custom cursor, page loader animation, scroll reveal effects and a working contact form powered by Resend.",
        tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Resend"],
        github: "https://github.com/rahul4091/my-portfolio",
        live: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
        gradient: "from-yellow-400 to-orange-400",
        features: [
          "Dark mode toggle with next-themes",
          "Typewriter effect in Hero section",
          "Custom animated cursor",
          "Page loader animation",
          "Working contact form with email delivery",
          "Fully responsive on all devices",
        ],
        challenges:
          "Learning the Next.js App Router from scratch was the biggest challenge. Understanding when to use server vs client components, fixing Tailwind v4 dark mode configuration, and debugging the Resend API integration taught me a lot about how modern Next.js apps work.",
      },
      {
        slug: "library-management-system",
        name: "Library Management System",
        desc: "A full backend system to manage books, members and borrowing built with Node.js, Express and MongoDB.",
        longDesc:
          "A RESTful API backend for managing a library — handling books, members, borrowing and returning. Built with Node.js and Express following MVC architecture with MongoDB as the database. Includes cron jobs for overdue book reminders.",
        tech: ["Node.js", "Express", "MongoDB", "REST API", "Cron Jobs"],
        github: "https://github.com/rahul4091/library-management-system-",
        live: "",
        gradient: "from-green-400 to-teal-400",
        features: [
          "Full CRUD for books and members",
          "Borrow and return book endpoints",
          "Overdue reminder cron job",
          "MVC architecture with controllers and routers",
          "MongoDB with Mongoose models",
          "Middleware for validation and error handling",
        ],
        challenges:
          "Designing a clean MVC structure and getting the cron job to reliably run overdue checks were the main challenges. This project taught me how to structure a real Node.js backend and think about architecture before writing code.",
      },
      {
        slug: "todo-app",
        name: "Todo App",
        desc: "A task management app with full CRUD operations, local storage persistence and clean UI.",
        longDesc:
          "A clean, minimal task management app built with React. Supports creating, completing and deleting tasks with data persisted in localStorage so tasks survive page refreshes.",
        tech: ["React", "localStorage", "CSS"],
        github: "https://github.com/rahul4091/my-portfolio",
        live: "",
        gradient: "from-blue-400 to-cyan-400",
        features: [
          "Add, complete and delete tasks",
          "localStorage persistence",
          "Filter by all / active / completed",
          "Clean minimal UI",
        ],
        challenges:
          "Managing state correctly across add, delete and toggle operations was the main learning. This was one of my first React projects and taught me useState and how to think in components.",
      },
      {
        slug: "blog-platform",
        name: "Blog Platform",
        desc: "A blog platform built with Next.js supporting Markdown, dynamic routing and static generation.",
        longDesc:
          "A blog platform built with Next.js App Router using MDX for content. Posts are written in Markdown and statically generated at build time for fast load speeds and great SEO.",
        tech: ["Next.js", "Markdown", "SSG"],
        github: "https://github.com/rahul4091/my-portfolio",
        live: "",
        gradient: "from-purple-400 to-pink-400",
        features: [
          "MDX-powered blog posts",
          "Static generation for all posts",
          "Dynamic routing with [slug]",
          "SEO metadata per post",
        ],
        challenges:
          "Understanding static site generation and how Next.js pre-renders pages at build time was the key learning. This project made the difference between SSG, SSR and CSR very clear.",
      },
    ],
  });

  console.log("✅ Seeded 4 projects successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
