const express = require("express");
const router = express.Router();
const {getuserProfile,updateuserprofile,getAllUsersWithProjects,deleteUser,admindeletedProject} = require("../controllers/userController");
const {protect,requireAdmin} = require("../middleware/authmiddleware");

router.get("/:userId",protect,getuserProfile); //get a user
router.put("/:userId",protect,updateuserprofile); //update user profile
//admin:view all users 
router.get("/",protect,requireAdmin,getAllUsersWithProjects);
//sdmin:delete a user (and their projects)
router.delete("/users/:userId",protect,requireAdmin,deleteUser);
router.delete("/projects/:id",protect,requireAdmin,admindeletedProject);


module.exports = router;