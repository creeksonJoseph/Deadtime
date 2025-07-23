const GhostCard = require('../models/GhostCard');

//to get all ghostcards(all projects)
exports.getAllGhostCards = async (req,res) => {
    try{
          const cards = await GhostCard.find().sort({createdAt : -1});
          res.status(200).json(cards)
    } catch (error){
        res.status(500).json({message :"🔴 Failed to fetch ghostCards ",error: error.message});
    }
}

//get ghostcardbyId 
exports.getGhostCardById = async (req,res) => {
    try{
        const card = await GhostCard.findById(req.params.id);
        if (!card) return res.status(404).json({message: "🔴 Card not Found"}).
        res.status(200).json(card);
    }  catch (error) {
        res.status(500).json({message:"🔴 Failed to fetch Card",error: error.message});
    }
}

//CREATE a new ghost card
exports.postGhostCard = async (req,res) => {
    try{
        const {title,description,logoUrl,status,tags,creatorId} = req.body;
        const card = await GhostCard.create({
            title,
            description,
            logoUrl,
            status,
            tags,
            creatorId
        });
        res.status(201).json({message: "🟢 Card created successfully",card});
    } catch (error){
        res.status(500).json({message: "🔴 GhostCard not created",error: error.message});
    }
}


//delete Card
exports.deleteGhostCard = async (req,res) => {
    try{
        const card = await GhostCard.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).json({message: "🔴 Card not found"})

        res.status(200).json({message: "🟢 Card deleted successfully",card});
    } catch (error){
        res.status(500).json({message: "🔴 Failed to delete Card",error:error.message});
    }
};