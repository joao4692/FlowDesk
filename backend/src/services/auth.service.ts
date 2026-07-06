import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  companyId: string
) {
  const passwordHash = await bcrypt.hash(password, 10);

  const existingUsersCount = await prisma.user.count({ where: { companyId } });
  const role = existingUsersCount === 0 ? "ADMIN" : "MEMBER";

  const user = await prisma.user.create({
    data: { name, email, password: passwordHash, companyId, role },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { userId: user.id, companyId: user.companyId, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return token;
}
export async function memberLogin(username: string, accessPassword: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { company: true },
  });

  if (!user || !user.company.accessPassword) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatches = await bcrypt.compare(accessPassword, user.company.accessPassword);

  if (!passwordMatches) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { userId: user.id, companyId: user.companyId, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return token;
}

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: { select: { id: true, name: true } },
    },
  });
}

export async function registerCompanyAndAdmin(
  companyName: string,
  name: string,
  email: string,
  password: string
) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.$transaction(async (tx) => {
    const company = await tx.company.create({ data: { name: companyName } });

    const user = await tx.user.create({
      data: { name, email, password: passwordHash, companyId: company.id, role: "ADMIN" },
    });

    return { company, user };
  });
}
