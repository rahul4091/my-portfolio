// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CustomCursor from "@/components/CustomCursor";

const move = (x, y) =>
  act(() => {
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: y }));
  });

const hoverOver = (element) =>
  act(() => {
    element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  });

describe("CustomCursor", () => {
  it("renders nothing before the first mouse move", () => {
    const { container } = render(<CustomCursor />);

    expect(container).toBeEmptyDOMElement();
  });

  it("hides the native cursor while mounted and restores it on unmount", () => {
    const { unmount } = render(<CustomCursor />);

    expect(document.body.style.cursor).toBe("none");

    unmount();

    expect(document.body.style.cursor).toBe("auto");
  });

  it("renders the ring and dot once the mouse moves", () => {
    const { container } = render(<CustomCursor />);

    move(120, 240);

    expect(container.querySelectorAll("div.fixed")).toHaveLength(2);
  });

  it("grows the ring when hovering an interactive element", () => {
    const button = document.createElement("button");
    document.body.appendChild(button);

    const { container } = render(<CustomCursor />);
    move(10, 10);
    expect(container.querySelector(".w-8")).toBeTruthy();

    hoverOver(button);

    expect(container.querySelector(".w-10")).toBeTruthy();
    expect(container.querySelector(".w-8")).toBeNull();

    button.remove();
  });

  it("shrinks the ring again on mouseout", () => {
    const link = document.createElement("a");
    document.body.appendChild(link);

    const { container } = render(<CustomCursor />);
    move(10, 10);
    hoverOver(link);
    expect(container.querySelector(".w-10")).toBeTruthy();

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });

    expect(container.querySelector(".w-8")).toBeTruthy();

    link.remove();
  });

  it("ignores hovering non-interactive elements", () => {
    const paragraph = document.createElement("p");
    document.body.appendChild(paragraph);

    const { container } = render(<CustomCursor />);
    move(10, 10);
    hoverOver(paragraph);

    expect(container.querySelector(".w-8")).toBeTruthy();

    paragraph.remove();
  });

  it("hides when the pointer leaves the document", () => {
    const { container } = render(<CustomCursor />);
    move(10, 10);
    expect(container).not.toBeEmptyDOMElement();

    act(() => {
      document.documentElement.dispatchEvent(new MouseEvent("mouseleave"));
    });

    expect(container).toBeEmptyDOMElement();

    act(() => {
      document.documentElement.dispatchEvent(new MouseEvent("mouseenter"));
    });

    expect(container).not.toBeEmptyDOMElement();
  });

  it("removes all of its listeners on unmount", () => {
    const windowSpy = vi.spyOn(window, "removeEventListener");
    const docSpy = vi.spyOn(document.documentElement, "removeEventListener");

    const { unmount } = render(<CustomCursor />);
    unmount();

    expect(windowSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(windowSpy).toHaveBeenCalledWith("mouseover", expect.any(Function));
    expect(windowSpy).toHaveBeenCalledWith("mouseout", expect.any(Function));
    expect(docSpy).toHaveBeenCalledWith("mouseleave", expect.any(Function));
    expect(docSpy).toHaveBeenCalledWith("mouseenter", expect.any(Function));
  });
});
