const bcrypt = require("bcryptjs");
const { changePassword, post, getMe } = require("../controllers/users");
const User = require("../models/user");

jest.mock("bcryptjs");
jest.mock("../models/user");

describe("User Controller", () => {
  describe("changePassword", () => {
    it("doit changer le mot de passe si tout est correct", async () => {
      const req = {
        body: { oldPassword: "Old123!", newPassword: "NewPass123!" },
        user: {
          password: "hashedOldPassword",
          update: jest.fn().mockResolvedValue(true),
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedNewPassword");

      await changePassword(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Old123!",
        "hashedOldPassword"
      );
      expect(req.user.update).toHaveBeenCalledWith({
        password: "hashedNewPassword",
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Mot de passe changé avec succès !",
      });
    });

    it("doit refuser si ancien mot de passe incorrect", async () => {
      const req = {
        body: { oldPassword: "wrong", newPassword: "NewPass123!" },
        user: { password: "hashed", update: jest.fn() },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.compare.mockResolvedValue(false);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Ancien mot de passe incorrect",
      });
    });
  });

  describe("post", () => {
    it("doit créer un nouvel utilisateur valide", async () => {
      const req = {
        body: {
          password: "Valid123!",
          role: "USER",
          email: "test@example.com",
          username: "testuser",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.create.mockResolvedValue({ id: 1, ...req.body });

      await post(req, res);

      expect(User.create).toHaveBeenCalledWith({
        email: "test@example.com",
        username: "testuser",
        password: "Valid123!",
        role: "USER",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ email: "test@example.com" })
      );
    });

    it("doit refuser si rôle = ADMIN", async () => {
      const req = {
        body: { password: "Valid123!", role: "ADMIN" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await post(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "La création de comptes ADMIN est interdite via cette route.",
      });
    });
  });

  describe("getMe", () => {
    it("retourne les infos utilisateur si authentifié", async () => {
      const req = { user: { id: 1, name: "Jean" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getMe(req, res);
      expect(res.json).toHaveBeenCalledWith(req.user);
    });

    it("retourne une erreur si non authentifié", async () => {
      const req = { user: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getMe(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });
});
