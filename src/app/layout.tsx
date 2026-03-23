import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahul — Next.js Developer",
  description: "Portfolio of Rahul, a Next.js developer building modern web applications. View my projects, skills and get in touch.",
  keywords: ["Next.js", "React", "Portfolio", "Full Stack Developer", "Rahul"],
  authors: [{ name: "Rahul" }],
  openGraph: {
    title: "Rahul — Next.js Developer",
    description: "Portfolio of Rahul, a Next.js developer building modern web applications.",
    url: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
    siteName: "Rahul.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul — Next.js Developer",
    description: "Portfolio of Rahul, a Next.js developer building modern web applications.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <PageLoader />
          <CustomCursor />
          <Navbar />
          {children}
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
