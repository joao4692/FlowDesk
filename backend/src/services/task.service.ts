import { prisma } from "../prisma";

async function ensureProjectBelongsToCompany(projectId: string, companyId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId },
  });

  if (!project) {
    throw new Error("Projeto não encontrado");
  }
}

export async function createTask(title: string, projectId: string, companyId: string) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  return prisma.task.create({
    data: { title, projectId },
  });
}

export async function listTasks(projectId: string, companyId: string) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  return prisma.task.findMany({
    where: { projectId },
  });
}
