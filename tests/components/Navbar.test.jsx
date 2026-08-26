// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setTheme = vi.fn();
const usePathname = vi.fn();
const useTheme = vi.fn();

vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));
vi.mock("next-themes", () => ({ useTheme: () => useTheme() }));

const observerCallbacks = new Map();

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.disconnect = vi.fn();
  }
  observe(el) {
    observerCallbacks.set(el.id, this.callback);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const Navbar = (await import("@/components/Navbar")).default;

const activeClass = "text-yellow-400";

describe("Navbar", () => {
  beforeEach(() => {
    observerCallbacks.clear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    usePathname.mockReturnValue("/");
    useTheme.mockReturnValue({ theme: "dark", setTheme });
    window.scrollY = 0;
  });

  it("renders every navigation link", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/#projects");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
  });

  it("highlights the link matching the current pathname", () => {
    usePathname.mockReturnValue("/about");

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "About" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(activeClass);
  });

  it("highlights the link of the section currently in view", () => {
    const section = document.createElement("div");
    section.id = "projects";
    document.body.appendChild(section);

    render(<Navbar />);

    act(() => {
      observerCallbacks.get("projects")([{ isIntersecting: true }]);
    });

    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass(activeClass);

    section.remove();
  });

  it("ignores sections that are not intersecting", () => {
    const section = document.createElement("div");
    section.id = "contact";
    document.body.appendChild(section);

    render(<Navbar />);

    act(() => {
      observerCallbacks.get("contact")([{ isIntersecting: false }]);
    });

    expect(screen.getByRole("link", { name: "Contact" })).not.toHaveClass(activeClass);

    section.remove();
  });

  it("adds the scrolled styling past 20px", () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector("nav");

    expect(nav.className).toContain("bg-black");
    expect(nav.className).not.toContain("backdrop-blur-md");

    window.scrollY = 21;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(nav.className).toContain("backdrop-blur-md");
  });

  it("switches from dark to light when the toggle is clicked", async () => {
    render(<Navbar />);

    const toggle = await screen.findByRole("button", { name: "Toggle dark mode" });
    expect(toggle).toHaveTextContent("☀️");

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("switches from light to dark when the toggle is clicked", async () => {
    useTheme.mockReturnValue({ theme: "light", setTheme });

    render(<Navbar />);

    const toggle = await screen.findByRole("button", { name: "Toggle dark mode" });
    expect(toggle).toHaveTextContent("🌙");

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("disconnects its observers on unmount", () => {
    const section = document.createElement("div");
    section.id = "projects";
    document.body.appendChild(section);
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Navbar />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    section.remove();
  });
});
