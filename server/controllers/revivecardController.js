
const GhostCard = require("../models/GhostCard"); 
const RevivalLog = require("../models/RevivalLog");
const User = require("../models/User");

// Get all revival logs for notifications page
exports.getAllRevivalLogs = async (req, res) => {
    try {
        const revivals = await RevivalLog.find()
            .populate('userId', 'username')
            .populate('projectId', 'title type creatorId')
            .sort({ revivedAt: -1 });
        res.status(200).json(revivals);
    } catch (error) {
        res.status(500).json({ message: "🔴 Failed to fetch revival logs", error: error.message });
    }
};

// Get revival log by ID for modal details
exports.getRevivalLogById = async (req, res) => {
    try {
        const revival = await RevivalLog.findById(req.params.id)
            .populate('userId', 'username')
            .populate('projectId', 'title description type creatorId');
        if (!revival) return res.status(404).json({ message: "🔴 Revival log not found" });
        res.status(200).json(revival);
    } catch (error) {
        res.status(500).json({ message: "🔴 Failed to fetch revival log", error: error.message });
    }
};

exports.reviveGhostCard = async (req, res) => {
    try {
        const { notes, newProjectLink } = req.body;
        const userId = req.user.id; // get user ID from token via middleware

        const card = await GhostCard.findById(req.params.id).populate('creatorId', 'username');
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
            const reviver = await User.findByIdAndUpdate(userId, { $inc: { revivalCount: 1 } }, { new: true });
            
            // Emit real-time events
            const io = req.app.get('io');
            
            // Notify project creator
            io.to(`user_${card.creatorId._id}`).emit('projectRevived', {
                projectId: card._id,
                projectTitle: card.title,
                reviverName: reviver.username,
                message: `Your project "${card.title}" has been revived by ${reviver.username}!`
            });
            
            // Broadcast leaderboard update
            io.emit('leaderboardUpdate', {
                userId,
                username: reviver.username,
                newRevivalCount: reviver.revivalCount
            });
            
            // Notify admins
            io.to('admin_room').emit('adminNotification', {
                type: 'revival',
                message: `${reviver.username} revived "${card.title}"`
            });
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
