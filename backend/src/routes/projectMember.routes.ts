import { Router } from "express";
import { add, list } from "../controllers/projectMember.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const projectMemberRoutes = Router({ mergeParams: true });

projectMemberRoutes.use(authMiddleware);

projectMemberRoutes.post("/", add);
projectMemberRoutes.get("/", list);
