// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const calendarProps = [];
const useTheme = vi.fn();

vi.mock("react-github-calendar", () => ({
  GitHubCalendar: (props) => {
    calendarProps.push(props);
    return <div data-testid="calendar" />;
  },
}));

vi.mock("next-themes", () => ({ useTheme: () => useTheme() }));

const GitHubActivity = (await import("@/components/GitHubActivity")).default;

describe("GitHubActivity", () => {
  beforeEach(() => {
    calendarProps.length = 0;
    useTheme.mockReturnValue({ resolvedTheme: "dark" });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the section heading and profile link", () => {
    render(<GitHubActivity />);

    expect(screen.getByRole("heading", { name: "GitHub Activity" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view full profile/i })).toHaveAttribute(
      "href",
      "https://github.com/rahulpawar-31"
    );
  });

  it("renders the calendar with the dark colour scheme", () => {
    render(<GitHubActivity />);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();
    expect(calendarProps.at(-1).username).toBe("rahulpawar-31");
    expect(calendarProps.at(-1).colorScheme).toBe("dark");
  });

  it("renders the calendar with the light colour scheme", () => {
    useTheme.mockReturnValue({ resolvedTheme: "light" });

    render(<GitHubActivity />);

    expect(calendarProps.at(-1).colorScheme).toBe("light");
  });

  it("remounts the calendar every five minutes to pick up new pushes", () => {
    render(<GitHubActivity />);

    const renders = calendarProps.length;

    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(calendarProps.length).toBeGreaterThan(renders);
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });

  it("clears its refresh interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = render(<GitHubActivity />);
    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
