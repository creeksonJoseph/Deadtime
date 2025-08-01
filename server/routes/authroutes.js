const express = require("express");
const router = express.Router();
const {signup,login,githubLogin,githubRedirect} = require("../controllers/authController");

router.post("/signup",signup);
router.post("/login",login);
//github entry point
router.get("/github",githubRedirect);

router.get("/github/callback", githubLogin);
module.exports = router;