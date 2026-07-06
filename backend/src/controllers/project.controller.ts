import { Request, Response } from "express";
import { createProject, listProjects, deleteProject } from "../services/project.service";

export async function create(req: Request, res: Response) {
  const { name } = req.body;
  const companyId = req.user!.companyId;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Nome do projeto é obrigatório" });
  }

  const project = await createProject(name.trim(), companyId);

  res.json(project);
}

export async function list(req: Request, res: Response) {
  const companyId = req.user!.companyId;

  const projects = await listProjects(companyId);

  res.json(projects);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;
  const companyId = req.user!.companyId;

  try {
    await deleteProject(id, companyId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Projeto não encontrado" });
  }
}
//evitamos clientes de uma empresa acessarem projetos de outra empresa, garantindo que cada usuário só possa ver os projetos da sua própria empresa.