import { Router } from "express";
import { list, getById } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/", list);
userRoutes.get("/:id", getById);
