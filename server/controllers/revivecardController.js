const RevivalLog = require("../models/RevivalLog");
const User = require("../models/User");

exports.reviveGhostCard = async (req,res) => {
    const {userId } = req.body;

    try{
        const card = await GhostCard.findById(req.params.id);
        if (!card) return res.status(404).json({message: "🔴 Card not found"});

        card.status = revived;

        //add to revived by
        if (!card.revivedBy.includes(userId)){
            card.revivedBy.push(userId);
        }
        await card.save();

        //Log the revival
        await RevivalLog.create({
            projectId: card._id,
            userId: userId
        });

        await User.findByIdAndUpdate(userId,{$inc: {revivalCount:1}});
        res.status(200).json({message: "🟢 Project revived successfully",card});
    } catch (error){
        res.status(500).json({message: "🔴Revival failed",error: error.message});
    }
};