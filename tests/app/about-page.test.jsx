// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "@/app/about/page";

describe("About page", () => {
  it("renders the tech stack", () => {
    render(<About />);

    for (const tech of ["Next.js", "React", "Prisma", "Framer Motion"]) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("renders the journey timeline entries", () => {
    render(<About />);

    expect(screen.getByText("Started My Coding Journey")).toBeInTheDocument();
    expect(screen.getByText("Went Full Stack")).toBeInTheDocument();
    expect(screen.getByText("Mastered Modern Web Dev")).toBeInTheDocument();
    expect(screen.getAllByText(/^Year \d$/)).toHaveLength(3);
  });
});
