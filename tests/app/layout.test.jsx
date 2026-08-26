// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const stub = (name) => ({ default: () => <div data-testid={name} /> });

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));
vi.mock("@/components/ThemeProvider", () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
}));
vi.mock("@/components/Navbar", () => stub("navbar"));
vi.mock("@/components/CustomCursor", () => stub("cursor"));
vi.mock("@/components/PageLoader", () => stub("loader"));
vi.mock("@/components/BackToTop", () => stub("back-to-top"));

const { default: RootLayout, metadata } = await import("@/app/layout");

describe("RootLayout", () => {
  it("exposes SEO metadata", () => {
    expect(metadata.title).toBe("Rahul — Next.js Developer");
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph.siteName).toBe("Rahul.dev");
    expect(metadata.twitter.card).toBe("summary_large_image");
  });

  it("renders the chrome around the page content", () => {
    // rendering <html>/<body> into a div is not valid, so only the tree is inspected
    const tree = RootLayout({ children: <main data-testid="page" /> });

    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props.suppressHydrationWarning).toBe(true);

    const body = tree.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toContain("--font-geist-sans");
    expect(body.props.className).toContain("--font-geist-mono");
  });

  it("wraps the children in the theme provider along with the global chrome", () => {
    const tree = RootLayout({ children: <main data-testid="page" /> });
    const provider = tree.props.children.props.children;

    const { getByTestId } = render(provider);

    for (const id of ["theme-provider", "loader", "cursor", "navbar", "page", "back-to-top"]) {
      expect(getByTestId(id)).toBeInTheDocument();
    }
  });
});
