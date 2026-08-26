import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// framer-motion's whileInView relies on IntersectionObserver, which jsdom lacks.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver = IntersectionObserverStub;
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
