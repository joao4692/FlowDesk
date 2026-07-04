import { Request, Response } from "express";
import { createProject, listProjects } from "../services/project.service";

export async function create(req: Request, res: Response) {
  const { name } = req.body;
  const companyId = req.user!.companyId;

  const project = await createProject(name, companyId);

  res.json(project);
}

export async function list(req: Request, res: Response) {
  const companyId = req.user!.companyId;

  const projects = await listProjects(companyId);

  res.json(projects);
}
//evitamos clientes de uma empresa acessarem projetos de outra empresa, garantindo que cada usuário só possa ver os projetos da sua própria empresa.