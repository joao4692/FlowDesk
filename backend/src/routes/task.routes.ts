import { Router } from "express";
import { create, list, updateStatus, updateAssignee, remove } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const taskRoutes = Router();

taskRoutes.use(authMiddleware);

taskRoutes.post("/", create);
taskRoutes.get("/", list);
taskRoutes.patch("/:id", updateStatus);
taskRoutes.patch("/:id/assignee", updateAssignee);
taskRoutes.delete("/:id", remove);
