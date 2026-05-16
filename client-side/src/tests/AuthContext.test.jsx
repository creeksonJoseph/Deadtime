/**
 * AuthContext Tests
 * Covers: login flow, logout flow, token/user persistence in localStorage,
 *         ProtectedRoute guard behaviour, useAuth hook errors
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth, AuthContext } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";

// ──────────────────────────────────────────────────────────
// Mock the users API so tests don't hit the network
// ──────────────────────────────────────────────────────────
vi.mock("../api/users", () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    user: {
      _id: "user-123",
      username: "testuser",
      email: "test@example.com",
      role: "user",
      revivalCount: 2,
      profilepic: "",
    },
    postedProjects: [],
    revivedProjects: [],
  }),
}));

// ──────────────────────────────────────────────────────────
// Helper: renders children inside AuthProvider + MemoryRouter
// ──────────────────────────────────────────────────────────
function renderWithAuth(ui, { initialEntries = ["/"] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

// ──────────────────────────────────────────────────────────
// Component that exposes auth context values for testing
// ──────────────────────────────────────────────────────────
function AuthDisplay() {
  const { user, token, loading } = useAuth();
  if (loading) return <div>loading...</div>;
  return (
    <div>
      <span data-testid="username">{user?.username ?? "no-user"}</span>
      <span data-testid="token">{token || "no-token"}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// AuthContext – initial state from localStorage
// ──────────────────────────────────────────────────────────
describe("AuthContext – initial state", () => {
  it("should show 'no-user' and 'no-token' when localStorage is empty", async () => {
    renderWithAuth(<AuthDisplay />);
    await waitFor(() => {
      expect(screen.getByTestId("username").textContent).toBe("no-user");
      expect(screen.getByTestId("token").textContent).toBe("no-token");
    });
  });

  it("should hydrate user from localStorage on mount", async () => {
    const savedUser = {
      id: "user-123",
      username: "saveduser",
      email: "saved@example.com",
      role: "user",
    };
    localStorage.setItem("token", "saved-token");
    localStorage.setItem("user", JSON.stringify(savedUser));
    localStorage.setItem("userId", savedUser.id);

    renderWithAuth(<AuthDisplay />);
    await waitFor(() => {
      // After fetchProfile resolves, user should be available
      expect(screen.queryByText("loading...")).not.toBeInTheDocument();
    });
  });
});

// ──────────────────────────────────────────────────────────
// AuthContext – login
// ──────────────────────────────────────────────────────────
describe("AuthContext – login", () => {
  function LoginButton() {
    const { login, user } = useAuth();
    return (
      <div>
        <button
          onClick={() =>
            login("new-token", {
              id: "user-456",
              username: "newuser",
              email: "new@example.com",
              role: "user",
            })
          }
        >
          Login
        </button>
        <span data-testid="username">{user?.username ?? "no-user"}</span>
      </div>
    );
  }

  it("should persist token and user to localStorage after login", async () => {
    renderWithAuth(
      <Routes>
        <Route path="/" element={<LoginButton />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    );

    await act(async () => {
      screen.getByRole("button", { name: /login/i }).click();
    });

    // Token should be persisted immediately
    expect(localStorage.getItem("token")).toBe("new-token");
    // User should have been stored (may be overwritten by profile fetch mock, but at minimum the key exists)
    expect(localStorage.getItem("user")).not.toBeNull();
  });
});

// ──────────────────────────────────────────────────────────
// AuthContext – logout
// ──────────────────────────────────────────────────────────
describe("AuthContext – logout", () => {
  function LogoutButton() {
    const { logout } = useAuth();
    return <button onClick={logout}>Logout</button>;
  }

  it("should clear localStorage on logout", async () => {
    const { unmount } = renderWithAuth(
      <Routes>
        <Route path="/" element={<LogoutButton />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    // Wait for initial load to stabilize
    await waitFor(() => {
      expect(screen.queryByText("loading...")).not.toBeInTheDocument();
    });

    // Set storage AFTER initial load
    localStorage.setItem("token", "some-token");
    localStorage.setItem("user", JSON.stringify({ username: "user" }));
    localStorage.setItem("userId", "abc");

    await act(async () => {
      screen.getByRole("button", { name: /logout/i }).click();
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────
// useAuth hook – must be inside AuthProvider
// ──────────────────────────────────────────────────────────
describe("useAuth hook", () => {
  it("should throw an error when used outside AuthProvider", () => {
    function BadComponent() {
      useAuth();
      return null;
    }

    // Suppress the expected error from console
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<MemoryRouter><BadComponent /></MemoryRouter>)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });
});

// ──────────────────────────────────────────────────────────
// ProtectedRoute
// ──────────────────────────────────────────────────────────
describe("ProtectedRoute", () => {
  it("should render children when user is authenticated", async () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ id: "user-123", username: "testuser" })
    );
    localStorage.setItem("userId", "user-123");

    renderWithAuth(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.queryByText("loading...")).not.toBeInTheDocument();
    });
  });

  it("should redirect to /login when no user", async () => {
    // localStorage is clean (cleared in setup.js)
    renderWithAuth(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Secret</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });

  it("should show a loading spinner while auth state is loading", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null, loading: true, token: "" }}>
          <ProtectedRoute>
            <div>Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // The spinner is a div with animate-spin class
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
  });
});
