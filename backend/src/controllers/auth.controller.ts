import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { name, email, password, companyId, role } = req.body;

  const user = await registerUser(name, email, password, companyId, role);

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
