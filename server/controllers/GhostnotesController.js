const Ghostnotes = require("../models/Ghostnote");
const GhostCard = require("../models/GhostCard");


exports.createGhostnotes = async (req,res) => {
    try{
        const {projectId,note,isAnonymous} =req.body;

        //verify if project exists
        const project = await GhostCard.findById(projectId).populate('creatorId', 'username');
        if (!project){
            return res.status(404).json({message: "🔴 Project Not Found"})
        }

        const ghostnote = await Ghostnotes.create({
            userId: req.user.id,
            projectId,
            note,
            isAnonymous
        });
        
        const populatedNote = await Ghostnotes.findById(ghostnote._id).populate('userId', 'username');
        
        // Emit real-time events
        const io = req.app.get('io');
        if (io) {
            // Notify project creator about new comment
            if (project.creatorId._id.toString() !== req.user.id) {
                io.to(`user_${project.creatorId._id}`).emit('newComment', {
                    projectId,
                    projectTitle: project.title,
                    commenterName: isAnonymous ? 'Anonymous' : populatedNote.userId.username,
                    comment: note,
                    message: `New comment on your project "${project.title}"`
                });
            }
            
            // Broadcast new comment to all users viewing this project
            io.emit('commentAdded', {
                projectId,
                comment: populatedNote
            });
        }
        
        res.status(201).json({message: "🟢 Note posted",ghostnote: populatedNote});
    } catch (error){
        res.status(500).json({message: "🔴 Note failed to post",error:error.message});
    }
};

//get all notes for the project(ghostcard)

exports.getNotesForProject = async (req,res) => {

    try{
        const {projectId} = req.params;
        const notes = await Ghostnotes.find({projectId}).sort({createdAt: -1}).populate('userId','username');
        res.status(200).json(notes);
    } catch (error){
        res.status(500).json({message: "🔴 Failed to fetch notes",error:error.message});
    }
};

//deleteNote
exports.deleteNote = async (req,res) => {
    try {
        const note = await Ghostnotes.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({message: "🔴Not not Found"});
        }
        res.status(200).json({message: "🟢 Note deleted!"})
    } catch (error) {
        res.status(500).json({message: "🔴 Failed to delete note",error:error.message});
    }
};