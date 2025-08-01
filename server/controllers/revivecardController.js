
const GhostCard = require("../models/GhostCard"); 
const RevivalLog = require("../models/RevivalLog");
const User = require("../models/User");

exports.reviveGhostCard = async (req, res) => {
    try {
        const { notes, newProjectLink } = req.body;
        const userId = req.user.id; // get user ID from token via middleware

        const card = await GhostCard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: "🔴 Card not found" });

        // Only update if not already revived by this user
        if (!card.revivedBy.includes(userId)) {
            card.revivedBy.push(userId);
            card.status = "revived";
            await card.save();

            // Log the revival
            await RevivalLog.create({
                projectId: card._id,
                userId: userId,
                notes,
                newProjectLink,
            });

            // Increment user's revival count
            await User.findByIdAndUpdate(userId, { $inc: { revivalCount: 1 } });
        }

        res.status(200).json({
            message: "🟢 Project revived successfully",
            card,
        });
    } catch (error) {
        res.status(500).json({
            message: "🔴 Revival failed",
            error: error.message,
        });
    }
};
