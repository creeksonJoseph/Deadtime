/**
 * Frontend Test Setup
 * - Extends Jest matchers with @testing-library/jest-dom
 * - Stubs browser APIs not available in jsdom
 */
import "@testing-library/jest-dom";
import { vi } from "vitest";

// ──────────────────────────────────────────────────────────
// localStorage stub (jsdom supports it but ensure it's clean)
// ──────────────────────────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
});

// ──────────────────────────────────────────────────────────
// window.matchMedia stub (used by useIsBigScreen hook)
// ──────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ──────────────────────────────────────────────────────────
// window.confirm stub (used in App delete flow)
// ──────────────────────────────────────────────────────────
window.confirm = vi.fn(() => true);

// ──────────────────────────────────────────────────────────
// window.scrollTo stub
// ──────────────────────────────────────────────────────────
window.scrollTo = vi.fn();

// ──────────────────────────────────────────────────────────
// Suppress noisy console errors during tests
// ──────────────────────────────────────────────────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("not wrapped in act"))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
