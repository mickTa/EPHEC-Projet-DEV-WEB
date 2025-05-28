const QRCode = require("qrcode");
const crypto = require("crypto");
const path = require("path");
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

module.exports.generateWalletQRCode = async (wallet) => {
  try {
    const walletData = {
      id: wallet.id,
      userId: wallet.userId,
      organizerId: wallet.organizerId,
      eventId: wallet.eventId,
      amount: wallet.amount,
      timestamp: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000,
    };

    // Serialize the data
    const jsonData = JSON.stringify(walletData);

    // Get encryption key from environment
    let secretKey = process.env.QR_ENCRYPTION_KEY;
    if (!secretKey) {
      throw new Error("QR_ENCRYPTION_KEY is not configured");
    }

    secretKey = crypto.createHash("sha256").update(secretKey).digest();

    // Generate initialization vector
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);

    // Encrypt the data
    let encryptedData = cipher.update(jsonData, "utf8", "hex");
    encryptedData += cipher.final("hex");

    // Combine IV and encrypted data
    const securedData = `${iv.toString("hex")}:${encryptedData}`;

    // Create digital signature
    const hmacKey = process.env.QR_HMAC_KEY || secretKey;
    const hmac = crypto.createHmac("sha256", hmacKey);
    hmac.update(securedData);
    const signature = hmac.digest("hex");

    // Final secured payload
    const securedPayload = `${securedData}:${signature}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(securedPayload, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });

    return qrCode;
  } catch (error) {
    console.error("Secure QR Code Generation Error:", error);
    throw new Error("Failed to generate secure QR code");
  }
};

module.exports.decryptWalletQRCode = async (encryptedData) => {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error(
        `Invalid format. Expected 3 parts (IV:EncryptedData:Signature), got ${parts.length}`
      );
    }

    const [ivHex, encryptedHex, signature] = parts;

    // Get encryption key
    let secretKey = process.env.QR_ENCRYPTION_KEY;
    if (!secretKey) throw new Error("Missing QR_ENCRYPTION_KEY");

    // Hash to ensure 32-byte key
    secretKey = crypto.createHash("sha256").update(secretKey).digest();

    // Verify HMAC signature
    const hmacKey = process.env.QR_HMAC_KEY || process.env.QR_ENCRYPTION_KEY;
    const hmac = crypto.createHmac("sha256", hmacKey);
    hmac.update(`${ivHex}:${encryptedHex}`);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      throw new Error("Invalid signature: possible tampering detected.");
    }

    // Decrypt the data
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const walletData = JSON.parse(decrypted.toString());

    // Check expiration
    if (walletData.expiresAt && walletData.expiresAt < Date.now()) {
      throw new Error("QR code expired");
    }

    return walletData;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    throw error;
  }
};
