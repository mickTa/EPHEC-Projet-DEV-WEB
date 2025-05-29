const bcrypt = require("bcryptjs");
<<<<<<< HEAD:tests/users.test.js
const { changePassword, post, getMe, getUserById, requestRole } = require("../server/controllers/users");
const User = require("../server/models/user");
const RoleRequest = require("../server/models/roleRequest");


jest.mock("bcryptjs");

jest.mock("../server/models/user", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../server/models/roleRequest", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));
=======
const { changePassword, post, getMe } = require("../controllers/users");
const User = require("../models/user");

jest.mock("bcryptjs");
jest.mock("../models/user");
>>>>>>> main:server/tests/users.test.js

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

<<<<<<< HEAD:tests/users.test.js
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue("salt");
      jest.spyOn(bcrypt, 'hash').mockResolvedValue("hashedNewPassword");

      await changePassword(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("Old123!", "hashedOldPassword");
      expect(req.user.update).toHaveBeenCalledWith({ password: "hashedNewPassword" });
      expect(res.json).toHaveBeenCalledWith({ message: "Mot de passe changé avec succès !" });
=======
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
>>>>>>> main:server/tests/users.test.js
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

<<<<<<< HEAD:tests/users.test.js
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
=======
      bcrypt.compare.mockResolvedValue(false);
>>>>>>> main:server/tests/users.test.js

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
<<<<<<< HEAD:tests/users.test.js
      expect(res.json).toHaveBeenCalledWith({ error: "Ancien mot de passe incorrect" });
=======
      expect(res.json).toHaveBeenCalledWith({
        error: "Ancien mot de passe incorrect",
      });
>>>>>>> main:server/tests/users.test.js
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

<<<<<<< HEAD:tests/users.test.js
      jest.spyOn(User, 'create').mockResolvedValue({ id: 1, ...req.body });
=======
      User.create.mockResolvedValue({ id: 1, ...req.body });
>>>>>>> main:server/tests/users.test.js

      await post(req, res);

      expect(User.create).toHaveBeenCalledWith({
        email: "test@example.com",
        username: "testuser",
        password: "Valid123!",
        role: "USER",
      });

      expect(res.status).toHaveBeenCalledWith(201);
<<<<<<< HEAD:tests/users.test.js
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: "test@example.com" }));
=======
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ email: "test@example.com" })
      );
>>>>>>> main:server/tests/users.test.js
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
<<<<<<< HEAD:tests/users.test.js

  describe("getUserById", () => {
    it("doit retourner un user si trouvé", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { id: 1, fullName: "A B" };
      jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

      await getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("doit retourner 404 si user non trouvé", async () => {
      const req = { params: { id: "999" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockResolvedValue(null);

      await getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("doit gérer une erreur serveur", async () => {
      const req = { params: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockRejectedValue(new Error("Failed to retrieve user"));

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve user" });
    });
  });

  describe("requestRole", () => {
    it("doit retourner une 401 si user non authentifié", async () => {
      const req = {
        body: { role: "ORGANIZER" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await requestRole(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur non authentifié" });
    });

    it("doit retourner une 200 dans le cas nominal", async () => {
      const req = {
        body: { role: "ORGANIZER" },
        user: { id: "1" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(RoleRequest, 'create').mockResolvedValue({ userId: req.user.id, role: req.body.role, status: "PENDING" });

      await requestRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Requête envoyée aux administrateurs" });
    });

    it("doit gérer une erreur serveur", async () => {
      const req = {
        body: { role: "ORGANIZER" },
        user: { id: "1" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      RoleRequest.create.mockRejectedValue(new Error("Erreur interne du serveur"));

      await requestRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur interne du serveur" });
    });
  });
=======
>>>>>>> main:server/tests/users.test.js
});
