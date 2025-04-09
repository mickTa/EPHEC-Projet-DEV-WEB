const Event = require("../models/events");

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
