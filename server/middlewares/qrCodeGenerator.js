const QRCode = require("qrcode");
const crypto = require("crypto");
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

module.exports.generateWalletQRCode = async (wallet) => {
  try {
    const walletData = {
      id: wallet.id,
      userId: wallet.userId,
      organizerId: wallet.organizerId,
      amount: wallet.amount,
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000)
    };

    // Serialize the data
    const jsonData = JSON.stringify(walletData);
    
    // Get encryption key from environment
    let secretKey = process.env.QR_ENCRYPTION_KEY;
    if (!secretKey) {
      throw new Error('QR_ENCRYPTION_KEY is not configured');
    }

    // Ensure the key is exactly 32 bytes long
    // If it's shorter, pad it. If longer, hash it to get 32 bytes.
    secretKey = crypto.createHash('sha256').update(secretKey).digest();

    // Generate initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      secretKey, 
      iv
    );
    
    // Encrypt the data
    let encryptedData = cipher.update(jsonData, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    // Combine IV and encrypted data
    const securedData = `${iv.toString('hex')}:${encryptedData}`;
    
    // Create digital signature
    const hmacKey = process.env.QR_HMAC_KEY || secretKey;
    const hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(securedData);
    const signature = hmac.digest('hex');
    
    // Final secured payload
    const securedPayload = `${securedData}:${signature}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(securedPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300
    });

    return qrCode;
  } catch (error) {
    console.error("Secure QR Code Generation Error:", error);
    throw new Error('Failed to generate secure QR code');
  }
};

