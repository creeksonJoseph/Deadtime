const mongoose = require("mongoose");

const ghostnoteSchema = new mongoose.Schema({
    projectId : {type: mongoose.Schema.Types.ObjectId , ref:'GhostCard'} ,
    note : {type: String, required:true},
    isAnonymous: {type:Boolean, default:false},
},{timestamps:true});

module.exports = mongoose.model("Ghostnote",ghostnoteSchema);