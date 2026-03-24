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
      name: "Portfolio Website",
      desc: "A production-ready developer portfolio with database integration, email delivery and CI/CD — built to get hired.",
      longDesc: "Most developer portfolios are just static pages. I built mine differently — with a real PostgreSQL database (Neon), a working contact form that saves messages and sends emails via Resend, dark mode, animations and a full CI/CD pipeline. The goal was to build something that demonstrates full stack skills, not just frontend design.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Framer Motion", "Resend"],
      githubUrl: "https://github.com/rahul4091/my-portfolio",
      liveUrl: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
      gradient: "from-yellow-400 to-orange-400",
      features: [
        "Contact form saves messages to Neon PostgreSQL database",
        "Email delivery via Resend API",
        "Dark/light mode with next-themes",
        "Typewriter animation with hydration fix",
        "Sticky navbar with scroll blur and active section highlight",
        "SSG for all project pages — instant load",
        "Branch protection with PR workflow on GitHub",
        "Auto-deploy on Vercel with postinstall prisma generate",
      ],
      challenges: "The biggest challenge was Prisma 7 — it had major breaking changes from older versions. The PrismaClient needed a Neon driver adapter, the schema lost the url field, and generateStaticParams crashed at build time because it tried to query the DB before the server started.",
    },
    {
      slug: "library-management-system",
      name: "Library Management System",
      desc: "A production-grade REST API backend for managing books, members and borrowing — built with Node.js, Express and MongoDB.",
      longDesc: "Libraries struggle with manual tracking of books, members and overdue returns. I built a complete backend API to automate this — handling everything from book inventory to member management, borrowing and returning, and automated overdue reminders.",
      tech: ["Node.js", "Express", "MongoDB", "Mongoose", "REST API", "Cron Jobs", "MVC"],
      githubUrl: "https://github.com/rahul4091/library-management-system-",
      liveUrl: null,
      gradient: "from-green-400 to-teal-400",
      features: [
        "Full CRUD for books, members and borrowing records",
        "Borrow and return endpoints with availability checks",
        "Automated overdue reminder cron job runs daily",
        "MVC architecture — models, controllers, routes separated",
        "Mongoose models with validation",
        "Centralized error handling middleware",
      ],
      challenges: "Designing the MVC folder structure before writing a single line of code was the key decision that made this project work. Early on I tried writing everything in one file — it became unmanageable fast.",
    },
    {
      slug: "todo-app",
      name: "Todo App",
      desc: "A fast, minimal task manager built with React — featuring full CRUD, filters and localStorage persistence.",
      longDesc: "A task management app that actually works the way users expect — tasks survive page refreshes, filters work instantly, and the UI responds without any delay. Built with React using hooks for state management and localStorage for persistence.",
      tech: ["React", "JavaScript", "localStorage", "CSS"],
      githubUrl: "https://github.com/rahul4091/my-portfolio",
      liveUrl: null,
      gradient: "from-blue-400 to-cyan-400",
      features: [
        "Add, complete and delete tasks instantly",
        "localStorage persistence — tasks survive refresh",
        "Filter by All / Active / Completed",
        "Task count tracking",
        "Clean minimal UI with smooth interactions",
      ],
      challenges: "Managing state correctly across add, delete and toggle operations was the main learning. This was one of my first React projects and taught me useState and how to think in components.",
    },
    {
      slug: "blog-platform",
      name: "Blog Platform",
      desc: "A Next.js blog platform with Markdown support, static generation and per-post SEO metadata.",
      longDesc: "A performant blog platform where posts are written in Markdown and pre-rendered at build time using Next.js SSG. Each post gets its own dynamic route, custom metadata for SEO, and loads instantly because there is no server-side rendering at request time.",
      tech: ["Next.js", "MDX", "Markdown", "SSG", "TypeScript"],
      githubUrl: "https://github.com/rahul4091/my-portfolio",
      liveUrl: null,
      gradient: "from-purple-400 to-pink-400",
      features: [
        "MDX-powered blog posts with Markdown syntax",
        "Static generation — all posts pre-built at deploy time",
        "Dynamic routing with [slug] for each post",
        "Per-post SEO metadata — title, description, OG tags",
        "Zero server queries at runtime — pure static HTML",
      ],
      challenges: "Understanding when Next.js runs code was the key challenge. I kept getting confused about what runs at build time vs request time. Building this project made it click.",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`✅ Seeded: ${project.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
