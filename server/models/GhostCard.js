// contains the schema for the card containing the picture and brief description.
const mongoose = require("mongoose");

const ghostcardSchema = new mongoose.Schema({
    creatorId: {type: mongoose.Schema.Types.ObjectId,ref: "User", required: true},
    title: {type:String,required: true},
    description : {type:String,required: true},
    logoUrl : {type:String},
    status: {type:String, enum: ["abandoned","on-hold","revived"], default: "abandoned"},
    tags: [{type:String}],
    revivedBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
},{timestamps:true});

module.exports = mongoose.model("GhostCard",ghostcardSchema);