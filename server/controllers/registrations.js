const Registration = require('../models/registration');

exports.registerToEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = parseInt(req.params.id);

  try {
    const existing = await Registration.findOne({ where: { userId, eventId } });
    if (existing) {
      return res.status(400).json({ message: 'Déjà inscrit à cet événement.' });
    }

    const registration = await Registration.create({ userId, eventId });
    res.status(201).json(registration);
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
