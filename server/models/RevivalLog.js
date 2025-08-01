const mongoose = require("mongoose");

const revivalLogSchema = new mongoose.Schema({
    projectId : {type: mongoose.Schema.Types.ObjectId, ref:'GhostCard', required: true},//the dead project id

    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // the one who review the project id,
    notes: {type:String},//note explaining how you will revive or how you revived the project
    newProjectLink :{type:String},//new link of your updated version 

    revivedAt : {type: Date, default: Date.now},

});
module.exports = mongoose.model("RevivalLog",revivalLogSchema);