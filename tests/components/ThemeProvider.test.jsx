// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const providerProps = [];

vi.mock("next-themes", () => ({
  ThemeProvider: (props) => {
    providerProps.push(props);
    return <div data-testid="next-themes">{props.children}</div>;
  },
}));

const { ThemeProvider } = await import("@/components/ThemeProvider");

describe("ThemeProvider", () => {
  it("configures next-themes for class based system theming", () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>
    );

    expect(screen.getByText("child")).toBeInTheDocument();
    expect(providerProps.at(-1)).toMatchObject({
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
    });
  });
});
