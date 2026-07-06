import { prisma } from "../prisma";

async function ensureProjectBelongsToCompany(projectId: string, companyId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId },
  });

  if (!project) {
    throw new Error("Projeto não encontrado");
  }
}

async function ensureUserBelongsToCompany(userId: string, companyId: string) {
  const user = await prisma.user.findFirst({ where: { id: userId, companyId } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }
}

export async function createTask(
  title: string,
  projectId: string,
  companyId: string,
  assigneeId?: string
) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  if (assigneeId) {
    await ensureUserBelongsToCompany(assigneeId, companyId);
  }

  return prisma.task.create({
    data: { title, projectId, assigneeId },
  });
}

export async function listTasks(projectId: string, companyId: string) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  return prisma.task.findMany({
    where: { projectId },
    include: { assignee: { select: { id: true, name: true } } },
  });
}

export async function updateTaskAssignee(
  taskId: string,
  assigneeId: string | null,
  companyId: string
) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { companyId } },
  });

  if (!task) {
    throw new Error("Tarefa não encontrada");
  }

  if (task.status === "IN_PROGRESS") {
    throw new Error("Não é possível reatribuir uma tarefa em andamento");
  }

  if (assigneeId) {
    await ensureUserBelongsToCompany(assigneeId, companyId);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { assigneeId },
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

export async function deleteTask(taskId: string, companyId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { companyId } },
  });

  if (!task) {
    throw new Error("Tarefa não encontrada");
  }

  return prisma.task.delete({ where: { id: taskId } });
}
