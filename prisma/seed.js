const { PrismaClient } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");
require("dotenv").config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
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
      slug: "payload-ecommerce",
      name: "Payload Ecommerce",
      desc: "A full-stack e-commerce platform built with Payload CMS and Next.js — featuring product management, cart, and a live storefront.",
      longDesc: "A production e-commerce platform that uses Payload CMS as the headless backend for product and order management, paired with a Next.js storefront. The project covers the full commerce flow — browsing products, managing a cart, and checking out — with content managed through Payload's admin panel.",
      tech: ["Payload CMS", "Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      githubUrl: "https://github.com/rahul4091/payload-ecommerce",
      liveUrl: "https://payload-ecommerce-eight.vercel.app",
      gradient: "from-indigo-400 to-purple-400",
      features: [
        "Payload CMS admin panel for product and order management",
        "Next.js storefront with dynamic product pages",
        "Cart functionality with state management",
        "Full TypeScript across frontend and CMS",
        "Deployed on Vercel with live demo",
      ],
      challenges: "Integrating Payload CMS as a headless backend with a separate Next.js frontend required careful API design. Getting type safety across both layers without duplication was the biggest architectural challenge.",
    },
    {
      slug: "personal-ai",
      name: "Personal AI",
      desc: "A personal AI assistant I'm actively building — bringing together LLM APIs and a custom interface for day-to-day productivity.",
      longDesc: "An ongoing personal project to build a custom AI assistant tailored to my workflow. Rather than relying on off-the-shelf tools, I'm building the interface and integrations from scratch — connecting LLM APIs, managing conversation context, and designing features I actually want to use every day.",
      tech: ["JavaScript", "Node.js", "LLM APIs", "REST API"],
      githubUrl: "https://github.com/rahul4091/Personal-AI",
      liveUrl: null,
      gradient: "from-rose-400 to-orange-400",
      features: [
        "Custom chat interface with conversation history",
        "LLM API integration for intelligent responses",
        "Context management across sessions",
        "Modular architecture to add new AI capabilities",
      ],
      challenges: "Managing conversation context without exceeding token limits while keeping responses relevant is the core ongoing challenge. This project is actively evolving.",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`Seeded: ${project.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
