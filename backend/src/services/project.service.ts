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

export async function deleteProject(projectId: string, companyId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId },
  });

  if (!project) {
    throw new Error("Projeto não encontrado");
  }

  return prisma.project.delete({ where: { id: projectId } });
}
//chama os projetos de uma empresa específica, usando o companyId para filtrar os resultados.