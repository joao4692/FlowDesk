import { prisma } from "../prisma";

export async function listUsers(companyId: string) {
  return prisma.user.findMany({
    where: { companyId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
}

export async function getUserById(id: string, companyId: string) {
  return prisma.user.findFirst({
    where: { id, companyId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
}
