import { Request, Response } from "express";
import { getDashboardSummary } from "../services/dashboard.service";

export async function summary(req: Request, res: Response) {
  const companyId = req.user!.companyId;

  const data = await getDashboardSummary(companyId);

  res.json(data);
}
