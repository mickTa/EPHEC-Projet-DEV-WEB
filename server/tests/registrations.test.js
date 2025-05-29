const { registerToEvent } = require("../controllers/registrations");
const Registration = require("../models/registration");
const Wallet = require("../models/wallets");

jest.mock("../models/registration");
jest.mock("../models/wallets");

describe("Event Controller", () => {
  // Supprime les logs console.error pendant les tests
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  describe("registerToEvent", () => {
    it("doit enregistrer un utilisateur à un événement", async () => {
      const req = {
        user: { id: 1 },
        body: { id: 100, organizerId: 50 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockWallet = { id: 10 };
      jest.spyOn(Wallet, 'findOrCreate').mockResolvedValue([mockWallet, true]);
      const mockRegistration = {
        id: 200,
        userId: 1,
        eventId: 100,
        walletId: 10,
      };
      jest.spyOn(Registration, 'create').mockResolvedValue(mockRegistration);

      await registerToEvent(req, res);

      expect(Wallet.findOrCreate).toHaveBeenCalledWith({
        where: {
          userId: 1,
          organizerId: 50,
          eventId: 100,
        },
      });

      expect(Registration.create).toHaveBeenCalledWith({
        userId: 1,
        eventId: 100,
        walletId: 10,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inscription réussie",
        registration: mockRegistration,
        walletCreated: true,
        wallet: mockWallet,
      });
    });

    it("doit gérer une erreur serveur", async () => {
      const req = {
        user: { id: 1 },
        body: { id: 100, organizerId: 50 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Wallet, 'findOrCreate').mockResolvedValue(new Error("(intermediate value) is not iterable"));

      await registerToEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur serveur.",
        error: "(intermediate value) is not iterable",
      });
    });
  });
});
