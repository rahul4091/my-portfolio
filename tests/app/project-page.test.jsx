// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/lib/prisma", () => ({ prisma: { project: { findUnique } } }));
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));
vi.mock("@/components/ViewCounter", () => ({
  default: ({ slug }) => <span data-testid="views">{slug}</span>,
}));

const { default: ProjectPage, generateMetadata } = await import(
  "@/app/projects/[slug]/page"
);

const project = {
  slug: "portfolio",
  name: "Portfolio",
  desc: "My portfolio site",
  gradient: "from-yellow-400 to-orange-400",
  tech: ["Next.js", "Prisma"],
  githubUrl: "https://github.com/rahulpawar-31/my-portfolio",
  liveUrl: "https://example.com",
};

const params = (slug) => ({ params: Promise.resolve({ slug }) });

const readmeResponse = (markdown) => ({
  ok: true,
  json: async () => ({ content: Buffer.from(markdown, "utf-8").toString("base64") }),
});

describe("generateMetadata", () => {
  beforeEach(() => {
    findUnique.mockResolvedValue(project);
  });

  it("builds the title and description from the project", async () => {
    await expect(generateMetadata(params("portfolio"))).resolves.toEqual({
      title: "Portfolio — Rahul",
      description: "My portfolio site",
    });
  });

  it("returns empty metadata for an unknown project", async () => {
    findUnique.mockResolvedValue(null);

    await expect(generateMetadata(params("nope"))).resolves.toEqual({});
  });
});

describe("ProjectPage", () => {
  beforeEach(() => {
    findUnique.mockResolvedValue(project);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  });

  it("calls notFound for an unknown slug", async () => {
    findUnique.mockResolvedValue(null);

    await expect(ProjectPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("renders the project details and links", async () => {
    render(await ProjectPage(params("portfolio")));

    expect(screen.getByRole("heading", { level: 1, name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByTestId("views")).toHaveTextContent("portfolio");
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      project.githubUrl
    );
    expect(screen.getByRole("link", { name: "Live Demo" })).toHaveAttribute(
      "href",
      project.liveUrl
    );
  });

  it("omits the live demo link when there is no deployment", async () => {
    findUnique.mockResolvedValue({ ...project, liveUrl: null });

    render(await ProjectPage(params("portfolio")));

    expect(screen.queryByRole("link", { name: "Live Demo" })).not.toBeInTheDocument();
  });

  it("shows a fallback when the README request fails", async () => {
    render(await ProjectPage(params("portfolio")));

    expect(screen.getByText("No README found for this project.")).toBeInTheDocument();
  });

  it("fetches the README from the GitHub API for the repo", async () => {
    fetch.mockResolvedValue(readmeResponse("## Overview\nSome text\n"));

    render(await ProjectPage(params("portfolio")));

    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/rahulpawar-31/my-portfolio/readme",
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Some text")).toBeInTheDocument();
  });

  it("strips the title and private sections from the README", async () => {
    fetch.mockResolvedValue(
      readmeResponse(
        [
          "# my-portfolio",
          "Intro paragraph",
          "## Overview",
          "Public details",
          "## Local Setup",
          "npm install",
          "## Environment Variables",
          "DATABASE_URL=...",
          "## Author",
          "Rahul",
        ].join("\n\n")
      )
    );

    render(await ProjectPage(params("portfolio")));

    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.queryByText("Intro paragraph")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Local Setup" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Environment Variables" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Author" })).not.toBeInTheDocument();
  });

  it("shows the fallback when the GitHub URL is not a repo URL", async () => {
    findUnique.mockResolvedValue({ ...project, githubUrl: "https://example.com" });

    render(await ProjectPage(params("portfolio")));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText("No README found for this project.")).toBeInTheDocument();
  });

  it("shows the fallback when the GitHub request throws", async () => {
    fetch.mockRejectedValue(new Error("network down"));

    render(await ProjectPage(params("portfolio")));

    expect(screen.getByText("No README found for this project.")).toBeInTheDocument();
  });
});
