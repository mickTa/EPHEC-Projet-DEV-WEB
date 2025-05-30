const request = require("supertest");
const app = require("../../app");

const db = require("../../models/db");
const { User } = require("../../models/user");

describe("Flux utilisateur complet", () => {
  beforeAll(async () => {
    const db = require("../../models/db");
    await db.sync({ force: true }); // Réinitialise la base
  });
  let token;

  it("devrait inscrire un utilisateur", async () => {
    const res = await request(app).post("/api/users").send({
      fullName: "Test User",
      email: "e2e_test@example.com",
      password: "TestPass123!",
    });
    expect(res.statusCode).toBe(201);
  });

  it("devrait connecter l'utilisateur", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "e2e_test@example.com",
      password: "TestPass123!",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it("devrait récupérer les infos utilisateur", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("e2e_test@example.com");
  });
});
