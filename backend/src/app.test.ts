import request from "supertest";
import { app } from "./app";
import { prisma } from "./prisma";


describe("Companies", () => {
  it("cria uma empresa e retorna ela", async () => {
    const response = await request(app)
      .post("/companies")
      .send({ name: "Empresa Teste" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Empresa Teste");
  });

});

  afterAll(async () => {
  await prisma.$disconnect();
});

