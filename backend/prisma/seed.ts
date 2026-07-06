import bcrypt from "bcrypt";
import { prisma } from "../src/prisma";

async function main() {
  const existing = await prisma.company.findFirst({ where: { name: "Empresa Seed" } });

  if (existing) {
    console.log("Seed já aplicado (Empresa Seed já existe), pulando.");
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);
  const accessPasswordHash = await bcrypt.hash("00000", 10);

  const company = await prisma.company.create({
    data: {
      name: "Empresa Seed",
      accessPassword: accessPasswordHash,
      users: {
        create: [
          { name: "Admin Seed", email: "admin@seed.com", password: passwordHash, role: "ADMIN" },
          { name: "Membro Seed", username: "membroseed", role: "MEMBER" },
        ],
      },
    },
    include: { users: true },
  });

  const admin = company.users.find((u) => u.role === "ADMIN")!;
  const member = company.users.find((u) => u.role === "MEMBER")!;

  const project = await prisma.project.create({
    data: {
      name: "Projeto Seed",
      companyId: company.id,
      members: {
        create: [{ userId: member.id }],
      },
      tasks: {
        create: [
          { title: "Tarefa a fazer", status: "TODO", assigneeId: member.id },
          { title: "Tarefa em progresso", status: "IN_PROGRESS", assigneeId: member.id },
          { title: "Tarefa concluída", status: "DONE", assigneeId: admin.id },
        ],
      },
    },
  });

  console.log("Seed criado com sucesso:");
  console.log(`- Empresa: ${company.name}`);
  console.log(`- Admin: ${admin.email} / senha: 123456`);
  console.log(`- Membro: usuário ${member.username} / senha geral: 00000`);
  console.log(`- Projeto: ${project.name} (3 tarefas, uma em cada status)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
