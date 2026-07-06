import bcrypt from "bcrypt";
import { prisma } from "../prisma";

export async function setAccessPassword(companyId: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.company.update({
    where: { id: companyId },
    data: { accessPassword: passwordHash },
  });
}
