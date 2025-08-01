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
        if (!card) return res.status(404).json({message: "🔴 Card not Found"});
        res.status(200).json(card);
    }  catch (error) {
        res.status(500).json({message:"🔴 Failed to fetch Card",error: error.message});
    }
}

//CREATE a new ghost card
exports.postGhostCard = async (req,res) => {
    try{
        const {title,description,logoUrl,status,type,externalLink,abandonmentReason,dateStarted,dateAbandoned,pitchDeckUrl} = req.body;
        const card = await GhostCard.create({
            creatorId:req.user.id,
            title,
            description,
            logoUrl,
            status,
            type,
            externalLink,
            abandonmentReason,
            dateStarted,
            dateAbandoned,
            pitchDeckUrl
            
        });
        res.status(201).json({message: "🟢 Card created successfully",card});
    } catch (error){
        res.status(500).json({message: "🔴 GhostCard not created",error: error.message});
    }
}

//update ghost card

exports.updateGhostCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user.id;

    // Optional fields from frontend
    const { externalLink, pitchDeckUrl } = req.body;

    const card = await GhostCard.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "🔴 GhostCard not found" });
    }

    // Update logic
    card.status = "revived";

    // Avoid duplicate revivers
    if (!card.revivedBy.includes(userId)) {
      card.revivedBy.push(userId);
    }

    // Optionally update fields
    if (externalLink) card.externalLink = externalLink;
    if (pitchDeckUrl) card.pitchDeckUrl = pitchDeckUrl;

    const updatedCard = await card.save();

    res.status(200).json({
      message: "🟢 Project successfully revived!",
      card: updatedCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "🔴 Failed to update GhostCard",
      error: error.message,
    });
  }
};



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