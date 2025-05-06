const Event = require("../models/events");
const cloudinary = require("../cloudinary");
const fs = require("fs");


exports.NewEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("Erreur Sequelize :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const events = await Event.findAll({ limit, offset });
    res.status(200).json(events);
  } catch (err) {
    console.error("Erreur Sequelize :", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEvents=async(req,res)=>{
  try{
    const myEvents=await Event.findAll({where:{organizerId:req.user.id}});
    res.status(200).json(myEvents);
  }catch(err){
    res.status(500).json({error: err.message})
  }
};

exports.UpdateEvent=async(req,res)=>{
  newEvent=req.body;
  try{
    const event=await Event.findByPk(newEvent.id);
    delete newEvent.id;
    await event.update(newEvent);
    res.status(200).json()
  }catch(err){
    res.status(500).json({error: err.message})
  }
}

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error("Erreur Sequelize :", err);
    res.status(500).json({ error: err.message });
  }
};


exports.uploadEventImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier n'a été envoyé." });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "events", 
    });

    res.status(200).json({ message: "Image téléchargée avec succès", url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
  }
};
