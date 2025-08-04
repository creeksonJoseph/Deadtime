const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const GhostCard = require("./models/GhostCard");
const Ghostnote = require("./models/Ghostnote");
const RevivalLog = require("./models/RevivalLog");

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await GhostCard.deleteMany();
    await Ghostnote.deleteMany();
    await RevivalLog.deleteMany();

    //Users 
    const password = await bcrypt.hash("password123",10);
    const users = await User.insertMany([
        {username:"alice_dev",email:"alice@example.com",password,role:"user",revivalCount:2},
        {username:"brian_admin",email:"brian@example.com",password,role:"admin",revivalCount:5},
        {username:"chris_builder",email:"chris@example.com",password,role:"user",revivalCount:1},
        {username:"diana_maker",email:"diana@example.com",password,role:"user",revivalCount:0},
        {username:"emily_revivist",email:"emily@example.com",password,role:"user",revivalCount:3},
    ])

    //Ghost Cards
    const cards = await GhostCard.insertMany([
        {
            creatorId:users[0]._id,
            title:"Abandoned React Native App",
            description: "A half-done mobile app for groceries",
            status:"revived",
            type:"code",
            abandonmentReason:"Lost interest",
            dateStarted: new Date("2023-01-10"),
            dateAbandoned: new Date("2023-05-10"),
            revivedBy:[users[2]._id]
        },
        {
            creatorId:users[1]._id,
            title:"Stalled Podcast Series",
            logoUrl:"",
            description: "Had 3 episodes and stopped",
            status:"revived",
            type:"content",
            externalLink:"https://spotify.com/example",
            abandonmentReason:"Time constraints",
            dateStarted: new Date("2022-06-01"),
            dateAbandoned: new Date("2022-09-01"),
            revivedBy:[users[4]._id]
        },
        {
            creatorId:users[2]._id,
            title:"Dead E-commerce Idea",
            description: "Drop shipping platform halted",
            status:"abandoned",
            type:"business",
            abandonmentReason:"Too much competition",
            dateStarted: new Date("2022-03-15"),
            dateAbandoned: new Date("2023-05-10"),
        },
    ]);
        
        //GhostNotes
        await Ghostnote.insertMany([
            {projectId: cards[0]._id, note:"You could try Expo SDK to simplify mobile setup",isAnonymous:true},
            {projectId: cards[1]._id, note:"Maybe go solo on the podcast next time",isAnonymous:false},
            {projectId: cards[2]._id, note:"Use TikTok influencers to revive interest",isAnonymous:true}
        ]);

        //Recival Logs
        await RevivalLog.insertMany([
            {
                projectId: cards[1]._id,
                userId:users[4]._id,
                notes:"Rebranded the podcast and added five new episodes",
                newProjectLink:"https://spotify.com/newbrand",
                revivedAt:new Date()
            },
            {
                projectId: cards[0]._id,
                userId:users[2]._id,
                notes:"Migrated project to Expo Go",
                revivedAt:new Date()
            },
            {
                projectId: cards[2]._id,
                userId:users[0]._id,
                notes:"coming up with a better pitch and niche market",
                newProjectLink:"https://newshop.example.com",
                revivedAt:new Date()
            },

        ]);

        console.log("✅ Database seeded!");
        process.exit();
};
seed();