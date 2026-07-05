import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "./app";
import { prisma } from "./prisma";

const token = jwt.sign(
  { userId: "test-user-id", companyId: "test-company-id" },
  process.env.JWT_SECRET!
);

describe("Companies", () => {
  it("cria uma empresa e retorna ela", async () => {
    const response = await request(app)
      .post("/companies")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Empresa Teste" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Empresa Teste");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
