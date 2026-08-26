// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PageLoader from "@/components/PageLoader";

const advance = (ms) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("PageLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at zero percent", () => {
    render(<PageLoader />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Loading portfolio")).toBeInTheDocument();
  });

  it("advances progress in 8% steps below 60%", () => {
    render(<PageLoader />);

    advance(50);
    expect(screen.getByText("8%")).toBeInTheDocument();

    advance(50);
    expect(screen.getByText("16%")).toBeInTheDocument();
  });

  it("slows down as it approaches 100%", () => {
    render(<PageLoader />);

    // 8 ticks of 8% -> 64%, then 4% steps
    advance(50 * 8);
    expect(screen.getByText("64%")).toBeInTheDocument();

    advance(50);
    expect(screen.getByText("68%")).toBeInTheDocument();
  });

  it("never reports more than 100%", () => {
    render(<PageLoader />);

    advance(50 * 60);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("stops ticking and schedules the hide once it reaches 100%", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const timeoutSpy = vi.spyOn(globalThis, "setTimeout");

    render(<PageLoader />);
    advance(50 * 60);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(clearSpy).toHaveBeenCalled();
    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 300);
  });

  it("clears its interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = render(<PageLoader />);
    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
