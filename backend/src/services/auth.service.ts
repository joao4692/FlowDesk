import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export async function registerUser(name: string, email: string, password: string, companyId: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: passwordHash, companyId },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { userId: user.id, companyId: user.companyId },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return token;
}
