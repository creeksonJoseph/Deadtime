/**
 * Test utilities / shared helpers for frontend tests
 */
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { vi } from "vitest";

// ──────────────────────────────────────────────────────────
// Default mock user
// ──────────────────────────────────────────────────────────
export const mockUser = {
  id: "user123",
  username: "testuser",
  email: "test@example.com",
  role: "user",
  revivalCount: 3,
  profilepic: "",
};

export const mockAdminUser = {
  id: "admin123",
  username: "adminuser",
  email: "admin@example.com",
  role: "admin",
  revivalCount: 0,
  profilepic: "",
};

// ──────────────────────────────────────────────────────────
// Default mock auth context value
// ──────────────────────────────────────────────────────────
export const makeMockAuth = (overrides = {}) => ({
  user: mockUser,
  token: "mock-token-xyz",
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
  ...overrides,
});

// ──────────────────────────────────────────────────────────
// renderWithProviders: wraps component in MemoryRouter + AuthContext
// ──────────────────────────────────────────────────────────
export function renderWithProviders(ui, { authValue, route = "/" } = {}) {
  const auth = authValue ?? makeMockAuth();
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={auth}>{ui}</AuthContext.Provider>
    </MemoryRouter>
  );
}

// ──────────────────────────────────────────────────────────
// Mock ghost card factory
// ──────────────────────────────────────────────────────────
export const makeGhostCard = (overrides = {}) => ({
  _id: "card-abc-123",
  creatorId: "user123",
  title: "Dead Project Alpha",
  description: "A project that lost momentum",
  type: "code",
  status: "abandoned",
  revivedBy: [],
  revivedByCount: 0,
  dateStarted: "2023-01-01T00:00:00.000Z",
  dateAbandoned: "2023-06-01T00:00:00.000Z",
  createdAt: "2023-06-01T00:00:00.000Z",
  updatedAt: "2023-06-01T00:00:00.000Z",
  ...overrides,
});
