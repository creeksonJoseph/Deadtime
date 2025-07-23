require('dotenv').config();
const express = require("express");
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