import { prisma } from "../prisma";

export async function getDashboardSummary(companyId: string) {
  const totalProjects = await prisma.project.count({ where: { companyId } });

  const [todo, inProgress, done] = await Promise.all([
    prisma.task.count({ where: { status: "TODO", project: { companyId } } }),
    prisma.task.count({ where: { status: "IN_PROGRESS", project: { companyId } } }),
    prisma.task.count({ where: { status: "DONE", project: { companyId } } }),
  ]);

  return {
    totalProjects,
    totalTasks: todo + inProgress + done,
    todo,
    inProgress,
    done,
  };
}
