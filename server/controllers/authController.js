const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const axios = require("axios");

// Admin helpers: configure admin emails via env (comma-separated)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "charanajoseph@gmail.com,deosiatah0@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(String(email).toLowerCase());
}

async function ensureAdminRole(user) {
  if (!user) return user;
  if (isAdminEmail(user.email) && user.role !== "admin") {
    user.role = "admin";
    await user.save();
  }
  return user;
}

//signup

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //check if Email exists
    const EmailExists = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (EmailExists)
      return res.status(400).json({ message: "Email already exists" });

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({ username, email, password: hashedPassword });

    // Promote to admin if email is in whitelist
    user = await ensureAdminRole(user);

    // assign token on login
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "Signup successful ✅",
    });
  } catch (error) {
    res.status(500).json({ message: "🔴 Signup failed", error: error.message });
  }
};

//login logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user) return res.status(404).json({ message: "🔴 User Not Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "🔴 Incorrect password" });

    // Promote to admin if email is in whitelist
    user = await ensureAdminRole(user);

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "🔴 Login Failed", error: error.message });
  }
};

//login with GitHub logic
exports.githubLogin = async (req,res) => {
    const {code} = req.query;

    if (!code) return res.status(400).json({message:"🔴No Github code provided"});
    try{
        //exchange code for access token 
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {accept: "application/json"},
            }
        );
        const accessToken = tokenResponse.data.access_token;
        if (!accessToken){
            return res.status(401).json({message: "No access token from GitHUb "});
        }
        console.log("GitHub token response:",tokenResponse.data);
        //use access token to get user profile
        const userResponse = await axios.get("https://api.github.com/user",{
            headers:{
                Authorization: `token ${accessToken}`,
            },
        });

        let {login:username,email,id:githubId,avatar_url} = userResponse.data;
        
        // If email is private, fetch from emails endpoint
        if (!email) {
            try {
                const emailResponse = await axios.get("https://api.github.com/user/emails", {
                    headers: { Authorization: `token ${accessToken}` }
                });
                const primaryEmail = emailResponse.data.find(e => e.primary);
                email = primaryEmail ? primaryEmail.email : `${githubId}@github.user`;
            } catch (err) {
                email = `${githubId}@github.user`;
            }
        }
        
        const userEmail = email;
        //check if user already exists or creaate new
        let user = await User.findOne({email: userEmail});

        if (!user) {
            user = await User.create({
                username,
                email:userEmail,
                password: "github-oauth", //dummy placeholder
                profilepic: avatar_url || "",
            });
        } else {
            // Update existing user's profile picture if available
            if (avatar_url && user.profilepic !== avatar_url) {
                user.profilepic = avatar_url;
                await user.save();
            }
        }
        
        // Promote to admin if email is in whitelist
        user = await ensureAdminRole(user);

        //generate JWT
        const token = jwt.sign(
            {id: user._id, role:user.role || "user",username:user.username},
            process.env.JWT_SECRET,
            {expiresIn: "2h"}
        );

        //redirect to frontend with token
        const frontendURL = "https://deadtime2.vercel.app";
        res.redirect(`${frontendURL}/oauth-success?token=${token}&username=${user.username}`);
    } catch (error){
        console.error("GitHub OAuth Error:", error);
        res.status(500).json({message: "🔴 GitHub OAuth failed", error: error.message});
    }
}

exports.githubRedirect = (req, res) => {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const redirect = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user:email`;
  res.redirect(redirect);
};

// Google OAuth login
exports.googleLogin = async (req, res) => {
  const { code } = req.query;
  
  if (!code) return res.status(400).json({ message: "🔴 No Google code provided" });
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.SERVER_URL || 'https://deadtime.onrender.com'}/api/auth/google/callback`
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(401).json({ message: "🔴 No access token from Google" });
    }
    
    // Get user profile
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );
    
    const { email, name, picture, id: googleId } = userResponse.data;
    
    // Check if user exists or create new
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        username: name || `user_${googleId}`,
        email,
        password: "google-oauth", // placeholder
        profilepic: picture || ""
      });
    } else {
      // Update profile picture if available
      if (picture && user.profilepic !== picture) {
        user.profilepic = picture;
        await user.save();
      }
    }
    
    // Promote to admin if email is in whitelist
    user = await ensureAdminRole(user);
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role || "user", username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    
    // Redirect to frontend with token
    const frontendURL = "https://deadtime2.vercel.app";
    res.redirect(`${frontendURL}/oauth-success?token=${token}&username=${user.username}`);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ message: "🔴 Google OAuth failed", error: error.message });
  }
};

exports.googleRedirect = (req, res) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.SERVER_URL || 'https://deadtime.onrender.com'}/api/auth/google/callback`;
  const scope = "openid email profile";
  const redirect = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  res.redirect(redirect);
};


