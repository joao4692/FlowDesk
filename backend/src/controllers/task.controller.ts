import { Request, Response } from "express";
import {
  createTask,
  listTasks,
  updateTaskStatus,
  updateTaskAssignee,
  deleteTask,
} from "../services/task.service";

export async function create(req: Request, res: Response) {
  const { title, projectId, assigneeId } = req.body;
  const companyId = req.user!.companyId;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Título da tarefa é obrigatório" });
  }

  try {
    const task = await createTask(title.trim(), projectId, companyId, assigneeId);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Projeto ou usuário não encontrado" });
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

export async function updateAssignee(req: Request, res: Response) {
  const id = req.params.id as string;
  const { assigneeId } = req.body;
  const companyId = req.user!.companyId;

  try {
    const task = await updateTaskAssignee(id, assigneeId ?? null, companyId);
    res.json(task);
  } catch (error) {
    if (error instanceof Error && error.message.includes("em andamento")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(404).json({ error: "Tarefa ou usuário não encontrado" });
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;
  const companyId = req.user!.companyId;

  try {
    await deleteTask(id, companyId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Tarefa não encontrada" });
  }
}
