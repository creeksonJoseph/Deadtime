const express = require("express");
const router = express.Router();
const {signup,login,githubLogin,githubRedirect,googleLogin,googleRedirect} = require("../controllers/authController");

router.post("/signup",signup);
router.post("/login",login);
//github entry point
router.get("/github",githubRedirect);
router.get("/github/callback", githubLogin);
//google entry point
router.get("/google",googleRedirect);
router.get("/google/callback", googleLogin);
module.exports = router;