// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import BackToTop from "@/components/BackToTop";

const scrollTo = (y) => {
  window.scrollY = y;
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

afterEach(() => {
  window.scrollY = 0;
});

describe("BackToTop", () => {
  it("stays hidden near the top of the page", () => {
    render(<BackToTop />);

    expect(screen.queryByRole("button", { name: "Back to top" })).not.toBeInTheDocument();
  });

  it("appears once the page is scrolled past 400px", async () => {
    render(<BackToTop />);

    scrollTo(401);

    expect(await screen.findByRole("button", { name: "Back to top" })).toBeInTheDocument();
  });

  it("does not appear exactly at the 400px threshold", () => {
    render(<BackToTop />);

    scrollTo(400);

    expect(screen.queryByRole("button", { name: "Back to top" })).not.toBeInTheDocument();
  });

  it("scrolls smoothly back to the top when clicked", async () => {
    const scrollToSpy = vi.fn();
    vi.stubGlobal("scrollTo", scrollToSpy);

    render(<BackToTop />);
    scrollTo(600);

    await userEvent.click(await screen.findByRole("button", { name: "Back to top" }));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("removes its scroll listener on unmount", async () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<BackToTop />);
    unmount();

    await waitFor(() =>
      expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function))
    );
  });
});
