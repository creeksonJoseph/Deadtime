/**
 * User Controller Tests
 * Covers: getUserProfile (by ID and username), updateUserProfile,
 *         getLeaderboard, getAllUsersWithProjects, deleteUser, adminDeleteProject
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
require("./setup");

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const userRoutes = require("../routes/userroutes");
const leaderboardRoutes = require("../routes/leaderboardroute");
const User = require("../models/User");
const GhostCard = require("../models/GhostCard");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
const makeToken = (user, role = "user") =>
  jwt.sign({ id: user._id.toString(), role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

const makeAdminToken = (user) => makeToken(user, "admin");

let userA, userB, adminUser;
let tokenA, tokenB, adminToken;

beforeEach(async () => {
  const hashed = await bcrypt.hash("pass", 10);
  userA = await User.create({ username: "userone", email: "a@example.com", password: hashed, revivalCount: 5 });
  userB = await User.create({ username: "usertwo", email: "b@example.com", password: hashed, revivalCount: 10 });
  adminUser = await User.create({ username: "adminuser", email: "admin@example.com", password: hashed, role: "admin" });

  tokenA = makeToken(userA);
  tokenB = makeToken(userB);
  adminToken = makeAdminToken(adminUser);
});

// ──────────────────────────────────────────────────────────
// GET user profile by ID
// ──────────────────────────────────────────────────────────
describe("GET /api/users/:userId", () => {
  it("should return user profile by ObjectId (200)", async () => {
    const res = await request(app)
      .get(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("userone");
    expect(res.body).toHaveProperty("postedProjects");
    expect(res.body).toHaveProperty("revivedProjects");
  });

  it("should return user profile by username (200)", async () => {
    const res = await request(app)
      .get(`/api/users/${userA.username}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("userone");
  });

  it("should not return password in profile", async () => {
    const res = await request(app)
      .get(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.body.user.password).toBeUndefined();
  });

  it("should return 404 for a non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(404);
  });

  it("should include postedProjects belonging to the user", async () => {
    await GhostCard.create({
      creatorId: userA._id,
      title: "UserA Project",
      description: "Desc",
      type: "code",
      dateStarted: new Date(),
    });
    const res = await request(app)
      .get(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.body.postedProjects.length).toBe(1);
    expect(res.body.postedProjects[0].title).toBe("UserA Project");
  });
});

// ──────────────────────────────────────────────────────────
// PUT user profile (actual route is PUT, not PATCH)
// ──────────────────────────────────────────────────────────
describe("PUT /api/users/:userId", () => {
  it("should update username and return updated user (200)", async () => {
    const res = await request(app)
      .put(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ username: "updateduser" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("updateduser");
  });

  it("should update email and return updated user (200)", async () => {
    const res = await request(app)
      .put(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ email: "newemail@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("newemail@example.com");
  });

  it("should update profilepic (200)", async () => {
    const res = await request(app)
      .put(`/api/users/${userA._id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ profilepic: "https://example.com/avatar.png" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.profilepic).toBe("https://example.com/avatar.png");
  });

  it("should return 404 when updating a non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ username: "ghost" });
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 without a token", async () => {
    const res = await request(app)
      .put(`/api/users/${userA._id}`)
      .send({ username: "noauth" });
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// GET leaderboard (public route at /api/leaderboard – no auth required)
// ──────────────────────────────────────────────────────────
describe("GET /api/leaderboard", () => {
  it("should return users sorted by revivalCount descending (no auth required)", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // userB has higher revivalCount (10 vs 5)
    expect(res.body[0].revivalCount).toBeGreaterThanOrEqual(res.body[1]?.revivalCount ?? 0);
  });

  it("should return at most 10 users", async () => {
    const hashed = await bcrypt.hash("p", 10);
    for (let i = 0; i < 15; i++) {
      await User.create({ username: `bulk${i}`, email: `bulk${i}@example.com`, password: hashed });
    }
    const res = await request(app).get("/api/leaderboard");
    expect(res.body.length).toBeLessThanOrEqual(10);
  });

  it("should only return username and revivalCount", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.body[0]).not.toHaveProperty("email");
    expect(res.body[0]).not.toHaveProperty("password");
    expect(res.body[0]).toHaveProperty("username");
    expect(res.body[0]).toHaveProperty("revivalCount");
  });

  it("should return 401 without a token on the protected user-route leaderboard", async () => {
    const res = await request(app).get("/api/users/leaderboard");
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// Admin: GET all users with projects
// ──────────────────────────────────────────────────────────
describe("GET /api/users (admin only)", () => {
  it("should return all users with their projects for admin (200)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0]).toHaveProperty("postedProjects");
    expect(res.body[0]).toHaveProperty("revivedProjects");
  });

  it("should return 403 for non-admin users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(403);
  });

  it("should return 401 for unauthenticated requests", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// Admin: DELETE user (actual route: DELETE /api/users/users/:userId)
// ──────────────────────────────────────────────────────────
describe("DELETE /api/users/users/:userId (admin only)", () => {
  it("should delete a user and their ghost cards (200)", async () => {
    await GhostCard.create({
      creatorId: userA._id,
      title: "UserA dead project",
      description: "Desc",
      type: "code",
      dateStarted: new Date(),
    });

    const res = await request(app)
      .delete(`/api/users/users/${userA._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    const deletedUser = await User.findById(userA._id);
    expect(deletedUser).toBeNull();

    const orphanCards = await GhostCard.find({ creatorId: userA._id });
    expect(orphanCards.length).toBe(0);
  });

  it("should return 404 when deleting a non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/users/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 403 for non-admin users", async () => {
    const res = await request(app)
      .delete(`/api/users/users/${userB._id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(403);
  });
});

// ──────────────────────────────────────────────────────────
// Admin: DELETE project (actual route: DELETE /api/users/projects/:id)
// ──────────────────────────────────────────────────────────
describe("DELETE /api/users/projects/:id (admin only)", () => {
  let projectId;

  beforeEach(async () => {
    const card = await GhostCard.create({
      creatorId: userA._id,
      title: "Admin Target Project",
      description: "Desc",
      type: "business",
      dateStarted: new Date(),
    });
    projectId = card._id.toString();
  });

  it("should delete any project as admin (200)", async () => {
    const res = await request(app)
      .delete(`/api/users/projects/${projectId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should return 404 when project does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/users/projects/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 403 for non-admin users", async () => {
    const res = await request(app)
      .delete(`/api/users/projects/${projectId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(403);
  });
});
