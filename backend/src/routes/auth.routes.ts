import { Router } from "express";
import { register, login, registerCompany } from "../controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/register-company", registerCompany);
authRoutes.post("/login", login);
