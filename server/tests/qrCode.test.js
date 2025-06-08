const {
  generateWalletQRCode,
  decryptWalletQRCode,
} = require("../middlewares/qrCodeGenerator");

describe("QR Code Generator & Decryptor", () => {
  const originalEnv = process.env;
  let wallet;

  beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      QR_ENCRYPTION_KEY: "test_secret_key",
      QR_HMAC_KEY: "test_hmac_key",
    };

    wallet = {
      id: 1,
      userId: 123,
      organizerId: 456,
      eventId: 789,
      amount: "100.00",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should generate and decrypt a valid QR code", async () => {
    const { qrCode, payload } = await generateWalletQRCode(wallet);

    expect(typeof qrCode).toBe("string");
    expect(qrCode.startsWith("data:image")).toBe(true);

    const decrypted = await decryptWalletQRCode(payload);

    expect(decrypted.id).toBe(wallet.id);
    expect(decrypted.userId).toBe(wallet.userId);
    expect(decrypted.amount).toBe(wallet.amount);
  });

  it("should throw if QR code is expired", async () => {
    const expiredWallet = {
      ...wallet,
      timestamp: Date.now() - 2 * 3600_000, // 2h ago
      expiresAt: Date.now() - 1 * 3600_000, // expired 1h ago
    };

    const { payload } = await generateWalletQRCode(expiredWallet);

    await expect(decryptWalletQRCode(payload)).rejects.toThrow("QR code expired");
  });

  it("should detect tampering (invalid signature)", async () => {
    const { payload } = await generateWalletQRCode(wallet);

    // Simulate tampering: replace last character
    const tamperedPayload = payload.slice(0, -1) + "Z";

    await expect(decryptWalletQRCode(tamperedPayload)).rejects.toThrow("Invalid signature");
  });

  it("should fail if QR_ENCRYPTION_KEY is missing", async () => {
    delete process.env.QR_ENCRYPTION_KEY;

    await expect(generateWalletQRCode(wallet)).rejects.toThrow(
      "Failed to generate secure QR code"
    );
  });

  it("should fail if format is invalid", async () => {
    const invalid = "abc:def"; // only 2 parts instead of 3
    await expect(decryptWalletQRCode(invalid)).rejects.toThrow(/Invalid format/);
  });
});
