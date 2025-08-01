const express = require("express");
const router = express.Router();
const {getuserProfile,getAllUsersWithProjects} = require("../controllers/userController");
const {protect,requireAdmin} = require("../middleware/authmiddleware");

router.get("/:userId",protect,getuserProfile);
//admin:view all users 
router.get("/",protect,requireAdmin,getAllUsersWithProjects);


module.exports = router;