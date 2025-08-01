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


        //get ghostscards the user has revived 

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

exports.getAllUsersWithProjects = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().select("username email revivalCount createdAt");

    // For each user, fetch posted and revived projects
    const result = await Promise.all(
      users.map(async (user) => {
        const postedProjects = await GhostCard.find({ creatorId: user._id })
          .select("title status type createdAt updatedAt");

        const revivedProjects = await GhostCard.find({ revivedBy: user._id })
          .select("title status type createdAt updatedAt");

        return {
          user,
          postedProjects,
          revivedProjects
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "🔴 Failed to fetch users and their projects",
      error: error.message
    });
  }
};

