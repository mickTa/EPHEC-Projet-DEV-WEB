const Registration = require('../models/registration');
const Event = require('../models/events');
const Wallet = require('../models/wallet');

exports.registerToEvent = async (req, res) => {
  try {
    const [wallet, created] = await Wallet.findOrCreate({
      where:{
        userId: req.user.id,
        organizerId: req.body.organizerId,
        eventId: req.body.id,
      }
    });
    const registration = await Registration.create({ userId:req.user.id, eventId:req.body.id, walletId:wallet.id });
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

exports.unregisterToEvent = async (req, res) => {
  try {
    const result=await Registration.destroy({where:{ userId:req.user.id, eventId:parseInt(req.params.eventId)}});
    res.status(201).json({
      message: 'Désinscription réussie'+JSON.stringify(result),
    });
  } catch (err) {
    console.error('Erreur lors de la désinscription :', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

exports.isRegistered = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      where:{
        userId:req.user.id,
        eventId:parseInt(req.params.eventId)
      }
    });
    res.status(201).json({
      registered:registration?true:false,
      wallet:registration?.walletId,
    });
  } catch (err) {
    console.error('Erreur lors de la recherche :', err);
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};