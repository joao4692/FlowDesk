import { Router } from "express";
import { create, list } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const taskRoutes = Router();

taskRoutes.use(authMiddleware);

taskRoutes.post("/", create);
taskRoutes.get("/", list);
