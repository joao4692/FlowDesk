import { prisma } from "../prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function generateUniqueUsername(name: string) {
  const base = slugify(name) || "membro";
  let username = base;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${base}${suffix}`;
  }

  return username;
}

export async function createMember(name: string, companyId: string) {
  const username = await generateUniqueUsername(name);

  const user = await prisma.user.create({
    data: { name, username, companyId, role: "MEMBER" },
  });

  return { id: user.id, name: user.name, username: user.username, role: user.role };
}

export async function listUsers(companyId: string) {
  return prisma.user.findMany({
    where: { companyId },
    select: { id: true, name: true, email: true, username: true, createdAt: true },
  });
}

export async function getUserById(id: string, companyId: string) {
  return prisma.user.findFirst({
    where: { id, companyId },
    select: { id: true, name: true, email: true, username: true, createdAt: true },
  });
}
