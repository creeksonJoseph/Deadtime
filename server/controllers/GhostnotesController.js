const Ghostnotes = require("../models/Ghostnote");
const GhostCard = require("../models/GhostCard");


exports.createGhostnotes = async (req,res) => {
    try{
        const {projectId,note,isAnonymous} =req.body;

        //verify if project exists
        const project = await GhostCard.findById(projectId);
        if (!project){
            return res.status(404).json({message: "🔴 Project Not Found"})
        }

        const ghostnote = await Ghostnotes.create({
            projectId,
            note,
            isAnonymous
        });
        res.status(201).json({message: "🟢 Note posted",ghostnote});
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