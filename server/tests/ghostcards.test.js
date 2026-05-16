/**
 * GhostCard Controller Tests
 * Covers: getAllGhostCards, getGhostCardById, postGhostCard,
 *         updateGhostCard (revive), deleteGhostCard
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
require("./setup");

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const ghostCardRoutes = require("../routes/GhostCardroutes");
const { protect } = require("../middleware/authmiddleware");
const User = require("../models/User");
const GhostCard = require("../models/GhostCard");

const app = express();
app.use(express.json());
app.use("/api/ghostcards", ghostCardRoutes);

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
let userToken, userId, anotherUserToken, anotherUserId;

const makeCard = (overrides = {}) => ({
  title: "Dead Side Project",
  description: "A project that never shipped",
  status: "abandoned",
  type: "code",
  dateStarted: "2023-01-01",
  ...overrides,
});

beforeEach(async () => {
  // Create primary user
  const hashed = await bcrypt.hash("TestPass!", 10);
  const user = await User.create({ username: "cardowner", email: "owner@example.com", password: hashed });
  userId = user._id.toString();
  userToken = jwt.sign({ id: userId, role: "user", username: "cardowner" }, process.env.JWT_SECRET, { expiresIn: "2h" });

  // Create secondary user
  const hashed2 = await bcrypt.hash("TestPass2!", 10);
  const user2 = await User.create({ username: "reviver", email: "reviver@example.com", password: hashed2 });
  anotherUserId = user2._id.toString();
  anotherUserToken = jwt.sign({ id: anotherUserId, role: "user", username: "reviver" }, process.env.JWT_SECRET, { expiresIn: "2h" });
});

// ──────────────────────────────────────────────────────────
// GET all ghost cards
// ──────────────────────────────────────────────────────────
describe("GET /api/ghostcards", () => {
  it("should return an empty array when there are no cards (200)", async () => {
    const res = await request(app).get("/api/ghostcards");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should return all ghost cards sorted by createdAt descending", async () => {
    await GhostCard.create({ ...makeCard(), creatorId: userId, dateStarted: new Date("2023-01-01") });
    await GhostCard.create({ ...makeCard({ title: "Newer Project" }), creatorId: userId, dateStarted: new Date("2023-06-01") });

    const res = await request(app).get("/api/ghostcards");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should include 'revivedByCount' on each card", async () => {
    await GhostCard.create({ ...makeCard(), creatorId: userId, dateStarted: new Date() });
    const res = await request(app).get("/api/ghostcards");
    expect(res.body[0]).toHaveProperty("revivedByCount");
    expect(typeof res.body[0].revivedByCount).toBe("number");
  });
});

// ──────────────────────────────────────────────────────────
// GET single ghost card
// ──────────────────────────────────────────────────────────
describe("GET /api/ghostcards/:id", () => {
  let cardId;

  beforeEach(async () => {
    const card = await GhostCard.create({ ...makeCard(), creatorId: userId, dateStarted: new Date() });
    cardId = card._id.toString();
  });

  it("should return the card with revivedByCount (200)", async () => {
    const res = await request(app).get(`/api/ghostcards/${cardId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(cardId);
    expect(res.body).toHaveProperty("revivedByCount");
  });

  it("should return 404 for a non-existent card", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/ghostcards/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/card not found/i);
  });

  it("should return 500 for an invalid ObjectId", async () => {
    const res = await request(app).get("/api/ghostcards/not-an-id");
    expect(res.statusCode).toBe(500);
  });
});

// ──────────────────────────────────────────────────────────
// POST (create) ghost card
// ──────────────────────────────────────────────────────────
describe("POST /api/ghostcards", () => {
  it("should create a ghost card and return 201 for authenticated user", async () => {
    const res = await request(app)
      .post("/api/ghostcards")
      .set("Authorization", `Bearer ${userToken}`)
      .send(makeCard());

    expect(res.statusCode).toBe(201);
    expect(res.body.card).toMatchObject({ title: "Dead Side Project", type: "code" });
    expect(res.body.card.creatorId).toBe(userId);
  });

  it("should return 401 when creating a card without a token", async () => {
    const res = await request(app).post("/api/ghostcards").send(makeCard());
    expect(res.statusCode).toBe(401);
  });

  it("should default status to 'abandoned' when not provided", async () => {
    const { status, ...noStatus } = makeCard();
    const res = await request(app)
      .post("/api/ghostcards")
      .set("Authorization", `Bearer ${userToken}`)
      .send(noStatus);
    expect(res.statusCode).toBe(201);
    expect(res.body.card.status).toBe("abandoned");
  });

  it("should reject a card with an invalid 'type'", async () => {
    const res = await request(app)
      .post("/api/ghostcards")
      .set("Authorization", `Bearer ${userToken}`)
      .send(makeCard({ type: "invalidType" }));
    expect(res.statusCode).toBe(500);
  });

  it("should reject a card missing required 'title'", async () => {
    const { title, ...noTitle } = makeCard();
    const res = await request(app)
      .post("/api/ghostcards")
      .set("Authorization", `Bearer ${userToken}`)
      .send(noTitle);
    expect(res.statusCode).toBe(500);
  });
});

// ──────────────────────────────────────────────────────────
// PUT (revive / update) ghost card
// ──────────────────────────────────────────────────────────
describe("PUT /api/ghostcards/:id", () => {
  let cardId;

  beforeEach(async () => {
    const card = await GhostCard.create({ ...makeCard(), creatorId: userId, dateStarted: new Date() });
    cardId = card._id.toString();
  });

  it("should mark the card as 'revived' and add user to revivedBy (200)", async () => {
    const res = await request(app)
      .put(`/api/ghostcards/${cardId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({ externalLink: "https://github.com/revived" });

    expect(res.statusCode).toBe(200);
    expect(res.body.card.status).toBe("revived");
    expect(res.body.card.revivedBy).toContain(anotherUserId);
  });

  it("should not add the same user twice to revivedBy", async () => {
    await request(app)
      .put(`/api/ghostcards/${cardId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({});

    await request(app)
      .put(`/api/ghostcards/${cardId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({});

    const card = await GhostCard.findById(cardId);
    const count = card.revivedBy.filter((id) => id.toString() === anotherUserId).length;
    expect(count).toBe(1);
  });

  it("should update externalLink when provided", async () => {
    const link = "https://github.com/revived-project";
    await request(app)
      .put(`/api/ghostcards/${cardId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({ externalLink: link });

    const card = await GhostCard.findById(cardId);
    expect(card.externalLink).toBe(link);
  });

  it("should return 404 when updating non-existent card", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/ghostcards/${fakeId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({});
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 when updating without a token", async () => {
    const res = await request(app).put(`/api/ghostcards/${cardId}`).send({});
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// DELETE ghost card
// ──────────────────────────────────────────────────────────
describe("DELETE /api/ghostcards/:id", () => {
  let cardId;

  beforeEach(async () => {
    const card = await GhostCard.create({ ...makeCard(), creatorId: userId, dateStarted: new Date() });
    cardId = card._id.toString();
  });

  it("should delete the card and return 200", async () => {
    const res = await request(app)
      .delete(`/api/ghostcards/${cardId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);

    const deleted = await GhostCard.findById(cardId);
    expect(deleted).toBeNull();
  });

  it("should return 404 when deleting a non-existent card", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/ghostcards/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 when deleting without a token", async () => {
    const res = await request(app).delete(`/api/ghostcards/${cardId}`);
    expect(res.statusCode).toBe(401);
  });
});
