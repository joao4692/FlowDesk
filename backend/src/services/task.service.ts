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

export async function updateTaskStatus(
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE",
  companyId: string
) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { companyId } },
  });

  if (!task) {
    throw new Error("Tarefa não encontrada");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
}
