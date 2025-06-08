const Wallet = require("../models/wallets");
const {
  NewWallet,
  AddMoney,
  ChargeWallet,
} = require("../controllers/wallets");

jest.mock("../models/wallets", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("walletController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("NewWallet", () => {
    it("should create a new wallet and return it", async () => {
      const mockWallet = { id: 1, userId: 3, organizerId: 2, amount: 0 };
      Wallet.create.mockResolvedValue(mockWallet);

      req.body = mockWallet;
      await NewWallet(req, res);

      expect(Wallet.create).toHaveBeenCalledWith(mockWallet);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockWallet);
    });

    it("should handle error on wallet creation", async () => {
      const error = new Error("DB Error");
      Wallet.create.mockRejectedValue(error);

      await NewWallet(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "DB Error",
        details: undefined,
      });
    });
  });

  describe("AddMoney", () => {
    it("should add money to an existing wallet", async () => {
      const mockWallet = { id: 1, amount: 10, save: jest.fn() };
      Wallet.findByPk.mockResolvedValue(mockWallet);

      req.body = { walletId: 1, amount: 5 };
      await AddMoney(req, res);

      expect(mockWallet.amount).toBe(15);
      expect(mockWallet.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockWallet);
    });

    it("should return 404 if wallet not found", async () => {
      Wallet.findByPk.mockResolvedValue(null);
      req.body = { walletId: 99, amount: 10 };

      await AddMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Wallet not found" });
    });
  });

  describe("ChargeWallet", () => {
    it("should debit money from wallet if sufficient funds", async () => {
      const mockWallet = { id: 1, amount: 20, save: jest.fn() };
      Wallet.findByPk.mockResolvedValue(mockWallet);

      req.body = { walletId: 1, amount: 10, description: "Test payment" };

      await ChargeWallet(req, res);

      expect(mockWallet.amount).toBe(10);
      expect(mockWallet.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Paiement effectué",
        wallet: mockWallet,
      });
    });

    it("should return 400 if not enough funds", async () => {
      const mockWallet = { id: 1, amount: 5, save: jest.fn() };
      Wallet.findByPk.mockResolvedValue(mockWallet);

      req.body = { walletId: 1, amount: 10 };

      await ChargeWallet(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Fonds insuffisants" });
    });

    it("should return 404 if wallet not found", async () => {
      Wallet.findByPk.mockResolvedValue(null);
      req.body = { walletId: 123, amount: 10 };

      await ChargeWallet(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Wallet not found" });
    });
  });
});