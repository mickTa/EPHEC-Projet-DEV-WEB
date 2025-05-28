const { 
  getEventById, 
  getMySubscribedEvents, 
  getAllEvents,
  uploadEventImage
} = require("./events");
const Event = require("../models/events");
const Registration = require("../models/registration");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");

Event.findByPk = jest.fn();
Event.findAll = jest.fn();
Registration.findAll = jest.fn();

describe("Event Controller", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  // Tests getEventById
  describe("getEventById", () => {
    it("doit retourner un événement si trouvé", async () => {
      const req = { params: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvent = { id: 123, title: "Super Event", date: "2025-06-01" };
      Event.findByPk.mockResolvedValue(mockEvent);

      await getEventById(req, res);

      expect(Event.findByPk).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("doit retourner 404 si événement non trouvé", async () => {
      const req = { params: { id: "999" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findByPk.mockResolvedValue(null);

      await getEventById(req, res);

      expect(Event.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Événement non trouvé" });
    });

    it("doit gérer une erreur serveur", async () => {
      const req = { params: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findByPk.mockRejectedValue(new Error("DB error"));

      await getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  // Tests getMySubscribedEvents
  describe("getMySubscribedEvents", () => {
    it("doit retourner les événements auxquels l'utilisateur est inscrit", async () => {
      const req = { user: { id: 42 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockRegistrations = [
        { event: { id: 1, title: "Event 1" } },
        { event: { id: 2, title: "Event 2" } },
      ];

      Registration.findAll.mockResolvedValue(mockRegistrations);

      await getMySubscribedEvents(req, res);

      expect(Registration.findAll).toHaveBeenCalledWith({
        where: { userId: 42 },
        include: [{ model: Event, as: 'event' }],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, title: "Event 1" },
        { id: 2, title: "Event 2" },
      ]);
    });

    it("doit gérer une erreur serveur", async () => {
      const req = { user: { id: 42 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Registration.findAll.mockRejectedValue(new Error("DB error"));

      await getMySubscribedEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
      expect(console.error).toHaveBeenCalledWith(
        "Erreur lors de la récupération des événements :",
        expect.any(Error)
      );
    });
  });

  // Tests getAllEvents
  describe("getAllEvents", () => {
    it("doit retourner une liste d'événements avec limit et offset", async () => {
      const req = { query: { limit: "2", offset: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvents = [
        { id: 10, title: "Event A" },
        { id: 11, title: "Event B" },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      await getAllEvents(req, res);

      expect(Event.findAll).toHaveBeenCalledWith({ limit: 2, offset: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it("doit utiliser les valeurs par défaut si limit et offset absents", async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockEvents = [{ id: 20, title: "Event Default" }];

      Event.findAll.mockResolvedValue(mockEvents);

      await getAllEvents(req, res);

      expect(Event.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it("doit gérer une erreur serveur", async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Event.findAll.mockRejectedValue(new Error("DB error"));

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
  describe("uploadEventImage", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("doit retourner 400 si aucun fichier envoyé", async () => {
      const req = { file: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await uploadEventImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Aucun fichier n'a été envoyé." });
    });

    it("doit uploader une image et retourner l'url", async () => {
      const fakeUploadResult = { secure_url: "https://images.pexels.com/photos/32261260/pexels-photo-32261260/free-photo-of-personne-dans-un-champ-de-moutarde-avec-un-ciel-bleu-en-arriere-plan.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" };

      const req = {
        file: { buffer: Buffer.from("fake image buffer") }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
        return {
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      const pipeMock = jest.fn((stream) => {
        setTimeout(() => {
          const call = cloudinary.uploader.upload_stream.mock.calls[0];
          const cb = call[1];
          cb(null, fakeUploadResult);
        }, 0);
        return {};
      });

      streamifier.createReadStream = jest.fn(() => ({
        pipe: pipeMock
      }));

      await uploadEventImage(req, res);

      expect(streamifier.createReadStream).toHaveBeenCalledWith(req.file.buffer);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: "events" },
        expect.any(Function)
      );
      expect(pipeMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Image téléchargée avec succès",
        url: fakeUploadResult.secure_url,
      });
    });

    it("doit gérer une erreur lors de l'upload", async () => {
      const req = {
        file: { buffer: Buffer.from("fake image buffer") }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const fakeError = new Error("Upload failed");

      cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
        return {
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      streamifier.createReadStream = jest.fn(() => ({
        pipe: jest.fn(() => {
          const call = cloudinary.uploader.upload_stream.mock.calls[0];
          const cb = call[1];
          cb(fakeError);
          return {};
        }),
      }));

      await uploadEventImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur lors de l'upload de l'image" });
      expect(console.error).toHaveBeenCalledWith(fakeError);
    });
  });
});
