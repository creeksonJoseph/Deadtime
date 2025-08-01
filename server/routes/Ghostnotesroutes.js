const express = require("express");
const router = express.Router();
const {createGhostnotes,
       getNotesForProject,
       deleteNote,
} = require("../controllers/GhostnotesController");
const {protect,requireAdmin} = require("../middleware/authmiddleware");

router.get("/project/:projectId",protect,requireAdmin,getNotesForProject);
router.post("/",protect,createGhostnotes);
router.delete("/:id",protect,deleteNote);

module.exports = router;