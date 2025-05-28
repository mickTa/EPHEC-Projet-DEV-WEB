// Mocks explicites
jest.mock("../server/models/paymentRequest", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));
jest.mock("../server/models/wallets", () => ({
  debit: jest.fn(),
}));
jest.mock("../server/utils/socket", () => ({
  getIO: jest.fn(),
  userSockets: new Map(),
}));

const PaymentRequest = require("../server/models/paymentRequest");
const Wallet = require("../server/models/wallets");
const { getIO, userSockets } = require("../server/utils/socket");
const {
  create,
  accept,
  reject,
} = require("../server/controllers/paymentRequestController");

beforeEach(() => {
  jest.clearAllMocks();
  userSockets.clear();
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

  it("renvoie 400 si la demande n'existe pas", async () => {
    const req = { params: { id: "999" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    PaymentRequest.findByPk.mockResolvedValue(null);

    await accept(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Demande invalide" });
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
});
