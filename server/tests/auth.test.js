/**
 * Auth Controller Tests
 * Covers: signup, login, admin promotion, middleware protection
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
require("./setup");

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Set JWT_SECRET for test environment
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const authRoutes = require("../routes/authroutes");
const { protect, requireAdmin } = require("../middleware/authmiddleware");
const User = require("../models/User");

// Build a minimal express app for testing
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

// Protected test route for middleware tests
app.get("/api/protected", protect, (req, res) => {
  res.status(200).json({ message: "access granted", user: req.user });
});
app.get("/api/admin-only", protect, requireAdmin, (req, res) => {
  res.status(200).json({ message: "admin access granted" });
});

// ──────────────────────────────────────────────────────────
// SIGNUP
// ──────────────────────────────────────────────────────────
describe("POST /api/auth/signup", () => {
  const validPayload = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
  };

  it("should create a new user and return token + user info (201)", async () => {
    const res = await request(app).post("/api/auth/signup").send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      username: "testuser",
      email: "test@example.com",
    });
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.message).toContain("Signup successful");
  });

  it("should not expose hashed password in response", async () => {
    const res = await request(app).post("/api/auth/signup").send(validPayload);
    expect(res.body.user.password).toBeUndefined();
  });

  it("should return 400 when email already exists", async () => {
    await request(app).post("/api/auth/signup").send(validPayload);
    const res = await request(app).post("/api/auth/signup").send(validPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email already exists/i);
  });

  it("should be case-insensitive for duplicate email check", async () => {
    await request(app).post("/api/auth/signup").send(validPayload);
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...validPayload, email: "TEST@EXAMPLE.COM" });
    expect(res.statusCode).toBe(400);
  });

  it("should promote admin email to admin role on signup", async () => {
    // Use one of the hardcoded admin emails
    const adminEmail = "charanajoseph@gmail.com";
    const res = await request(app).post("/api/auth/signup").send({
      username: "adminuser",
      email: adminEmail,
      password: "AdminPass123!",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe("admin");
  });

  it("should assign 'user' role to a non-admin email", async () => {
    const res = await request(app).post("/api/auth/signup").send(validPayload);
    expect(res.body.user.role).toBe("user");
  });

  it("should return a valid JWT token on signup", async () => {
    const res = await request(app).post("/api/auth/signup").send(validPayload);
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("id");
    expect(decoded).toHaveProperty("role");
    expect(decoded).toHaveProperty("username");
  });

  it("should store hashed (not plain) password in the database", async () => {
    await request(app).post("/api/auth/signup").send(validPayload);
    const dbUser = await User.findOne({ email: validPayload.email });
    expect(dbUser.password).not.toBe(validPayload.password);
    const isHashed = await bcrypt.compare(validPayload.password, dbUser.password);
    expect(isHashed).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────────────────
describe("POST /api/auth/login", () => {
  const creds = { email: "login@example.com", password: "LoginPass123!" };

  beforeEach(async () => {
    const hashed = await bcrypt.hash(creds.password, 10);
    await User.create({ username: "loginuser", email: creds.email, password: hashed });
  });

  it("should return 200 with token and user on successful login", async () => {
    const res = await request(app).post("/api/auth/login").send(creds);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(creds.email);
  });

  it("should return 404 when user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "pass" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it("should return 401 when password is incorrect", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: creds.email, password: "WrongPassword!" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/incorrect password/i);
  });

  it("should be case-insensitive for email during login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "LOGIN@EXAMPLE.COM", password: creds.password });
    expect(res.statusCode).toBe(200);
  });

  it("should return a JWT with correct payload", async () => {
    const res = await request(app).post("/api/auth/login").send(creds);
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.username).toBe("loginuser");
  });

  it("should promote admin email to admin role on login", async () => {
    // Manually create a user with admin email but 'user' role
    const adminEmail = "charanajoseph@gmail.com";
    const hashed = await bcrypt.hash("AdminPass!", 10);
    await User.create({ username: "shouldbeadmin", email: adminEmail, password: hashed, role: "user" });

    const res = await request(app).post("/api/auth/login").send({ email: adminEmail, password: "AdminPass!" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });
});

// ──────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ──────────────────────────────────────────────────────────
describe("Auth Middleware (protect)", () => {
  let token;

  beforeEach(async () => {
    const hashed = await bcrypt.hash("MiddlePass!", 10);
    const user = await User.create({ username: "middlewareuser", email: "mid@example.com", password: hashed });
    token = jwt.sign({ id: user._id, role: "user", username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  });

  it("should allow access with a valid Bearer token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("access granted");
  });

  it("should reject request with no Authorization header (401)", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token provided/i);
  });

  it("should reject request with invalid token (401)", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid or expired token/i);
  });

  it("should reject request with malformed Authorization header (401)", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", token); // no "Bearer " prefix
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// ADMIN MIDDLEWARE
// ──────────────────────────────────────────────────────────
describe("Auth Middleware (requireAdmin)", () => {
  it("should allow admin users through", async () => {
    const hashed = await bcrypt.hash("AdminPass!", 10);
    const admin = await User.create({ username: "adminuser", email: "admin@example.com", password: hashed, role: "admin" });
    const adminToken = jwt.sign({ id: admin._id, role: "admin", username: admin.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

    const res = await request(app)
      .get("/api/admin-only")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should block non-admin users with 403", async () => {
    const hashed = await bcrypt.hash("UserPass!", 10);
    const normalUser = await User.create({ username: "normaluser", email: "normal@example.com", password: hashed, role: "user" });
    const userToken = jwt.sign({ id: normalUser._id, role: "user", username: normalUser.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

    const res = await request(app)
      .get("/api/admin-only")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/admins only/i);
  });
});
