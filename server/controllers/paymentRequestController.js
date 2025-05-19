const PaymentRequest = require("../models/paymentRequest");
const Wallet = require("../models/wallets");
const { getIO, userSockets } = require("../utils/socket");

exports.create = async (req, res) => {
  try {
    const { walletId, userId, organizerId, eventId, amount, description } =
      req.body;

    const request = await PaymentRequest.create({
      wallet_id: walletId,
      user_id: userId,
      organizer_id: organizerId,
      event_id: eventId,
      amount,
      description,
      status: "pending",
    });

    // Émettre la notification à l'utilisateur concerné via Socket.IO
    const io = getIO();
    const socketId = userSockets.get(String(userId));
    if (socketId) {
      io.to(socketId).emit("newPaymentRequest", request);
    }

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création de la demande" });
  }
};

exports.getPending = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await PaymentRequest.findAll({
      where: {
        user_id: userId,
        status: "pending",
      },
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur récupération demandes" });
  }
};

exports.accept = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await PaymentRequest.findByPk(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ error: "Demande invalide" });
    }

    // retirer du wallet
    await Wallet.debit(request.wallet_id, request.amount);

    request.status = "accepted";
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'acceptation" });
  }
};

exports.reject = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await PaymentRequest.findByPk(requestId);

    if (!request) {
      return res.status(400).json({ error: "Demande invalide" });
    }

    request.status = "rejected";
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du refus" });
  }
};
