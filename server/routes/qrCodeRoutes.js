const express = require('express');
const { generateWalletQRCode } = require('../middlewares/qrCodeGenerator');

const router = express.Router();

router.post('/generate-qr', async (req, res) => {
  const { wallet } = req.body;
  try {
    const qrCode = await generateWalletQRCode(wallet);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;