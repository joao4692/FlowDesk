import { prisma } from "../prisma";

async function ensureProjectBelongsToCompany(projectId: string, companyId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId },
  });

  if (!project) {
    throw new Error("Projeto não encontrado");
  }
}

export async function addMember(projectId: string, userId: string, companyId: string) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  const user = await prisma.user.findFirst({
    where: { id: userId, companyId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return prisma.projectMember.create({
    data: { projectId, userId },
  });
}

export async function listMembers(projectId: string, companyId: string) {
  await ensureProjectBelongsToCompany(projectId, companyId);

  return prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
