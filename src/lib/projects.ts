export type Project = {
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  tech: string[];
  github: string;
  live: string;
  gradient: string;
  features: string[];
  challenges: string;
};

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    name: "Portfolio Website",
    desc: "A production-ready developer portfolio with database integration, email delivery and CI/CD — built to get hired.",
    longDesc:
      "Most developer portfolios are just static pages. I built mine differently — with a real PostgreSQL database (Neon), a working contact form that saves messages and sends emails via Resend, dark mode, animations and a full CI/CD pipeline. The goal was to build something that demonstrates full stack skills, not just frontend design. Every part of this portfolio is something I built and debugged myself — from fixing Prisma 7 breaking changes to setting up branch protection on GitHub.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Framer Motion", "Resend"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
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
    challenges:
      "The biggest challenge was Prisma 7 — it had major breaking changes from older versions. The PrismaClient needed a Neon driver adapter, the schema lost the url field, and generateStaticParams crashed at build time because it tried to query the DB before the server started. I solved each one systematically: switched to static data for projects, added the @prisma/adapter-neon package, and set engineType to client in the schema. This taught me how to read error messages carefully and debug production build failures.",
  },
  {
    slug: "library-management-system",
    name: "Library Management System",
    desc: "A production-grade REST API backend for managing books, members and borrowing — built with Node.js, Express and MongoDB.",
    longDesc:
      "Libraries struggle with manual tracking of books, members and overdue returns. I built a complete backend API to automate this — handling everything from book inventory to member management, borrowing and returning, and automated overdue reminders. The system follows MVC architecture which keeps the codebase clean and scalable. A cron job runs daily to check for overdue books and flag them automatically — no manual checking needed.",
    tech: ["Node.js", "Express", "MongoDB", "Mongoose", "REST API", "Cron Jobs", "MVC"],
    github: "https://github.com/rahul4091/library-management-system-",
    live: "",
    gradient: "from-green-400 to-teal-400",
    features: [
      "Full CRUD for books, members and borrowing records",
      "Borrow and return endpoints with availability checks",
      "Automated overdue reminder cron job runs daily",
      "MVC architecture — models, controllers, routes separated",
      "Mongoose models with validation",
      "Centralized error handling middleware",
      "RESTful API design following best practices",
    ],
    challenges:
      "Designing the MVC folder structure before writing a single line of code was the key decision that made this project work. Early on I tried writing everything in one file — it became unmanageable fast. Restructuring into controllers, models and routes made the code readable and easy to extend. Getting the cron job to reliably check overdue books without duplicating notifications also required careful state management in MongoDB.",
  },
  {
    slug: "todo-app",
    name: "Todo App",
    desc: "A fast, minimal task manager built with React — featuring full CRUD, filters and localStorage persistence.",
    longDesc:
      "A task management app that actually works the way users expect — tasks survive page refreshes, filters work instantly, and the UI responds without any delay. Built with React using hooks for state management and localStorage for persistence. This was my first real React project and it taught me how to think in components, manage state across multiple interactions and build UIs that feel fast and responsive.",
    tech: ["React", "JavaScript", "localStorage", "CSS"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "",
    gradient: "from-blue-400 to-cyan-400",
    features: [
      "Add, complete and delete tasks instantly",
      "localStorage persistence — tasks survive refresh",
      "Filter by All / Active / Completed",
      "Task count tracking",
      "Clean minimal UI with smooth interactions",
    ],
    challenges:
      "The hardest part was managing state correctly when multiple operations happen together — toggling a task complete while a filter is active, or deleting the last task in a filtered view. This taught me to think carefully about derived state vs stored state and when to use useState vs computed values. It was my foundation for understanding how React actually works.",
  },
  {
    slug: "blog-platform",
    name: "Blog Platform",
    desc: "A Next.js blog platform with Markdown support, static generation and per-post SEO metadata.",
    longDesc:
      "A performant blog platform where posts are written in Markdown and pre-rendered at build time using Next.js SSG. Each post gets its own dynamic route, custom metadata for SEO, and loads instantly because there is no server-side rendering at request time. This project taught me the real difference between SSG, SSR and CSR — and when to use each one. Understanding this changed how I think about every Next.js project I build.",
    tech: ["Next.js", "MDX", "Markdown", "SSG", "TypeScript"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "",
    gradient: "from-purple-400 to-pink-400",
    features: [
      "MDX-powered blog posts with Markdown syntax",
      "Static generation — all posts pre-built at deploy time",
      "Dynamic routing with [slug] for each post",
      "Per-post SEO metadata — title, description, OG tags",
      "Zero server queries at runtime — pure static HTML",
    ],
    challenges:
      "Understanding when Next.js runs code was the key challenge. I kept getting confused about what runs at build time vs request time. Building this project made it click — getStaticProps and generateStaticParams run at build time, not when a user visits the page. This understanding is now something I apply to every Next.js project I build.",
  },
];
