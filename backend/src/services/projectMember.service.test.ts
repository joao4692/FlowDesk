import { prisma } from "../prisma";
import { addMember } from "./projectMember.service";

describe("addMember", () => {
  it("nao permite adicionar usuario de outra empresa ao projeto", async () => {
    const companyA = await prisma.company.create({ data: { name: "Empresa A" } });
    const companyB = await prisma.company.create({ data: { name: "Empresa B" } });

    const project = await prisma.project.create({
      data: { name: "Projeto da Empresa A", companyId: companyA.id },
    });

    const userFromCompanyB = await prisma.user.create({
      data: {
        name: "Usuario B",
        email: `usuario-b-${Date.now()}@teste.com`,
        password: "hash-fake",
        companyId: companyB.id,
      },
    });

    await expect(
      addMember(project.id, userFromCompanyB.id, companyA.id)
    ).rejects.toThrow("Usuário não encontrado");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
