require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const PORT = 5000;

//starting express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

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
app.use("/api/seed",require("./routes/seedroutes"));
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

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User ${socket.userId} connected`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Join admin users to admin room
  if (socket.userRole === 'admin') {
    socket.join('admin_room');
  }
  
  socket.on('disconnect', () => {
    console.log(`🔌 User ${socket.userId} disconnected`);
  });
});

// Make io available to routes
app.set('io', io);

//starting server 
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});