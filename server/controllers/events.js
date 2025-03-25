const Event=require("../models/events");

exports.NewEvent = async (req, res)=>{
  try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
  } catch (err) {
      console.error("Erreur Sequelize :", err);
      res.status(500).json({ error: err.message });
  }
};