import { Router } from "express";
import { summary } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/summary", summary);
