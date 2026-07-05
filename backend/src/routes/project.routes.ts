import { Router } from "express";
import { create, list } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { projectMemberRoutes } from "./projectMember.routes";

export const projectRoutes = Router();

projectRoutes.use(authMiddleware);

projectRoutes.post("/", create);
projectRoutes.get("/", list);
projectRoutes.use("/:projectId/members", projectMemberRoutes);
