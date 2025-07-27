const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//login 
exports.signup = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        //check if Email exists
        const EmailExists = await User.findOne({email});
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
        const user = await User.findOne({email});

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