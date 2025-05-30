jest.mock("../models/paymentRequest", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));
jest.mock("../models/wallets", () => ({
  debit: jest.fn(),
}));
jest.mock("../utils/socket", () => ({
  getIO: jest.fn(),
  userSockets: new Map(),
}));

const PaymentRequest = require("../models/paymentRequest");
const Wallet = require("../models/wallets");
const { getIO, userSockets } = require("../utils/socket");
const {
  create,
  accept,
  reject,
} = require("../controllers/paymentRequestController");

beforeEach(() => {
  jest.clearAllMocks();
  userSockets.clear();
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((err) => {
    if (
      err instanceof Error &&
      (err.message === "Erreur de la DB" || err.message === "fail")
    ) {
      // On ne log pas ces erreurs car elles sont simulées
      return;
    }

    // Sinon on affiche normalement
    console.warn("Autre erreur :", err);
  });
  jest.spyOn(console, "warn").mockImplementation((msg, socketId) => {
    if (
      typeof msg === "string" &&
      msg.includes("Émission impossible, .to() ou .emit() est undefined")
    ) {
      return; // Ignore le warning attendu
    }
    console.log("WARN (non ignoré) :", msg, socketId);
  });

  jest.spyOn(console, "log").mockImplementation((...args) => {
    const stringified = args.join(" ");
    if (stringified.includes("Méthodes disponibles sur Wallet")) {
      return; // Ne log pas pendant le test
    }
    console.info(...args); // Sinon on log normalement
  });
});

describe("paymentRequestController", () => {
  it("devrait créer une demande et émettre via Socket.IO", async () => {
    const req = {
      body: {
        walletId: 3,
        userId: "6",
        organizerId: "12",
        eventId: 4,
        amount: 12.5,
        description: "Bières",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      get: () => ({
        id: 40,
        wallet_id: 3,
        user_id: 6,
        organizer_id: 12,
        event_id: 4,
        amount: 12.5,
        description: "Bières",
        status: "pending",
      }),
    };

    PaymentRequest.create.mockResolvedValue(fakeRequest);

    const emitMock = jest.fn();
    getIO.mockReturnValue({
      to: jest.fn(() => ({ emit: emitMock })),
    });
    userSockets.set("6", "mock-socket-id");

    await create(req, res);

    expect(PaymentRequest.create).toHaveBeenCalledWith({
      wallet_id: 3,
      user_id: "6",
      organizer_id: "12",
      event_id: 4,
      amount: 12.5,
      description: "Bières",
      status: "pending",
    });

    expect(emitMock).toHaveBeenCalledWith(
      "newPaymentRequest",
      expect.objectContaining({ id: 40, amount: 12.5, description: "Bières" })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it("ne doit pas émettre si aucun socketId n'est enregistré", async () => {
    const req = {
      body: {
        walletId: 3,
        userId: "6",
        organizerId: "12",
        eventId: 4,
        amount: 10,
        description: "Sans socket",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      get: () => ({ id: 41, ...req.body, status: "pending" }),
    };
    PaymentRequest.create.mockResolvedValue(fakeRequest);

    userSockets.clear();
    const emitMock = jest.fn();
    getIO.mockReturnValue({
      to: jest.fn(() => ({ emit: emitMock })),
    });

    await create(req, res);

    expect(emitMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it("renvoie 500 si PaymentRequest.create échoue", async () => {
    const req = {
      body: {
        walletId: 3,
        userId: "6",
        organizerId: "12",
        eventId: 4,
        amount: 15,
        description: "Erreur Sequelize",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    PaymentRequest.create.mockRejectedValue(new Error("Erreur de la DB"));

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erreur lors de la création de la demande",
    });
  });

  it("ne fait rien si socket existe mais to() retourne undefined", async () => {
    const req = {
      body: {
        walletId: 3,
        userId: "6",
        organizerId: "12",
        eventId: 4,
        amount: 20,
        description: "Pas d'émission",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      get: () => ({ id: 42, ...req.body, status: "pending" }),
    };
    PaymentRequest.create.mockResolvedValue(fakeRequest);

    userSockets.set("6", "mock-socket-id");

    getIO.mockReturnValue({
      to: jest.fn(() => undefined),
    });

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it("devrait accepter une demande valide", async () => {
    const req = { params: { id: "42" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      wallet_id: 3,
      amount: 15,
      status: "pending",
      save: jest.fn(),
    };

    PaymentRequest.findByPk.mockResolvedValue(fakeRequest);
    Wallet.debit.mockResolvedValue();

    await accept(req, res);

    expect(Wallet.debit).toHaveBeenCalledWith(3, 15);
    expect(fakeRequest.status).toBe("accepted");
    expect(fakeRequest.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeRequest);
  });

  it("renvoie 404 si la demande n'existe pas", async () => {
    const req = { params: { id: "999" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    PaymentRequest.findByPk.mockResolvedValue(null);

    await accept(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Demande introuvable" });
  });

  it("devrait rejeter une demande existante", async () => {
    const req = { params: { id: "55" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      status: "pending",
      save: jest.fn(),
    };

    PaymentRequest.findByPk.mockResolvedValue(fakeRequest);

    await reject(req, res);

    expect(fakeRequest.status).toBe("rejected");
    expect(fakeRequest.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeRequest);
  });

  it("renvoie 500 si une erreur se produit dans reject()", async () => {
    const req = { params: { id: "error" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    PaymentRequest.findByPk.mockRejectedValue(new Error("fail"));

    await reject(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erreur lors du refus",
    });
  });

  it("refuse d’accepter une demande déjà traitée", async () => {
    const req = { params: { id: "42" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const fakeRequest = {
      status: "accepted",
    };

    PaymentRequest.findByPk.mockResolvedValue(fakeRequest);

    await accept(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Cette demande a déjà été traitée.",
    });
  });
  it("devrait retourner les demandes en attente de l'utilisateur", async () => {
    const req = {
      user: { id: 6 },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    const mockRequests = [
      { id: 1, user_id: 6, status: "pending" },
      { id: 2, user_id: 6, status: "pending" },
    ];

    PaymentRequest.findAll = jest.fn().mockResolvedValue(mockRequests);

    const { getPending } = require("../controllers/paymentRequestController");
    await getPending(req, res);

    expect(PaymentRequest.findAll).toHaveBeenCalledWith({
      where: { user_id: 6, status: "pending" },
    });
    expect(res.json).toHaveBeenCalledWith(mockRequests);
  });
});
