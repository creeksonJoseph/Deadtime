const bcrypt = require("bcrypt");
const User = require("../models/User");
const GhostCard = require("../models/GhostCard");
const Ghostnote = require("../models/Ghostnote");
const RevivalLog = require("../models/RevivalLog");

exports.seedDatabase = async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await GhostCard.deleteMany({});
    await Ghostnote.deleteMany({});
    await RevivalLog.deleteMany({});

    // Create users
    const password = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      {username:"alice_dev",email:"alice@example.com",password,role:"user",revivalCount:2},
      {username:"brian_admin",email:"brian@example.com",password,role:"admin",revivalCount:5},
      {username:"chris_builder",email:"chris@example.com",password,role:"user",revivalCount:1},
      {username:"diana_maker",email:"diana@example.com",password,role:"user",revivalCount:0},
      {username:"emily_revivist",email:"emily@example.com",password,role:"user",revivalCount:3},
      {username:"alexdev",email:"alex@example.com",password,role:"user",revivalCount:2,profilepic:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"},
      {username:"sarahcode",email:"sarah@example.com",password,role:"user",revivalCount:3,profilepic:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"},
      {username:"mikejs",email:"mike@example.com",password,role:"user",revivalCount:1,profilepic:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"},
      {username:"emmatech",email:"emma@example.com",password,role:"user",revivalCount:4,profilepic:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"},
      {username:"davidweb",email:"david@example.com",password,role:"user",revivalCount:0,profilepic:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"},
      {username:"lisaui",email:"lisa@example.com",password,role:"user",revivalCount:2,profilepic:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"},
      {username:"tomfull",email:"tom@example.com",password,role:"user",revivalCount:5,profilepic:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"},
      {username:"annapy",email:"anna@example.com",password,role:"user",revivalCount:1,profilepic:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"},
      {username:"jakenode",email:"jake@example.com",password,role:"user",revivalCount:3,profilepic:"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"},
    ]);

    // Create projects
    const cards = await GhostCard.insertMany([
      {creatorId:users[0]._id,title:"E-commerce Platform",description:"Full-stack online store with payment integration",type:"code",logoUrl:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-01-15")},
      {creatorId:users[1]._id,title:"Task Management App",description:"Productivity app with team collaboration features",type:"code",logoUrl:"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[6]._id],dateStarted:new Date("2023-02-10")},
      {creatorId:users[2]._id,title:"Weather Dashboard",description:"Real-time weather data visualization",type:"code",logoUrl:"https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-03-05")},
      {creatorId:users[3]._id,title:"Chat Application",description:"Real-time messaging with WebSocket",type:"code",logoUrl:"https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[7]._id],dateStarted:new Date("2023-01-20")},
      {creatorId:users[4]._id,title:"Portfolio Website",description:"Personal portfolio with animations",type:"code",logoUrl:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-04-01")},
      {creatorId:users[5]._id,title:"Recipe Finder",description:"Search and save favorite recipes",type:"code",logoUrl:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[0]._id],dateStarted:new Date("2023-02-28")},
      {creatorId:users[6]._id,title:"Expense Tracker",description:"Personal finance management tool",type:"code",logoUrl:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-03-15")},
      {creatorId:users[7]._id,title:"Music Player",description:"Streaming music player with playlists",type:"code",logoUrl:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[1]._id],dateStarted:new Date("2023-01-10")},
      {creatorId:users[8]._id,title:"Blog Platform",description:"Content management system for bloggers",type:"content",logoUrl:"https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-04-10")},
      {creatorId:users[9]._id,title:"Fitness Tracker",description:"Workout logging and progress tracking",type:"code",logoUrl:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[3]._id],dateStarted:new Date("2023-02-15")},
      {creatorId:users[10]._id,title:"Social Media Dashboard",description:"Analytics for multiple social platforms",type:"business",logoUrl:"https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-03-20")},
      {creatorId:users[11]._id,title:"Learning Management System",description:"Online course platform with video streaming",type:"code",logoUrl:"https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[4]._id],dateStarted:new Date("2023-01-25")},
      {creatorId:users[12]._id,title:"Inventory Management",description:"Stock tracking for small businesses",type:"business",logoUrl:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-04-05")},
      {creatorId:users[13]._id,title:"Event Booking System",description:"Ticket booking and event management",type:"business",logoUrl:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[8]._id],dateStarted:new Date("2023-02-20")},
      {creatorId:users[5]._id,title:"Photo Gallery",description:"Image sharing with filters and effects",type:"code",logoUrl:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-03-25")},
      {creatorId:users[6]._id,title:"Code Editor",description:"Lightweight IDE with syntax highlighting",type:"code",logoUrl:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[2]._id],dateStarted:new Date("2023-01-30")},
      {creatorId:users[7]._id,title:"Travel Planner",description:"Trip planning with budget tracking",type:"code",logoUrl:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-04-15")},
      {creatorId:users[8]._id,title:"CRM System",description:"Customer relationship management tool",type:"business",logoUrl:"https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[5]._id],dateStarted:new Date("2023-02-25")},
      {creatorId:users[9]._id,title:"Game Engine",description:"2D game development framework",type:"code",logoUrl:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",status:"abandoned",dateStarted:new Date("2023-03-30")},
      {creatorId:users[10]._id,title:"API Gateway",description:"Microservices routing and authentication",type:"code",logoUrl:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",status:"revived",revivedBy:[users[6]._id],dateStarted:new Date("2023-02-05")}
    ]);

    res.status(200).json({
      message: "✅ Database seeded successfully!",
      users: users.length,
      projects: cards.length
    });
  } catch (error) {
    res.status(500).json({
      message: "🔴 Failed to seed database",
      error: error.message
    });
  }
};