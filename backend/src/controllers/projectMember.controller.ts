import { Request, Response } from "express";
import { addMember, listMembers } from "../services/projectMember.service";

export async function add(req: Request, res: Response) {
  const projectId = req.params.projectId as string;
  const { userId } = req.body;
  const companyId = req.user!.companyId;

  try {
    const member = await addMember(projectId, userId, companyId);
    res.json(member);
  } catch (error) {
    res.status(404).json({ error: "Projeto ou usuário não encontrado" });
  }
}

export async function list(req: Request, res: Response) {
  const projectId = req.params.projectId as string;
  const companyId = req.user!.companyId;

  try {
    const members = await listMembers(projectId, companyId);
    res.json(members);
  } catch (error) {
    res.status(404).json({ error: "Projeto não encontrado" });
  }
}
