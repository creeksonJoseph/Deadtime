const User = require("../models/User");

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