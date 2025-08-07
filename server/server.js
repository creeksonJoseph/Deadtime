require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 5000;

//starting express app
const app = express();

//connecting to virtual mongodb atlas using mongoose 
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 MONGODB connected successfully")
    } catch (error){
        console.log("🔴 Erro connecting MongoDB",error);
    }
};
connectDB();


//middleware to parse json data and cors
app.use(express.json());
app.use(cors());


//root routes 
app.use("/api/auth",require("./routes/authroutes"));
app.use("/api/ghostcards",require("./routes/GhostCardroutes"));
app.use("/api/ghostnotes",require("./routes/Ghostnotesroutes"));
app.use("/api/revive",require("./routes/revivalcardroutes"));
app.use("/api/users",require("./routes/userroutes"));
app.use("/api/leaderboard",require("./routes/leaderboardroute"));
app.get("/",(req,res) => {
  res.send("💀 Welcome to DeadTime API");
})
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

//starting server 
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});