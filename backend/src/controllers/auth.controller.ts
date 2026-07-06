import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  registerCompanyAndAdmin,
  getCurrentUser,
  memberLogin,
} from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { name, email, password, companyId } = req.body;

  const user = await registerUser(name, email, password, companyId);

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
}
export async function registerCompany(req: Request, res: Response) {
  const { companyName, name, email, password } = req.body;

  const { user } = await registerCompanyAndAdmin(companyName, name, email, password);

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function loginAsMember(req: Request, res: Response) {
  const { username, accessPassword } = req.body;

  try {
    const token = await memberLogin(username, accessPassword);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
}

export async function me(req: Request, res: Response) {
  const user = await getCurrentUser(req.user!.userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}
