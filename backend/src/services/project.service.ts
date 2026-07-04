import { prisma } from "../prisma";

export async function createProject(name: string, companyId: string) {
  return prisma.project.create({
    data: { name, companyId },
  });
}

export async function listProjects(companyId: string) {
  return prisma.project.findMany({
    where: { companyId },
  });
}
//chama os projetos de uma empresa específica, usando o companyId para filtrar os resultados.