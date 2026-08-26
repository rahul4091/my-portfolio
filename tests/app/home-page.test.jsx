// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const stub = (name) => ({ default: () => <div data-testid={name} /> });

vi.mock("@/components/Hero", () => stub("hero"));
vi.mock("@/components/Skill", () => stub("skills"));
vi.mock("@/components/Project", () => stub("projects"));
vi.mock("@/components/GitHubActivity", () => stub("github"));
vi.mock("@/components/Contact", () => stub("contact"));
vi.mock("@/components/Footer", () => stub("footer"));

const { default: Home, dynamic } = await import("@/app/page");

describe("Home page", () => {
  it("is rendered dynamically so project data is never stale", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("composes every homepage section in order", () => {
    const { container } = render(<Home />);

    for (const section of ["hero", "skills", "projects", "github", "contact", "footer"]) {
      expect(screen.getByTestId(section)).toBeInTheDocument();
    }
    expect([...container.children].map((el) => el.dataset.testid)).toEqual([
      "hero",
      "skills",
      "projects",
      "github",
      "contact",
      "footer",
    ]);
  });
});
