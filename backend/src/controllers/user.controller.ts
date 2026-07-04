import { Request, Response } from "express";
import { listUsers, getUserById } from "../services/user.service";

export async function list(req: Request, res: Response) {
  const companyId = req.user!.companyId;

  const users = await listUsers(companyId);

  res.json(users);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id as string;

  const companyId = req.user!.companyId;

  const user = await getUserById(id, companyId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}
