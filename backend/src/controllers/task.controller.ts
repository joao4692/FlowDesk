import { Request, Response } from "express";
import { createTask, listTasks, updateTaskStatus } from "../services/task.service";

export async function create(req: Request, res: Response) {
  const { title, projectId } = req.body;
  const companyId = req.user!.companyId;

  try {
    const task = await createTask(title, projectId, companyId);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Projeto não encontrado" });
  }
}

export async function list(req: Request, res: Response) {
  const { projectId } = req.query;
  const companyId = req.user!.companyId;

  try {
    const tasks = await listTasks(projectId as string, companyId);
    res.json(tasks);
  } catch (error) {
    res.status(404).json({ error: "Projeto não encontrado" });
  }
}

export async function updateStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;
  const companyId = req.user!.companyId;

  try {
    const task = await updateTaskStatus(id, status, companyId);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Tarefa não encontrada" });
  }
}
