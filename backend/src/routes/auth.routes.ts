import { Router } from "express";
import { register, login, registerCompany, loginAsMember, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/register-company", registerCompany);
authRoutes.post("/login", login);
authRoutes.post("/login-member", loginAsMember);
authRoutes.get("/me", authMiddleware, me);
