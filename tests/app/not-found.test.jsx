// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders the 404 message", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });

  it("offers a way home and a way to get in touch", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute(
      "href",
      "/#contact"
    );
  });
});
