import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";



export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; companyId: string };
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
