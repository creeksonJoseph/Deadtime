const express = require("express");
const router = express.Router();
const {reviveGhostCard} = require("../controllers/revivecardController");
const {protect} = require("../middleware/authmiddleware");

router.put("/:id",protect,reviveGhostCard);

module.exports = router;

