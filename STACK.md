# Tech Stack — What We Use & Why

A breakdown of every technology used in this portfolio and the reason it was chosen.

---

## Frontend

### Next.js 16
**What:** React framework with file-based routing, server components, and built-in API routes.  
**Why:** Gives both frontend and backend in one project. Server components let us fetch data from the database without writing a separate API — the page itself talks to Prisma directly. Also handles routing, image optimization, and deployment config out of the box.

### React 19
**What:** UI library for building component-based interfaces.  
**Why:** Industry standard. Every component in this project (Navbar, Hero, Contact form, etc.) is a React component. React 19 brings improved server/client component support which Next.js 16 takes full advantage of.

### JavaScript (JSX)
**What:** Plain JavaScript with JSX syntax for writing components.  
**Why:** No compilation step needed for types. Easier to read and contribute to for anyone familiar with standard JS. The project was originally TypeScript and was converted to JS to keep it accessible.

### Tailwind CSS 4
**What:** Utility-first CSS framework.  
**Why:** No separate CSS files to maintain. Every style is written directly in the JSX as class names, which keeps components self-contained. Tailwind 4 uses a PostCSS plugin instead of a config file, making setup simpler.

### Framer Motion
**What:** Animation library for React.  
**Why:** Makes scroll animations, page transitions, and micro-interactions easy to implement with a clean declarative API. Used for fade-ins, typewriter effects, the page loader, and the custom cursor.

---

## Backend & API

### Next.js API Routes
**What:** Server-side route handlers inside the `src/app/api/` folder.  
**Why:** No need for a separate Express server. API routes live in the same project, share the same environment variables, and deploy together. Used for the contact form (`/api/contact`) and project data endpoints.

### Resend
**What:** Email delivery API.  
**Why:** Simple API for sending transactional emails. The contact form sends an email to the portfolio owner via Resend whenever someone submits a message. More reliable than raw SMTP and has a generous free tier.

### Nodemailer
**What:** Node.js library for sending emails via SMTP.  
**Why:** Kept as a dependency as a fallback email option alongside Resend.

---

## Database

### Prisma 7
**What:** ORM (Object Relational Mapper) for Node.js.  
**Why:** Gives a type-safe way to query the database with a clean JavaScript API instead of writing raw SQL. The schema lives in `prisma/schema.prisma` and Prisma generates a client from it. Prisma 7 introduced the driver adapter model — meaning the database connection is handled by a separate adapter (Neon in this case).

### Neon (PostgreSQL)
**What:** Serverless PostgreSQL database hosted on Neon.  
**Why:** Serverless means the database scales to zero when not in use — perfect for a portfolio with variable traffic. Neon provides a standard PostgreSQL database with a connection string, and their `@prisma/adapter-neon` plugs directly into Prisma 7.

### @prisma/adapter-neon
**What:** Prisma driver adapter for Neon's serverless PostgreSQL.  
**Why:** Prisma 7 requires a driver adapter instead of a direct connection URL in the schema. This adapter handles the Neon-specific WebSocket connection that works in serverless environments.

---

## Styling & Theming

### next-themes
**What:** Library for dark/light mode in Next.js.  
**Why:** Handles system preference detection, theme persistence in localStorage, and prevents the flash of unstyled content (FOUC) on load. The `ThemeProvider` wraps the whole app and the Navbar toggle switches between modes.

### @tailwindcss/typography
**What:** Tailwind plugin that styles raw HTML content.  
**Why:** Project detail pages render GitHub README files as Markdown. The `prose` classes from this plugin apply readable typography to that content automatically — headings, paragraphs, code blocks, tables — without writing custom CSS.

---

## Deployment & CI/CD

### Vercel
**What:** Hosting platform built for Next.js.  
**Why:** Zero-config deployment for Next.js projects. Push to GitHub and Vercel auto-builds and deploys. Handles environment variables, edge functions, and CDN distribution. The `postinstall` script runs `prisma generate` automatically on every deploy.

### GitHub
**What:** Version control and remote repository.  
**Why:** Source of truth for the codebase. Vercel pulls from GitHub on every push to `main`, which means a `git push` is all it takes to ship a new version.

---

## Dev Tools

### ESLint
**What:** JavaScript linter.  
**Why:** Catches common mistakes and enforces consistent code style. Uses `eslint-config-next` which includes Next.js-specific rules.

### dotenv
**What:** Loads environment variables from a `.env` file.  
**Why:** Database URL, API keys, and email addresses are stored in `.env` and never committed to Git. `dotenv` makes those variables available to Node.js scripts like the Prisma seed file.

---

## Summary Table

| Technology | Category | Why |
|---|---|---|
| Next.js 16 | Framework | Full stack in one repo, server components, file routing |
| React 19 | UI | Component model, industry standard |
| JavaScript / JSX | Language | No build step for types, accessible |
| Tailwind CSS 4 | Styling | Utility classes, no separate CSS files |
| Framer Motion | Animation | Declarative animations, spring physics |
| Prisma 7 | ORM | Type-safe DB queries, schema-first |
| Neon PostgreSQL | Database | Serverless, scales to zero, free tier |
| Resend | Email | Simple API, reliable delivery |
| next-themes | Theming | Dark mode with no flash |
| Vercel | Hosting | Auto-deploy from GitHub, built for Next.js |
| ESLint | Linting | Catch errors, consistent code |
| dotenv | Config | Keep secrets out of Git |
