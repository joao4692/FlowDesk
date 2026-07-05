import { Request, Response, NextFunction } from "express";

export function requireRole(role: "ADMIN" | "MEMBER") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
