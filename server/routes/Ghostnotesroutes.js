const express = require("express");
const router = express.Router();
const {createGhostnotes,
       getNotesForProject,
       deleteNote,
} = require("../controllers/GhostnotesController");
const {protect} = require("../middleware/authmiddleware");

router.get("/project/:projectId",getNotesForProject);
router.post("/",protect,createGhostnotes);
router.delete("/:id",protect,deleteNote);

module.exports = router;