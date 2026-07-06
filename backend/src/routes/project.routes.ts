import { Router } from "express";
import { create, list, remove } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { projectMemberRoutes } from "./projectMember.routes";
import { requireRole } from "../middlewares/requireRole.middleware";


export const projectRoutes = Router();

projectRoutes.use(authMiddleware);
projectRoutes.post("/", requireRole("ADMIN"), create);
projectRoutes.get("/", list);
projectRoutes.delete("/:id", requireRole("ADMIN"), remove);
projectRoutes.use("/:projectId/members", projectMemberRoutes);
