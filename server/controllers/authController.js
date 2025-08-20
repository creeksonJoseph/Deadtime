const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const axios = require("axios");


//signup

exports.signup = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        //check if Email exists
        const EmailExists = await User.findOne({email: { $regex: new RegExp(`^${email}$`, 'i') }});
        if (EmailExists) return res.status(400).json({message: "Email already exists"});
        
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({username,email,password:hashedPassword});

        // assign token on login
        const token = jwt.sign({id:user._id,role:user.role,username: user.username},process.env.JWT_SECRET,{
            expiresIn:'2h'
        });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            message: "Signup successful ✅"
        });
    } catch (error){
        res.status(500).json({message: "🔴 Signup failed",error:error.message})
    }
};

//login logic 
exports.login  = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email: { $regex: new RegExp(`^${email}$`, 'i') }});

        if (!user) return res.status(404).json({message: "🔴 User Not Found"});

        const match = await bcrypt.compare(password,user.password);
        if (!match) return res.status(401).json({message: "🔴 Incorrect password"});

        const token = jwt.sign({id:user._id,role:user.role,username: user.username},process.env.JWT_SECRET,{
            expiresIn:'2h'
        });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({message: "🔴 Login Failed",error: error.message})
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
        //use acess token to get user user profile
        const userResponse = await axios.get("https://api.github.com/user",{
            headers:{
                Authorization: `token ${accessToken}`,
            },
        });

        const {login:username,email,id:githubId} = userResponse.data;
        //if email is null use a fallback 
        const userEmail = email || `${githubId}@github.user`;
        //check if user already exists or creaate new
        let user = await User.findOne({email: { $regex: new RegExp(`^${userEmail}$`, 'i') }});

        if (!user) {
            user = await User.create({
                username,
                email:userEmail,
                password: "github-oauth", //dummy placeholder
            });
        }

        //generate JWT
        const token = jwt.sign(
            {id: user._id, role:user.role || "user",username:user.username},
            process.env.JWT_SECRET,
            {expiresIn: "2h"}
        );

        //redirect to frontend with token
        // res.redirect(`http://localhost:5173/oauth-success?token=${token}&username=${user.username}`);
        res.json({
            message: "🟢 GitHub login successful",
            token,
            username: user.username,
        });
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

