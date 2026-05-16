/**
 * Ghostnotes & Revival Logs Controller Tests
 * Covers: createGhostnotes, getNotesForProject, deleteNote,
 *         reviveGhostCard (with revivalCount increment & log creation),
 *         getAllRevivalLogs, getRevivalLogById
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
require("./setup");

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const ghostnotesRoutes = require("../routes/Ghostnotesroutes");
const reviveRoutes = require("../routes/revivalcardroutes");

const User = require("../models/User");
const GhostCard = require("../models/GhostCard");
const Ghostnote = require("../models/Ghostnote");
const RevivalLog = require("../models/RevivalLog");

const app = express();
app.use(express.json());
app.use("/api/ghostnotes", ghostnotesRoutes);
app.use("/api/revive", reviveRoutes);

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
const makeToken = (user, role = "user") =>
  jwt.sign({ id: user._id.toString(), role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

let userA, userB, tokenA, tokenB, cardId;

beforeEach(async () => {
  const hashed = await bcrypt.hash("pass", 10);
  userA = await User.create({ username: "noter", email: "noter@example.com", password: hashed });
  userB = await User.create({ username: "reviver2", email: "reviver2@example.com", password: hashed });
  tokenA = makeToken(userA);
  tokenB = makeToken(userB);

  const card = await GhostCard.create({
    creatorId: userA._id,
    title: "Ghost Project",
    description: "Haunted",
    type: "code",
    dateStarted: new Date(),
  });
  cardId = card._id.toString();
});

// ──────────────────────────────────────────────────────────
// GHOSTNOTES
// ──────────────────────────────────────────────────────────
describe("POST /api/ghostnotes", () => {
  it("should create a note for an existing project (201)", async () => {
    const res = await request(app)
      .post("/api/ghostnotes")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ projectId: cardId, note: "This is a ghost note", isAnonymous: false });

    expect(res.statusCode).toBe(201);
    expect(res.body.ghostnote.note).toBe("This is a ghost note");
    expect(res.body.ghostnote.projectId).toBe(cardId);
  });

  it("should allow anonymous notes", async () => {
    const res = await request(app)
      .post("/api/ghostnotes")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ projectId: cardId, note: "Anonymous ghost note", isAnonymous: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.ghostnote.isAnonymous).toBe(true);
  });

  it("should return 404 when project does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post("/api/ghostnotes")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ projectId: fakeId, note: "Orphan note" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/project not found/i);
  });

  it("should return 401 without a token", async () => {
    const res = await request(app)
      .post("/api/ghostnotes")
      .send({ projectId: cardId, note: "Unauthorized note" });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/ghostnotes/project/:projectId", () => {
  beforeEach(async () => {
    await Ghostnote.create({ userId: userA._id, projectId: cardId, note: "Note 1" });
    await Ghostnote.create({ userId: userB._id, projectId: cardId, note: "Note 2", isAnonymous: true });
  });

  it("should return all notes for a project (200)", async () => {
    const res = await request(app)
      .get(`/api/ghostnotes/project/${cardId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("should populate userId with username", async () => {
    const res = await request(app)
      .get(`/api/ghostnotes/project/${cardId}`);

    const hasUsername = res.body.some((note) => note.userId?.username);
    expect(hasUsername).toBe(true);
  });

  it("should return notes sorted newest first", async () => {
    const res = await request(app)
      .get(`/api/ghostnotes/project/${cardId}`);

    const timestamps = res.body.map((n) => new Date(n.createdAt).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i - 1]).toBeGreaterThanOrEqual(timestamps[i]);
    }
  });
});

describe("DELETE /api/ghostnotes/:id", () => {
  let noteId;

  beforeEach(async () => {
    const note = await Ghostnote.create({ userId: userA._id, projectId: cardId, note: "To delete" });
    noteId = note._id.toString();
  });

  it("should delete an existing note (200)", async () => {
    const res = await request(app)
      .delete(`/api/ghostnotes/${noteId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
    const deleted = await Ghostnote.findById(noteId);
    expect(deleted).toBeNull();
  });

  it("should return 404 for a non-existent note", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/ghostnotes/${fakeId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 without a token", async () => {
    const res = await request(app).delete(`/api/ghostnotes/${noteId}`);
    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────
// REVIVAL LOGS / REVIVE GHOST CARD
// ──────────────────────────────────────────────────────────
describe("PUT /api/revive/:id (revive a ghost card)", () => {
  it("should revive a card, create a RevivalLog, and increment user revivalCount (200)", async () => {
    const res = await request(app)
      .put(`/api/revive/${cardId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ notes: "I will bring it back!", newProjectLink: "https://newproject.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/revived successfully/i);

    // Card status should be 'revived'
    const card = await GhostCard.findById(cardId);
    expect(card.status).toBe("revived");
    expect(card.revivedBy.map((id) => id.toString())).toContain(userB._id.toString());

    // A RevivalLog should exist
    const log = await RevivalLog.findOne({ projectId: cardId, userId: userB._id });
    expect(log).not.toBeNull();
    expect(log.notes).toBe("I will bring it back!");

    // userB's revivalCount should be incremented
    const updatedUserB = await User.findById(userB._id);
    expect(updatedUserB.revivalCount).toBe(1);
  });

  it("should NOT create a duplicate RevivalLog for the same user", async () => {
    await request(app)
      .put(`/api/revive/${cardId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ notes: "First revival" });

    await request(app)
      .put(`/api/revive/${cardId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ notes: "Duplicate revival" });

    // revivedBy should only contain userB once
    const card = await GhostCard.findById(cardId);
    const countB = card.revivedBy.filter((id) => id.toString() === userB._id.toString()).length;
    expect(countB).toBe(1);

    // Only one revival log for this user + card
    const logs = await RevivalLog.find({ projectId: cardId, userId: userB._id });
    expect(logs.length).toBe(1);
  });

  it("should return 404 for a non-existent card", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/revive/${fakeId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ notes: "Ghost note" });
    expect(res.statusCode).toBe(404);
  });

  it("should return 401 without a token", async () => {
    const res = await request(app).put(`/api/revive/${cardId}`).send({ notes: "Anon revival" });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/revive/logs (get all revival logs)", () => {
  beforeEach(async () => {
    await RevivalLog.create({ projectId: cardId, userId: userB._id, notes: "Log 1" });
  });

  it("should return all revival logs (200)", async () => {
    const res = await request(app)
      .get("/api/revive/logs")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should populate userId with username", async () => {
    const res = await request(app)
      .get("/api/revive/logs")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.body[0].userId).toHaveProperty("username");
  });

  it("should populate projectId with title and type", async () => {
    const res = await request(app)
      .get("/api/revive/logs")
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.body[0].projectId).toHaveProperty("title");
    expect(res.body[0].projectId).toHaveProperty("type");
  });
});

describe("GET /api/revive/logs/:id (get revival log by ID)", () => {
  let logId;

  beforeEach(async () => {
    const log = await RevivalLog.create({ projectId: cardId, userId: userB._id, notes: "Specific log" });
    logId = log._id.toString();
  });

  it("should return a specific revival log (200)", async () => {
    const res = await request(app)
      .get(`/api/revive/logs/${logId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toBe("Specific log");
  });

  it("should return 404 for a non-existent log", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/revive/logs/${fakeId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(404);
  });
});
