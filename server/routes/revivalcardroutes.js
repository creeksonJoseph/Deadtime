const express = require("express");
const router = express.Router();
const {reviveGhostCard, getAllRevivalLogs, getRevivalLogById} = require("../controllers/revivecardController");
const {protect} = require("../middleware/authmiddleware");

router.get("/logs", protect, getAllRevivalLogs);
router.get("/logs/:id", protect, getRevivalLogById);
router.put("/:id",protect,reviveGhostCard);

module.exports = router;

