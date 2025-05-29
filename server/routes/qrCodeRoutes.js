const express = require('express');
const { generateWalletQRCode, decryptWalletQRCode } = require('../middlewares/qrCodeGenerator');
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");

const router = express.Router();

router.post('/generate-qr', checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), async (req, res) => {
  const { wallet } = req.body;
  try {
    const qrCode = await generateWalletQRCode(wallet);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

router.post('/decrypt-qr', checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), async (req, res) => {
  const { encryptedData } = req.body; // Data comes from request body

  if (!encryptedData) {
    return res.status(400).json({ error: 'Missing encrypted data' });
  }

  try {
    const walletData = await decryptWalletQRCode(encryptedData);
    res.json({ walletData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;