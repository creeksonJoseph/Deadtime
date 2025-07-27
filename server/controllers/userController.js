const GhostCard = require("../models/GhostCard");
const User = require("../models/User");

exports.getuserProfile = async (req,res) => {
    const userId = req.params.userId;

    try{
        //fetch basic user info 
        const user = await User.findById(userId).select("username email revivalCount");
        if (!user) return res.status(404).json({message: "🔴 User Not Found"});

        //get ghost cards the user has submitted
        const postedProjects = await GhostCard.find({creatorId: userId}).sort({createdAt: -1});

        //get ghosts the user has revived 
        const revivedProjects = await GhostCard.find({revivedBy: userId}).sort({updatedAt: -1});

        res.status(200).json({
            user,
            postedProjects,
            revivedProjects
        });
    } catch (error) {
        res.status(500).json({message: "🔴 Failed to load user profile",error:error.message});
    }
};

exports.getLeaderboard = async (req,res) => {
    try{
        const topUsers = await User.find()
            .sort({revivalCount: -1})
            .limit(10)
            .select("username revivalCount")
        
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({message: "🔴 Failed to get Leaderboard"})
    }
};