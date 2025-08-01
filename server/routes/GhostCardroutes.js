const express = require("express");
const router = express.Router();
const {getAllGhostCards,
       getGhostCardById,
       postGhostCard,
       deleteGhostCard,
       updateGhostCard
} = require("../controllers/GhostcardContoller");
const {protect} = require("../middleware/authmiddleware");

router.get("/",getAllGhostCards);
router.get("/:id",getGhostCardById);
router.post("/",protect,postGhostCard);
router.put("/:id",protect,updateGhostCard);
router.delete("/:id",protect,deleteGhostCard)

module.exports = router;