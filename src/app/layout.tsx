import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ All your SEO metadata lives here
export const metadata: Metadata = {
  // Basic SEO — shows in Google search results
  title: "Rahul — Next.js Developer",
  description:
    "Portfolio of Rahul, a Next.js developer building modern web applications. View my projects, skills and get in touch.",

  // Keywords (less important nowadays but still good to have)
  keywords: ["Next.js", "React", "Portfolio", "Full Stack Developer", "Rahul"],

  // The author
  authors: [{ name: "Rahul" }],

  // Open Graph — used by LinkedIn, Facebook, WhatsApp for preview cards
  openGraph: {
    title: "Rahul — Next.js Developer",
    description:
      "Portfolio of Rahul, a Next.js developer building modern web applications.",
    url: "https://rahul.dev", // 🔁 change to your real URL after deploying
    siteName: "Rahul.dev",
    locale: "en_US",
    type: "website",
  },

  // Twitter/X card
  twitter: {
    card: "summary_large_image",
    title: "Rahul — Next.js Developer",
    description:
      "Portfolio of Rahul, a Next.js developer building modern web applications.",
  },

  // Tells Google to index your site
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
