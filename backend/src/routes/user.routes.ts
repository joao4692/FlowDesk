import { Router } from "express";
import { list, getById, create } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.post("/", requireRole("ADMIN"), create);
userRoutes.get("/", list);
userRoutes.get("/:id", getById);
