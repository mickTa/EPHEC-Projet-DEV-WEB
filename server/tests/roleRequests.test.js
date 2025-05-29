const bcrypt = require("bcryptjs");
const { getAll, getByUser, acceptRequest, rejectRequest } = require("../controllers/roleRequests");
const User = require("../models/user");
const RoleRequest = require("../models/roleRequest");


jest.mock("bcryptjs");

jest.mock("../models/user", () => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
}));

jest.mock("../models/roleRequest", () => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
}));

describe("RoleRequest Controller", () => {
    describe("getAll", () => {
        it("retourne une erreur si non authentifié", async () => {
            const req = { user: null };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

        it("doit retourner toutes les requêtes si trouvées", async () => {
            const req = { user: { id: "1" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockRequest = { id: 1, userId: "1" };
            jest.spyOn(RoleRequest, 'findAll').mockResolvedValue(mockRequest);

            await getAll(req, res);

            expect(RoleRequest.findAll).toHaveBeenCalledWith({ order: [["createdAt", "DESC"]] });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRequest);
        });
    });

    describe("getByUser", () => {
        it("retourne une erreur si non authentifié", async () => {
            const req = { user: null };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getByUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

        it("doit retourner une requête si trouvée", async () => {
            const req = { user: { id: "1" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockRequest = { id: 1, userId: "1" };
            jest.spyOn(RoleRequest, 'findOne').mockResolvedValue(mockRequest);

            await getByUser(req, res);

            expect(RoleRequest.findOne).toHaveBeenCalledWith({
                where: {
                    userId: req.user.id, status: "PENDING"
                },
                order: [["createdAt", "DESC"]],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRequest);
        });
    });

    describe("acceptRequest", () => {
        it("retourne une erreur si non authentifié", async () => {
            const req = { user: null, body: { requestId: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await acceptRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

        it("doit accepter la requête", async () => {
            const req = { user: { id: 1 }, body: { requestId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockRequest = { id: 1, userId: 1, update: jest.fn().mockResolvedValue(true), };
            const mockUser = { id: 1, update: jest.fn().mockResolvedValue(true) };

            jest.spyOn(RoleRequest, 'findByPk').mockResolvedValue(mockRequest);
            jest.spyOn(RoleRequest, 'update').mockResolvedValue(mockRequest);
            jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
            jest.spyOn(User, 'update').mockResolvedValue(mockUser);

            await acceptRequest(req, res);

            expect(RoleRequest.findByPk).toHaveBeenCalledWith(req.body.requestId);
            expect(mockRequest.update).toHaveBeenCalledWith({ adminUserId: req.user.id, status: "ACCEPTED" });
            expect(User.findByPk).toHaveBeenCalledWith(mockRequest.userId);
            expect(mockUser.update).toHaveBeenCalledWith({ role: "ORGANIZER" });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("rejectRequest", () => {
        it("retourne une erreur si non authentifié", async () => {
            const req = { user: null, body: { requestId: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await rejectRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

        it("doit rejeter la requête", async () => {
            const req = { user: { id: 1 }, body: { requestId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockRequest = { id: 1, userId: 1, update: jest.fn().mockResolvedValue(true), };

            jest.spyOn(RoleRequest, 'findByPk').mockResolvedValue(mockRequest);
            jest.spyOn(RoleRequest, 'update').mockResolvedValue(mockRequest);

            await rejectRequest(req, res);

            expect(RoleRequest.findByPk).toHaveBeenCalledWith(req.body.requestId);
            expect(mockRequest.update).toHaveBeenCalledWith({ adminUserId: req.user.id, status: "REJECTED" });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
