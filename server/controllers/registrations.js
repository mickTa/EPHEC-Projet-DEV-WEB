const Registration = require('../models/registration');
const Event = require('../models/events');
const Wallet = require('../models/wallet');

exports.registerToEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = parseInt(req.params.id);

  try {
    const existing = await Registration.findOne({ where: { userId, eventId } });
    if (existing) {
      return res.status(400).json({ message: 'Déjà inscrit à cet événement.' });
    }

    const registration = await Registration.create({ userId, eventId });

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable.' });
    }

    const [wallet, created] = await Wallet.findOrCreate({
      where: {
        userId: userId,
        organizerId: event.organizerId,
        eventId: event.id  
      },
      defaults: {
        amount: 0
      }
    });

    res.status(201).json({
      message: 'Inscription réussie',
      registration,
      walletCreated: created,
      wallet
    });
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
