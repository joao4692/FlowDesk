import { Router } from "express";
import { create, list } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const projectRoutes = Router();

projectRoutes.use(authMiddleware);

projectRoutes.post("/", create);
projectRoutes.get("/", list);
