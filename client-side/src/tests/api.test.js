/**
 * API Layer Tests
 * Covers: auth.js, ghostcards.js, users.js, ghostnotes.js, revive.js
 * Strategy: mock global fetch and assert correct URLs, headers, methods, and error handling
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ──────────────────────────────────────────────────────────
// auth.js
// ──────────────────────────────────────────────────────────
import { loginUser } from "../api/auth";

describe("auth API – loginUser", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should POST to /api/auth/login and return JSON data", async () => {
    const mockData = { token: "abc", user: { email: "a@b.com" } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await loginUser({ email: "a@b.com", password: "pass" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toEqual(mockData);
  });

  it("should throw an error when the response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid email or password" }),
    });

    await expect(loginUser({ email: "x@y.com", password: "bad" })).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("should throw a default error when no message in error body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(loginUser({ email: "x@y.com", password: "bad" })).rejects.toThrow(
      "Invalid email or password"
    );
  });
});

// ──────────────────────────────────────────────────────────
// ghostcards.js
// ──────────────────────────────────────────────────────────
import {
  getGhostCards,
  getGhostCardById,
  createGhostCard,
  updateGhostCard,
  deleteGhostCard,
} from "../api/ghostcards";

describe("ghostcards API", () => {
  const token = "test-token";
  const cardId = "card-id-123";
  const mockCard = { _id: cardId, title: "Dead Project", type: "code" };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getGhostCards – should GET /api/ghostcards with auth header", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [mockCard] });
    const result = await getGhostCards(token);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/ghostcards"),
      expect.objectContaining({ headers: { Authorization: `Bearer ${token}` } })
    );
    expect(result).toEqual([mockCard]);
  });

  it("getGhostCards – should GET without auth header when no token", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    await getGhostCards(null);

    const [, options] = fetch.mock.calls[0];
    expect(options.headers).toEqual({});
  });

  it("getGhostCards – should throw when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(getGhostCards(token)).rejects.toThrow("Failed to fetch ghost cards");
  });

  it("getGhostCardById – should GET /api/ghostcards/:id", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockCard });
    const result = await getGhostCardById(cardId, token);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/ghostcards/${cardId}`),
      expect.any(Object)
    );
    expect(result._id).toBe(cardId);
  });

  it("getGhostCardById – should throw on 404", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(getGhostCardById("bad-id", token)).rejects.toThrow("Failed to fetch project");
  });

  it("createGhostCard – should POST with JSON body and auth header", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ card: mockCard }) });
    const newCard = { title: "New Project", type: "code" };
    await createGhostCard(newCard, token);

    const [, options] = fetch.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers.Authorization).toBe(`Bearer ${token}`);
    expect(JSON.parse(options.body)).toEqual(newCard);
  });

  it("createGhostCard – should throw on error", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(createGhostCard({}, token)).rejects.toThrow("Failed to create ghost card");
  });

  it("updateGhostCard – should PUT /api/ghostcards/:id with body", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ card: mockCard }) });
    await updateGhostCard(cardId, { externalLink: "https://github.com" }, token);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain(`/api/ghostcards/${cardId}`);
    expect(options.method).toBe("PUT");
  });

  it("updateGhostCard – should throw on error", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(updateGhostCard(cardId, {}, token)).rejects.toThrow("Failed to update ghost card");
  });

  it("deleteGhostCard – should DELETE /api/ghostcards/:id", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: "deleted" }) });
    await deleteGhostCard(cardId, token);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain(`/api/ghostcards/${cardId}`);
    expect(options.method).toBe("DELETE");
  });

  it("deleteGhostCard – should throw on error", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(deleteGhostCard(cardId, token)).rejects.toThrow("Failed to delete ghost card");
  });
});

// ──────────────────────────────────────────────────────────
// users.js
// ──────────────────────────────────────────────────────────
import { getUserProfile, updateUserProfile, getLeaderboard } from "../api/users";

describe("users API", () => {
  const token = "user-token";
  const userId = "user-123";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getUserProfile – should GET /api/users/:userId with token", async () => {
    const mockProfile = { user: { username: "test" }, postedProjects: [], revivedProjects: [] };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockProfile });
    const result = await getUserProfile(userId, token);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/users/${userId}`),
      expect.objectContaining({ headers: { Authorization: `Bearer ${token}` } })
    );
    expect(result.user.username).toBe("test");
  });

  it("getUserProfile – should throw on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(getUserProfile(userId, token)).rejects.toThrow("Failed to fetch user profile");
  });

  it("updateUserProfile – should PUT with correct body", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ user: {} }) });
    await updateUserProfile(userId, { username: "newname" }, token);

    const [, options] = fetch.mock.calls[0];
    expect(options.method).toBe("PUT");
    expect(JSON.parse(options.body)).toEqual({ username: "newname" });
  });

  it("updateUserProfile – should throw on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(updateUserProfile(userId, {}, token)).rejects.toThrow("Failed to update user profile");
  });

  it("getLeaderboard – should GET /api/leaderboard", async () => {
    const mockLeaderboard = [{ username: "top", revivalCount: 10 }];
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockLeaderboard });
    const result = await getLeaderboard(token);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/leaderboard"),
      expect.any(Object)
    );
    expect(result).toEqual(mockLeaderboard);
  });

  it("getLeaderboard – should throw on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(getLeaderboard(token)).rejects.toThrow("Failed to fetch leaderboard");
  });
});
