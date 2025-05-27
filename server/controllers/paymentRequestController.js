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

    // Émission la notification à l'utilisateur concerné via Socket.IO
    const io = getIO();
    const socketId = userSockets.get(String(userId));

    console.log("userId reçu :", userId);
    console.log("socketId trouvé :", socketId);
    console.log("Donnée de la requête envoyée :", request);
    console.log("Socket ID récupéré dans Map:", socketId);
    console.log("État actuel de userSockets:", [...userSockets.entries()]);

    if (socketId) {
      console.log("📤 Émission de la demande au socket :", socketId);
      const target = io.to(socketId);
      if (target?.emit) {
        target.emit("newPaymentRequest", request.get({ plain: true }));
        console.log("📤 Émission de la demande au socket :", socketId);
      } else {
        console.warn(
          "Émission impossible, .to() ou .emit() est undefined pour socketId:",
          socketId
        );
      }
    } else {
      console.log("Aucun socket enregistré pour userId:", userId);
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
